import {
  projects,
} from "../data/internal/projects";
import { getProposalByQuoteId, validateProposalForProject } from "./proposalService";

import {
  getMachineCostKnowledge,
} from "../data/internal/pricingKnowledge";

import {
  getRuntimeQuoteById,
  updateRuntimeQuote,
} from "./quoteService";

/*
 * ============================================================
 * SERVIÇO TEMPORÁRIO DE PROJETOS
 * ============================================================
 */

let runtimeProjects =
  projects.map(
    (project) => ({
      ...project,
      source: project.source ?? "demo",

      updatedAt:
        project.updatedAt ??
        project.createdAt,

      internalNotes:
        project.internalNotes ??
        "",

      tasks:
        Array.isArray(
          project.tasks,
        )
          ? project.tasks.map(
              (task) => ({
                ...task,
              }),
            )
          : [],

      history:
        Array.isArray(
          project.history,
        )
          ? project.history.map(
              (item) => ({
                ...item,
              }),
            )
          : [],
    }),
  );

/*
 * ============================================================
 * CONSULTAS
 * ============================================================
 */

export function isArchivedProject(project) { return ["Concluído", "Cancelado"].includes(project.status); }
export function getActiveProjects() { return getRuntimeProjects().filter(project => !isArchivedProject(project)); }
export function getArchivedProjects() { return getRuntimeProjects().filter(isArchivedProject); }

export function getRuntimeProjects() {
  return runtimeProjects;
}

export function getRuntimeProjectById(
  projectId,
) {
  return runtimeProjects.find(
    (project) =>
      project.id ===
      projectId,
  );
}

export function getProjectByQuoteId(
  quoteId,
) {
  return runtimeProjects.find(
    (project) =>
      project.quoteId ===
      quoteId,
  );
}

/*
 * ============================================================
 * CRIAÇÃO
 * ============================================================
 */

export function createProjectFromQuote(
  quoteId,
) {
  const validation = validateProposalForProject(quoteId);
  if (!validation.valid) throw new Error(validation.problems.join(" "));
  const proposal = getProposalByQuoteId(quoteId);
  const quote =
    getRuntimeQuoteById(
      quoteId,
    );

  if (!quote) {
    throw new Error(
      "Orçamento não encontrado.",
    );
  }

  if (
    quote.status !==
    "Aceito"
  ) {
    throw new Error(
      "Somente orçamentos aceitos podem ser convertidos em projeto.",
    );
  }

  const existingProject =
    getProjectByQuoteId(
      quote.id,
    );

  if (existingProject) {
    return {
      project:
        existingProject,

      created:
        false,
    };
  }

  if (
    quote.projectId
  ) {
    const linkedProject =
      getRuntimeProjectById(
        quote.projectId,
      );

    if (linkedProject) {
      return {
        project:
          linkedProject,

        created:
          false,
      };
    }
  }

  const projectId =
    generateNextProjectId();

  const machine =
    quote.machineId
      ? getMachineCostKnowledge(
          quote.machineId,
        )
      : null;

  const today =
    formatCurrentDate();

  const now =
    new Date();

  const responsible =
    quote.responsible ??
    "Administrador";

  const project = {
    acceptedProposalId: proposal.id,
    acceptedProposalVersion: proposal.acceptedVersion,
    source: quote.source ?? "demo",
    id:
      projectId,

    quoteId:
      quote.id,

    company:
      quote.company,

    service:
      quote.service,

    machineId:
      quote.machineId ??
      null,

    machine:
      machine?.name ??
      "A definir",

    responsible,

    createdAt:
      today,

    updatedAt:
      today,

    deadline:
      calculateDeadline(
        quote.deadlineDays,
      ),

    status:
      "Planejamento",

    priority:
      quote.priority ??
      "Normal",

    description:
      `Projeto criado a partir do orçamento ${quote.id} aceito pelo cliente.`,

    internalNotes:
      "",

    tasks:
      createDefaultTasks(
        projectId,
      ),

    history: [
      {
        id:
          generateHistoryId(),

        date:
          formatDate(
            now,
          ),

        time:
          formatTime(
            now,
          ),

        action:
          "Projeto criado",

        actor:
          responsible,

        description:
          `O projeto foi criado a partir do orçamento ${quote.id}.`,
      },
    ],
  };

  runtimeProjects = [
    project,
    ...runtimeProjects,
  ];

  updateRuntimeQuote(
    quote.id,
    {
      convertedToProject:
        true,

      projectId:
        project.id,
    },
  );

  return {
    project,

    created:
      true,
  };
}

