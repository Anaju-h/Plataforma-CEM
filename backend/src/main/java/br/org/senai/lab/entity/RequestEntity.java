package br.org.senai.lab.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity @Table(name="lab_request")
public class RequestEntity {
  @Id public UUID id;
  @Column(name="request_code",nullable=false,unique=true) public String requestCode;
  public String source, origin, channel, company, contact, email, phone;
  @Column(name="request_need_id") public String requestNeedId;
  public String service;
  @Column(name="created_at") public LocalDateTime createdAt;
  @Column(name="updated_at") public LocalDateTime updatedAt;
  public String status, priority, responsible;
  @Column(columnDefinition="nvarchar(max)") public String objective, comments;
  @Column(name="internal_notes",columnDefinition="nvarchar(max)") public String internalNotes;
  @Column(name="linked_quote_id") public String linkedQuoteId;
  @Column(name="customer_json",columnDefinition="nvarchar(max)") public String customerJson;
  @Column(name="project_json",columnDefinition="nvarchar(max)") public String projectJson;
  @Column(name="attachments_json",columnDefinition="nvarchar(max)") public String attachmentsJson;
  @Column(name="cancellation_reason",columnDefinition="nvarchar(max)") public String cancellationReason;
  @Column(name="cancelled_at") public LocalDateTime cancelledAt;
  @Column(name="cancelled_by") public String cancelledBy;
  @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="request_service",joinColumns=@JoinColumn(name="request_id")) @Column(name="service_id") public Set<String> services=new LinkedHashSet<>();
  @OneToMany(mappedBy="request",cascade=CascadeType.ALL,orphanRemoval=true) public List<PieceEntity> pieces=new ArrayList<>();
  @OneToOne(mappedBy="request",cascade=CascadeType.ALL,orphanRemoval=true) public AnalysisEntity analysis;
  @OneToMany(mappedBy="request",cascade=CascadeType.ALL,orphanRemoval=true) @OrderBy("occurredAt ASC") public List<HistoryEntity> history=new ArrayList<>();
  @Version public long version;
}
