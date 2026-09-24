package br.org.senai.lab.mapper;
import br.org.senai.lab.dto.ProjectDtos.*;
import br.org.senai.lab.entity.*;
import org.mapstruct.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
@Mapper(componentModel="jakarta-cdi",unmappedTargetPolicy=ReportingPolicy.IGNORE,imports=DateTimeFormatter.class)
public interface ProjectMapper {
  @Mapping(target="id",source="projectCode") @Mapping(target="technicalId",source="id")
  @Mapping(target="quote",ignore=true)
  @Mapping(target="quoteId",source="quote.quoteCode") @Mapping(target="quoteTechnicalId",source="quote.id")
  @Mapping(target="requestId",source="quote.request.requestCode") @Mapping(target="requestTechnicalId",source="quote.request.id")
  @Mapping(target="serviceId",source="quote.serviceId")
  @Mapping(target="company",source="quote.company") @Mapping(target="machineId",source="quote.machineId")
  @Mapping(target="acceptedProposalTechnicalId",source="acceptedProposal.id")
  @Mapping(target="acceptedVersionTechnicalId",source="acceptedVersion.id")
  @Mapping(target="acceptedProposalVersion",source="acceptedVersion.number")
  Project project(ProjectEntity entity);
  Task task(ProjectTaskEntity entity);
  @Mapping(target="date",source="occurredAt")
  @Mapping(target="time",expression="java(entity.occurredAt.format(DateTimeFormatter.ofPattern(\"HH:mm\")))")
  History history(ProjectHistoryEntity entity);
  default String date(LocalDateTime value){return value==null?null:value.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));}
  default String date(LocalDate value){return value==null?null:value.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));}
}
