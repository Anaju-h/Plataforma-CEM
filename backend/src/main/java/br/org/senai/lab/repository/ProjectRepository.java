package br.org.senai.lab.repository;
import br.org.senai.lab.entity.ProjectEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import java.util.*;
@ApplicationScoped
public class ProjectRepository {
  @PersistenceContext EntityManager em;
  public List<ProjectEntity> list(){return em.createQuery("from ProjectEntity order by createdAt desc",ProjectEntity.class).getResultList();}
  public ProjectEntity find(String id,boolean lock){
    UUID uuid=null;try{uuid=UUID.fromString(id);}catch(IllegalArgumentException ignored){}
    var query=em.createQuery(uuid==null?"from ProjectEntity where projectCode=:id":"from ProjectEntity where id=:id",ProjectEntity.class).setParameter("id",uuid==null?id:uuid);
    if(lock)query.setLockMode(LockModeType.PESSIMISTIC_WRITE);
    return query.getResultStream().findFirst().orElse(null);
  }
  public ProjectEntity byQuote(UUID id){return em.createQuery("from ProjectEntity where quote.id=:id",ProjectEntity.class).setParameter("id",id).getResultStream().findFirst().orElse(null);}
  public long nextNumber(){return ((Number)em.createNativeQuery("SELECT NEXT VALUE FOR project_code_seq").getSingleResult()).longValue();}
  public void persist(ProjectEntity project){em.persist(project);}
  public void flush(){em.flush();}
}
