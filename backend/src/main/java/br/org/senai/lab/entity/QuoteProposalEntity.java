package br.org.senai.lab.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;
@Entity @Table(name="quote_proposal")
public class QuoteProposalEntity {
  @Id public UUID id;
  @Column(name="revision") public long revision;
  @Column(name="has_draft") public boolean hasDraft;
  @Column(name="sections_json",columnDefinition="nvarchar(max)") public String sectionsJson;
  @Column(name="investment_display",length=40) public String investmentDisplay;
  @Column(name="selected_media_json",columnDefinition="nvarchar(max)") public String selectedMediaJson;
  @Column(name="scope",columnDefinition="nvarchar(max)") public String scope;
  @Column(name="technology",columnDefinition="nvarchar(max)") public String technology;
  @Column(name="deadline",columnDefinition="nvarchar(max)") public String deadline;
  @Column(name="validity",columnDefinition="nvarchar(max)") public String validity;
  @Column(name="terms",columnDefinition="nvarchar(max)") public String terms;
  @Column(name="notes",columnDefinition="nvarchar(max)") public String notes;
  @Column(name="updated_at") public LocalDateTime updatedAt;
  @Column(name="accepted_version") public Integer acceptedVersion;
  @OneToOne @JoinColumn(name="quote_id",nullable=false,unique=true) public QuoteEntity quote;
  @OneToMany(mappedBy="proposal",cascade=CascadeType.ALL) @OrderBy("number ASC") public List<QuoteProposalVersionEntity> versions=new ArrayList<>();
}
