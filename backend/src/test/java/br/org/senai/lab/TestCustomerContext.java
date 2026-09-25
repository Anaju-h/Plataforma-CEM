package br.org.senai.lab;
import br.org.senai.lab.entity.CustomerUserEntity;
import br.org.senai.lab.service.CustomerContext;
import br.org.senai.lab.exception.ApiException;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Alternative;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import java.util.UUID;
/** Test-only identity switching, never packaged in the application. */
@Alternative @Priority(1) @ApplicationScoped
public class TestCustomerContext implements CustomerContext {
  public static volatile UUID selected;
  @Inject EntityManager em;
  public CustomerUserEntity current(){
    var user=selected==null?null:em.find(CustomerUserEntity.class,selected);
    if(user==null||!user.active)throw new ApiException(403,"Cliente indisponível.");
    return user;
  }
}
