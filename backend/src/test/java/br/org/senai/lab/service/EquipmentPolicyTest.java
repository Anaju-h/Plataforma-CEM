package br.org.senai.lab.service;

import org.junit.jupiter.api.Test;
import br.org.senai.lab.exception.ApiException;
import java.nio.file.*;
import java.util.regex.Pattern;
import static org.junit.jupiter.api.Assertions.*;

class EquipmentPolicyTest {
  @Test void canonicalCatalogMatchesBackend() throws Exception {
    String catalog=Files.readString(Path.of("../frontend/src/data/serviceCatalog.js"));
    var matcher=Pattern.compile("id: \"([^\"]+)\",\\s*equipmentRequirement: \"([^\"]+)\"").matcher(catalog);
    int count=0;
    while(matcher.find()) {count++;assertEquals(EquipmentPolicy.REQUIREMENTS.get(matcher.group(1)).name(),matcher.group(2));}
    assertEquals(9,count);
  }
  @Test void requiredAndOptionalScenarios() {
    assertEquals("prismo",EquipmentPolicy.suggestedMachineId("ZEISS PRISMO"));
    assertEquals("atos-q",EquipmentPolicy.suggestedMachineId("ATOS Q"));
    assertNull(EquipmentPolicy.suggestedMachineId("A definir"));
    for(String id:new String[]{"scan","dimensional","internal"}) assertThrows(ApiException.class,()->EquipmentPolicy.validate(id,null));
    for(String id:new String[]{"training","reverse-engineering","asset-structure","failure-analysis","digital-library","maintenance"})
      assertDoesNotThrow(()->EquipmentPolicy.validate(id,null));
    assertDoesNotThrow(()->EquipmentPolicy.validate("scan","t-scan"));
    assertDoesNotThrow(()->EquipmentPolicy.validate("training","prismo"));
    assertDoesNotThrow(()->EquipmentPolicy.validate("reverse-engineering","atos-q"));
    assertNull(EquipmentPolicy.normalize("training","",null));
    assertNull(EquipmentPolicy.normalize("asset-structure","prismo",null));
    assertEquals("prismo",EquipmentPolicy.normalize("asset-structure",null,"prismo"));
    assertThrows(ApiException.class,()->EquipmentPolicy.normalize("training","none",null));
  }
}
