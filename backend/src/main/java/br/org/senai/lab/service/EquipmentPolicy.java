package br.org.senai.lab.service;

import br.org.senai.lab.exception.ApiException;
import java.util.Map;

/** Equipment requirements use canonical service IDs, independently of request origin. */
public final class EquipmentPolicy {
  public enum Requirement { REQUIRED, OPTIONAL, NOT_APPLICABLE }
  public static final Map<String, Requirement> REQUIREMENTS = Map.of(
      "dimensional", Requirement.REQUIRED,
      "scan", Requirement.REQUIRED,
      "reverse-engineering", Requirement.OPTIONAL,
      "internal", Requirement.REQUIRED,
      "failure-analysis", Requirement.OPTIONAL,
      "asset-structure", Requirement.NOT_APPLICABLE,
      "digital-library", Requirement.OPTIONAL,
      "maintenance", Requirement.OPTIONAL,
      "training", Requirement.OPTIONAL);
  private EquipmentPolicy() {}
  public static String suggestedMachineId(String suggested) {
    if (suggested == null || suggested.isBlank()) return null;
    String value=suggested.trim();
    return ProposalService.MACHINE_NAMES.entrySet().stream()
      .filter(entry->entry.getKey().equalsIgnoreCase(value)||entry.getValue().equalsIgnoreCase(value)
        ||entry.getValue().replace("ZEISS ","").equalsIgnoreCase(value))
      .map(Map.Entry::getKey).findFirst().orElse(null);
  }
  public static Requirement requirement(String serviceId) {
    return serviceId == null ? Requirement.REQUIRED : REQUIREMENTS.getOrDefault(serviceId, Requirement.REQUIRED);
  }
  public static String normalize(String serviceId, String machineId, String previous) {
    return normalize(requirement(serviceId),machineId,previous);
  }
  public static String normalize(Requirement requirement, String machineId, String previous) {
    String value = machineId == null || machineId.isBlank() ? null : machineId.trim();
    if (requirement == Requirement.NOT_APPLICABLE) return previous;
    if (value != null && !ProposalService.MACHINE_NAMES.containsKey(value) && !value.equals(previous))
      throw new ApiException(400, "Selecione um equipamento válido.");
    return value;
  }
  public static void validate(String serviceId, String machineId) {
    if (requirement(serviceId) == Requirement.REQUIRED && (machineId == null || machineId.isBlank()))
      throw new ApiException(400, "Selecione a tecnologia de referência obrigatória para " + serviceId + ".");
  }
  public static String label(String serviceId, String machineId) {
    if (machineId != null && !machineId.isBlank()) return ProposalService.machineName(machineId);
    return switch (requirement(serviceId)) {
      case NOT_APPLICABLE -> "Não se aplica";
      case OPTIONAL -> "Sem equipamento específico";
      case REQUIRED -> "Tecnologia a definir";
    };
  }
}
