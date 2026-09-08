import {
  getAttentionRules,
} from "./administrationService";

import {
  getRuntimeProjects,
} from "./projectService";

import {
  getQuoteByRequestId,
  getRuntimeQuotes,
} from "./quoteService";

import {
  getRuntimeRequests,
} from "./requestService";

/*
 * ============================================================
 * MOTOR INTELIGENTE DE ATENÇÃO
 * ============================================================
 *
 * Fluxo monitorado:
 *
 * SOLICITAÇÃO
 *      ↓
 * ORÇAMENTO
 *      ↓
 * PROJETO
 *
 * O motor considera:
 *
 * - situação atual;
 * - prioridade;
 * - tempo sem atualização;
 * - prazos;
 * - regras configuradas na Administração.
 * ============================================================
 */

export function getCurrentUserWork(
  currentUser = "Administrador",
) {
  const requests =
    getRuntimeRequests();

  const quotes =
    getRuntimeQuotes();

  const projects =
    getRuntimeProjects();

  const rules =
    getAttentionRules();

  /*
   * ========================================================
   * SOLICITAÇÕES
   * ========================================================
   *
   * Solicitação sem responsável também interessa ao
   * Administrador nesta versão inicial.
   * ========================================================
   */

  const assignedRequests =
    requests.filter(
      (request) =>
        request.responsible ===
          currentUser ||
        request.responsible ===
          "Não atribuído",
    );

  const activeRequests =
    assignedRequests.filter(
      (request) =>
        ![
          "Convertida em orçamento",
          "Recusada",
          "Cancelada",
        ].includes(
          request.status,
        ),
    );

  /*
   * ========================================================
   * ORÇAMENTOS
   * ========================================================
   */

  const assignedQuotes =
    quotes.filter(
      (quote) =>
        quote.responsible ===
        currentUser,
    );

  const activeQuotes =
    assignedQuotes.filter(
      (quote) =>
        ![
          "Aceito",
          "Recusado",
          "Cancelado",
        ].includes(
          quote.status,
        ),
    );

  /*
   * ========================================================
   * PROJETOS
   * ========================================================
   */

  const assignedProjects =
    projects.filter(
      (project) =>
        project.responsible ===
        currentUser,
    );

  const activeProjects =
    assignedProjects.filter(
      (project) =>
        ![
          "Concluído",
          "Cancelado",
        ].includes(
          project.status,
        ),
    );

  /*
   * ========================================================
   * ATENÇÃO
   * ========================================================
   */

  const attentionItems = [
    ...buildRequestAttentionItems(
      assignedRequests,
      rules,
    ),

    ...buildQuoteAttentionItems(
      assignedQuotes,
      rules,
    ),

    ...buildProjectAttentionItems(
      activeProjects,
      rules,
    ),
  ].sort(
    sortAttentionItems,
  );

  const upcomingDeadlines =
    buildUpcomingDeadlines(
      activeProjects,
    );

  return {
    currentUser,

    assignedRequests,

    activeRequests,

    assignedQuotes,

    activeQuotes,

    assignedProjects,

    activeProjects,

    attentionItems,

    upcomingDeadlines,

    attentionCount:
      attentionItems.length,

    urgentCount:
      attentionItems.filter(
        (item) =>
          item.level ===
          "urgent",
      ).length,

    upcomingDeadlineCount:
      upcomingDeadlines.length,
  };
}

/*
 * ============================================================
 * SOLICITAÇÕES
 * ============================================================
 */

