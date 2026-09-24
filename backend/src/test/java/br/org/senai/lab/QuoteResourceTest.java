package br.org.senai.lab;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.common.QuarkusTestResource;
import jakarta.inject.Inject;
import javax.sql.DataSource;
import org.junit.jupiter.api.*;
import java.sql.*;
import java.util.*;
import java.util.concurrent.*;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(DatabaseIsolationResource.class)
class QuoteResourceTest {
  @Inject DataSource dataSource;
  @BeforeEach void verifyActualDatabase() throws Exception {
    try(var connection=dataSource.getConnection();var statement=connection.createStatement();var rs=statement.executeQuery("SELECT DB_NAME()")) {
      assertTrue(rs.next());assertEquals("lab_platform_test",rs.getString(1),"A suíte só pode usar o banco de teste");
    }
  }
  String request(boolean ready) {
    String id=given().contentType("application/json").body("""
      {"contact":{"company":"ORC integração","name":"Contato","email":"orc@example.com"},
       "project":{"requestNeedId":"failure-analysis","objective":"Avaliar ruptura","observations":"Preservar material"},
       "pieces":[{"id":"piece-a","name":"Eixo","quantity":2,"material":"Aço","services":["internal"],"requirements":{"internalOptions":["defects"]}}]}
      """).post("/api/requests").then().statusCode(201).extract().path("id");
    if(ready){
      given().post("/api/requests/{id}/analysis/start",id).then().statusCode(200);
      given().contentType("application/json").body("{\"result\":\"quote-ready\",\"technicalSummary\":\"Inspecionar região de ruptura\"}").post("/api/requests/{id}/analysis/finish",id).then().statusCode(200);
    }return id;
  }
  Map<String,Object> create(String request) {return given().contentType("application/json").body("{\"hourlyRate\":150}").post("/api/requests/{id}/quote",request).then().statusCode(200).extract().as(Map.class);}
  Map<String,Object> get(String id){return given().get("/api/quotes/{id}",id).then().statusCode(200).extract().as(Map.class);}
  Map<String,Object> update(Map<String,Object> q) {
    return given().contentType("application/json").body(q).put("/api/quotes/{id}",q.get("id")).then().statusCode(200).extract().as(Map.class);
  }
  Map<String,Object> status(Map<String,Object> q,String target) {
    return given().contentType("application/json").body(Map.of("revision",q.get("revision"),"status",target)).post("/api/quotes/{id}/status",q.get("id")).then().statusCode(200).extract().as(Map.class);
  }
  @Test @SuppressWarnings("unchecked") void conversionCompositionReloadEditAndProposalPersist() {
    String request=request(true);var q=create(request);String id=(String)q.get("id");
    assertTrue(id.matches("ORC-\\d{4,}"));assertNotNull(UUID.fromString((String)q.get("technicalId")));assertEquals(request,q.get("requestId"));
    given().get("/api/requests/{id}",request).then().statusCode(200).body("status",equalTo("Convertida em orçamento"),"linkedQuoteId",equalTo(id));
    given().get("/api/quotes").then().statusCode(200).body("id",hasItem(id));
    assertEquals(id,create(request).get("id"));
    assertEquals("Inspecionar região de ruptura",q.get("technicalSummary"));
    var pieces=(List<Map<String,Object>>)q.get("requestPieces");assertEquals(2,pieces.getFirst().get("quantity"));assertEquals("Aço",pieces.getFirst().get("material"));
    assertEquals(List.of("defects"),((Map<?,?>)pieces.getFirst().get("requirements")).get("internalOptions"));
    var items=(List<Map<String,Object>>)q.get("items");assertEquals(2,items.size());assertEquals("piece-a",items.getFirst().get("requestPieceId"));assertNull(items.get(1).get("requestPieceId"));
    items.forEach(i->{i.put("technicalHours",2);i.put("quotedHours",3);i.put("hourlyRate",175);});
    q.put("scope","Escopo persistido");q.put("machineId","bosello-max");q.put("estimateJustification","Horas estimadas por geometria");q.put("commercialNotes","Entrega digital");q.put("internalCost",900);
    var old=new LinkedHashMap<>(q);q=update(q);
    given().contentType("application/json").body(old).put("/api/quotes/{id}",id).then().statusCode(409);
    q=get(id);assertEquals("Escopo persistido",q.get("scope"));assertEquals(1050.0,((Number)q.get("proposedValue")).doubleValue());
    q=status(q,"Em revisão");q=status(q,"Aprovado internamente");
    given().contentType("application/json").body(q).put("/api/quotes/{id}",id).then().statusCode(409);
    var proposal=given().post("/api/quotes/{id}/proposal",id).then().statusCode(200).extract().as(Map.class);
    var draft=(Map<String,Object>)proposal.get("draft");draft.put("revision",proposal.get("revision"));((Map<String,Object>)draft.get("content")).put("notes","Nota persistida no documento");
    proposal=given().contentType("application/json").body(draft).put("/api/quotes/{id}/proposal",id).then().statusCode(200).extract().as(Map.class);
    var document=given().get("/api/quotes/{id}/proposal/document",id).then().statusCode(200).body("snapshot.content.notes",equalTo("Nota persistida no documento")).extract().as(Map.class);
    String snapshot=document.get("snapshot").toString();assertFalse(snapshot.contains("internalCost"));assertFalse(snapshot.contains("estimateJustification"));assertFalse(snapshot.contains("technicalHours"));
    var generation=Map.of("revision",proposal.get("revision"),"sourceQuoteRevision",q.get("revision"),"snapshot",document.get("snapshot"),"pdfFileName","test.pdf","pdf",Map.of("pageCount",1));
    proposal=given().contentType("application/json").body(generation).post("/api/quotes/{id}/proposal/versions",id).then().statusCode(200).body("draft",nullValue(),"versions[0].locked",equalTo(true)).extract().as(Map.class);
    given().contentType("application/json").body(generation).post("/api/quotes/{id}/proposal/versions",id).then().statusCode(409);
    given().get("/api/quotes/{id}",id).then().statusCode(200).body("proposal.versions.size()",equalTo(1));
    given().contentType("application/json").body(Map.of("revision",proposal.get("revision"),"type","accepted","date","2026-09-22","note","Aceite registrado")).post("/api/quotes/{id}/proposal/versions/1/result",id).then().statusCode(200).body("acceptedVersion",equalTo(1));
    assertEquals("Aceito",get(id).get("status"));
  }
  @Test void invalidRequestAndInvalidInputDoNotConvert() {
    String notReady=request(false);
    given().contentType("application/json").body("{}").post("/api/requests/{id}/quote",notReady).then().statusCode(409);
    given().get("/api/requests/{id}",notReady).then().statusCode(200).body("status",equalTo("Nova"),"linkedQuoteId",nullValue());
    String ready=request(true);
    given().contentType("application/json").body("{\"hourlyRate\":-10}").post("/api/requests/{id}/quote",ready).then().statusCode(400);
    given().get("/api/requests/{id}",ready).then().statusCode(200).body("status",equalTo("Apta para orçamento"),"linkedQuoteId",nullValue());
  }
  @Test void concurrentConversionCreatesOneQuote() throws Exception {
    String request=request(true);
    try(var executor=Executors.newFixedThreadPool(2)) {
      var first=executor.submit(()->create(request));var second=executor.submit(()->create(request));
      assertEquals(first.get(30,TimeUnit.SECONDS).get("id"),second.get(30,TimeUnit.SECONDS).get("id"));
    }
  }
  @Test void databaseFailureRollsBackQuoteAndRequest() throws Exception {
    String request=request(true);
    try(var connection=dataSource.getConnection();var statement=connection.createStatement()) {
      // Guard is repeated on the connection used for DDL; never install a trigger in DEV.
      try(var rs=statement.executeQuery("SELECT DB_NAME()")){assertTrue(rs.next());assertEquals("lab_platform_test",rs.getString(1));}
      statement.execute("CREATE TRIGGER test_quote_failure ON quote_history AFTER INSERT AS BEGIN THROW 51000, 'Deliberate rollback test', 1; END");
      try {
        given().contentType("application/json").body("{}").post("/api/requests/{id}/quote",request).then().statusCode(500);
      } finally {statement.execute("DROP TRIGGER test_quote_failure");}
    }
    given().get("/api/requests/{id}",request).then().statusCode(200).body("status",equalTo("Apta para orçamento"),"linkedQuoteId",nullValue());
    given().get("/api/quotes").then().statusCode(200).body("requestId",not(hasItem(request)));
  }
  @Test void browserPersistenceAndFailureFlow() throws Exception {
    org.junit.jupiter.api.Assumptions.assumeTrue(Boolean.getBoolean("lab.browser"), "Enable with -Dlab.browser=true when Chrome is installed");
    var output=java.nio.file.Path.of("target/quote-browser.log");
    var builder=new ProcessBuilder("node","tests/quoteBrowser.mjs").directory(java.nio.file.Path.of("../frontend").toFile()).redirectErrorStream(true).redirectOutput(output.toFile());
    builder.environment().put("LAB_BROWSER_TEST_DATABASE","lab_platform_test");
    builder.environment().put("LAB_BROWSER_TEST_PORT",org.eclipse.microprofile.config.ConfigProvider.getConfig().getValue("quarkus.http.test-port",String.class));
    var process=builder.start();
    try {assertTrue(process.waitFor(150,TimeUnit.SECONDS),"Browser test timed out");System.out.println(java.nio.file.Files.readString(output));assertEquals(0,process.exitValue());}
    finally {if(process.isAlive())process.destroyForcibly();}
  }
}