/*
 * ============================================================
 * ATUALIZAÇÃO GENÉRICA
 * ============================================================
 */

export function updateRuntimeProject(
  projectId,
  patch,
) {
  const project =
    getRuntimeProjectById(
      projectId,
    );

  if (!project) {
    throw new Error(
      "Projeto não encontrado.",
    );
  }

  runtimeProjects =
    runtimeProjects.map(
      (item) =>
        item.id ===
        projectId
          ? {
              ...item,
              ...patch,

              updatedAt:
                formatCurrentDate(),
            }
          : item,
    );

  return getRuntimeProjectById(
    projectId,
  );
}

/*
 * ============================================================
 * CHECKLIST
 * ============================================================
 */

export function updateProjectTask(
  projectId,
  taskId,
  completed,
  actor = "Administrador",
) {
  const project =
    getRuntimeProjectById(
      projectId,
    );

  if (!project) {
    throw new Error(
      "Projeto não encontrado.",
    );
  }

  if (
    isArchivedProject(project)
  ) {
    throw new Error(
      "O checklist de um projeto encerrado não pode ser alterado.",
    );
  }

  const task =
    project.tasks.find(
      (item) =>
        item.id ===
        taskId,
    );

  if (!task) {
    throw new Error(
      "Etapa não encontrada.",
    );
  }

  const now =
    new Date();

  const event = {
    id:
      generateHistoryId(),

    date:
      formatDate(
        now,
      ),

    time:
      formatTime(
        now,
      ),

    action:
      completed
        ? "Etapa concluída"
        : "Etapa reaberta",

    actor,

    description:
      completed
        ? `A etapa "${task.title}" foi marcada como concluída.`
        : `A etapa "${task.title}" foi reaberta.`,
  };

  runtimeProjects =
    runtimeProjects.map(
      (item) => {
        if (
          item.id !==
          projectId
        ) {
          return item;
        }

        return {
          ...item,

          updatedAt:
            event.date,

          tasks:
            item.tasks.map(
              (currentTask) =>
                currentTask.id ===
                taskId
                  ? {
                      ...currentTask,

                      completed,
                    }
                  : currentTask,
            ),

          history: [
            ...(item.history ??
              []),

            event,
          ],
        };
      },
    );

  return getRuntimeProjectById(
    projectId,
  );
}

/*
 * ============================================================
 * OBSERVAÇÕES INTERNAS
 * ============================================================
 */

export function saveProjectInternalNotes(
  projectId,
  notes,
  actor = "Administrador",
) {
  const project =
    getRuntimeProjectById(
      projectId,
    );

  if (!project) {
    throw new Error(
      "Projeto não encontrado.",
    );
  }

  if (
    isArchivedProject(project)
  ) {
    throw new Error(
      "As observações de um projeto encerrado não podem ser alteradas.",
    );
  }

  const normalizedNotes =
    String(
      notes ?? "",
    ).trim();

  const currentNotes =
    String(
      project.internalNotes ??
        "",
    ).trim();

  if (
    normalizedNotes ===
    currentNotes
  ) {
    return project;
  }

  return updateProjectWithHistory(
    projectId,
    {
      internalNotes:
        normalizedNotes,
    },
    {
      action:
        "Observações internas atualizadas",

      actor,

      description:
        normalizedNotes
          ? "As observações internas do projeto foram atualizadas."
          : "As observações internas do projeto foram removidas.",
    },
  );
}

/*
 * ============================================================
 * PLANEJAMENTO
 * ============================================================
 */

