package br.org.senai.lab.resource;
import br.org.senai.lab.dto.QuoteDtos.*;
import br.org.senai.lab.service.QuoteService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;
@Path("/api/quotes") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class QuoteResource {
  @Inject QuoteService service;
  @Inject br.org.senai.lab.service.ProjectService projects;
  @POST @Path("/{id}/project") @Consumes(MediaType.WILDCARD) public br.org.senai.lab.dto.ProjectDtos.Project createProject(@PathParam("id") String id){return projects.create(id);}
  @GET public List<Map<String,Object>> list(){return service.list();}
  @GET @Path("/{id}") public Map<String,Object> get(@PathParam("id") String id){return service.get(id);}
  @PUT @Path("/{id}") public Map<String,Object> update(@PathParam("id") String id,@Valid Update dto){return service.update(id,dto);}
  @POST @Path("/{id}/status") public Map<String,Object> status(@PathParam("id") String id,@Valid Status dto){return service.status(id,dto);}
}
