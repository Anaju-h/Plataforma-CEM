package br.org.senai.lab.knowledge;

import br.org.senai.lab.entity.*;
import br.org.senai.lab.security.CurrentUser;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import static br.org.senai.lab.knowledge.Km.*;

/**
 * Evoluir: indicators computed automatically from blocks A and B of closed records.
 */
@ApplicationScoped
public class IndicatorService {
  @Inject EntityManager em;
  @Inject VocabularyService vocabulary;
  @Inject CurrentUser user;

  public static Map<String,Object> recordIndicators(KmRecordEntity r){
    Double schedule=null;
    if(r.plannedDelivery!=null&&r.actualDelivery!=null&&r.estimatedAt!=null){
      long planned=ChronoUnit.DAYS.between(r.estimatedAt.toLocalDate(),r.plannedDelivery);
      long actual=ChronoUnit.DAYS.between(r.estimatedAt.toLocalDate(),r.actualDelivery);
      if(planned>0)schedule=(actual-planned)/(double)planned;
    }
    return map("effortDeviation",Stats.round(Stats.deviation(r.estimatedHours,r.actualHours),3),
      "costDeviation",Stats.round(Stats.deviation(r.estimatedCost,r.actualCost),3),
      "scheduleDeviation",Stats.round(schedule,3),
      "budgetedMargin",Stats.round(Stats.margin(r.proposedValue,r.estimatedCost),3),
      "realizedMargin",Stats.round(Stats.margin(r.billedValue,r.actualCost),3));
  }

  /**
   * Indicadores do histórico REAL. Registros de demonstração nunca entram nesses números (regra 3 do
   * complemento): são resumidos à parte, em "demo", só para a apresentação, e somem quando a demonstração é apagada.
   */
  @Transactional public Map<String,Object> indicators(){
    var records=em.createQuery("from KmRecordEntity r where r.status='CLOSED'"+(user.atLeast("VALIDADOR")?"":" and r.confidentiality='PUBLIC'")+" order by r.closedAt",KmRecordEntity.class).getResultList();
    var terms=vocabulary.terms();double tolerance=vocabulary.tolerance();
    var real=records.stream().filter(r->!r.demo).toList();
    var demo=records.stream().filter(r->r.demo).toList();
    var result=summarize(real,terms,tolerance);
    result.put("demo",demo.isEmpty()?null:summarize(demo,terms,tolerance));
    if(!user.atLeast("ADMIN"))hideCommercial(result);
    return result;
  }

  static Map<String,Object> summarize(List<KmRecordEntity> records,Map<UUID,KmTermEntity> terms,double tolerance){
    Map<UUID,List<KmRecordEntity>> byType=records.stream().collect(Collectors.groupingBy(r->r.serviceTypeId,LinkedHashMap::new,Collectors.toList()));
    List<Map<String,Object>> types=new ArrayList<>();
    for(var entry:byType.entrySet()){
      var list=entry.getValue();var t=terms.get(entry.getKey());
      List<Double> actual=list.stream().map(r->r.actualHours.doubleValue()).toList();
      List<Double> ratios=list.stream().map(r->r.actualHours.doubleValue()/r.estimatedHours.doubleValue()).toList();
      long within=list.stream().filter(r->withinTolerance(r,tolerance)).count();
      Map<UUID,Long> causes=list.stream().flatMap(r->r.causes.stream()).collect(Collectors.groupingBy(c->c,Collectors.counting()));
      List<Map<String,Object>> evolution=new ArrayList<>();
      for(int i=1;i<=list.size();i++){
        var slice=ratios.subList(0,i);
        evolution.add(map("n",i,"factor",Stats.round(Stats.median(slice),3),"closedAt",list.get(i-1).closedAt,"code",list.get(i-1).code));
      }
      types.add(map("serviceType",t==null?"?":t.label,"serviceTypeId",entry.getKey(),"n",list.size(),
        "assertiveness",Stats.round(100.0*within/list.size(),1),
        "effort",map("q1",Stats.round(Stats.quantile(actual,0.25),1),"median",Stats.round(Stats.median(actual),1),"q3",Stats.round(Stats.quantile(actual,0.75),1)),
        "correctionFactor",Stats.round(Stats.median(ratios),3),
        "budgetedMargin",medianOf(list.stream().map(r->Stats.margin(r.proposedValue,r.estimatedCost)).toList()),
        "realizedMargin",medianOf(list.stream().map(r->Stats.margin(r.billedValue,r.actualCost)).toList()),
        "causes",causes.entrySet().stream().sorted(Map.Entry.<UUID,Long>comparingByValue().reversed())
          .map(e->map("label",terms.containsKey(e.getKey())?terms.get(e.getKey()).label:"?","count",e.getValue())).toList(),
        "evolution",evolution));
    }
    types.sort(Comparator.comparing((Map<String,Object> m)->(Integer)m.get("n")).reversed());
    long within=records.stream().filter(r->withinTolerance(r,tolerance)).count();
    var recordRows=records.stream().sorted(Comparator.comparing((KmRecordEntity r)->r.closedAt).reversed()).limit(100).map(r->{
      var row=map("code",r.code,"demo",r.demo,"serviceType",terms.containsKey(r.serviceTypeId)?terms.get(r.serviceTypeId).label:"?","estimatedHours",r.estimatedHours,"actualHours",r.actualHours,"closedAt",r.closedAt);
      row.putAll(recordIndicators(r));return row;}).toList();
    return map("tolerance",tolerance,"total",records.size(),
      "assertiveness",records.isEmpty()?null:Stats.round(100.0*within/records.size(),1),
      "reworkShare",records.isEmpty()?null:Stats.round(100.0*records.stream().filter(r->Boolean.TRUE.equals(r.rework)).count()/records.size(),1),
      "scopeChangeShare",records.isEmpty()?null:Stats.round(100.0*records.stream().filter(r->Boolean.TRUE.equals(r.scopeChange)).count()/records.size(),1),
      "types",types,"records",recordRows);
  }

  /** |desvio de esforço| dentro da tolerância; registros sem horas comparáveis contam como fora. */
  static boolean withinTolerance(KmRecordEntity r,double tolerance){
    Double deviation=Stats.deviation(r.estimatedHours,r.actualHours);
    return deviation!=null&&Math.abs(deviation)<=tolerance;
  }

  private static Double medianOf(List<Double> values){
    var present=values.stream().filter(Objects::nonNull).toList();
    return present.isEmpty()?null:Stats.round(Stats.median(present),3);
  }
}
