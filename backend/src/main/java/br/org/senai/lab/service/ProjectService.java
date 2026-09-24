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

  @Transactional public List<Project> list(){return repository.list().stream().map(this::response).toList();}
  @Transactional public Project get(String id){return response(required(id,false));}
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
      ProjectTaskEntity task=new ProjectTaskEntity();task.id=UUID.randomUUID();task.project=project;task.position=project.tasks.size();task.title=title;project.tasks.add(task);
    }
    event(project,"Projeto criado","O projeto foi criado a partir do orçamento "+quote.quoteCode+".");
    repository.persist(project);
    // Linking an execution record does not change the accepted commercial revision.
    quotes.event(quote,"Projeto criado","Projeto vinculado: "+project.projectCode+" · proposta V"+accepted.number+".");
    repository.flush();return response(project);
  }
  @Transactional public Project update(String id,Update input){
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
        task.completed=input.completed();action=task.completed?"Etapa concluída":"Etapa reaberta";
        description="A etapa \""+task.title+"\" "+(task.completed?"foi marcada como concluída.":"foi reaberta.");
      }
      case "prepare" -> {requireStatus(project,"Planejamento");target="Aguardando execução";action="Preparação concluída";description="O planejamento inicial foi concluído e o projeto está aguardando execução.";}
      case "start" -> {requireStatus(project,"Planejamento","Aguardando execução");target="Em andamento";action="Execução iniciada";description="A execução técnica do projeto foi iniciada.";}
      case "review" -> {requireStatus(project,"Em andamento");target="Aguardando revisão";action="Projeto enviado para revisão";description="A execução foi encaminhada para revisão antes da conclusão.";}
      case "return" -> {requireStatus(project,"Aguardando revisão");target="Em andamento";action="Projeto retornou para execução";description="Foram solicitados ajustes antes da conclusão do projeto.";}
      case "complete" -> {
        requireStatus(project,"Aguardando revisão");
        if(project.tasks.stream().anyMatch(t->!t.completed))throw conflict("Conclua todas as etapas do checklist antes de finalizar o projeto.");
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
    ProjectHistoryEntity event=new ProjectHistoryEntity();event.id=UUID.randomUUID();event.project=project;event.occurredAt=now();event.actor=ACTOR;event.action=action;event.description=description;project.history.add(event);
  }
  private Project response(ProjectEntity entity){
    Project dto=mapper.project(entity);dto.service=SERVICES.getOrDefault(entity.quote.serviceId,entity.quote.serviceId);
    dto.acceptedProposalId=entity.quote.quoteCode.replace("ORC-","PROP-");dto.quote=quotes.response(entity.quote);
    return dto;
  }
  public static String formatProjectCode(long number){return "PRJ-"+String.format(Locale.ROOT,"%04d",number);}
}
