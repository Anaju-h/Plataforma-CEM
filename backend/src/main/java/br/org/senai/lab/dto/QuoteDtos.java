package br.org.senai.lab.dto;

import java.math.BigDecimal;
import java.util.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public final class QuoteDtos {
  private QuoteDtos() {}
  public record Create(@Positive BigDecimal hourlyRate, String referenceId, String referenceEffectiveFrom,
      @Min(0) Integer deadlineDays, @Min(1) Integer validityDays) {}
  public record Item(@NotBlank String id, @NotBlank String name, String description, String serviceId,
      String machineId, String requestPieceId, @PositiveOrZero BigDecimal technicalHours,
      @PositiveOrZero BigDecimal quotedHours, @Positive BigDecimal hourlyRate,
      String hourlyRateOverrideReason, @Positive BigDecimal commercialRateReference,
      String commercialReferenceId, String commercialReferenceEffectiveFrom, String referenceCapturedAt) {}
  public record Update(@NotNull Long revision, String scope, String machineId, String estimateJustification,
      String commercialNotes, @Min(0) Integer deadlineDays, @Min(1) Integer validityDays,
      @PositiveOrZero BigDecimal internalCost, @NotNull List<@Valid Item> items) {}
  public record Status(@NotNull Long revision, @NotBlank String status, String reason) {}
  public record ProposalDraft(@NotNull Long revision, @NotNull Map<String,Boolean> sections,
      @NotBlank String investmentDisplay, @NotNull List<String> selectedMedia, @NotNull Map<String,String> content) {}
  public record Generate(@NotNull Long revision, @NotNull Long sourceQuoteRevision,
      @NotNull Map<String,Object> snapshot, @NotBlank String pdfFileName, @NotNull Map<String,Object> pdf) {}
  public record Result(@NotNull Long revision, @NotBlank String type, @NotBlank String date, String note, String actor) {}
}
