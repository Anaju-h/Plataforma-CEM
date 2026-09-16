import { validateRequestForQuote } from "./workflowValidation";
import {
  requests as baseRequests,
} from "../data/internal/requests";

/* ============================================================
 * CONFIGURAÇÃO
 * ============================================================ */

const DEFAULT_ACTOR =
  "Administrador";

const CLOSED_STATUSES = [
  "Convertida em orçamento",
  "Recusada",
  "Cancelada",
];

/*
 * REPOSITÓRIO TEMPORÁRIO EM MEMÓRIA
 *
 * Enquanto o backend não existe, as solicitações são mantidas
 * durante a execução da aplicação.
 *
 * O arquivo requests.js fornece somente a base inicial/demo.
 *
 * Futuramente esta implementação será substituída pela API,
 * mantendo as páginas consumindo este service.
 */

let runtimeRequests =
  baseRequests.map(
    normalizeRequest,
  );

/* ============================================================
 * CONSULTAS
 * ============================================================ */

export function getRuntimeRequests() {
  return runtimeRequests.map(
    cloneRequest,
  );
}

export function getRequests() {
  return getRuntimeRequests();
}

export function getAllRequests() {
  return getRuntimeRequests();
}

export function getRuntimeRequestById(
  requestId,
) {
  const request =
    runtimeRequests.find(
      (item) =>
        item.id ===
        requestId,
    );

  return request
    ? cloneRequest(
        request,
      )
    : null;
}

export function isArchivedRequest(request) { return Boolean(request.linkedQuoteId || CLOSED_STATUSES.includes(request.status)); }
export function getActiveRequests() { return getRuntimeRequests().filter(request => !isArchivedRequest(request)); }
export function getArchivedRequests() { return getRuntimeRequests().filter(isArchivedRequest); }

export function getOpenRuntimeRequests() {
  return runtimeRequests
    .filter(
      (request) =>
        !CLOSED_STATUSES.includes(
          request.status,
        ),
    )
    .map(
      cloneRequest,
    );
}

/* ============================================================
 * CRIAÇÃO DE SOLICITAÇÃO INTERNA
 * ============================================================ */