function buildRequestAttentionItems(
  requests,
  rules,
) {
  return requests.flatMap(
    (request) => {
      /*
       * ------------------------------------------------------
       * JÁ CONVERTIDA / ENCERRADA
       * ------------------------------------------------------
       */

      if (
        [
          "Convertida em orçamento",
          "Recusada",
          "Cancelada",
        ].includes(
          request.status,
        )
      ) {
        return [];
      }

      /*
       * ------------------------------------------------------
       * APTA PARA ORÇAMENTO
       * ------------------------------------------------------
       *
       * Se já existir orçamento, não repetimos o alerta.
       * ------------------------------------------------------
       */

      if (
        request.status ===
        "Apta para orçamento"
      ) {
        const existingQuote =
          getQuoteByRequestId(
            request.id,
          );

        if (existingQuote) {
          return [];
        }

        return [
          createAttentionItem({
            id:
              `${request.id}-create-quote`,

            type:
              "request",

            referenceId:
              request.id,

            company:
              request.company,

            title:
              "Criar orçamento",

            description:
              "A análise técnica foi concluída e a solicitação está pronta para avançar ao fluxo comercial.",

            route:
              `/portal/solicitacoes/${request.id}`,

            level:
              request.priority ===
              "Urgente"
                ? "urgent"
                : "attention",

            label:
              request.priority ===
              "Urgente"
                ? "Urgente"
                : "Ação necessária",

            priority:
              request.priority ===
              "Urgente"
                ? 130
                : 105,
          }),
        ];
      }

      /*
       * ------------------------------------------------------
       * NOVA
       * ------------------------------------------------------
       */

      if (
        request.status ===
        "Nova"
      ) {
        const rule =
          findEnabledRule(
            rules,
            "request-new",
          );

        const age =
          calculateAgeInDays(
            request.updatedAt ??
              request.createdAt,
          );

        const state =
          evaluateTemporalRule(
            rule,
            age,
          );

        let level =
          state.level;

        let label =
          state.label;

        let priority =
          state.priority;

        /*
         * Solicitação explicitamente urgente
         * sobe imediatamente na fila.
         */
        if (
          request.priority ===
          "Urgente"
        ) {
          level =
            "urgent";

          label =
            "Urgente";

          priority =
            130;
        }

        return [
          createAttentionItem({
            id:
              `${request.id}-new`,

            type:
              "request",

            referenceId:
              request.id,

            company:
              request.company,

            title:
              "Analisar nova solicitação",

            description:
              buildAgeDescription(
                `${request.service} ainda não teve a análise iniciada.`,
                age,
              ),

            route:
              `/portal/solicitacoes/${request.id}`,

            level,

            label,

            priority,

            ageDays:
              age,
          }),
        ];
      }

      /*
       * ------------------------------------------------------
       * EM ANÁLISE
       * ------------------------------------------------------
       */

      if (
        request.status ===
        "Em análise"
      ) {
        const rule =
          findEnabledRule(
            rules,
            "request-analysis",
          );

        const age =
          calculateAgeInDays(
            request.updatedAt ??
              request.createdAt,
          );

        const state =
          evaluateTemporalRule(
            rule,
            age,
          );

        let level =
          state.level;

        let label =
          state.label;

        let priority =
          state.priority +
          5;

        /*
         * Prioritária recebe um pequeno ganho,
         * mas não significa automaticamente urgência.
         */
        if (
          request.priority ===
          "Prioritária"
        ) {
          priority +=
            15;

          if (
            level ===
            "normal"
          ) {
            label =
              "Prioritária";
          }
        }

        if (
          request.priority ===
          "Urgente"
        ) {
          level =
            "urgent";

          label =
            "Urgente";

          priority =
            130;
        }

        return [
          createAttentionItem({
            id:
              `${request.id}-analysis`,

            type:
              "request",

            referenceId:
              request.id,

            company:
              request.company,

            title:
              "Continuar análise da solicitação",

            description:
              buildAgeDescription(
                `${request.service} permanece em avaliação técnica.`,
                age,
              ),

            route:
              `/portal/solicitacoes/${request.id}`,

            level,

            label,

            priority,

            ageDays:
              age,
          }),
        ];
      }

      /*
       * ------------------------------------------------------
       * AGUARDANDO INFORMAÇÕES
       * ------------------------------------------------------
       *
       * Aqui existe uma diferença importante:
       *
       * talvez a ação dependa do cliente, mas ainda é útil
       * acompanhar casos que permanecem parados por muito tempo.
       * ------------------------------------------------------
       */

      if (
        request.status ===
        "Aguardando informações"
      ) {
        const rule =
          findEnabledRule(
            rules,
            "request-information",
          );

        const age =
          calculateAgeInDays(
            request.updatedAt ??
              request.createdAt,
          );

        const state =
          evaluateTemporalRule(
            rule,
            age,
          );

        /*
         * Antes do limite configurado, não precisamos
         * poluir a fila de atenção.
         */
        if (
          !state.triggered
        ) {
          return [];
        }

        return [
          createAttentionItem({
            id:
              `${request.id}-information`,

            type:
              "request",

            referenceId:
              request.id,

            company:
              request.company,

            title:
              "Acompanhar informações pendentes",

            description:
              `A solicitação depende de informações adicionais e está nessa situação há ${formatDays(
                age,
              )}.`,

            route:
              `/portal/solicitacoes/${request.id}`,

            level:
              state.level,

            label:
              state.level ===
              "urgent"
                ? "Sem retorno"
                : "Acompanhar",

            priority:
              state.priority,

            ageDays:
              age,
          }),
        ];
      }

      return [];
    },
  );
}

