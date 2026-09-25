package br.org.senai.lab.service;

import br.org.senai.lab.dto.QuoteDtos.*;
import br.org.senai.lab.entity.*;
import br.org.senai.lab.exception.ApiException;
import br.org.senai.lab.mapper.QuoteMapper;
import br.org.senai.lab.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.math.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@ApplicationScoped
public class QuoteService {
  static final Set<String> EDITABLE=Set.of("Rascunho","Em elaboração");
  static final Set<String> DIRECT=Set.of("failure-analysis","asset-structure","digital-library","maintenance","training");
  static final Map<String,String> SERVICES=Map.of("dimensional","Inspeção dimensional","scan","Digitalização 3D","reverse-engineering","Engenharia reversa","internal","Tomografia industrial","failure-analysis","Análise de falhas","asset-structure","Estruturação de ativos","digital-library","Biblioteca digital","maintenance","Manutenção","training","Treinamento");
  @Inject QuoteRepository repository;
  @Inject RequestRepository requests;
  @Inject QuoteMapper mapper;
  @Inject ProjectRepository projects;
  @Inject ObjectMapper json;
  @Inject br.org.senai.lab.security.CurrentUser current;
  /** Usuário interno que executa a ação (histórico). */
  String actor(){return current.name();}

  @Transactional public List<Map<String,Object>> list() { return repository.list().stream().map(this::response).toList(); }
  @Transactional public Map<String,Object> get(String id) { return response(required(id,false)); }
  @Transactional public Map<String,Object> create(String requestId,Create input) {
    RequestEntity r=requests.findLocked(requestId);
    if(r==null) throw new ApiException(404,"Solicitação não encontrada.");
    QuoteEntity existing=repository.byRequest(r.id);
    if(existing!=null) return response(existing);
    if(!"Apta para orçamento".equals(r.status)||r.linkedQuoteId!=null) throw conflict("Somente uma SOL apta pode gerar orçamento.");
    Create dto=input==null?new Create(null,null,null,null,null):input;
    BigDecimal rate=dto.hourlyRate()==null?new BigDecimal("150"):dto.hourlyRate();
    if(rate.signum()<=0) throw bad("Referência comercial inválida.");
    QuoteEntity q=new QuoteEntity(); q.id=UUID.randomUUID();q.quoteCode=formatQuoteCode(repository.nextNumber());q.request=r;
    q.company=r.company;q.contact=r.contact;q.email=r.email;q.phone=r.phone;q.requestNeedId=r.requestNeedId;
    q.requestOrigin=r.origin;q.requestChannel=r.channel;q.priority=r.priority;q.responsible=r.responsible;
    q.serviceId=r.service;q.services.addAll(r.services);q.status="Em elaboração";q.createdAt=now();q.updatedAt=q.createdAt;
    q.objective=r.objective;q.comments=r.comments;q.internalNotes=r.internalNotes;
    q.technicalSummary=r.analysis.technicalSummary;q.complexity=r.analysis.complexity;
    q.scope="Executar "+SERVICES.getOrDefault(r.service,r.service)+" conforme a solicitação "+r.requestCode+".\n\n"+Objects.toString(r.objective,"");
    String recommended=r.analysis.recommendedEquipment;
    q.machineId=EquipmentPolicy.normalize(q.serviceId, EquipmentPolicy.suggestedMachineId(recommended), null);
    q.estimateJustification="";q.commercialNotes="";q.deadlineDays=dto.deadlineDays()==null?10:dto.deadlineDays();q.validityDays=dto.validityDays()==null?15:dto.validityDays();
    for(PieceEntity original:r.pieces) {
      QuotePieceEntity p=new QuotePieceEntity();p.id=UUID.randomUUID();p.quote=q;p.position=q.pieces.size();
      p.clientId=original.clientId==null?original.id.toString():original.clientId;p.name=original.name;p.quantity=original.quantity;
      p.material=original.material;p.dimensions=original.dimensions;p.location=original.location;p.type=original.type;
      p.requirementsJson=original.requirementsJson;p.recommendationJson=original.recommendationJson;p.services.addAll(original.services);q.pieces.add(p);
      Collection<String> technical=p.services.isEmpty()?q.services:p.services;
      for(String service:technical) if(!DIRECT.contains(service)) addItem(q,p,service,rate,dto);
    }
    for(String service:q.services) if(DIRECT.contains(service)) addItem(q,null,service,rate,dto);
    if(q.items.isEmpty()) throw bad("A solicitação não possui composição válida para orçamento.");
    // The composite piece FK is not an ORM association. Persist pieces before their items,
    // within the same transaction, so SQL Server can enforce the relationship immediately.
    List<QuoteItemEntity> composition=new ArrayList<>(q.items);q.items.clear();
    event(q,"Orçamento criado","Criado a partir da solicitação "+r.requestCode+".");
    repository.persist(q);
    repository.flush();q.items.addAll(composition);
    r.linkedQuoteId=q.quoteCode;r.status="Convertida em orçamento";r.updatedAt=now();
    HistoryEntity h=new HistoryEntity();h.id=UUID.randomUUID();h.request=r;h.occurredAt=now();h.actor=actor();h.action="Convertida em orçamento";h.description="Orçamento vinculado: "+q.quoteCode;r.history.add(h);
    repository.flush();return response(q);
  }
  private void addItem(QuoteEntity q,QuotePieceEntity piece,String service,BigDecimal rate,Create dto) {
    QuoteItemEntity i=new QuoteItemEntity();i.id=UUID.randomUUID();i.clientId=i.id.toString();i.quote=q;i.position=q.items.size();
    i.serviceId=service;i.name=(piece==null?"":piece.name+" — ")+SERVICES.getOrDefault(service,service);
    i.requestPieceId=piece==null?null:piece.clientId;i.hourlyRate=rate;i.commercialRateReference=rate;
    i.commercialReferenceId=dto.referenceId();i.commercialReferenceEffectiveFrom=dto.referenceEffectiveFrom();i.referenceCapturedAt=now()+"Z";q.items.add(i);
  }
  @Transactional public Map<String,Object> update(String id,Update dto) {
    QuoteEntity q=required(id,true);revision(q,dto.revision());
    if(!EDITABLE.contains(q.status)) throw conflict("Os itens só podem ser alterados durante a elaboração.");
    var services=new ArrayList<>(q.services);services.add(q.serviceId);
    dto.items().forEach(i->services.add(i.serviceId()));
    var requirement=services.stream().filter(Objects::nonNull).map(EquipmentPolicy::requirement).min(Comparator.naturalOrder()).orElse(EquipmentPolicy.Requirement.REQUIRED);
    String machineId=EquipmentPolicy.normalize(requirement,dto.machineId(),q.machineId);
    EquipmentPolicy.validate(q.serviceId,machineId);
    for(String service:q.services) EquipmentPolicy.validate(service,machineId);
    for(Item item:dto.items()) if(item.serviceId()!=null) EquipmentPolicy.validate(item.serviceId(),machineId);
    Set<String> ids=new HashSet<>();Map<String,QuoteItemEntity> originals=new HashMap<>();q.items.forEach(i->originals.put(i.clientId,i));
    List<QuoteItemEntity> next=new ArrayList<>();
    for(Item input:dto.items()) {
      if(!ids.add(input.id())) throw bad("Cada item deve ter um identificador único.");
      if(input.serviceId()!=null&&!SERVICES.containsKey(input.serviceId())) throw bad("Serviço inválido.");
      if(input.requestPieceId()!=null&&q.pieces.stream().noneMatch(p->p.clientId.equals(input.requestPieceId()))) throw bad("Selecione uma peça existente na solicitação.");
      if(input.serviceId()!=null&&!DIRECT.contains(input.serviceId())&&input.requestPieceId()==null) throw bad("Vincule o serviço técnico a uma peça.");
      QuoteItemEntity i=mapper.item(input),original=originals.get(input.id());
      i.machineId=EquipmentPolicy.normalize(i.serviceId,i.machineId,original==null||!Objects.equals(original.serviceId,i.serviceId)?null:original.machineId);
      i.id=original==null?UUID.randomUUID():original.id;i.quote=q;i.position=next.size();
      if(original!=null) {i.commercialRateReference=original.commercialRateReference;i.commercialReferenceId=original.commercialReferenceId;i.commercialReferenceEffectiveFrom=original.commercialReferenceEffectiveFrom;i.referenceCapturedAt=original.referenceCapturedAt;}
      if(i.commercialRateReference==null||i.hourlyRate==null) throw bad("Informe o valor/hora e a referência comercial.");
      if(original!=null) { copyItem(i,original);next.add(original); } else next.add(i);
    }
    q.items.removeIf(i->!ids.contains(i.clientId));
    for(QuoteItemEntity i:next) if(!q.items.contains(i))q.items.add(i);
    q.scope=dto.scope();q.machineId=machineId;q.estimateJustification=dto.estimateJustification();q.commercialNotes=dto.commercialNotes();
    q.deadlineDays=dto.deadlineDays();q.validityDays=dto.validityDays();q.internalCost=dto.internalCost();touch(q);
    event(q,"Orçamento atualizado","Escopo e composição atualizados.");repository.flush();return response(q);
  }
  private void copyItem(QuoteItemEntity from,QuoteItemEntity to) {
    to.name=from.name;to.description=from.description;to.serviceId=from.serviceId;to.machineId=from.machineId;to.requestPieceId=from.requestPieceId;
    to.technicalHours=from.technicalHours;to.quotedHours=from.quotedHours;to.hourlyRate=from.hourlyRate;to.hourlyRateOverrideReason=from.hourlyRateOverrideReason;to.position=from.position;
  }
  @Transactional public Map<String,Object> status(String id,Status dto) {
    QuoteEntity q=required(id,true);revision(q,dto.revision());String target=dto.status();
    boolean allowed=switch(target) {
      case "Em revisão" -> EDITABLE.contains(q.status);
      case "Aprovado internamente" -> "Em revisão".equals(q.status);
      case "Em elaboração" -> Set.of("Em revisão","Aprovado internamente").contains(q.status);
      case "Cancelado" -> !Set.of("Aceito","Recusado","Cancelado").contains(q.status);
      default -> false;
    };
    if(!allowed) throw conflict("Transição de orçamento inválida.");
    if("Em revisão".equals(target)) validateReview(q);
    if("Cancelado".equals(target)&&blank(dto.reason())) throw bad("Informe o motivo do cancelamento.");
    q.status=target;touch(q);event(q,"Status: "+target,Objects.toString(dto.reason(),"Alteração de status registrada."));return response(q);
  }
  void validateEquipment(QuoteEntity q,String machineId) {
    EquipmentPolicy.validate(q.serviceId,machineId);
    for(String service:q.services) EquipmentPolicy.validate(service,machineId);
    for(QuoteItemEntity item:q.items) if(item.serviceId!=null) EquipmentPolicy.validate(item.serviceId,machineId);
  }
  void validateReview(QuoteEntity q) {
    validateEquipment(q,q.machineId);
    if(blank(q.scope)||blank(q.estimateJustification)||q.deadlineDays==null||q.deadlineDays<=0||q.validityDays==null||q.validityDays<=0||q.items.isEmpty()) throw bad("Preencha escopo, tecnologia, justificativa, prazos e composição antes da revisão.");
    for(QuoteItemEntity i:q.items) if(blank(i.name)||i.quotedHours==null||i.quotedHours.signum()<=0||i.hourlyRate==null||i.hourlyRate.signum()<=0) throw bad("Preencha as horas cotadas e valores dos itens.");
  }
  QuoteEntity required(String id,boolean lock) {QuoteEntity q=repository.find(id,lock);if(q==null)throw new ApiException(404,"Orçamento não encontrado.");return q;}
  void revision(QuoteEntity q,Long revision) {if(revision==null||q.revision!=revision)throw conflict("O orçamento foi alterado. Atualize a página antes de salvar.");}
  void touch(QuoteEntity q) {q.updatedAt=now();q.revision++;}
  void event(QuoteEntity q,String action,String description) {eventAs(q,action,description,actor());}
  void eventAs(QuoteEntity q,String action,String description,String who) {QuoteHistoryEntity h=new QuoteHistoryEntity();h.id=UUID.randomUUID();h.quote=q;h.occurredAt=now();h.actor=who;h.action=action;h.description=description;q.history.add(h);}
  static LocalDateTime now(){return LocalDateTime.now(ZoneOffset.UTC);}
  static boolean blank(String value){return value==null||value.isBlank();}
  static ApiException bad(String m){return new ApiException(400,m);}
  static ApiException conflict(String m){return new ApiException(409,m);}
  public static String formatQuoteCode(long number){return "ORC-"+String.format(Locale.ROOT,"%04d",number);}
  String write(Object value){try{return json.writeValueAsString(value);}catch(Exception e){throw bad("Dados inválidos.");}}
  Object read(String value){try{return value==null?null:json.readValue(value,Object.class);}catch(Exception e){throw new IllegalStateException("Dados persistidos inválidos",e);}}
  static Map<String,Object> map(Object... pairs){Map<String,Object> m=new LinkedHashMap<>();for(int i=0;i<pairs.length;i+=2)m.put((String)pairs[i],pairs[i+1]);return m;}
  static BigDecimal zero(BigDecimal n){return n==null?BigDecimal.ZERO:n;}
  Map<String,Object> response(QuoteEntity q) {
    ProjectEntity linkedProject=projects.byQuote(q.id);
    BigDecimal technical=BigDecimal.ZERO,hours=BigDecimal.ZERO,total=BigDecimal.ZERO;
    List<Map<String,Object>> items=new ArrayList<>();
    for(QuoteItemEntity i:q.items.stream().sorted(Comparator.comparingInt(i->i.position)).toList()) {
      BigDecimal subtotal=zero(i.quotedHours).multiply(zero(i.hourlyRate)).setScale(2,RoundingMode.HALF_UP);
      technical=technical.add(zero(i.technicalHours));hours=hours.add(zero(i.quotedHours));total=total.add(subtotal);
      items.add(map("id",i.clientId,"name",i.name,"description",i.description,"serviceId",i.serviceId,"machineId",i.machineId,"requestPieceId",i.requestPieceId,"technicalHours",i.technicalHours,"quotedHours",i.quotedHours,"hourlyRate",i.hourlyRate,"hourlyRateOverrideReason",i.hourlyRateOverrideReason,"commercialRateReference",i.commercialRateReference,"commercialReferenceId",i.commercialReferenceId,"commercialReferenceEffectiveFrom",i.commercialReferenceEffectiveFrom,"referenceCapturedAt",i.referenceCapturedAt,"subtotal",subtotal));
    }
    if(q.items.stream().anyMatch(i->i.technicalHours==null))technical=null;
    BigDecimal average=hours.signum()==0?BigDecimal.ZERO:total.divide(hours,4,RoundingMode.HALF_UP);
    if(q.items.stream().anyMatch(i->i.quotedHours==null))hours=null;
    var pieces=q.pieces.stream().map(p->map("id",p.clientId,"name",p.name,"quantity",p.quantity,"material",p.material,"dimensions",p.dimensions,"location",p.location,"type",p.type,"services",List.copyOf(p.services),"requirements",read(p.requirementsJson),"recommendation",read(p.recommendationJson))).toList();
    DateTimeFormatter date=DateTimeFormatter.ofPattern("dd/MM/yyyy"),time=DateTimeFormatter.ofPattern("HH:mm");
    var history=q.history.stream().map(h->map("id",h.id.toString(),"date",h.occurredAt.format(date),"time",h.occurredAt.format(time),"action",h.action,"actor",h.actor,"description",h.description)).toList();
    return map("projectId",linkedProject==null?null:linkedProject.projectCode,"convertedToProject",linkedProject!=null,"id",q.quoteCode,"technicalId",q.id.toString(),"requestId",q.request.requestCode,"requestTechnicalId",q.request.id.toString(),"source",Objects.toString(q.request.source,"real"),"demo","demo".equals(q.request.source),"visibility","internal","company",q.company,"contact",q.contact,"email",q.email,"phone",q.phone,"requestNeedId",q.requestNeedId,"requestOrigin",q.requestOrigin,"requestChannel",q.requestChannel,"status",q.status,"priority",q.priority,"responsible",q.responsible,"serviceId",q.serviceId,"service",SERVICES.getOrDefault(q.serviceId,q.serviceId),"services",List.copyOf(q.services),"scope",q.scope,"machineId",q.machineId,"objective",q.objective,"comments",q.comments,"internalNotes",q.internalNotes,"technicalSummary",q.technicalSummary,"complexity",q.complexity,"estimateJustification",q.estimateJustification,"commercialNotes",q.commercialNotes,"deadlineDays",q.deadlineDays,"validityDays",q.validityDays,"internalCost",q.internalCost,"items",items,"requestPieces",pieces,"technicalHours",technical,"totalTechnicalHours",technical,"billableHours",hours,"totalQuotedHours",hours,"hourlyRate",average,"proposedValue",total,"createdAt",q.createdAt.format(date),"updatedAt",q.updatedAt.format(date),"modifiedAt",q.updatedAt+"Z","revision",q.revision,"history",history,"proposal",q.proposal==null?null:ProposalService.response(q.proposal,this));
  }
}
