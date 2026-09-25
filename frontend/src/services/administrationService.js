import {
  initialAttentionRules,
  initialGeneralSettings,
  integrationCatalog,
} from "../data/internal/administration";
import { getAuditTrail, persistSetting, postAuditEvent } from "./settingsApi";
import { getCurrentUser } from "./currentUserService";

/*
 * ============================================================
 * SERVIÇO DE ADMINISTRAÇÃO
 * ============================================================
 *
 * Estado local sincronizado com o backend:
 * - carregado na entrada do portal (hydrateAdministration);
 * - cada alteração é gravada em /api/admin/settings;
 * - a auditoria fica em /api/admin/audit.
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

let auditEvents = [];

/** Aplica as configurações salvas no banco (chamado na entrada do portal). */
export function hydrateAdministration({ general, rules } = {}) {
  if (general && typeof general === "object") generalSettings = { ...initialGeneralSettings, ...general };
  if (Array.isArray(rules) && rules.length) {
    const saved = new Map(rules.map(rule => [rule.id, rule]));
    attentionRules = initialAttentionRules.map(rule => ({ ...rule, ...(saved.get(rule.id) || {}) }));
  }
}

/** Recarrega a trilha de auditoria do banco. */
export async function loadAuditEvents() {
  try { auditEvents = await getAuditTrail(); } catch (error) { console.error("[auditoria]", error.message); }
  return getAuditEvents();
}

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
  for (const [field, minimum] of [["defaultQuoteValidityDays", 1], ["defaultExecutionDeadlineDays", 0]]) {
    if (Object.hasOwn(patch, field) && (!Number.isInteger(patch[field]) || patch[field] < minimum)) {
      throw new Error("Informe validade e prazo em dias inteiros válidos.");
    }
  }
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
    persistSetting("general", generalSettings);
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
    persistSetting("attention-rules", attentionRules);
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
  actor = getCurrentUser()?.name || "Administrador",
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
  postAuditEvent({ area, action, description: event.description }).catch(error => console.error("[auditoria]", error.message));

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
    "pt-BR", { dateStyle: "short", timeStyle: "short" },
  ).format(
    new Date(),
  );
}
