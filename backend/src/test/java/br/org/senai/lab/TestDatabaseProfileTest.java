package br.org.senai.lab;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class TestDatabaseProfileTest {
  @Test
  void testProfileUsesOnlyDedicatedTestDatabase() throws IOException {
    String properties = Files.readString(Path.of("src/main/resources/application-test.properties"));
    String url = properties.lines()
        .filter(line -> line.startsWith("quarkus.datasource.jdbc.url="))
        .findFirst()
        .orElseThrow();
    assertTrue(url.toLowerCase().contains("databasename=lab_platform_test"));
    assertSafeTestDatabase(url);
    assertThrows(IllegalStateException.class, () -> assertSafeTestDatabase(
        "jdbc:sqlserver://localhost:1433;databaseName=lab_platform"));
  }

  private static void assertSafeTestDatabase(String url) {
    String normalized = url == null ? "" : url.toLowerCase();
    if (!normalized.contains("databasename=lab_platform_test")) {
      throw new IllegalStateException("Os testes devem usar exclusivamente lab_platform_test.");
    }
  }
}
