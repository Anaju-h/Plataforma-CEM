package br.org.senai.lab.security;

import br.org.senai.lab.exception.ApiException;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;
import java.util.List;
import java.util.UUID;

/** Internal user resolved from the verified session JWT. Roles are cumulative: CONSULTA < TECNICO < VALIDADOR < ADMIN. */
@RequestScoped
public class CurrentUser {
  public static final List<String> ROLES=List.of("CONSULTA","TECNICO","VALIDADOR","ADMIN");
  @Inject JsonWebToken jwt;

  public boolean authenticated(){return jwt!=null&&jwt.getSubject()!=null&&ROLES.stream().anyMatch(role->jwt.getGroups().contains(role));}
  public UUID id(){require();return UUID.fromString(jwt.getSubject());}
  public String name(){
    if(!authenticated())return "Sistema";
    Object name=jwt.getClaim("name");
    if(name instanceof jakarta.json.JsonString text)return text.getString();
    return name==null?jwt.getName():name.toString();
  }
  public String role(){require();return ROLES.stream().filter(role->jwt.getGroups().contains(role)).findFirst().orElseThrow();}
  public int level(){return authenticated()?ROLES.indexOf(role()):-1;}
  public boolean atLeast(String role){return level()>=ROLES.indexOf(role);}
  public void requireAtLeast(String role){require();if(!atLeast(role))throw new ApiException(403,"Seu perfil não permite esta ação.");}
  private void require(){if(!authenticated())throw new ApiException(401,"Sessão expirada. Entre novamente.");}
}
