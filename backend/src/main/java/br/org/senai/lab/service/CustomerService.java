package br.org.senai.lab.service;

import br.org.senai.lab.dto.RequestDtos;
import br.org.senai.lab.dto.QuoteDtos;
import br.org.senai.lab.entity.*;
import br.org.senai.lab.exception.ApiException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.time.*;
import java.util.*;
import static br.org.senai.lab.service.QuoteService.map;

/** All customer queries are scoped in SQL, including direct links and mutations.
 * Explicit response allowlists: never serialize operational entities, internal statuses or internal history.
 * Every status shown to the customer is translated here ("tone": action | progress | done | closed). */
@ApplicationScoped @Transactional
public class CustomerService {
  static final ZoneId LAB_ZONE=ZoneId.of("America/Sao_Paulo");
  @Inject EntityManager em;
  @Inject CustomerContext context;
  @Inject RequestService requests;
  @Inject ProposalService proposals;
  @Inject QuoteService quotes;

  record Stage(String label,String tone){boolean active(){return !"done".equals(tone)&&!"closed".equals(tone);}}

  public Map<String,Object> current(){
    var u=context.current();var c=u.company;
    return map("temporary",false,"company",map("id",c.id,"name",c.name,"document",c.document,"phone",c.phone,"city",c.city,"state",c.state),
      "user",map("id",u.id,"name",u.name,"email",u.email,"phone",u.phone));
  }
  // ---------------- Minha conta ----------------
  public record ProfileInput(String name,String phone) {}
  public record CompanyInput(String name,String document,String phone,String city,String state) {}
  public record PasswordInput(String currentPassword,String newPassword) {}
  public record ClosureInput(String reason) {}
  @Inject AuthService auth;
  @Inject AuditService audit;

  public Map<String,Object> updateProfile(ProfileInput in){
    var u=em.find(CustomerUserEntity.class,context.current().id);
    if(in==null||in.name()==null||in.name().isBlank())throw new ApiException(400,"Informe seu nome.");
    u.name=limit(in.name(),250);u.phone=blankToNull(in.phone(),60);u.updatedAt=LocalDateTime.now(ZoneOffset.UTC);
    return current();
  }
  public Map<String,Object> updateCompany(CompanyInput in){
    var u=em.find(CustomerUserEntity.class,context.current().id);var c=u.company;
    if(in==null||in.name()==null||in.name().isBlank())throw new ApiException(400,"Informe o nome da empresa.");
    String document=in.document()==null?null:in.document().replaceAll("\\D","");
    if(document!=null&&!document.isEmpty()&&document.length()!=14)throw new ApiException(400,"CNPJ deve ter 14 dígitos.");
    c.name=limit(in.name(),250);c.document=document==null||document.isEmpty()?null:in.document().trim();c.phone=blankToNull(in.phone(),60);
    c.city=blankToNull(in.city(),120);c.state=blankToNull(in.state(),60);c.updatedAt=LocalDateTime.now(ZoneOffset.UTC);
    return current();
  }
  public Map<String,Object> changePassword(PasswordInput in){
    auth.changeCustomerPassword(context.current(),in==null?null:in.currentPassword(),in==null?null:in.newPassword());
    return map("changed",true);
  }
  /** Não apaga dados: registra o pedido para o Administrador (Administração → Auditoria). */
  public Map<String,Object> requestClosure(ClosureInput in){
    var u=context.current();
    audit.record(u.name+" (cliente)","Área do cliente","Solicitação de encerramento de conta",
      u.company.name+" · "+u.email+(in==null||in.reason()==null||in.reason().isBlank()?"":" · Motivo: "+in.reason().trim()));
    return map("requested",true);
  }
  private static String limit(String value,int max){String v=value.trim();return v.length()>max?v.substring(0,max):v;}
  private static String blankToNull(String value,int max){return value==null||value.isBlank()?null:limit(value,max);}

  private <T> List<T> scoped(Class<T> type,String path,String extra,Map<String,Object> parameters){
    var u=context.current();
    var query=em.createQuery("select e from "+type.getSimpleName()+" e where "+path+"customerCompanyId = :company and "+path+"customerUserId = :user "+extra,type)
      .setParameter("company",u.company.id).setParameter("user",u.id);
    parameters.forEach(query::setParameter);return query.getResultList();
  }
  private <T> T one(Class<T> type,String path,String code,String id){
    return scoped(type,path,"and e."+code+" = :id",Map.of("id",id)).stream().findFirst().orElseThrow(()->new ApiException(404,"Registro não encontrado."));
  }

