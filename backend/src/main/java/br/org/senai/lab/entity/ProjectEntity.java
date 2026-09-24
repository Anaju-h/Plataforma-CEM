package br.org.senai.lab.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;

@Entity @Table(name="lab_project")
public class ProjectEntity {
  @Id public UUID id;
  @Column(name="project_code",nullable=false,length=40) public String projectCode;
  @OneToOne(fetch=FetchType.LAZY) @JoinColumn(name="quote_id",nullable=false,unique=true) public QuoteEntity quote;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="accepted_proposal_id",nullable=false) public QuoteProposalEntity acceptedProposal;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="accepted_version_id",nullable=false) public QuoteProposalVersionEntity acceptedVersion;
  @Column(length=200) public String responsible;
  @Column(nullable=false,length=60) public String status;
  @Column(length=40) public String priority;
  @Column(columnDefinition="nvarchar(max)") public String description;
  @Column(name="internal_notes",columnDefinition="nvarchar(max)") public String internalNotes;
  public LocalDate deadline;
  @Column(name="created_at",nullable=false) public LocalDateTime createdAt;
  @Column(name="updated_at",nullable=false) public LocalDateTime updatedAt;
  @Column(name="completed_at") public LocalDate completedAt;
  public long revision;
  @OneToMany(mappedBy="project",cascade=CascadeType.ALL) @OrderBy("position ASC") public List<ProjectTaskEntity> tasks=new ArrayList<>();
  @OneToMany(mappedBy="project",cascade=CascadeType.ALL) @OrderBy("occurredAt ASC") public List<ProjectHistoryEntity> history=new ArrayList<>();
}
