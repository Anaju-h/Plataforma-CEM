package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.util.*;
@Entity @Table(name="request_piece")
public class PieceEntity {
  @Id public UUID id;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="request_id",nullable=false) public RequestEntity request;
  @Column(name="client_id") public String clientId;
  public String name, material, dimensions, location, type;
  public int quantity;
  @Column(name="requirements_json",columnDefinition="nvarchar(max)") public String requirementsJson;
  @Column(name="recommendation_json",columnDefinition="nvarchar(max)") public String recommendationJson;
  @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="piece_service",joinColumns=@JoinColumn(name="piece_id")) @Column(name="service_id") public Set<String> services=new LinkedHashSet<>();
}
