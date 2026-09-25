import {
  getMachineCostKnowledge,
  initialCommercialReference,
} from "../data/internal/pricingKnowledge";
import { persistSetting } from "./settingsApi";

/*
 * ============================================================
 * SERVIÇO TEMPORÁRIO DE PRECIFICAÇÃO
 * ============================================================
 *
 * Esta camada representa o comportamento que futuramente
 * ficará no backend e no banco.
 *
 * Atualmente controla:
 *
 * - referência comercial vigente;
 * - histórico de alterações;
 * - contexto de custo das máquinas;
 * - cálculos de apoio à precificação.
 *
 * IMPORTANTE:
 *
 * A referência comercial NÃO é preço obrigatório.
 * O custo técnico NÃO é preço de venda.
 *
 * O responsável pelo orçamento continua sendo quem define
 * valor/hora e quantidade de horas cobradas.
 * ============================================================
 */

/*
 * ============================================================
 * REFERÊNCIA COMERCIAL VIGENTE
 * ============================================================
 */

// Histórico de referências: carregado do banco na entrada do portal e gravado a cada alteração.
const sessionStartedAt = new Date().toISOString();
let commercialReferences = [{
  ...initialCommercialReference,
  effectiveFrom: sessionStartedAt,
}];

/** Aplica o histórico de referências salvo no banco (chamado na entrada do portal). */
export function hydrateCommercialReferences(saved) {
  if (Array.isArray(saved) && saved.length && saved.every(item => Number(item.hourlyRate) > 0 && item.effectiveFrom)) {
    commercialReferences = saved.map(item => ({ ...item }));
  }
}

export function getCommercialReference() {
  const now = new Date().toISOString();
  const reference = commercialReferences.find(item =>
    item.effectiveFrom <= now && (!item.effectiveTo || now < item.effectiveTo));
  return { ...reference };
}

// Mantém previousRate/newRate para consumidores antigos, sem evento fictício.
export function getCommercialReferenceHistory() {
  return commercialReferences.filter(item => item.changedAt).map(item => ({ ...item }));
}

export function getCommercialRateReferences() {
  return commercialReferences.map(item => ({ ...item }));
}

export function updateCommercialReference({ hourlyRate, reason, changedBy = null }) {
  const nextRate = roundCurrency(normalizeNumber(hourlyRate));
  if (!Number.isFinite(nextRate) || nextRate <= 0) {
    throw new Error("O valor/hora deve ser maior que zero.");
  }
  const current = getCommercialReference();
  if (nextRate === current.hourlyRate) {
    return { reference: current, historyItem: null };
  }
  const now = new Date().toISOString();
  const next = {
    ...initialCommercialReference,
    id: createHistoryId(),
    hourlyRate: nextRate,
    previousRate: current.hourlyRate,
    newRate: nextRate,
    effectiveFrom: now,
    effectiveTo: null,
    source: "Alteração administrativa",
    changedAt: now,
    updatedAt: now,
    changedBy,
    reason: reason?.trim() || "Alteração da referência comercial.",
  };
  commercialReferences = [next, ...commercialReferences.map(item =>
    item.id === current.id ? { ...item, effectiveTo: now, status: "inactive" } : item)];
  persistSetting("commercial-rate", commercialReferences);
  return { reference: { ...next }, historyItem: { ...next } };
}
/*
 * ============================================================
 * CONTEXTO DE PRECIFICAÇÃO
 * ============================================================
 */

export function getPricingContext(
  machineId,
) {
  return {
    commercialReference:
      getCommercialReference(),

    machineCost:
      machineId
        ? getMachineCostKnowledge(
            machineId,
          )
        : null,
  };
}

/*
 * ============================================================
 * CÁLCULO COMERCIAL
 * ============================================================
 */

export function calculateCommercialTotal({
  hourlyRate,
  billableHours,
}) {
  const rate =
    normalizeNumber(
      hourlyRate,
    );

  const hours =
    normalizeNumber(
      billableHours,
    );

  return roundCurrency(
    rate * hours,
  );
}

/*
 * ============================================================
 * CUSTO TÉCNICO DE REFERÊNCIA
 * ============================================================
 */

export function calculateTechnicalReference({
  machineId,
  technicalHours,
}) {
  const machine =
    getMachineCostKnowledge(
      machineId,
    );

  if (!machine || machine.validationStatus !== "validated" ||
      !machine.effectiveFrom || machine.effectiveFrom > new Date().toISOString() ||
      (machine.effectiveTo && machine.effectiveTo <= new Date().toISOString())) {
    return null;
  }

  const hours =
    normalizeNumber(
      technicalHours,
    );

  return {
    machine,

    hourlyCost:
      machine.costWithAdministrative,

    hours,

    estimatedCost:
      roundCurrency(
        machine.costWithAdministrative *
          hours,
      ),
  };
}

/*
 * ============================================================
 * INSIGHTS DE APOIO
 * ============================================================
 */

export function buildPricingInsights({
  machineId,
  technicalHours,
  hourlyRate,
  billableHours,
}) {
  const insights = [];

  const commercialTotal =
    calculateCommercialTotal({
      hourlyRate,
      billableHours,
    });

  const technicalReference =
    calculateTechnicalReference({
      machineId,
      technicalHours,
    });

  if (
    technicalReference &&
    Number(hourlyRate) > 0 &&
    Number(hourlyRate) <
      technicalReference.hourlyCost
  ) {
    insights.push({
      type:
        "attention",

      title:
        "Valor/hora abaixo do custo técnico de referência",

      description:
        "Isso pode representar uma decisão comercial válida. O sistema apenas sinaliza a diferença para apoiar a análise.",
    });
  }

  if (
    Number(technicalHours) >
    Number(billableHours) &&
    Number(billableHours) >=
      0
  ) {
    insights.push({
      type:
        "information",

      title:
        "Horas cobradas abaixo das horas técnicas",

      description:
        "O tempo comercial considerado é menor que o esforço técnico previsto.",
    });
  }

  if (
    Number(billableHours) >
      Number(technicalHours) &&
    Number(technicalHours) >
      0
  ) {
    insights.push({
      type:
        "information",

      title:
        "Horas cobradas acima das horas técnicas",

      description:
        "Confira se o tempo adicional representa preparação, processamento, análise ou outra atividade do serviço.",
    });
  }

  return {
    commercialTotal,

    technicalReference,

    insights,
  };
}

/*
 * ============================================================
 * UTILITÁRIOS
 * ============================================================
 */

function normalizeNumber(
  value,
) {
  const number =
    Number(value);

  return Number.isFinite(
    number,
  )
    ? number
    : 0;
}

function roundCurrency(
  value,
) {
  return (
    Math.round(
      value * 100,
    ) / 100
  );
}

function createHistoryId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `commercial-reference-${crypto.randomUUID()}`;
  }

  return `commercial-reference-${Date.now()}`;
}