package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;
/** Apontamento de horas gastas numa tarefa. A soma por projeto alimenta o bloco B do Registro de Serviço. */
@Entity @Table(name="project_time_entry")
public class ProjectTimeEntryEntity {
  @Id public UUID id;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="task_id",nullable=false) public ProjectTaskEntity task;
  @Column(name="user_id",nullable=false) public UUID userId;
  @Column(name="work_date",nullable=false) public LocalDate workDate;
  @Column(nullable=false,precision=6,scale=2) public BigDecimal hours;
  @Column(length=500) public String note;
  @Column(name="created_at",nullable=false) public LocalDateTime createdAt;
}
