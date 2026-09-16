import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import {
  ProjectStatusBadge,
} from "../../components/internal/ProjectStatusBadge";

import {
  getRuntimeRequests,
} from "../../services/requestService";

import {
  getRuntimeQuotes,
} from "../../services/quoteService";

import {
  getRuntimeProjects,
} from "../../services/projectService";

import {
  getCurrentUserWork,
} from "../../services/workService";

const currentUser =
  "Administrador";

export function MyWorkPage() {
  const navigate =
    useNavigate();

  const data =
    useMemo(
      () =>
        buildWorkData(
          currentUser,
        ),
      [],
    );

  const [
    attentionFilter,
    setAttentionFilter,
  ] = useState(
    "all",
  );

  const visibleAttention =
    data.work.attentionItems.filter(
      (item) => {
        if (
          attentionFilter ===
          "all"
        ) {
          return true;
        }

        return (
          item.type ===
          attentionFilter
        );
      },
    );

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Visão geral"
        title="Meu trabalho"
        description="Acompanhe o fluxo do laboratório, suas responsabilidades e as situações que precisam de ação."
      />

      {/* =====================================================
          INDICADORES
      ===================================================== */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Solicitações abertas"
          value={
            data.openRequests.length
          }
          description={
            data.requestDetail
          }
          onClick={() =>
            navigate(
              "/portal/solicitacoes",
            )
          }
        />

        <MetricCard
          label="Orçamentos em andamento"
          value={
            data.activeQuotes.length
          }
          description={
            data.quoteDetail
          }
          onClick={() =>
            navigate(
              "/portal/orcamentos",
            )
          }
        />

        <MetricCard
          label="Projetos ativos"
          value={
            data.activeProjects.length
          }
          description={
            data.projectDetail
          }
          onClick={() =>
            navigate(
              "/portal/projetos",
            )
          }
        />

        <MetricCard
          label="Precisam de atenção"
          value={
            data.work.attentionCount
          }
          description={
            data.attentionDetail
          }
          emphasis={
            data.work.attentionCount >
            0
          }
        />
      </div>

      {/* =====================================================
          ATENÇÃO
      ===================================================== */}

      <section className="mt-6 overflow-hidden rounded-[22px] border border-[#c8d8e1] bg-white shadow-[0_12px_34px_rgba(7,31,45,0.045)]">
        <div className="flex flex-col gap-4 border-b border-[#dce6eb] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className="internal-card-title 
                flex h-9 w-9
                shrink-0 items-center justify-center
                rounded-full
                border border-[#b8d1de]
                bg-[#eaf4f8]
                 font-semibold
                text-[#296b90]
              "
            >
              !
            </span>

            <div>
              <p className="internal-section-title font-semibold text-[#17384d]">
                Precisam da minha atenção
              </p>

              <p className="internal-card-description mt-1 text-[#5c7584]">
                Situações que exigem uma decisão, revisão ou continuidade do fluxo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="internal-eyebrow hidden font-semibold uppercase text-[#607c8c] sm:block">
              Filtrar
            </span>

            <div className="relative">
              <select
                value={
                  attentionFilter
                }
                onChange={(event) =>
                  setAttentionFilter(
                    event.target.value,
                  )
                }
                className="internal-field-value 
                  h-10 min-w-[175px]
                  cursor-pointer
                  appearance-none
                  rounded-[10px]
                  border border-[#c3d4dd]
                  bg-[#f8fafb]
                  pl-3 pr-9
                  
                  font-semibold 
                  
                  text-[#405f70]
                  outline-none
                  transition
                  hover:border-[#91b2c3]
                  focus:border-[#6599b5]
                  focus:bg-white
                "
              >
                <option value="all">
                  Todos os tipos
                </option>

                <option value="request">
                  Solicitações
                </option>

                <option value="quote">
                  Orçamentos
                </option>

                <option value="project">
                  Projetos
                </option>
              </select>

              <span className="internal-help-text pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#567586]">
                ▾
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7edf0] bg-[#f8fafb] px-5 py-3 sm:px-6">
          <p className="internal-help-text text-[#607988]">
            Exibindo{" "}
            <span className="font-semibold text-[#274b60]">
              {
                visibleAttention.length
              }
            </span>{" "}
            {visibleAttention.length ===
            1
              ? "situação"
              : "situações"}
          </p>

          {attentionFilter !==
            "all" && (
            <button
              type="button"
              onClick={() =>
                setAttentionFilter(
                  "all",
                )
              }
              className="internal-eyebrow font-semibold uppercase text-[#356f9f] hover:text-[#0057b8]"
            >
              Limpar filtro
            </button>
          )}
        </div>

        {visibleAttention.length >
        0 ? (
          <div className="divide-y divide-[#e2e9ed]">
            {visibleAttention.map(
              (item) => (
                <AttentionRow
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  onOpen={() =>
                    navigate(
                      item.route,
                    )
                  }
                />
              ),
            )}
          </div>
        ) : (
          <EmptyState
            title="Nada exige atenção neste filtro."
            description="Quando alguma etapa precisar de uma ação, ela aparecerá aqui."
          />
        )}
      </section>

      {/* =====================================================
          SOLICITAÇÕES + PROJETOS
      ===================================================== */}

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="overflow-hidden rounded-[22px] border border-[#cddbe3] bg-white shadow-[0_10px_30px_rgba(7,31,45,0.035)]">
          <SectionHeader
            title="Solicitações recentes"
            description="Entradas que ainda fazem parte do fluxo atual."
            buttonLabel="Ver todas"
            onClick={() =>
              navigate(
                "/portal/solicitacoes",
              )
            }
          />

          {data.recentRequests.length >
          0 ? (
            <div className="divide-y divide-[#e3eaee]">
              {data.recentRequests.map(
                (request) => (
                  <RequestRow
                    key={
                      request.id
                    }
                    request={
                      request
                    }
                    onOpen={() =>
                      navigate(
                        `/portal/solicitacoes/${request.id}`,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyState
              title="Nenhuma solicitação recente."
              description="Novas entradas aparecerão nesta área."
            />
          )}
        </section>

        <section className="overflow-hidden rounded-[22px] border border-[#cddbe3] bg-white shadow-[0_10px_30px_rgba(7,31,45,0.035)]">
          <SectionHeader
            title="Projetos em andamento"
            description="Acompanhamento dos projetos ativos."
            buttonLabel="Ver todos"
            onClick={() =>
              navigate(
                "/portal/projetos",
              )
            }
          />

          {data.activeProjects.length >
          0 ? (
            <div className="divide-y divide-[#e3eaee]">
              {data.activeProjects
                .slice(
                  0,
                  5,
                )
                .map(
                  (project) => (
                    <ProjectRow
                      key={
                        project.id
                      }
                      project={
                        project
                      }
                      onOpen={() =>
                        navigate(
                          `/portal/projetos/${project.id}`,
                        )
                      }
                    />
                  ),
                )}
            </div>
          ) : (
            <EmptyState
              title="Nenhum projeto ativo."
              description="Projetos em andamento aparecerão aqui."
            />
          )}
        </section>
      </div>

      {/* =====================================================
          PRAZOS + ACESSOS
      ===================================================== */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <section className="overflow-hidden rounded-[22px] border border-[#cddbe3] bg-white">
          <SectionHeader
            title="Próximos prazos"
            description="Projetos organizados pela proximidade da data prevista."
          />

          {data.work.upcomingDeadlines
            .length > 0 ? (
            <div className="divide-y divide-[#e3eaee]">
              {data.work.upcomingDeadlines.map(
                (item) => (
                  <DeadlineRow
                    key={
                      item.projectId
                    }
                    item={
                      item
                    }
                    onOpen={() =>
                      navigate(
                        item.route,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyState
              title="Nenhum prazo próximo."
              description="Projetos com datas previstas aparecerão aqui."
            />
          )}
        </section>

        <section className="rounded-[22px] border border-[#c5d7e0] bg-[#e8f1f5] p-5 sm:p-6">
          <p className="internal-eyebrow font-semibold uppercase text-[#47738c]">
            Acesso rápido
          </p>

          <h2 className="internal-section-title mt-2 font-semibold text-[#17384d]">
            Áreas frequentes
          </h2>

          <div className="mt-5 grid gap-2">
            <QuickAction
              title="Solicitações"
              detail="Analisar novas entradas."
              onClick={() =>
                navigate(
                  "/portal/solicitacoes",
                )
              }
            />

            <QuickAction
              title="Orçamentos"
              detail="Criar e acompanhar propostas."
              onClick={() =>
                navigate(
                  "/portal/orcamentos",
                )
              }
            />

            <QuickAction
              title="Base de conhecimento"
              detail="Consultar regras e referências."
              onClick={() =>
                navigate(
                  "/portal/conhecimento",
                )
              }
            />

            <QuickAction
              title="Equipamentos e custos"
              detail="Consultar parâmetros internos."
              onClick={() =>
                navigate(
                  "/portal/equipamentos-custos",
                )
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
 * DADOS
 * ============================================================ */

function buildWorkData(
  currentUser,
) {
  const requests =
    getRuntimeRequests();

  const quotes =
    getRuntimeQuotes();

  const projects =
    getRuntimeProjects();

  const work =
    getCurrentUserWork(
      currentUser,
    );

  const openRequests =
    requests.filter(
      (request) =>
        ![
          "Convertida em orçamento",
          "Recusada",
          "Cancelada",
        ].includes(
          request.status,
        ),
    );

  const activeQuotes =
    quotes.filter(
      (quote) =>
        ![
          "Aceito",
          "Recusado",
          "Cancelado",
        ].includes(
          quote.status,
        ),
    );

  const activeProjects =
    projects.filter(
      (project) =>
        ![
          "Concluído",
          "Cancelado",
        ].includes(
          project.status,
        ),
    );

  const newRequests =
    openRequests.filter(
      (request) =>
        request.status ===
        "Nova",
    ).length;

  const analysisRequests =
    openRequests.filter(
      (request) =>
        request.status ===
        "Em análise",
    ).length;

  const reviewQuotes =
    activeQuotes.filter(
      (quote) =>
        quote.status ===
        "Em revisão",
    ).length;

  const executionProjects =
    activeProjects.filter(
      (project) =>
        project.status ===
        "Em andamento",
    ).length;

  const recentRequests =
    [...openRequests]
      .sort(
        (a, b) =>
          parseDate(
            b.updatedAt ??
              b.createdAt,
          ) -
          parseDate(
            a.updatedAt ??
              a.createdAt,
          ),
      )
      .slice(
        0,
        5,
      );

  return {
    work,
    openRequests,
    activeQuotes,
    activeProjects,
    recentRequests,

    requestDetail:
      newRequests > 0
        ? `${newRequests} nova${newRequests === 1 ? "" : "s"} aguardando análise`
        : analysisRequests > 0
          ? `${analysisRequests} em análise`
          : "Fluxo sem novas entradas",

    quoteDetail:
      reviewQuotes > 0
        ? `${reviewQuotes} aguardando revisão`
        : activeQuotes.length > 0
          ? "Propostas em andamento"
          : "Nenhuma proposta aberta",

    projectDetail:
      executionProjects > 0
        ? `${executionProjects} em execução`
        : activeProjects.length > 0
          ? "Projetos em planejamento"
          : "Nenhum projeto ativo",

    attentionDetail:
      work.urgentCount > 0
        ? `${work.urgentCount} situação${work.urgentCount === 1 ? "" : "ões"} urgente${work.urgentCount === 1 ? "" : "s"}`
        : work.attentionCount > 0
          ? "Itens organizados por prioridade"
          : "Nenhuma situação crítica",
  };
}

/* ============================================================
 * COMPONENTES
 * ============================================================ */

function MetricCard({
  label,
  value,
  description,
  emphasis = false,
  onClick,
}) {
  const Component =
    onClick
      ? "button"
      : "div";

  return (
    <Component
      type={
        onClick
          ? "button"
          : undefined
      }
      onClick={
        onClick
      }
      className={`
        group rounded-[20px]
        border p-5
        text-left
        shadow-[0_10px_30px_rgba(7,31,45,0.03)]
        transition

        ${
          onClick
            ? "hover:-translate-y-[1px] hover:shadow-[0_14px_34px_rgba(7,31,45,0.06)]"
            : ""
        }

        ${
          emphasis
            ? "border-[#b7d1df] bg-[#edf6fa]"
            : "border-[#cddbe3] bg-white"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="internal-eyebrow font-semibold uppercase text-[#557585]">
          {label}
        </p>

        {onClick && (
          <span className="internal-help-text text-[#526d7c] transition group-hover:translate-x-1">
            →
          </span>
        )}
      </div>

      <p
        className={`
          mt-3 text-[32px]
          font-semibold tracking-[-0.04em]

          ${
            emphasis
              ? "text-[#0057b8]"
              : "text-[#071f2d]"
          }
        `}
      >
        {value}
      </p>

      <p className="internal-card-description mt-3 text-[#587282]">
        {description}
      </p>
    </Component>
  );
}

function SectionHeader({
  title,
  description,
  buttonLabel,
  onClick,
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#dce6eb] px-5 py-5 sm:px-6">
      <div>
        <p className="text-[15px] font-semibold text-[#17384d]">
          {title}
        </p>

        <p className="internal-card-description mt-1 text-[#607988]">
          {description}
        </p>
      </div>

      {buttonLabel && (
        <button
          type="button"
          onClick={
            onClick
          }
          className="internal-eyebrow shrink-0 font-semibold uppercase text-[#356f9f] hover:text-[#0057b8]"
        >
          {buttonLabel} →
        </button>
      )}
    </div>
  );
}

function AttentionRow({
  item,
  onOpen,
}) {
  const style =
    getUrgencyStyle(
      item.urgency,
    );

  return (
    <button
      type="button"
      onClick={
        onOpen
      }
      className="group flex w-full gap-4 px-5 py-5 text-left transition hover:bg-[#f6f9fa] sm:px-6"
    >
      <span
        className={`internal-card-title 
          mt-0.5
          flex h-10 w-10
          shrink-0 items-center justify-center
          rounded-full
          border
           font-semibold
          ${style.icon}
        `}
      >
        {getTypeInitial(
          item.type,
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`internal-eyebrow 
              rounded-full
              border
              px-2.5 py-1
              
              font-semibold uppercase
              
              ${style.badge}
            `}
          >
            {
              item.urgencyLabel
            }
          </span>

          <span className="internal-eyebrow font-semibold uppercase text-[#607988]">
            {
              item.referenceId
            }
          </span>

          <span className="internal-help-text text-[#526d7c]">
            ·
          </span>

          <span className="internal-help-text text-[#607988]">
            {getTypeLabel(
              item.type,
            )}
          </span>
        </div>

        <p className="internal-card-title mt-2 font-semibold text-[#294e64] group-hover:text-[#0057b8]">
          {item.title}
        </p>

        <p className="internal-card-title mt-1 font-medium text-[#506d7d]">
          {item.company}
        </p>

        <p className="internal-card-description mt-1.5 text-[#617a88]">
          {
            item.description
          }
        </p>
      </div>

      <span className="mt-2 shrink-0 text-[15px] text-[#526d7c] transition group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}

function RequestRow({
  request,
  onOpen,
}) {
  return (
    <button
      type="button"
      onClick={
        onOpen
      }
      className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#f6f9fa] sm:px-6"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="internal-eyebrow font-semibold uppercase text-[#356f9f]">
            {
              request.id
            }
          </span>

          <span className="internal-help-text text-[#637d8b]">
            {request.updatedAt ??
              request.createdAt}
          </span>
        </div>

        <p className="internal-card-title mt-1.5 truncate font-semibold text-[#294e64] group-hover:text-[#0057b8]">
          {
            request.company
          }
        </p>

        <p className="internal-help-text mt-1 text-[#607988]">
          {
            request.service
          }
        </p>
      </div>

      <span className="internal-card-title shrink-0 rounded-full border border-[#bfd4df] bg-[#e9f2f6] px-3 py-1.5 font-semibold text-[#3f6f88]">
        {
          request.status
        }
      </span>
    </button>
  );
}

function ProjectRow({
  project,
  onOpen,
}) {
  const completed =
    project.tasks.filter(
      (task) =>
        task.completed,
    ).length;

  const progress =
    project.tasks.length
      ? Math.round(
          (completed /
            project.tasks.length) *
            100,
        )
      : 0;

  return (
    <button
      type="button"
      onClick={
        onOpen
      }
      className="group w-full px-5 py-4 text-left transition hover:bg-[#f6f9fa] sm:px-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="internal-eyebrow font-semibold uppercase text-[#356f9f]">
            {project.id}
          </p>

          <p className="internal-card-title mt-1.5 truncate font-semibold text-[#294e64] group-hover:text-[#0057b8]">
            {
              project.company
            }
          </p>

          <p className="internal-help-text mt-1 text-[#607988]">
            {
              project.service
            }{" "}
            ·{" "}
            {
              project.machine
            }
          </p>
        </div>

        <ProjectStatusBadge
          status={
            project.status
          }
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dfe8ec]">
          <div
            className="h-full rounded-full bg-[#1684c5]"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <span className="internal-card-title w-9 text-right font-semibold text-[#356f9f]">
          {progress}%
        </span>
      </div>
    </button>
  );
}

function DeadlineRow({
  item,
  onOpen,
}) {
  const urgent =
    item.daysRemaining <=
    3;

  return (
    <button
      type="button"
      onClick={
        onOpen
      }
      className="group flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-[#f6f9fa] sm:px-6"
    >
      <div
        className={`
          flex h-12 w-12 shrink-0
          flex-col items-center justify-center
          rounded-[12px]
          border

          ${
            urgent
              ? "border-[#dfc2b2] bg-[#f8ece6]"
              : "border-[#bed5e1] bg-[#edf6fa]"
          }
        `}
      >
        <span
          className={`
            text-[15px] font-semibold

            ${
              urgent
                ? "text-[#9a5638]"
                : "text-[#397392]"
            }
          `}
        >
          {
            item.daysRemaining
          }
        </span>

        <span className="internal-eyebrow font-semibold uppercase text-[#607988]">
          dias
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="internal-eyebrow font-semibold uppercase text-[#356f9f]">
            {
              item.projectId
            }
          </p>

          {urgent && (
            <span className="internal-eyebrow rounded-full border border-[#dfc2b2] bg-[#f8ece6] px-2 py-0.5 font-semibold uppercase text-[#94563b]">
              Próximo
            </span>
          )}
        </div>

        <p className="internal-card-title mt-1.5 truncate font-semibold text-[#294e64] group-hover:text-[#0057b8]">
          {item.company}
        </p>

        <p className="internal-help-text mt-1 text-[#607988]">
          Prazo:{" "}
          {item.deadline}
        </p>
      </div>
    </button>
  );
}

function QuickAction({
  title,
  detail,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="group flex w-full items-center gap-4 rounded-[14px] border border-[#c8d9e1] bg-white/65 px-4 py-3.5 text-left transition hover:border-[#91b7ca] hover:bg-white"
    >
      <div className="min-w-0 flex-1">
        <p className="internal-card-title font-semibold text-[#294e64]">
          {title}
        </p>

        <p className="internal-help-text mt-1 text-[#607988]">
          {detail}
        </p>
      </div>

      <span className="text-[#567f95] transition group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}

function EmptyState({
  title,
  description,
}) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="internal-card-title font-semibold text-[#496878]">
        {title}
      </p>

      <p className="internal-card-description mx-auto mt-1.5 max-w-sm text-[#607988]">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
 * HELPERS
 * ============================================================ */

function getTypeInitial(
  type,
) {
  switch (type) {
    case "request":
      return "S";

    case "quote":
      return "O";

    case "project":
      return "P";

    default:
      return "•";
  }
}

function getTypeLabel(
  type,
) {
  switch (type) {
    case "request":
      return "Solicitação";

    case "quote":
      return "Orçamento";

    case "project":
      return "Projeto";

    default:
      return "Item";
  }
}

function getUrgencyStyle(
  urgency,
) {
  switch (urgency) {
    case "urgent":
      return {
        icon:
          "border-[#e0bfb2] bg-[#f8e9e4] text-[#a04f39]",

        badge:
          "border-[#e0bfb2] bg-[#f8e9e4] text-[#a04f39]",
      };

    case "deadline":
      return {
        icon:
          "border-[#e2cdb0] bg-[#f8f0e3] text-[#98703b]",

        badge:
          "border-[#e2cdb0] bg-[#f8f0e3] text-[#98703b]",
      };

    case "review":
      return {
        icon:
          "border-[#c9c8df] bg-[#efeff7] text-[#64628b]",

        badge:
          "border-[#c9c8df] bg-[#efeff7] text-[#64628b]",
      };

    case "attention":
    case "action":
      return {
        icon:
          "border-[#b8d5c3] bg-[#edf7f1] text-[#397250]",

        badge:
          "border-[#b8d5c3] bg-[#edf7f1] text-[#397250]",
      };

    default:
      return {
        icon:
          "border-[#c7dbe5] bg-[#edf6fa] text-[#397392]",

        badge:
          "border-[#c7dbe5] bg-[#edf6fa] text-[#397392]",
      };
  }
}

function parseDate(
  value,
) {
  if (!value) {
    return 0;
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
    return 0;
  }

  return new Date(
    year,
    month - 1,
    day,
  ).getTime();
}