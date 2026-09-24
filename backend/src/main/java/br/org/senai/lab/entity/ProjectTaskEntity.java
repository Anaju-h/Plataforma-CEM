package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.util.UUID;
@Entity @Table(name="project_task")
public class ProjectTaskEntity {
  @Id public UUID id;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="project_id",nullable=false) public ProjectEntity project;
  public int position;
  @Column(nullable=false,length=250) public String title;
  public boolean completed;
}