export function startProjectPreparation(
  projectId,
  actor = "Administrador",
) {
  const project =
    requireProject(
      projectId,
    );

  if (
    project.status !==
    "Planejamento"
  ) {
    throw new Error(
      "Somente projetos em planejamento podem iniciar a preparação.",
    );
  }

  return updateProjectWithHistory(
    projectId,
    {
      status:
        "Aguardando execução",
    },
    {
      action:
        "Preparação concluída",

      actor,

      description:
        "O planejamento inicial foi concluído e o projeto está aguardando execução.",
    },
  );
}

/*
 * ============================================================
 * INICIAR EXECUÇÃO
 * ============================================================
 */

export function startProjectExecution(
  projectId,
  actor = "Administrador",
) {
  const project =
    requireProject(
      projectId,
    );

  if (
    ![
      "Aguardando execução",
      "Planejamento",
    ].includes(
      project.status,
    )
  ) {
    throw new Error(
      "Este projeto não pode iniciar a execução no status atual.",
    );
  }

  return updateProjectWithHistory(
    projectId,
    {
      status:
        "Em andamento",
    },
    {
      action:
        "Execução iniciada",

      actor,

      description:
        "A execução técnica do projeto foi iniciada.",
    },
  );
}

/*
 * ============================================================
 * ENVIAR PARA REVISÃO
 * ============================================================
 */

export function sendProjectToReview(
  projectId,
  actor = "Administrador",
) {
  const project =
    requireProject(
      projectId,
    );

  if (
    project.status !==
    "Em andamento"
  ) {
    throw new Error(
      "Somente projetos em andamento podem ser enviados para revisão.",
    );
  }

  return updateProjectWithHistory(
    projectId,
    {
      status:
        "Aguardando revisão",
    },
    {
      action:
        "Projeto enviado para revisão",

      actor,

      description:
        "A execução foi encaminhada para revisão antes da conclusão.",
    },
  );
}

/*
 * ============================================================
 * VOLTAR PARA EXECUÇÃO
 * ============================================================
 */

export function returnProjectToExecution(
  projectId,
  actor = "Administrador",
) {
  const project =
    requireProject(
      projectId,
    );

  if (
    project.status !==
    "Aguardando revisão"
  ) {
    throw new Error(
      "Somente projetos aguardando revisão podem retornar para execução.",
    );
  }

  return updateProjectWithHistory(
    projectId,
    {
      status:
        "Em andamento",
    },
    {
      action:
        "Projeto retornou para execução",

      actor,

      description:
        "Foram solicitados ajustes antes da conclusão do projeto.",
    },
  );
}

/*
 * ============================================================
 * CONCLUIR PROJETO
 * ============================================================
 */

export function completeRuntimeProject(
  projectId,
  actor = "Administrador",
) {
  const project =
    requireProject(
      projectId,
    );

  if (
    project.status !==
    "Aguardando revisão"
  ) {
    throw new Error(
      "O projeto precisa estar aguardando revisão antes de ser concluído.",
    );
  }

  const incompleteTasks =
    project.tasks.filter(
      (task) =>
        !task.completed,
    );

  if (
    incompleteTasks.length >
    0
  ) {
    throw new Error(
      "Conclua todas as etapas do checklist antes de finalizar o projeto.",
    );
  }

  return updateProjectWithHistory(
    projectId,
    {
      status:
        "Concluído",

      completedAt:
        formatCurrentDate(),
    },
    {
      action:
        "Projeto concluído",

      actor,

      description:
        "A revisão foi finalizada e o projeto foi concluído.",
    },
  );
}

/*
 * ============================================================
 * REABRIR PROJETO
 * ============================================================
 */

export function reopenRuntimeProject(
  projectId,
  actor = "Administrador",
) {
  const project =
    requireProject(
      projectId,
    );

  if (
    project.status !==
    "Concluído"
  ) {
    throw new Error(
      "Somente projetos concluídos podem ser reabertos.",
    );
  }

  return updateProjectWithHistory(
    projectId,
    {
      status:
        "Em andamento",

      completedAt:
        null,
    },
    {
      action:
        "Projeto reaberto",

      actor,

      description:
        "O projeto foi reaberto para nova execução ou ajustes.",
    },
  );
}

