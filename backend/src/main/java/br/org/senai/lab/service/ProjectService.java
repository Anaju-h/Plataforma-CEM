package br.org.senai.lab.service;

import br.org.senai.lab.dto.ProjectDtos.*;
import br.org.senai.lab.entity.*;
import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.mapper.ProjectMapper;
import br.org.senai.lab.repository.ProjectRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.*;
import static br.org.senai.lab.service.QuoteService.*;

@ApplicationScoped
public class ProjectService {
  @Inject ProjectRepository repository;
  @Inject QuoteService quotes;
  @Inject ProjectMapper mapper;
  @Inject br.org.senai.lab.knowledge.RecordService knowledgeRecords;
  @Inject br.org.senai.lab.security.CurrentUser user;
  @Inject jakarta.persistence.EntityManager em;
  static final List<String> COMMERCIAL_SAFE=List.of("id","requestId","serviceId","service","services","scope","machineId","deadlineDays","totalQuotedHours","billableHours","status","requestPieces","source","demo");
  @org.eclipse.microprofile.config.inject.ConfigProperty(name="lab.knowledge.require-record-on-project-completion",defaultValue="true") boolean requireKnowledgeRecord;

  /** Administrador vê todos; os demais perfis veem somente projetos com tarefa delegada a eles. */
  @Transactional public List<Project> list(){
    if(fullAccess())return repository.list().stream().map(this::response).toList();
    return em.createQuery("select distinct t.project from ProjectTaskEntity t where t.assigneeId=:me",ProjectEntity.class).setParameter("me",user.id()).getResultList()
      .stream().sorted(Comparator.comparing((ProjectEntity p)->p.createdAt).reversed()).map(this::response).toList();
  }
  @Transactional public Project get(String id){ProjectEntity project=required(id,false);requireVisible(project);return response(project);}
  /** Sem sessão só ocorre no perfil de testes (política HTTP liberada); em execução normal a sessão é obrigatória. */
  boolean fullAccess(){return !user.authenticated()||user.atLeast("ADMIN");}
  void requireVisible(ProjectEntity project){
    if(fullAccess())return;
    UUID me=user.id();
    if(project.tasks.stream().noneMatch(t->me.equals(t.assigneeId)))throw new ApiException(404,"Projeto não encontrado.");
  }
  @Transactional public Project create(String quoteId){
    QuoteEntity quote=quotes.required(quoteId,true);
    ProjectEntity existing=repository.byQuote(quote.id);
    if(existing!=null)return response(existing);
    if(!"Aceito".equals(quote.status)||quote.proposal==null||quote.proposal.acceptedVersion==null)
      throw conflict("Somente orçamentos com proposta aceita podem gerar projeto.");
    QuoteProposalVersionEntity accepted=quote.proposal.versions.stream()
      .filter(v->v.number==quote.proposal.acceptedVersion&&"accepted".equals(v.status)&&"accepted".equals(v.resultType)&&v.resultRegisteredAt!=null)
      .findFirst().orElseThrow(()->conflict("O orçamento não possui aceite válido."));
    quotes.validateEquipment(quote,quote.machineId);
    ProjectEntity project=new ProjectEntity();project.id=UUID.randomUUID();project.projectCode=formatProjectCode(repository.nextNumber());
    project.quote=quote;project.acceptedProposal=quote.proposal;project.acceptedVersion=accepted;
    project.responsible=quote.responsible;project.priority=quote.priority;project.status="Planejamento";
    project.createdAt=now();project.updatedAt=project.createdAt;project.internalNotes="";
    project.deadline=quote.deadlineDays==null?null:project.createdAt.toLocalDate().plusDays(quote.deadlineDays);
    project.description="Projeto criado a partir do orçamento "+quote.quoteCode+" aceito pelo cliente.";
    for(String title:List.of("Conferir informações do serviço","Preparar estratégia de execução","Executar serviço","Analisar resultados","Preparar entrega")){
      ProjectTaskEntity task=new ProjectTaskEntity();task.id=UUID.randomUUID();task.project=project;task.position=project.tasks.size();task.title=title;task.status="TODO";task.createdAt=now();task.updatedAt=task.createdAt;project.tasks.add(task);
    }
    event(project,"Projeto criado","O projeto foi criado a partir do orçamento "+quote.quoteCode+".");
    repository.persist(project);
    // Linking an execution record does not change the accepted commercial revision.
    quotes.event(quote,"Projeto criado","Projeto vinculado: "+project.projectCode+" · proposta V"+accepted.number+".");
    repository.flush();return response(project);
  }
  @Transactional public Project update(String id,Update input){
    if(!fullAccess())throw new ApiException(403,"Somente o Administrador altera as etapas do projeto. Atualize suas tarefas em Meu trabalho.");
    ProjectEntity project=required(id,true);
    if(input.revision()==null||input.revision()!=project.revision)throw conflict("O projeto foi alterado. Atualize a página antes de salvar.");
    String operation=input.operation();String target=null,action,description;
    if(Set.of("Concluído","Cancelado").contains(project.status)&&!"reopen".equals(operation))
      throw conflict("Um projeto encerrado não pode ser alterado.");
    switch(operation){
      case "notes" -> {
        String notes=Objects.toString(input.internalNotes(),"").trim();
        if(notes.equals(project.internalNotes))return response(project);
        project.internalNotes=notes;action="Observações internas atualizadas";
        description=notes.isEmpty()?"As observações internas do projeto foram removidas.":"As observações internas do projeto foram atualizadas.";
      }
      case "task" -> {
        if(input.taskId()==null||input.completed()==null)throw bad("Informe a etapa e sua conclusão.");
        ProjectTaskEntity task=project.tasks.stream().filter(t->t.id.equals(input.taskId())).findFirst().orElseThrow(()->bad("Etapa não encontrada."));
        if(task.completed==input.completed())return response(project);
        task.completed=input.completed();task.status=task.completed?"DONE":"TODO";task.completedAt=task.completed?now():null;task.updatedAt=now();action=task.completed?"Etapa concluída":"Etapa reaberta";
        description="A etapa \""+task.title+"\" "+(task.completed?"foi marcada como concluída.":"foi reaberta.");
      }
      case "prepare" -> {requireStatus(project,"Planejamento");target="Aguardando execução";action="Preparação concluída";description="O planejamento inicial foi concluído e o projeto está aguardando execução.";}
      case "start" -> {requireStatus(project,"Planejamento","Aguardando execução");target="Em andamento";action="Execução iniciada";description="A execução técnica do projeto foi iniciada.";}
      case "review" -> {requireStatus(project,"Em andamento");target="Aguardando revisão";action="Projeto enviado para revisão";description="A execução foi encaminhada para revisão antes da conclusão.";}
      case "return" -> {requireStatus(project,"Aguardando revisão");target="Em andamento";action="Projeto retornou para execução";description="Foram solicitados ajustes antes da conclusão do projeto.";}
      case "complete" -> {
        requireStatus(project,"Aguardando revisão");
        if(project.tasks.stream().anyMatch(t->!t.completed))throw conflict("Conclua todas as tarefas do projeto antes de finalizá-lo.");
        // Regra central do módulo de conhecimento: sem blocos B (realizado) e C (aprendizado) o serviço não é concluído.
        if(requireKnowledgeRecord&&!knowledgeRecords.hasClosedRecordForQuote(project.quote.quoteCode))
          throw conflict("Feche o Registro de Serviço do "+project.quote.quoteCode+" (blocos B – realizado e C – aprendizado) na Gestão do Conhecimento antes de concluir o projeto.");
        target="Concluído";project.completedAt=now().toLocalDate();action="Projeto concluído";description="A revisão foi finalizada e o projeto foi concluído.";
      }
      case "reopen" -> {requireStatus(project,"Concluído");target="Em andamento";project.completedAt=null;action="Projeto reaberto";description="O projeto foi reaberto para nova execução ou ajustes.";}
      default -> throw bad("Operação de projeto inválida.");
    }
    if(target!=null)project.status=target;
    project.updatedAt=now();project.revision++;event(project,action,description);repository.flush();return response(project);
  }
  private void requireStatus(ProjectEntity project,String... allowed){if(!Arrays.asList(allowed).contains(project.status))throw conflict("Este projeto não permite a ação no status atual.");}
  private ProjectEntity required(String id,boolean lock){ProjectEntity project=repository.find(id,lock);if(project==null)throw new ApiException(404,"Projeto não encontrado.");return project;}
  private void event(ProjectEntity project,String action,String description){
    ProjectHistoryEntity event=new ProjectHistoryEntity();event.id=UUID.randomUUID();event.project=project;event.occurredAt=now();event.actor=user.name();event.action=action;event.description=description;project.history.add(event);
  }
  Project response(ProjectEntity entity){
    Project dto=mapper.project(entity);dto.service=SERVICES.getOrDefault(entity.quote.serviceId,entity.quote.serviceId);
    dto.acceptedProposalId=entity.quote.quoteCode.replace("ORC-","PROP-");
    dto.source=Objects.toString(entity.quote.request.source,"real");dto.demo="demo".equals(dto.source);
    dto.commercialVisible=fullAccess();
    Map<String,Object> quote=quotes.response(entity.quote);
    if(!dto.commercialVisible){Map<String,Object> safe=new LinkedHashMap<>();COMMERCIAL_SAFE.forEach(k->{if(quote.containsKey(k))safe.put(k,quote.get(k));});dto.quote=safe;}
    else dto.quote=quote;
    Map<UUID,InternalUserEntity> users=users();
    dto.tasks=entity.tasks.stream().map(t->task(t,users)).toList();
    dto.budgetHours=entity.quote.items.stream().map(i->zero(i.quotedHours)).reduce(java.math.BigDecimal.ZERO,java.math.BigDecimal::add);
    dto.plannedHours=entity.tasks.stream().map(t->zero(t.plannedHours)).reduce(java.math.BigDecimal.ZERO,java.math.BigDecimal::add);
    dto.spentHours=dto.tasks.stream().map(Task::spentHours).reduce(java.math.BigDecimal.ZERO,java.math.BigDecimal::add);
    var record=em.createQuery("select r.code, r.status from KmRecordEntity r where r.quoteCode=:q order by r.createdAt desc",Object[].class).setParameter("q",entity.quote.quoteCode).setMaxResults(1).getResultList();
    if(!record.isEmpty()){dto.recordCode=(String)record.get(0)[0];dto.recordStatus=(String)record.get(0)[1];}
    return dto;
  }
  Map<UUID,InternalUserEntity> users(){
    Map<UUID,InternalUserEntity> users=new HashMap<>();
    em.createQuery("from InternalUserEntity",InternalUserEntity.class).getResultList().forEach(u->users.put(u.id,u));
    return users;
  }
  static Task task(ProjectTaskEntity t,Map<UUID,InternalUserEntity> users){
    InternalUserEntity assignee=t.assigneeId==null?null:users.get(t.assigneeId);
    var entries=t.entries.stream().map(e->{InternalUserEntity author=users.get(e.userId);
      return new TimeEntry(e.id,e.userId,author==null?"—":author.name,e.workDate.toString(),e.hours,e.note,e.createdAt+"Z");}).toList();
    var spent=t.entries.stream().map(e->e.hours).reduce(java.math.BigDecimal.ZERO,java.math.BigDecimal::add);
    return new Task(t.id,t.title,t.completed,t.status,t.description,t.assigneeId,assignee==null?null:assignee.name,assignee==null?null:assignee.role,
      t.dueDate==null?null:t.dueDate.toString(),t.plannedHours,spent,entries);
  }
  public static String formatProjectCode(long number){return "PRJ-"+String.format(Locale.ROOT,"%04d",number);}
}