  // ---------------- status translation ----------------
  static Stage requestStage(String status){
    return switch(status){
      case "Nova"->new Stage("Recebida","progress");
      case "Em análise"->new Stage("Em análise técnica","progress");
      case "Aguardando informações"->new Stage("Aguardando informações — o laboratório entrará em contato","action");
      case "Apta para orçamento","Convertida em orçamento"->new Stage("Orçamento em preparação","progress");
      case "Recusada"->new Stage("Não atendida","closed");
      case "Cancelada"->new Stage("Cancelada","closed");
      default->new Stage("Em andamento","progress");
    };
  }
  private Stage quoteStage(QuoteEntity q,ProjectEntity project){
    return switch(q.status){
      case "Aceito"->project!=null?projectStage(project):new Stage("Proposta aceita · aguardando início do projeto","progress");
      case "Recusado"->new Stage("Proposta recusada","closed");
      case "Cancelado"->new Stage("Orçamento cancelado","closed");
      default->canRespond(q)?new Stage("Proposta disponível para sua resposta","action"):new Stage("Proposta em preparação","progress");
    };
  }
  static Stage projectStage(ProjectEntity p){
    return switch(p.status){
      case "Planejamento"->new Stage("Projeto em preparação","progress");
      case "Aguardando execução"->new Stage("Aguardando início da execução","progress");
      case "Em andamento"->new Stage("Em execução","progress");
      case "Aguardando revisão"->new Stage("Em revisão final","progress");
      case "Concluído"->new Stage("Concluído","done");
      case "Cancelado"->new Stage("Projeto cancelado","closed");
      default->new Stage(p.status,"progress");
    };
  }
  private static boolean canRespond(QuoteEntity q){
    var p=q.proposal;
    return p!=null&&!p.hasDraft&&"Aprovado internamente".equals(q.status)
      &&p.versions.stream().anyMatch(v->"generated".equals(v.status)&&v.sourceQuoteRevision==q.revision);
  }
  private ProjectEntity projectOf(QuoteEntity q){
    return em.createQuery("from ProjectEntity where quote.id=:id",ProjectEntity.class).setParameter("id",q.id).getResultStream().findFirst().orElse(null);
  }
  private static String versionStatus(String status){
    return switch(status){case "accepted"->"Aceita";case "rejected"->"Recusada";case "superseded"->"Substituída";default->"Disponível";};
  }
  private static Map<String,Object> stage(Stage s){return map("status",s.label(),"tone",s.tone(),"active",s.active());}

  // ---------------- requests ----------------
  public List<Map<String,Object>> requests(){return scoped(RequestEntity.class,"e.","order by e.createdAt desc",Map.of()).stream().map(this::requestView).toList();}
  public Map<String,Object> request(String id){return requestView(one(RequestEntity.class,"e.","requestCode",id));}
  public Map<String,Object> create(RequestDtos.Create input){var result=requests.createForCustomer(input,context.current());return request(result.id());}
  private Map<String,Object> requestView(RequestEntity r){
    var pieces=r.pieces.stream().map(p->map("name",p.name,"quantity",p.quantity,"material",p.material,"dimensions",p.dimensions,"services",p.services)).toList();
    var linked=scoped(QuoteEntity.class,"e.request.","and e.request.id = :id",Map.of("id",r.id));
    var quote=linked.stream().findFirst().orElse(null);
    var project=quote==null?null:projectOf(quote);
    Stage overall=project!=null?projectStage(project):quote!=null?quoteStage(quote,null):requestStage(r.status);
    var view=map("id",r.requestCode,"service",QuoteService.SERVICES.get(r.service),"services",r.services,"requestNeedId",r.requestNeedId,
      "createdAt",r.createdAt,"updatedAt",r.updatedAt,"objective",r.objective,"description",r.objective,
      "part",String.join(", ",r.pieces.stream().map(p->p.name).toList()),"pieces",pieces,
      "quotes",linked.stream().map(q->map("id",q.quoteCode,"createdAt",q.createdAt,"status",quoteStage(q,projectOf(q)).label())).toList(),
      "projects",project==null?List.of():List.of(projectView(project)),
      "journey",journey(r,quote,project));
    view.putAll(stage(overall));
    return view;
  }
  /** Public milestones only: dates of real records, never internal history entries. */
  private List<Map<String,Object>> journey(RequestEntity r,QuoteEntity q,ProjectEntity p){
    List<Map<String,Object>> steps=new ArrayList<>();
    boolean analysed=!Set.of("Nova").contains(r.status);
    steps.add(map("key","request","label","Solicitação enviada","code",r.requestCode,"date",r.createdAt,"state","done"));
    String analysisState=Set.of("Recusada","Cancelada").contains(r.status)?"closed":q!=null||"Apta para orçamento".equals(r.status)?"done":analysed?"current":"pending";
    steps.add(map("key","analysis","label","Análise técnica","detail",requestStage(r.status).label(),"state",analysisState));
    QuoteProposalVersionEntity latest=q==null||q.proposal==null?null:q.proposal.versions.stream().reduce((a,b)->b).orElse(null);
    String quoteState=q==null?"pending":latest!=null?"done":"current";
    steps.add(map("key","quote","label","Orçamento","code",q==null?null:q.quoteCode,"date",q==null?null:q.createdAt,"state",quoteState));
    String proposalState=q==null||latest==null?"pending":"Aceito".equals(q.status)?"done":Set.of("Recusado","Cancelado").contains(q.status)?"closed":"current";
    steps.add(map("key","proposal","label","Proposta comercial","detail",latest==null?null:"V"+latest.number+" · "+versionStatus(latest.status),"date",latest==null?null:latest.createdAt,"state",proposalState));
    String projectState=p==null?"pending":"Concluído".equals(p.status)?"done":"Cancelado".equals(p.status)?"closed":"current";
    steps.add(map("key","project","label","Projeto","code",p==null?null:p.projectCode,"detail",p==null?null:projectStage(p).label(),"date",p==null?null:p.createdAt,"state",projectState));
    steps.add(map("key","done","label","Serviço concluído","date",p==null?null:p.completedAt,"state",p!=null&&"Concluído".equals(p.status)?"done":"pending"));
    return steps;
  }

