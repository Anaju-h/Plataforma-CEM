package br.org.senai.lab.dto;
import jakarta.validation.constraints.*;
import java.util.*;
public final class ProjectDtos {
  private ProjectDtos() {}
  public record Update(@NotNull @PositiveOrZero Long revision, @NotBlank String operation,
                       @Size(max=20000) String internalNotes, UUID taskId, Boolean completed) {}
  public record Task(UUID id,String title,boolean completed) {}
  public record History(UUID id,String date,String time,String action,String actor,String description) {}
  public static class Project {
    public String id,technicalId,projectCode,quoteId,quoteTechnicalId,requestId,requestTechnicalId;
    public String acceptedProposalId,acceptedProposalTechnicalId,acceptedVersionTechnicalId;
    public int acceptedProposalVersion;
    public String source="real",company,service,serviceId,machineId,machine,responsible,status,priority,description,internalNotes;
    public String createdAt,updatedAt,completedAt,deadline;
    public long revision;
    public List<Task> tasks;
    public List<History> history;
    public Map<String,Object> quote;
  }
}
