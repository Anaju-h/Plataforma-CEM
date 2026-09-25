package br.org.senai.lab.resource;
import br.org.senai.lab.dto.*;
import br.org.senai.lab.service.CustomerService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;
@Path("/api/customer") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class CustomerResource {
  @Inject CustomerService service;
  @GET @Path("/context") public Map<String,Object> context(){return service.current();}
  @PUT @Path("/profile") public Map<String,Object> profile(CustomerService.ProfileInput input){return service.updateProfile(input);}
  @PUT @Path("/company") public Map<String,Object> company(CustomerService.CompanyInput input){return service.updateCompany(input);}
  @POST @Path("/password") public Map<String,Object> password(CustomerService.PasswordInput input){return service.changePassword(input);}
  @POST @Path("/closure-request") public Map<String,Object> closure(CustomerService.ClosureInput input){return service.requestClosure(input);}
  @GET @Path("/requests") public List<Map<String,Object>> requests(){return service.requests();}
  @GET @Path("/requests/{id}/attachments/{attachmentId}") @Produces(MediaType.WILDCARD)
  public jakarta.ws.rs.core.Response attachment(@PathParam("id") String id,@PathParam("attachmentId") String attachmentId){
    var file=service.attachment(id,attachmentId);
    return jakarta.ws.rs.core.Response.ok(file.content(),file.contentType())
      .header("Content-Disposition","inline; filename*=UTF-8''"+java.net.URLEncoder.encode(file.name(),java.nio.charset.StandardCharsets.UTF_8).replace("+","%20"))
      .header("X-Content-Type-Options","nosniff").build();
  }
  @GET @Path("/requests/{id}") public Map<String,Object> request(@PathParam("id") String id){return service.request(id);}
  @POST @Path("/requests") public Map<String,Object> create(@Valid RequestDtos.Create input){return service.create(input);}
  @GET @Path("/quotes") public List<Map<String,Object>> quotes(){return service.quotes();}
  @GET @Path("/quotes/{id}") public Map<String,Object> quote(@PathParam("id") String id){return service.quote(id);}
  @POST @Path("/quotes/{id}/proposal/versions/{version}/result") public Map<String,Object> result(@PathParam("id") String id,@PathParam("version") int version,@Valid QuoteDtos.Result input){return service.result(id,version,input);}
  @GET @Path("/projects") public List<Map<String,Object>> projects(){return service.projects();}
  @GET @Path("/projects/{id}") public Map<String,Object> project(@PathParam("id") String id){return service.project(id);}
}
