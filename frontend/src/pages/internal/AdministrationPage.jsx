import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import {
  getAttentionRules,
  getAuditEvents,
  getGeneralSettings,
  getIntegrations,
  updateAttentionRule,
  updateGeneralSettings,
} from "../../services/administrationService";

const tabs = [
  {
    id:
      "general",

    label:
      "Geral",
  },

  {
    id:
      "attention",

    label:
      "Regras de atenção",
  },

  {
    id:
      "security",

    label:
      "Acesso e segurança",
  },

  {
    id:
      "integrations",

    label:
      "Integrações",
  },

  {
    id:
      "audit",

    label:
      "Auditoria",
  },
];

export function AdministrationPage() {
  const navigate =
    useNavigate();

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "general",
  );

  const [
    generalSettings,
    setGeneralSettings,
  ] = useState(
    () =>
      getGeneralSettings(),
  );

  const [
    attentionRules,
    setAttentionRules,
  ] = useState(
    () =>
      getAttentionRules(),
  );

  const [
    auditEvents,
    setAuditEvents,
  ] = useState(
    () =>
      getAuditEvents(),
  );

  const integrations =
    getIntegrations();

  function refreshAudit() {
    setAuditEvents(
      getAuditEvents(),
    );
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Sistema"
        title="Administração"
        description="Gerencie regras, parâmetros e estruturas que influenciam o funcionamento do portal."
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Perfil ativo"
          value="Administrador"
          description="Único perfil habilitado nesta versão."
          compact
        />

        <MetricCard
          label="Regras de atenção"
          value={
            attentionRules.filter(
              (rule) =>
                rule.enabled,
            ).length
          }
          description="Regras atualmente habilitadas."
        />

        <MetricCard
          label="Integrações"
          value={
            integrations.length
          }
          description="Integrações mapeadas para evolução."
        />

        <MetricCard
          label="Eventos de auditoria"
          value={
            auditEvents.length
          }
          description="Registros administrativos desta sessão."
        />
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="flex min-w-max gap-1 rounded-[16px] border border-[#d1dde4] bg-white p-1.5">
          {tabs.map(
            (tab) => (
              <button
                key={
                  tab.id
                }
                type="button"
                onClick={() =>
                  setActiveTab(
                    tab.id,
                  )
                }
                className={`
                  rounded-[10px]
                  px-4 py-2.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  transition

                  ${
                    activeTab ===
                    tab.id
                      ? "bg-[#0b3550] text-white"
                      : "text-[#667f8e] hover:bg-[#f3f7f9]"
                  }
                `}
              >
                {tab.label}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="mt-5">
        {activeTab ===
          "general" && (
          <GeneralTab
            settings={
              generalSettings
            }
            onSave={(
              nextSettings,
            ) => {
              const updated =
                updateGeneralSettings(
                  nextSettings,
                );

              setGeneralSettings(
                updated,
              );

              refreshAudit();
            }}
            onOpenCommercial={() =>
              navigate(
                "/portal/equipamentos-custos",
              )
            }
            onOpenTeam={() =>
              navigate(
                "/portal/equipe",
              )
            }
            onOpenAttention={() =>
              setActiveTab(
                "attention",
              )
            }
            onOpenKnowledge={() =>
              navigate(
                "/portal/conhecimento",
              )
            }
          />
        )}

        {activeTab ===
          "attention" && (
          <AttentionRulesTab
            rules={
              attentionRules
            }
            onRuleChange={(
              ruleId,
              patch,
            ) => {
              updateAttentionRule(
                ruleId,
                patch,
              );

              setAttentionRules(
                getAttentionRules(),
              );

              refreshAudit();
            }}
          />
        )}

        {activeTab ===
          "security" && (
          <SecurityTab
            onOpenTeam={() =>
              navigate(
                "/portal/equipe",
              )
            }
          />
        )}

        {activeTab ===
          "integrations" && (
          <IntegrationsTab
            integrations={
              integrations
            }
          />
        )}

        {activeTab ===
          "audit" && (
          <AuditTab
            events={
              auditEvents
            }
          />
        )}
      </div>
    </div>
  );
}

/*
 * ============================================================
 * GERAL
 * ============================================================
 */

function GeneralTab({
  settings,
  onSave,
  onOpenCommercial,
  onOpenTeam,
  onOpenAttention,
  onOpenKnowledge,
}) {
  const [
    form,
    setForm,
  ] = useState(
    settings,
  );

  const [
    feedback,
    setFeedback,
  ] = useState("");

  function updateField(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        [field]:
          value,
      }),
    );
  }

  function save() {
    onSave(
      form,
    );

    setFeedback(
      "Configurações salvas.",
    );

    window.setTimeout(
      () =>
        setFeedback(""),
      2200,
    );
  }

  return (
    <div className="space-y-5">
      {/* =====================================================
          INTRODUÇÃO
      ===================================================== */}

      <section className="rounded-[20px] border border-[#c7d9e3] bg-[#eaf3f8] p-5 sm:p-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
          Regras gerais do portal
        </p>

        <h2 className="mt-2 text-lg font-semibold text-[#17394f]">
          Configurações que orientam o fluxo operacional.
        </h2>

        <p className="mt-2 max-w-4xl text-xs leading-5 text-[#6d8390]">
          Esta área reúne parâmetros usados como padrão para novos registros e
          regras gerais do processo. Valores definidos em um orçamento ou
          projeto específico continuam podendo seguir suas próprias condições
          quando necessário.
        </p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* =================================================
              CONFIGURAÇÕES OPERACIONAIS
          ================================================= */}

          <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 shadow-[0_10px_30px_rgba(34,67,90,0.025)] sm:p-6">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
                Configurações operacionais
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#17394f]">
                Padrões utilizados nos novos processos
              </h2>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-[#7a8e99]">
                Estes valores funcionam como ponto inicial e podem ser
                substituídos quando um caso específico exigir outra condição.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <NumberSetting
                label="Validade padrão de proposta"
                value={
                  form.defaultQuoteValidityDays
                }
                onChange={(value) =>
                  updateField(
                    "defaultQuoteValidityDays",
                    value,
                  )
                }
                suffix="dias"
                help="Sugestão inicial utilizada na criação de novos orçamentos."
              />

              <NumberSetting
                label="Prazo padrão de execução"
                value={
                  form.defaultExecutionDeadlineDays
                }
                onChange={(value) =>
                  updateField(
                    "defaultExecutionDeadlineDays",
                    value,
                  )
                }
                suffix="dias"
                allowZero
                help="Zero mantém o prazo como 'A definir'."
              />

              <SelectSetting
                label="Responsável padrão"
                value={
                  form.defaultResponsible
                }
                onChange={(value) =>
                  updateField(
                    "defaultResponsible",
                    value,
                  )
                }
                options={[
                  {
                    value:
                      "Administrador",

                    label:
                      "Administrador",
                  },
                ]}
                help="Responsável inicial enquanto existir apenas um perfil ativo."
              />

              <SelectSetting
                label="Status inicial de projeto"
                value={
                  form.initialProjectStatus
                }
                onChange={(value) =>
                  updateField(
                    "initialProjectStatus",
                    value,
                  )
                }
                options={[
                  {
                    value:
                      "Planejamento",

                    label:
                      "Planejamento",
                  },

                  {
                    value:
                      "Aguardando execução",

                    label:
                      "Aguardando execução",
                  },
                ]}
                help="Estado atribuído quando um orçamento aceito gera um novo projeto."
              />
            </div>
          </section>

          {/* =================================================
              REGRAS DE FLUXO
          ================================================= */}

          <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 shadow-[0_10px_30px_rgba(34,67,90,0.025)] sm:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
              Fluxo comercial e operacional
            </p>

            <h2 className="mt-2 text-lg font-semibold text-[#17394f]">
              Regras de transição entre etapas
            </h2>

            <div className="mt-6 space-y-3">
              <FlowRule
                title="Criar projeto somente após aceite"
                description="Impede que um orçamento ainda em negociação avance para execução."
                enabled={
                  form.requireAcceptedQuoteForProject
                }
                status={
                  form.requireAcceptedQuoteForProject
                    ? "Ativo"
                    : "Desativado"
                }
                onChange={(value) =>
                  updateField(
                    "requireAcceptedQuoteForProject",
                    value,
                  )
                }
                implemented
              />

              <FlowRule
                title="Revisão antes do envio da proposta"
                description="Prevê uma etapa de revisão interna antes de uma proposta ser considerada pronta para envio."
                enabled={
                  form.requireQuoteReviewBeforeSending
                }
                status={
                  form.requireQuoteReviewBeforeSending
                    ? "Ativo"
                    : "Desativado"
                }
                onChange={(value) =>
                  updateField(
                    "requireQuoteReviewBeforeSending",
                    value,
                  )
                }
                prepared
              />
            </div>

            <div className="mt-5 rounded-[13px] border border-[#d4e1e7] bg-[#f8fafb] p-4">
              <p className="text-[10px] leading-5 text-[#7b8f9a]">
                Algumas regras desta área já fazem parte do fluxo atual. Outras
                estão preparadas para serem conectadas à lógica definitiva após
                a revisão geral do portal e a implementação do backend.
              </p>
            </div>
          </section>

          {/* =================================================
              IDENTIFICAÇÃO
          ================================================= */}

          <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 shadow-[0_10px_30px_rgba(34,67,90,0.025)] sm:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
              Identificação dos processos
            </p>

            <h2 className="mt-2 text-lg font-semibold text-[#17394f]">
              Prefixos utilizados nos registros
            </h2>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-[#7a8e99]">
              Estes identificadores ajudam a reconhecer rapidamente o tipo de
              registro durante a navegação e a rastreabilidade do processo.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <PrefixSetting
                label="Solicitação"
                value={
                  form.requestPrefix
                }
                example={`${form.requestPrefix || "SOL"}-0001`}
                onChange={(value) =>
                  updateField(
                    "requestPrefix",
                    sanitizePrefix(
                      value,
                    ),
                  )
                }
              />

              <PrefixSetting
                label="Orçamento"
                value={
                  form.quotePrefix
                }
                example={`${form.quotePrefix || "ORC"}-0001`}
                onChange={(value) =>
                  updateField(
                    "quotePrefix",
                    sanitizePrefix(
                      value,
                    ),
                  )
                }
              />

              <PrefixSetting
                label="Projeto"
                value={
                  form.projectPrefix
                }
                example={`${form.projectPrefix || "PRJ"}-0001`}
                onChange={(value) =>
                  updateField(
                    "projectPrefix",
                    sanitizePrefix(
                      value,
                    ),
                  )
                }
              />
            </div>

            <div className="mt-5 rounded-[13px] border border-[#dfd4b7] bg-[#f8f2e5] p-4">
              <p className="text-[10px] leading-5 text-[#80682e]">
                Alterar estes prefixos no protótipo ainda não modifica os IDs já
                existentes. A numeração definitiva será controlada pelo backend.
              </p>
            </div>
          </section>

          {/* =================================================
              SALVAR
          ================================================= */}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={
                save
              }
              className="rounded-[11px] bg-[#096ab2] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.09em] text-white transition hover:bg-[#075b99]"
            >
              Salvar configurações
            </button>

            {feedback && (
              <span className="text-[10px] font-semibold text-[#397250]">
                ✓ {feedback}
              </span>
            )}
          </div>
        </div>

        {/* ===================================================
            COLUNA DIREITA
        =================================================== */}

        <aside className="space-y-5">
          <section className="rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
              Atalhos administrativos
            </p>

            <p className="mt-2 text-xs leading-5 text-[#6d8390]">
              Algumas configurações possuem áreas próprias para evitar
              duplicidade de informações.
            </p>

            <div className="mt-5 space-y-2">
              <AdminShortcut
                title="Referência comercial"
                description="Valor/hora vigente e histórico."
                onClick={
                  onOpenCommercial
                }
              />

              <AdminShortcut
                title="Equipe e acessos"
                description="Usuários e estrutura de perfis."
                onClick={
                  onOpenTeam
                }
              />

              <AdminShortcut
                title="Regras de atenção"
                description="Critérios de prioridade e urgência."
                onClick={
                  onOpenAttention
                }
              />

              <AdminShortcut
                title="Base de conhecimento"
                description="Conteúdo técnico e operacional."
                onClick={
                  onOpenKnowledge
                }
              />
            </div>
          </section>

          <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718895]">
              Fluxo principal
            </p>

            <div className="mt-5">
              <ProcessFlow />
            </div>
          </section>

          <InfoBox
            title="Persistência"
            text="As alterações ainda permanecem apenas durante a sessão. Quando o backend for implementado, estas configurações serão persistidas e protegidas por permissão administrativa."
          />
        </aside>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * REGRAS DE ATENÇÃO
 * ============================================================
 */

function AttentionRulesTab({
  rules,
  onRuleChange,
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-[20px] border border-[#c7d9e3] bg-[#eaf3f8] p-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
          Inteligência operacional
        </p>

        <h2 className="mt-2 text-lg font-semibold text-[#17394f]">
          Quando uma situação deve ganhar prioridade?
        </h2>

        <p className="mt-2 max-w-4xl text-xs leading-5 text-[#6d8390]">
          Estas regras serão utilizadas pelo motor de atenção para transformar
          tempo parado, proximidade de prazo e estados do fluxo em alertas no
          Meu trabalho e, futuramente, em notificações.
        </p>
      </section>

      {rules.map(
        (rule) => (
          <AttentionRuleCard
            key={
              rule.id
            }
            rule={
              rule
            }
            onChange={(
              patch,
            ) =>
              onRuleChange(
                rule.id,
                patch,
              )
            }
          />
        ),
      )}
    </div>
  );
}

function AttentionRuleCard({
  rule,
  onChange,
}) {
  return (
    <section
      className={`
        rounded-[20px]
        border
        bg-white
        p-5
        transition
        sm:p-6

        ${
          rule.enabled
            ? "border-[#d1dde4]"
            : "border-[#dde2e5] opacity-65"
        }
      `}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#c9dce6] bg-[#edf6fa] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#5681a0]">
              {rule.entity}
            </span>

            <span className="text-xs font-semibold text-[#31566d]">
              {
                rule.situation
              }
            </span>
          </div>

          <p className="mt-3 text-xs leading-5 text-[#748995]">
            {rule.description}
          </p>
        </div>

        <Toggle
          enabled={
            rule.enabled
          }
          onChange={(enabled) =>
            onChange({
              enabled,
            })
          }
        />
      </div>

      <div className="mt-6 grid gap-4 border-t border-[#e4eaee] pt-5 sm:grid-cols-2 lg:max-w-[520px]">
        <DayInput
          label={
            rule.mode ===
            "before-deadline"
              ? "Começar atenção faltando"
              : "Atenção após"
          }
          value={
            rule.attentionAfterDays
          }
          onChange={(value) =>
            onChange({
              attentionAfterDays:
                value,
            })
          }
          disabled={
            !rule.enabled
          }
        />

        <DayInput
          label={
            rule.mode ===
            "before-deadline"
              ? "Considerar urgente faltando"
              : "Urgente após"
          }
          value={
            rule.urgentAfterDays
          }
          onChange={(value) =>
            onChange({
              urgentAfterDays:
                value,
            })
          }
          disabled={
            !rule.enabled
          }
        />
      </div>
    </section>
  );
}

/*
 * ============================================================
 * SEGURANÇA
 * ============================================================
 */

function SecurityTab({
  onOpenTeam,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 sm:p-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
          Acesso e segurança
        </p>

        <h2 className="mt-2 text-lg font-semibold text-[#17394f]">
          Modelo atual de acesso
        </h2>

        <div className="mt-6 space-y-3">
          <SecurityItem
            title="Autenticação"
            value="Estrutura temporária"
            status="A validar"
            description="O mecanismo definitivo dependerá da infraestrutura e das exigências corporativas."
          />

          <SecurityItem
            title="Perfil administrativo"
            value="Administrador"
            status="Ativo"
            description="Possui acesso a todos os módulos internos nesta versão."
          />

          <SecurityItem
            title="Perfis adicionais"
            value="Equipe técnica / outros"
            status="A validar"
            description="Somente serão habilitados após definição oficial de usuários e permissões."
          />

          <SecurityItem
            title="Auditoria"
            value="Estrutura iniciada"
            status="Em desenvolvimento"
            description="Ações administrativas relevantes já possuem modelo de registro."
          />
        </div>
      </section>

      <aside className="space-y-5">
        <InfoBox
          title="Regra importante"
          text="Permissões reais não devem depender apenas de esconder botões no frontend. O backend deverá validar autorização para todas as operações protegidas."
        />

        <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718895]">
            Usuários
          </p>

          <p className="mt-3 text-xs leading-5 text-[#718795]">
            Consulte a estrutura atual de membros e perfis previstos na área
            Equipe.
          </p>

          <button
            type="button"
            onClick={
              onOpenTeam
            }
            className="mt-4 text-[9px] font-semibold uppercase tracking-[0.09em] text-[#356f9f]"
          >
            Abrir equipe →
          </button>
        </section>
      </aside>
    </div>
  );
}

/*
 * ============================================================
 * INTEGRAÇÕES
 * ============================================================
 */

function IntegrationsTab({
  integrations,
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {integrations.map(
        (integration) => (
          <section
            key={
              integration.id
            }
            className="rounded-[20px] border border-[#d1dde4] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-[#c7dae4] bg-[#edf6fa] text-xs font-semibold text-[#5681a0]">
                {integration.name.charAt(
                  0,
                )}
              </span>

              <IntegrationStatus
                status={
                  integration.status
                }
              />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-[#17394f]">
              {
                integration.name
              }
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#718795]">
              {
                integration.description
              }
            </p>

            <div className="mt-5 border-t border-[#e5ebef] pt-4">
              <p className="text-[9px] leading-4 text-[#8a9aa3]">
                Configuração será habilitada quando os requisitos técnicos e
                corporativos forem definidos.
              </p>
            </div>
          </section>
        ),
      )}
    </div>
  );
}

/*
 * ============================================================
 * AUDITORIA
 * ============================================================
 */

function AuditTab({
  events,
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white">
      <div className="border-b border-[#e2e9ed] px-5 py-5 sm:px-6">
        <p className="text-sm font-semibold text-[#17394f]">
          Histórico administrativo
        </p>

        <p className="mt-1 text-xs text-[#7e919c]">
          Eventos relevantes relacionados à configuração do portal.
        </p>
      </div>

      {events.length >
      0 ? (
        <div className="divide-y divide-[#e5ebef]">
          {events.map(
            (event) => (
              <div
                key={
                  event.id
                }
                className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[140px_1fr_180px]"
              >
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.09em] text-[#8999a3]">
                    Data
                  </p>

                  <p className="mt-1.5 text-xs font-semibold text-[#536f80]">
                    {
                      event.date
                    }
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold text-[#31566d]">
                      {
                        event.action
                      }
                    </p>

                    <span className="rounded-full border border-[#d2e1e8] bg-[#f5f9fb] px-2.5 py-1 text-[8px] font-semibold text-[#668090]">
                      {
                        event.area
                      }
                    </span>
                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-[#82949e]">
                    {
                      event.description
                    }
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.09em] text-[#8999a3]">
                    Responsável
                  </p>

                  <p className="mt-1.5 text-xs font-semibold text-[#536f80]">
                    {
                      event.actor
                    }
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="px-6 py-14 text-center">
          <p className="text-xs text-[#82949e]">
            Nenhum evento registrado.
          </p>
        </div>
      )}
    </section>
  );
}

/*
 * ============================================================
 * COMPONENTES — GERAL
 * ============================================================
 */

function NumberSetting({
  label,
  value,
  onChange,
  suffix,
  help,
  allowZero = false,
}) {
  return (
    <label>
      <span className={labelClasses}>
        {label}
      </span>

      <div className="relative mt-2">
        <input
          type="number"
          min="0"
          value={
            value
          }
          onChange={(event) => {
            const number =
              Number(
                event.target.value,
              );

            if (
              allowZero
            ) {
              onChange(
                Math.max(
                  0,
                  number || 0,
                ),
              );

              return;
            }

            onChange(
              Math.max(
                1,
                number || 1,
              ),
            );
          }}
          className={`${inputClasses} pr-16`}
        />

        <span className="pointer-events-none absolute right-4 top-[22px] -translate-y-1/2 text-[9px] text-[#84949e]">
          {suffix}
        </span>
      </div>

      {help && (
        <p className="mt-2 text-[9px] leading-4 text-[#8a9aa3]">
          {help}
        </p>
      )}
    </label>
  );
}

function SelectSetting({
  label,
  value,
  onChange,
  options,
  help,
}) {
  return (
    <label>
      <span className={labelClasses}>
        {label}
      </span>

      <select
        value={
          value
        }
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className={`${inputClasses} mt-2`}
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          ),
        )}
      </select>

      {help && (
        <p className="mt-2 text-[9px] leading-4 text-[#8a9aa3]">
          {help}
        </p>
      )}
    </label>
  );
}

function PrefixSetting({
  label,
  value,
  example,
  onChange,
}) {
  return (
    <label className="rounded-[15px] border border-[#d9e3e8] bg-[#f8fafb] p-4">
      <span className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#718895]">
        {label}
      </span>

      <input
        type="text"
        maxLength={5}
        value={
          value
        }
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-3 h-10 w-full rounded-[10px] border border-[#d3dfe6] bg-white px-3 text-sm font-semibold uppercase tracking-[0.1em] text-[#31566d] outline-none transition focus:border-[#78a9c4]"
      />

      <p className="mt-3 text-[9px] text-[#8a9aa3]">
        Exemplo:{" "}
        <span className="font-semibold text-[#607989]">
          {example}
        </span>
      </p>
    </label>
  );
}

function FlowRule({
  title,
  description,
  enabled,
  status,
  onChange,
  implemented = false,
  prepared = false,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[15px] border border-[#d9e3e8] bg-[#f8fafb] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold text-[#31566d]">
            {title}
          </p>

          {implemented && (
            <span className="rounded-full border border-[#b8d6c4] bg-[#edf7f1] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.07em] text-[#397250]">
              Em uso
            </span>
          )}

          {prepared && (
            <span className="rounded-full border border-[#d9d4bb] bg-[#f7f3e7] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.07em] text-[#806b36]">
              Preparada
            </span>
          )}
        </div>

        <p className="mt-1.5 max-w-2xl text-[10px] leading-5 text-[#82949e]">
          {description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.07em]

            ${
              enabled
                ? "text-[#397250]"
                : "text-[#8a979f]"
            }
          `}
        >
          {status}
        </span>

        <Toggle
          enabled={
            enabled
          }
          onChange={
            onChange
          }
        />
      </div>
    </div>
  );
}

function AdminShortcut({
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="group flex w-full items-center justify-between gap-4 rounded-[13px] border border-[#c9dce5] bg-white/75 p-3.5 text-left transition hover:border-[#98bccd] hover:bg-white"
    >
      <div>
        <p className="text-[10px] font-semibold text-[#31566d]">
          {title}
        </p>

        <p className="mt-1 text-[8px] leading-4 text-[#83949e]">
          {description}
        </p>
      </div>

      <span className="shrink-0 text-xs text-[#7c9eb0] transition group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}

function ProcessFlow() {
  const items = [
    {
      label:
        "Solicitação",

      code:
        "SOL",
    },

    {
      label:
        "Orçamento",

      code:
        "ORC",
    },

    {
      label:
        "Projeto",

      code:
        "PRJ",
    },
  ];

  return (
    <div className="space-y-0">
      {items.map(
        (
          item,
          index,
        ) => (
          <div
            key={
              item.code
            }
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c7dae4] bg-[#edf6fa] text-[8px] font-semibold text-[#5681a0]">
                {
                  item.code
                }
              </span>

              <p className="text-[10px] font-semibold text-[#536f80]">
                {
                  item.label
                }
              </p>
            </div>

            {index <
              items.length -
                1 && (
              <div className="ml-[15px] h-5 w-px bg-[#d3e0e6]" />
            )}
          </div>
        ),
      )}
    </div>
  );
}

/*
 * ============================================================
 * COMPONENTES GERAIS
 * ============================================================
 */

function DayInput({
  label,
  value,
  onChange,
  disabled,
}) {
  return (
    <label>
      <span className={labelClasses}>
        {label}
      </span>

      <div className="relative mt-2">
        <input
          type="number"
          min="0"
          value={
            value
          }
          disabled={
            disabled
          }
          onChange={(event) =>
            onChange(
              Math.max(
                0,
                Number(
                  event.target.value,
                ) || 0,
              ),
            )
          }
          className={`${inputClasses} pr-14 disabled:cursor-not-allowed disabled:bg-[#eef2f4]`}
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#84949e]">
          dias
        </span>
      </div>
    </label>
  );
}

function Toggle({
  enabled,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(
          !enabled,
        )
      }
      className={`
        relative
        h-7 w-12
        shrink-0
        rounded-full
        transition

        ${
          enabled
            ? "bg-[#1684c5]"
            : "bg-[#cbd5db]"
        }
      `}
      aria-label={
        enabled
          ? "Desativar"
          : "Ativar"
      }
    >
      <span
        className={`
          absolute
          top-1
          h-5 w-5
          rounded-full
          bg-white
          shadow-sm
          transition-all

          ${
            enabled
              ? "left-6"
              : "left-1"
          }
        `}
      />
    </button>
  );
}

function SecurityItem({
  title,
  value,
  status,
  description,
}) {
  return (
    <div className="rounded-[16px] border border-[#d9e3e8] bg-[#f8fafb] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#31566d]">
            {title}
          </p>

          <p className="mt-1 text-[10px] font-medium text-[#718795]">
            {value}
          </p>
        </div>

        <span className="rounded-full border border-[#d0dde4] bg-white px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.06em] text-[#667f8e]">
          {status}
        </span>
      </div>

      <p className="mt-3 text-[10px] leading-5 text-[#8797a0]">
        {description}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  compact = false,
}) {
  return (
    <div className="rounded-[20px] border border-[#d1dde4] bg-white p-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718895]">
        {label}
      </p>

      <p
        className={`
          mt-3
          font-semibold
          tracking-[-0.035em]
          text-[#17394f]

          ${
            compact
              ? "text-lg"
              : "text-3xl"
          }
        `}
      >
        {value}
      </p>

      <p className="mt-3 text-[10px] leading-5 text-[#84949e]">
        {description}
      </p>
    </div>
  );
}

function InfoBox({
  title,
  text,
}) {
  return (
    <section className="rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5681a0]">
        {title}
      </p>

      <p className="mt-3 text-xs leading-5 text-[#6d8390]">
        {text}
      </p>
    </section>
  );
}

function IntegrationStatus({
  status,
}) {
  return (
    <span className="rounded-full border border-[#d4d9dc] bg-[#f4f6f7] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.07em] text-[#707d84]">
      {status}
    </span>
  );
}

function sanitizePrefix(
  value,
) {
  return String(
    value ?? "",
  )
    .toUpperCase()
    .replace(
      /[^A-Z0-9]/g,
      "",
    )
    .slice(
      0,
      5,
    );
}

const labelClasses =
  "text-[9px] font-semibold uppercase tracking-[0.09em] text-[#607989]";

const inputClasses = `
  h-11
  w-full
  rounded-[11px]
  border border-[#d3dfe6]
  bg-[#f8fafb]
  px-4
  text-xs
  text-[#294e64]
  outline-none
  transition
  focus:border-[#78a9c4]
  focus:bg-white
`;