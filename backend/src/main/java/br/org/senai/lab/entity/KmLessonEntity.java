package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;
/** Lesson learned. DRAFT → IN_VALIDATION → FORMALIZED → SUPERSEDED. Only FORMALIZED feeds recommendations. */
@Entity @Table(name="km_lesson")
public class KmLessonEntity {
  @Id public UUID id;
  @Column(nullable=false,length=20) public String code;
  @Column(name="record_id") public UUID recordId;
  public boolean demo;
  @Column(nullable=false,length=12) public String confidentiality;
  @Column(nullable=false,length=16) public String status;
  @Column(nullable=false,length=200) public String title;
  @Column(nullable=false,columnDefinition="nvarchar(max)") public String body;
  @Column(nullable=false,length=200) public String author;
  @Column(name="created_at",nullable=false) public LocalDateTime createdAt;
  @Column(name="updated_at",nullable=false) public LocalDateTime updatedAt;
  @Column(name="submitted_at") public LocalDateTime submittedAt;
  @Column(name="validated_by",length=200) public String validatedBy;
  @Column(name="validated_at") public LocalDateTime validatedAt;
  @Column(name="validation_note",columnDefinition="nvarchar(max)") public String validationNote;
  @Column(name="superseded_by",length=200) public String supersededBy;
  @Column(name="superseded_at") public LocalDateTime supersededAt;
  @Column(name="superseded_reason",columnDefinition="nvarchar(max)") public String supersededReason;
  @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="km_lesson_subject",joinColumns=@JoinColumn(name="lesson_id")) @Column(name="term_id") public Set<UUID> subjects=new LinkedHashSet<>();
}
