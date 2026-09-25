package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
@Entity @Table(name="customer_user")
public class CustomerUserEntity {
  @Id public UUID id;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="company_id",nullable=false) public CustomerCompanyEntity company;
  @Column(nullable=false,length=250) public String name;
  @Column(nullable=false,length=320) public String email;
  @Column(length=60) public String phone;
  public boolean active;
  @Column(name="password_hash",length=200) public String passwordHash;
  @Column(name="created_at",nullable=false) public LocalDateTime createdAt;
  @Column(name="updated_at",nullable=false) public LocalDateTime updatedAt;
}
