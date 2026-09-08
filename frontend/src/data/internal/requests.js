export const requests = [
  {
    id: "SOL-0028",

    company: "Indústria Alfa",

    contact: "Carlos Mendes",

    email: "carlos@industriaalfa.com",

    phone: "(62) 99999-2841",

    origin: "Configurador",

    service: "Inspeção dimensional",

    services: [
      "Inspeção dimensional",
    ],

    createdAt: "26/08/2026",

    status: "Nova",

    priority: "Normal",

    responsible: "Não atribuído",

    parts: 1,

    objective:
      "Avaliar dimensionalmente um componente usinado antes da liberação de um novo lote.",

    comments:
      "O cliente informou que a peça faz parte de um processo de validação de fornecedor.",

    internalNotes: "",

    customer: {
      department: "Qualidade",
      company: "Indústria Alfa",
      contact: "Carlos Mendes",
      email: "carlos@industriaalfa.com",
      phone: "(62) 99999-2841",
    },

    piecesData: [
      {
        id: "piece-01",

        name: "Flange usinado",

        quantity: 4,

        type: "Peça individual",

        material: "Aço",

        dimensions:
          "240 × 180 × 55 mm",

        location:
          "Pode ser levada ao Centro",

        services: [
          "Inspeção dimensional",
        ],

        requirements: {
          dimensional: [
            {
              label: "Objetivo",
              value:
                "Verificar medidas gerais e tolerâncias",
            },

            {
              label: "Exigência de precisão",
              value:
                "Alta precisão",
            },

            {
              label: "Medição sem contato",
              value:
                "Não necessária",
            },

            {
              label: "Pequenas características",
              value:
                "Não informado",
            },

            {
              label: "Desenho técnico",
              value:
                "Disponível",
            },
          ],
        },

        recommendation: {
          primaryMachine: {
            name: "ZEISS PRISMO",
            match: "Alta aderência",
            score: 92,
          },

          alternatives: [
            {
              name: "ZEISS O-INSPECT",
              match: "Boa aderência",
              score: 74,
            },

            {
              name: "ZEISS DuraMax",
              match: "Possível",
              score: 61,
            },
          ],

          reasons: [
            "A aplicação possui elevada exigência de precisão.",
            "A inspeção envolve características dimensionais e tolerâncias.",
            "A peça pode ser transportada até o laboratório.",
          ],

          warnings: [
            "A capacidade dimensional real do equipamento deve ser validada pela equipe técnica.",
          ],
        },
      },
    ],

    attachments: [
      {
        id: "att-01",
        name: "desenho_flange_rev03.pdf",
        type: "Desenho técnico",
        size: "1,8 MB",
      },

      {
        id: "att-02",
        name: "foto_flange.jpg",
        type: "Imagem",
        size: "640 KB",
      },
    ],

    history: [
      {
        id: "hist-01",
        date: "26/08/2026",
        time: "10:42",
        action: "Solicitação criada",
        actor: "Sistema",
        description:
          "Solicitação recebida por meio do configurador.",
      },
    ],
  },

  {
    id: "SOL-0027",

    company: "Metalúrgica Beta",

    contact: "Fernanda Lopes",

    email: "fernanda@metalurgicabeta.com",

    phone: "(62) 98888-7714",

    origin: "Formulário",

    service: "Digitalização 3D",

    services: [
      "Digitalização 3D",
    ],

    createdAt: "26/08/2026",

    status: "Em análise",

    priority: "Prioritária",

    responsible: "Administrador",

    parts: 2,

    objective:
      "Digitalizar componentes para documentação e comparação geométrica.",

    comments:
      "Cliente solicitou avaliação de viabilidade antes de definir o escopo final.",

    internalNotes:
      "Confirmar necessidade de comparação com CAD.",

    customer: {
      department: "Engenharia",
      company: "Metalúrgica Beta",
      contact: "Fernanda Lopes",
      email: "fernanda@metalurgicabeta.com",
      phone: "(62) 98888-7714",
    },

    piecesData: [
      {
        id: "piece-01",
        name: "Carcaça principal",
        quantity: 1,
        type: "Peça individual",
        material: "Alumínio",
        dimensions: "Não informadas",
        location: "Pode ser levada ao Centro",
        services: ["Digitalização 3D"],
        requirements: {},
        recommendation: null,
      },

      {
        id: "piece-02",
        name: "Tampa",
        quantity: 1,
        type: "Peça individual",
        material: "Alumínio",
        dimensions: "Não informadas",
        location: "Pode ser levada ao Centro",
        services: ["Digitalização 3D"],
        requirements: {},
        recommendation: null,
      },
    ],

    attachments: [],

    history: [
      {
        id: "hist-01",
        date: "26/08/2026",
        time: "09:10",
        action: "Solicitação criada",
        actor: "Sistema",
        description:
          "Solicitação recebida pelo formulário público.",
      },

      {
        id: "hist-02",
        date: "26/08/2026",
        time: "11:32",
        action: "Análise iniciada",
        actor: "Administrador",
        description:
          "Responsável iniciou a avaliação da solicitação.",
      },
    ],
  },

  {
    id: "SOL-0026",
    company: "Empresa Gama",
    contact: "Rafael Souza",
    email: "rafael@empresagama.com",
    phone: "(62) 97777-4420",
    origin: "Configurador",
    service: "Engenharia reversa",
    services: ["Engenharia reversa"],
    createdAt: "25/08/2026",
    status: "Aguardando informações",
    priority: "Normal",
    responsible: "Administrador",
    parts: 1,
    objective:
      "Reconstruir digitalmente um componente sem documentação técnica disponível.",
    comments:
      "Ainda é necessário confirmar se existem geometrias internas importantes.",
    internalNotes:
      "Solicitar fotos adicionais e confirmar escopo interno.",
    customer: {
      department: "Manutenção",
      company: "Empresa Gama",
      contact: "Rafael Souza",
      email: "rafael@empresagama.com",
      phone: "(62) 97777-4420",
    },
    piecesData: [],
    attachments: [],
    history: [],
  },

  {
    id: "SOL-0025",
    company: "Tecnologia Delta",
    contact: "Marina Costa",
    email: "marina@tecdelta.com",
    phone: "(62) 96666-8352",
    origin: "Formulário",
    service: "Análise interna",
    services: ["Análise interna"],
    createdAt: "24/08/2026",
    status: "Apta para orçamento",
    priority: "Urgente",
    responsible: "Administrador",
    parts: 3,
    objective:
      "Investigar características internas de componentes montados.",
    comments: "",
    internalNotes:
      "Escopo preliminar validado. Pode seguir para orçamento.",
    customer: {
      department: "Qualidade",
      company: "Tecnologia Delta",
      contact: "Marina Costa",
      email: "marina@tecdelta.com",
      phone: "(62) 96666-8352",
    },
    piecesData: [],
    attachments: [],
    history: [],
  },

  {
    id: "SOL-0024",
    company: "Componentes Ômega",
    contact: "Eduardo Lima",
    email: "eduardo@omega.com",
    phone: "(62) 95555-2301",
    origin: "Configurador",
    service: "Inspeção dimensional",
    services: ["Inspeção dimensional"],
    createdAt: "23/08/2026",
    status: "Convertida em orçamento",
    priority: "Normal",
    responsible: "Administrador",
    parts: 1,
    objective:
      "Verificação dimensional de componente para controle de qualidade.",
    comments: "",
    internalNotes:
      "Solicitação convertida no orçamento ORC-0012.",
    customer: {
      department: "Produção",
      company: "Componentes Ômega",
      contact: "Eduardo Lima",
      email: "eduardo@omega.com",
      phone: "(62) 95555-2301",
    },
    piecesData: [],
    attachments: [],
    history: [],
  },
];

export const requestStatuses = [
  "Todos",
  "Nova",
  "Em análise",
  "Aguardando informações",
  "Apta para orçamento",
  "Convertida em orçamento",
  "Recusada",
  "Cancelada",
];

export const requestOrigins = [
  "Todas",
  "Configurador",
  "Formulário",
];

export function getRequestById(requestId) {
  return requests.find(
    (request) =>
      request.id === requestId,
  );
}