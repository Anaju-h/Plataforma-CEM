package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
@Entity @Table(name="request_history")
public class HistoryEntity {
  @Id public UUID id;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="request_id",nullable=false) public RequestEntity request;
  @Column(name="occurred_at") public LocalDateTime occurredAt;
  public String action, actor;
  @Column(columnDefinition="nvarchar(max)") public String description;
}
