package br.org.senai.lab;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.common.QuarkusTestResource;
import jakarta.inject.Inject;
import javax.sql.DataSource;
import org.junit.jupiter.api.*;
import java.util.*;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest @QuarkusTestResource(DatabaseIsolationResource.class)
class CustomerResourceTest {
  @Inject DataSource database;
  UUID a,b;
  final QuoteResourceTest commercial=new QuoteResourceTest();
  final ProjectResourceTest operational=new ProjectResourceTest();
  @BeforeEach void customers() throws Exception {
    try(var c=database.getConnection();var s=c.createStatement();var rs=s.executeQuery("SELECT DB_NAME()")){
      assertTrue(rs.next());assertEquals("lab_platform_test",rs.getString(1));
    }
    a=customer("A");b=customer("B");TestCustomerContext.selected=a;
  }
  @AfterEach void clear(){TestCustomerContext.selected=null;}
  UUID customer(String name) throws Exception {
    UUID company=UUID.randomUUID(),user=UUID.randomUUID();
    try(var c=database.getConnection()){
      try(var s=c.prepareStatement("INSERT INTO customer_company(id,name,created_at,updated_at) VALUES(?,?,SYSUTCDATETIME(),SYSUTCDATETIME())")){
        s.setString(1,company.toString());s.setString(2,"Cliente "+name);s.executeUpdate();
      }
      try(var s=c.prepareStatement("INSERT INTO customer_user(id,company_id,name,email,active,created_at,updated_at) VALUES(?,?,?,?,1,SYSUTCDATETIME(),SYSUTCDATETIME())")){
        s.setString(1,user.toString());s.setString(2,company.toString());s.setString(3,"Contato "+name);s.setString(4,name+"@example.test");s.executeUpdate();
      }
    }return user;
  }
  String request(String need){
    return given().contentType("application/json").body(Map.of("contact",Map.of("company","Forged","name","Forged"),
      "project",Map.of("requestNeedId",need,"objective","Atendimento cliente"),"pieces",need.equals("training")?List.of():List.of(Map.of("name","Peça","quantity",1,"services",List.of("dimensional")))))
      .post("/api/customer/requests").then().statusCode(200).extract().path("id");
  }
  void ready(String id){
    given().post("/api/requests/{id}/analysis/start",id).then().statusCode(200);
    given().contentType("application/json").body(Map.of("result","quote-ready","technicalSummary","Segredo técnico interno"))
      .post("/api/requests/{id}/analysis/finish",id).then().statusCode(200);
  }
  @SuppressWarnings("unchecked") Map<String,Object> publish(String request){
    var q=commercial.create(request);
    ((List<Map<String,Object>>)q.get("items")).forEach(item->{item.put("quotedHours",2);item.put("technicalHours",1);});
    q.put("scope","Treinamento comercial");q.put("estimateJustification","Segredo de custo");q.put("internalCost",10);
    q=commercial.update(q);assertNull(q.get("machineId"));
    q=commercial.status(q,"Em revisão");q=commercial.status(q,"Aprovado internamente");
    String id=(String)q.get("id");
    var p=given().post("/api/quotes/{id}/proposal",id).then().statusCode(200).extract().as(Map.class);
    given().get("/api/customer/quotes/{id}",id).then().statusCode(200).body("versions.size()",equalTo(0));
    var d=given().get("/api/quotes/{id}/proposal/document",id).then().statusCode(200).extract().as(Map.class);
    given().contentType("application/json").body(Map.of("revision",p.get("revision"),"sourceQuoteRevision",q.get("revision"),"snapshot",d.get("snapshot"),"pdfFileName","customer.pdf","pdf",Map.of()))
      .post("/api/quotes/{id}/proposal/versions",id).then().statusCode(200);
    return given().get("/api/customer/quotes/{id}",id).then().statusCode(200).extract().as(Map.class);
  }
  Map<String,Object> result(Map<String,Object> quote,String type){return Map.of("revision",quote.get("revision"),"type",type,"date","2026-09-24","note","Resposta do cliente");}
  void safe(String path){
    String body=given().get(path).then().statusCode(200).extract().asString();
    for(String forbidden:List.of("internalCost","internalNotes","technicalSummary","estimateJustification","hourlyRate","history","Segredo"))assertFalse(body.contains(forbidden),forbidden);
  }
  @Test @SuppressWarnings("unchecked") void fullJourneyReloadAndIsolation() throws Exception {
    given().get("/api/customer/requests").then().statusCode(200).body("size()",equalTo(0));
    String request=request("training");
    given().get("/api/requests/{id}",request).then().statusCode(200).body("company",equalTo("Cliente A"),"origin",equalTo("Cliente"),"channel",equalTo("Área do cliente"));
    given().get("/api/customer/requests/{id}",request).then().statusCode(200).body("id",equalTo(request));
    ready(request);var quote=publish(request);String id=(String)quote.get("id");
    safe("/api/customer/requests/"+request);safe("/api/customer/quotes/"+id);
    TestCustomerContext.selected=b;
    given().get("/api/customer/requests").then().statusCode(200).body("size()",equalTo(0));
    given().get("/api/customer/quotes").then().statusCode(200).body("size()",equalTo(0));
    given().get("/api/customer/requests/{id}",request).then().statusCode(404);
    given().get("/api/customer/quotes/{id}",id).then().statusCode(404);
    given().contentType("application/json").body(result(quote,"accepted")).post("/api/customer/quotes/{id}/proposal/versions/1/result",id).then().statusCode(404);
    TestCustomerContext.selected=a;
    given().contentType("application/json").body(result(quote,"accepted")).post("/api/customer/quotes/{id}/proposal/versions/1/result",id).then().statusCode(200).body("status",equalTo("Proposta aceita · aguardando início do projeto"),"tone",equalTo("progress"));
    given().contentType("application/json").body(result(quote,"accepted")).post("/api/customer/quotes/{id}/proposal/versions/1/result",id).then().statusCode(409);
    var project=operational.create(id);String prj=(String)project.get("id");
    given().get("/api/customer/projects/{id}",prj).then().statusCode(200).body("status",equalTo("Projeto em preparação"));
    project=operational.update(project,"prepare",Map.of());project=operational.update(project,"start",Map.of());
    given().get("/api/customer/projects/{id}",prj).then().statusCode(200).body("status",equalTo("Em execução"));
    for(var task:(List<Map<String,Object>>)project.get("tasks")) project=operational.update(project,"task",Map.of("taskId",task.get("id"),"completed",true));
    project=operational.update(project,"review",Map.of());operational.update(project,"complete",Map.of());
    given().get("/api/customer/projects/{id}",prj).then().statusCode(200).body("status",equalTo("Concluído"),"tone",equalTo("done"),"active",equalTo(false),"progress",equalTo(100));
    given().get("/api/customer/requests/{id}",request).then().statusCode(200).body("quotes[0].id",equalTo(id),"projects[0].id",equalTo(prj));
    safe("/api/customer/projects/"+prj);
    TestCustomerContext.selected=b;
    given().get("/api/customer/projects").then().statusCode(200).body("size()",equalTo(0));
    given().get("/api/customer/projects/{id}",prj).then().statusCode(404);
    // Even another user of the same company cannot see A's records.
    try(var c=database.getConnection();var s=c.prepareStatement("UPDATE customer_user SET company_id=(SELECT company_id FROM customer_user WHERE id=?) WHERE id=?")){
      s.setString(1,a.toString());s.setString(2,b.toString());s.executeUpdate();
    }
    given().get("/api/customer/requests/{id}",request).then().statusCode(404);
  }
  @Test void refusalAndRequiredEquipment(){
    String request=request("training");ready(request);var quote=publish(request);
    given().contentType("application/json").body(result(quote,"rejected")).post("/api/customer/quotes/{id}/proposal/versions/1/result",quote.get("id")).then().statusCode(200).body("status",equalTo("Proposta recusada"),"tone",equalTo("closed"));
    given().post("/api/quotes/{id}/project",quote.get("id")).then().statusCode(409);
    String dimensional=request("check-piece");ready(dimensional);var required=commercial.create(dimensional);
    given().contentType("application/json").body(Map.of("revision",required.get("revision"),"status","Em revisão"))
      .post("/api/quotes/{id}/status",required.get("id")).then().statusCode(400);
  }
  @Test void cannotForgeCustomerOriginOrSelectIdentityFromBrowser() throws Exception {
    String request=request("training");
    given().header("X-Customer-User-Id",b.toString()).queryParam("customerUserId",b.toString())
      .get("/api/customer/requests/{id}",request).then().statusCode(200);
    given().contentType("application/json").body(Map.of("origin"," Cliente ","contact",Map.of("company","A","name","A"),"project",Map.of("requestNeedId","training")))
      .post("/api/requests").then().statusCode(400);
    try(var c=database.getConnection();var s=c.prepareStatement("UPDATE customer_user SET active=0 WHERE id=?")){
      s.setString(1,a.toString());s.executeUpdate();
    }
    given().get("/api/customer/requests").then().statusCode(403);
  }
  @Test void browserJourney() throws Exception {
    Assumptions.assumeTrue(Boolean.getBoolean("lab.customer.browser"),"Enable with -Dlab.customer.browser=true");
    var output=java.nio.file.Path.of("target/customer-browser").toAbsolutePath();java.nio.file.Files.createDirectories(output);
    var builder=new ProcessBuilder("node","tests/customerBrowser.mjs").directory(java.nio.file.Path.of("../frontend").toFile())
      .redirectErrorStream(true).redirectOutput(output.resolve("customer-browser.log").toFile());
    builder.environment().put("LAB_BROWSER_TEST_DATABASE","lab_platform_test");
    builder.environment().put("LAB_BROWSER_TEST_PORT",org.eclipse.microprofile.config.ConfigProvider.getConfig().getValue("quarkus.http.test-port",String.class));
    builder.environment().put("LAB_BROWSER_OUTPUT",output.toString());
    var process=builder.start();
    try{assertTrue(process.waitFor(360,java.util.concurrent.TimeUnit.SECONDS),"Browser timed out");System.out.println(java.nio.file.Files.readString(output.resolve("customer-browser.log")));assertEquals(0,process.exitValue());}
    finally{if(process.isAlive())process.destroyForcibly();}
  }
}
