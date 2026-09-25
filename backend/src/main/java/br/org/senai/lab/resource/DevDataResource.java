package br.org.senai.lab.resource;

import br.org.senai.lab.security.CurrentUser;
import io.quarkus.arc.profile.IfBuildProfile;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;

/**
 * Somente no perfil DEV: limpa os dados operacionais de teste (mesmo efeito de scripts/reset-operational-data.sql).
 * Mantém usuários internos, vocabulário, configurações e a conta de cliente DEV. Exige Administrador.
 */
@IfBuildProfile("dev")
@Path("/api/admin/dev") @Produces(MediaType.APPLICATION_JSON)
public class DevDataResource {
  private static final List<String> STATEMENTS = List.of(
      "DELETE FROM km_notice", "DELETE FROM km_lesson_subject", "DELETE FROM km_lesson",
      "DELETE FROM km_record_resource", "DELETE FROM km_record_cause", "DELETE FROM km_record",
      "DELETE FROM project_history", "DELETE FROM project_time_entry", "DELETE FROM project_task", "DELETE FROM lab_project",
      "DELETE FROM quote_proposal_version", "DELETE FROM quote_proposal", "DELETE FROM quote_history",
      "DELETE FROM quote_item", "DELETE FROM quote_piece_service", "DELETE FROM quote_piece",
      "DELETE FROM quote_service", "DELETE FROM lab_quote",
      "DELETE FROM piece_service", "DELETE FROM request_history", "DELETE FROM request_analysis",
      "DELETE FROM request_piece", "DELETE FROM request_service", "DELETE FROM lab_request",
      "DELETE FROM customer_user WHERE email <> N'cliente@example.test'",
      "DELETE c FROM customer_company c WHERE NOT EXISTS (SELECT 1 FROM customer_user u WHERE u.company_id = c.id)",
      "ALTER SEQUENCE request_code_seq RESTART WITH 1", "ALTER SEQUENCE quote_code_seq RESTART WITH 1",
      "ALTER SEQUENCE project_code_seq RESTART WITH 1", "ALTER SEQUENCE km_record_seq RESTART WITH 1",
      "ALTER SEQUENCE km_lesson_seq RESTART WITH 1");
  @Inject EntityManager em;
  @Inject CurrentUser current;

  /** Lista as contas de cliente (sem dados sensíveis) para conferência em DEV. */
  @GET @Path("/customers") @Transactional @SuppressWarnings("unchecked") public List<Map<String,Object>> customers(){
    current.requireAtLeast("ADMIN");
    List<Object[]> rows=em.createNativeQuery("SELECT u.name,u.email,c.name,CASE WHEN u.password_hash IS NULL THEN 0 ELSE 1 END,u.created_at FROM customer_user u JOIN customer_company c ON c.id=u.company_id ORDER BY u.created_at").getResultList();
    return rows.stream().map(r->Map.<String,Object>of("name",String.valueOf(r[0]),"email",String.valueOf(r[1]),"company",String.valueOf(r[2]),"hasPassword",((Number)r[3]).intValue()==1,"createdAt",String.valueOf(r[4]))).toList();
  }
  public record CustomerPassword(String email,String password) {}
  /** DEV: define a senha de uma conta de cliente (acesso rápido da demonstração). */
  @POST @Path("/customer-password") @Consumes(MediaType.APPLICATION_JSON) @Transactional public Map<String,Object> customerPassword(CustomerPassword in){
    current.requireAtLeast("ADMIN");
    if(in==null||in.email()==null||in.password()==null||in.password().length()<8)throw new WebApplicationException("Informe e-mail e senha (mín. 8).",400);
    int rows=em.createNativeQuery("UPDATE customer_user SET password_hash=?1, updated_at=SYSUTCDATETIME() WHERE lower(email)=lower(?2)")
      .setParameter(1,br.org.senai.lab.security.PasswordHasher.hash(in.password())).setParameter(2,in.email().trim()).executeUpdate();
    return Map.of("updated",rows);
  }
  /** DEV: remove uma SOL de teste que ainda não virou orçamento. */
  @DELETE @Path("/requests/{code}") @Transactional public Map<String,Object> deleteRequest(@PathParam("code") String code){
    current.requireAtLeast("ADMIN");
    Object id=em.createNativeQuery("SELECT id FROM lab_request WHERE request_code=?1 AND NOT EXISTS (SELECT 1 FROM lab_quote q WHERE q.request_id=lab_request.id)").setParameter(1,code).getResultStream().findFirst().orElse(null);
    if(id==null)throw new WebApplicationException("SOL inexistente ou já convertida em orçamento.",409);
    for(String sql:List.of("DELETE FROM piece_service WHERE piece_id IN (SELECT id FROM request_piece WHERE request_id=?1)","DELETE FROM request_history WHERE request_id=?1",
        "DELETE FROM request_analysis WHERE request_id=?1","DELETE FROM request_piece WHERE request_id=?1","DELETE FROM request_service WHERE request_id=?1","DELETE FROM lab_request WHERE id=?1"))
      em.createNativeQuery(sql).setParameter(1,id).executeUpdate();
    return Map.of("removed",code);
  }
  /** Remove eventos de histórico de projeto gerados em testes manuais (texto exato informado). */
  @DELETE @Path("/project-history") @Transactional public Map<String,Object> purgeHistory(@QueryParam("contains") String text){
    current.requireAtLeast("ADMIN");
    if(text==null||text.length()<5)throw new WebApplicationException("Informe o texto.",400);
    int rows=em.createNativeQuery("DELETE FROM project_history WHERE description LIKE ?1").setParameter(1,"%"+text+"%").executeUpdate();
    return Map.of("removed",rows);
  }
  @POST @Path("/reset-operational-data") @Transactional public Map<String,Object> reset(){
    current.requireAtLeast("ADMIN");
    String db=(String)em.createNativeQuery("SELECT DB_NAME()").getSingleResult();
    if(!"lab_platform".equals(db)) throw new WebApplicationException("Banco não permitido.",403);
    Map<String,Object> removed=new LinkedHashMap<>();
    for(String sql:STATEMENTS){int rows=em.createNativeQuery(sql).executeUpdate();if(sql.startsWith("DELETE"))removed.put(sql.replaceAll("^DELETE (c )?FROM (\\w+).*$","$2"),rows);}
    return Map.of("database",db,"removed",removed);
  }
}
