package br.org.senai.lab.knowledge;

import br.org.senai.lab.DatabaseIsolationResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.specification.RequestSpecification;
import java.util.*;
import org.junit.jupiter.api.*;
import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Roteiro da seção 7 do complemento, automatizado sobre a API real (banco lab_platform_test):
 * Assistente honesto sem histórico → orçar (bloco A) → fechar acima do estimado (B + C) → formalizar →
 * aviso a quem assina → recomendação muda → faixa exige justificativa → demonstração apagável sem afetar o real.
 *
 * Cada teste cria um tipo de serviço próprio no vocabulário, para que o histórico dele comece vazio.
 */
@QuarkusTest
@QuarkusTestResource(DatabaseIsolationResource.class)
class KnowledgeCycleTest {
  private static final String PASSWORD="Lab@2026";
  private String admin, tecnico, validador;
  private String sizeId, causeId;

  @BeforeEach void setUp(){
    admin=login("admin@lab.local");tecnico=login("tecnico@lab.local");validador=login("validador@lab.local");
    sizeId=firstTerm("SIZE");causeId=firstTerm("DEVIATION_CAUSE");
  }

  @Test @SuppressWarnings("unchecked") void fullKnowledgeCycle(){
    String type=newServiceType("Ciclo");

    // Histórico zero: o Assistente não inventa faixa nem fator.
    var empty=assistant(tecnico,type);
    assertEquals(0,empty.get("n"));assertEquals("NONE",empty.get("tier"));
    assertNull(empty.get("range"));assertNull(empty.get("factor"));

    // Quem assina o assunto será avisado.
    as(tecnico).contentType("application/json").body(Map.of("termIds",List.of(type)))
      .put("/api/knowledge/subscriptions").then().statusCode(200);

    // Bloco A (orçado) → B + C (realizado acima do estimado, causa e lição) → validação.
    String record=createRecord(type,10,false,null);
    var closed=close(record,14,true);
    assertEquals("CLOSED",closed.get("status"));
    var lesson=((List<Map<String,Object>>)closed.get("lessons")).get(0);
    assertEquals("IN_VALIDATION",lesson.get("status"));

    // Lição em validação ainda não alimenta recomendação.
    assertEquals(0,assistant(tecnico,type).get("n"));

    // Técnico não formaliza; Validador sim.
    as(tecnico).contentType("application/json").body(Map.of("decision","FORMALIZE")).post("/api/knowledge/lessons/{code}/decision",lesson.get("code")).then().statusCode(403);
    formalize((String)lesson.get("code"));

    // O aviso chega a quem assina o assunto.
    var notices=as(tecnico).get("/api/knowledge/notices").then().statusCode(200).extract().as(Map.class);
    assertTrue(((List<Map<String,Object>>)notices.get("items")).stream()
      .anyMatch(n->lesson.get("code").equals(((Map<String,Object>)n.get("lesson")).get("code"))),"aviso da lição formalizada");

    // A recomendação mudou por causa do caso novo, e é rastreável até ele.
    var after=assistant(tecnico,type);
    assertEquals(1,after.get("n"));assertEquals("LOW",after.get("tier"));assertNull(after.get("range"),"com 1 a 4 casos não há faixa");
    assertTrue(((List<Map<String,Object>>)after.get("cases")).stream().anyMatch(c->record.equals(c.get("code"))));
  }

