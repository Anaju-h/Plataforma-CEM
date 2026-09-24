package br.org.senai.lab.mapper;
import br.org.senai.lab.entity.QuoteItemEntity;
import br.org.senai.lab.dto.QuoteDtos;
import org.mapstruct.*;
@Mapper(componentModel="jakarta-cdi",unmappedTargetPolicy=ReportingPolicy.IGNORE)
public interface QuoteMapper {
  @Mapping(target="id",ignore=true) @Mapping(target="clientId",source="id")
  QuoteItemEntity item(QuoteDtos.Item dto);
}
