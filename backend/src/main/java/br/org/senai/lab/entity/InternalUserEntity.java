package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
@Entity @Table(name="internal_user")
public class InternalUserEntity {
  @Id public UUID id;
  @Column(nullable=false,length=200) public String name;
  @Column(nullable=false,length=320) public String email;
  @Column(nullable=false,length=20) public String role;
  @Column(name="password_hash",nullable=false,length=200) public String passwordHash;
  public boolean active;
  @Column(name="created_at",nullable=false) public LocalDateTime createdAt;
  @Column(name="updated_at",nullable=false) public LocalDateTime updatedAt;
}
