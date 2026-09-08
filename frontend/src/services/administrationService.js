import {
  initialAttentionRules,
  initialAuditEvents,
  initialGeneralSettings,
  integrationCatalog,
} from "../data/internal/administration";

/*
 * ============================================================
 * SERVIÇO TEMPORÁRIO DE ADMINISTRAÇÃO
 * ============================================================
 *
 * Nesta fase as alterações permanecem apenas durante
 * a sessão atual.
 *
 * Futuramente:
 *
 * Frontend
 *      ↓
 * API
 *      ↓
 * Banco de dados
 *
 * será responsável pela persistência definitiva.
 * ============================================================
 */

let generalSettings = {
  ...initialGeneralSettings,
};

let attentionRules =
  initialAttentionRules.map(
    (rule) => ({
      ...rule,
    }),
  );

let auditEvents =
  initialAuditEvents.map(
    (event) => ({
      ...event,
    }),
  );

/*
 * ============================================================
 * CONFIGURAÇÕES OPERACIONAIS
 * ============================================================
 */

export function getGeneralSettings() {
  return {
    ...generalSettings,
  };
}

export function updateGeneralSettings(
  patch,
) {
  const previousSettings = {
    ...generalSettings,
  };

  generalSettings = {
    ...generalSettings,
    ...patch,
  };

  const changedFields =
    Object.keys(
      patch,
    ).filter(
      (field) =>
        previousSettings[
          field
        ] !==
        generalSettings[
          field
        ],
    );

  if (
    changedFields.length >
    0
  ) {
    registerAuditEvent({
      action:
        "Configurações operacionais atualizadas",

      area:
        "Administração",

      description:
        `${changedFields.length} parâmetro${changedFields.length === 1 ? "" : "s"} do fluxo foram alterados.`,
    });
  }

  return getGeneralSettings();
}

/*
 * ============================================================
 * REGRAS DE ATENÇÃO
 * ============================================================
 */

export function getAttentionRules() {
  return attentionRules.map(
    (rule) => ({
      ...rule,
    }),
  );
}

export function updateAttentionRule(
  ruleId,
  patch,
) {
  attentionRules =
    attentionRules.map(
      (rule) =>
        rule.id ===
        ruleId
          ? {
              ...rule,
              ...patch,
            }
          : rule,
    );

  const updatedRule =
    attentionRules.find(
      (rule) =>
        rule.id ===
        ruleId,
    );

  if (updatedRule) {
    registerAuditEvent({
      action:
        "Regra de atenção atualizada",

      area:
        "Regras de atenção",

      description:
        `${updatedRule.entity} · ${updatedRule.situation}`,
    });
  }

  return updatedRule
    ? {
        ...updatedRule,
      }
    : null;
}

/*
 * ============================================================
 * INTEGRAÇÕES
 * ============================================================
 */

export function getIntegrations() {
  return integrationCatalog.map(
    (integration) => ({
      ...integration,
    }),
  );
}

/*
 * ============================================================
 * AUDITORIA
 * ============================================================
 */

export function getAuditEvents() {
  return auditEvents.map(
    (event) => ({
      ...event,
    }),
  );
}

export function registerAuditEvent({
  action,
  area,
  description,
  actor = "Administrador",
}) {
  const event = {
    id:
      createAuditId(),

    action,

    area,

    actor,

    date:
      formatCurrentDate(),

    description:
      description ??
      "",
  };

  auditEvents = [
    event,
    ...auditEvents,
  ];

  return {
    ...event,
  };
}

/*
 * ============================================================
 * UTILITÁRIOS
 * ============================================================
 */

function createAuditId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `AUD-${crypto.randomUUID()}`;
  }

  return `AUD-${Date.now()}`;
}

function formatCurrentDate() {
  return new Intl.DateTimeFormat(
    "pt-BR",
  ).format(
    new Date(),
  );
}