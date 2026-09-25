package br.org.senai.lab.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.*;

public final class RequestDtos {
  private RequestDtos() {}
  public record Contact(@NotBlank String company,@NotBlank String name,@Email String email,String phone) {}
  public record Project(@NotBlank String requestNeedId,String objective,String observations,String urgency,String deadlineType,String specificDate,List<Map<String,Object>> generalFiles) {}
  public record Internal(String channel,String channelDetails,String department) {}
  public record Piece(String id,@NotBlank String name,@Min(1) int quantity,String material,String dimensions,String location,String type,List<String> services,Map<String,Object> requirements,Map<String,Object> recommendation) {}
  public record Create(@NotNull @Valid Contact contact,@NotNull @Valid Project project,Internal internal,List<@Valid Piece> pieces,String origin,String channel,Boolean demo,Map<String,Object> configuration) {}
  public record AnalysisUpdate(String service,String recommendedService,String technology,String recommendedEquipment,String technicalResponsible,String responsible,String summary,String technicalSummary,String complexity,String pendingInformation,String decisionReason,List<String> knowledgeTags) {}
  public record Finish(String result,String service,String recommendedService,String technology,String recommendedEquipment,String technicalResponsible,String responsible,String summary,String technicalSummary,String complexity,String pendingInformation,String decisionReason,List<String> knowledgeTags) {}
  public record Notes(String notes) {}
  public record Cancel(@NotBlank String reason) {}
  public record Assignment(@NotBlank String responsible) {}
  public record Analysis(String status,String responsible,LocalDateTime startedAt,LocalDateTime resumedAt,LocalDateTime completedAt,LocalDateTime updatedAt,String updatedBy,String complexity,String technicalSummary,String pendingInformation,String decisionReason,String recommendedService,String recommendedEquipment,List<String> knowledgeTags,String result) {}
  public record History(String id,String date,String time,String action,String actor,String description) {}
  public record Response(String id,String technicalId,String source,String visibility,String origin,String channel,String company,String contact,String email,String phone,String requestNeedId,String service,List<String> services,String createdAt,String updatedAt,String status,String priority,String responsible,int parts,String objective,String comments,String internalNotes,Map<String,Object> customer,Map<String,Object> project,List<Map<String,Object>> piecesData,List<Map<String,Object>> attachments,String linkedQuoteId,Map<String,Object> cancellation,Analysis analysis,List<History> history,Map<String,Object> configuration) {}
}
