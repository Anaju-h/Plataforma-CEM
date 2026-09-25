package br.org.senai.lab.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

/** Trilha administrativa persistida (configurações, referências comerciais, solicitações de clientes). */
@ApplicationScoped
public class AuditService {
  @Inject EntityManager em;

  @Transactional public void record(String actor,String area,String action,String description){
    em.createNativeQuery("INSERT INTO admin_audit_event(id,occurred_at,actor,area,action,description) VALUES (?1,SYSUTCDATETIME(),?2,?3,?4,?5)")
      .setParameter(1,UUID.randomUUID()).setParameter(2,cut(actor,200,"Sistema")).setParameter(3,cut(area,120,"Geral"))
      .setParameter(4,cut(action,200,"Evento")).setParameter(5,description).executeUpdate();
  }

  @Transactional @SuppressWarnings("unchecked")
  public List<Map<String,Object>> list(int limit){
    List<Object[]> rows=em.createNativeQuery("SELECT TOP (?1) id,occurred_at,actor,area,action,description FROM admin_audit_event ORDER BY occurred_at DESC").setParameter(1,Math.max(1,Math.min(limit,500))).getResultList();
    DateTimeFormatter format=DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    ZoneId lab=ZoneId.of("America/Sao_Paulo");
    List<Map<String,Object>> result=new ArrayList<>();
    for(Object[] r:rows){
      LocalDateTime at=r[1] instanceof java.sql.Timestamp t?t.toLocalDateTime():r[1] instanceof LocalDateTime l?l:LocalDateTime.parse(String.valueOf(r[1]).replace(' ','T'));
      String local=at.atZone(ZoneOffset.UTC).withZoneSameInstant(lab).format(format);
      result.add(QuoteService.map("id",String.valueOf(r[0]),"date",local,"actor",r[2],"area",r[3],"action",r[4],"description",r[5]));
    }
    return result;
  }
  private static String cut(String value,int max,String fallback){if(value==null||value.isBlank())return fallback;String v=value.trim();return v.length()>max?v.substring(0,max):v;}
}
