// Referência econômica já disponível. Não representa um caso de serviço formalizado.
// Categorias organizam o ciclo de conhecimento, sem criar conteúdo para preenchê-las.
export const knowledgeCategories = [
  { id: "procedure", label: "Procedimentos internos" },
  { id: "measurement", label: "Estratégias de medição e fixação" },
  { id: "equipment", label: "Práticas por equipamento" },
  { id: "lessons", label: "Desvios e lições aprendidas" },
  { id: "standard", label: "Regras e padrões internos" },
  { id: "documentation", label: "Referências econômicas" },
  { id: "case", label: "Casos de serviço formalizados" },
];
export const knowledgeItems = [
  {
    id: "KNO-0004",
    isDemo: true,
    eligibleForRecommendations: false,

    title:
      "Referência de custos por equipamento",

    category:
      "documentation",

    summary:
      "Registro da existência da planilha interna utilizada como fonte de conhecimento econômico para apoio à elaboração de orçamentos.",

    content: [
      {
        title:
          "Objetivo",

        text:
          "A planilha reúne parâmetros e cálculos de custo/hora relacionados aos equipamentos do laboratório.",
      },

      {
        title:
          "Uso no sistema",

        text:
          "Os valores são utilizados como referência interna e apoio à decisão. Eles não constituem tabela oficial de preços nem determinam automaticamente o valor cobrado do cliente.",
      },

      {
        title:
          "Decisão comercial",

        text:
          "O valor/hora efetivamente utilizado em cada orçamento permanece sob responsabilidade da pessoa que está elaborando a proposta.",
      },
    ],

    tags: [
      "custos",
      "máquinas",
      "precificação",
      "orçamento",
    ],

    relatedMachines: [
      "ZEISS PRISMO",
      "ZEISS DuraMax",
      "ZEISS O-INSPECT",
      "ZEISS ATOS Q",
      "ZEISS BOSELLO MAX",
    ],

    relatedServices: [],

    source:
      "Folha de custos por máquina",

    sourceType:
      "internal-spreadsheet",

    author:
      "Laboratório",

    reviewedBy: null,

    lastReview: null,

    status:
      "Referência",

    attachments: [
      {
        id: "ATT-KNO-001",

        name:
          "Hora_custos_máquina.xlsx",

        type:
          "Planilha",

        description:
          "Planilha utilizada como fonte para referências econômicas.",
      },
    ],
  },
];
export function getKnowledgeItemById(id) { return knowledgeItems.find(item => item.id === id); }
export function getKnowledgeCategory(id) { return knowledgeCategories.find(category => category.id === id); }
