package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
@Entity @Table(name="customer_company")
public class CustomerCompanyEntity {
  @Id public UUID id;
  @Column(nullable=false,length=250) public String name;
  @Column(length=60) public String document,phone,state;
  @Column(length=120) public String city;
  @Column(name="created_at",nullable=false) public LocalDateTime createdAt;
  @Column(name="updated_at",nullable=false) public LocalDateTime updatedAt;
}