export function createRuntimeRequest(
  payload,
  actor = DEFAULT_ACTOR,
) {
  const contact =
    payload?.contact ??
    {};

  const project =
    payload?.project ??
    {};

  const internal =
    payload?.internal ??
    {};

  const pieces =
    Array.isArray(
      payload?.pieces,
    )
      ? payload.pieces
      : [];

  const now =
    new Date();

  const requestId =
    createNextRequestId();

  const services =
    Array.from(
      new Set(
        pieces.flatMap(
          (piece) =>
            Array.isArray(
              piece.services,
            )
              ? piece.services
              : [],
        ),
      ),
    );

  const totalParts =
    pieces.reduce(
      (
        total,
        piece,
      ) =>
        total +
        Number(
          piece.quantity ||
            0,
        ),
      0,
    );

  const historyEvent = {
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
      "Solicitação criada",

    actor,

    description:
      `Solicitação registrada internamente por meio do canal ${
        internal.channel ||
        "não informado"
      }.`,
  };

  const request = {
    id:
      requestId,

    /*
     * Ainda não existe persistência no backend.
     *
     * Por isso, registros criados nesta fase continuam
     * classificados como demonstração.
     */
    source:
      "demo",

    visibility:
      "internal",

    origin:
      "Interno",

    channel:
      normalizeText(
        internal.channel,
      ) ||
      "Registro interno",

    company:
      normalizeText(
        contact.company,
      ) ||
      "Empresa não informada",

    contact:
      normalizeText(
        contact.name,
      ) ||
      "Contato não informado",

    email:
      normalizeText(
        contact.email,
      ),

    phone:
      normalizeText(
        contact.phone,
      ),

    service:
      services[0] ||
      "Não definido",

    services,

    createdAt:
      historyEvent.date,

    updatedAt:
      historyEvent.date,

    status:
      "Nova",

    priority:
      mapUrgencyToPriority(
        project.urgency,
      ),

    responsible:
      "Não atribuído",

    parts:
      totalParts,

    objective:
      normalizeText(
        project.objective,
      ),

    comments:
      normalizeText(
        project.observations,
      ),

    internalNotes:
      normalizeText(
        internal.channelDetails,
      ),

    customer: {
      department:
        normalizeText(
          internal.department,
        ),

      company:
        normalizeText(
          contact.company,
        ),

      contact:
        normalizeText(
          contact.name,
        ),

      email:
        normalizeText(
          contact.email,
        ),

      phone:
        normalizeText(
          contact.phone,
        ),
    },

    project: {
      urgency:
        project.urgency ||
        "normal",

      deadlineType:
        project.deadlineType ||
        "noUrgency",

      specificDate:
        project.specificDate ||
        "",

      observations:
        normalizeText(
          project.observations,
        ),
    },

    piecesData:
      pieces.map(
        mapFormPieceToRequestPiece,
      ),

    attachments:
      normalizeFiles(
        project.generalFiles,
      ),

    linkedQuoteId:
      null,

    convertedAt:
      null,

    cancellation:
      null,

    analysis: {
      status:
        "not-started",

      responsible:
        "Não atribuído",

      startedAt:
        null,

      resumedAt:
        null,

      completedAt:
        null,

      updatedAt:
        null,

      updatedBy:
        null,

      technicalSummary:
        "",

      pendingInformation:
        "",

      decisionReason:
        "",

      recommendedService:
        services[0] ||
        "",

      recommendedEquipment:
        "",

      knowledgeTags:
        [],

      result:
        null,
    },

    history: [
      historyEvent,
    ],
  };

  runtimeRequests = [
    request,
    ...runtimeRequests,
  ];

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * ATUALIZAÇÃO GENÉRICA
 * ============================================================ */

export function updateRuntimeRequest(
  requestId,
  changes = {},
) {
  const request =
    findRequestOrThrow(
      requestId,
    );

  Object.assign(
    request,
    changes,
  );

  touchRequest(
    request,
  );

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * RESPONSÁVEL
 * ============================================================ */

export function assignRequestResponsible(
  requestId,
  responsible,
  actor = DEFAULT_ACTOR,
) {
  const request =
    findRequestOrThrow(
      requestId,
    );

  ensureRequestIsOpen(
    request,
  );

  const normalizedResponsible =
    normalizeText(
      responsible,
    );

  if (
    !normalizedResponsible
  ) {
    throw new Error(
      "Informe o responsável pela solicitação.",
    );
  }

  request.responsible =
    normalizedResponsible;

  request.analysis = {
    ...createDefaultAnalysis(
      request,
    ),
    ...request.analysis,

    responsible:
      normalizedResponsible,

    updatedAt:
      new Date().toISOString(),

    updatedBy:
      actor,
  };

  addHistory(
    request,
    {
      action:
        "Responsável definido",

      actor,

      description:
        `${normalizedResponsible} foi definido como responsável pela solicitação.`,
    },
  );

  touchRequest(
    request,
  );

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * INICIAR ANÁLISE
 * ============================================================ */

export function startRequestAnalysis(
  requestId,
  actor = DEFAULT_ACTOR,
) {
  const request =
    findRequestOrThrow(
      requestId,
    );

  ensureRequestIsOpen(
    request,
  );

  if (
    request.status ===
    "Em análise"
  ) {
    return cloneRequest(
      request,
    );
  }

  const now =
    new Date();

  request.status =
    "Em análise";

  request.responsible =
    actor;

  request.analysis = {
    ...createDefaultAnalysis(
      request,
    ),
    ...request.analysis,

    status:
      "in-progress",

    responsible:
      actor,

    startedAt:
      request.analysis
        ?.startedAt ||
      now.toISOString(),

    resumedAt:
      null,

    completedAt:
      null,

    updatedAt:
      now.toISOString(),

    updatedBy:
      actor,
  };

  addHistory(
    request,
    {
      action:
        "Análise iniciada",

      actor,

      description:
        `${actor} iniciou a avaliação técnica da solicitação.`,
    },
  );

  touchRequest(
    request,
    now,
  );

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * RETOMAR ANÁLISE
 * ============================================================ */

export function resumeRequestAnalysis(
  requestId,
  actor = DEFAULT_ACTOR,
) {
  const request =
    findRequestOrThrow(
      requestId,
    );

  ensureRequestIsOpen(
    request,
  );

  const now =
    new Date();

  request.status =
    "Em análise";

  request.responsible =
    actor;

  request.analysis = {
    ...createDefaultAnalysis(
      request,
    ),
    ...request.analysis,

    status:
      "in-progress",

    responsible:
      actor,

    startedAt:
      request.analysis
        ?.startedAt ||
      now.toISOString(),

    resumedAt:
      now.toISOString(),

    completedAt:
      null,

    updatedAt:
      now.toISOString(),

    updatedBy:
      actor,
  };

  addHistory(
    request,
    {
      action:
        "Análise retomada",

      actor,

      description:
        `${actor} retomou a avaliação técnica da solicitação.`,
    },
  );

  touchRequest(
    request,
    now,
  );

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * SALVAR ANÁLISE TÉCNICA
 * ============================================================ */

export function saveRequestTechnicalAnalysis(
  requestId,
  analysisData = {},
  actor = DEFAULT_ACTOR,
) {
  const request =
    findRequestOrThrow(
      requestId,
    );

  ensureRequestIsOpen(
    request,
  );

  const now =
    new Date();

  request.analysis = {
    ...createDefaultAnalysis(
      request,
    ),
    ...request.analysis,

    technicalSummary:
      normalizeText(
        analysisData
          .technicalSummary,
      ),

    pendingInformation:
      normalizeText(
        analysisData
          .pendingInformation,
      ),

    decisionReason:
      normalizeText(
        analysisData
          .decisionReason,
      ),

    recommendedService:
      normalizeText(
        analysisData
          .recommendedService,
      ),

    recommendedEquipment:
      normalizeText(
        analysisData
          .recommendedEquipment,
      ),

    knowledgeTags:
      normalizeStringArray(
        analysisData
          .knowledgeTags,
      ),

    updatedAt:
      now.toISOString(),

    updatedBy:
      actor,
  };

  addHistory(
    request,
    {
      action:
        "Análise técnica atualizada",

      actor,

      description:
        "Os dados da análise técnica foram atualizados.",
    },
  );

  touchRequest(
    request,
    now,
  );

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * CONCLUIR ANÁLISE
 *
 * Compatível com:
 *
 * finishRequestAnalysis(id, "quote-ready", actor)
 *
 * e:
 *
 * finishRequestAnalysis(
 *   id,
 *   {
 *     result: "quote-ready",
 *     technicalSummary: "...",
 *   },
 *   actor
 * )
 * ============================================================ */

export function finishRequestAnalysis(
  requestId,
  analysisData = {},
  actor = DEFAULT_ACTOR,
) {
  const request =
    findRequestOrThrow(
      requestId,
    );

  ensureRequestIsOpen(
    request,
  );

  const payload =
    typeof analysisData ===
    "string"
      ? {
          result:
            analysisData,
        }
      : {
          ...analysisData,
        };

  const currentAnalysis = {
    ...createDefaultAnalysis(
      request,
    ),
    ...request.analysis,
  };

  const result =
    normalizeAnalysisResult(
      payload.result,
    );

  if (!result) {
    throw new Error(
      "Informe o resultado da análise.",
    );
  }

  const technicalSummary =
    normalizeText(
      payload
        .technicalSummary ??
        currentAnalysis
          .technicalSummary,
    );

  const pendingInformation =
    normalizeText(
      payload
        .pendingInformation ??
        currentAnalysis
          .pendingInformation,
    );

  const decisionReason =
    normalizeText(
      payload
        .decisionReason ??
        currentAnalysis
          .decisionReason,
    );

  if (
    !technicalSummary
  ) {
    throw new Error(
      "Preencha o resumo técnico antes de concluir a análise.",
    );
  }

  if (
    result ===
      "waiting-information" &&
    !pendingInformation
  ) {
    throw new Error(
      "Informe quais informações ainda são necessárias.",
    );
  }

  if (
    result ===
      "rejected" &&
    !decisionReason
  ) {
    throw new Error(
      "Informe o motivo da recusa.",
    );
  }

  const now =
    new Date();

  request.status =
    mapAnalysisResultToStatus(
      result,
    );

  request.responsible =
    currentAnalysis
      .responsible ||
    actor;

  request.analysis = {
    ...currentAnalysis,

    technicalSummary,

    pendingInformation,

    decisionReason,

    recommendedService:
      normalizeText(
        payload
          .recommendedService ??
          currentAnalysis
            .recommendedService,
      ),

    recommendedEquipment:
      normalizeText(
        payload
          .recommendedEquipment ??
          currentAnalysis
            .recommendedEquipment,
      ),

    knowledgeTags:
      normalizeStringArray(
        payload
          .knowledgeTags ??
          currentAnalysis
            .knowledgeTags,
      ),

    result,

    status:
      result ===
      "waiting-information"
        ? "waiting-information"
        : "completed",

    completedAt:
      result ===
      "waiting-information"
        ? null
        : now.toISOString(),

    updatedAt:
      now.toISOString(),

    updatedBy:
      actor,
  };

  addHistory(
    request,
    {
      action:
        getAnalysisHistoryAction(
          result,
        ),

      actor,

      description:
        getAnalysisHistoryDescription(
          result,
          {
            technicalSummary,
            pendingInformation,
            decisionReason,
          },
        ),
    },
  );

  touchRequest(
    request,
    now,
  );

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * NOTAS INTERNAS
 * ============================================================ */

export function saveRequestInternalNotes(
  requestId,
  notes,
  actor = DEFAULT_ACTOR,
) {
  const request =
    findRequestOrThrow(
      requestId,
    );

  ensureRequestIsOpen(
    request,
  );

  const normalizedNotes =
    normalizeText(
      notes,
    );

  request.internalNotes =
    normalizedNotes;

  addHistory(
    request,
    {
      action:
        "Notas internas atualizadas",

      actor,

      description:
        normalizedNotes
          ? "As observações internas da solicitação foram atualizadas."
          : "As observações internas da solicitação foram removidas.",
    },
  );

  touchRequest(
    request,
  );

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * CANCELAMENTO
 * ============================================================ */

export function cancelRuntimeRequest(
  requestId,
  reason = "",
  actor = DEFAULT_ACTOR,
) {
  const request =
    findRequestOrThrow(
      requestId,
    );

  if (
    request.status ===
    "Convertida em orçamento"
  ) {
    throw new Error(
      "Uma solicitação já convertida em orçamento não pode ser cancelada.",
    );
  }

  if (
    request.status ===
    "Cancelada"
  ) {
    return cloneRequest(
      request,
    );
  }

  const now =
    new Date();

  const normalizedReason =
    normalizeText(
      reason,
    );

  request.status =
    "Cancelada";

  request.cancellation = {
    reason:
      normalizedReason,

    cancelledAt:
      now.toISOString(),

    cancelledBy:
      actor,
  };

  request.analysis = {
    ...createDefaultAnalysis(
      request,
    ),
    ...request.analysis,

    status:
      "cancelled",

    updatedAt:
      now.toISOString(),

    updatedBy:
      actor,
  };

  addHistory(
    request,
    {
      action:
        "Solicitação cancelada",

      actor,

      description:
        normalizedReason ||
        "A solicitação foi cancelada.",
    },
  );

  touchRequest(
    request,
    now,
  );

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * CONVERSÃO EM ORÇAMENTO
 * ============================================================ */

export function markRequestAsConverted(
  requestId,
  quoteId,
  actor = DEFAULT_ACTOR,
) {
  const request =
    findRequestOrThrow(
      requestId,
    );

  if (
    request.status ===
    "Convertida em orçamento"
  ) {
    return cloneRequest(
      request,
    );
  }

  const validation = validateRequestForQuote(request);
  if (!validation.isValid) throw new Error(validation.problems.join(" "));

  const normalizedQuoteId =
    normalizeText(
      quoteId,
    );

  if (
    !normalizedQuoteId
  ) {
    throw new Error(
      "O orçamento vinculado não foi informado.",
    );
  }

  const now =
    new Date();

  request.status =
    "Convertida em orçamento";

  request.linkedQuoteId =
    normalizedQuoteId;

  request.convertedAt =
    now.toISOString();

  request.analysis = {
    ...createDefaultAnalysis(
      request,
    ),
    ...request.analysis,

    status:
      "completed",

    result:
      request.analysis
        ?.result ||
      "quote-ready",

    completedAt:
      request.analysis
        ?.completedAt ||
      now.toISOString(),

    updatedAt:
      now.toISOString(),

    updatedBy:
      actor,
  };

  addHistory(
    request,
    {
      action:
        "Convertida em orçamento",

      actor,

      description:
        `A solicitação foi vinculada ao orçamento ${normalizedQuoteId}.`,
    },
  );

  touchRequest(
    request,
    now,
  );

  return cloneRequest(
    request,
  );
}

/* ============================================================
 * RESET DOS DADOS RUNTIME
 * ============================================================ */

export function resetRuntimeRequests() {
  runtimeRequests =
    baseRequests.map(
      normalizeRequest,
    );

  return getRuntimeRequests();
}

/* ============================================================
 * NORMALIZAÇÃO DOS MOCKS EXISTENTES
 * ============================================================ */

function normalizeRequest(
  rawRequest,
) {
  const request =
    cloneRequest(
      rawRequest,
    );

  const originalOrigin =
    normalizeText(
      request.origin,
    );

  const normalizedSource =
    normalizeSource(
      request.source,
    );

  const normalizedOrigin =
    normalizeOrigin(
      originalOrigin,
    );

  const normalizedChannel =
    normalizeChannel(
      request.channel,
      originalOrigin,
      normalizedOrigin,
    );

  const linkedQuoteId =
    normalizeText(
      request.linkedQuoteId,
    ) ||
    inferLinkedQuoteId(
      request,
    );

  return {
    ...request,

    source:
      normalizedSource,

    visibility:
      normalizeText(
        request.visibility,
      ) ||
      "internal",

    origin:
      normalizedOrigin,

    channel:
      normalizedChannel,

    company:
      normalizeText(
        request.company,
      ) ||
      "Empresa não informada",

    contact:
      normalizeText(
        request.contact,
      ) ||
      "Contato não informado",

    email:
      normalizeText(
        request.email,
      ),

    phone:
      normalizeText(
        request.phone,
      ),

    service:
      normalizeText(
        request.service,
      ) ||
      "Não definido",

    services:
      normalizeServices(
        request,
      ),

    status:
      normalizeText(
        request.status,
      ) ||
      "Nova",

    priority:
      normalizeText(
        request.priority,
      ) ||
      "Normal",

    responsible:
      normalizeText(
        request.responsible,
      ) ||
      "Não atribuído",

    parts:
      Number(
        request.parts ||
          0,
      ),

    objective:
      normalizeText(
        request.objective,
      ),

    comments:
      normalizeText(
        request.comments,
      ),

    internalNotes:
      normalizeText(
        request.internalNotes,
      ),

    linkedQuoteId:
      linkedQuoteId ||
      null,

    convertedAt:
      request.convertedAt ||
      null,

    cancellation:
      request.cancellation ||
      null,

    analysis:
      normalizeAnalysis(
        request,
      ),

    history:
      Array.isArray(
        request.history,
      )
        ? request.history
        : [],
  };
}

function normalizeSource(
  source,
) {
  const normalized =
    normalizeText(
      source,
    ).toLowerCase();

  if (
    normalized ===
      "real"
  ) {
    return "real";
  }

  return "demo";
}

function normalizeOrigin(
  origin,
) {
  const normalized =
    normalizeText(
      origin,
    ).toLowerCase();

  if (
    normalized ===
      "cliente" ||
    normalized ===
      "área do cliente" ||
    normalized ===
      "area do cliente"
  ) {
    return "Cliente";
  }

  if (
    normalized ===
      "interno" ||
    normalized ===
      "registro interno"
  ) {
    return "Interno";
  }

  /*
   * Os mocks antigos utilizavam Configurador/Formulário
   * como origem. Conceitualmente esses valores representam
   * canais da área pública.
   */
  return "Público";
}

function normalizeChannel(
  channel,
  originalOrigin,
  normalizedOrigin,
) {
  const existingChannel =
    normalizeText(
      channel,
    );

  if (
    existingChannel
  ) {
    return existingChannel;
  }

  const original =
    normalizeText(
      originalOrigin,
    ).toLowerCase();

  if (
    original ===
    "configurador"
  ) {
    return "Configurador";
  }

  if (
    original ===
      "formulário" ||
    original ===
      "formulario"
  ) {
    return "Formulário público";
  }

  if (
    normalizedOrigin ===
    "Cliente"
  ) {
    return "Área do cliente";
  }

  if (
    normalizedOrigin ===
    "Interno"
  ) {
    return "Registro interno";
  }

  return "Formulário público";
}

function normalizeServices(
  request,
) {
  if (
    Array.isArray(
      request.services,
    ) &&
    request.services.length >
      0
  ) {
    return normalizeStringArray(
      request.services,
    );
  }

  const service =
    normalizeText(
      request.service,
    );

  return service
    ? [
        service,
      ]
    : [];
}

function normalizeAnalysis(
  request,
) {
  const defaults =
    createDefaultAnalysis(
      request,
    );

  const current =
    request.analysis &&
    typeof request.analysis ===
      "object"
      ? request.analysis
      : {};

  let inferredStatus =
    current.status ||
    defaults.status;

  if (
    request.status ===
    "Em análise"
  ) {
    inferredStatus =
      "in-progress";
  }

  if (
    request.status ===
    "Aguardando informações"
  ) {
    inferredStatus =
      "waiting-information";
  }

  if (
    request.status ===
      "Apta para orçamento" ||
    request.status ===
      "Convertida em orçamento" ||
    request.status ===
      "Recusada"
  ) {
    inferredStatus =
      "completed";
  }

  if (
    request.status ===
    "Cancelada"
  ) {
    inferredStatus =
      "cancelled";
  }

  return {
    ...defaults,
    ...current,

    status:
      inferredStatus,

    responsible:
      normalizeText(
        current.responsible,
      ) ||
      normalizeText(
        request.responsible,
      ) ||
      "Não atribuído",

    technicalSummary:
      normalizeText(
        current
          .technicalSummary,
      ),

    pendingInformation:
      normalizeText(
        current
          .pendingInformation,
      ),

    decisionReason:
      normalizeText(
        current
          .decisionReason,
      ),

    recommendedService:
      normalizeText(
        current
          .recommendedService,
      ) ||
      request.services?.[0] ||
      request.service ||
      "",

    recommendedEquipment:
      normalizeText(
        current
          .recommendedEquipment,
      ) ||
      getConfiguratorEquipment(
        request,
      ),

    knowledgeTags:
      normalizeStringArray(
        current
          .knowledgeTags,
      ),
  };
}

function getConfiguratorEquipment(
  request,
) {
  return normalizeText(
    request
      ?.configurator
      ?.primaryMachine,
  );
}

function inferLinkedQuoteId(
  request,
) {
  if (
    request.status !==
    "Convertida em orçamento"
  ) {
    return "";
  }

  const searchableText = [
    request.internalNotes,
    request.comments,
    ...(Array.isArray(
      request.history,
    )
      ? request.history.flatMap(
          (item) => [
            item.action,
            item.description,
          ],
        )
      : []),
  ]
    .filter(
      Boolean,
    )
    .join(
      " ",
    );

  const match =
    searchableText.match(
      /\bORC-\d+\b/i,
    );

  return match
    ? match[0].toUpperCase()
    : "";
}

/* ============================================================
 * HELPERS — SOLICITAÇÃO
 * ============================================================ */

function findRequestOrThrow(
  requestId,
) {
  const request =
    runtimeRequests.find(
      (item) =>
        item.id ===
        requestId,
    );

  if (!request) {
    throw new Error(
      "Solicitação não encontrada.",
    );
  }

  return request;
}

function ensureRequestIsOpen(
  request,
) {
  if (
    CLOSED_STATUSES.includes(
      request.status,
    )
  ) {
    throw new Error(
      "Esta solicitação já está encerrada e não pode ser alterada.",
    );
  }
}

function touchRequest(
  request,
  date = new Date(),
) {
  request.updatedAt =
    formatDate(
      date,
    );
}

/* ============================================================
 * HELPERS — ANÁLISE
 * ============================================================ */

function createDefaultAnalysis(
  request,
) {
  return {
    status:
      "not-started",

    responsible:
      normalizeText(
        request?.responsible,
      ) ||
      "Não atribuído",

    startedAt:
      null,

    resumedAt:
      null,

    completedAt:
      null,

    updatedAt:
      null,

    updatedBy:
      null,

    technicalSummary:
      "",

    pendingInformation:
      "",

    decisionReason:
      "",

    recommendedService:
      request?.services?.[0] ||
      request?.service ||
      "",

    recommendedEquipment:
      "",

    knowledgeTags:
      [],

    result:
      null,
  };
}

function normalizeAnalysisResult(
  result,
) {
  const normalized =
    normalizeText(
      result,
    )
      .toLowerCase()
      .replace(
        /_/g,
        "-",
      );

  const aliases = {
    "quote-ready":
      "quote-ready",

    approved:
      "quote-ready",

    apta:
      "quote-ready",

    "apta para orçamento":
      "quote-ready",

    "waiting-information":
      "waiting-information",

    "awaiting-information":
      "waiting-information",

    pending:
      "waiting-information",

    "aguardando informações":
      "waiting-information",

    rejected:
      "rejected",

    refused:
      "rejected",

    recusada:
      "rejected",
  };

  return (
    aliases[
      normalized
    ] ||
    null
  );
}

function mapAnalysisResultToStatus(
  result,
) {
  switch (
    result
  ) {
    case "quote-ready":
      return "Apta para orçamento";

    case "waiting-information":
      return "Aguardando informações";

    case "rejected":
      return "Recusada";

    default:
      return "Em análise";
  }
}

function getAnalysisHistoryAction(
  result,
) {
  switch (
    result
  ) {
    case "quote-ready":
      return "Análise concluída";

    case "waiting-information":
      return "Informações solicitadas";

    case "rejected":
      return "Solicitação recusada";

    default:
      return "Análise atualizada";
  }
}

function getAnalysisHistoryDescription(
  result,
  analysisData,
) {
  const reason =
    normalizeText(
      analysisData
        .decisionReason,
    );

  switch (
    result
  ) {
    case "quote-ready":
      return reason
        ? `Solicitação considerada apta para orçamento. ${reason}`
        : "Solicitação considerada apta para orçamento.";

    case "waiting-information": {
      const pending =
        normalizeText(
          analysisData
            .pendingInformation,
        );

      return pending
        ? `A análise depende de informações adicionais: ${pending}`
        : "A análise depende de informações adicionais do solicitante.";
    }

    case "rejected":
      return reason
        ? `Solicitação recusada. ${reason}`
        : "Solicitação recusada após análise técnica.";

    default:
      return "A análise técnica da solicitação foi atualizada.";
  }
}

/* ============================================================
 * HELPERS — HISTÓRICO
 * ============================================================ */

function addHistory(
  request,
  {
    action,
    actor,
    description,
  },
) {
  const now =
    new Date();

  if (
    !Array.isArray(
      request.history,
    )
  ) {
    request.history =
      [];
  }

  request.history.push(
    {
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

      action,

      actor:
        actor ||
        DEFAULT_ACTOR,

      description:
        description ||
        "",
    },
  );
}

function createHistoryId() {
  return `hist-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

/* ============================================================
 * HELPERS — CRIAÇÃO
 * ============================================================ */

function createNextRequestId() {
  const highestNumber =
    runtimeRequests.reduce(
      (
        highest,
        request,
      ) => {
        const match =
          String(
            request.id ||
              "",
          ).match(
            /^SOL-(\d+)$/i,
          );

        if (!match) {
          return highest;
        }

        return Math.max(
          highest,
          Number(
            match[1],
          ),
        );
      },
      0,
    );

  return `SOL-${String(
    highestNumber + 1,
  ).padStart(
    4,
    "0",
  )}`;
}

function mapFormPieceToRequestPiece(
  piece,
  index,
) {
  return {
    id:
      piece.id ||
      `piece-${String(
        index + 1,
      ).padStart(
        2,
        "0",
      )}`,

    name:
      normalizeText(
        piece.name,
      ) ||
      `Peça ${index + 1}`,

    quantity:
      Number(
        piece.quantity ||
          1,
      ),

    type:
      "Peça individual",

    material:
      normalizeText(
        piece.material,
      ) ||
      "Não informado",

    dimensions:
      formatPieceDimensions(
        piece,
      ),

    location:
      getPieceLocation(
        piece,
      ),

    services:
      normalizeStringArray(
        piece.services,
      ),

    requirements: {
      inspectionOptions:
        normalizeStringArray(
          piece
            .inspectionOptions,
        ),

      scanningOptions:
        normalizeStringArray(
          piece
            .scanningOptions,
        ),

      reverseOptions:
        normalizeStringArray(
          piece
            .reverseOptions,
        ),

      internalOptions:
        normalizeStringArray(
          piece
            .internalOptions,
        ),

      movable:
        normalizeText(
          piece.movable,
        ),

      surroundingAccess:
        normalizeText(
          piece
            .surroundingAccess,
        ),

      locationNotes:
        normalizeText(
          piece
            .locationNotes,
        ),
    },

    recommendation:
      null,
  };
}

function formatPieceDimensions(
  piece,
) {
  const values = [
    piece.length,
    piece.width,
    piece.height,
  ];

  if (
    values.every(
      (value) =>
        value ===
          "" ||
        value ===
          null ||
        value ===
          undefined,
    )
  ) {
    return "Não informadas";
  }

  const unit =
    piece.unit ||
    "mm";

  return `${piece.length || "?"} × ${piece.width || "?"} × ${
    piece.height || "?"
  } ${unit}`;
}

function getPieceLocation(
  piece,
) {
  if (
    piece.externalService
  ) {
    const city =
      normalizeText(
        piece.locationCity,
      );

    const state =
      normalizeText(
        piece.locationState,
      );

    const location =
      [
        city,
        state,
      ]
        .filter(
          Boolean,
        )
        .join(
          " - ",
        );

    return location
      ? `Atendimento externo · ${location}`
      : "Atendimento externo";
  }

  return "Pode ser levada ao Centro";
}

function normalizeFiles(
  files,
) {
  if (
    !Array.isArray(
      files,
    )
  ) {
    return [];
  }

  return files.map(
    (
      file,
      index,
    ) => ({
      id:
        `att-${Date.now()}-${index}`,

      name:
        file?.name ||
        `Arquivo ${index + 1}`,

      type:
        file?.type ||
        "Arquivo",

      size:
        formatFileSize(
          file?.size,
        ),
    }),
  );
}

function formatFileSize(
  bytes,
) {
  const value =
    Number(
      bytes,
    );

  if (
    !Number.isFinite(
      value,
    ) ||
    value <= 0
  ) {
    return "Tamanho não informado";
  }

  if (
    value >=
    1024 * 1024
  ) {
    return `${(
      value /
      (1024 * 1024)
    ).toFixed(
      1,
    )} MB`;
  }

  return `${Math.ceil(
    value /
      1024,
  )} KB`;
}

function mapUrgencyToPriority(
  urgency,
) {
  switch (
    urgency
  ) {
    case "urgent":
      return "Urgente";

    case "priority":
      return "Prioritária";

    default:
      return "Normal";
  }
}

/* ============================================================
 * HELPERS — DADOS
 * ============================================================ */

function normalizeStringArray(
  values,
) {
  if (
    !Array.isArray(
      values,
    )
  ) {
    return [];
  }

  return values
    .map(
      normalizeText,
    )
    .filter(
      Boolean,
    );
}

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

function cloneRequest(
  request,
) {
  if (
    typeof structuredClone ===
    "function"
  ) {
    return structuredClone(
      request,
    );
  }

  return JSON.parse(
    JSON.stringify(
      request,
    ),
  );
}

/* ============================================================
 * HELPERS — DATA
 * ============================================================ */

function formatDate(
  date,
) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric",
    },
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

      hour12:
        false,
    },
  ).format(
    date,
  );
}