package br.org.senai.lab.resource;

import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.security.CurrentUser;
import br.org.senai.lab.service.AuditService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;

/**
 * Configurações do laboratório (somente Administrador, política /api/admin/*): padrões do orçamento, regras de atenção,
 * referência de valor/hora e custos de equipamentos. Guardadas como JSON por chave; antes ficavam só na memória do navegador.
 */
@Path("/api/admin") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class SettingsResource {
  static final Set<String> KEYS=Set.of("general","attention-rules","commercial-rate","equipment-costs");
  @Inject EntityManager em;
  @Inject CurrentUser current;
  @Inject ObjectMapper json;
  @Inject AuditService audit;

  public record AuditInput(String area,String action,String description) {}

  @GET @Path("/settings") @Transactional @SuppressWarnings("unchecked")
  public Map<String,Object> settings(){
    current.requireAtLeast("ADMIN");
    Map<String,Object> result=new LinkedHashMap<>();
    List<Object[]> rows=em.createNativeQuery("SELECT setting_key,setting_value FROM app_setting").getResultList();
    for(Object[] r:rows){try{result.put(String.valueOf(r[0]),json.readTree(String.valueOf(r[1])));}catch(Exception ignored){}}
    return result;
  }

  @PUT @Path("/settings/{key}") @Transactional
  public Map<String,Object> save(@PathParam("key") String key,JsonNode value){
    current.requireAtLeast("ADMIN");
    if(!KEYS.contains(key))throw new ApiException(400,"Configuração desconhecida.");
    if(value==null||value.isNull())throw new ApiException(400,"Valor ausente.");
    String text;try{text=json.writeValueAsString(value);}catch(Exception e){throw new ApiException(400,"Valor inválido.");}
    if(text.length()>500_000)throw new ApiException(400,"Configuração muito grande.");
    int updated=em.createNativeQuery("UPDATE app_setting SET setting_value=?1,updated_at=SYSUTCDATETIME(),updated_by=?2 WHERE setting_key=?3")
      .setParameter(1,text).setParameter(2,current.name()).setParameter(3,key).executeUpdate();
    if(updated==0)em.createNativeQuery("INSERT INTO app_setting(setting_key,setting_value,updated_at,updated_by) VALUES (?1,?2,SYSUTCDATETIME(),?3)")
      .setParameter(1,key).setParameter(2,text).setParameter(3,current.name()).executeUpdate();
    return Map.of("key",key,"saved",true);
  }

  @GET @Path("/audit") public List<Map<String,Object>> audit(@QueryParam("limit") @DefaultValue("100") int limit){
    current.requireAtLeast("ADMIN");
    return audit.list(limit);
  }

  @POST @Path("/audit") public Map<String,Object> register(AuditInput input){
    current.requireAtLeast("ADMIN");
    if(input==null||input.action()==null||input.action().isBlank())throw new ApiException(400,"Informe a ação.");
    audit.record(current.name(),input.area(),input.action(),input.description());
    return Map.of("saved",true);
  }
}