/*
 * ============================================================
 * ORÇAMENTOS
 * ============================================================
 */

function buildQuoteAttentionItems(
  quotes,
  rules,
) {
  return quotes.flatMap(
    (quote) => {
      /*
       * ACEITO SEM PROJETO
       */

      if (
        quote.status ===
          "Aceito" &&
        !quote.projectId
      ) {
        return [
          createAttentionItem({
            id:
              `${quote.id}-start-project`,

            type:
              "quote",

            referenceId:
              quote.id,

            company:
              quote.company,

            title:
              "Iniciar projeto",

            description:
              "O orçamento foi aceito e ainda não avançou para execução.",

            route:
              `/portal/orcamentos/${quote.id}`,

            level:
              "urgent",

            label:
              "Ação necessária",

            priority:
              115,
          }),
        ];
      }

      /*
       * EM ELABORAÇÃO
       */

      if (
        [
          "Rascunho",
          "Em elaboração",
        ].includes(
          quote.status,
        )
      ) {
        const rule =
          findEnabledRule(
            rules,
            "quote-draft",
          );

        const age =
          calculateAgeInDays(
            quote.updatedAt ??
              quote.createdAt,
          );

        const temporalState =
          evaluateTemporalRule(
            rule,
            age,
          );

        let level =
          temporalState.level;

        let label =
          temporalState.label;

        let priority =
          temporalState.priority;

        if (
          quote.priority ===
          "Urgente"
        ) {
          level =
            "urgent";

          label =
            "Urgente";

          priority =
            Math.max(
              priority,
              120,
            );
        }

        return [
          createAttentionItem({
            id:
              `${quote.id}-draft`,

            type:
              "quote",

            referenceId:
              quote.id,

            company:
              quote.company,

            title:
              "Continuar elaboração do orçamento",

            description:
              buildAgeDescription(
                `${quote.service} ainda possui uma proposta em preparação.`,
                age,
              ),

            route:
              `/portal/orcamentos/${quote.id}`,

            level,

            label,

            priority,

            ageDays:
              age,
          }),
        ];
      }

      /*
       * EM REVISÃO
       */

      if (
        quote.status ===
        "Em revisão"
      ) {
        const rule =
          findEnabledRule(
            rules,
            "quote-review",
          );

        const age =
          calculateAgeInDays(
            quote.updatedAt ??
              quote.createdAt,
          );

        const temporalState =
          evaluateTemporalRule(
            rule,
            age,
          );

        return [
          createAttentionItem({
            id:
              `${quote.id}-review`,

            type:
              "quote",

            referenceId:
              quote.id,

            company:
              quote.company,

            title:
              "Revisar orçamento",

            description:
              buildAgeDescription(
                `${quote.service} está aguardando revisão interna.`,
                age,
              ),

            route:
              `/portal/orcamentos/${quote.id}`,

            level:
              temporalState.level,

            label:
              temporalState.label,

            priority:
              temporalState.priority +
              10,

            ageDays:
              age,
          }),
        ];
      }

      /*
       * APROVADO INTERNAMENTE
       */

      if (
        quote.status ===
        "Aprovado internamente"
      ) {
        return [
          createAttentionItem({
            id:
              `${quote.id}-send`,

            type:
              "quote",

            referenceId:
              quote.id,

            company:
              quote.company,

            title:
              "Preparar envio da proposta",

            description:
              "O orçamento foi aprovado internamente e pode avançar para o cliente.",

            route:
              `/portal/orcamentos/${quote.id}`,

            level:
              "attention",

            label:
              "Pendente",

            priority:
              85,
          }),
        ];
      }

      return [];
    },
  );
}

/*
 * ============================================================
 * PROJETOS
 * ============================================================
 */

