package br.org.senai.lab.service;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class QuoteServiceTest {
  @Test void operationalCodeHasMinimumFourDigitsWithoutTruncation() {
    assertEquals("ORC-0001",QuoteService.formatQuoteCode(1));
    assertEquals("ORC-0010",QuoteService.formatQuoteCode(10));
    assertEquals("ORC-1000",QuoteService.formatQuoteCode(1000));
    assertEquals("ORC-10000",QuoteService.formatQuoteCode(10000));
  }
}
