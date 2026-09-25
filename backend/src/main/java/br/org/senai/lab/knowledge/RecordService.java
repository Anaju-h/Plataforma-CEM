package br.org.senai.lab.knowledge;

import br.org.senai.lab.entity.*;
import br.org.senai.lab.security.CurrentUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import static br.org.senai.lab.knowledge.Km.*;

/**
 * Criar: Service Record. Block A is filled when the quote is sent; blocks B and C when the service closes.
 * Core rule: a record cannot be closed (nor its project completed) without blocks B and C.
 */
@ApplicationScoped
public class RecordService {
  @Inject EntityManager em;
  @Inject VocabularyService vocabulary;
  @Inject AssistantService assistant;
  @Inject LessonService lessons;
  @Inject CurrentUser user;
  @Inject ObjectMapper json;

  public record Create(String confidentiality,String quoteCode,String clientCode,UUID serviceTypeId,UUID sizeId,UUID materialId,UUID complexityId,
    UUID featureCountId,UUID gdtId,List<UUID> resourceIds,BigDecimal estimatedHours,BigDecimal estimatedCost,BigDecimal proposedValue,LocalDate plannedDelivery,
    String assumptions,String deviationJustification,Boolean demo) {}
  public record LessonInput(String title,String body,List<UUID> subjectIds,String confidentiality,Boolean submit) {}
  public record Close(BigDecimal actualHours,BigDecimal actualCost,BigDecimal billedValue,LocalDate actualDelivery,Boolean rework,Boolean scopeChange,List<UUID> causeIds,LessonInput lesson) {}

  // ---------------- block A ----------------
  @Transactional public Map<String,Object> create(Create in){
    // Bloco A nasce do orçamento, que é atribuição do Administrador.
    user.requireAtLeast("ADMIN");
    if(in==null)throw bad("Dados ausentes.");
    vocabulary.require(in.serviceTypeId(),"SERVICE_TYPE",true);vocabulary.require(in.sizeId(),"SIZE",true);
    vocabulary.require(in.materialId(),"MATERIAL",false);vocabulary.require(in.complexityId(),"COMPLEXITY",false);
    vocabulary.require(in.featureCountId(),"FEATURE_COUNT",false);vocabulary.require(in.gdtId(),"GDT",false);
    vocabulary.requireAll(in.resourceIds(),"RESOURCE");
    if(in.estimatedHours()==null||in.estimatedHours().signum()<=0)throw bad("Informe o esforço estimado em horas.");
    if(blank(in.assumptions()))throw bad("Registre as premissas assumidas na estimativa.");
    positive(in.estimatedCost(),"custo estimado");positive(in.proposedValue(),"valor proposto");

    // The server recomputes the recommendation instead of trusting the browser.
    var rec=assistant.recommend(new AssistantService.Query(in.serviceTypeId(),in.sizeId(),in.materialId(),in.complexityId(),in.featureCountId(),in.gdtId(),in.estimatedHours().doubleValue()));
    String justification=trim(in.deviationJustification());
    @SuppressWarnings("unchecked") var range=(Map<String,Object>)rec.get("range");
    boolean outside=false;
    if(range!=null){
      double h=in.estimatedHours().doubleValue();
      outside=h<((Number)range.get("q1")).doubleValue()||h>((Number)range.get("q3")).doubleValue();
      if(outside&&justification==null)throw bad("A estimativa está fora da faixa provável ("+range.get("q1")+"–"+range.get("q3")+" h). Justifique a diferença: a justificativa também é conhecimento.");
    }
    var r=new KmRecordEntity();r.id=UUID.randomUUID();r.code=code("REG",next("km_record_seq"));
    r.demo=Boolean.TRUE.equals(in.demo())||quoteIsDemo(in.quoteCode());r.confidentiality=confidentiality(in.confidentiality());r.status="OPEN";r.quoteCode=trim(in.quoteCode());r.clientCode=trim(in.clientCode());
    r.serviceTypeId=in.serviceTypeId();r.sizeId=in.sizeId();r.materialId=in.materialId();r.complexityId=in.complexityId();r.featureCountId=in.featureCountId();r.gdtId=in.gdtId();
    if(in.resourceIds()!=null)r.resources.addAll(in.resourceIds());
    r.estimatedHours=in.estimatedHours();r.estimatedCost=in.estimatedCost();r.proposedValue=in.proposedValue();r.plannedDelivery=in.plannedDelivery();
    r.assumptions=in.assumptions().trim();r.estimatedBy=user.name();r.estimatedAt=now();r.deviationJustification=justification;
    r.recommendationJson=write(map("n",rec.get("n"),"tier",rec.get("tier"),"range",range,"factor",rec.get("factor"),"outsideRange",outside,
      "caseCodes",((List<?>)rec.get("cases")).stream().map(c->((Map<?,?>)c).get("code")).toList()));
    r.createdAt=r.estimatedAt;r.updatedAt=r.createdAt;
    em.persist(r);
    return view(r);
  }

