package br.org.senai.lab.service;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
class ProjectServiceTest {
  @Test void operationalCodeHasMinimumFourDigitsWithoutTruncation(){
    assertEquals("PRJ-0001",ProjectService.formatProjectCode(1));
    assertEquals("PRJ-9999",ProjectService.formatProjectCode(9999));
    assertEquals("PRJ-10000",ProjectService.formatProjectCode(10000));
  }
}
