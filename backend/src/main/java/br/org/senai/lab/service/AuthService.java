package br.org.senai.lab.service;

import br.org.senai.lab.entity.*;
import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.security.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.NewCookie;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;

@ApplicationScoped
public class AuthService {
  private static final String INVALID="E-mail ou senha inválidos.";
  @Inject EntityManager em;
  @Inject SessionCookies cookies;

  public record Login(String email,String password,String requestId,String claimToken) {}
  public record Register(String company,String document,String name,String email,String phone,String password,String requestId,String claimToken) {}
  public record Session(Map<String,Object> body,NewCookie cookie) {}

  // ---------- internal ----------
  @Transactional public Session loginInternal(Login input){
    var user=em.createQuery("from InternalUserEntity where lower(email)=:email",InternalUserEntity.class)
      .setParameter("email",normalize(input==null?null:input.email())).getResultStream().findFirst().orElse(null);
    if(user==null||!user.active||!PasswordHasher.matches(input.password(),user.passwordHash))throw new ApiException(401,INVALID);
    return new Session(internalView(user),cookies.issue(SessionCookies.INTERNAL,user.id.toString(),user.email,user.role,Map.of("name",user.name,"kind","internal")));
  }
  public static Map<String,Object> internalView(InternalUserEntity u){
    return QuoteService.map("id",u.id,"name",u.name,"email",u.email,"role",u.role);
  }

  /** Minha conta (interno): nome, e-mail e senha. E-mail ou senha só mudam com a senha atual. Reemite o cookie com o novo nome. */
  public record AccountUpdate(String name,String email,String currentPassword,String newPassword) {}
  @Transactional public Session updateInternal(UUID id,AccountUpdate in){
    var user=em.find(InternalUserEntity.class,id,LockModeType.PESSIMISTIC_WRITE);
    if(user==null||!user.active)throw new ApiException(401,"Sessão inválida.");
    if(in==null||blank(in.name()))throw bad("Informe o nome.");
    String email=normalize(in.email()==null?user.email:in.email());
    if(!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))throw bad("Informe um e-mail válido.");
    boolean emailChanged=!email.equalsIgnoreCase(user.email),passwordChanged=!blank(in.newPassword());
    if((emailChanged||passwordChanged)&&!PasswordHasher.matches(in.currentPassword()==null?"":in.currentPassword(),user.passwordHash))throw bad("Senha atual incorreta.");
    if(emailChanged&&!em.createQuery("from InternalUserEntity where lower(email)=:e and id<>:id",InternalUserEntity.class).setParameter("e",email).setParameter("id",id).getResultList().isEmpty())
      throw new ApiException(409,"Já existe um usuário com este e-mail.");
    if(passwordChanged&&in.newPassword().length()<8)throw bad("A nova senha deve ter pelo menos 8 caracteres.");
    user.name=in.name().trim();user.email=email;if(passwordChanged)user.passwordHash=PasswordHasher.hash(in.newPassword());
    user.updatedAt=LocalDateTime.now(ZoneOffset.UTC);
    return new Session(internalView(user),cookies.issue(SessionCookies.INTERNAL,user.id.toString(),user.email,user.role,Map.of("name",user.name,"kind","internal")));
  }

  /** Área do cliente: troca de senha com a senha atual. */
  @Transactional public void changeCustomerPassword(CustomerUserEntity user,String current,String next){
    var fresh=em.find(CustomerUserEntity.class,user.id,LockModeType.PESSIMISTIC_WRITE);
    if(!PasswordHasher.matches(current==null?"":current,fresh.passwordHash))throw bad("Senha atual incorreta.");
    if(next==null||next.length()<8)throw bad("A nova senha deve ter pelo menos 8 caracteres.");
    fresh.passwordHash=PasswordHasher.hash(next);fresh.updatedAt=LocalDateTime.now(ZoneOffset.UTC);
  }

  // ---------- customer ----------
  @Transactional public Session loginCustomer(Login input){
    var user=customerByEmail(input==null?null:input.email());
    if(user==null||!user.active||!PasswordHasher.matches(input.password(),user.passwordHash))throw new ApiException(401,INVALID);
    claim(input.requestId(),input.claimToken(),user);
    return customerSession(user);
  }

  @Transactional public Session register(Register input){
    if(input==null)throw bad("Dados obrigatórios ausentes.");
    String email=normalize(input.email());
    if(blank(input.company())||blank(input.name())||email.isEmpty()||!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))throw bad("Informe empresa, nome e um e-mail válido.");
    if(input.password()==null||input.password().length()<8)throw bad("A senha deve ter pelo menos 8 caracteres.");
    if(customerByEmail(email)!=null)throw new ApiException(409,"Já existe uma conta com este e-mail. Entre com sua senha.");
    var now=LocalDateTime.now(ZoneOffset.UTC);
    var company=new CustomerCompanyEntity();company.id=UUID.randomUUID();company.name=input.company().trim();
    company.document=trim(input.document());company.phone=trim(input.phone());company.createdAt=now;company.updatedAt=now;em.persist(company);
    var user=new CustomerUserEntity();user.id=UUID.randomUUID();user.company=company;user.name=input.name().trim();user.email=email;
    user.phone=trim(input.phone());user.active=true;user.passwordHash=PasswordHasher.hash(input.password());user.createdAt=now;user.updatedAt=now;em.persist(user);
    em.flush();
    claim(input.requestId(),input.claimToken(),user);
    return customerSession(user);
  }

  private Session customerSession(CustomerUserEntity user){
    var body=QuoteService.map("id",user.id,"name",user.name,"email",user.email,"company",user.company.name);
    return new Session(body,cookies.issue(SessionCookies.CUSTOMER,user.id.toString(),user.email,SessionCookies.CUSTOMER_GROUP,Map.of("name",user.name,"kind","customer")));
  }

  /** Links a public-form SOL to the account only with the one-time token returned when that SOL was created. */
  private void claim(String requestId,String token,CustomerUserEntity user){
    if(blank(requestId)||blank(token))return;
    var request=em.createQuery("from RequestEntity where requestCode=:code",RequestEntity.class).setParameter("code",requestId.trim())
      .setLockMode(LockModeType.PESSIMISTIC_WRITE).getResultStream().findFirst().orElse(null);
    if(request==null||request.customerUserId!=null||!Tokens.sameHash(token,request.claimTokenHash))throw new ApiException(409,"Não foi possível vincular esta solicitação à conta.");
    request.customerCompanyId=user.company.id;request.customerUserId=user.id;request.claimTokenHash=null;request.updatedAt=LocalDateTime.now(ZoneOffset.UTC);
    var event=new HistoryEntity();event.id=UUID.randomUUID();event.request=request;event.occurredAt=request.updatedAt;event.actor="Cliente";
    event.action="Solicitação vinculada à conta";event.description="O solicitante vinculou esta solicitação à área do cliente.";request.history.add(event);
  }

  private CustomerUserEntity customerByEmail(String email){
    return em.createQuery("from CustomerUserEntity where lower(email)=:email and active=true",CustomerUserEntity.class)
      .setParameter("email",normalize(email)).setMaxResults(1).getResultStream().findFirst().orElse(null);
  }
  private static String normalize(String email){return email==null?"":email.trim().toLowerCase(Locale.ROOT);}
  private static boolean blank(String value){return value==null||value.isBlank();}
  private static String trim(String value){return blank(value)?null:value.trim();}
  private static ApiException bad(String message){return new ApiException(400,message);}
}
