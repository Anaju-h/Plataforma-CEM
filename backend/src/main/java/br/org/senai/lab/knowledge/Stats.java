package br.org.senai.lab.knowledge;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/** Descriptive statistics used by indicators and the Assistant. Median/quartiles (not mean): robust with few cases. */
public final class Stats {
  private Stats(){}

  /** Quantile with linear interpolation between order statistics (Hyndman–Fan type 7, same as spreadsheets). */
  public static double quantile(List<Double> values,double q){
    if(values.isEmpty())throw new IllegalArgumentException("empty");
    List<Double> sorted=new ArrayList<>(values);Collections.sort(sorted);
    double position=(sorted.size()-1)*q;int lower=(int)Math.floor(position);int upper=(int)Math.ceil(position);
    return sorted.get(lower)+(sorted.get(upper)-sorted.get(lower))*(position-lower);
  }
  public static double median(List<Double> values){return quantile(values,0.5);}

  /** (actual - estimated) / estimated, or null when not computable. */
  public static Double deviation(BigDecimal estimated,BigDecimal actual){
    if(estimated==null||actual==null||estimated.signum()==0)return null;
    return actual.subtract(estimated).divide(estimated,6,RoundingMode.HALF_UP).doubleValue();
  }
  /** (value - cost) / value, or null. */
  public static Double margin(BigDecimal value,BigDecimal cost){
    if(value==null||cost==null||value.signum()==0)return null;
    return value.subtract(cost).divide(value,6,RoundingMode.HALF_UP).doubleValue();
  }
  public static double round(double value,int digits){return BigDecimal.valueOf(value).setScale(digits,RoundingMode.HALF_UP).doubleValue();}
  public static Double round(Double value,int digits){return value==null?null:round(value.doubleValue(),digits);}
}
