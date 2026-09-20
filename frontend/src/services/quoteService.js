import { captureRequestPieces, getQuotePieces } from "./quotePieceService";
import { validationResult, validateRequestForQuote } from "./workflowValidation";
import { getAcceptedProposalVersion } from "./proposalService";
import { getGeneralSettings } from "./administrationService";
export { validateRequestForQuote } from "./workflowValidation";
import { getCommercialReference } from "./pricingService";
import {
  calculateQuoteItemTotals,
  createQuoteItem,
  getQuoteItemService,
  normalizeQuoteItem,
  getQuoteItemsValidation,
} from "./quoteItemService";
import {
  quotes,
} from "../data/internal/quotes";

import {
  getService,
} from "../data/serviceCatalog";

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

export function isQuoteEditable(quote) {
  return Boolean(
    quote &&
      EDITABLE_STATUSES.includes(
        quote.status,
      ) &&
      !quote.convertedToProject &&
      !quote.projectId,
  );
}

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

export function isArchivedQuote(
  quote,
) {
  return Boolean(
    quote.convertedToProject ||
      quote.projectId ||
      [
        "Recusado",
        "Cancelado",
      ].includes(
        quote.status,
      ),
  );
}

export function getActiveQuotes() {
  return getRuntimeQuotes().filter(
    (quote) =>
      !isArchivedQuote(
        quote,
      ),
  );
}

