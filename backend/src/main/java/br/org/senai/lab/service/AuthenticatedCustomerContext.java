package br.org.senai.lab.service;

import br.org.senai.lab.entity.CustomerUserEntity;
import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.security.SessionCookies;
import io.smallrye.jwt.auth.principal.JWTParser;
import io.smallrye.jwt.auth.principal.ParseException;
import io.vertx.core.http.HttpServerRequest;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import java.util.UUID;

/** Customer identity from the signed HttpOnly customer cookie. Never from headers, query string, e-mail or browser storage. */
@RequestScoped
public class AuthenticatedCustomerContext implements CustomerContext {
  @Inject HttpServerRequest request;
  @Inject JWTParser parser;
  @Inject EntityManager em;
  private CustomerUserEntity cached;

  public CustomerUserEntity current(){
    if(cached!=null)return cached;
    var cookie=request.getCookie(SessionCookies.CUSTOMER);
    if(cookie==null||cookie.getValue()==null||cookie.getValue().isBlank())throw new ApiException(401,"Entre na área do cliente para continuar.");
    UUID id;
    try{
      var jwt=parser.parse(cookie.getValue());
      if(!jwt.getGroups().contains(SessionCookies.CUSTOMER_GROUP))throw new ApiException(401,"Sessão inválida.");
      id=UUID.fromString(jwt.getSubject());
    }catch(ParseException|IllegalArgumentException e){throw new ApiException(401,"Sessão expirada. Entre novamente.");}
    var user=em.find(CustomerUserEntity.class,id);
    if(user==null||!user.active)throw new ApiException(401,"Conta indisponível.");
    cached=user;return user;
  }
}
