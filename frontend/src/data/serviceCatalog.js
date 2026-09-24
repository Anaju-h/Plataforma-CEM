/* ============================================================
 * CATÁLOGO ÚNICO DE SERVIÇOS
 * ============================================================
 *
 * Os IDs abaixo são o contrato estável utilizado pelo sistema.
 * Registros antigos podem ser lidos por meio dos aliases, mas
 * todo novo dado deve ser persistido com o ID canônico.
 */

export const technicalServiceOrder = [
  "dimensional",
  "scan",
  "reverse-engineering",
  "internal",
];

export const directServiceOrder = [
  "failure-analysis",
  "asset-structure",
  "digital-library",
  "maintenance",
  "training",
];

export const commercialServiceOrder = [
  ...technicalServiceOrder,
  ...directServiceOrder,
];

export const serviceCatalog = {
  dimensional: {
    id: "dimensional",
    equipmentRequirement: "REQUIRED",
    name: "Metrologia e inspeção dimensional",
    shortName: "Metrologia",
    userFacingTitle: "Conferir medidas, geometria ou tolerâncias",
    description:
      "Metrologia avançada para avaliação dimensional e geométrica de peças e componentes.",
    explanation:
      "Esse tipo de análise ajuda a verificar medidas, geometrias, tolerâncias e conformidade com desenhos, modelos CAD ou requisitos de qualidade, utilizando recursos táteis e ópticos conforme a aplicação.",
    category: "technical",
    pieceBased: true,
    machineConfigurable: true,
    relatedMachines: ["prismo", "duramax", "o-inspect"],
  },

  scan: {
    id: "scan",
    equipmentRequirement: "REQUIRED",
    name: "Escaneamento e digitalização 3D",
    shortName: "Digitalização",
    userFacingTitle: "Digitalizar ou comparar uma peça em 3D",
    description:
      "Aquisição digital da geometria tridimensional externa do componente.",
    explanation:
      "A digitalização transforma a geometria física da peça em dados 3D que podem apoiar comparação com CAD, documentação, engenharia reversa, biblioteca digital de componentes e aplicações relacionadas à impressão 3D.",
    category: "technical",
    pieceBased: true,
    machineConfigurable: true,
    relatedMachines: ["atos-q", "t-scan"],
  },

  "reverse-engineering": {
    id: "reverse-engineering",
    equipmentRequirement: "OPTIONAL",
    name: "Engenharia reversa e desenvolvimento",
    shortName: "Engenharia reversa",
    userFacingTitle: "Reconstruir, desenvolver ou nacionalizar um componente",
    description:
      "Reconstrução de informações digitais e modelos CAD a partir de um componente físico.",
    explanation:
      "A engenharia reversa é útil quando existe uma peça física, mas é necessário reconstruir, atualizar ou modificar seu modelo digital, apoiar a nacionalização de componentes ou desenvolver novas soluções a partir da geometria existente.",
    category: "technical",
    pieceBased: true,
    machineConfigurable: true,
    relatedMachines: ["atos-q", "t-scan", "bosello-max"],
  },

  internal: {
    id: "internal",
    equipmentRequirement: "REQUIRED",
    name: "Tomografia industrial",
    shortName: "Tomografia",
    userFacingTitle: "Investigar o interior da peça",
    description:
      "Inspeção interna não destrutiva por raios X para aquisição de informações de regiões não acessíveis externamente.",
    explanation:
      "Permite investigar geometrias internas, montagens, posicionamento de componentes, falhas, quebras, anomalias e outras características que não podem ser avaliadas apenas pela superfície.",
    category: "technical",
    pieceBased: true,
    machineConfigurable: true,
    relatedMachines: ["bosello-max"],
  },

  "failure-analysis": {
    id: "failure-analysis",
    equipmentRequirement: "OPTIONAL",
    name: "Análise de falhas, quebras, anomalias ou desgaste",
    shortName: "Análise de falhas",
    description:
      "Investigação técnica de falhas, quebras, anomalias ou desgaste para apoiar a identificação de causas.",
    category: "direct",
    pieceBased: false,
    machineConfigurable: false,
    relatedMachines: [],
  },

  "asset-structure": {
    id: "asset-structure",
    equipmentRequirement: "NOT_APPLICABLE",
    name: "Gestão técnica de ativos e peças críticas",
    shortName: "Gestão de ativos",
    description:
      "Estruturação de equipamentos, componentes e informações relevantes para a gestão técnica de ativos.",
    category: "direct",
    pieceBased: false,
    machineConfigurable: false,
    relatedMachines: [],
  },

  "digital-library": {
    id: "digital-library",
    equipmentRequirement: "OPTIONAL",
    name: "Biblioteca digital e almoxarifado virtual",
    shortName: "Biblioteca digital",
    description:
      "Organização de informações e representações digitais de componentes para consulta e reutilização.",
    category: "direct",
    pieceBased: false,
    machineConfigurable: false,
    relatedMachines: [],
  },

  maintenance: {
    id: "maintenance",
    equipmentRequirement: "OPTIONAL",
    name: "Planos de manutenção e lubrificação",
    shortName: "Manutenção e lubrificação",
    description:
      "Apoio técnico na estruturação de planos de manutenção, lubrificação e confiabilidade.",
    category: "direct",
    pieceBased: false,
    machineConfigurable: false,
    relatedMachines: [],
  },

  training: {
    id: "training",
    equipmentRequirement: "OPTIONAL",
    name: "Treinamento técnico",
    shortName: "Treinamento",
    description:
      "Capacitação técnica em manutenção, metrologia, engenharia reversa, lubrificação e análise de falhas.",
    category: "direct",
    pieceBased: false,
    machineConfigurable: false,
    relatedMachines: [],
  },
};