  // ---------------- blocks B + C ----------------
  @Transactional public Map<String,Object> close(String code,Close in){
    user.requireAtLeast("TECNICO");
    var r=find(code,true);
    if("CLOSED".equals(r.status))throw conflict("Este registro já foi fechado.");
    if(in==null)throw bad("Dados ausentes.");
    if(in.actualHours()==null||in.actualHours().signum()<=0)throw bad("Bloco B: informe o esforço realmente gasto (horas).");
    if(in.actualDelivery()==null)throw bad("Bloco B: informe a data real de entrega.");
    if(in.rework()==null||in.scopeChange()==null)throw bad("Bloco B: informe se houve retrabalho e se houve mudança de escopo.");
    positive(in.actualCost(),"custo real");positive(in.billedValue(),"valor faturado");
    if(in.causeIds()==null||in.causeIds().isEmpty())throw bad("Bloco C: selecione ao menos uma causa de desvio (use \"Sem desvio relevante\" quando for o caso).");
    vocabulary.requireAll(in.causeIds(),"DEVIATION_CAUSE");
    var lesson=in.lesson();
    if(lesson==null||blank(lesson.title())||blank(lesson.body()))throw bad("Bloco C: registre a lição aprendida (título e descrição).");
    r.actualHours=in.actualHours();r.actualCost=in.actualCost();r.billedValue=in.billedValue();r.actualDelivery=in.actualDelivery();
    r.rework=in.rework();r.scopeChange=in.scopeChange();r.causes.clear();r.causes.addAll(in.causeIds());
    r.status="CLOSED";r.closedBy=user.name();r.closedAt=now();r.updatedAt=r.closedAt;
    Set<UUID> subjects=new LinkedHashSet<>();subjects.add(r.serviceTypeId);subjects.add(r.sizeId);
    if(lesson.subjectIds()!=null)subjects.addAll(lesson.subjectIds());subjects.addAll(in.causeIds());
    lessons.createForRecord(r,lesson.title(),lesson.body(),subjects,lesson.confidentiality()==null?r.confidentiality:lesson.confidentiality(),Boolean.TRUE.equals(lesson.submit()));
    var view=view(r);if(!user.atLeast("ADMIN"))hideCommercial(view);return view;
  }

  // ---------------- queries ----------------
  @Transactional public List<Map<String,Object>> list(String status,String quoteCode){
    var q=em.createQuery("from KmRecordEntity r where 1=1"+(user.atLeast("VALIDADOR")?"":" and r.confidentiality='PUBLIC'")
      +(blank(status)?"":" and r.status=:status")+(blank(quoteCode)?"":" and r.quoteCode=:quote")+" order by r.createdAt desc",KmRecordEntity.class);
    if(!blank(status))q.setParameter("status",status);
    if(!blank(quoteCode))q.setParameter("quote",quoteCode);
    var terms=vocabulary.terms();
    return q.getResultList().stream().map(r->summary(r,terms)).toList();
  }
  @Transactional public Map<String,Object> get(String code){var view=view(find(code,false));if(!user.atLeast("ADMIN"))hideCommercial(view);return view;}

  /** Rule used by project completion: a closed record (B + C) must exist for the quote. */
  @Transactional public boolean hasClosedRecordForQuote(String quoteCode){
    return !em.createQuery("select r.id from KmRecordEntity r where r.quoteCode=:q and r.status='CLOSED'",UUID.class).setParameter("q",quoteCode).setMaxResults(1).getResultList().isEmpty();
  }

