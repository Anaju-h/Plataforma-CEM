package br.org.senai.lab.resource;
import br.org.senai.lab.dto.ProjectDtos.*;
import br.org.senai.lab.service.ProjectTaskService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;
/** Tarefas de um projeto: criação/delegação (Administrador), status e apontamento de horas (responsável). */
@Path("/api/projects/{id}/tasks") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class ProjectTaskResource {
  @Inject ProjectTaskService service;
  @POST public Project create(@PathParam("id") String id,@Valid TaskInput input){return service.create(id,input);}
  @PUT @Path("/{taskId}") public Project update(@PathParam("id") String id,@PathParam("taskId") UUID taskId,@Valid TaskInput input){return service.update(id,taskId,input);}
  @DELETE @Path("/{taskId}") public Project delete(@PathParam("id") String id,@PathParam("taskId") UUID taskId){return service.delete(id,taskId);}
  @POST @Path("/{taskId}/time") public Project addTime(@PathParam("id") String id,@PathParam("taskId") UUID taskId,@Valid TimeInput input){return service.addTime(id,taskId,input);}
  @DELETE @Path("/{taskId}/time/{entryId}") public Project deleteTime(@PathParam("id") String id,@PathParam("taskId") UUID taskId,@PathParam("entryId") UUID entryId){return service.deleteTime(id,taskId,entryId);}
}
