package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;
@Entity @Table(name="quote_item")
public class QuoteItemEntity {
  @Id public UUID id;
  @Column(name="client_id",length=100) public String clientId;
  @Column(name="name",length=500) public String name;
  @Column(name="description",columnDefinition="nvarchar(max)") public String description;
  @Column(name="service_id",length=80) public String serviceId;
  @Column(name="machine_id",length=250) public String machineId;
  @Column(name="request_piece_id",length=100) public String requestPieceId;
  @Column(name="technical_hours",precision=19,scale=4) public BigDecimal technicalHours;
  @Column(name="quoted_hours",precision=19,scale=4) public BigDecimal quotedHours;
  @Column(name="hourly_rate",precision=19,scale=4) public BigDecimal hourlyRate;
  @Column(name="hourly_rate_override_reason",columnDefinition="nvarchar(max)") public String hourlyRateOverrideReason;
  @Column(name="commercial_rate_reference",precision=19,scale=4) public BigDecimal commercialRateReference;
  @Column(name="commercial_reference_id",length=100) public String commercialReferenceId;
  @Column(name="commercial_reference_effective_from",length=100) public String commercialReferenceEffectiveFrom;
  @Column(name="reference_captured_at",length=100) public String referenceCapturedAt;
  @Column(name="position") public int position;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="quote_id",nullable=false) public QuoteEntity quote;
}
