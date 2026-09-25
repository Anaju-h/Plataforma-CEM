package br.org.senai.lab.resource;

import br.org.senai.lab.knowledge.*;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;

/** Knowledge Management module (internal only; read for every profile, writes checked per profile in the services). */
@Path("/api/knowledge") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class KnowledgeResource {
  @Inject VocabularyService vocabulary;
  @Inject AssistantService assistant;
  @Inject RecordService records;
  @Inject LessonService lessons;
  @Inject IndicatorService indicators;

  public record Tolerance(Double value) {}
  public record Subscriptions(List<UUID> termIds) {}

  // Organizar
  @GET @Path("/vocabulary") public Map<String,Object> vocabulary(){return vocabulary.vocabulary();}
  @POST @Path("/vocabulary/terms") public Map<String,Object> createTerm(VocabularyService.TermInput input){return vocabulary.create(input);}
  @PUT @Path("/vocabulary/terms/{id}") public Map<String,Object> updateTerm(@PathParam("id") UUID id,VocabularyService.TermInput input){return vocabulary.update(id,input);}
  @PUT @Path("/settings/tolerance") public Map<String,Object> tolerance(Tolerance input){return vocabulary.setTolerance(input==null?null:input.value());}

  // Aplicar
  @POST @Path("/assistant") public Map<String,Object> recommend(AssistantService.Query query){return assistant.recommend(query);}

  // Criar
  @GET @Path("/records") public List<Map<String,Object>> records(@QueryParam("status") String status,@QueryParam("quote") String quote){return records.list(status,quote);}
  @GET @Path("/records/{code}") public Map<String,Object> record(@PathParam("code") String code){return records.get(code);}
  @POST @Path("/records") public Map<String,Object> create(RecordService.Create input){return records.create(input);}
  @POST @Path("/records/{code}/close") public Map<String,Object> close(@PathParam("code") String code,RecordService.Close input){return records.close(code,input);}

  // Formalizar
  @GET @Path("/lessons") public List<Map<String,Object>> lessons(@QueryParam("status") String status){return lessons.list(status);}
  @PUT @Path("/lessons/{code}") public Map<String,Object> updateLesson(@PathParam("code") String code,LessonService.Update input){return lessons.update(code,input);}
  @POST @Path("/lessons/{code}/submit") public Map<String,Object> submit(@PathParam("code") String code){return lessons.submit(code);}
  @POST @Path("/lessons/{code}/decision") public Map<String,Object> decide(@PathParam("code") String code,LessonService.Decision input){return lessons.decide(code,input);}
  @POST @Path("/lessons/{code}/supersede") public Map<String,Object> supersede(@PathParam("code") String code,LessonService.Decision input){return lessons.supersede(code,input);}

  // Disseminar (read/subscribe are personal, allowed for every profile)
  @GET @Path("/notices") public Map<String,Object> notices(){return lessons.notices();}
  @POST @Path("/notices/{id}/read") public Map<String,Object> read(@PathParam("id") UUID id){return lessons.markRead(id);}
  @POST @Path("/notices/read-all") public Map<String,Object> readAll(){return lessons.markRead(null);}
  @GET @Path("/subscriptions") public List<UUID> subscriptions(){return lessons.subscriptions();}
  @PUT @Path("/subscriptions") public List<UUID> subscribe(Subscriptions input){return lessons.setSubscriptions(input==null?List.of():input.termIds());}

  // Evoluir
  @GET @Path("/indicators") public Map<String,Object> indicators(){return indicators.indicators();}

}
