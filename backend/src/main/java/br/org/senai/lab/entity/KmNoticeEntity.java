package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
/** In-app notice sent to subscribers when a lesson on their subject is formalized. */
@Entity @Table(name="km_notice")
public class KmNoticeEntity {
  @Id public UUID id;
  @Column(name="user_id",nullable=false) public UUID userId;
  @Column(name="lesson_id",nullable=false) public UUID lessonId;
  @Column(nullable=false,length=400) public String reason;
  @Column(name="created_at",nullable=false) public LocalDateTime createdAt;
  @Column(name="read_at") public LocalDateTime readAt;
}
