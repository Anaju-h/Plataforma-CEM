package br.org.senai.lab.resource;

import br.org.senai.lab.entity.InternalUserEntity;
import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.security.CurrentUser;
import br.org.senai.lab.security.LoginAttemptGuard;
import br.org.senai.lab.security.SessionCookies;
import br.org.senai.lab.service.AuthService;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import io.vertx.core.http.HttpServerRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;
import java.util.function.Supplier;

@Path("/api/auth") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
  @Inject AuthService auth;
  @Inject SessionCookies cookies;
  @Inject CurrentUser current;
  @Inject EntityManager em;
  @Inject LoginAttemptGuard attempts;

  /** Aplica o limite de tentativas em volta do login: bloqueio → 429; senha errada → conta a falha. */
  private Response guarded(String kind,AuthService.Login input,HttpServerRequest request,Supplier<AuthService.Session> login){
    String email=input==null?null:input.email();
    String ip=request==null||request.remoteAddress()==null?null:request.remoteAddress().hostAddress();
    attempts.check(kind,email,ip);
    try{
      var s=login.get();attempts.success(kind,email);
      return Response.ok(s.body()).cookie(s.cookie()).build();
    }catch(ApiException e){
      if(e.status==401)attempts.failure(kind,email,ip);
      throw e;
    }
  }

  @POST @Path("/login")
  public Response login(AuthService.Login input,@Context HttpServerRequest request){return guarded("internal",input,request,()->auth.loginInternal(input));}

  @POST @Path("/logout")
  public Response logout(){return Response.ok(Map.of("ok",true)).cookie(cookies.clear(SessionCookies.INTERNAL)).build();}

  @GET @Path("/me") @Transactional
  public Map<String,Object> me(){
    if(!current.authenticated())throw new ApiException(401,"Sessão não iniciada.");
    var user=em.find(InternalUserEntity.class,current.id());
    if(user==null||!user.active)throw new ApiException(401,"Sessão inválida.");
    return AuthService.internalView(user);
  }

  @PUT @Path("/me")
  public Response updateMe(AuthService.AccountUpdate input){
    if(!current.authenticated())throw new ApiException(401,"Sessão não iniciada.");
    var s=auth.updateInternal(current.id(),input);return Response.ok(s.body()).cookie(s.cookie()).build();
  }

  @POST @Path("/customer/login")
  public Response customerLogin(AuthService.Login input,@Context HttpServerRequest request){return guarded("customer",input,request,()->auth.loginCustomer(input));}

  @POST @Path("/customer/register")
  public Response register(AuthService.Register input){var s=auth.register(input);return Response.status(201).entity(s.body()).cookie(s.cookie()).build();}

  @POST @Path("/customer/logout")
  public Response customerLogout(){return Response.ok(Map.of("ok",true)).cookie(cookies.clear(SessionCookies.CUSTOMER)).build();}
}
