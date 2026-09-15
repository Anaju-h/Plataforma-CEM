import {
  quotes,
} from "../data/internal/quotes";

import {
  initialCommercialReference,
} from "../data/internal/pricingKnowledge";

/* ============================================================
 * CONFIGURAÇÃO
 * ============================================================ */

const DEFAULT_ACTOR =
  "Administrador";

const EDITABLE_STATUSES = [
  "Rascunho",
  "Em elaboração",
];

const CLOSED_STATUSES = [
  "Aceito",
  "Recusado",
  "Cancelado",
];

/*
 * ============================================================
 * REPOSITÓRIO TEMPORÁRIO
 * ============================================================
 *
 * Enquanto o backend não existe, os orçamentos são mantidos
 * em memória.
 *
 * quotes.js fornece somente a base inicial/demo.
 *
 * Quando a API existir, esta camada continua sendo o ponto
 * de acesso do frontend.
 */

let runtimeQuotes =
  quotes.map(
    normalizeQuote,
  );

/* ============================================================
 * CONSULTAS
 * ============================================================ */

export function getRuntimeQuotes() {
  return runtimeQuotes;
}

export function getAllQuotes() {
  return getRuntimeQuotes();
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

export function getOpenRuntimeQuotes() {
  return runtimeQuotes.filter(
    (quote) =>
      !CLOSED_STATUSES.includes(
        quote.status,
      ),
  );
}

/* ============================================================
 * CONTEXTO DE CONHECIMENTO
 * ============================================================
 *
 * Contrato preparado para a futura API de Gestão do Conhecimento.
 *
 * Nesta fase NÃO inventamos:
 *
 * - casos históricos;
 * - faixas;
 * - fator de correção;
 * - confiança estatística;
 * - lições formalizadas.
 *
 * Quando ServiceRecord estiver conectado, este contrato poderá
 * receber os dados reais sem alterar a estrutura da página.
 */

export function getQuoteKnowledgeSupport(
  quoteId,
) {
  const quote =
    getRuntimeQuoteById(
      quoteId,
    );

  if (!quote) {
    return null;
  }

  const isDemo =
    quote.source !==
    "real";

  return {
    source:
      quote.source,

    isDemo,

    historyConnected:
      false,

    comparableCaseCount:
      0,

    confidence:
      "Sem classificação",

    observedRange:
      null,

    correctionFactor:
      null,

    formalizedLessons:
      [],

    cases:
      [],

    message:
      isDemo
        ? "Este orçamento pertence à base de demonstração. Dados demo não devem alimentar os indicadores nem o aprendizado da base real."
        : "Ainda não existem Registros de Serviço reais e formalizados conectados a este orçamento. O sistema não irá inventar uma faixa histórica ou fator de correção.",
  };
}

/* ============================================================
 * ATUALIZAÇÃO GENÉRICA
 *
 * Mantida por compatibilidade com projectService e outros
 * módulos já existentes.
 * ============================================================ */

export function updateRuntimeQuote(
  quoteId,
  patch = {},
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

  const updatedAt =
    formatCurrentDate();

  runtimeQuotes =
    runtimeQuotes.map(
      (item) =>
        item.id ===
        quoteId
          ? {
              ...item,

              ...patch,

              updatedAt,
            }
          : item,
    );

  return getRuntimeQuoteById(
    quoteId,
  );
}

/*
 * Mantemos este contrato porque arquivos antigos podem
 * continuar utilizando-o.
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

/* ============================================================
 * VALIDAÇÃO PARA REVISÃO
 * ============================================================ */

export function validateQuoteForReview(
  quote,
) {
  const problems = [];

  if (
    !normalizeText(
      quote.scope,
    )
  ) {
    problems.push(
      "escopo técnico",
    );
  }

  if (
    !normalizeText(
      quote.machineId,
    )
  ) {
    problems.push(
      "tecnologia de referência",
    );
  }

  if (
    toNumber(
      quote.technicalHours,
    ) <= 0
  ) {
    problems.push(
      "horas técnicas previstas",
    );
  }

  if (
    toNumber(
      quote.billableHours,
    ) <= 0
  ) {
    problems.push(
      "horas cobradas",
    );
  }

  if (
    toNumber(
      quote.hourlyRate,
    ) <= 0
  ) {
    problems.push(
      "valor/hora",
    );
  }

  if (
    toNumber(
      quote.proposedValue,
    ) <= 0
  ) {
    problems.push(
      "valor da proposta",
    );
  }

  if (
    toNumber(
      quote.deadlineDays,
    ) <= 0
  ) {
    problems.push(
      "prazo de execução",
    );
  }

  if (
    toNumber(
      quote.validityDays,
    ) <= 0
  ) {
    problems.push(
      "validade da proposta",
    );
  }

  if (
    !normalizeText(
      quote.estimateJustification,
    )
  ) {
    problems.push(
      "justificativa técnica da estimativa",
    );
  }

  return {
    valid:
      problems.length ===
      0,

    problems,
  };
}

/* ============================================================
 * ENVIAR PARA REVISÃO
 * ============================================================ */

export function sendQuoteToReview(
  quoteId,
  actor = DEFAULT_ACTOR,
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
    !EDITABLE_STATUSES.includes(
      quote.status,
    )
  ) {
    throw new Error(
      "Este orçamento não pode ser enviado para revisão neste status.",
    );
  }

  const validation =
    validateQuoteForReview(
      quote,
    );

  if (
    !validation.valid
  ) {
    throw new Error(
      `Antes da revisão, preencha: ${validation.problems.join(
        ", ",
      )}.`,
    );
  }

  const estimateVersion =
    createEstimateVersion(
      quote,
      actor,
    );

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Em revisão",

      estimateVersions: [
        ...(quote.estimateVersions ??
          []),

        estimateVersion,
      ],
    },
    {
      action:
        "Orçamento enviado para revisão",

      actor,

      description:
        `Estimativa ${estimateVersion.id} registrada e encaminhada para revisão interna.`,
    },
  );
}

