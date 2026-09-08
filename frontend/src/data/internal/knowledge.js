/*
 * ============================================================
 * BASE DE CONHECIMENTO — MOCK INICIAL
 * ============================================================
 *
 * Estes registros existem apenas para validar o fluxo e a
 * estrutura visual.
 *
 * Futuramente serão entidades persistidas no backend/banco.
 * ============================================================
 */

export const knowledgeCategories = [
  {
    id: "equipment",
    label: "Equipamentos",
  },

  {
    id: "technology",
    label: "Tecnologias",
  },

  {
    id: "procedure",
    label: "Procedimentos",
  },

  {
    id: "best-practice",
    label: "Boas práticas",
  },

  {
    id: "case",
    label: "Casos anteriores",
  },

  {
    id: "standard",
    label: "Normas e padrões",
  },

  {
    id: "documentation",
    label: "Documentação",
  },
];

export const knowledgeItems = [
  {
    id: "KNO-0001",

    title:
      "Quando considerar o ZEISS O-INSPECT",

    category:
      "equipment",

    summary:
      "Referência inicial para aplicações dimensionais que podem se beneficiar da combinação de estratégias ópticas e táteis.",

    content: [
      {
        title:
          "Contexto",

        text:
          "O ZEISS O-INSPECT é uma tecnologia multissensor relacionada a aplicações dimensionais que podem combinar estratégias ópticas e táteis.",
      },

      {
        title:
          "Quando pode ser relevante",

        text:
          "Pode ganhar relevância em componentes menores, características detalhadas ou regiões em que uma estratégia óptica seja interessante.",
      },

      {
        title:
          "Atenção",

        text:
          "A escolha final da tecnologia deve considerar características reais da peça, tolerâncias, dimensões, estratégia de medição e validação da equipe técnica.",
      },
    ],

    tags: [
      "o-inspect",
      "óptico",
      "tátil",
      "multissensor",
      "inspeção dimensional",
    ],

    relatedMachines: [
      "ZEISS O-INSPECT",
    ],

    relatedServices: [
      "Inspeção dimensional",
    ],

    source:
      "Conhecimento técnico interno",

    sourceType:
      "internal-knowledge",

    author:
      "Equipe do laboratório",

    reviewedBy:
      "Administrador",

    lastReview:
      "26/08/2026",

    status:
      "Revisado",

    attachments: [],
  },

  {
    id: "KNO-0002",

    title:
      "Diferenças iniciais entre ATOS Q e T-SCAN",

    category:
      "technology",

    summary:
      "Comparação qualitativa para orientar a escolha inicial entre digitalização fixa e portátil.",

    content: [
      {
        title:
          "ATOS Q",

        text:
          "Associado a aquisições ópticas de alta qualidade, detalhes e aplicações em que a peça pode ser posicionada adequadamente para digitalização.",
      },

      {
        title:
          "T-SCAN",

        text:
          "Associado a aplicações que demandam mobilidade, liberdade de movimentação ou aquisição de componentes maiores e estruturas no local.",
      },

      {
        title:
          "Como utilizar esta referência",

        text:
          "O tamanho da peça, nível de detalhe, necessidade de mobilidade e condições de acesso devem ser considerados em conjunto antes da definição final.",
      },
    ],

    tags: [
      "atos q",
      "t-scan",
      "digitalização 3d",
      "scanner",
      "mobilidade",
    ],

    relatedMachines: [
      "ZEISS ATOS Q",
      "ZEISS T-SCAN",
    ],

    relatedServices: [
      "Digitalização 3D",
      "Engenharia reversa",
    ],

    source:
      "Conhecimento técnico interno",

    sourceType:
      "internal-knowledge",

    author:
      "Equipe do laboratório",

    reviewedBy:
      "Administrador",

    lastReview:
      "26/08/2026",

    status:
      "Revisado",

    attachments: [],
  },

  {
    id: "KNO-0003",

    title:
      "Fluxo inicial para análise de uma nova solicitação",

    category:
      "procedure",

    summary:
      "Sequência sugerida para avaliar informações recebidas antes da elaboração do orçamento.",

    content: [
      {
        title:
          "1. Entender o objetivo",

        text:
          "Antes de escolher uma tecnologia, identificar claramente o que o cliente deseja obter como resultado.",
      },

      {
        title:
          "2. Avaliar a peça",

        text:
          "Verificar dimensões, material, quantidade, localização, documentação existente e condições de acesso.",
      },

      {
        title:
          "3. Analisar requisitos",

        text:
          "Identificar tolerâncias, nível de detalhe, regiões internas, necessidade de mobilidade e demais critérios relacionados ao serviço.",
      },

      {
        title:
          "4. Definir estratégia preliminar",

        text:
          "Relacionar as tecnologias que apresentam aderência ao problema e registrar dúvidas que ainda precisam ser esclarecidas.",
      },
    ],

    tags: [
      "solicitação",
      "análise",
      "processo",
      "orçamento",
    ],

    relatedMachines: [],

    relatedServices: [
      "Inspeção dimensional",
      "Digitalização 3D",
      "Engenharia reversa",
      "Análise interna",
    ],

    source:
      "Processo operacional proposto",

    sourceType:
      "internal-process",

    author:
      "Equipe do laboratório",

    reviewedBy:
      "Administrador",

    lastReview:
      "26/08/2026",

    status:
      "Em validação",

    attachments: [],
  },

  {
    id: "KNO-0004",

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

    reviewedBy:
      "Administrador",

    lastReview:
      "26/08/2026",

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

  {
    id: "KNO-0005",

    title:
      "Padrões para desenvolvimento de software interno",

    category:
      "standard",

    summary:
      "Área destinada à consolidação das regras corporativas que devem ser observadas em aplicações desenvolvidas para utilização interna.",

    content: [
      {
        title:
          "Objetivo",

        text:
          "Centralizar documentação relacionada a tecnologias permitidas, arquitetura, segurança, banco de dados, implantação, documentação e demais requisitos corporativos.",
      },

      {
        title:
          "Situação atual",

        text:
          "Os documentos corporativos ainda precisam ser analisados e estruturados dentro desta base de conhecimento.",
      },
    ],

    tags: [
      "software",
      "padrões",
      "arquitetura",
      "segurança",
      "governança",
    ],

    relatedMachines: [],

    relatedServices: [],

    source:
      "Documentação corporativa",

    sourceType:
      "corporate-documentation",

    author:
      "Empresa",

    reviewedBy:
      "Pendente",

    lastReview:
      "Não revisado",

    status:
      "Pendente de análise",

    attachments: [],
  },
];

/*
 * ============================================================
 * CONSULTAS
 * ============================================================
 */

export function getKnowledgeItemById(
  knowledgeId,
) {
  return knowledgeItems.find(
    (item) =>
      item.id ===
      knowledgeId,
  );
}

export function getKnowledgeCategory(
  categoryId,
) {
  return knowledgeCategories.find(
    (category) =>
      category.id ===
      categoryId,
  );
}