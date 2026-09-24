package br.org.senai.lab.resource;
import br.org.senai.lab.dto.QuoteDtos.*;
import br.org.senai.lab.service.ProposalService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;
@Path("/api/quotes/{id}/proposal") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class ProposalResource {
  @Inject ProposalService service;
  @GET public Map<String,Object> get(@PathParam("id") String id){return service.get(id);}
  @POST @Consumes(MediaType.WILDCARD) public Map<String,Object> open(@PathParam("id") String id){return service.open(id);}
  @PUT public Map<String,Object> save(@PathParam("id") String id,@Valid ProposalDraft dto){return service.save(id,dto);}
  @GET @Path("/document") public Map<String,Object> document(@PathParam("id") String id){return service.document(id);}
  @POST @Path("/draft") public Map<String,Object> next(@PathParam("id") String id,Map<String,Long> dto){return service.next(id,dto);}
  @POST @Path("/versions") public Map<String,Object> generate(@PathParam("id") String id,@Valid Generate dto){return service.generate(id,dto);}
  @POST @Path("/versions/{number}/result") public Map<String,Object> result(@PathParam("id") String id,@PathParam("number") int number,@Valid Result dto){return service.result(id,number,dto);}
}