function buildProjectAttentionItems(
  projects,
  rules,
) {
  return projects.flatMap(
    (project) => {
      const items = [];

      /*
       * PLANEJAMENTO
       */

      if (
        project.status ===
        "Planejamento"
      ) {
        items.push(
          createAttentionItem({
            id:
              `${project.id}-planning`,

            type:
              "project",

            referenceId:
              project.id,

            company:
              project.company,

            title:
              "Preparar execução do projeto",

            description:
              `${project.service} está em planejamento.`,

            route:
              `/portal/projetos/${project.id}`,

            level:
              project.priority ===
              "Urgente"
                ? "urgent"
                : "attention",

            label:
              project.priority ===
              "Urgente"
                ? "Urgente"
                : "Pendente",

            priority:
              project.priority ===
              "Urgente"
                ? 120
                : 80,
          }),
        );
      }

      /*
       * AGUARDANDO REVISÃO
       */

      if (
        project.status ===
        "Aguardando revisão"
      ) {
        items.push(
          createAttentionItem({
            id:
              `${project.id}-review`,

            type:
              "project",

            referenceId:
              project.id,

            company:
              project.company,

            title:
              "Revisar resultados do projeto",

            description:
              `${project.service} está aguardando revisão antes da conclusão.`,

            route:
              `/portal/projetos/${project.id}`,

            level:
              "attention",

            label:
              "Revisão",

            priority:
              95,
          }),
        );
      }

      /*
       * INATIVIDADE
       */

      const inactivityRule =
        findEnabledRule(
          rules,
          "project-inactivity",
        );

      if (
        inactivityRule &&
        [
          "Aguardando execução",
          "Em andamento",
        ].includes(
          project.status,
        )
      ) {
        const age =
          calculateAgeInDays(
            project.updatedAt ??
              project.createdAt,
          );

        const state =
          evaluateTemporalRule(
            inactivityRule,
            age,
          );

        if (
          state.triggered
        ) {
          items.push(
            createAttentionItem({
              id:
                `${project.id}-inactive`,

              type:
                "project",

              referenceId:
                project.id,

              company:
                project.company,

              title:
                state.level ===
                "urgent"
                  ? "Projeto sem atualização"
                  : "Verificar andamento do projeto",

              description:
                `O projeto está sem atualização há ${formatDays(
                  age,
                )}.`,

              route:
                `/portal/projetos/${project.id}`,

              level:
                state.level,

              label:
                state.level ===
                "urgent"
                  ? "Inatividade"
                  : "Atenção",

              priority:
                state.priority,

              ageDays:
                age,
            }),
          );
        }
      }

      /*
       * PRAZO
       */

      const deadline =
        parseBrazilianDate(
          project.deadline,
        );

      if (deadline) {
        const daysRemaining =
          differenceInDaysFromToday(
            deadline,
          );

        if (
          daysRemaining < 0
        ) {
          items.push(
            createAttentionItem({
              id:
                `${project.id}-overdue`,

              type:
                "project",

              referenceId:
                project.id,

              company:
                project.company,

              title:
                "Prazo do projeto vencido",

              description:
                `O prazo informado era ${project.deadline}.`,

              route:
                `/portal/projetos/${project.id}`,

              level:
                "urgent",

              label:
                "Prazo vencido",

              priority:
                140,
            }),
          );
        } else {
          const deadlineRule =
            findEnabledRule(
              rules,
              "project-deadline",
            );

          if (
            deadlineRule
          ) {
            const state =
              evaluateDeadlineRule(
                deadlineRule,
                daysRemaining,
              );

            if (
              state.triggered
            ) {
              items.push(
                createAttentionItem({
                  id:
                    `${project.id}-deadline`,

                  type:
                    "project",

                  referenceId:
                    project.id,

                  company:
                    project.company,

                  title:
                    daysRemaining ===
                    0
                      ? "Prazo termina hoje"
                      : "Prazo de execução próximo",

                  description:
                    daysRemaining ===
                    0
                      ? "O prazo informado para este projeto termina hoje."
                      : `Faltam ${formatDays(
                          daysRemaining,
                        )} para o prazo informado.`,

                  route:
                    `/portal/projetos/${project.id}`,

                  level:
                    state.level,

                  label:
                    state.level ===
                    "urgent"
                      ? "Prazo urgente"
                      : "Prazo próximo",

                  priority:
                    state.priority,
                }),
              );
            }
          }
        }
      }

      return items;
    },
  );
}

/*
 * ============================================================
 * PRÓXIMOS PRAZOS
 * ============================================================
 */

