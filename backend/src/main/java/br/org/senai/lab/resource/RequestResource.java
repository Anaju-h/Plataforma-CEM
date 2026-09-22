package br.org.senai.lab.resource;
import br.org.senai.lab.dto.RequestDtos.*;
import br.org.senai.lab.service.RequestService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
@Path("/api/requests") @Produces(MediaType.APPLICATION_JSON)
public class RequestResource {
  @Inject RequestService service;
  @GET public List<Response> list(){return service.list();}
  @GET @Path("/{id}") public Response get(@PathParam("id") String id){return service.get(id);}
  @POST @Consumes(MediaType.APPLICATION_JSON) public jakarta.ws.rs.core.Response create(@Valid Create dto){Response r=service.create(dto);return jakarta.ws.rs.core.Response.status(201).entity(r).build();}
  @POST @Path("/{id}/analysis/start") public Response start(@PathParam("id") String id){return service.start(id);}
  @PUT @Path("/{id}/analysis") @Consumes(MediaType.APPLICATION_JSON) public Response save(@PathParam("id") String id,AnalysisUpdate dto){return service.save(id,dto);}
  @POST @Path("/{id}/analysis/resume") public Response resume(@PathParam("id") String id){return service.resume(id);}
  @POST @Path("/{id}/analysis/finish") @Consumes(MediaType.APPLICATION_JSON) public Response finish(@PathParam("id") String id,Finish dto){return service.finish(id,dto);}
  @PUT @Path("/{id}/internal-notes") @Consumes(MediaType.APPLICATION_JSON) public Response notes(@PathParam("id") String id,Notes dto){return service.notes(id,dto);}
  @PUT @Path("/{id}/responsible") @Consumes(MediaType.APPLICATION_JSON) public Response assign(@PathParam("id") String id,@Valid Assignment dto){return service.assign(id,dto);}
  @POST @Path("/{id}/cancel") @Consumes(MediaType.APPLICATION_JSON) public Response cancel(@PathParam("id") String id,@Valid Cancel dto){return service.cancel(id,dto);}
}
