package br.org.senai.lab.knowledge;

import br.org.senai.lab.entity.*;
import br.org.senai.lab.security.CurrentUser;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import static br.org.senai.lab.knowledge.Km.*;

/**
 * Aplicar: the Budget Assistant. Statistical and explainable, never a black box.
 * Similar case = closed Service Record with the same service type AND the same size (porte),
 * whose lesson was FORMALIZED by a Validator. Other characteristics only rank the cases.
 * Confidence ladder: 0 cases → estimation script only; 1–4 → cases one by one; 5–14 → probable range
 * (median and quartiles of realized hours); 15+ → range + correction factor.
 */
@ApplicationScoped
public class AssistantService {
  public static final int MEDIUM=5, HIGH=15;
  @Inject EntityManager em;
  @Inject VocabularyService vocabulary;
  @Inject CurrentUser user;

  public record Query(UUID serviceTypeId,UUID sizeId,UUID materialId,UUID complexityId,UUID featureCountId,UUID gdtId,Double estimateHours) {}

  @Transactional public Map<String,Object> recommend(Query q){
    if(q==null||q.serviceTypeId()==null||q.sizeId()==null)throw bad("Selecione ao menos o tipo de serviço e o porte da peça.");
    var terms=vocabulary.terms();
    var serviceType=terms.get(q.serviceTypeId());var size=terms.get(q.sizeId());
    if(serviceType==null||!"SERVICE_TYPE".equals(serviceType.classCode)||size==null||!"SIZE".equals(size.classCode))throw bad("Tipo de serviço ou porte inválido.");
    boolean restricted=user.atLeast("VALIDADOR");

    var candidates=em.createQuery("from KmRecordEntity r where r.status='CLOSED' and r.serviceTypeId=:s and r.sizeId=:z"
        +(restricted?"":" and r.confidentiality='PUBLIC'")+" order by r.closedAt desc",KmRecordEntity.class)
      .setParameter("s",q.serviceTypeId()).setParameter("z",q.sizeId()).getResultList();
    Map<UUID,List<KmLessonEntity>> lessonsByRecord=candidates.isEmpty()?Map.of():em.createQuery("from KmLessonEntity l where l.recordId in :ids",KmLessonEntity.class)
      .setParameter("ids",candidates.stream().map(r->r.id).toList()).getResultList().stream().collect(Collectors.groupingBy(l->l.recordId));

    List<KmRecordEntity> cases=new ArrayList<>();int awaiting=0,superseded=0;
    for(var r:candidates){
      var statuses=lessonsByRecord.getOrDefault(r.id,List.of()).stream().map(l->l.status).collect(Collectors.toSet());
      if(statuses.contains("FORMALIZED"))cases.add(r);
      else if(statuses.contains("SUPERSEDED"))superseded++;
      else awaiting++;
    }
    int n=cases.size();
    String tier=n==0?"NONE":n<MEDIUM?"LOW":n<HIGH?"MEDIUM":"HIGH";
    Map<String,Object> confidence=switch(tier){
      case "NONE"->map("level","NONE","label","Sem histórico","message","Nenhum caso parecido formalizado. O Assistente não inventa faixa: siga o roteiro de estimativa abaixo e registre suas premissas.");
      case "LOW"->map("level","LOW","label","Confiança baixa","message","Poucos casos ("+n+"). Sem faixa e sem fator: compare-os um a um antes de estimar.");
      case "MEDIUM"->map("level","MEDIUM","label","Confiança média","message","Faixa provável calculada a partir de "+n+" casos (mediana e quartis das horas realizadas). Fator de correção só a partir de "+HIGH+" casos.");
      default->map("level","HIGH","label","Confiança alta","message","Faixa provável e fator de correção calculados a partir de "+n+" casos formalizados.");
    };

    List<UUID> selected=new ArrayList<>();
    for(UUID id:new UUID[]{q.materialId(),q.complexityId(),q.featureCountId(),q.gdtId()})if(id!=null)selected.add(id);
    Function<KmRecordEntity,Integer> similarity=r->(int)selected.stream().filter(id->id.equals(r.materialId)||id.equals(r.complexityId)||id.equals(r.featureCountId)||id.equals(r.gdtId)).count();

    List<Map<String,Object>> caseViews=cases.stream().sorted(Comparator.comparing(similarity).reversed().thenComparing(r->r.closedAt,Comparator.reverseOrder()))
      .map(r->caseView(r,terms,similarity.apply(r),selected.size(),lessonsByRecord.getOrDefault(r.id,List.of()))).toList();

    Map<String,Object> range=null;Map<String,Object> factor=null;
    List<Double> actual=cases.stream().map(r->r.actualHours.doubleValue()).toList();
    if(n>=MEDIUM){
      range=map("q1",Stats.round(Stats.quantile(actual,0.25),1),"median",Stats.round(Stats.median(actual),1),"q3",Stats.round(Stats.quantile(actual,0.75),1),
        "estimatedMedian",Stats.round(Stats.median(cases.stream().map(r->r.estimatedHours.doubleValue()).toList()),1),"unit","h");
    }
    if(n>=HIGH){
      double f=Stats.median(cases.stream().map(r->r.actualHours.doubleValue()/r.estimatedHours.doubleValue()).toList());
      factor=map("value",Stats.round(f,2),"percent",Stats.round((f-1)*100,1),
        "explanation",f>=1?"Este tipo de serviço vem sendo subestimado: o realizado fica, na mediana, "+Stats.round((f-1)*100,1)+"% acima do orçado."
                         :"Este tipo de serviço vem sendo superestimado: o realizado fica, na mediana, "+Stats.round((1-f)*100,1)+"% abaixo do orçado.",
        "corrected",q.estimateHours()==null?null:Stats.round(q.estimateHours()*f,1));
    }
    double tolerance=vocabulary.tolerance();
    Double assertiveness=n==0?null:Stats.round(100.0*cases.stream().filter(r->Math.abs(Stats.deviation(r.estimatedHours,r.actualHours))<=tolerance).count()/n,1);

    Map<UUID,Long> causeCount=cases.stream().flatMap(r->r.causes.stream()).collect(Collectors.groupingBy(c->c,Collectors.counting()));
    var causes=causeCount.entrySet().stream().sorted(Map.Entry.<UUID,Long>comparingByValue().reversed())
      .map(e->map("id",e.getKey(),"label",label(terms,e.getKey()),"count",e.getValue())).toList();

    Set<UUID> subjectFilter=new LinkedHashSet<>(selected);subjectFilter.add(q.serviceTypeId());subjectFilter.add(q.sizeId());
    var lessons=em.createQuery("from KmLessonEntity l where l.status='FORMALIZED'"+(restricted?"":" and l.confidentiality='PUBLIC'"),KmLessonEntity.class).getResultList().stream()
      .filter(l->l.subjects.stream().anyMatch(subjectFilter::contains))
      .sorted(Comparator.comparing((KmLessonEntity l)->l.subjects.stream().filter(subjectFilter::contains).count()).reversed().thenComparing(l->l.validatedAt,Comparator.nullsLast(Comparator.reverseOrder())))
      .limit(8).map(l->map("code",l.code,"title",l.title,"body",l.body,"confidentiality",l.confidentiality,"validatedBy",l.validatedBy,"validatedAt",l.validatedAt,
        "subjects",l.subjects.stream().map(id->label(terms,id)).toList(),"matches",l.subjects.stream().filter(subjectFilter::contains).map(id->label(terms,id)).toList())).toList();

    Map<String,Object> rule=map("similarity","Mesmo tipo de serviço e mesmo porte; somente registros fechados com lição formalizada. As demais características ordenam os casos.",
      "range","Faixa = 1º quartil a 3º quartil das horas realizadas; valor central = mediana.",
      "factor","Fator = mediana de (horas realizadas ÷ horas orçadas).",
      "ladder","0 casos: roteiro · 1–4: casos um a um · 5–14: faixa · 15+: faixa e fator.");

    return map("serviceType",label(terms,q.serviceTypeId()),"size",label(terms,q.sizeId()),"n",n,"demoCases",cases.stream().filter(c->c.demo).count(),"tier",tier,"confidence",confidence,
      "range",range,"factor",factor,"assertiveness",assertiveness,"tolerance",tolerance,"causes",causes,"cases",caseViews,"lessons",lessons,
      "guidance",serviceType.guidance,"excluded",map("awaitingValidation",awaiting,"superseded",superseded),"rule",rule);
  }

