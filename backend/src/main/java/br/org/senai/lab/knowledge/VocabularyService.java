package br.org.senai.lab.knowledge;

import br.org.senai.lab.entity.KmTermEntity;
import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.security.CurrentUser;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.*;
import static br.org.senai.lab.knowledge.Km.*;

/** Organizar: controlled vocabulary maintained on screen by the Administrator. No free text classifies a service. */
@ApplicationScoped
public class VocabularyService {
  @Inject EntityManager em;
  @Inject CurrentUser user;

  public record TermInput(String classCode,String label,String description,String guidance,Boolean active,Integer sortOrder) {}

  @Transactional public Map<String,Object> vocabulary(){
    var terms=em.createQuery("from KmTermEntity order by classCode, sortOrder, label",KmTermEntity.class).getResultList();
    List<Map<String,Object>> classes=new ArrayList<>();
    for(String code:CLASSES){
      classes.add(map("code",code,"label",CLASS_LABELS.get(code),"terms",terms.stream().filter(t->t.classCode.equals(code)).map(VocabularyService::view).toList()));
    }
    return map("classes",classes,"tolerance",tolerance());
  }
  static Map<String,Object> view(KmTermEntity t){
    return map("id",t.id,"classCode",t.classCode,"label",t.label,"description",t.description,"guidance",t.guidance,"active",t.active,"sortOrder",t.sortOrder);
  }

  @Transactional public Map<String,Object> create(TermInput input){
    user.requireAtLeast("ADMIN");
    if(input==null||!CLASSES.contains(input.classCode()))throw bad("Classe do vocabulário inválida.");
    if(blank(input.label()))throw bad("Informe o termo.");
    ensureUnique(input.classCode(),input.label().trim(),null);
    var t=new KmTermEntity();t.id=UUID.randomUUID();t.classCode=input.classCode();t.label=input.label().trim();
    t.description=trim(input.description());t.guidance=trim(input.guidance());t.active=input.active()==null||input.active();
    t.sortOrder=input.sortOrder()==null?999:input.sortOrder();t.createdAt=now();t.updatedAt=t.createdAt;em.persist(t);
    return view(t);
  }

  @Transactional public Map<String,Object> update(UUID id,TermInput input){
    user.requireAtLeast("ADMIN");
    var t=em.find(KmTermEntity.class,id);if(t==null)throw notFound();
    if(input==null)throw bad("Dados ausentes.");
    if(!blank(input.label())&&!input.label().trim().equals(t.label)){ensureUnique(t.classCode,input.label().trim(),t.id);t.label=input.label().trim();}
    if(input.description()!=null)t.description=trim(input.description());
    if(input.guidance()!=null)t.guidance=trim(input.guidance());
    if(input.active()!=null)t.active=input.active();
    if(input.sortOrder()!=null)t.sortOrder=input.sortOrder();
    t.updatedAt=now();
    return view(t);
  }

  private void ensureUnique(String classCode,String label,UUID except){
    var clash=em.createQuery("from KmTermEntity where classCode=:c and lower(label)=:l",KmTermEntity.class)
      .setParameter("c",classCode).setParameter("l",label.toLowerCase(Locale.ROOT)).getResultStream().filter(t->!t.id.equals(except)).findFirst();
    if(clash.isPresent())throw conflict("Já existe o termo \""+clash.get().label+"\" nesta classe. Reutilize-o para manter o histórico comparável.");
  }

  /** Map of all terms (active or not) for rendering historical records. */
  public Map<UUID,KmTermEntity> terms(){
    Map<UUID,KmTermEntity> all=new HashMap<>();
    em.createQuery("from KmTermEntity",KmTermEntity.class).getResultList().forEach(t->all.put(t.id,t));
    return all;
  }
  /** Validates that a term exists, belongs to the class and is active (for new classifications). */
  public KmTermEntity require(UUID id,String classCode,boolean required){
    if(id==null){if(required)throw bad("Selecione: "+CLASS_LABELS.get(classCode)+".");return null;}
    var t=em.find(KmTermEntity.class,id);
    if(t==null||!t.classCode.equals(classCode))throw bad("Termo inválido para "+CLASS_LABELS.get(classCode)+".");
    if(!t.active)throw bad("O termo \""+t.label+"\" está desativado no vocabulário.");
    return t;
  }
  public void requireAll(Collection<UUID> ids,String classCode){if(ids!=null)ids.forEach(id->require(id,classCode,true));}
  public void requireAny(Collection<UUID> ids){
    if(ids==null)return;
    for(UUID id:ids){var t=em.find(KmTermEntity.class,id);if(t==null)throw bad("Assunto inválido.");}
  }

  @Transactional public double tolerance(){
    var rows=em.createNativeQuery("SELECT setting_value FROM km_setting WHERE setting_key='assertiveness_tolerance'").getResultList();
    try{return rows.isEmpty()?0.15:Double.parseDouble(String.valueOf(rows.get(0)));}catch(NumberFormatException e){return 0.15;}
  }
  @Transactional public Map<String,Object> setTolerance(Double value){
    user.requireAtLeast("ADMIN");
    if(value==null||value<=0||value>=1)throw bad("Informe a tolerância entre 1% e 99%.");
    int updated=em.createNativeQuery("UPDATE km_setting SET setting_value=:v, updated_at=SYSUTCDATETIME() WHERE setting_key='assertiveness_tolerance'")
      .setParameter("v",String.valueOf(value)).executeUpdate();
    if(updated==0)throw new ApiException(500,"Configuração ausente.");
    return map("tolerance",value);
  }
}
