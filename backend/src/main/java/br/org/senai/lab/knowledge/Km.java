package br.org.senai.lab.knowledge;

import br.org.senai.lab.exception.ApiException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;

/** Small shared helpers of the knowledge module. */
final class Km {
  private Km(){}
  static final List<String> CLASSES=List.of("SERVICE_TYPE","MATERIAL","SIZE","COMPLEXITY","FEATURE_COUNT","GDT","RESOURCE","DEVIATION_CAUSE");
  static final Map<String,String> CLASS_LABELS=new LinkedHashMap<>();
  static {
    CLASS_LABELS.put("SERVICE_TYPE","Tipo de serviço");CLASS_LABELS.put("MATERIAL","Material");CLASS_LABELS.put("SIZE","Porte");
    CLASS_LABELS.put("COMPLEXITY","Complexidade geométrica");CLASS_LABELS.put("FEATURE_COUNT","Quantidade de características");
    CLASS_LABELS.put("GDT","Tolerâncias geométricas (GD&T)");CLASS_LABELS.put("RESOURCE","Recurso");CLASS_LABELS.put("DEVIATION_CAUSE","Causa de desvio");
  }

  static Map<String,Object> map(Object... pairs){Map<String,Object> m=new LinkedHashMap<>();for(int i=0;i<pairs.length;i+=2)m.put((String)pairs[i],pairs[i+1]);return m;}
  static LocalDateTime now(){return LocalDateTime.now(ZoneOffset.UTC);}
  static ApiException bad(String message){return new ApiException(400,message);}
  static ApiException conflict(String message){return new ApiException(409,message);}
  static ApiException notFound(){return new ApiException(404,"Registro não encontrado.");}
  static String code(String prefix,long number){return prefix+"-"+String.format(Locale.ROOT,"%04d",number);}
  static boolean blank(String value){return value==null||value.isBlank();}
  static String trim(String value){return blank(value)?null:value.trim();}
  /** Valores comerciais (custo, valor, margem) são exclusivos do Administrador. */
  static final java.util.Set<String> COMMERCIAL=java.util.Set.of("estimatedCost","proposedValue","actualCost","billedValue","costDeviation","budgetedMargin","realizedMargin");
  @SuppressWarnings("unchecked") static Object hideCommercial(Object value){
    if(value instanceof java.util.Map<?,?> m){((java.util.Map<String,Object>)m).replaceAll((k,v)->COMMERCIAL.contains(k)?null:hideCommercial(v));}
    else if(value instanceof java.util.Collection<?> c){c.forEach(Km::hideCommercial);}
    return value;
  }
}
