// Conhecimento interno documental. Nunca importar nas áreas pública/cliente.
// Valores armazenados em Plan1, linhas 40–42; nenhuma fórmula é executada.
// Vigência e validação ausentes na fonte permanecem desconhecidas (null).
export const initialCommercialReference = Object.freeze({
  id: "commercial-reference-demo-initial",
  hourlyRate: 150,
  currency: "BRL",
  status: "active",
  label: "Referência comercial vigente",
  description: "Sugestão comercial para novos orçamentos; decisão final do responsável.",
  source: "Configuração inicial demo — referência informada pelo laboratório",
  effectiveFrom: null,
  effectiveTo: null,
  changedBy: null,
  changedAt: null,
  updatedAt: null,
});

const documentedValues = [
  [
    "duramax",
    "ZEISS DuraMax",
    "CMM DuraMax",
    "G",
    21.10160421,
    105.2516042,
    173.6651469
  ],
  [
    "o-inspect",
    "ZEISS O-INSPECT",
    "CMM O-INSPECT",
    "H",
    37.93731098,
    122.087311,
    201.4440631
  ],
  [
    "prismo",
    "ZEISS PRISMO",
    "CMM PRISMO",
    "I",
    104.9285996,
    189.0785996,
    311.9796893
  ],
  [
    "bosello-max",
    "ZEISS BOSELLO MAX",
    "BOSELLO MAX 80",
    "K",
    81.79493754,
    165.9449375,
    273.8091469
  ],
  [
    "atos-q",
    "ZEISS ATOS Q",
    "ATOS Q 8M",
    "L",
    23.21712689,
    107.3671269,
    177.1557594
  ],
  [
    "contura",
    "ZEISS CONTURA",
    "CMM CONTURA",
    "J",
    35.0151545,
    119.1651545,
    196.6225049
  ],
  [
    "t-scan",
    "ZEISS T-SCAN",
    "T-SCAN hawk 2",
    "M",
    14.17373439,
    98.32373439,
    162.2341617
  ]
];

export const equipmentCostReferences = Object.freeze(documentedValues.map(
  ([machineId, machineName, model, column, withoutLabor, withLabor, withAdministrative]) => Object.freeze({
    id: machineId + "-spreadsheet-001",
    machineId, machineName, model,
    local: machineId !== "contura",
    unit: null,
    source: "Hora_custos_máquina.xlsx · Plan1 · " + column + "40:" + column + "42 (valores armazenados)",
    sourceType: "internal-spreadsheet",
    effectiveFrom: null,
    effectiveTo: null,
    validationStatus: "pending",
    validatedBy: null,
    validatedAt: null,
    withoutLabor, withLabor, withAdministrative,
  }),
));

// Adaptador legado: IDs de equipamento e valores monetários com duas casas.
export const machineCostKnowledge = Object.freeze(Object.fromEntries(
  equipmentCostReferences.map(reference => [reference.machineId, Object.freeze({
    ...reference,
    referenceId: reference.id,
    id: reference.machineId,
    name: reference.machineName,
    spreadsheetName: reference.model,
    costWithoutLabor: Math.round(reference.withoutLabor * 100) / 100,
    costWithLabor: Math.round(reference.withLabor * 100) / 100,
    costWithAdministrative: Math.round(reference.withAdministrative * 100) / 100,
  })]),
));

export function getMachineCostKnowledge(machineId) {
  return machineCostKnowledge[machineId] ?? null;
}

export function getAllMachineCostKnowledge() {
  return Object.values(machineCostKnowledge);
}
