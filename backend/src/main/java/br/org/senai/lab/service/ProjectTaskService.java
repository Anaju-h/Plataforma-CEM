package br.org.senai.lab.service;

import br.org.senai.lab.dto.ProjectDtos.*;
import br.org.senai.lab.entity.*;
import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.repository.ProjectRepository;
import br.org.senai.lab.security.CurrentUser;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

/**
 * Delegação de tarefas (estilo quadro de tarefas) dentro dos projetos.
 * Administrador: cria, edita, delega e remove. Responsável: muda o status e aponta horas das próprias tarefas.
 * Consulta não recebe tarefas. As horas apontadas alimentam o bloco B do Registro de Serviço.
 */
@ApplicationScoped
public class ProjectTaskService {
  static final Set<String> STATUSES=Set.of("TODO","DOING","DONE");
  static final Map<String,String> STATUS_LABELS=Map.of("TODO","A fazer","DOING","Em andamento","DONE","Concluída");
  static final Set<String> CLOSED=Set.of("Concluído","Cancelado");
  @Inject EntityManager em;
  @Inject ProjectRepository projects;
  @Inject ProjectService projectService;
  @Inject CurrentUser user;

  @Transactional public Project create(String projectId,TaskInput in){
    requireAdmin();
    ProjectEntity project=open(projectId);
    if(in==null||blank(in.title()))throw bad("Informe o título da tarefa.");
    ProjectTaskEntity task=new ProjectTaskEntity();task.id=UUID.randomUUID();task.project=project;
    task.position=project.tasks.stream().mapToInt(t->t.position).max().orElse(-1)+1;
    task.title=in.title().trim();task.description=trim(in.description());task.status="TODO";
    task.assigneeId=assignee(in.assigneeId());task.dueDate=date(in.dueDate(),false);task.plannedHours=in.plannedHours();
    task.createdAt=now();task.updatedAt=task.createdAt;project.tasks.add(task);em.persist(task);
    event(project,"Tarefa criada","\""+task.title+"\""+(task.assigneeId==null?"":" delegada para "+name(task.assigneeId))+".");
    return touch(project);
  }

  @Transactional public Project update(String projectId,UUID taskId,TaskInput in){
    ProjectEntity project=open(projectId);ProjectTaskEntity task=task(project,taskId);
    if(in==null)throw bad("Dados ausentes.");
    boolean admin=admin();
    if(!admin&&!user.id().equals(task.assigneeId))throw new ApiException(403,"Somente o responsável ou o Administrador alteram esta tarefa.");
    List<String> changes=new ArrayList<>();
    // Edição completa (formulário do Administrador) só quando o título vem junto; mudança de status sozinha não apaga os demais campos.
    if(admin&&in.title()!=null){
      if(in.title()!=null&&!blank(in.title())&&!in.title().trim().equals(task.title)){task.title=in.title().trim();changes.add("título");}
      if(in.description()!=null&&!Objects.equals(trim(in.description()),task.description)){task.description=trim(in.description());changes.add("descrição");}
      UUID assignee=assignee(in.assigneeId());
      if(!Objects.equals(assignee,task.assigneeId)){task.assigneeId=assignee;event(project,"Tarefa delegada","\""+task.title+"\" "+(assignee==null?"ficou sem responsável.":"delegada para "+name(assignee)+"."));}
      LocalDate due=date(in.dueDate(),false);if(!Objects.equals(due,task.dueDate)){task.dueDate=due;changes.add("prazo");}
      if(!Objects.equals(in.plannedHours(),task.plannedHours)&&(in.plannedHours()==null||task.plannedHours==null||in.plannedHours().compareTo(task.plannedHours)!=0)){task.plannedHours=in.plannedHours();changes.add("horas planejadas");}
    }
    if(in.status()!=null&&!in.status().equals(task.status)){
      if(!STATUSES.contains(in.status()))throw bad("Status de tarefa inválido.");
      task.status=in.status();task.completed="DONE".equals(task.status);task.completedAt=task.completed?now():null;
      event(project,"Tarefa: "+STATUS_LABELS.get(task.status),"\""+task.title+"\" passou para "+STATUS_LABELS.get(task.status).toLowerCase(Locale.ROOT)+".");
    }
    if(!changes.isEmpty())event(project,"Tarefa atualizada","\""+task.title+"\": "+String.join(", ",changes)+".");
    task.updatedAt=now();
    return touch(project);
  }

