import { calculateCommercialTotal, getCommercialReference } from "./pricingService";
import { validationResult } from "./workflowValidation";

// IDs já utilizados pelo configurador. A SOL demo também aceita os rótulos.
export const quoteItemServices = [
  { id: "inspection", name: "Inspeção dimensional" },
  { id: "scanning", name: "Digitalização 3D" },
  { id: "reverse", name: "Engenharia reversa" },
  { id: "internal", name: "Análise interna" },
];

export function getQuoteItemService(value) {
  return quoteItemServices.find(service => service.id === value || service.name === value);
}

const text = value => typeof value === "string" ? value.trim() : "";
const number = value => value === "" || value == null ? null : Number(value);
const nonNegative = value => Number.isFinite(number(value)) && number(value) >= 0;
const positive = value => Number.isFinite(number(value)) && number(value) > 0;

export function createQuoteItem(values = {}, reference = getCommercialReference()) {
  return normalizeQuoteItem({
    ...values,
    id: values.id ?? `ITEM-${crypto.randomUUID()}`,
    commercialRateReference: reference.hourlyRate,
    commercialReferenceId: reference.id,
    commercialReferenceEffectiveFrom: reference.effectiveFrom,
    referenceCapturedAt: new Date().toISOString(),
    hourlyRate: values.hourlyRate ?? reference.hourlyRate,
  });
}

// Lista explícita: custos, margens e objetos de equipamento nunca entram no item.
export function normalizeQuoteItem(item, original = item) {
  const normalized = {
    id: original.id,
    name: text(item.name),
    description: text(item.description),
    serviceId: text(item.serviceId) || null,
    machineId: text(item.machineId) || null,
    requestPieceId: original.requestPieceId ?? null,
    technicalHours: number(item.technicalHours),
    quotedHours: number(item.quotedHours),
    commercialRateReference: number(original.commercialRateReference),
    commercialReferenceId: original.commercialReferenceId ?? null,
    commercialReferenceEffectiveFrom: original.commercialReferenceEffectiveFrom ?? null,
    referenceCapturedAt: original.referenceCapturedAt ?? null,
    hourlyRate: number(item.hourlyRate),
    hourlyRateOverrideReason: text(item.hourlyRateOverrideReason),
    isDemoCompatibility: original.isDemoCompatibility === true,
    // Vínculo futuro ao registro de execução; nenhum resultado é inventado.
    executionRecordId: original.executionRecordId ?? null,
  };
  return Object.freeze({ ...normalized, subtotal: calculateQuoteItemSubtotal(normalized) });
}

export function calculateQuoteItemSubtotal(item) {
  if (!nonNegative(item.quotedHours) || !nonNegative(item.hourlyRate)) return 0;
  const total = calculateCommercialTotal({ billableHours: item.quotedHours, hourlyRate: item.hourlyRate });
  return Number.isFinite(total) ? total : 0;
}

export function calculateQuoteItemTotals(items = []) {
  const totals = items.reduce((sum, item) => ({
    totalTechnicalHours: sum.totalTechnicalHours + (nonNegative(item.technicalHours) ? Number(item.technicalHours) : 0),
    totalQuotedHours: sum.totalQuotedHours + (nonNegative(item.quotedHours) ? Number(item.quotedHours) : 0),
    proposedValue: sum.proposedValue + calculateQuoteItemSubtotal(item),
  }), { totalTechnicalHours: 0, totalQuotedHours: 0, proposedValue: 0 });
  if (items.some(item => !nonNegative(item.technicalHours))) totals.totalTechnicalHours = null;
  if (items.some(item => !nonNegative(item.quotedHours))) totals.totalQuotedHours = null;
  totals.proposedValue = Math.round(totals.proposedValue * 100) / 100;
  return {
    ...totals,
    technicalHours: totals.totalTechnicalHours,
    billableHours: totals.totalQuotedHours,
    // Contrato legado: média ponderada, nunca usada para recalcular o total.
    hourlyRate: totals.totalQuotedHours > 0 ? totals.proposedValue / totals.totalQuotedHours : 0,
  };
}

export function validateQuoteItem(item) {
  return getQuoteItemValidation(item).problems;
}

export function getQuoteItemValidation(item, prefix = "", label = "item") {
  const issues = [];
  const add = (field, message) => issues.push({ code: `item.${field}`, field: `${prefix}${field}`, message });
  if (!text(item.name)) add("name", `Informe o nome do ${label}.`);
  if (number(item.technicalHours) != null && !nonNegative(item.technicalHours)) add("technicalHours", `Informe horas técnicas válidas para o ${label}.`);
  if (!(item.isDemoCompatibility && number(item.quotedHours) == null) && !positive(item.quotedHours)) add("quotedHours", `Informe horas cotadas maiores que zero para o ${label}.`);
  if (!positive(item.hourlyRate)) add("hourlyRate", `Informe valor/hora maior que zero para o ${label}.`);
  if (!positive(item.commercialRateReference)) add("commercialRateReference", `O ${label} precisa de uma referência comercial válida.`);
  if (!Number.isFinite(Number(item.quotedHours) * Number(item.hourlyRate))) add("subtotal", `O subtotal do ${label} deve ser finito.`);
  return validationResult(issues);
}

export function getQuoteItemsValidation(items) {
  if (!Array.isArray(items) || !items.length) return validationResult([{ code: "items.required", field: "items", message: "Adicione ao menos um item válido." }]);
  const issues = items.flatMap((item, index) => getQuoteItemValidation(item, `items.${index}.`, `Item ${index + 1}`).issues);
  const ids = new Set();
  items.forEach((item, index) => {
    if (!item.id || ids.has(item.id)) issues.push({ code: "items.id", field: `items.${index}.id`, message: `O Item ${index + 1} precisa de um identificador único.` });
    ids.add(item.id);
  });
  const totals = calculateQuoteItemTotals(items);
  if (Object.values(totals).some(value => value != null && !Number.isFinite(value))) issues.push({ code: "items.totals", field: "items", message: "Os totais de horas e valores devem ser finitos." });
  return validationResult(issues);
}

export function validateQuoteItems(items) {
  return getQuoteItemsValidation(items).problems;
}