  @Test void serviceCannotCloseWithoutBlocksBAndC(){
    String type=newServiceType("Regra");
    String record=createRecord(type,8,false,null);
    // Sem causa de desvio (bloco C).
    as(tecnico).contentType("application/json").body(Map.of("actualHours",9,"actualDelivery","2026-10-10","rework",false,"scopeChange",false,
      "causeIds",List.of(),"lesson",Map.of("title","t","body","b"))).post("/api/knowledge/records/{code}/close",record).then().statusCode(400);
    // Sem lição aprendida.
    as(tecnico).contentType("application/json").body(Map.of("actualHours",9,"actualDelivery","2026-10-10","rework",false,"scopeChange",false,
      "causeIds",List.of(causeId))).post("/api/knowledge/records/{code}/close",record).then().statusCode(400);
    // Sem horas realizadas (bloco B).
    as(tecnico).contentType("application/json").body(Map.of("actualDelivery","2026-10-10","rework",false,"scopeChange",false,
      "causeIds",List.of(causeId),"lesson",Map.of("title","t","body","b"))).post("/api/knowledge/records/{code}/close",record).then().statusCode(400);
    assertEquals("OPEN",as(tecnico).get("/api/knowledge/records/{code}",record).then().statusCode(200).extract().path("status"));
  }

  @Test @SuppressWarnings("unchecked") void ladderGivesRangeAndRequiresJustificationOutsideIt(){
    String type=newServiceType("Escada");
    double[] actual={10,11,12,13,14};
    for(double hours:actual){String code=createRecord(type,10,false,null);var closed=close(code,hours,true);
      formalize((String)((List<Map<String,Object>>)closed.get("lessons")).get(0).get("code"));}

    var rec=assistant(tecnico,type);
    assertEquals(5,rec.get("n"));assertEquals("MEDIUM",rec.get("tier"));assertNull(rec.get("factor"),"fator só a partir de 15 casos");
    var range=(Map<String,Object>)rec.get("range");
    assertEquals(11.0,((Number)range.get("q1")).doubleValue());assertEquals(12.0,((Number)range.get("median")).doubleValue());assertEquals(13.0,((Number)range.get("q3")).doubleValue());

    // O sistema sugere, não decide: fora da faixa exige justificativa, que fica registrada.
    as(admin).contentType("application/json").body(recordBody(type,30,false,null)).post("/api/knowledge/records").then().statusCode(400);
    String justified=createRecord(type,30,false,"Peça com fixação especial combinada com o cliente.");
    assertEquals("Peça com fixação especial combinada com o cliente.",as(admin).get("/api/knowledge/records/{code}",justified).then().statusCode(200).extract().path("a.deviationJustification"));
  }

  @Test @SuppressWarnings("unchecked") void demonstrationIsSeparatedAndDisposable(){
    String type=newServiceType("Demo");
    String real=createRecord(type,10,false,null);
    formalize((String)((List<Map<String,Object>>)close(real,11,true).get("lessons")).get(0).get("code"));
    String demo=createRecord(type,10,true,null);
    formalize((String)((List<Map<String,Object>>)close(demo,40,true).get("lessons")).get(0).get("code"));

    var indicators=as(admin).get("/api/knowledge/indicators").then().statusCode(200).extract().as(Map.class);
    var realRows=(List<Map<String,Object>>)indicators.get("records");
    assertTrue(realRows.stream().noneMatch(r->Boolean.TRUE.equals(r.get("demo"))),"demo fora dos indicadores reais");
    assertTrue(realRows.stream().anyMatch(r->real.equals(r.get("code"))));
    var demoBlock=(Map<String,Object>)indicators.get("demo");
    assertNotNull(demoBlock);
    assertTrue(((List<Map<String,Object>>)demoBlock.get("records")).stream().anyMatch(r->demo.equals(r.get("code"))));
    var realBefore=withoutDemo(indicators);

    // Uma única ação apaga a demonstração; o histórico real e seus indicadores continuam íntegros.
    as(admin).delete("/api/admin/demo-data").then().statusCode(200);
    as(admin).get("/api/knowledge/records/{code}",demo).then().statusCode(404);
    as(admin).get("/api/knowledge/records/{code}",real).then().statusCode(200);
    var afterDelete=as(admin).get("/api/knowledge/indicators").then().statusCode(200).extract().as(Map.class);
    assertNull(afterDelete.get("demo"));
    assertEquals(realBefore,withoutDemo(afterDelete));
  }

