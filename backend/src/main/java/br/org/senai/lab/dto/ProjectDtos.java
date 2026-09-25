package br.org.senai.lab.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.*;
public final class ProjectDtos {
  private ProjectDtos() {}
  public record Update(@NotNull @PositiveOrZero Long revision, @NotBlank String operation,
                       @Size(max=20000) String internalNotes, UUID taskId, Boolean completed) {}
  public record TimeEntry(UUID id,UUID userId,String userName,String date,BigDecimal hours,String note,String createdAt) {}
  public record Task(UUID id,String title,boolean completed,String status,String description,UUID assigneeId,String assigneeName,String assigneeRole,
                     String dueDate,BigDecimal plannedHours,BigDecimal spentHours,List<TimeEntry> entries) {}
  /** Criação/edição de tarefa (Administrador) ou mudança de status (responsável). */
  public record TaskInput(@Size(max=250) String title,@Size(max=4000) String description,UUID assigneeId,String dueDate,
                          @PositiveOrZero BigDecimal plannedHours,String status) {}
  /** Apontamento de horas. userId só é considerado para o Administrador (lançar por outra pessoa). */
  public record TimeInput(@NotNull String date,@NotNull @Positive BigDecimal hours,@Size(max=500) String note,UUID userId) {}
  public record History(UUID id,String date,String time,String action,String actor,String description) {}
  public static class Project {
    public String id,technicalId,projectCode,quoteId,quoteTechnicalId,requestId,requestTechnicalId;
    public String acceptedProposalId,acceptedProposalTechnicalId,acceptedVersionTechnicalId;
    public int acceptedProposalVersion;
    public String source="real",company,service,serviceId,machineId,machine,responsible,status,priority,description,internalNotes;
    public String createdAt,updatedAt,completedAt,deadline;
    public boolean demo;
    public long revision;
    /** Horas orçadas (ORC), planejadas (soma das tarefas) e gastas (soma dos apontamentos). */
    public BigDecimal budgetHours,plannedHours,spentHours;
    public String recordCode,recordStatus;
    public boolean commercialVisible;
    public List<Task> tasks;
    public List<History> history;
    public Map<String,Object> quote;
  }
}
