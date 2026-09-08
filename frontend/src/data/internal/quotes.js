export const quotes = [
  {
    id: "ORC-0012",

    requestId: "SOL-0024",

    company: "Componentes Ômega",

    contact: "Eduardo Lima",

    createdAt: "23/08/2026",

    updatedAt: "25/08/2026",

    /*
     * Este orçamento está aceito,
     * mas ainda NÃO virou projeto.
     *
     * Vamos utilizá-lo para testar:
     *
     * Aceito
     * ↓
     * Criar projeto
     */
    status: "Aceito",

    priority: "Normal",

    responsible: "Administrador",

    service: "Inspeção dimensional",

    machineId: "prismo",

    technicalHours: 10,

    billableHours: 10,

    hourlyRate: 150,

    internalCost: 3119.8,

    proposedValue: 1500,

    deadlineDays: 10,

    validityDays: 15,

    scope:
      "Executar inspeção dimensional conforme escopo técnico aprovado na solicitação SOL-0024.",

    commercialNotes: "",

    /*
     * Controle da conversão para projeto.
     */
    convertedToProject: false,

    projectId: null,
  },

  {
    id: "ORC-0013",

    requestId: "SOL-0025",

    company: "Tecnologia Delta",

    contact: "Marina Costa",

    createdAt: "25/08/2026",

    updatedAt: "26/08/2026",

    status: "Em elaboração",

    priority: "Urgente",

    responsible: "Administrador",

    service: "Análise interna",

    machineId:
      "bosello-max",

    technicalHours: 0,

    billableHours: 0,

    hourlyRate: 150,

    internalCost: 3200,

    proposedValue: 0,

    deadlineDays: 7,

    validityDays: 15,

    scope:
      "Executar análise interna conforme o escopo técnico aprovado.",

    commercialNotes: "",

    convertedToProject: false,

    projectId: null,
  },

  {
    id: "ORC-0011",

    requestId: "SOL-0023",

    company: "Engenharia Sigma",

    contact: "Lucas Ferreira",

    createdAt: "21/08/2026",

    updatedAt: "24/08/2026",

    status: "Aceito",

    priority: "Normal",

    responsible: "Administrador",

    service: "Digitalização 3D",

    machineId: "atos-q",

    technicalHours: 23,

    billableHours: 23,

    hourlyRate: 150,

    internalCost: 4074.68,

    proposedValue: 3450,

    deadlineDays: 12,

    validityDays: 15,

    scope:
      "Executar digitalização 3D conforme escopo técnico aprovado.",

    commercialNotes: "",

    /*
     * Este já virou projeto.
     */
    convertedToProject: true,

    projectId: "PRJ-0001",
  },

  {
    id: "ORC-0010",

    requestId: "SOL-0022",

    company:
      "Soluções Mecânicas Zeta",

    contact:
      "Paulo Martins",

    createdAt:
      "19/08/2026",

    updatedAt:
      "22/08/2026",

    status:
      "Recusado",

    priority:
      "Normal",

    responsible:
      "Administrador",

    service:
      "Engenharia reversa",

    machineId:
      "atos-q",

    technicalHours: 0,

    billableHours: 0,

    hourlyRate: 150,

    internalCost: 4700,

    proposedValue: 6800,

    deadlineDays: 15,

    validityDays: 15,

    scope:
      "Executar engenharia reversa conforme escopo técnico aprovado.",

    commercialNotes: "",

    convertedToProject: false,

    projectId: null,
  },
];

export const quoteStatuses = [
  "Todos",
  "Rascunho",
  "Em elaboração",
  "Em revisão",
  "Aprovado internamente",
  "Enviado",
  "Aceito",
  "Recusado",
  "Cancelado",
];

export function getQuoteById(
  quoteId,
) {
  return quotes.find(
    (quote) =>
      quote.id === quoteId,
  );
}