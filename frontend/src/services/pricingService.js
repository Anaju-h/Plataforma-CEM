import {
  getMachineCostKnowledge,
  initialCommercialReference,
} from "../data/internal/pricingKnowledge";

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

let commercialReference = {
  ...initialCommercialReference,

  effectiveFrom:
    initialCommercialReference.effectiveFrom ??
    "26/08/2026",

  changedBy:
    "Administrador",
};

/*
 * ============================================================
 * HISTÓRICO TEMPORÁRIO
 * ============================================================
 */

let commercialReferenceHistory = [
  {
    id: "commercial-reference-001",

    previousRate: 135,

    newRate: 150,

    effectiveFrom:
      "01/07/2026",

    changedAt:
      "01/07/2026",

    changedBy:
      "Administrador",

    reason:
      "Atualização da referência comercial praticada pelo laboratório.",
  },
];

/*
 * ============================================================
 * CONSULTAS
 * ============================================================
 */

export function getCommercialReference() {
  return {
    ...commercialReference,
  };
}

export function getCommercialReferenceHistory() {
  return commercialReferenceHistory.map(
    (item) => ({
      ...item,
    }),
  );
}

/*
 * ============================================================
 * ALTERAÇÃO DA REFERÊNCIA COMERCIAL
 * ============================================================
 */

export function updateCommercialReference({
  hourlyRate,
  reason,
  changedBy = "Administrador",
}) {
  const nextRate =
    normalizeNumber(
      hourlyRate,
    );

  if (nextRate <= 0) {
    throw new Error(
      "O valor/hora deve ser maior que zero.",
    );
  }

  const previousRate =
    commercialReference.hourlyRate;

  if (
    nextRate ===
    previousRate
  ) {
    return {
      reference:
        getCommercialReference(),

      historyItem: null,
    };
  }

  const today =
    formatCurrentDate();

  const historyItem = {
    id:
      createHistoryId(),

    previousRate,

    newRate:
      nextRate,

    effectiveFrom:
      today,

    changedAt:
      today,

    changedBy,

    reason:
      reason?.trim() ||
      "Alteração da referência comercial.",
  };

  commercialReferenceHistory = [
    historyItem,
    ...commercialReferenceHistory,
  ];

  commercialReference = {
    ...commercialReference,

    hourlyRate:
      nextRate,

    updatedAt:
      today,

    effectiveFrom:
      today,

    changedBy,
  };

  return {
    reference:
      getCommercialReference(),

    historyItem,
  };
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

  if (!machine) {
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

function formatCurrentDate() {
  return new Intl.DateTimeFormat(
    "pt-BR",
  ).format(
    new Date(),
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