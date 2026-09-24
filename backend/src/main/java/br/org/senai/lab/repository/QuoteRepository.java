package br.org.senai.lab.repository;
import br.org.senai.lab.entity.QuoteEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import java.util.*;
@ApplicationScoped
public class QuoteRepository {
  @PersistenceContext EntityManager em;
  public List<QuoteEntity> list() { return em.createQuery("from QuoteEntity order by createdAt desc",QuoteEntity.class).getResultList(); }
  public QuoteEntity find(String code, boolean lock) {
    var query=em.createQuery("from QuoteEntity where quoteCode=:code",QuoteEntity.class).setParameter("code",code);
    if(lock) query.setLockMode(LockModeType.PESSIMISTIC_WRITE);
    return query.getResultStream().findFirst().orElse(null);
  }
  public QuoteEntity byRequest(UUID id) { return em.createQuery("from QuoteEntity where request.id=:id",QuoteEntity.class).setParameter("id",id).getResultStream().findFirst().orElse(null); }
  public long nextNumber() { return ((Number)em.createNativeQuery("SELECT NEXT VALUE FOR quote_code_seq").getSingleResult()).longValue(); }
  public void persist(QuoteEntity quote) { em.persist(quote); }
  public void flush() { em.flush(); }
}
