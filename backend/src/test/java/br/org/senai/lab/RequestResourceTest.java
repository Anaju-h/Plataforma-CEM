package br.org.senai.lab;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/** Executar com SQL Server de teste configurado pelas mesmas variáveis DB_* do backend. */
@QuarkusTest
class RequestResourceTest {
  private static String create(String need,String pieces) {
    String body="""
      {"contact":{"company":"Empresa teste","name":"Contato teste","email":"teste@example.com"},
       "project":{"requestNeedId":"%s","objective":"Avaliar"},"internal":{"channel":"Registro interno"},"pieces":%s}
      """.formatted(need,pieces);
    return given().contentType("application/json").body(body).post("/api/requests").then().statusCode(201).extract().path("id");
  }
  @Test void technicalRequestPersistsAndTransitions() {
    String id=create("inside","[{\"name\":\"Peça\",\"quantity\":1,\"services\":[\"internal\"],\"requirements\":{\"internalOptions\":[\"defects\"]}}]");
    given().get("/api/requests/{id}",id).then().statusCode(200).body("service",equalTo("internal"),"piecesData[0].services",hasItem("internal"),"history.size()",equalTo(1));
    given().post("/api/requests/{id}/analysis/start",id).then().statusCode(200).body("status",equalTo("Em análise"));
    given().contentType("application/json").body("{\"technicalSummary\":\"Inspeção inicial\"}").put("/api/requests/{id}/analysis",id).then().statusCode(200);
    given().contentType("application/json").body("{\"result\":\"waiting-information\",\"technicalSummary\":\"Inspeção inicial\",\"pendingInformation\":\"Enviar desenho\"}").post("/api/requests/{id}/analysis/finish",id).then().statusCode(200).body("status",equalTo("Aguardando informações"));
    given().post("/api/requests/{id}/analysis/resume",id).then().statusCode(200).body("status",equalTo("Em análise"));
    given().contentType("application/json").body("{\"result\":\"quote-ready\",\"technicalSummary\":\"Apta\"}").post("/api/requests/{id}/analysis/finish",id).then().statusCode(200);
    given().get("/api/requests/{id}",id).then().statusCode(200).body("status",equalTo("Apta para orçamento"),"history.size()",greaterThanOrEqualTo(5));
  }
  @Test void directAndCombinedServicesAndInvalidTransitions() {
    String training=create("training","[]");
    given().get("/api/requests/{id}",training).then().statusCode(200).body("service",equalTo("training"),"piecesData.size()",equalTo(0));
    String combined=create("failure-analysis","[{\"name\":\"Peça\",\"quantity\":1,\"services\":[\"internal\"]}]");
    given().get("/api/requests/{id}",combined).then().statusCode(200).body("service",equalTo("failure-analysis"),"services",hasItems("failure-analysis","internal"));
    given().post("/api/requests/{id}/analysis/resume",combined).then().statusCode(409);
    given().contentType("application/json").body("{\"reason\":\"Pedido do cliente\"}").post("/api/requests/{id}/cancel",combined).then().statusCode(200).body("status",equalTo("Cancelada"));
    given().post("/api/requests/{id}/analysis/start",combined).then().statusCode(409);
    given().contentType("application/json").body("{\"contact\":{},\"project\":{\"requestNeedId\":\"training\"}}").post("/api/requests").then().statusCode(400);
  }
}
