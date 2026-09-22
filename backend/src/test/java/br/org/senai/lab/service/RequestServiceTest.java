package br.org.senai.lab.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class RequestServiceTest {
  @ParameterizedTest
  @CsvSource({
      "1, SOL-0001",
      "2, SOL-0002",
      "9, SOL-0009",
      "10, SOL-0010",
      "100, SOL-0100",
      "1000, SOL-1000",
      "10000, SOL-10000"
  })
  void formatsRequestCodeWithAtLeastFourDigits(long number, String expected) {
    assertEquals(expected, RequestService.formatRequestCode(number));
  }
}
