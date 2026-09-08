import {
  quotes,
} from "../data/internal/quotes";

import {
  initialCommercialReference,
} from "../data/internal/pricingKnowledge";

/*
 * ============================================================
 * SERVIÇO TEMPORÁRIO DE ORÇAMENTOS
 * ============================================================
 */

let runtimeQuotes =
  quotes.map(
    (quote) => ({
      ...quote,

      scope:
        quote.scope ??
        "",

      commercialNotes:
        quote.commercialNotes ??
        "",

      machineId:
        quote.machineId ??
        null,

      technicalHours:
        quote.technicalHours ??
        0,

      billableHours:
        quote.billableHours ??
        0,

      hourlyRate:
        quote.hourlyRate ??
        initialCommercialReference.hourlyRate,

      internalCost:
        quote.internalCost ??
        0,

      proposedValue:
        quote.proposedValue ??
        0,

      deadlineDays:
        quote.deadlineDays ??
        0,

      validityDays:
        quote.validityDays ??
        15,

      convertedToProject:
        quote.convertedToProject ??
        false,

      projectId:
        quote.projectId ??
        null,

      history:
        Array.isArray(
          quote.history,
        )
          ? [...quote.history]
          : [],
    }),
  );

/*
 * ============================================================
 * CONSULTAS
 * ============================================================
 */

export function getRuntimeQuotes() {
  return runtimeQuotes;
}

export function getRuntimeQuoteById(
  quoteId,
) {
  return runtimeQuotes.find(
    (quote) =>
      quote.id ===
      quoteId,
  );
}

export function getQuoteByRequestId(
  requestId,
) {
  return runtimeQuotes.find(
    (quote) =>
      quote.requestId ===
      requestId,
  );
}

/*
 * ============================================================
 * ATUALIZAÇÃO GENÉRICA
 * ============================================================
 */

export function updateRuntimeQuote(
  quoteId,
  patch,
) {
  const updatedAt =
    formatCurrentDate();

  runtimeQuotes =
    runtimeQuotes.map(
      (quote) =>
        quote.id ===
        quoteId
          ? {
              ...quote,
              ...patch,
              updatedAt,
            }
          : quote,
    );

  return getRuntimeQuoteById(
    quoteId,
  );
}

/*
 * Mantemos esta função porque outros arquivos
 * do sistema podem continuar usando ela.
 */

export function updateRuntimeQuoteStatus(
  quoteId,
  status,
) {
  return updateRuntimeQuote(
    quoteId,
    {
      status,
    },
  );
}

/*
 * ============================================================
 * ENVIAR PARA REVISÃO
 * ============================================================
 */

export function sendQuoteToReview(
  quoteId,
  actor = "Administrador",
) {
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
      "Em elaboração" &&
    quote.status !==
      "Rascunho"
  ) {
    throw new Error(
      "Este orçamento não pode ser enviado para revisão neste status.",
    );
  }

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Em revisão",
    },
    {
      action:
        "Orçamento enviado para revisão",

      actor,

      description:
        "O orçamento foi encaminhado para revisão interna.",
    },
  );
}

/*
 * ============================================================
 * APROVAR INTERNAMENTE
 * ============================================================
 */

export function approveQuoteInternally(
  quoteId,
  actor = "Administrador",
) {
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
    "Em revisão"
  ) {
    throw new Error(
      "Somente orçamentos em revisão podem ser aprovados.",
    );
  }

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Aprovado internamente",
    },
    {
      action:
        "Orçamento aprovado internamente",

      actor,

      description:
        "A revisão interna foi concluída e o orçamento foi aprovado.",
    },
  );
}

/*
 * ============================================================
 * VOLTAR PARA ELABORAÇÃO
 * ============================================================
 */

export function returnQuoteToEditing(
  quoteId,
  actor = "Administrador",
) {
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
    "Em revisão"
  ) {
    throw new Error(
      "Somente orçamentos em revisão podem retornar para elaboração.",
    );
  }

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Em elaboração",
    },
    {
      action:
        "Ajustes solicitados",

      actor,

      description:
        "O orçamento retornou para elaboração para receber ajustes.",
    },
  );
}

/*
 * ============================================================
 * MARCAR COMO ENVIADO
 * ============================================================
 */

export function markQuoteAsSent(
  quoteId,
  actor = "Administrador",
) {
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
    "Aprovado internamente"
  ) {
    throw new Error(
      "O orçamento precisa estar aprovado internamente antes do envio.",
    );
  }

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Enviado",

      sentAt:
        formatCurrentDate(),
    },
    {
      action:
        "Proposta enviada",

      actor,

      description:
        "O envio da proposta ao cliente foi registrado.",
    },
  );
}

/*
 * ============================================================
 * ACEITE DO CLIENTE
 * ============================================================
 */

export function acceptRuntimeQuote(
  quoteId,
  actor = "Administrador",
) {
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
    "Enviado"
  ) {
    throw new Error(
      "Somente propostas enviadas podem receber aceite.",
    );
  }

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Aceito",

      acceptedAt:
        formatCurrentDate(),
    },
    {
      action:
        "Aceite do cliente registrado",

      actor,

      description:
        "O cliente aceitou a proposta comercial.",
    },
  );
}

/*
 * ============================================================
 * RECUSA DO CLIENTE
 * ============================================================
 */

export function rejectRuntimeQuote(
  quoteId,
  actor = "Administrador",
) {
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
    "Enviado"
  ) {
    throw new Error(
      "Somente propostas enviadas podem ser recusadas.",
    );
  }

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Recusado",

      rejectedAt:
        formatCurrentDate(),
    },
    {
      action:
        "Recusa do cliente registrada",

      actor,

      description:
        "O cliente recusou a proposta comercial.",
    },
  );
}

