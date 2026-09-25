import { getMachineProfile } from "./data/machineProfiles";
import { OPTION_LABELS } from "./data/optionLabels";
import { getServiceLabel } from "./data/serviceCatalog";

/*
 * Converte o estado do Configurador na SOL enviada ao backend:
 * - campos padrão da solicitação (contato, necessidade, peças e serviços), iguais aos do formulário de orçamento;
 * - `configuration`: snapshot técnico legível (rótulos já resolvidos) com requisitos por serviço e a
 *   recomendação de tecnologia, exibido na área interna como "Configuração técnica".
 */

const NEED_BY_SERVICE = {
  dimensional: "check-piece",
  scan: "physical-to-3d",
  "reverse-engineering": "reproduce-piece",
  internal: "inside",
  "failure-analysis": "failure-analysis",
  "asset-structure": "asset-structure",
  "digital-library": "digital-library",
  maintenance: "maintenance",
  training: "training",
};
const YES_NO = { yes: "Sim", no: "Não", unknown: "Não sei", true: "Sim", false: "Não" };
const LEVEL_LABELS = { excellent: "Muito aderente", high: "Aderente", good: "Aderente", medium: "Parcial", partial: "Parcial", low: "Baixa aderência", candidate: "Candidata" };

function label(dictionary, value) {
  if (value === null || value === undefined || value === "") return null;
  const map = OPTION_LABELS[dictionary] || {};
  return map[String(value)] ?? YES_NO[String(value)] ?? String(value);
}
const labels = (dictionary, values) => (values || []).map(value => label(dictionary, value)).filter(Boolean);
const clean = rows => rows.filter(([, value]) => value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0))
  .map(([name, value]) => ({ label: name, value: Array.isArray(value) ? value.join(", ") : String(value) }));

function requirementDetails(serviceId, requirements = {}) {
  if (serviceId === "dimensional") {
    const r = requirements.dimensional || {};
    return clean([
      ["Objetivos", labels("DimensionalRequirements.goals", r.goals)],
      ["Tolerâncias", label("DimensionalRequirements.toleranceOptions", r.toleranceKnowledge)],
      ["Menor tolerância crítica", r.criticalToleranceMm ? `${r.criticalToleranceMm} mm` : null],
      ["Regiões que não podem ser tocadas", label("", r.nonContactNeeded)],
      ["Detalhes pequenos", label("DimensionalRequirements.smallFeatureOptions", r.smallFeatures)],
      ["Desenho técnico disponível", label("DimensionalRequirements.referenceOptions", r.technicalDrawing)],
      ["Modelo CAD disponível", label("DimensionalRequirements.referenceOptions", r.cadModel)],
    ]);
  }
  if (serviceId === "scan") {
    const r = requirements.scanning || {};
    return clean([
      ["Objetivos", labels("ScanningRequirements.goals", r.goals)],
      ["Nível de detalhe", label("ScanningRequirements.detailOptions", r.detailLevel)],
      ["Superfície", label("ScanningRequirements.surfaceOptions", r.surface)],
      ["Acesso à peça", label("ScanningRequirements.accessOptions", r.access)],
    ]);
  }
  if (serviceId === "reverse-engineering") {
    const r = requirements.reverseEngineering || {};
    return clean([
      ["Objetivos", labels("ReverseEngineeringRequirements.goals", r.goals)],
      ["Modelo existente", label("ReverseEngineeringRequirements.existingModelOptions", r.existingModel)],
      ["Geometria", label("ReverseEngineeringRequirements.geometryScopeOptions", r.geometryScope)],
      ["Precisa de modificação", label("ReverseEngineeringRequirements.modificationOptions", r.needsModification)],
    ]);
  }
  if (serviceId === "internal") {
    const r = requirements.ct || {};
    return clean([
      ["Objetivos", labels("CtRequirements.goals", r.goals)],
      ["Região de interesse", label("CtRequirements.regionOptions", r.region)],
      ["Pode ser desmontada", label("CtRequirements.disassemblyOptions", r.canBeDisassembled)],
      ["Precisa permanecer íntegra", label("CtRequirements.intactOptions", r.mustRemainIntact)],
    ]);
  }
  return [];
}

function machine(machineId) {
  const profile = machineId ? getMachineProfile(machineId) : null;
  return profile ? { id: machineId, name: profile.name } : machineId ? { id: machineId, name: machineId } : null;
}

function dimensionsText(dimensions = {}) {
  const values = [dimensions.length, dimensions.width, dimensions.height];
  return values.some(Boolean) ? `${values.map(value => value || "?").join(" × ")} mm` : "Não informadas";
}

