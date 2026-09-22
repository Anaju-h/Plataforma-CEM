package br.org.senai.lab.mapper;
import br.org.senai.lab.entity.RequestEntity;
import br.org.senai.lab.dto.RequestDtos;
import org.mapstruct.*;
@Mapper(componentModel="jakarta-cdi")
public interface RequestMapper {
  @Mapping(target="company",source="contact.company")
  @Mapping(target="contact",source="contact.name")
  @Mapping(target="email",source="contact.email")
  @Mapping(target="phone",source="contact.phone")
  @Mapping(target="requestNeedId",source="project.requestNeedId")
  @Mapping(target="objective",source="project.objective")
  @Mapping(target="comments",source="project.observations")
  @Mapping(target="id",ignore=true) @Mapping(target="requestCode",ignore=true)
  @Mapping(target="source",ignore=true) @Mapping(target="origin",ignore=true) @Mapping(target="channel",ignore=true)
  @Mapping(target="service",ignore=true) @Mapping(target="services",ignore=true) @Mapping(target="pieces",ignore=true)
  @Mapping(target="analysis",ignore=true) @Mapping(target="history",ignore=true)
  @Mapping(target="createdAt",ignore=true) @Mapping(target="updatedAt",ignore=true)
  @Mapping(target="status",ignore=true) @Mapping(target="priority",ignore=true) @Mapping(target="responsible",ignore=true)
  @Mapping(target="internalNotes",ignore=true) @Mapping(target="linkedQuoteId",ignore=true)
  @Mapping(target="customerJson",ignore=true) @Mapping(target="projectJson",ignore=true) @Mapping(target="attachmentsJson",ignore=true)
  @Mapping(target="cancellationReason",ignore=true) @Mapping(target="cancelledAt",ignore=true) @Mapping(target="cancelledBy",ignore=true)
  @Mapping(target="version",ignore=true)
  RequestEntity fromCreate(RequestDtos.Create dto);
}
