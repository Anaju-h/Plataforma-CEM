package br.org.senai.lab.resource;
import br.org.senai.lab.service.ProjectTaskService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.Map;
/** GET /api/work/mine: tarefas do usuário logado. GET /api/work/board: quadro completo (Administrador). */
@Path("/api/work") @Produces(MediaType.APPLICATION_JSON)
public class WorkResource {
  @Inject ProjectTaskService service;
  @GET @Path("/mine") public Map<String,Object> mine(){return service.myWork();}
  @GET @Path("/board") public Map<String,Object> board(){return service.board();}
}
