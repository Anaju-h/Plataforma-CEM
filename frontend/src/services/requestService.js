import {
  requests,
} from "../data/internal/requests";

/*
 * ============================================================
 * SERVIÇO TEMPORÁRIO DE SOLICITAÇÕES
 * ============================================================
 *
 * Nesta fase:
 *
 * - mantém solicitações em runtime;
 * - registra updatedAt;
 * - atualiza status;
 * - atualiza responsável;
 * - salva observações internas;
 * - registra histórico das movimentações.
 *
 * Futuramente estas operações irão para API/backend.
 * ============================================================
 */

let runtimeRequests =
  requests.map(
    (request) => ({
      ...request,

      updatedAt:
        request.updatedAt ??
        getLastHistoryDate(
          request,
        ) ??
        request.createdAt,

      history:
        Array.isArray(
          request.history,
        )
          ? request.history.map(
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

export function getRuntimeRequests() {
  return runtimeRequests;
}

export function getRuntimeRequestById(
  requestId,
) {
  return runtimeRequests.find(
    (request) =>
      request.id ===
      requestId,
  );
}

/*
 * ============================================================
 * ATUALIZAÇÃO GENÉRICA
 * ============================================================
 */

export function updateRuntimeRequest(
  requestId,
  patch,
) {
  runtimeRequests =
    runtimeRequests.map(
      (request) =>
        request.id ===
        requestId
          ? {
              ...request,

              ...patch,

              updatedAt:
                formatCurrentDate(),
            }
          : request,
    );

  return getRuntimeRequestById(
    requestId,
  );
}

/*
 * ============================================================
 * STATUS
 * ============================================================
 */

export function updateRuntimeRequestStatus(
  requestId,
  status,
) {
  return updateRuntimeRequest(
    requestId,
    {
      status,
    },
  );
}

/*
 * ============================================================
 * INICIAR ANÁLISE
 * ============================================================
 */

export function startRequestAnalysis(
  requestId,
  actor = "Administrador",
) {
  const request =
    getRuntimeRequestById(
      requestId,
    );

  if (!request) {
    throw new Error(
      "Solicitação não encontrada.",
    );
  }

  if (
    request.status !==
    "Nova"
  ) {
    throw new Error(
      "Somente solicitações novas podem iniciar análise.",
    );
  }

  return updateRequestWithHistory(
    requestId,
    {
      status:
        "Em análise",

      responsible:
        actor,
    },
    {
      action:
        "Análise iniciada",

      actor,

      description:
        "A solicitação entrou em análise técnica.",
    },
  );
}

/*
 * ============================================================
 * RETOMAR ANÁLISE
 * ============================================================
 */

export function resumeRequestAnalysis(
  requestId,
  actor = "Administrador",
) {
  const request =
    getRuntimeRequestById(
      requestId,
    );

  if (!request) {
    throw new Error(
      "Solicitação não encontrada.",
    );
  }

  if (
    request.status !==
    "Aguardando informações"
  ) {
    throw new Error(
      "Esta solicitação não está aguardando informações.",
    );
  }

  return updateRequestWithHistory(
    requestId,
    {
      status:
        "Em análise",

      responsible:
        actor,
    },
    {
      action:
        "Análise retomada",

      actor,

      description:
        "A solicitação voltou para análise após o recebimento ou validação das informações necessárias.",
    },
  );
}

/*
 * ============================================================
 * CONCLUIR ANÁLISE
 * ============================================================
 */

export function finishRequestAnalysis(
  requestId,
  result,
  actor = "Administrador",
) {
  const request =
    getRuntimeRequestById(
      requestId,
    );

  if (!request) {
    throw new Error(
      "Solicitação não encontrada.",
    );
  }

  if (
    request.status !==
    "Em análise"
  ) {
    throw new Error(
      "Somente solicitações em análise podem concluir esta etapa.",
    );
  }

  switch (result) {
    case "quote-ready":
      return updateRequestWithHistory(
        requestId,
        {
          status:
            "Apta para orçamento",
        },
        {
          action:
            "Análise concluída",

          actor,

          description:
            "A solicitação foi considerada tecnicamente apta para seguir ao orçamento.",
        },
      );

    case "waiting-information":
      return updateRequestWithHistory(
        requestId,
        {
          status:
            "Aguardando informações",
        },
        {
          action:
            "Informações adicionais solicitadas",

          actor,

          description:
            "A análise foi pausada até o recebimento de informações adicionais.",
        },
      );

    case "rejected":
      return updateRequestWithHistory(
        requestId,
        {
          status:
            "Recusada",
        },
        {
          action:
            "Solicitação recusada",

          actor,

          description:
            "A solicitação foi encerrada após a análise técnica.",
        },
      );

    default:
      throw new Error(
        "Resultado da análise inválido.",
      );
  }
}

/*
 * ============================================================
 * CONVERSÃO PARA ORÇAMENTO
 * ============================================================
 */

export function markRequestAsConverted(
  requestId,
  quoteId,
  actor = "Administrador",
) {
  const request =
    getRuntimeRequestById(
      requestId,
    );

  if (!request) {
    throw new Error(
      "Solicitação não encontrada.",
    );
  }

  if (
    request.status !==
    "Apta para orçamento"
  ) {
    throw new Error(
      "A solicitação precisa estar apta para orçamento antes da conversão.",
    );
  }

  return updateRequestWithHistory(
    requestId,
    {
      status:
        "Convertida em orçamento",
    },
    {
      action:
        "Solicitação convertida em orçamento",

      actor,

      description:
        `A solicitação originou o orçamento ${quoteId}.`,
    },
  );
}

/*
 * ============================================================
 * OBSERVAÇÕES INTERNAS
 * ============================================================
 */

export function saveRequestInternalNotes(
  requestId,
  notes,
  actor = "Administrador",
) {
  const request =
    getRuntimeRequestById(
      requestId,
    );

  if (!request) {
    throw new Error(
      "Solicitação não encontrada.",
    );
  }

  const normalizedNotes =
    String(
      notes ?? "",
    ).trim();

  const changed =
    normalizedNotes !==
    String(
      request.internalNotes ??
        "",
    ).trim();

  if (!changed) {
    return request;
  }

  return updateRequestWithHistory(
    requestId,
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
          ? "As observações internas da solicitação foram atualizadas."
          : "As observações internas da solicitação foram removidas.",
    },
  );
}

/*
 * ============================================================
 * CANCELAMENTO
 * ============================================================
 */

export function cancelRuntimeRequest(
  requestId,
  actor = "Administrador",
) {
  const request =
    getRuntimeRequestById(
      requestId,
    );

  if (!request) {
    throw new Error(
      "Solicitação não encontrada.",
    );
  }

  if (
    [
      "Convertida em orçamento",
      "Recusada",
      "Cancelada",
    ].includes(
      request.status,
    )
  ) {
    throw new Error(
      "Esta solicitação já está encerrada.",
    );
  }

  return updateRequestWithHistory(
    requestId,
    {
      status:
        "Cancelada",
    },
    {
      action:
        "Solicitação cancelada",

      actor,

      description:
        "A solicitação foi encerrada e não seguirá no fluxo.",
    },
  );
}

/*
 * ============================================================
 * ATUALIZAÇÃO + HISTÓRICO
 * ============================================================
 */

function updateRequestWithHistory(
  requestId,
  patch,
  historyEvent,
) {
  const request =
    getRuntimeRequestById(
      requestId,
    );

  if (!request) {
    return null;
  }

  const now =
    new Date();

  const event = {
    id:
      createHistoryId(),

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

  runtimeRequests =
    runtimeRequests.map(
      (item) =>
        item.id ===
        requestId
          ? {
              ...item,

              ...patch,

              updatedAt:
                event.date,

              history: [
                ...item.history,
                event,
              ],
            }
          : item,
    );

  return getRuntimeRequestById(
    requestId,
  );
}

/*
 * ============================================================
 * UTILITÁRIOS
 * ============================================================
 */

function createHistoryId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `hist-${crypto.randomUUID()}`;
  }

  return `hist-${Date.now()}`;
}

function getLastHistoryDate(
  request,
) {
  if (
    !Array.isArray(
      request.history,
    ) ||
    request.history.length ===
      0
  ) {
    return null;
  }

  const lastEvent =
    request.history[
      request.history.length - 1
    ];

  return (
    lastEvent?.date ??
    null
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