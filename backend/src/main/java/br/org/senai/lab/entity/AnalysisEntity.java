package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
@Entity @Table(name="request_analysis")
public class AnalysisEntity {
  @Id @Column(name="request_id") public UUID requestId;
  @MapsId @OneToOne @JoinColumn(name="request_id") public RequestEntity request;
  public String status, responsible, complexity, result;
  @Column(name="started_at") public LocalDateTime startedAt;
  @Column(name="resumed_at") public LocalDateTime resumedAt;
  @Column(name="completed_at") public LocalDateTime completedAt;
  @Column(name="updated_at") public LocalDateTime updatedAt;
  @Column(name="updated_by") public String updatedBy;
  @Column(name="technical_summary",columnDefinition="nvarchar(max)") public String technicalSummary;
  @Column(name="pending_information",columnDefinition="nvarchar(max)") public String pendingInformation;
  @Column(name="decision_reason",columnDefinition="nvarchar(max)") public String decisionReason;
  @Column(name="recommended_service") public String recommendedService;
  @Column(name="recommended_equipment") public String recommendedEquipment;
  @Column(name="knowledge_tags_json",columnDefinition="nvarchar(max)") public String knowledgeTagsJson;
}
