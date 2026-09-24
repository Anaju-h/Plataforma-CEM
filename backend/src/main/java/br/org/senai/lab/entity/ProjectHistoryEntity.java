package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
@Entity @Table(name="project_history")
public class ProjectHistoryEntity {
  @Id public UUID id;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="project_id",nullable=false) public ProjectEntity project;
  @Column(name="occurred_at",nullable=false) public LocalDateTime occurredAt;
  @Column(nullable=false,length=120) public String action;
  @Column(nullable=false,length=200) public String actor;
  @Column(columnDefinition="nvarchar(max)") public String description;
}