export function getArchivedQuotes() {
  return getRuntimeQuotes().filter(
    isArchivedQuote,
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

  if (
    getAcceptedProposalVersion(
      quoteId,
    ) &&
    Object.keys(
      patch,
    ).some(
      (key) =>
        ![
          "projectId",
          "convertedToProject",
        ].includes(
          key,
        ),
    )
  ) {
    throw new Error(
      "Orçamento bloqueado após o aceite da proposta.",
    );
  }

  if (
    Object.hasOwn(
      patch,
      "items",
    )
  ) {
    if (
      !isQuoteEditable(
        quote,
      )
    ) {
      throw new Error(
        "Os itens só podem ser alterados durante a elaboração.",
      );
    }

    if (
      !Array.isArray(
        patch.items,
      )
    ) {
      throw new Error(
        "Composição do orçamento inválida.",
      );
    }

    const ids =
      new Set();

    const items =
      patch.items.map(
        (item) => {
          if (
            !item.id ||
            ids.has(
              item.id,
            )
          ) {
            throw new Error(
              "Cada item deve ter um identificador único.",
            );
          }

          ids.add(
            item.id,
          );

          const original =
            quote.items?.find(
              (existing) =>
                existing.id ===
                item.id,
            );

          const pieces =
            getQuotePieces(
              quote,
            );

          if (
            item.requestPieceId &&
            !pieces.some(
              (piece) =>
                piece.id ===
                item.requestPieceId,
            ) &&
            item.requestPieceId !==
              original?.requestPieceId
          ) {
            throw new Error(
              "Selecione uma peça existente na solicitação.",
            );
          }

          if (
            !original &&
            pieces.length &&
            !item.requestPieceId &&
            getService(
              item.serviceId,
            )?.pieceBased !==
              false
          ) {
            throw new Error(
              "Vincule o novo serviço técnico a uma peça da solicitação.",
            );
          }

          const normalized =
            normalizeQuoteItem(
              item,
              original ?? {
                ...item,
                isDemoCompatibility:
                  false,
              },
            );

          return normalized;
        },
      );

    patch = {
      ...patch,

      items:
        Object.freeze(
          items,
        ),
    };
  }

  const nextItems =
    patch.items ??
    quote.items;

  if (
    Array.isArray(
      nextItems,
    )
  ) {
    patch = {
      ...patch,

      ...calculateQuoteItemTotals(
        nextItems,
      ),
    };
  }

  if (
    patch.status ===
    "Em revisão"
  ) {
    const validation =
      validateQuoteForReview({
        ...quote,
        ...patch,

        status:
          quote.status,
      });

    if (
      !validation.valid
    ) {
      throw new Error(
        `Antes da revisão, preencha: ${validation.problems.join(
          ", ",
        )}.`,
      );
    }
  }

  runtimeQuotes =
    runtimeQuotes.map(
      (item) =>
        item.id ===
        quoteId
          ? {
              ...item,

              ...patch,

              updatedAt:
                formatCurrentDate(),

              modifiedAt:
                new Date().toISOString(),

              revision:
                (item.revision ??
                  0) + 1,
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
  if (!quote) {
    return validationResult([
      {
        code:
          "quote.missing",

        field:
          "id",

        message:
          "Orçamento não encontrado.",
      },
    ]);
  }

  const issues =
    Array.isArray(
      quote.items,
    )
      ? [
          ...getQuoteItemsValidation(
            quote.items,
          ).issues,
        ]
      : [];

  const add = (
    field,
    message,
  ) =>
    issues.push({
      code:
        "quote." +
        field,

      field,

      message,
    });

  if (
    !isQuoteEditable(
      quote,
    )
  ) {
    add(
      "status",
      "Este orçamento não pode ser enviado para revisão neste estado.",
    );
  }

  if (
    !normalizeText(
      quote.scope,
    )
  ) {
    add(
      "scope",
      "Informe o escopo técnico.",
    );
  }

  if (
    !normalizeText(
      quote.machineId,
    )
  ) {
    add(
      "machineId",
      "Selecione a tecnologia de referência.",
    );
  }

  if (
    !normalizeText(
      quote.estimateJustification,
    )
  ) {
    add(
      "estimateJustification",
      "Informe a justificativa técnica da estimativa.",
    );
  }

  const numericFields = [
    [
      "deadlineDays",
      "Informe um prazo de execução maior que zero.",
    ],

    [
      "validityDays",
      "Informe uma validade da proposta maior que zero.",
    ],
  ];

  if (
    !Array.isArray(
      quote.items,
    )
  ) {
    numericFields.push(
      [
        "billableHours",
        "Informe as horas cotadas.",
      ],

      [
        "hourlyRate",
        "Informe o valor/hora.",
      ],

      [
        "proposedValue",
        "Informe o valor da proposta.",
      ],
    );
  }

  for (const [
    field,
    message,
  ] of numericFields) {
    if (
      !Number.isFinite(
        Number(
          quote[field],
        ),
      ) ||
      Number(
        quote[field],
      ) <= 0
    ) {
      add(
        field,
        message,
      );
    }
  }

  return validationResult(
    issues,
  );
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
    ![
      "Em revisão",
      "Aprovado internamente",
    ].includes(
      quote.status,
    )
  ) {
    throw new Error(
      "Somente orçamentos em revisão ou aprovados internamente podem retornar para elaboração.",
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

export function acceptRuntimeQuote() {
  throw new Error(
    "Registre o aceite de uma versão gerada no Proposal Builder.",
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
function createItemsFromRequest(
  request,
  reference,
) {
  const pieces =
    Array.isArray(
      request.piecesData,
    )
      ? request.piecesData
      : [];

  const items = [];
  const createdKeys =
    new Set();

  /*
   * ==========================================================
   * SERVIÇOS DA SOLICITAÇÃO
   * ==========================================================
   *
   * Aqui reunimos:
   *
   * request.service
   * +
   * request.services[]
   *
   * Sempre convertendo aliases antigos para os IDs atuais.
   */

  const requestServiceIds =
    Array.from(
      new Set(
        [
          request.service,

          ...(Array.isArray(
            request.services,
          )
            ? request.services
            : []),
        ]
          .map(
            (value) =>
              getQuoteItemService(
                value,
              )?.id,
          )
          .filter(
            Boolean,
          ),
      ),
    );

  /*
   * Serviços técnicos são associados às peças.
   *
   * Serviços diretos NÃO dependem de uma peça:
   *
   * - failure-analysis
   * - asset-structure
   * - digital-library
   * - maintenance
   * - training
   */

  const requestTechnicalServices =
    requestServiceIds.filter(
      (serviceId) =>
        getService(
          serviceId,
        )?.pieceBased !==
        false,
    );

  const requestDirectServices =
    requestServiceIds.filter(
      (serviceId) =>
        getService(
          serviceId,
        )?.pieceBased ===
        false,
    );

  /*
   * ==========================================================
   * 1. ITENS TÉCNICOS VINCULADOS ÀS PEÇAS
   * ==========================================================
   */

  pieces
    .filter(
      (piece) =>
        normalizeText(
          piece.name,
        ),
    )
    .forEach(
      (
        piece,
        pieceIndex,
      ) => {
        const explicitPieceServices =
          Array.isArray(
            piece.services,
          )
            ? Array.from(
                new Set(
                  piece.services
                    .map(
                      (value) =>
                        getQuoteItemService(
                          value,
                        )?.id,
                    )
                    .filter(
                      Boolean,
                    ),
                ),
              )
            : [];

        /*
         * Quando a peça possui serviços próprios, eles são a
         * fonte principal.
         *
         * Se não possuir, usamos os serviços técnicos gerais
         * da SOL como fallback de compatibilidade.
         *
         * Isso ajuda registros antigos sem perder a regra
         * correta para as novas solicitações.
         */
        const pieceServiceIds =
          explicitPieceServices.length
            ? explicitPieceServices
            : requestTechnicalServices;

        pieceServiceIds.forEach(
          (serviceId) => {
            const service =
              getQuoteItemService(
                serviceId,
              );

            const serviceDefinition =
              getService(
                serviceId,
              );

            /*
             * Serviço direto nunca deve virar item vinculado
             * à peça.
             */
            if (
              !service ||
              serviceDefinition
                ?.pieceBased ===
                false
            ) {
              return;
            }

            const pieceId =
              piece.id ||
              `piece-${pieceIndex + 1}`;

            const key =
              `piece:${pieceId}:${service.id}`;

            if (
              createdKeys.has(
                key,
              )
            ) {
              return;
            }

            createdKeys.add(
              key,
            );

            items.push(
              createQuoteItem(
                {
                  name:
                    `${piece.name} — ${service.name}`,

                  serviceId:
                    service.id,

                  requestPieceId:
                    piece.id ??
                    null,

                  /*
                   * Uma recomendação automática não equivale
                   * a uma escolha técnica confirmada.
                   *
                   * Só usamos machineId se a peça realmente
                   * possuir esse dado persistido.
                   */
                  machineId:
                    piece.machineId ??
                    null,
                },
                reference,
              ),
            );
          },
        );
      },
    );

  /*
   * ==========================================================
   * 2. SERVIÇOS DIRETOS
   * ==========================================================
   *
   * Eles entram UMA única vez no orçamento, mesmo que exista
   * uma ou mais peças auxiliares na solicitação.
   *
   * Exemplo:
   *
   * Análise de falhas
   * +
   * peça com Tomografia
   *
   * ORC:
   *
   * 1. Análise de falhas
   * 2. Peça X — Tomografia industrial
   */

  requestDirectServices.forEach(
    (serviceId) => {
      const service =
        getQuoteItemService(
          serviceId,
        );

      if (!service) {
        return;
      }

      const key =
        `direct:${service.id}`;

      if (
        createdKeys.has(
          key,
        )
      ) {
        return;
      }

      createdKeys.add(
        key,
      );

      items.push(
        createQuoteItem(
          {
            name:
              service.name,

            serviceId:
              service.id,

            requestPieceId:
              null,

            machineId:
              null,
          },
          reference,
        ),
      );
    },
  );

  /*
   * ==========================================================
   * 3. COMPATIBILIDADE COM SOLICITAÇÕES ANTIGAS
   * ==========================================================
   *
   * Alguns mocks antigos possuem serviço técnico, mas não
   * possuem piecesData.
   *
   * Nesse caso ainda precisamos gerar um item para permitir
   * que o orçamento antigo continue funcionando.
   */

  if (
    items.length ===
      0 &&
    requestServiceIds.length >
      0
  ) {
    requestServiceIds.forEach(
      (serviceId) => {
        const service =
          getQuoteItemService(
            serviceId,
          );

        if (!service) {
          return;
        }

        const key =
          `legacy:${service.id}`;

        if (
          createdKeys.has(
            key,
          )
        ) {
          return;
        }

        createdKeys.add(
          key,
        );

        items.push(
          createQuoteItem(
            {
              name:
                service.name,

              serviceId:
                service.id,

              requestPieceId:
                null,
            },
            reference,
          ),
        );
      },
    );
  }

  return items;
}

/* ============================================================
 * CRIAR ORÇAMENTO A PARTIR DA SOL
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

  const validation =
    validateRequestForQuote(
      request,
    );

  if (
    !validation.isValid
  ) {
    throw new Error(
      validation.problems.join(
        " ",
      ),
    );
  }

  const commercialRateReference =
    Object.freeze(
      getCommercialReference(),
    );

  const defaults =
    getGeneralSettings();

  const quoteId =
    generateNextQuoteId();

  const today =
    formatCurrentDate();

  /*
   * ==========================================================
   * SERVIÇO PRINCIPAL
   * ==========================================================
   *
   * A SOL guarda IDs canônicos.
   *
   * O orçamento preserva:
   *
   * serviceId -> contrato interno
   * service   -> nome legível para a interface
   */

  const primaryService =
    getQuoteItemService(
      request.service,
    ) ||
    (Array.isArray(
      request.services,
    )
      ? request.services
          .map(
            getQuoteItemService,
          )
          .find(
            Boolean,
          )
      : null);

  const serviceId =
    primaryService?.id ??
    null;

  const service =
    primaryService?.name ||
    normalizeText(
      request.service,
    ) ||
    "Serviço";

  const services =
    Array.from(
      new Set(
        [
          request.service,

          ...(Array.isArray(
            request.services,
          )
            ? request.services
            : []),
        ]
          .map(
            (value) =>
              getQuoteItemService(
                value,
              )?.id,
          )
          .filter(
            Boolean,
          ),
      ),
    );

  /*
   * ==========================================================
   * EQUIPAMENTO PRELIMINAR
   * ==========================================================
   *
   * Continua sendo apenas referência.
   * A escolha final permanece responsabilidade técnica.
   */

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
      ? defaults.defaultResponsible
      : request.responsible;

  /*
   * Criação feita antes do objeto do orçamento para garantir
   * que todos os totais sejam calculados sobre exatamente a
   * mesma composição.
   */
  const items =
    Object.freeze(
      createItemsFromRequest(
        request,
        commercialRateReference,
      ),
    );

  const quote = {
    id:
      quoteId,

    items,

    /*
     * Snapshot das peças originais.
     *
     * O orçamento não depende de futuras alterações na SOL.
     */
    requestPieces:
      captureRequestPieces(
        request,
      ),

    requestId:
      request.id,

    /*
     * Preservamos também a necessidade que originou a SOL.
     *
     * Isso será útil quando público, cliente e área interna
     * estiverem interligados definitivamente.
     */
    requestNeedId:
      request.requestNeedId ??
      request.project
        ?.requestNeedId ??
      null,

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

    /*
     * Nome legível.
     */
    service,

    /*
     * ID estável.
     */
    serviceId,

    /*
     * Todos os serviços permanecem disponíveis para
     * rastreabilidade.
     */
    services,

    machineId,

    technicalHours:
      0,

    billableHours:
      0,

    commercialRateReference,

    hourlyRate:
      commercialRateReference.hourlyRate,

    internalCost:
      0,

    proposedValue:
      0,

    deadlineDays:
      defaults.defaultExecutionDeadlineDays,

    validityDays:
      defaults.defaultQuoteValidityDays,

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

  Object.assign(
    quote,
    calculateQuoteItemTotals(
      quote.items,
    ),
  );

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

  /*
   * ==========================================================
   * REFERÊNCIA COMERCIAL
   * ==========================================================
   */

  const reference =
    quote.commercialRateReference ??
    initialCommercialReference;

  /*
   * ==========================================================
   * SERVIÇOS
   * ==========================================================
   *
   * Registros antigos podem possuir apenas:
   *
   * service: "Inspeção dimensional"
   *
   * Novos registros passam a possuir também:
   *
   * serviceId: "dimensional"
   * services: ["dimensional", ...]
   *
   * Todos são normalizados aqui para o catálogo atual.
   */

  const serviceCandidates = [
    quote.serviceId,

    quote.service,

    ...(Array.isArray(
      quote.services,
    )
      ? quote.services
      : []),

    ...(Array.isArray(
      quote.items,
    )
      ? quote.items.map(
          (item) =>
            item.serviceId,
        )
      : []),
  ];

  const normalizedServices =
    Array.from(
      new Set(
        serviceCandidates
          .map(
            (value) =>
              getQuoteItemService(
                value,
              )?.id,
          )
          .filter(
            Boolean,
          ),
      ),
    );

  const primaryServiceId =
    getQuoteItemService(
      quote.serviceId,
    )?.id ??
    getQuoteItemService(
      quote.service,
    )?.id ??
    normalizedServices[0] ??
    null;

  const primaryService =
    primaryServiceId
      ? getQuoteItemService(
          primaryServiceId,
        )
      : null;

  /*
   * ==========================================================
   * ITENS
   * ==========================================================
   *
   * Orçamentos antigos não possuíam composição por itens.
   *
   * Nesses casos preservamos o valor histórico e criamos
   * somente um item de compatibilidade demo.
   */

  const items =
    Array.isArray(
      quote.items,
    ) &&
    quote.items.length
      ? quote.items.map(
          (item) =>
            normalizeQuoteItem(
              item,
            ),
        )
      : [
          createQuoteItem(
            {
              id:
                `${quote.id}-ITEM-DEMO`,

              name:
                `${
                  primaryService
                    ?.name ||
                  quote.service ||
                  "Orçamento anterior"
                } — compatibilidade demo`,

              description:
                "Item demo: horas ausentes permanecem desconhecidas; valor histórico preservado separadamente.",

              serviceId:
                primaryServiceId,

              machineId:
                quote.machineId,

              technicalHours:
                quote.technicalHours >
                0
                  ? quote.technicalHours
                  : null,

              quotedHours:
                quote.billableHours >
                0
                  ? quote.billableHours
                  : null,

              hourlyRate:
                quote.hourlyRate ??
                reference.hourlyRate,

              isDemoCompatibility:
                true,
            },
            reference,
          ),
        ];

  /*
   * Os próprios itens também podem revelar serviços que não
   * estavam explicitamente registrados no ORC antigo.
   */

  const itemServices =
    items
      .map(
        (item) =>
          getQuoteItemService(
            item.serviceId,
          )?.id,
      )
      .filter(
        Boolean,
      );

  const allServices =
    Array.from(
      new Set([
        ...normalizedServices,
        ...itemServices,
      ]),
    );

  if (
    primaryServiceId &&
    !allServices.includes(
      primaryServiceId,
    )
  ) {
    allServices.unshift(
      primaryServiceId,
    );
  }

  return {
    ...quote,

    /* ========================================================
     * IDENTIFICAÇÃO DO SERVIÇO
     * ======================================================== */

    serviceId:
      primaryServiceId,

    /*
     * `service` permanece legível para compatibilidade das telas
     * antigas. IDs nunca são exibidos diretamente ao usuário.
     */
    service:
      primaryService
        ?.name ||
      normalizeText(
        quote.service,
      ) ||
      "Serviço",

    services:
      allServices,

    /*
     * Pode não existir em ORCs antigos.
     */
    requestNeedId:
      quote.requestNeedId ??
      null,

    /* ========================================================
     * ORIGEM
     * ======================================================== */

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

    /* ========================================================
     * ESCOPO E ELABORAÇÃO
     * ======================================================== */

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

    /* ========================================================
     * VALORES LEGADOS
     * ======================================================== */

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

    /* ========================================================
     * VERSÕES / APROVAÇÕES
     * ======================================================== */

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

    /* ========================================================
     * REFERÊNCIA COMERCIAL
     * ======================================================== */

    commercialRateReference:
      Object.freeze({
        ...reference,
      }),

    /*
     * Snapshot dos valores existentes antes da composição
     * detalhada por itens.
     */
    legacyEstimate:
      quote.legacyEstimate ??
      Object.freeze({
        technicalHours:
          quote.technicalHours,

        billableHours:
          quote.billableHours,

        hourlyRate:
          quote.hourlyRate,

        proposedValue:
          quote.proposedValue,
      }),

    /*
     * A composição passa a ser a fonte de verdade dos totais
     * dos novos orçamentos.
     */
    items:
      Object.freeze(
        items,
      ),

    ...calculateQuoteItemTotals(
      items,
    ),

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
    items:
      Object.freeze(
        (
          quote.items ??
          []
        ).map(
          (item) =>
            normalizeQuoteItem(
              item,
            ),
        ),
      ),

    totalTechnicalHours:
      quote.totalTechnicalHours,

    totalQuotedHours:
      quote.totalQuotedHours,

    id:
      `EST-${String(
        (quote
          .estimateVersions
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

    /*
     * Preservamos também a classificação dos serviços dentro
     * da versão para rastreabilidade da estimativa.
     */
    serviceId:
      quote.serviceId ??
      null,

    services:
      Array.isArray(
        quote.services,
      )
        ? [
            ...quote.services,
          ]
        : [],

    machineId:
      quote.machineId,

    technicalHours:
      quote.technicalHours ??
      null,

    billableHours:
      quote.billableHours ??
      null,

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

  if (
    getAcceptedProposalVersion(
      quoteId,
    ) &&
    Object.keys(
      patch,
    ).length
  ) {
    throw new Error(
      "Orçamento bloqueado após o aceite da proposta.",
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

              modifiedAt:
                now.toISOString(),

              revision:
                (item.revision ??
                  0) + 1,

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

        if (!match) {
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