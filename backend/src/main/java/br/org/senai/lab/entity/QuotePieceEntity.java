package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;
@Entity @Table(name="quote_piece")
public class QuotePieceEntity {
  @Id public UUID id;
  @Column(name="client_id",length=100) public String clientId;
  @Column(name="name",length=250) public String name;
  @Column(name="quantity") public int quantity;
  @Column(name="material",length=250) public String material;
  @Column(name="dimensions",length=250) public String dimensions;
  @Column(name="location",length=500) public String location;
  @Column(name="type",length=100) public String type;
  @Column(name="requirements_json",columnDefinition="nvarchar(max)") public String requirementsJson;
  @Column(name="recommendation_json",columnDefinition="nvarchar(max)") public String recommendationJson;
  @Column(name="position") public int position;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="quote_id",nullable=false) public QuoteEntity quote;
  @ElementCollection @CollectionTable(name="quote_piece_service",joinColumns=@JoinColumn(name="piece_id")) @Column(name="service_id") public Set<String> services=new LinkedHashSet<>();
}
