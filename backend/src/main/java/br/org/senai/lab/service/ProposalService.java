package br.org.senai.lab.service;
import br.org.senai.lab.dto.QuoteDtos.*;
import br.org.senai.lab.entity.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.*;
import java.util.*;
import static br.org.senai.lab.service.QuoteService.*;

@ApplicationScoped
public class ProposalService {
  @Inject QuoteService quotes;
  @Inject br.org.senai.lab.repository.QuoteRepository repository;
  @Inject com.fasterxml.jackson.databind.ObjectMapper json;
  /** Cada versão emitida guarda snapshot e PDF; o limite evita crescimento sem fim do banco. */
  public static final int MAX_VERSIONS=10;
  static final int MAX_PDF_CHARS=8*1024*1024;
  static final List<String> SECTIONS=List.of("scope","items","photos","technology","deadline","validity","terms","notes","files");
  // Commercial labels only; no equipment costs or pricing knowledge enter the document.
  static final Map<String,String> MACHINE_NAMES=Map.of("duramax","ZEISS DuraMax","o-inspect","ZEISS O-INSPECT","prismo","ZEISS PRISMO","bosello-max","ZEISS BOSELLO MAX","atos-q","ZEISS ATOS Q","contura","ZEISS CONTURA","t-scan","ZEISS T-SCAN");
  static String machineName(String id){return id==null?"":MACHINE_NAMES.getOrDefault(id,id);}
  @Transactional public Map<String,Object> get(String id) {var q=quotes.required(id,false);return q.proposal==null?null:response(q.proposal,quotes);}
  private void editable(QuoteEntity q) {if(!"Aprovado internamente".equals(q.status))throw conflict("Aprove o orçamento internamente antes de editar a proposta.");}
  private void revision(QuoteProposalEntity p,Long value) {if(value==null||p.revision!=value)throw conflict("A proposta foi alterada. Atualize a página.");}
  @Transactional public Map<String,Object> open(String id) {
    var q=quotes.required(id,true);if(q.proposal!=null)return response(q.proposal,quotes);editable(q);
    var p=new QuoteProposalEntity();p.id=UUID.randomUUID();p.quote=q;p.hasDraft=true;p.updatedAt=now();p.investmentDisplay="hours";
    Map<String,Boolean> sections=new LinkedHashMap<>();SECTIONS.forEach(k->sections.put(k,!Set.of("photos","files","technology").contains(k)));
    p.sectionsJson=quotes.write(sections);p.selectedMediaJson="[]";p.scope=q.scope;p.technology=EquipmentPolicy.label(q.serviceId,q.machineId);p.deadline=q.deadlineDays+" dias";p.validity=q.validityDays+" dias";p.terms="";p.notes=q.commercialNotes;
    q.proposal=p;quotes.event(q,"Proposta iniciada","Rascunho comercial criado.");repository.flush();return response(p,quotes);
  }
  @Transactional public Map<String,Object> save(String id,ProposalDraft dto) {
    var q=quotes.required(id,true);editable(q);var p=required(q);revision(p,dto.revision());if(!p.hasDraft)throw conflict("Crie uma nova versão para editar.");
    if(!Set.of("hours","items","total-only").contains(dto.investmentDisplay()))throw bad("Modo de investimento inválido.");
    Map<String,Boolean> sections=new LinkedHashMap<>();SECTIONS.forEach(k->sections.put(k,Boolean.TRUE.equals(dto.sections().get(k))));
    p.sectionsJson=quotes.write(sections);p.investmentDisplay=dto.investmentDisplay();
    // Não há upload comercial nesta missão; não aceitar referências arbitrárias a arquivos internos.
    if(!dto.selectedMedia().isEmpty())throw bad("Nenhuma mídia comercial autorizada está disponível.");
    p.selectedMediaJson="[]";p.scope=dto.content().get("scope");p.technology=dto.content().get("technology");p.deadline=dto.content().get("deadline");p.validity=dto.content().get("validity");p.terms=dto.content().get("terms");p.notes=dto.content().get("notes");p.updatedAt=now();p.revision++;return response(p,quotes);
  }
  @Transactional public Map<String,Object> next(String id,Map<String,Long> dto) {
    var q=quotes.required(id,true);editable(q);var p=required(q);revision(p,dto.get("revision"));
    if(!p.hasDraft&&p.versions.size()>=MAX_VERSIONS)throw conflict("Limite de "+MAX_VERSIONS+" versões por proposta atingido. Registre o resultado da última versão ou abra um novo orçamento.");
    if(!p.hasDraft) {p.hasDraft=true;p.scope=q.scope;p.technology=EquipmentPolicy.label(q.serviceId,q.machineId);p.notes=q.commercialNotes;p.deadline=q.deadlineDays+" dias";p.validity=q.validityDays+" dias";p.updatedAt=now();p.revision++;}
    return response(p,quotes);
  }
  @Transactional public Map<String,Object> generate(String id,Generate dto) {
    var q=quotes.required(id,true);editable(q);quotes.revision(q,dto.sourceQuoteRevision());var p=required(q);revision(p,dto.revision());
    if(!p.hasDraft)throw conflict("Não há rascunho para emitir.");
    if(p.versions.size()>=MAX_VERSIONS)throw conflict("Limite de "+MAX_VERSIONS+" versões por proposta atingido. Registre o resultado da última versão ou abra um novo orçamento.");
    // O documento é um snapshot comercial variável. A allowlist exclui custos, margens e notas internas.
    Map<String,Object> snapshot=snapshot(q,p);
    com.fasterxml.jackson.databind.JsonNode expected=json.valueToTree(snapshot), received=json.valueToTree(dto.snapshot());
    if(!expected.equals((a,b)->a.isNumber()&&b.isNumber()?a.decimalValue().compareTo(b.decimalValue()):a.equals(b)?0:1,received))throw conflict("Os dados comerciais mudaram. Atualize a prévia e gere novamente.");
    var v=new QuoteProposalVersionEntity();v.id=UUID.randomUUID();v.proposal=p;v.number=p.versions.size()+1;v.status="generated";v.createdAt=now();v.createdBy=quotes.actor();v.sourceQuoteRevision=q.revision;
    v.snapshotJson=quotes.write(snapshot);v.sectionsJson=p.sectionsJson;v.selectedMediaJson=p.selectedMediaJson;v.investmentDisplay=p.investmentDisplay;
    v.pdfFileName=q.quoteCode.replace("ORC-","PROP-")+"_V"+v.number+".pdf";v.pdfJson=quotes.write(dto.pdf());
    if(v.pdfJson!=null&&v.pdfJson.length()>MAX_PDF_CHARS)throw bad("O PDF da proposta excede 8 MB. Reduza o conteúdo antes de emitir.");
    p.versions.forEach(old->{if("generated".equals(old.status))old.status="superseded";});p.versions.add(v);p.hasDraft=false;p.updatedAt=now();p.revision++;
    quotes.event(q,"Proposta emitida","Versão V"+v.number+" preservada.");return response(p,quotes);
  }
  @Transactional public Map<String,Object> result(String id,int number,Result dto) {
    return resultAs(id,number,dto,quotes.actor());
  }
  @Transactional public Map<String,Object> resultAs(String id,int number,Result dto,String actor) {
    var q=quotes.required(id,true);editable(q);var p=required(q);revision(p,dto.revision());
    var v=p.versions.stream().filter(item->item.number==number).findFirst().orElseThrow(()->bad("Versão não encontrada."));
    if(p.hasDraft||!"generated".equals(v.status))throw conflict("Selecione a versão vigente, sem rascunho aberto.");
    if(!Set.of("accepted","revision","rejected").contains(dto.type()))throw bad("Resultado inválido.");
    try {if(!LocalDate.parse(dto.date()).toString().equals(dto.date()))throw new IllegalArgumentException();}catch(Exception e){throw bad("Informe uma data válida.");}
    if("accepted".equals(dto.type())&&v.sourceQuoteRevision!=q.revision)throw conflict("O orçamento mudou. Gere nova versão antes do aceite.");
    v.resultType=dto.type();v.resultDate=dto.date();v.resultNote=dto.note();v.resultActor=actor;v.resultRegisteredAt=now();v.status="revision".equals(dto.type())?"superseded":dto.type();
    p.acceptedVersion="accepted".equals(dto.type())?v.number:null;p.revision++;p.updatedAt=now();
    q.status=switch(dto.type()){case "accepted"->"Aceito";case "rejected"->"Recusado";default->"Em elaboração";};quotes.touch(q);quotes.eventAs(q,"Resultado da proposta",q.status+": "+Objects.toString(dto.note(),""),actor);return response(p,quotes);
  }
  private QuoteProposalEntity required(QuoteEntity q){if(q.proposal==null)throw bad("Proposta não iniciada.");return q.proposal;}
  @SuppressWarnings("unchecked") Map<String,Object> snapshot(QuoteEntity q,QuoteProposalEntity p) {
    Map<String,Boolean> sections=(Map<String,Boolean>)quotes.read(p.sectionsJson);
    List<Map<String,Object>> groups=new ArrayList<>();
    if(!"total-only".equals(p.investmentDisplay)&&Boolean.TRUE.equals(sections.get("items"))) {
      for(QuotePieceEntity piece:q.pieces) addGroup(groups,q,p,piece,sections);
      addGroup(groups,q,p,null,sections);
    }
    return map("client",map("company",q.company,"contact",q.contact),"sections",sections,"content",content(p),"investmentDisplay",p.investmentDisplay,"groups",groups,"items",groups.stream().flatMap(g->((List<?>)g.get("items")).stream()).toList(),"total",q.items.stream().map(i->zero(i.quotedHours).multiply(zero(i.hourlyRate))).reduce(java.math.BigDecimal.ZERO,java.math.BigDecimal::add).setScale(2,java.math.RoundingMode.HALF_UP),"media",List.of());
  }
  private void addGroup(List<Map<String,Object>> groups,QuoteEntity q,QuoteProposalEntity p,QuotePieceEntity piece,Map<String,Boolean> sections) {
    var items=q.items.stream().sorted(Comparator.comparingInt(i->i.position)).filter(i->Objects.equals(i.requestPieceId,piece==null?null:piece.clientId)).toList();if(items.isEmpty())return;
    List<Map<String,Object>> commercial=new ArrayList<>();java.math.BigDecimal total=java.math.BigDecimal.ZERO;
    for(var i:items) {
      var subtotal=zero(i.quotedHours).multiply(zero(i.hourlyRate)).setScale(2,java.math.RoundingMode.HALF_UP);total=total.add(subtotal);
      String name=i.name;if(piece!=null&&name.equals(piece.name+" — "+SERVICES.get(i.serviceId)))name=SERVICES.get(i.serviceId);
      var item=map("name",name,"subtotal",subtotal);if("hours".equals(p.investmentDisplay))item.put("quotedHours",i.quotedHours);
      if(Boolean.TRUE.equals(sections.get("technology")))item.put("equipment",EquipmentPolicy.label(i.serviceId,blank(i.machineId)&&EquipmentPolicy.requirement(i.serviceId)==EquipmentPolicy.Requirement.REQUIRED?q.machineId:i.machineId));
      commercial.add(item);
    }
    groups.add(map("piece",piece==null?null:map("id",piece.clientId,"name",piece.name,"code","","quantity",piece.quantity),"items",commercial,"subtotal",total));
  }
  static Map<String,Object> content(QuoteProposalEntity p){return map("scope",Objects.toString(p.scope,""),"technology",Objects.toString(p.technology,""),"deadline",Objects.toString(p.deadline,""),"validity",Objects.toString(p.validity,""),"terms",Objects.toString(p.terms,""),"notes",Objects.toString(p.notes,""));}
  static Map<String,Object> response(QuoteProposalEntity p,QuoteService s) {
    String id=p.quote.quoteCode.replace("ORC-","PROP-");
    var versions=p.versions.stream().map(v->map("proposalId",id,"quoteId",p.quote.quoteCode,"version",v.number,"status",v.status,"locked",true,"createdAt",v.createdAt+"Z","createdBy",v.createdBy,"sourceQuoteRevision",v.sourceQuoteRevision,"snapshot",s.read(v.snapshotJson),"sections",s.read(v.sectionsJson),"selectedMedia",s.read(v.selectedMediaJson),"investmentDisplay",v.investmentDisplay,"pdfFileName",v.pdfFileName,"pdf",s.read(v.pdfJson),"result",v.resultType==null?null:map("type",v.resultType,"date",v.resultDate,"note",v.resultNote,"actor",v.resultActor,"registeredAt",v.resultRegisteredAt+"Z"))).toList();
    return map("id",id,"quoteId",p.quote.quoteCode,"source","real","revision",p.revision,"acceptedVersion",p.acceptedVersion,"versions",versions,"draft",!p.hasDraft?null:map("sections",s.read(p.sectionsJson),"investmentDisplay",p.investmentDisplay,"selectedMedia",s.read(p.selectedMediaJson),"content",content(p),"updatedAt",p.updatedAt+"Z"));
  }
  @Transactional public Map<String,Object> document(String id){var q=quotes.required(id,false);var p=required(q);if(!p.hasDraft)throw bad("Rascunho não encontrado.");return map("proposalId",q.quoteCode.replace("ORC-","PROP-"),"quoteId",id,"version",p.versions.size()+1,"createdAt",p.updatedAt+"Z","snapshot",snapshot(q,p));}
}
