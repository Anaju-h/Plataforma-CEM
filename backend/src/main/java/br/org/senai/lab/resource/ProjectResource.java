package br.org.senai.lab.resource;
import br.org.senai.lab.dto.ProjectDtos.*;
import br.org.senai.lab.service.ProjectService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
@Path("/api/projects") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class ProjectResource {
  @Inject ProjectService service;
  @GET public List<Project> list(){return service.list();}
  @GET @Path("/{id}") public Project get(@PathParam("id") String id){return service.get(id);}
  @PUT @Path("/{id}") public Project update(@PathParam("id") String id,@NotNull @Valid Update input){return service.update(id,input);}
}
