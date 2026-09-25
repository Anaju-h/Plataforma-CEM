package br.org.senai.lab.knowledge;

import br.org.senai.lab.entity.*;
import br.org.senai.lab.security.CurrentUser;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;
import java.util.*;
import static br.org.senai.lab.knowledge.Km.*;

/**
 * Formalizar + Disseminar. Lesson states: DRAFT → IN_VALIDATION → FORMALIZED → SUPERSEDED.
 * Only FORMALIZED knowledge feeds the Assistant. Superseded knowledge stays searchable, never deleted.
 * On formalization, users subscribed to any lesson subject get an in-app notice.
 */
@ApplicationScoped
public class LessonService {
  public static final Map<String,String> STATUS_LABELS=Map.of("DRAFT","Rascunho","IN_VALIDATION","Em validação","FORMALIZED","Formalizada","SUPERSEDED","Superada");
  @Inject EntityManager em;
  @Inject VocabularyService vocabulary;
  @Inject CurrentUser user;

  public record Update(String title,String body,List<UUID> subjectIds,String confidentiality) {}
  public record Decision(String decision,String note) {}

  KmLessonEntity createForRecord(KmRecordEntity r,String title,String body,Set<UUID> subjects,String confidentiality,boolean submit){
    vocabulary.requireAny(subjects);
    var l=new KmLessonEntity();l.id=UUID.randomUUID();l.code=code("LIC",((Number)em.createNativeQuery("SELECT NEXT VALUE FOR km_lesson_seq").getSingleResult()).longValue());
    l.recordId=r.id;l.demo=r.demo;l.confidentiality=RecordService.confidentiality(confidentiality);l.title=title.trim();l.body=body.trim();l.author=user.name();
    l.createdAt=now();l.updatedAt=l.createdAt;l.status=submit?"IN_VALIDATION":"DRAFT";if(submit)l.submittedAt=l.createdAt;l.subjects.addAll(subjects);
    em.persist(l);return l;
  }

  @Transactional public List<Map<String,Object>> list(String status){
    var q=em.createQuery("from KmLessonEntity l where 1=1"+(user.atLeast("VALIDADOR")?"":" and l.confidentiality='PUBLIC'")
      +(blank(status)?"":" and l.status=:s")+" order by l.updatedAt desc",KmLessonEntity.class);
    if(!blank(status))q.setParameter("s",status);
    var terms=vocabulary.terms();
    return q.getResultList().stream().map(l->view(l,terms)).toList();
  }
  List<Map<String,Object>> forRecord(UUID recordId){
    var terms=vocabulary.terms();
    return em.createQuery("from KmLessonEntity where recordId=:r order by createdAt",KmLessonEntity.class).setParameter("r",recordId).getResultList().stream()
      .filter(l->"PUBLIC".equals(l.confidentiality)||user.atLeast("VALIDADOR")).map(l->view(l,terms)).toList();
  }

  @Transactional public Map<String,Object> update(String code,Update in){
    user.requireAtLeast("TECNICO");
    var l=find(code);
    if(!"DRAFT".equals(l.status))throw conflict("Somente lições em rascunho podem ser editadas.");
    if(in==null)throw bad("Dados ausentes.");
    if(!blank(in.title()))l.title=in.title().trim();
    if(!blank(in.body()))l.body=in.body().trim();
    if(in.subjectIds()!=null){vocabulary.requireAny(in.subjectIds());l.subjects.clear();l.subjects.addAll(in.subjectIds());}
    if(in.confidentiality()!=null)l.confidentiality=RecordService.confidentiality(in.confidentiality());
    l.updatedAt=now();return view(l,vocabulary.terms());
  }

  @Transactional public Map<String,Object> submit(String code){
    user.requireAtLeast("TECNICO");
    var l=find(code);
    if(!"DRAFT".equals(l.status))throw conflict("A lição já foi enviada.");
    l.status="IN_VALIDATION";l.submittedAt=now();l.updatedAt=l.submittedAt;
    return view(l,vocabulary.terms());
  }

  @Transactional public Map<String,Object> decide(String code,Decision in){
    user.requireAtLeast("VALIDADOR");
    var l=find(code);
    if(!"IN_VALIDATION".equals(l.status))throw conflict("Somente lições em validação podem ser analisadas.");
    if(in==null||!Set.of("FORMALIZE","RETURN").contains(in.decision()))throw bad("Decisão inválida.");
    if("RETURN".equals(in.decision())&&blank(in.note()))throw bad("Explique ao autor o que precisa ser ajustado.");
    l.validatedBy=user.name();l.validatedAt=now();l.validationNote=trim(in.note());l.updatedAt=l.validatedAt;
    if("RETURN".equals(in.decision())){l.status="DRAFT";return view(l,vocabulary.terms());}
    l.status="FORMALIZED";
    disseminate(l);
    return view(l,vocabulary.terms());
  }

  @Transactional public Map<String,Object> supersede(String code,Decision in){
    user.requireAtLeast("VALIDADOR");
    var l=find(code);
    if(!"FORMALIZED".equals(l.status))throw conflict("Somente conhecimento formalizado pode ser marcado como superado.");
    if(in==null||blank(in.note()))throw bad("Informe o motivo (ex.: mudou o equipamento, o processo ou a premissa).");
    l.status="SUPERSEDED";l.supersededBy=user.name();l.supersededAt=now();l.supersededReason=in.note().trim();l.updatedAt=l.supersededAt;
    return view(l,vocabulary.terms());
  }

