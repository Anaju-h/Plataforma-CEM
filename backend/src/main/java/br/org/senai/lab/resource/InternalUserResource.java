package br.org.senai.lab.resource;

import br.org.senai.lab.entity.InternalUserEntity;
import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.security.CurrentUser;
import br.org.senai.lab.security.PasswordHasher;
import br.org.senai.lab.service.AuthService;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;

/** User management (Administrador only). Profiles: CONSULTA, TECNICO, VALIDADOR, ADMIN. */
@Path("/api/admin/users") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class InternalUserResource {
  @Inject EntityManager em;
  @Inject CurrentUser current;

  public record Input(String name,String email,String role,String password,Boolean active) {}

  @GET @Transactional public List<Map<String,Object>> list(){
    current.requireAtLeast("ADMIN");
    return em.createQuery("from InternalUserEntity order by name",InternalUserEntity.class).getResultList().stream().map(u->{
      var view=new LinkedHashMap<>(AuthService.internalView(u));view.put("active",u.active);return (Map<String,Object>)view;}).toList();
  }

  @POST @Transactional public Map<String,Object> create(Input in){
    current.requireAtLeast("ADMIN");
    if(in==null||blank(in.name())||blank(in.email())||!CurrentUser.ROLES.contains(in.role()))throw new ApiException(400,"Informe nome, e-mail e perfil.");
    if(in.password()==null||in.password().length()<8)throw new ApiException(400,"A senha inicial deve ter pelo menos 8 caracteres.");
    String email=in.email().trim().toLowerCase(Locale.ROOT);
    if(!em.createQuery("from InternalUserEntity where lower(email)=:e",InternalUserEntity.class).setParameter("e",email).getResultList().isEmpty())throw new ApiException(409,"Já existe um usuário com este e-mail.");
    var u=new InternalUserEntity();u.id=UUID.randomUUID();u.name=in.name().trim();u.email=email;u.role=in.role();u.passwordHash=PasswordHasher.hash(in.password());
    u.active=true;u.createdAt=LocalDateTime.now(ZoneOffset.UTC);u.updatedAt=u.createdAt;em.persist(u);
    return AuthService.internalView(u);
  }

  @PUT @Path("/{id}") @Transactional public Map<String,Object> update(@PathParam("id") UUID id,Input in){
    current.requireAtLeast("ADMIN");
    var u=em.find(InternalUserEntity.class,id);if(u==null)throw new ApiException(404,"Usuário não encontrado.");
    if(in==null)throw new ApiException(400,"Dados ausentes.");
    boolean self=u.id.equals(current.id());
    if(in.role()!=null){if(!CurrentUser.ROLES.contains(in.role()))throw new ApiException(400,"Perfil inválido.");if(self&&!"ADMIN".equals(in.role()))throw new ApiException(409,"Você não pode remover o próprio perfil de Administrador.");u.role=in.role();}
    if(in.active()!=null){if(self&&!in.active())throw new ApiException(409,"Você não pode desativar a própria conta.");u.active=in.active();}
    if(!blank(in.name()))u.name=in.name().trim();
    if(in.password()!=null){if(in.password().length()<8)throw new ApiException(400,"A senha deve ter pelo menos 8 caracteres.");u.passwordHash=PasswordHasher.hash(in.password());}
    u.updatedAt=LocalDateTime.now(ZoneOffset.UTC);
    var view=new LinkedHashMap<>(AuthService.internalView(u));view.put("active",u.active);return view;
  }
  private static boolean blank(String v){return v==null||v.isBlank();}
}