  @Transactional public Project delete(String projectId,UUID taskId){
    requireAdmin();
    ProjectEntity project=open(projectId);ProjectTaskEntity task=task(project,taskId);
    if(!task.entries.isEmpty())throw conflict("A tarefa já tem horas apontadas e não pode ser removida. Marque-a como concluída.");
    project.tasks.remove(task);em.remove(task);
    event(project,"Tarefa removida","\""+task.title+"\" foi removida.");
    return touch(project);
  }

  @Transactional public Project addTime(String projectId,UUID taskId,TimeInput in){
    ProjectEntity project=open(projectId);ProjectTaskEntity task=task(project,taskId);
    boolean admin=admin();
    if(!admin&&!user.id().equals(task.assigneeId))throw new ApiException(403,"Aponte horas somente nas suas tarefas.");
    if(in==null||in.hours()==null||in.hours().signum()<=0||in.hours().compareTo(new BigDecimal("24"))>0)throw bad("Informe entre 0,25 e 24 horas.");
    LocalDate day=date(in.date(),true);
    if(day.isAfter(LocalDate.now()))throw bad("Não é possível apontar horas em data futura.");
    UUID author=admin&&in.userId()!=null?in.userId():user.authenticated()?user.id():task.assigneeId;
    if(author==null)throw bad("Defina o responsável da tarefa antes de apontar horas.");
    if(em.find(InternalUserEntity.class,author)==null)throw bad("Usuário inválido.");
    ProjectTimeEntryEntity entry=new ProjectTimeEntryEntity();entry.id=UUID.randomUUID();entry.task=task;entry.userId=author;entry.workDate=day;
    entry.hours=in.hours().setScale(2,java.math.RoundingMode.HALF_UP);entry.note=trim(in.note());entry.createdAt=now();
    task.entries.add(entry);em.persist(entry);
    if("TODO".equals(task.status)){task.status="DOING";}
    task.updatedAt=now();
    event(project,"Horas apontadas",entry.hours.stripTrailingZeros().toPlainString()+" h em \""+task.title+"\" por "+name(author)+".");
    return touch(project);
  }

  @Transactional public Project deleteTime(String projectId,UUID taskId,UUID entryId){
    ProjectEntity project=open(projectId);ProjectTaskEntity task=task(project,taskId);
    ProjectTimeEntryEntity entry=task.entries.stream().filter(e->e.id.equals(entryId)).findFirst().orElseThrow(()->new ApiException(404,"Apontamento não encontrado."));
    if(!admin()&&!user.id().equals(entry.userId))throw new ApiException(403,"Remova somente os seus apontamentos.");
    task.entries.remove(entry);em.remove(entry);
    event(project,"Apontamento removido",entry.hours.stripTrailingZeros().toPlainString()+" h removidas de \""+task.title+"\".");
    return touch(project);
  }

  /** Meu trabalho: tarefas delegadas ao usuário logado, com o resumo de cada projeto. */
  @Transactional public Map<String,Object> myWork(){
    UUID me=user.id();
    var tasks=em.createQuery("from ProjectTaskEntity t where t.assigneeId=:me order by t.dueDate asc nulls last, t.position asc",ProjectTaskEntity.class).setParameter("me",me).getResultList();
    return summary(tasks,projectService.users(),me);
  }

  /** Quadro de tarefas do Administrador: todas as tarefas, com projeto e responsável. */
  @Transactional public Map<String,Object> board(){
    requireAdmin();
    var tasks=em.createQuery("from ProjectTaskEntity t order by t.dueDate asc nulls last, t.position asc",ProjectTaskEntity.class).getResultList();
    Map<String,Object> result=summary(tasks,projectService.users(),null);
    var members=em.createQuery("from InternalUserEntity u where u.active=true order by u.role, u.name",InternalUserEntity.class).getResultList().stream()
      .map(u->QuoteService.map("id",u.id,"name",u.name,"role",u.role,"assignable",!"CONSULTA".equals(u.role))).toList();
    result.put("members",members);
    return result;
  }