  /** Disseminar: notify every active subscriber of any subject (restricted lessons only reach Validador/Admin). */
  void disseminate(KmLessonEntity l){
    if(l.subjects.isEmpty())return;
    var terms=vocabulary.terms();
    @SuppressWarnings("unchecked") List<Object[]> rows=em.createNativeQuery(
        "SELECT s.user_id, s.term_id, u.role FROM km_subscription s JOIN internal_user u ON u.id=s.user_id WHERE u.active=1 AND s.term_id IN (:terms)")
      .setParameter("terms",l.subjects.stream().map(UUID::toString).toList()).getResultList();
    Map<UUID,List<String>> byUser=new LinkedHashMap<>();
    for(Object[] row:rows){
      UUID userId=uuid(row[0]);String role=String.valueOf(row[2]);
      if("RESTRICTED".equals(l.confidentiality)&&!Set.of("VALIDADOR","ADMIN").contains(role))continue;
      var t=terms.get(uuid(row[1]));
      byUser.computeIfAbsent(userId,k->new ArrayList<>()).add(t==null?"assunto":t.label);
    }
    byUser.forEach((userId,subjects)->{
      var n=new KmNoticeEntity();n.id=UUID.randomUUID();n.userId=userId;n.lessonId=l.id;n.createdAt=now();
      String reason="Nova lição formalizada sobre "+String.join(", ",subjects);n.reason=reason.length()>400?reason.substring(0,397)+"...":reason;
      em.persist(n);
    });
  }

  // ---------------- notices & subscriptions ----------------
  @Transactional public Map<String,Object> notices(){
    var me=user.id();var terms=vocabulary.terms();
    var list=em.createQuery("from KmNoticeEntity where userId=:u order by createdAt desc",KmNoticeEntity.class).setParameter("u",me).setMaxResults(50).getResultList();
    List<Map<String,Object>> items=new ArrayList<>();
    for(var n:list){
      var l=em.find(KmLessonEntity.class,n.lessonId);if(l==null)continue;
      items.add(map("id",n.id,"reason",n.reason,"createdAt",n.createdAt,"read",n.readAt!=null,"lesson",view(l,terms)));
    }
    return map("unread",items.stream().filter(i->!Boolean.TRUE.equals(i.get("read"))).count(),"items",items);
  }
  @Transactional public Map<String,Object> markRead(UUID id){
    var me=user.id();
    if(id==null)em.createQuery("update KmNoticeEntity set readAt=:now where userId=:u and readAt is null").setParameter("now",now()).setParameter("u",me).executeUpdate();
    else{var n=em.find(KmNoticeEntity.class,id);if(n==null||!n.userId.equals(me))throw notFound();if(n.readAt==null)n.readAt=now();}
    return notices();
  }
  @Transactional public List<UUID> subscriptions(){
    @SuppressWarnings("unchecked") List<Object> rows=em.createNativeQuery("SELECT term_id FROM km_subscription WHERE user_id=:u").setParameter("u",user.id().toString()).getResultList();
    return rows.stream().map(LessonService::uuid).toList();
  }
  @Transactional public List<UUID> setSubscriptions(List<UUID> termIds){
    var me=user.id();
    vocabulary.requireAny(termIds);
    em.createNativeQuery("DELETE FROM km_subscription WHERE user_id=:u").setParameter("u",me.toString()).executeUpdate();
    if(termIds!=null)for(UUID term:new LinkedHashSet<>(termIds))
      em.createNativeQuery("INSERT INTO km_subscription(user_id,term_id) VALUES(:u,:t)").setParameter("u",me.toString()).setParameter("t",term.toString()).executeUpdate();
    return subscriptions();
  }

  // ---------------- helpers ----------------
  KmLessonEntity find(String code){
    var l=em.createQuery("from KmLessonEntity where code=:c",KmLessonEntity.class).setParameter("c",code).setLockMode(LockModeType.PESSIMISTIC_WRITE)
      .getResultStream().findFirst().orElseThrow(Km::notFound);
    if("RESTRICTED".equals(l.confidentiality)&&!user.atLeast("VALIDADOR"))throw notFound();
    return l;
  }
  static UUID uuid(Object value){return value instanceof UUID u?u:UUID.fromString(String.valueOf(value));}

  Map<String,Object> view(KmLessonEntity l,Map<UUID,KmTermEntity> terms){
    String recordCode=l.recordId==null?null:em.createQuery("select r.code from KmRecordEntity r where r.id=:id",String.class).setParameter("id",l.recordId).getResultStream().findFirst().orElse(null);
    return map("code",l.code,"demo",l.demo,"recordCode",recordCode,"confidentiality",l.confidentiality,"status",l.status,"statusLabel",STATUS_LABELS.get(l.status),
      "title",l.title,"body",l.body,"author",l.author,"createdAt",l.createdAt,"submittedAt",l.submittedAt,"validatedBy",l.validatedBy,"validatedAt",l.validatedAt,
      "validationNote",l.validationNote,"supersededBy",l.supersededBy,"supersededAt",l.supersededAt,"supersededReason",l.supersededReason,
      "feedsRecommendations","FORMALIZED".equals(l.status),
      "subjects",l.subjects.stream().map(id->{var t=terms.get(id);return map("id",id,"label",t==null?"?":t.label,"classCode",t==null?null:t.classCode);}).toList());
  }
}