  @Test void commercialValuesAreHiddenFromNonAdmins(){
    String type=newServiceType("Sigilo");
    String record=createRecord(type,10,false,null);
    assertNotNull(as(admin).get("/api/knowledge/records/{code}",record).then().statusCode(200).extract().path("a.proposedValue"));
    assertNull(as(tecnico).get("/api/knowledge/records/{code}",record).then().statusCode(200).extract().path("a.proposedValue"));
    // Bloco A nasce do orçamento, atribuição do Administrador.
    as(tecnico).contentType("application/json").body(recordBody(type,10,false,null)).post("/api/knowledge/records").then().statusCode(403);
  }

  // ---------------- helpers ----------------
  private static Map<String,Object> withoutDemo(Map<String,Object> indicators){var copy=new LinkedHashMap<>(indicators);copy.remove("demo");return copy;}

  private String login(String email){
    return given().contentType("application/json").body(Map.of("email",email,"password",PASSWORD))
      .post("/api/auth/login").then().statusCode(200).extract().cookie("lab_session");
  }
  private RequestSpecification as(String session){return given().cookie("lab_session",session);}

  @SuppressWarnings("unchecked") private String firstTerm(String classCode){
    var vocabulary=as(admin).get("/api/knowledge/vocabulary").then().statusCode(200).extract().as(Map.class);
    return ((List<Map<String,Object>>)vocabulary.get("classes")).stream().filter(c->classCode.equals(c.get("code")))
      .flatMap(c->((List<Map<String,Object>>)c.get("terms")).stream()).filter(t->Boolean.TRUE.equals(t.get("active")))
      .map(t->(String)t.get("id")).findFirst().orElseThrow();
  }
  private String newServiceType(String name){
    return as(admin).contentType("application/json").body(Map.of("classCode","SERVICE_TYPE","label","Teste "+name+" "+UUID.randomUUID().toString().substring(0,8),
      "description","Criado pelo teste automatizado","guidance","Roteiro de teste","active",true,"sortOrder",999))
      .post("/api/knowledge/vocabulary/terms").then().statusCode(200).extract().path("id");
  }
  private Map<String,Object> assistant(String session,String type){
    return as(session).contentType("application/json").body(Map.of("serviceTypeId",type,"sizeId",sizeId))
      .post("/api/knowledge/assistant").then().statusCode(200).extract().as(Map.class);
  }
  private Map<String,Object> recordBody(String type,double hours,boolean demo,String justification){
    var body=new LinkedHashMap<String,Object>();
    body.put("confidentiality","PUBLIC");body.put("clientCode","CLI-TESTE");body.put("serviceTypeId",type);body.put("sizeId",sizeId);
    body.put("estimatedHours",hours);body.put("estimatedCost",1000);body.put("proposedValue",1500);body.put("plannedDelivery","2026-10-10");
    body.put("assumptions","Premissa do teste automatizado");body.put("demo",demo);
    if(justification!=null)body.put("deviationJustification",justification);
    return body;
  }
  private String createRecord(String type,double hours,boolean demo,String justification){
    return as(admin).contentType("application/json").body(recordBody(type,hours,demo,justification))
      .post("/api/knowledge/records").then().statusCode(200).extract().path("code");
  }
  private Map<String,Object> close(String code,double hours,boolean submit){
    return as(tecnico).contentType("application/json").body(Map.of("actualHours",hours,"actualCost",1100,"billedValue",1500,"actualDelivery","2026-10-12",
      "rework",hours>10,"scopeChange",false,"causeIds",List.of(causeId),
      "lesson",Map.of("title","Lição do teste "+code,"body","Fixação levou mais tempo que o previsto.","subjectIds",List.of(),"submit",submit)))
      .post("/api/knowledge/records/{code}/close",code).then().statusCode(200).extract().as(Map.class);
  }
  private void formalize(String lessonCode){
    as(validador).contentType("application/json").body(Map.of("decision","FORMALIZE","note","Conferido."))
      .post("/api/knowledge/lessons/{code}/decision",lessonCode).then().statusCode(200);
  }
}
