import { requiresQuoteEquipment } from "../data/serviceCatalog";
import * as api from "./quoteApi";
import { validationResult } from "./workflowValidation";
import { getQuoteItemsValidation } from "./quoteItemService";
import { getCommercialReference } from "./pricingService";
import { getGeneralSettings } from "./administrationService";
export { validateRequestForQuote } from "./workflowValidation";
const normalizeText = value => typeof value === "string" ? value.trim() : "";
export const quoteStatuses = ["Todos", "Rascunho", "Em elaboração", "Em revisão", "Aprovado internamente", "Enviado", "Aceito", "Recusado", "Cancelado"];
export const getAllQuotes = api.listPersistedQuotes;
export const getQuoteById = api.getPersistedQuote;
export const isArchivedQuote = quote => Boolean(quote.projectId) || ["Recusado", "Cancelado"].includes(quote.status);
export const isQuoteEditable = quote => !!quote && ["Rascunho", "Em elaboração"].includes(quote.status);
export async function getActiveQuotes() { return (await getAllQuotes()).filter(quote => !isArchivedQuote(quote)); }
export async function getArchivedQuotes() { return (await getAllQuotes()).filter(isArchivedQuote); }
export async function updateQuote(quote, patch) { return api.updatePersistedQuote(quote.id, { ...patch, revision: quote.revision }); }
export async function createQuoteFromRequest(request) {
  const reference = getCommercialReference();
  const defaults = getGeneralSettings();
  return api.createPersistedQuote(request.id, { hourlyRate: reference.hourlyRate, referenceId: reference.id, referenceEffectiveFrom: reference.effectiveFrom,
    deadlineDays: defaults.defaultExecutionDeadlineDays, validityDays: defaults.defaultQuoteValidityDays });
}
export const sendQuoteToReview = quote => api.changePersistedQuoteStatus(quote.id, { revision: quote.revision, status: "Em revisão" });
export const approveQuoteInternally = quote => api.changePersistedQuoteStatus(quote.id, { revision: quote.revision, status: "Aprovado internamente" });
export const returnQuoteToEditing = quote => api.changePersistedQuoteStatus(quote.id, { revision: quote.revision, status: "Em elaboração" });
export const cancelQuote = (quote, actor, reason) => api.changePersistedQuoteStatus(quote.id, { revision: quote.revision, status: "Cancelado", reason });
export const getQuoteKnowledgeSupport = () => ({ isDemo: false, historyConnected: false, cases: [] });
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
    requiresQuoteEquipment(quote) && !normalizeText(
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
