package br.org.senai.lab.service;

import br.org.senai.lab.dto.RequestDtos.*;
import br.org.senai.lab.entity.*;
import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.mapper.RequestMapper;
import br.org.senai.lab.repository.RequestRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@ApplicationScoped
public class RequestService {
  private static final String ACTOR="Administrador";
  private static final Set<String> SERVICES=Set.of("dimensional","scan","reverse-engineering","internal","failure-analysis","asset-structure","digital-library","maintenance","training");
  private static final Map<String,String> NEEDS=Map.of("check-piece","dimensional","physical-to-3d","scan","reproduce-piece","reverse-engineering","compare-cad","scan","inside","internal","failure-analysis","failure-analysis","asset-structure","asset-structure","digital-library","digital-library","maintenance","maintenance","training","training");
  private static final Set<String> CLOSED=Set.of("Convertida em orçamento","Recusada","Cancelada");
  @Inject RequestRepository repository;
  @Inject RequestMapper mapper;
  @Inject ObjectMapper json;

  @Transactional public Response create(Create dto) {
    String primary=NEEDS.get(dto.project().requestNeedId());
    if(primary==null) throw bad("Necessidade inválida.");
    List<Piece> pieces=dto.pieces()==null?List.of():dto.pieces();
    if(!Set.of("failure-analysis","asset-structure","digital-library","maintenance","training").contains(primary) && pieces.isEmpty()) throw bad("Informe pelo menos uma peça.");
    RequestEntity r=mapper.fromCreate(dto);
    r.id=UUID.randomUUID(); r.requestCode=formatRequestCode(repository.nextNumber());
    r.source="real"; r.origin=clean(dto.origin(),"Interno"); r.channel=clean(dto.channel(),dto.internal()==null?"Registro interno":clean(dto.internal().channel(),"Registro interno"));
    r.service=primary; r.services.add(primary); r.createdAt=LocalDateTime.now(ZoneOffset.UTC); r.updatedAt=r.createdAt;
    r.status="Nova"; r.priority="urgent".equals(dto.project().urgency())?"Alta":"Normal"; r.responsible="Não atribuído";
    r.internalNotes=dto.internal()==null?"":clean(dto.internal().channelDetails(),"");
    r.customerJson=write(Map.of("department",dto.internal()==null?"":clean(dto.internal().department(),""),"company",r.company,"contact",r.contact,"email",clean(r.email,""),"phone",clean(r.phone,"")));
    r.projectJson=write(dto.project()); r.attachmentsJson=write(dto.project().generalFiles()==null?List.of():dto.project().generalFiles());
    for(Piece item:pieces) {
      PieceEntity p=new PieceEntity(); p.id=UUID.randomUUID(); p.request=r; p.clientId=item.id(); p.name=item.name().trim(); p.quantity=item.quantity();
      p.material=item.material(); p.dimensions=item.dimensions(); p.location=item.location(); p.type=item.type();
      p.requirementsJson=write(item.requirements()==null?Map.of():item.requirements()); p.recommendationJson=write(item.recommendation());
      if(item.services()!=null) for(String s:item.services()) { requireService(s); p.services.add(s); r.services.add(s); }
      r.pieces.add(p);
    }
    r.analysis=new AnalysisEntity(); r.analysis.request=r; r.analysis.status="not-started"; r.analysis.responsible=r.responsible; r.analysis.recommendedService=primary; r.analysis.knowledgeTagsJson="[]";
    event(r,"Solicitação criada","Solicitação registrada pelo canal "+r.channel+".");
    repository.persist(r); return response(r);
  }
  @Transactional public List<Response> list() { return repository.list().stream().map(this::response).toList(); }
  @Transactional public Response get(String id) { return response(required(id,false)); }
  @Transactional public Response start(String id) {
    RequestEntity r=required(id,true); expect(r,"Nova"); LocalDateTime now=now();
    r.status="Em análise"; r.responsible=ACTOR; r.analysis.status="in-progress"; r.analysis.responsible=ACTOR;
    r.analysis.startedAt=now; r.analysis.updatedAt=now; r.analysis.updatedBy=ACTOR;
    event(r,"Análise iniciada","Avaliação técnica iniciada."); touch(r); return response(r);
  }
  @Transactional public Response resume(String id) {
    RequestEntity r=required(id,true); expect(r,"Aguardando informações"); LocalDateTime now=now();
    r.status="Em análise"; r.analysis.status="in-progress"; r.analysis.resumedAt=now; r.analysis.updatedAt=now; r.analysis.updatedBy=ACTOR; r.analysis.completedAt=null;
    event(r,"Análise retomada","Avaliação técnica retomada."); touch(r); return response(r);
  }
  @Transactional public Response save(String id,AnalysisUpdate dto) {
    RequestEntity r=required(id,true); expect(r,"Em análise","Aguardando informações"); updateAnalysis(r,dto.recommendedService()!=null?dto.recommendedService():dto.service(),dto.recommendedEquipment()!=null?dto.recommendedEquipment():dto.technology(),dto.responsible()!=null?dto.responsible():dto.technicalResponsible(),dto.technicalSummary()!=null?dto.technicalSummary():dto.summary(),dto.complexity(),dto.pendingInformation(),dto.decisionReason(),dto.knowledgeTags());
    event(r,"Análise técnica atualizada","Dados da análise técnica atualizados."); touch(r); return response(r);
  }
  @Transactional public Response finish(String id,Finish dto) {
    RequestEntity r=required(id,true); expect(r,"Em análise");
    String result=dto.result(); if(!Set.of("quote-ready","waiting-information","rejected").contains(result)) throw bad("Resultado inválido.");
    String summary=clean(dto.technicalSummary()!=null?dto.technicalSummary():dto.summary(),r.analysis.technicalSummary);
    if(summary==null||summary.isBlank()) throw bad("Preencha o resumo técnico.");
    String pending=clean(dto.pendingInformation(),r.analysis.pendingInformation); String reason=clean(dto.decisionReason(),r.analysis.decisionReason);
    if("waiting-information".equals(result)&&(pending==null||pending.isBlank())) throw bad("Informe as informações pendentes.");
    if("rejected".equals(result)&&(reason==null||reason.isBlank())) throw bad("Informe o motivo da recusa.");
    updateAnalysis(r,dto.recommendedService()!=null?dto.recommendedService():dto.service(),dto.recommendedEquipment()!=null?dto.recommendedEquipment():dto.technology(),dto.responsible()!=null?dto.responsible():dto.technicalResponsible(),summary,dto.complexity(),pending,reason,dto.knowledgeTags());
    r.analysis.result=result; r.status=switch(result){case "quote-ready"->"Apta para orçamento";case "waiting-information"->"Aguardando informações";default->"Recusada";};
    r.analysis.status="waiting-information".equals(result)?"waiting-information":"completed"; r.analysis.completedAt="waiting-information".equals(result)?null:now();
    event(r,"waiting-information".equals(result)?"Informações solicitadas":"rejected".equals(result)?"Solicitação recusada":"Solicitação apta para orçamento", "Resultado da análise técnica registrado."); touch(r); return response(r);
  }
  @Transactional public Response notes(String id,Notes dto) { RequestEntity r=required(id,true); open(r); r.internalNotes=clean(dto.notes(),""); event(r,"Observações internas alteradas","Observações internas atualizadas."); touch(r); return response(r); }
  @Transactional public Response assign(String id,Assignment dto) { RequestEntity r=required(id,true); open(r); r.responsible=dto.responsible().trim(); r.analysis.responsible=r.responsible; event(r,"Responsável definido","Responsável pela solicitação definido."); touch(r); return response(r); }
  @Transactional public Response cancel(String id,Cancel dto) { RequestEntity r=required(id,true); open(r); r.status="Cancelada"; r.cancellationReason=dto.reason().trim(); r.cancelledAt=now(); r.cancelledBy=ACTOR; r.analysis.status="cancelled"; event(r,"Solicitação cancelada",r.cancellationReason); touch(r); return response(r); }

