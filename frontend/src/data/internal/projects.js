export const projects = [
  {
    id: "PRJ-0001",

    quoteId: "ORC-0011",

    company:
      "Engenharia Sigma",

    service:
      "Digitalização 3D",

    machineId:
      "atos-q",

    machine:
      "ZEISS ATOS Q",

    responsible:
      "Administrador",

    createdAt:
      "24/08/2026",

    deadline:
      "05/09/2026",

    status:
      "Em andamento",

    priority:
      "Normal",

    description:
      "Projeto criado a partir do orçamento ORC-0011 aprovado pelo cliente.",

    internalNotes:
      "Validar documentação final antes da entrega.",

    /*
     * Nesta V1 as tarefas são apenas
     * acompanhamento operacional leve.
     */
    tasks: [
      {
        id: "TASK-001",

        title:
          "Conferir informações recebidas",

        completed: true,
      },

      {
        id: "TASK-002",

        title:
          "Preparar estratégia do serviço",

        completed: true,
      },

      {
        id: "TASK-003",

        title:
          "Executar aquisição / medição",

        completed: false,
      },

      {
        id: "TASK-004",

        title:
          "Analisar resultados",

        completed: false,
      },

      {
        id: "TASK-005",

        title:
          "Preparar entrega",

        completed: false,
      },
    ],
  },
];

export const projectStatuses = [
  "Todos",
  "Planejamento",
  "Aguardando execução",
  "Em andamento",
  "Aguardando revisão",
  "Concluído",
  "Pausado",
  "Cancelado",
];

export function getProjectById(
  projectId,
) {
  return projects.find(
    (project) =>
      project.id === projectId,
  );
}