/*
 * ============================================================
 * CANCELAMENTO
 * ============================================================
 */

export function cancelRuntimeQuote(
  quoteId,
  actor = "Administrador",
) {
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
    [
      "Aceito",
      "Recusado",
      "Cancelado",
    ].includes(
      quote.status,
    )
  ) {
    throw new Error(
      "Este orçamento já está encerrado.",
    );
  }

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Cancelado",
    },
    {
      action:
        "Orçamento cancelado",

      actor,

      description:
        "O orçamento foi encerrado antes da conclusão do fluxo comercial.",
    },
  );
}

/*
 * ============================================================
 * REGISTRAR EVENTO NO HISTÓRICO
 * ============================================================
 */

export function recordQuoteEvent(
  quoteId,
  {
    action,
    description,
    actor = "Administrador",
  },
) {
  const quote =
    getRuntimeQuoteById(
      quoteId,
    );

  if (!quote) {
    throw new Error(
      "Orçamento não encontrado.",
    );
  }

  return updateQuoteWithHistory(
    quoteId,
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
 * CRIAÇÃO A PARTIR DE SOLICITAÇÃO
 * ============================================================
 */

export function createQuoteFromRequest(
  request,
) {
  const existingQuote =
    getQuoteByRequestId(
      request.id,
    );

  if (existingQuote) {
    return {
      quote:
        existingQuote,

      created:
        false,
    };
  }

  const quoteId =
    generateNextQuoteId();

  const today =
    formatCurrentDate();

  const firstRecommendedMachine =
    request.piecesData
      ?.find(
        (piece) =>
          piece.recommendation
            ?.primaryMachine,
      )
      ?.recommendation
      ?.primaryMachine
      ?.name ??
    null;

  const machineId =
    machineIdFromName(
      firstRecommendedMachine,
    );

  const responsible =
    !request.responsible ||
    request.responsible ===
      "Não atribuído"
      ? "Administrador"
      : request.responsible;

  const quote = {
    id:
      quoteId,

    requestId:
      request.id,

    company:
      request.company,

    contact:
      request.contact,

    createdAt:
      today,

    updatedAt:
      today,

    status:
      "Em elaboração",

    priority:
      request.priority ??
      "Normal",

    responsible,

    service:
      request.service,

    machineId,

    technicalHours:
      0,

    billableHours:
      0,

    hourlyRate:
      initialCommercialReference.hourlyRate,

    internalCost:
      0,

    proposedValue:
      0,

    deadlineDays:
      0,

    validityDays:
      15,

    scope:
      request.objective
        ? `Executar ${request.service.toLowerCase()} conforme o escopo técnico da solicitação ${request.id}.\n\nObjetivo informado pelo cliente: ${request.objective}`
        : `Executar ${request.service.toLowerCase()} conforme o escopo técnico aprovado na solicitação ${request.id}.`,

    commercialNotes:
      "",

    convertedToProject:
      false,

    projectId:
      null,

    history: [
      {
        id:
          generateHistoryId(),

        date:
          today,

        time:
          formatCurrentTime(),

        action:
          "Orçamento criado",

        actor:
          responsible,

        description:
          `O orçamento foi criado a partir da solicitação ${request.id}.`,
      },
    ],
  };

  runtimeQuotes = [
    quote,
    ...runtimeQuotes,
  ];

  return {
    quote,

    created:
      true,
  };
}

/*
 * ============================================================
 * ATUALIZAÇÃO COM HISTÓRICO
 * ============================================================
 */

function updateQuoteWithHistory(
  quoteId,
  patch,
  historyEvent,
) {
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

  runtimeQuotes =
    runtimeQuotes.map(
      (quote) =>
        quote.id ===
        quoteId
          ? {
              ...quote,
              ...patch,

              updatedAt:
                event.date,

              history: [
                ...(quote.history ??
                  []),

                event,
              ],
            }
          : quote,
    );

  return getRuntimeQuoteById(
    quoteId,
  );
}

/*
 * ============================================================
 * IDS
 * ============================================================
 */

function generateNextQuoteId() {
  const largestNumber =
    runtimeQuotes.reduce(
      (
        largest,
        quote,
      ) => {
        const number =
          Number(
            quote.id.replace(
              "ORC-",
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

  return `ORC-${String(
    largestNumber + 1,
  ).padStart(
    4,
    "0",
  )}`;
}

function generateHistoryId() {
  return `quote-history-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

/*
 * ============================================================
 * EQUIPAMENTOS
 * ============================================================
 */

function machineIdFromName(
  name,
) {
  if (!name) {
    return null;
  }

  const normalized =
    name.toLowerCase();

  if (
    normalized.includes(
      "prismo",
    )
  ) {
    return "prismo";
  }

  if (
    normalized.includes(
      "duramax",
    )
  ) {
    return "duramax";
  }

  if (
    normalized.includes(
      "o-inspect",
    )
  ) {
    return "o-inspect";
  }

  if (
    normalized.includes(
      "atos",
    )
  ) {
    return "atos-q";
  }

  if (
    normalized.includes(
      "bosello",
    )
  ) {
    return "bosello-max";
  }

  if (
    normalized.includes(
      "contura",
    )
  ) {
    return "contura";
  }

  return null;
}

/*
 * ============================================================
 * DATAS
 * ============================================================
 */

function formatCurrentDate() {
  return formatDate(
    new Date(),
  );
}

function formatCurrentTime() {
  return formatTime(
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