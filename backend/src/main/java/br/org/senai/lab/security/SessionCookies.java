package br.org.senai.lab.security;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.NewCookie;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import java.time.Duration;
import java.util.Map;
import java.util.Set;

/** Issues signed JWTs (Quarkus SmallRye JWT) delivered only in HttpOnly, SameSite=Strict cookies. Never readable by JavaScript. */
@ApplicationScoped
public class SessionCookies {
  public static final String INTERNAL="lab_session";
  public static final String CUSTOMER="lab_customer";
  public static final String ISSUER="lab-platform";
  public static final String CUSTOMER_GROUP="CUSTOMER";

  @ConfigProperty(name="lab.auth.cookie-secure",defaultValue="false") boolean secure;
  @ConfigProperty(name="lab.auth.session-hours",defaultValue="8") long hours;

  public NewCookie issue(String cookieName,String subject,String email,String group,Map<String,Object> claims){
    var builder=Jwt.issuer(ISSUER).subject(subject).upn(email).groups(Set.of(group)).expiresIn(Duration.ofHours(hours));
    claims.forEach(builder::claim);
    // Cookie de sessão do navegador (sem Max-Age): fechar o navegador encerra o acesso. O JWT expira em "hours" de qualquer forma.
    return cookie(cookieName,builder.sign(),NewCookie.DEFAULT_MAX_AGE);
  }

  public NewCookie clear(String cookieName){return cookie(cookieName,"",0);}

  private NewCookie cookie(String name,String value,int maxAge){
    return new NewCookie.Builder(name).value(value).path("/").httpOnly(true).secure(secure)
      .sameSite(NewCookie.SameSite.STRICT).maxAge(maxAge).build();
  }
}
