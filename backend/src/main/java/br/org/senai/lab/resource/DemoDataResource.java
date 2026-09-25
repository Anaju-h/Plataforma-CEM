package br.org.senai.lab.resource;

import br.org.senai.lab.security.CurrentUser;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;

/**
 * Dados de demonstração (Administrador). SOL/ORC/PRJ demo são identificados por lab_request.source = 'demo';
 * registros e lições do conhecimento por demo = 1. A remoção nunca toca dados reais e devolve a contagem antes/depois.
 */
@Path("/api/admin/demo-data") @Produces(MediaType.APPLICATION_JSON)
public class DemoDataResource {
  private static final String DEMO_REQ="SELECT id FROM lab_request WHERE source = 'demo'";
  private static final String DEMO_QUOTE="SELECT id FROM lab_quote WHERE request_id IN ("+DEMO_REQ+")";
  private static final String DEMO_PROJECT="SELECT id FROM lab_project WHERE quote_id IN ("+DEMO_QUOTE+")";
  private static final String DEMO_TASK="SELECT id FROM project_task WHERE project_id IN ("+DEMO_PROJECT+")";
  private static final String DEMO_RECORD="SELECT id FROM km_record WHERE demo = 1";
  private static final String DEMO_LESSON="SELECT id FROM km_lesson WHERE demo = 1 OR record_id IN ("+DEMO_RECORD+")";
  private static final List<String> DELETE=List.of(
      "DELETE FROM km_notice WHERE lesson_id IN ("+DEMO_LESSON+")",
      "DELETE FROM km_lesson_subject WHERE lesson_id IN ("+DEMO_LESSON+")",
      "DELETE FROM km_lesson WHERE id IN ("+DEMO_LESSON+")",
      "DELETE FROM km_record_resource WHERE record_id IN ("+DEMO_RECORD+")",
      "DELETE FROM km_record_cause WHERE record_id IN ("+DEMO_RECORD+")",
      "DELETE FROM km_record WHERE demo = 1",
      "DELETE FROM project_time_entry WHERE task_id IN ("+DEMO_TASK+")",
      "DELETE FROM project_task WHERE project_id IN ("+DEMO_PROJECT+")",
      "DELETE FROM project_history WHERE project_id IN ("+DEMO_PROJECT+")",
      "DELETE FROM lab_project WHERE id IN ("+DEMO_PROJECT+")",
      "DELETE FROM quote_proposal_version WHERE proposal_id IN (SELECT id FROM quote_proposal WHERE quote_id IN ("+DEMO_QUOTE+"))",
      "DELETE FROM quote_proposal WHERE quote_id IN ("+DEMO_QUOTE+")",
      "DELETE FROM quote_history WHERE quote_id IN ("+DEMO_QUOTE+")",
      "DELETE FROM quote_item WHERE quote_id IN ("+DEMO_QUOTE+")",
      "DELETE FROM quote_piece_service WHERE piece_id IN (SELECT id FROM quote_piece WHERE quote_id IN ("+DEMO_QUOTE+"))",
      "DELETE FROM quote_piece WHERE quote_id IN ("+DEMO_QUOTE+")",
      "DELETE FROM quote_service WHERE quote_id IN ("+DEMO_QUOTE+")",
      "DELETE FROM lab_quote WHERE id IN ("+DEMO_QUOTE+")",
      "DELETE FROM piece_service WHERE piece_id IN (SELECT id FROM request_piece WHERE request_id IN ("+DEMO_REQ+"))",
      "DELETE FROM request_history WHERE request_id IN ("+DEMO_REQ+")",
      "DELETE FROM request_analysis WHERE request_id IN ("+DEMO_REQ+")",
      "DELETE FROM request_piece WHERE request_id IN ("+DEMO_REQ+")",
      "DELETE FROM request_service WHERE request_id IN ("+DEMO_REQ+")",
      "DELETE FROM lab_request WHERE source = 'demo'");
  @Inject EntityManager em;
  @Inject CurrentUser current;

  @GET @Transactional public Map<String,Object> status(){current.requireAtLeast("ADMIN");return counts();}

  @DELETE @Transactional public Map<String,Object> remove(){
    current.requireAtLeast("ADMIN");
    Map<String,Object> before=counts();
    for(String sql:DELETE)em.createNativeQuery(sql).executeUpdate();
    em.flush();em.clear();
    return Map.of("before",before,"after",counts());
  }

  private Map<String,Object> counts(){
    Map<String,Object> result=new LinkedHashMap<>();
    result.put("demoRequests",count("SELECT COUNT(*) FROM lab_request WHERE source = 'demo'"));
    result.put("demoProjects",count("SELECT COUNT(*) FROM lab_project WHERE id IN ("+DEMO_PROJECT+")"));
    result.put("demoTasks",count("SELECT COUNT(*) FROM project_task WHERE id IN ("+DEMO_TASK+")"));
    result.put("demoRecords",count("SELECT COUNT(*) FROM km_record WHERE demo = 1"));
    result.put("demoLessons",count("SELECT COUNT(*) FROM km_lesson WHERE demo = 1"));
    result.put("realRequests",count("SELECT COUNT(*) FROM lab_request WHERE source <> 'demo'"));
    result.put("realProjects",count("SELECT COUNT(*) FROM lab_project WHERE id NOT IN ("+DEMO_PROJECT+")"));
    result.put("realRecords",count("SELECT COUNT(*) FROM km_record WHERE demo = 0"));
    return result;
  }
  private long count(String sql){return ((Number)em.createNativeQuery(sql).getSingleResult()).longValue();}
}
