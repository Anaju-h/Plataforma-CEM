package br.org.senai.lab.knowledge;

import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/** Estatística descritiva do módulo: mediana e quartis (não média), desvio e margem. */
class StatsTest {
  @Test void medianAndQuartilesUseLinearInterpolation(){
    List<Double> hours=List.of(10.0,4.0,8.0,6.0,12.0);
    assertEquals(8.0,Stats.median(hours));
    assertEquals(6.0,Stats.quantile(hours,0.25));
    assertEquals(10.0,Stats.quantile(hours,0.75));
    assertEquals(5.0,Stats.quantile(List.of(4.0,6.0),0.5));
  }

  @Test void medianIsRobustToOneAtypicalService(){
    // Com poucos casos, um serviço atípico distorce a média, mas não a mediana.
    List<Double> hours=List.of(10.0,11.0,12.0,13.0,80.0);
    double mean=hours.stream().mapToDouble(Double::doubleValue).average().orElseThrow();
    assertEquals(25.2,mean,0.001);
    assertEquals(12.0,Stats.median(hours));
  }

  @Test void quantileOfEmptyListIsRejected(){
    assertThrows(IllegalArgumentException.class,()->Stats.median(List.of()));
  }

  @Test void deviationIsRelativeToEstimate(){
    assertEquals(0.4,Stats.deviation(new BigDecimal("10"),new BigDecimal("14")),1e-9);
    assertEquals(-0.25,Stats.deviation(new BigDecimal("8"),new BigDecimal("6")),1e-9);
    assertNull(Stats.deviation(null,new BigDecimal("5")));
    assertNull(Stats.deviation(BigDecimal.ZERO,new BigDecimal("5")));
  }

  @Test void marginAnswersIfTheServiceMadeMoney(){
    assertEquals(0.25,Stats.margin(new BigDecimal("1000"),new BigDecimal("750")),1e-9);
    assertTrue(Stats.margin(new BigDecimal("1000"),new BigDecimal("1200"))<0);
    assertNull(Stats.margin(null,new BigDecimal("1")));
  }

  @Test void roundingKeepsNulls(){
    assertEquals(1.24,Stats.round(1.2351,2));
    assertNull(Stats.round((Double)null,2));
  }
}