/* ============================================================
 * APROVAR INTERNAMENTE
 * ============================================================ */

export function approveQuoteInternally(
  quoteId,
  actor = DEFAULT_ACTOR,
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

  const now =
    new Date();

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Aprovado internamente",

      approval: {
        approvedBy:
          actor,

        approvedAt:
          now.toISOString(),
      },
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

/* ============================================================
 * RETORNAR PARA ELABORAÇÃO
 * ============================================================ */

export function returnQuoteToEditing(
  quoteId,
  actor = DEFAULT_ACTOR,
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
        "O orçamento retornou para elaboração. A estimativa anteriormente enviada para revisão foi preservada no histórico.",
    },
  );
}

/* ============================================================
 * MARCAR PROPOSTA COMO ENVIADA
 * ============================================================ */

export function markQuoteAsSent(
  quoteId,
  actor = DEFAULT_ACTOR,
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

  const now =
    new Date();

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Enviado",

      sentAt:
        now.toISOString(),

      sentBy:
        actor,
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

/* ============================================================
 * ACEITE DO CLIENTE
 * ============================================================ */

export function acceptRuntimeQuote(
  quoteId,
  actor = DEFAULT_ACTOR,
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

  const now =
    new Date();

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Aceito",

      acceptedAt:
        now.toISOString(),

      acceptedRegisteredBy:
        actor,
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

/* ============================================================
 * RECUSA DO CLIENTE
 * ============================================================ */

export function rejectRuntimeQuote(
  quoteId,
  actor = DEFAULT_ACTOR,
  reason = "",
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

  const normalizedReason =
    normalizeText(
      reason,
    );

  if (
    !normalizedReason
  ) {
    throw new Error(
      "Informe o motivo da recusa.",
    );
  }

  const now =
    new Date();

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Recusado",

      rejectedAt:
        now.toISOString(),

      rejection: {
        reason:
          normalizedReason,

        registeredBy:
          actor,

        registeredAt:
          now.toISOString(),
      },
    },
    {
      action:
        "Recusa do cliente registrada",

      actor,

      description:
        `O cliente recusou a proposta. Motivo registrado: ${normalizedReason}`,
    },
  );
}

