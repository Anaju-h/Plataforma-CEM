package br.org.senai.lab.repository;
import br.org.senai.lab.entity.RequestEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import java.util.*;
@ApplicationScoped
public class RequestRepository {
  @PersistenceContext EntityManager em;
  public List<RequestEntity> list() { return em.createQuery("select distinct r from RequestEntity r order by r.createdAt desc",RequestEntity.class).getResultList(); }
  public RequestEntity find(String code) { return em.createQuery("select r from RequestEntity r where r.requestCode=:code",RequestEntity.class).setParameter("code",code).getResultStream().findFirst().orElse(null); }
  public RequestEntity findLocked(String code) { return em.createQuery("select r from RequestEntity r where r.requestCode=:code",RequestEntity.class).setParameter("code",code).setLockMode(LockModeType.PESSIMISTIC_WRITE).getResultStream().findFirst().orElse(null); }
  public long nextNumber() { return ((Number)em.createNativeQuery("SELECT NEXT VALUE FOR request_code_seq").getSingleResult()).longValue(); }
  public void persist(RequestEntity request) { em.persist(request); }
}
