package br.org.senai.lab.knowledge;

import br.org.senai.lab.entity.KmRecordEntity;
import br.org.senai.lab.entity.KmTermEntity;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Regras do complemento que não dependem de banco:
 * escada de confiança do Assistente (4.5), indicadores (4.4) e separação da demonstração (5, regra 3).
 */
class KnowledgeRulesTest {
  private static final UUID MMC=UUID.randomUUID(), SCAN=UUID.randomUUID(), FIXATION=UUID.randomUUID();
  private static final Map<UUID,KmTermEntity> TERMS=Map.of(MMC,term(MMC,"Medição dimensional em MMC"),SCAN,term(SCAN,"Digitalização 3D"),FIXATION,term(FIXATION,"Fixação mais complexa que o previsto"));
  private static int sequence=0;

  @Test void assistantNeverPretendsToKnow(){
    assertEquals("NONE",AssistantService.tier(0));
    assertEquals("LOW",AssistantService.tier(1));
    assertEquals("LOW",AssistantService.tier(4));
    assertEquals("MEDIUM",AssistantService.tier(5));
    assertEquals("MEDIUM",AssistantService.tier(14));
    assertEquals("HIGH",AssistantService.tier(15));
  }

  @Test void toleranceUsesAbsoluteEffortDeviation(){
    assertTrue(IndicatorService.withinTolerance(record(MMC,10,11.5,false),0.15));
    assertTrue(IndicatorService.withinTolerance(record(MMC,10,8.5,false),0.15));
    assertFalse(IndicatorService.withinTolerance(record(MMC,10,12,false),0.15));
    var withoutHours=record(MMC,10,10,false);withoutHours.actualHours=null;
    assertFalse(IndicatorService.withinTolerance(withoutHours,0.15),"sem horas comparáveis conta como fora da faixa");
  }

  @Test @SuppressWarnings("unchecked") void indicatorsPerServiceType(){
    var records=List.of(record(MMC,10,10,false),record(MMC,10,12,false),record(MMC,10,14,false),record(MMC,10,20,false),record(SCAN,8,8,false));
    var summary=IndicatorService.summarize(records,TERMS,0.15);
    assertEquals(5,summary.get("total"));
    assertEquals(40.0,summary.get("assertiveness"),"2 de 5 dentro de ±15%");
    var types=(List<Map<String,Object>>)summary.get("types");
    var mmc=types.get(0);
    assertEquals("Medição dimensional em MMC",mmc.get("serviceType"));
    assertEquals(4,mmc.get("n"));
    assertEquals(25.0,mmc.get("assertiveness"));
    assertEquals(1.3,mmc.get("correctionFactor"),"mediana de 1,0 / 1,2 / 1,4 / 2,0");
    var effort=(Map<String,Object>)mmc.get("effort");
    assertEquals(13.0,effort.get("median"));
    assertEquals(11.5,effort.get("q1"));
    assertEquals(15.5,effort.get("q3"));
    assertEquals(4,((List<?>)mmc.get("evolution")).size(),"o fator é recalculado a cada caso fechado");
    var causes=(List<Map<String,Object>>)mmc.get("causes");
    assertEquals("Fixação mais complexa que o previsto",causes.get(0).get("label"));
  }

  @Test @SuppressWarnings("unchecked") void demonstrationNeverEntersRealIndicators(){
    var real=List.of(record(MMC,10,10,false),record(MMC,10,11,false));
    var demo=List.of(record(MMC,10,30,true),record(MMC,10,40,true),record(MMC,10,50,true));
    var all=new ArrayList<KmRecordEntity>();all.addAll(real);all.addAll(demo);

    var realOnly=IndicatorService.summarize(all.stream().filter(r->!r.demo).toList(),TERMS,0.15);
    assertEquals(2,realOnly.get("total"));
    assertEquals(100.0,realOnly.get("assertiveness"));
    assertTrue(((List<Map<String,Object>>)realOnly.get("records")).stream().noneMatch(r->Boolean.TRUE.equals(r.get("demo"))));

    // Apagar a demonstração não muda nada no histórico real.
    assertEquals(realOnly,IndicatorService.summarize(real,TERMS,0.15));
  }

  @Test void emptyHistoryDoesNotBreak(){
    var summary=IndicatorService.summarize(List.of(),TERMS,0.15);
    assertEquals(0,summary.get("total"));
    assertNull(summary.get("assertiveness"));
    assertEquals(List.of(),summary.get("types"));
  }

  private static KmTermEntity term(UUID id,String label){var t=new KmTermEntity();t.id=id;t.label=label;return t;}

  private static KmRecordEntity record(UUID type,double estimated,double actual,boolean demo){
    var r=new KmRecordEntity();r.id=UUID.randomUUID();r.code="REG-T"+(++sequence);r.demo=demo;r.confidentiality="PUBLIC";r.status="CLOSED";
    r.serviceTypeId=type;r.sizeId=UUID.randomUUID();r.estimatedHours=BigDecimal.valueOf(estimated);r.actualHours=BigDecimal.valueOf(actual);
    r.estimatedCost=new BigDecimal("1000");r.proposedValue=new BigDecimal("1500");r.actualCost=new BigDecimal("1100");r.billedValue=new BigDecimal("1500");
    r.estimatedAt=LocalDateTime.of(2026,1,1,8,0);r.closedAt=r.estimatedAt.plusDays(sequence);r.rework=actual>estimated*1.3;r.scopeChange=false;
    if(actual>estimated)r.causes.add(FIXATION);
    return r;
  }
}