  private void updateAnalysis(RequestEntity r,String service,String equipment,String responsible,String summary,String complexity,String pending,String reason,List<String> tags) {
    AnalysisEntity a=r.analysis;
    if(service!=null&&!service.isBlank()){requireService(service); a.recommendedService=service; r.service=service; r.services.add(service);}
    if(equipment!=null)a.recommendedEquipment=equipment.trim();
    if(responsible!=null&&!responsible.isBlank()){a.responsible=responsible.trim();r.responsible=a.responsible;}
    if(summary!=null)a.technicalSummary=summary.trim(); if(complexity!=null)a.complexity=complexity.trim();
    if(pending!=null)a.pendingInformation=pending.trim(); if(reason!=null)a.decisionReason=reason.trim();
    if(tags!=null)a.knowledgeTagsJson=write(tags); a.updatedAt=now(); a.updatedBy=ACTOR;
  }
  private RequestEntity required(String id,boolean lock){ RequestEntity r=lock?repository.findLocked(id):repository.find(id); if(r==null)throw new ApiException(404,"Solicitação não encontrada."); return r; }
  private void expect(RequestEntity r,String... statuses){if(!Arrays.asList(statuses).contains(r.status))throw new ApiException(409,"Operação incompatível com o estado da solicitação.");}
  private void open(RequestEntity r){if(CLOSED.contains(r.status))throw new ApiException(409,"Solicitação encerrada.");}
  private void requireService(String s){if(!SERVICES.contains(s))throw bad("Serviço inválido: "+s);}
  private static ApiException bad(String message){return new ApiException(400,message);}
  private static String clean(String value,String fallback){return value==null?fallback:value.trim();}
  private static LocalDateTime now(){return LocalDateTime.now(ZoneOffset.UTC);}
  static String formatRequestCode(long number){return "SOL-"+String.format(Locale.ROOT,"%04d",number);}
  private static void touch(RequestEntity r){r.updatedAt=now();}
  private void event(RequestEntity r,String action,String description){HistoryEntity h=new HistoryEntity();h.id=UUID.randomUUID();h.request=r;h.occurredAt=now();h.action=action;h.actor=ACTOR;h.description=description;r.history.add(h);}
  private String write(Object value){try{return json.writeValueAsString(value);}catch(Exception e){throw bad("Dados inválidos.");}}
  private Map<String,Object> map(String value){try{return value==null?Map.of():json.readValue(value,new TypeReference<Map<String,Object>>(){});}catch(Exception e){return Map.of();}}
  private List<Map<String,Object>> maps(String value){try{return value==null?List.of():json.readValue(value,new TypeReference<List<Map<String,Object>>>(){});}catch(Exception e){return List.of();}}
  private List<String> strings(String value){try{return value==null?List.of():json.readValue(value,new TypeReference<List<String>>(){});}catch(Exception e){return List.of();}}
  private Response response(RequestEntity r){
    List<Map<String,Object>> pieces=r.pieces.stream().map(p->{Map<String,Object> m=new LinkedHashMap<>();m.put("id",p.clientId==null?p.id.toString():p.clientId);m.put("name",p.name);m.put("quantity",p.quantity);m.put("material",p.material);m.put("dimensions",p.dimensions);m.put("location",p.location);m.put("type",p.type);m.put("services",p.services);m.put("requirements",map(p.requirementsJson));m.put("recommendation",map(p.recommendationJson));return m;}).toList();
    AnalysisEntity a=r.analysis;
    Analysis analysis=new Analysis(a.status,a.responsible,a.startedAt,a.resumedAt,a.completedAt,a.updatedAt,a.updatedBy,a.complexity,a.technicalSummary,a.pendingInformation,a.decisionReason,a.recommendedService,a.recommendedEquipment,strings(a.knowledgeTagsJson),a.result);
    DateTimeFormatter date=DateTimeFormatter.ofPattern("dd/MM/yyyy"),time=DateTimeFormatter.ofPattern("HH:mm");
    List<History> history=r.history.stream().map(h->new History(h.id.toString(),h.occurredAt.format(date),h.occurredAt.format(time),h.action,h.actor,h.description)).toList();
    Map<String,Object> cancellation=r.cancelledAt==null?null:Map.of("reason",r.cancellationReason,"cancelledAt",r.cancelledAt.toString()+"Z","cancelledBy",r.cancelledBy);
    return new Response(r.requestCode,r.id.toString(),r.source,"internal",r.origin,r.channel,r.company,r.contact,r.email,r.phone,r.requestNeedId,r.service,List.copyOf(r.services),r.createdAt.format(date),r.updatedAt.format(date),r.status,r.priority,r.responsible,r.pieces.stream().mapToInt(p->p.quantity).sum(),r.objective,r.comments,r.internalNotes,map(r.customerJson),map(r.projectJson),pieces,maps(r.attachmentsJson),r.linkedQuoteId,cancellation,analysis,history);
  }
}