  private boolean quoteIsDemo(String quoteCode){
    if(blank(quoteCode))return false;
    return !em.createQuery("select q.id from QuoteEntity q where q.quoteCode=:c and q.request.source='demo'",UUID.class).setParameter("c",quoteCode.trim()).setMaxResults(1).getResultList().isEmpty();
  }
  KmRecordEntity find(String code,boolean lock){
    var q=em.createQuery("from KmRecordEntity where code=:c",KmRecordEntity.class).setParameter("c",code);
    if(lock)q.setLockMode(LockModeType.PESSIMISTIC_WRITE);
    var r=q.getResultStream().findFirst().orElseThrow(Km::notFound);
    if("RESTRICTED".equals(r.confidentiality)&&!user.atLeast("VALIDADOR"))throw notFound();
    return r;
  }

  private Map<String,Object> summary(KmRecordEntity r,Map<UUID,KmTermEntity> terms){
    return map("code",r.code,"demo",r.demo,"status",r.status,"confidentiality",r.confidentiality,"quoteCode",r.quoteCode,"clientCode",r.clientCode,
      "serviceType",label(terms,r.serviceTypeId),"size",label(terms,r.sizeId),"estimatedHours",r.estimatedHours,"actualHours",r.actualHours,
      "deviation",Stats.round(Stats.deviation(r.estimatedHours,r.actualHours),3),"estimatedBy",r.estimatedBy,"estimatedAt",r.estimatedAt,"closedAt",r.closedAt);
  }

  Map<String,Object> view(KmRecordEntity r){
    var terms=vocabulary.terms();
    var view=summary(r,terms);
    view.put("a",map("serviceType",term(terms,r.serviceTypeId),"size",term(terms,r.sizeId),"material",term(terms,r.materialId),"complexity",term(terms,r.complexityId),
      "featureCount",term(terms,r.featureCountId),"gdt",term(terms,r.gdtId),"resources",r.resources.stream().map(id->term(terms,id)).toList(),
      "estimatedHours",r.estimatedHours,"estimatedCost",r.estimatedCost,"proposedValue",r.proposedValue,"plannedDelivery",r.plannedDelivery,
      "assumptions",r.assumptions,"estimatedBy",r.estimatedBy,"estimatedAt",r.estimatedAt,"recommendation",read(r.recommendationJson),"deviationJustification",r.deviationJustification));
    view.put("b","CLOSED".equals(r.status)?map("actualHours",r.actualHours,"actualCost",r.actualCost,"billedValue",r.billedValue,"actualDelivery",r.actualDelivery,
      "rework",r.rework,"scopeChange",r.scopeChange,"closedBy",r.closedBy,"closedAt",r.closedAt):null);
    view.put("causes",r.causes.stream().map(id->term(terms,id)).toList());
    view.put("indicators",IndicatorService.recordIndicators(r));
    view.put("lessons",lessons.forRecord(r.id));
    // Horas apontadas nas tarefas do projeto vinculado: base para o bloco B (realizado).
    if(!blank(r.quoteCode)){
      var project=em.createQuery("select p.projectCode from ProjectEntity p where p.quote.quoteCode=:q",String.class).setParameter("q",r.quoteCode).getResultStream().findFirst().orElse(null);
      view.put("projectCode",project);
      if(project!=null){
        BigDecimal logged=em.createQuery("select coalesce(sum(e.hours),0) from ProjectTimeEntryEntity e where e.task.project.projectCode=:p",BigDecimal.class).setParameter("p",project).getSingleResult();
        view.put("loggedHours",logged);
      }
    }
    return view;
  }

  private static String label(Map<UUID,KmTermEntity> terms,UUID id){var t=id==null?null:terms.get(id);return t==null?null:t.label;}
  private static Map<String,Object> term(Map<UUID,KmTermEntity> terms,UUID id){var t=id==null?null:terms.get(id);return t==null?null:map("id",t.id,"label",t.label);}
  private static void positive(BigDecimal value,String field){if(value!=null&&value.signum()<0)throw bad("O "+field+" não pode ser negativo.");}
  static String confidentiality(String value){if(value==null)return "PUBLIC";if(!Set.of("PUBLIC","RESTRICTED").contains(value))throw bad("Classificação de sigilo inválida.");return value;}
  private long next(String sequence){return ((Number)em.createNativeQuery("SELECT NEXT VALUE FOR "+sequence).getSingleResult()).longValue();}
  private String write(Object value){try{return json.writeValueAsString(value);}catch(Exception e){throw new IllegalStateException(e);}}
  private Object read(String value){try{return value==null?null:json.readValue(value,Object.class);}catch(Exception e){return null;}}
}