// Compatibilidade com os consumidores atuais do configurador.
// Esta ordem contém somente serviços avaliados pelo motor de máquinas.
export const serviceOrder = technicalServiceOrder;

export const TECHNICAL_SERVICE_OPTIONS = technicalServiceOrder.map(
  (serviceId) => ({
    value: serviceId,
    label: serviceCatalog[serviceId].name,
  }),
);

export const DIRECT_SERVICE_OPTIONS = directServiceOrder.map((serviceId) => ({
  value: serviceId,
  label: serviceCatalog[serviceId].name,
}));

export const SERVICE_OPTIONS = commercialServiceOrder.map((serviceId) => ({
  value: serviceId,
  label: serviceCatalog[serviceId].name,
}));

const SERVICE_ALIASES = {
  dimensional: "dimensional",
  inspection: "dimensional",
  "inspecao dimensional": "dimensional",
  "metrologia e inspecao dimensional": "dimensional",

  scan: "scan",
  scanning: "scan",
  "3d scanning": "scan",
  "digitalizacao 3d": "scan",
  "escaneamento 3d": "scan",
  "escaneamento e digitalizacao 3d": "scan",

  reverse: "reverse-engineering",
  "reverse-engineering": "reverse-engineering",
  "reverse engineering": "reverse-engineering",
  reverseengineering: "reverse-engineering",
  "engenharia reversa": "reverse-engineering",
  "engenharia reversa e desenvolvimento": "reverse-engineering",

  internal: "internal",
  ct: "internal",
  "computed tomography": "internal",
  tomografia: "internal",
  "tomografia industrial": "internal",
  "analise interna": "internal",

  "failure-analysis": "failure-analysis",
  "analise de falhas": "failure-analysis",
  "analise de falhas quebras anomalias ou desgaste": "failure-analysis",

  "asset-structure": "asset-structure",
  "gestao de ativos": "asset-structure",
  "gestao tecnica de ativos e pecas criticas": "asset-structure",

  "digital-library": "digital-library",
  "biblioteca digital": "digital-library",
  "biblioteca digital e almoxarifado virtual": "digital-library",

  maintenance: "maintenance",
  "planos de manutencao e lubrificacao": "maintenance",

  training: "training",
  treinamento: "training",
  "treinamento tecnico": "training",
};

export function normalizeServiceId(service) {
  if (service === null || service === undefined) {
    return "";
  }

  const rawValue = String(service).trim();

  if (!rawValue) {
    return "";
  }

  return SERVICE_ALIASES[normalizeKey(rawValue)] || rawValue;
}

export function getService(serviceId) {
  return serviceCatalog[normalizeServiceId(serviceId)];
}

export function getServiceLabel(serviceId) {
  if (serviceId === null || serviceId === undefined || serviceId === "") {
    return "Não informado";
  }

  return getService(serviceId)?.name || String(serviceId).trim();
}

export function getCandidateMachines(services = []) {
  const result = services.flatMap(
    (serviceId) => getService(serviceId)?.relatedMachines ?? [],
  );

  return Array.from(new Set(result));
}

function normalizeKey(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function getEquipmentRequirement(serviceId) {
  return getService(serviceId)?.equipmentRequirement ?? "REQUIRED";
}
export function getEquipmentLabel(serviceId, machineName) {
  return machineName || (getEquipmentRequirement(serviceId) === "NOT_APPLICABLE"
    ? "Não se aplica" : getEquipmentRequirement(serviceId) === "OPTIONAL"
      ? "Sem equipamento específico" : "Tecnologia a definir");
}
export function requiresQuoteEquipment(quote) {
  return getQuoteEquipmentRequirement(quote) === "REQUIRED";
}
export function getQuoteEquipmentRequirement(quote) {
  const requirements = [quote.serviceId, ...(quote.services ?? []), ...(quote.items ?? []).map(item => item.serviceId)]
    .filter(Boolean).map(getEquipmentRequirement);
  if (!requirements.length || requirements.includes("REQUIRED")) return "REQUIRED";
  return requirements.includes("OPTIONAL") ? "OPTIONAL" : "NOT_APPLICABLE";
}
