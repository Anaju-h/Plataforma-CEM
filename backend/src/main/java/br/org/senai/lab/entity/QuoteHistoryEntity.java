package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;
@Entity @Table(name="quote_history")
public class QuoteHistoryEntity {
  @Id public UUID id;
  @Column(name="occurred_at") public LocalDateTime occurredAt;
  @Column(name="action",length=120) public String action;
  @Column(name="actor",length=200) public String actor;
  @Column(name="description",columnDefinition="nvarchar(max)") public String description;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="quote_id",nullable=false) public QuoteEntity quote;
}