  // ---------------- quotes ----------------
  public List<Map<String,Object>> quotes(){return scoped(QuoteEntity.class,"e.request.","order by e.createdAt desc",Map.of()).stream().map(this::quoteView).toList();}
  public Map<String,Object> quote(String id){return quoteView(one(QuoteEntity.class,"e.request.","quoteCode",id));}
  private Map<String,Object> quoteView(QuoteEntity q){
    var p=q.proposal;var project=projectOf(q);
    // Generated versions are the existing publication boundary. Drafts are never exposed.
    var versions=p==null?List.of():p.versions.stream().map(v->map("proposalId",q.quoteCode.replace("ORC-","PROP-"),"quoteId",q.quoteCode,
      "version",v.number,"status",v.status,"statusLabel",versionStatus(v.status),"createdAt",v.createdAt+"Z","snapshot",quotes.read(v.snapshotJson),"pdfFileName",v.pdfFileName,
      "result",v.resultType==null?null:map("type",v.resultType,"date",v.resultDate))).toList();
    var view=map("id",q.quoteCode,"requestId",q.request.requestCode,"service",QuoteService.SERVICES.get(q.serviceId),
      "revision",p==null?null:p.revision,"versions",versions,"canRespond",canRespond(q),"projectId",project==null?null:project.projectCode);
    view.putAll(stage(quoteStage(q,project)));
    return view;
  }
  public Map<String,Object> result(String id,int version,QuoteDtos.Result input){
    var q=one(QuoteEntity.class,"e.request.","quoteCode",id);
    if(!Set.of("accepted","rejected").contains(input.type()))throw new ApiException(400,"Resultado inválido.");
    var u=context.current();
    // Calendar date of the laboratory (São Paulo), set by the server.
    proposals.resultAs(q.quoteCode,version,new QuoteDtos.Result(input.revision(),input.type(),LocalDate.now(LAB_ZONE).toString(),input.note(),null),"Cliente: "+u.name+" ("+u.id+")");
    return quote(id);
  }

  // ---------------- projects ----------------
  public List<Map<String,Object>> projects(){return scoped(ProjectEntity.class,"e.quote.request.","order by e.createdAt desc",Map.of()).stream().map(this::projectView).toList();}
  public Map<String,Object> project(String id){return projectView(one(ProjectEntity.class,"e.quote.request.","projectCode",id));}
  private Map<String,Object> projectView(ProjectEntity p){
    long completed=p.tasks.stream().filter(t->t.completed).count();
    var view=map("id",p.projectCode,"quoteId",p.quote.quoteCode,"requestId",p.quote.request.requestCode,"service",QuoteService.SERVICES.get(p.quote.serviceId),
      "part",String.join(", ",p.quote.request.pieces.stream().map(piece->piece.name).toList()),"startedAt",p.createdAt,"updatedAt",p.updatedAt,"estimatedDelivery",p.deadline,"completedAt",p.completedAt,
      "progress",p.tasks.isEmpty()?0:Math.round(100.0*completed/p.tasks.size()));
    view.putAll(stage(projectStage(p)));
    return view;
  }
}