/* ============================================================
 * CANCELAMENTO
 * ============================================================ */

export function cancelRuntimeQuote(
  quoteId,
  actor = DEFAULT_ACTOR,
  reason = "",
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
    CLOSED_STATUSES.includes(
      quote.status,
    )
  ) {
    throw new Error(
      "Este orçamento já está encerrado.",
    );
  }

  const normalizedReason =
    normalizeText(
      reason,
    );

  if (
    !normalizedReason
  ) {
    throw new Error(
      "Informe o motivo do cancelamento.",
    );
  }

  const now =
    new Date();

  return updateQuoteWithHistory(
    quoteId,
    {
      status:
        "Cancelado",

      cancellation: {
        reason:
          normalizedReason,

        cancelledBy:
          actor,

        cancelledAt:
          now.toISOString(),
      },
    },
    {
      action:
        "Orçamento cancelado",

      actor,

      description:
        `O orçamento foi cancelado. Motivo registrado: ${normalizedReason}`,
    },
  );
}

/* ============================================================
 * REGISTRAR EVENTO
 * ============================================================ */

export function recordQuoteEvent(
  quoteId,
  {
    action,
    description,
    actor = DEFAULT_ACTOR,
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

/* ============================================================
 * CRIAÇÃO A PARTIR DE SOLICITAÇÃO
 * ============================================================ */

export function createQuoteFromRequest(
  request,
) {
  if (
    !request?.id
  ) {
    throw new Error(
      "Solicitação de origem inválida.",
    );
  }

  const existingQuote =
    getQuoteByRequestId(
      request.id,
    );

  if (
    existingQuote
  ) {
    return {
      quote:
        existingQuote,

      created:
        false,
    };
  }

  if (
    ![
      "Apta para orçamento",
      "Convertida em orçamento",
    ].includes(
      request.status,
    )
  ) {
    throw new Error(
      "A solicitação precisa estar apta para orçamento antes da criação da proposta.",
    );
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
      ? DEFAULT_ACTOR
      : request.responsible;

  const service =
    normalizeText(
      request.service,
    ) ||
    "Serviço";

  const quote = {
    id:
      quoteId,

    requestId:
      request.id,

    source:
      request.source ===
      "real"
        ? "real"
        : "demo",

    visibility:
      "internal",

    requestOrigin:
      request.origin ??
      "",

    requestChannel:
      request.channel ??
      "",

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

    service,

    services:
      Array.isArray(
        request.services,
      )
        ? [
            ...request.services,
          ]
        : [
            service,
          ],

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
        ? `Executar ${service.toLowerCase()} conforme o escopo técnico da solicitação ${request.id}.\n\nObjetivo informado pelo cliente: ${request.objective}`
        : `Executar ${service.toLowerCase()} conforme o escopo técnico aprovado na solicitação ${request.id}.`,

    estimateJustification:
      "",

    commercialNotes:
      "",

    estimateVersions:
      [],

    approval:
      null,

    rejection:
      null,

    cancellation:
      null,

    sentAt:
      null,

    sentBy:
      null,

    acceptedAt:
      null,

    acceptedRegisteredBy:
      null,

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

/* ============================================================
 * RESET
 * ============================================================ */

export function resetRuntimeQuotes() {
  runtimeQuotes =
    quotes.map(
      normalizeQuote,
    );

  return getRuntimeQuotes();
}

/* ============================================================
 * NORMALIZAÇÃO DOS MOCKS
 * ============================================================ */

function normalizeQuote(
  rawQuote,
) {
  const quote = {
    ...rawQuote,
  };

  return {
    ...quote,

    source:
      quote.source ===
      "real"
        ? "real"
        : "demo",

    visibility:
      quote.visibility ??
      "internal",

    requestOrigin:
      quote.requestOrigin ??
      "",

    requestChannel:
      quote.requestChannel ??
      "",

    scope:
      quote.scope ??
      "",

    estimateJustification:
      quote.estimateJustification ??
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

    estimateVersions:
      Array.isArray(
        quote.estimateVersions,
      )
        ? [
            ...quote.estimateVersions,
          ]
        : [],

    approval:
      quote.approval ??
      null,

    rejection:
      quote.rejection ??
      null,

    cancellation:
      quote.cancellation ??
      null,

    sentAt:
      quote.sentAt ??
      null,

    sentBy:
      quote.sentBy ??
      null,

    acceptedAt:
      quote.acceptedAt ??
      null,

    acceptedRegisteredBy:
      quote.acceptedRegisteredBy ??
      null,

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
        ? [
            ...quote.history,
          ]
        : [],
  };
}

/* ============================================================
 * SNAPSHOT DA ESTIMATIVA
 * ============================================================ */

function createEstimateVersion(
  quote,
  actor,
) {
  const now =
    new Date();

  return {
    id:
      `EST-${String(
        (quote.estimateVersions
          ?.length ??
          0) + 1,
      ).padStart(
        2,
        "0",
      )}`,

    capturedAt:
      now.toISOString(),

    capturedBy:
      actor,

    machineId:
      quote.machineId,

    technicalHours:
      toNumber(
        quote.technicalHours,
      ),

    billableHours:
      toNumber(
        quote.billableHours,
      ),

    hourlyRate:
      toNumber(
        quote.hourlyRate,
      ),

    internalCost:
      toNumber(
        quote.internalCost,
      ),

    proposedValue:
      toNumber(
        quote.proposedValue,
      ),

    deadlineDays:
      toNumber(
        quote.deadlineDays,
      ),

    validityDays:
      toNumber(
        quote.validityDays,
      ),

    justification:
      normalizeText(
        quote.estimateJustification,
      ),
  };
}

/* ============================================================
 * ATUALIZAÇÃO + HISTÓRICO
 * ============================================================ */

function updateQuoteWithHistory(
  quoteId,
  patch,
  historyEvent,
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
      historyEvent.actor ??
      DEFAULT_ACTOR,

    description:
      historyEvent.description ??
      "",
  };

  runtimeQuotes =
    runtimeQuotes.map(
      (item) =>
        item.id ===
        quoteId
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

  return getRuntimeQuoteById(
    quoteId,
  );
}

/* ============================================================
 * IDS
 * ============================================================ */

function generateNextQuoteId() {
  const largestNumber =
    runtimeQuotes.reduce(
      (
        largest,
        quote,
      ) => {
        const match =
          String(
            quote.id ??
              "",
          ).match(
            /^ORC-(\d+)$/i,
          );

        if (
          !match
        ) {
          return largest;
        }

        return Math.max(
          largest,
          Number(
            match[1],
          ),
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

/* ============================================================
 * EQUIPAMENTOS
 * ============================================================ */

function machineIdFromName(
  name,
) {
  if (!name) {
    return null;
  }

  const normalized =
    String(
      name,
    ).toLowerCase();

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
    ) ||
    normalized.includes(
      "o inspect",
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
      "t-scan",
    ) ||
    normalized.includes(
      "t scan",
    )
  ) {
    return "t-scan";
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

/* ============================================================
 * UTILITÁRIOS
 * ============================================================ */

function normalizeText(
  value,
) {
  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return "";
  }

  return String(
    value,
  ).trim();
}

function toNumber(
  value,
) {
  const result =
    Number(
      value,
    );

  return Number.isFinite(
    result,
  )
    ? result
    : 0;
}

/* ============================================================
 * DATAS
 * ============================================================ */

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