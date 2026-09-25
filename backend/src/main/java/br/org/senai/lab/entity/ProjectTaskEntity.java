package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
/** Tarefa de um projeto: delegada pelo Administrador a um membro da equipe, com horas planejadas e apontamentos. */
@Entity @Table(name="project_task")
public class ProjectTaskEntity {
  @Id public UUID id;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="project_id",nullable=false) public ProjectEntity project;
  public int position;
  @Column(nullable=false,length=250) public String title;
  public boolean completed;
  @Column(name="assignee_id") public UUID assigneeId;
  @Column(nullable=false,length=16) public String status="TODO";
  @Column(columnDefinition="nvarchar(max)") public String description;
  @Column(name="due_date") public LocalDate dueDate;
  @Column(name="planned_hours",precision=10,scale=2) public BigDecimal plannedHours;
  @Column(name="created_at") public LocalDateTime createdAt;
  @Column(name="updated_at") public LocalDateTime updatedAt;
  @Column(name="completed_at") public LocalDateTime completedAt;
  @OneToMany(mappedBy="task",cascade=CascadeType.ALL,orphanRemoval=true) @OrderBy("workDate DESC, createdAt DESC") public List<ProjectTimeEntryEntity> entries=new ArrayList<>();
}
