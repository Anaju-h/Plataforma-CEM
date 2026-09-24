package br.org.senai.lab;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.common.QuarkusTestResource;
import org.junit.jupiter.api.Test;
import java.util.*;
import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(DatabaseIsolationResource.class)
class EquipmentResourceTest {
  @Test @SuppressWarnings("unchecked") void equipmentScenariosPersistAndValidateThroughApi() {
    String[][] cases={
      {"physical-to-3d","scan",null,"400"}, {"physical-to-3d","scan","t-scan","200"},
      {"check-piece","dimensional",null,"400"}, {"training","training","prismo","200"},
      {"training","training",null,"200"}, {"reproduce-piece","reverse-engineering",null,"200"},
      {"reproduce-piece","reverse-engineering","atos-q","200"}, {"asset-structure","asset-structure",null,"200"}
    };
    var helper=new QuoteResourceTest();
    for(var scenario:cases) {
      boolean technical=Set.of("scan","dimensional","reverse-engineering").contains(scenario[1]);
      var input=Map.of("contact",Map.of("company","Equipment TEST","name","Contato"),
        "project",Map.of("requestNeedId",scenario[0],"objective","Regressão equipamento"),
        "pieces",technical?List.of(Map.of("id","piece-policy","name","Peça","quantity",1,"services",List.of(scenario[1]),"requirements",Map.of())):List.of());
      String request=given().contentType("application/json").body(input).post("/api/requests").then().statusCode(201).extract().path("id");
      given().post("/api/requests/{id}/analysis/start",request).then().statusCode(200);
      given().contentType("application/json").body(Map.of("result","quote-ready","technicalSummary","Análise técnica para orçamento"))
        .post("/api/requests/{id}/analysis/finish",request).then().statusCode(200);
      var quote=helper.create(request);
      assertNull(quote.get("machineId"));assertEquals(scenario[1],quote.get("serviceId"));
      quote.put("machineId",scenario[2]);quote.put("estimateJustification","Estimativa técnica");
      ((List<Map<String,Object>>)quote.get("items")).forEach(i->{i.put("quotedHours",2);i.put("technicalHours",2);});
      given().contentType("application/json").body(quote).put("/api/quotes/{id}",quote.get("id"))
        .then().statusCode(Integer.parseInt(scenario[3]));
      var persisted=helper.get((String)quote.get("id"));
      assertEquals("200".equals(scenario[3])?scenario[2]:null,persisted.get("machineId"));
      if("200".equals(scenario[3])) helper.status(persisted,"Em revisão");
      else given().contentType("application/json").body(Map.of("revision",persisted.get("revision"),"status","Em revisão"))
        .post("/api/quotes/{id}/status",quote.get("id")).then().statusCode(400);
    }
  }
}