export function buildConfiguratorRequest(state, recommendation) {
  const pieceRecommendations = new Map((recommendation?.pieces || []).map(piece => [piece.pieceId, piece]));
  const allServices = [...new Set([...(state.projectServices || []), ...state.pieces.flatMap(piece => piece.services || [])])];
  const primary = state.pieces.find(piece => piece.services?.length)?.services[0] ?? allServices[0];
  const topMachines = (recommendation?.machineMatches || []).filter(match => match.score > 0 || match.level === "candidate").slice(0, 3);

  const pieces = state.pieces.map((piece, index) => {
    const rec = pieceRecommendations.get(piece.id);
    const services = (piece.services || []).map(serviceId => {
      const serviceRec = rec?.services?.find(item => item.service === serviceId);
      const match = serviceRec?.matches?.find(item => item.machineId === serviceRec.primaryMachine);
      return {
        id: serviceId,
        label: getServiceLabel(serviceId),
        machine: machine(serviceRec?.primaryMachine),
        adherence: match ? { score: match.score, level: LEVEL_LABELS[match.level] || match.level } : null,
        requirements: requirementDetails(serviceId, piece.requirements),
      };
    });
    return {
      id: piece.id,
      name: piece.name?.trim() || `Peça ${index + 1}`,
      details: clean([
        ["Tipo", label("PieceStep.typeOptions", piece.type)],
        ["Material", label("PieceStep.materialOptions", piece.material)],
        ["Quantidade", piece.quantity],
        ["Dimensões", dimensionsText(piece.dimensions)],
        ["Porte", label("PieceStep.sizeOptions", piece.sizeCategory)],
        ["Atendimento", label("PieceStep.locationOptions", piece.location)],
      ]),
      services,
      summary: rec?.summary || null,
      missingInformation: rec?.missingInformation || [],
    };
  });

  const configuration = {
    version: 1,
    submittedAt: new Date().toISOString(),
    summary: recommendation?.summary || null,
    definitionScore: recommendation?.definitionScore ?? null,
    projectServices: allServices.map(id => ({ id, label: getServiceLabel(id) })),
    recommendedMachines: topMachines.map(match => ({ ...machine(match.machineId), score: match.score, level: LEVEL_LABELS[match.level] || match.level, reasons: (match.reasons || []).slice(0, 4), warnings: (match.warnings || []).slice(0, 3) })),
    pieces,
    insights: (recommendation?.insights || []).slice(0, 8),
    missingInformation: (recommendation?.missingInformation || []).slice(0, 10),
    department: state.customer.department || null,
    attachments: (state.attachments || []).map(item => ({ name: item.file?.name || "Arquivo", size: item.file?.size || 0, category: item.category || null })),
  };

  const best = configuration.recommendedMachines[0];
  const objective = [
    `Solicitação montada no Configurador on-line: ${allServices.map(getServiceLabel).join(", ")}.`,
    recommendation?.summary,
    best ? `Tecnologia sugerida: ${best.name} (${best.score}% de aderência).` : null,
  ].filter(Boolean).join(" ");

  const payload = {
    origin: "Configurador",
    channel: "Configurador on-line",
    contact: { company: state.customer.company.trim(), name: state.customer.name.trim(), email: state.customer.email.trim(), phone: state.customer.phone.trim() },
    project: {
      requestNeedId: NEED_BY_SERVICE[primary] || "check-piece",
      objective,
      observations: state.comments || "",
      urgency: "normal",
      deadlineType: "noUrgency",
      specificDate: "",
      generalFiles: configuration.attachments.map((file, index) => ({ id: `att-${index + 1}`, name: file.name, type: file.category || "Arquivo", size: file.size })),
    },
    internal: null,
    pieces: state.pieces.map((piece, index) => ({
      id: piece.id,
      name: pieces[index].name,
      quantity: Math.max(1, Number(piece.quantity) || 1),
      material: label("PieceStep.materialOptions", piece.material) || "",
      dimensions: dimensionsText(piece.dimensions),
      location: piece.location === "laboratory" ? "Pode ser levada ao Centro" : label("PieceStep.locationOptions", piece.location) || "",
      type: label("PieceStep.typeOptions", piece.type) || "",
      services: (piece.services || []).filter(serviceId => NEED_BY_SERVICE[serviceId]),
      requirements: {
        inspectionOptions: labels("DimensionalRequirements.goals", piece.requirements?.dimensional?.goals),
        scanningOptions: labels("ScanningRequirements.goals", piece.requirements?.scanning?.goals),
        reverseOptions: labels("ReverseEngineeringRequirements.goals", piece.requirements?.reverseEngineering?.goals),
        internalOptions: labels("CtRequirements.goals", piece.requirements?.ct?.goals),
        movable: "", surroundingAccess: "", locationNotes: "",
      },
      recommendation: null,
    })),
    configuration,
  };
  return payload;
}
