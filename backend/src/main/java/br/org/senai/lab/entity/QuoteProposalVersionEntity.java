package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;
@Entity @Table(name="quote_proposal_version")
public class QuoteProposalVersionEntity {
  @Id public UUID id;
  @Column(name="number") public int number;
  @Column(name="status",length=40) public String status;
  @Column(name="created_at") public LocalDateTime createdAt;
  @Column(name="created_by",length=200) public String createdBy;
  @Column(name="source_quote_revision") public long sourceQuoteRevision;
  @Column(name="snapshot_json",columnDefinition="nvarchar(max)") public String snapshotJson;
  @Column(name="sections_json",columnDefinition="nvarchar(max)") public String sectionsJson;
  @Column(name="selected_media_json",columnDefinition="nvarchar(max)") public String selectedMediaJson;
  @Column(name="investment_display",length=40) public String investmentDisplay;
  @Column(name="pdf_file_name",length=250) public String pdfFileName;
  @Column(name="pdf_json",columnDefinition="nvarchar(max)") public String pdfJson;
  @Column(name="result_type",length=40) public String resultType;
  @Column(name="result_date",length=10) public String resultDate;
  @Column(name="result_note",columnDefinition="nvarchar(max)") public String resultNote;
  @Column(name="result_actor",length=200) public String resultActor;
  @Column(name="result_registered_at") public LocalDateTime resultRegisteredAt;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="proposal_id",nullable=false) public QuoteProposalEntity proposal;
}
