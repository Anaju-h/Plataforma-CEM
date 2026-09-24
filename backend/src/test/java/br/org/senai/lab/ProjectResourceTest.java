package br.org.senai.lab;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.common.QuarkusTestResource;
import jakarta.inject.Inject;
import javax.sql.DataSource;
import org.junit.jupiter.api.*;
import java.util.*;
import java.util.concurrent.*;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(DatabaseIsolationResource.class)
class ProjectResourceTest {
  @Inject DataSource dataSource;
  private final QuoteResourceTest commercial=new QuoteResourceTest();
  @BeforeEach void verifyDatabase() throws Exception {
    try(var c=dataSource.getConnection();var s=c.createStatement();var rs=s.executeQuery("SELECT DB_NAME()")){
      assertTrue(rs.next());assertEquals("lab_platform_test",rs.getString(1));
    }
  }
  @SuppressWarnings("unchecked") Map<String,Object> acceptedQuote(){
    var q=commercial.create(commercial.request(true));String id=(String)q.get("id");
    ((List<Map<String,Object>>)q.get("items")).forEach(i->{i.put("technicalHours",2);i.put("quotedHours",3);});
    q.put("scope","Escopo PRJ");q.put("machineId","bosello-max");q.put("estimateJustification","Execução PRJ");
    q=commercial.update(q);q=commercial.status(q,"Em revisão");q=commercial.status(q,"Aprovado internamente");
    var proposal=given().post("/api/quotes/{id}/proposal",id).then().statusCode(200).extract().as(Map.class);
    var document=given().get("/api/quotes/{id}/proposal/document",id).then().statusCode(200).extract().as(Map.class);
    proposal=given().contentType("application/json").body(Map.of("revision",proposal.get("revision"),"sourceQuoteRevision",q.get("revision"),"snapshot",document.get("snapshot"),"pdfFileName","project.pdf","pdf",Map.of("pageCount",1)))
      .post("/api/quotes/{id}/proposal/versions",id).then().statusCode(200).extract().as(Map.class);
    given().contentType("application/json").body(Map.of("revision",proposal.get("revision"),"type","accepted","date","2026-09-23","note","Aceite PRJ"))
      .post("/api/quotes/{id}/proposal/versions/1/result",id).then().statusCode(200);
    return commercial.get(id);
  }
  Map<String,Object> create(String quote){return given().post("/api/quotes/{id}/project",quote).then().statusCode(200).extract().as(Map.class);}
  Map<String,Object> update(Map<String,Object> p,String operation,Map<String,Object> data){
    var input=new HashMap<>(data);input.put("revision",p.get("revision"));input.put("operation",operation);
    return given().contentType("application/json").body(input).put("/api/projects/{id}",p.get("id")).then().statusCode(200).extract().as(Map.class);
  }
  @Test @SuppressWarnings("unchecked") void acceptedQuoteCreatesPersistentProjectAndExistingWorkflow(){
    var q=acceptedQuote();String quote=(String)q.get("id");var p=create(quote);String id=(String)p.get("id");
    assertTrue(id.matches("PRJ-\\d{4,}"));assertNotNull(UUID.fromString((String)p.get("technicalId")));
    assertEquals(id,p.get("projectCode"));assertEquals(quote,p.get("quoteId"));assertEquals(q.get("requestId"),p.get("requestId"));
    assertEquals(quote.replace("ORC-","PROP-"),p.get("acceptedProposalId"));assertEquals(1,p.get("acceptedProposalVersion"));
    assertNotNull(UUID.fromString((String)p.get("acceptedVersionTechnicalId")));
    assertEquals("Planejamento",p.get("status"));assertEquals(5,((List<?>)p.get("tasks")).size());
    assertEquals(id,create(quote).get("id"));
    given().get("/api/quotes/{id}",quote).then().statusCode(200).body("projectId",equalTo(id),"convertedToProject",equalTo(true),"revision",equalTo(q.get("revision")));
    given().get("/api/projects").then().statusCode(200).body("id",hasItem(id));
    given().get("/api/projects/{id}",p.get("technicalId")).then().statusCode(200).body("id",equalTo(id));
    p=update(p,"notes",Map.of("internalNotes","Persistir após F5"));
    given().contentType("application/json").body(Map.of("revision",0,"operation","notes","internalNotes","Obsoleto")).put("/api/projects/{id}",id).then().statusCode(409);
    given().get("/api/projects/{id}",id).then().statusCode(200).body("internalNotes",equalTo("Persistir após F5"),"history.size()",equalTo(2));
    p=update(p,"prepare",Map.of());p=update(p,"start",Map.of());p=update(p,"review",Map.of());
    given().contentType("application/json").body(Map.of("revision",p.get("revision"),"operation","complete")).put("/api/projects/{id}",id).then().statusCode(409);
    p=update(p,"return",Map.of());
    var tasks=(List<Map<String,Object>>)p.get("tasks");
    for(var task:tasks)p=update(p,"task",Map.of("taskId",task.get("id"),"completed",true));
    p=update(p,"review",Map.of());p=update(p,"complete",Map.of());assertEquals("Concluído",p.get("status"));assertNotNull(p.get("completedAt"));
    given().contentType("application/json").body(Map.of("revision",p.get("revision"),"operation","notes","internalNotes","Bloqueado")).put("/api/projects/{id}",id).then().statusCode(409);
    p=update(p,"reopen",Map.of());assertEquals("Em andamento",p.get("status"));assertNull(p.get("completedAt"));
  }
  @Test void missingAcceptanceAndMissingResourcesDoNotCreate(){
    var quote=commercial.create(commercial.request(true));
    given().post("/api/quotes/{id}/project",quote.get("id")).then().statusCode(409);
    given().get("/api/projects").then().statusCode(200).body("quoteId",not(hasItem(quote.get("id"))));
    given().post("/api/quotes/ORC-missing/project").then().statusCode(404);
    given().get("/api/projects/PRJ-missing").then().statusCode(404);
    given().contentType("application/json").body("{}").put("/api/projects/PRJ-missing").then().statusCode(400);
  }
  @Test void concurrentConversionIsIdempotent() throws Exception {
    String quote=(String)acceptedQuote().get("id");
    try(var executor=Executors.newFixedThreadPool(2)){
      var a=executor.submit(()->create(quote));var b=executor.submit(()->create(quote));
      assertEquals(a.get(30,TimeUnit.SECONDS).get("id"),b.get(30,TimeUnit.SECONDS).get("id"));
    }
  }
  @Test void failureRollsBackProjectTasksHistoryAndQuoteLink() throws Exception {
    var quote=acceptedQuote();String id=(String)quote.get("id");
    try(var c=dataSource.getConnection();var s=c.createStatement()){
      try(var rs=s.executeQuery("SELECT DB_NAME()")){assertTrue(rs.next());assertEquals("lab_platform_test",rs.getString(1));}
      s.execute("CREATE TRIGGER test_project_failure ON project_history AFTER INSERT AS BEGIN THROW 51000, 'Deliberate rollback test', 1; END");
      try{given().post("/api/quotes/{id}/project",id).then().statusCode(500).body("message",equalTo("Não foi possível concluir a operação."));}
      finally{s.execute("DROP TRIGGER test_project_failure");}
      try(var rs=s.executeQuery("SELECT COUNT(*) FROM project_task t LEFT JOIN lab_project p ON p.id=t.project_id WHERE p.id IS NULL")){assertTrue(rs.next());assertEquals(0,rs.getInt(1));}
    }
    given().get("/api/projects").then().statusCode(200).body("quoteId",not(hasItem(id)));
    given().get("/api/quotes/{id}",id).then().statusCode(200).body("status",equalTo("Aceito"),"projectId",nullValue(),"history.size()",equalTo(((List<?>)quote.get("history")).size()));
    assertNotNull(create(id).get("id"));
  }
  @Test void browserProjectPersistenceAndOfflineFlow() throws Exception {
    Assumptions.assumeTrue(Boolean.getBoolean("lab.project.browser"), "Enable with -Dlab.project.browser=true when Chrome is installed");
    String draft=(String)commercial.create(commercial.request(true)).get("id");
    var output=java.nio.file.Path.of(System.getProperty("project.browser.output","target/project-browser")).toAbsolutePath();
    java.nio.file.Files.createDirectories(output);
    var builder=new ProcessBuilder("node","tests/projectBrowser.mjs").directory(java.nio.file.Path.of("../frontend").toFile()).redirectErrorStream(true).redirectOutput(output.resolve("project-browser.log").toFile());
    builder.environment().put("LAB_BROWSER_TEST_DATABASE","lab_platform_test");
    builder.environment().put("LAB_BROWSER_TEST_PORT",org.eclipse.microprofile.config.ConfigProvider.getConfig().getValue("quarkus.http.test-port",String.class));
    builder.environment().put("LAB_BROWSER_DRAFT_QUOTE",draft);
    builder.environment().put("LAB_BROWSER_OUTPUT",output.toString());
    var process=builder.start();
    try{assertTrue(process.waitFor(420,TimeUnit.SECONDS),"Project browser test timed out");System.out.println(java.nio.file.Files.readString(output.resolve("project-browser.log")));assertEquals(0,process.exitValue());}
    finally{if(process.isAlive())process.destroyForcibly();}
  }
  @Test void v4RepairsLegacyStatusesWithoutChangingProjectIdentity() throws Exception {
    var project=create((String)acceptedQuote().get("id"));
    String migration=java.nio.file.Files.readString(java.nio.file.Path.of("src/main/resources/db/migration/V4__project_status_encoding.sql"));
    var cases=Map.of("Aguardando execu\u00c3\u00a7\u00c3\u00a3o","Aguardando execução",
      "Aguardando revis\u00c3\u00a3o","Aguardando revisão","Conclu\u00c3\u00addo","Concluído","Conclu\u00c3do","Concluído");
    try(var c=dataSource.getConnection();var s=c.createStatement()){
      try(var rs=s.executeQuery("SELECT DB_NAME()")){assertTrue(rs.next());assertEquals("lab_platform_test",rs.getString(1));}
      c.setAutoCommit(false);
      try{
        for(var entry:cases.entrySet()){
          s.execute("ALTER TABLE lab_project DROP CONSTRAINT CK_project_status");
          try(var update=c.prepareStatement("UPDATE lab_project SET status=? WHERE project_code=?")){
            update.setNString(1,entry.getKey());update.setNString(2,(String)project.get("id"));assertEquals(1,update.executeUpdate());
          }
          s.execute(migration);
          try(var query=c.prepareStatement("SELECT id,quote_id,status FROM lab_project WHERE project_code=?")){
            query.setNString(1,(String)project.get("id"));
            try(var rs=query.executeQuery()){
              assertTrue(rs.next());assertEquals(project.get("technicalId"),rs.getString(1).toLowerCase(Locale.ROOT));
              assertEquals(project.get("quoteTechnicalId"),rs.getString(2).toLowerCase(Locale.ROOT));assertEquals(entry.getValue(),rs.getString(3));
            }
          }
        }
        try(var rs=s.executeQuery("SELECT is_disabled,is_not_trusted FROM sys.check_constraints WHERE name='CK_project_status'")){
          assertTrue(rs.next());assertFalse(rs.getBoolean(1));assertFalse(rs.getBoolean(2));
        }
        try(var update=c.prepareStatement("UPDATE lab_project SET status=? WHERE project_code=?")){
          update.setNString(1,"Aguardando execu\u00c3\u00a7\u00c3\u00a3o");update.setNString(2,(String)project.get("id"));
          assertThrows(java.sql.SQLException.class,update::executeUpdate);
        }
      }finally{c.rollback();}
    }
    given().get("/api/projects/{id}",project.get("id")).then().statusCode(200).body("status",equalTo("Planejamento"));
  }
}