function buildUpcomingDeadlines(
  projects,
) {
  return projects
    .map(
      (project) => {
        const deadline =
          parseBrazilianDate(
            project.deadline,
          );

        if (!deadline) {
          return null;
        }

        return {
          projectId:
            project.id,

          company:
            project.company,

          service:
            project.service,

          deadline:
            project.deadline,

          status:
            project.status,

          daysRemaining:
            differenceInDaysFromToday(
              deadline,
            ),

          route:
            `/portal/projetos/${project.id}`,
        };
      },
    )
    .filter(Boolean)
    .filter(
      (item) =>
        item.daysRemaining >=
        0,
    )
    .sort(
      (a, b) =>
        a.daysRemaining -
        b.daysRemaining,
    )
    .slice(
      0,
      5,
    );
}

/*
 * ============================================================
 * REGRAS
 * ============================================================
 */

function findEnabledRule(
  rules,
  ruleId,
) {
  return (
    rules.find(
      (rule) =>
        rule.id ===
          ruleId &&
        rule.enabled,
    ) ?? null
  );
}

function evaluateTemporalRule(
  rule,
  ageDays,
) {
  if (!rule) {
    return {
      triggered:
        false,

      level:
        "normal",

      label:
        "Pendente",

      priority:
        50,
    };
  }

  if (
    ageDays >=
    rule.urgentAfterDays
  ) {
    return {
      triggered:
        true,

      level:
        "urgent",

      label:
        "Urgente",

      priority:
        120,
    };
  }

  if (
    ageDays >=
    rule.attentionAfterDays
  ) {
    return {
      triggered:
        true,

      level:
        "attention",

      label:
        "Atenção",

      priority:
        90,
    };
  }

  return {
    triggered:
      false,

    level:
      "normal",

    label:
      "Pendente",

    priority:
      60,
  };
}

function evaluateDeadlineRule(
  rule,
  daysRemaining,
) {
  if (!rule) {
    return {
      triggered:
        false,
    };
  }

  if (
    daysRemaining <=
    rule.urgentAfterDays
  ) {
    return {
      triggered:
        true,

      level:
        "urgent",

      priority:
        130,
    };
  }

  if (
    daysRemaining <=
    rule.attentionAfterDays
  ) {
    return {
      triggered:
        true,

      level:
        "attention",

      priority:
        100,
    };
  }

  return {
    triggered:
      false,
  };
}

/*
 * ============================================================
 * ITEM DE ATENÇÃO
 * ============================================================
 */

function createAttentionItem({
  id,
  type,
  referenceId,
  company,
  title,
  description,
  route,
  level,
  label,
  priority,
  ageDays = null,
}) {
  return {
    id,

    type,

    referenceId,

    company,

    title,

    description,

    route,

    level,

    urgency:
      level,

    urgencyLabel:
      label,

    priority,

    ageDays,
  };
}

/*
 * ============================================================
 * ORDENAÇÃO
 * ============================================================
 */

function sortAttentionItems(
  a,
  b,
) {
  return (
    b.priority -
    a.priority
  );
}

/*
 * ============================================================
 * TEMPO
 * ============================================================
 */

function calculateAgeInDays(
  dateValue,
) {
  const date =
    parseBrazilianDate(
      dateValue,
    );

  if (!date) {
    return 0;
  }

  const today =
    getTodayStart();

  const difference =
    today.getTime() -
    date.getTime();

  return Math.max(
    0,
    Math.floor(
      difference /
        86400000,
    ),
  );
}

function differenceInDaysFromToday(
  targetDate,
) {
  const today =
    getTodayStart();

  const target =
    new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
    );

  return Math.ceil(
    (
      target.getTime() -
      today.getTime()
    ) /
      86400000,
  );
}

function getTodayStart() {
  const today =
    new Date();

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
}

function parseBrazilianDate(
  value,
) {
  if (
    !value ||
    value ===
      "A definir"
  ) {
    return null;
  }

  const [
    day,
    month,
    year,
  ] = String(
    value,
  )
    .split("/")
    .map(Number);

  if (
    !day ||
    !month ||
    !year
  ) {
    return null;
  }

  const date =
    new Date(
      year,
      month - 1,
      day,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? null
    : date;
}

function buildAgeDescription(
  base,
  days,
) {
  if (
    days <= 0
  ) {
    return base;
  }

  return `${base} Última atualização há ${formatDays(
    days,
  )}.`;
}

function formatDays(
  days,
) {
  return `${days} ${
    days === 1
      ? "dia"
      : "dias"
  }`;
}