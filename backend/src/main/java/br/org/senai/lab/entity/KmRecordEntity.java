package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
/** Service Record: block A (quoted), block B (realized) and block C (causes + lesson, see KmLessonEntity). */
@Entity @Table(name="km_record")
public class KmRecordEntity {
  @Id public UUID id;
  @Column(nullable=false,length=20) public String code;
  public boolean demo;
  @Column(nullable=false,length=12) public String confidentiality;
  @Column(nullable=false,length=12) public String status;
  @Column(name="quote_code",length=40) public String quoteCode;
  @Column(name="client_code",length=60) public String clientCode;
  @Column(name="service_type_id",nullable=false) public UUID serviceTypeId;
  @Column(name="size_id",nullable=false) public UUID sizeId;
  @Column(name="material_id") public UUID materialId;
  @Column(name="complexity_id") public UUID complexityId;
  @Column(name="feature_count_id") public UUID featureCountId;
  @Column(name="gdt_id") public UUID gdtId;
  @Column(name="estimated_hours",nullable=false,precision=10,scale=2) public BigDecimal estimatedHours;
  @Column(name="estimated_cost",precision=14,scale=2) public BigDecimal estimatedCost;
  @Column(name="proposed_value",precision=14,scale=2) public BigDecimal proposedValue;
  @Column(name="planned_delivery") public LocalDate plannedDelivery;
  @Column(columnDefinition="nvarchar(max)") public String assumptions;
  @Column(name="estimated_by",nullable=false,length=200) public String estimatedBy;
  @Column(name="estimated_at",nullable=false) public LocalDateTime estimatedAt;
  @Column(name="recommendation_json",columnDefinition="nvarchar(max)") public String recommendationJson;
  @Column(name="deviation_justification",columnDefinition="nvarchar(max)") public String deviationJustification;
  @Column(name="actual_hours",precision=10,scale=2) public BigDecimal actualHours;
  @Column(name="actual_cost",precision=14,scale=2) public BigDecimal actualCost;
  @Column(name="billed_value",precision=14,scale=2) public BigDecimal billedValue;
  @Column(name="actual_delivery") public LocalDate actualDelivery;
  public Boolean rework;
  @Column(name="scope_change") public Boolean scopeChange;
  @Column(name="closed_by",length=200) public String closedBy;
  @Column(name="closed_at") public LocalDateTime closedAt;
  @Column(name="created_at",nullable=false) public LocalDateTime createdAt;
  @Column(name="updated_at",nullable=false) public LocalDateTime updatedAt;
  @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="km_record_resource",joinColumns=@JoinColumn(name="record_id")) @Column(name="term_id") public Set<UUID> resources=new LinkedHashSet<>();
  @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="km_record_cause",joinColumns=@JoinColumn(name="record_id")) @Column(name="term_id") public Set<UUID> causes=new LinkedHashSet<>();
}