  private Map<String,Object> summary(List<ProjectTaskEntity> tasks,Map<UUID,InternalUserEntity> users,UUID me){
    LocalDate today=LocalDate.now();LocalDate weekStart=today.with(DayOfWeek.MONDAY);
    List<Map<String,Object>> rows=new ArrayList<>();
    BigDecimal planned=BigDecimal.ZERO,spent=BigDecimal.ZERO,week=BigDecimal.ZERO;int open=0,overdue=0,dueSoon=0;
    for(ProjectTaskEntity t:tasks){
      ProjectEntity p=t.project;
      Task view=ProjectService.task(t,users);
      boolean done="DONE".equals(t.status);
      boolean late=!done&&t.dueDate!=null&&t.dueDate.isBefore(today);
      boolean soon=!done&&t.dueDate!=null&&!t.dueDate.isBefore(today)&&!t.dueDate.isAfter(today.plusDays(3));
      if(!done)open++;if(late)overdue++;if(soon)dueSoon++;
      planned=planned.add(zero(t.plannedHours));
      for(ProjectTimeEntryEntity e:t.entries){if(me==null||me.equals(e.userId)){spent=spent.add(e.hours);if(!e.workDate.isBefore(weekStart))week=week.add(e.hours);}}
      rows.add(QuoteService.map("task",view,"overdue",late,"dueSoon",soon,
        "project",QuoteService.map("id",p.projectCode,"quoteId",p.quote.quoteCode,"company",p.quote.company,"service",QuoteService.SERVICES.getOrDefault(p.quote.serviceId,p.quote.serviceId),
          "status",p.status,"deadline",p.deadline==null?null:p.deadline.toString(),"demo","demo".equals(p.quote.request.source),"closed",CLOSED.contains(p.status))));
    }
    return QuoteService.map("tasks",rows,"totals",QuoteService.map("open",open,"overdue",overdue,"dueSoon",dueSoon,"plannedHours",planned,"spentHours",spent,"weekHours",week,"total",tasks.size()));
  }

  private ProjectEntity open(String projectId){
    ProjectEntity project=projects.find(projectId,true);
    if(project==null)throw new ApiException(404,"Projeto não encontrado.");
    projectService.requireVisible(project);
    if(CLOSED.contains(project.status))throw conflict("O projeto está encerrado. Reabra-o para alterar tarefas.");
    return project;
  }
  private ProjectTaskEntity task(ProjectEntity project,UUID taskId){
    return project.tasks.stream().filter(t->t.id.equals(taskId)).findFirst().orElseThrow(()->new ApiException(404,"Tarefa não encontrada."));
  }
  private UUID assignee(UUID id){
    if(id==null)return null;
    InternalUserEntity u=em.find(InternalUserEntity.class,id);
    if(u==null||!u.active)throw bad("Responsável inválido ou inativo.");
    if("CONSULTA".equals(u.role))throw bad("O perfil Consulta é somente leitura e não recebe tarefas.");
    return id;
  }
  private String name(UUID id){InternalUserEntity u=id==null?null:em.find(InternalUserEntity.class,id);return u==null?"—":u.name;}
  private Project touch(ProjectEntity project){project.updatedAt=now();project.revision++;em.flush();return projectService.response(project);}
  private void event(ProjectEntity project,String action,String description){
    ProjectHistoryEntity event=new ProjectHistoryEntity();event.id=UUID.randomUUID();event.project=project;event.occurredAt=now();
    event.actor=user.name();event.action=action;event.description=description;project.history.add(event);
  }
  private boolean admin(){return projectService.fullAccess();}
  private void requireAdmin(){if(!admin())throw new ApiException(403,"Somente o Administrador delega e organiza tarefas.");}
  private static LocalDate date(String value,boolean required){
    if(value==null||value.isBlank()){if(required)throw bad("Informe a data.");return null;}
    try{return LocalDate.parse(value.trim());}catch(Exception e){throw bad("Data inválida.");}
  }
  private static String trim(String value){return value==null||value.isBlank()?null:value.trim();}
  private static boolean blank(String value){return value==null||value.isBlank();}
  private static BigDecimal zero(BigDecimal value){return value==null?BigDecimal.ZERO:value;}
  private static LocalDateTime now(){return LocalDateTime.now(ZoneOffset.UTC);}
  private static ApiException bad(String m){return new ApiException(400,m);}
  private static ApiException conflict(String m){return new ApiException(409,m);}
}
