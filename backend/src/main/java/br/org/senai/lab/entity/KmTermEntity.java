package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
/** Controlled vocabulary term. Terms are never deleted (only deactivated) so history stays comparable. */
@Entity @Table(name="km_term")
public class KmTermEntity {
  @Id public UUID id;
  @Column(name="class_code",nullable=false,length=30) public String classCode;
  @Column(nullable=false,length=150) public String label;
  @Column(columnDefinition="nvarchar(max)") public String description;
  @Column(columnDefinition="nvarchar(max)") public String guidance;
  public boolean active;
  @Column(name="sort_order") public int sortOrder;
  @Column(name="created_at",nullable=false) public LocalDateTime createdAt;
  @Column(name="updated_at",nullable=false) public LocalDateTime updatedAt;
}