/*
 * ============================================================
 * REGISTRO MANUAL DE EVENTO
 * ============================================================
 */

export function recordProjectEvent(
  projectId,
  {
    action,
    description,
    actor = "Administrador",
  },
) {
  requireProject(
    projectId,
  );

  return updateProjectWithHistory(
    projectId,
    {},
    {
      action,
      description,
      actor,
    },
  );
}

/*
 * ============================================================
 * ATUALIZAÇÃO COM HISTÓRICO
 * ============================================================
 */

function updateProjectWithHistory(
  projectId,
  patch,
  historyEvent,
) {
  const project =
    requireProject(
      projectId,
    );

  const now =
    new Date();

  const event = {
    id:
      generateHistoryId(),

    date:
      formatDate(
        now,
      ),

    time:
      formatTime(
        now,
      ),

    action:
      historyEvent.action,

    actor:
      historyEvent.actor,

    description:
      historyEvent.description,
  };

  runtimeProjects =
    runtimeProjects.map(
      (item) =>
        item.id ===
        project.id
          ? {
              ...item,
              ...patch,

              updatedAt:
                event.date,

              history: [
                ...(item.history ??
                  []),

                event,
              ],
            }
          : item,
    );

  return getRuntimeProjectById(
    project.id,
  );
}

/*
 * ============================================================
 * VALIDAÇÃO
 * ============================================================
 */

function requireProject(
  projectId,
) {
  const project =
    getRuntimeProjectById(
      projectId,
    );

  if (!project) {
    throw new Error(
      "Projeto não encontrado.",
    );
  }

  return project;
}

/*
 * ============================================================
 * TAREFAS INICIAIS
 * ============================================================
 */

function createDefaultTasks(
  projectId,
) {
  return [
    {
      id:
        `${projectId}-TASK-01`,

      title:
        "Conferir informações do serviço",

      completed:
        false,
    },

    {
      id:
        `${projectId}-TASK-02`,

      title:
        "Preparar estratégia de execução",

      completed:
        false,
    },

    {
      id:
        `${projectId}-TASK-03`,

      title:
        "Executar serviço",

      completed:
        false,
    },

    {
      id:
        `${projectId}-TASK-04`,

      title:
        "Analisar resultados",

      completed:
        false,
    },

    {
      id:
        `${projectId}-TASK-05`,

      title:
        "Preparar entrega",

      completed:
        false,
    },
  ];
}

/*
 * ============================================================
 * IDS
 * ============================================================
 */

function generateNextProjectId() {
  const largestNumber =
    runtimeProjects.reduce(
      (
        largest,
        project,
      ) => {
        const number =
          Number(
            project.id.replace(
              "PRJ-",
              "",
            ),
          );

        if (
          Number.isNaN(
            number,
          )
        ) {
          return largest;
        }

        return Math.max(
          largest,
          number,
        );
      },
      0,
    );

  return `PRJ-${String(
    largestNumber + 1,
  ).padStart(
    4,
    "0",
  )}`;
}

function generateHistoryId() {
  return `project-history-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

/*
 * ============================================================
 * DATAS
 * ============================================================
 */

function calculateDeadline(
  deadlineDays,
) {
  const days =
    Number(
      deadlineDays,
    );

  if (
    !Number.isFinite(
      days,
    ) ||
    days <= 0
  ) {
    return "A definir";
  }

  const date =
    new Date();

  date.setDate(
    date.getDate() +
      days,
  );

  return formatDate(
    date,
  );
}

function formatCurrentDate() {
  return formatDate(
    new Date(),
  );
}

function formatDate(
  date,
) {
  return new Intl.DateTimeFormat(
    "pt-BR",
  ).format(
    date,
  );
}

function formatTime(
  date,
) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      hour:
        "2-digit",

      minute:
        "2-digit",
    },
  ).format(
    date,
  );
}