  private static String label(Map<UUID,KmTermEntity> terms,UUID id){var t=id==null?null:terms.get(id);return t==null?null:t.label;}

  private static Map<String,Object> caseView(KmRecordEntity r,Map<UUID,KmTermEntity> terms,int similarity,int of,List<KmLessonEntity> lessons){
    var lesson=lessons.stream().filter(l->"FORMALIZED".equals(l.status)).findFirst().orElse(null);
    return map("code",r.code,"demo",r.demo,"confidentiality",r.confidentiality,"quoteCode",r.quoteCode,"clientCode",r.clientCode,
      "material",label(terms,r.materialId),"complexity",label(terms,r.complexityId),"featureCount",label(terms,r.featureCountId),"gdt",label(terms,r.gdtId),
      "estimatedHours",r.estimatedHours,"actualHours",r.actualHours,"deviation",Stats.round(Stats.deviation(r.estimatedHours,r.actualHours),3),
      "rework",r.rework,"scopeChange",r.scopeChange,"causes",r.causes.stream().map(id->label(terms,id)).toList(),
      "similarity",similarity,"similarityOf",of,"closedAt",r.closedAt,"estimatedBy",r.estimatedBy,
      "lesson",lesson==null?null:map("code",lesson.code,"title",lesson.title));
  }
}
