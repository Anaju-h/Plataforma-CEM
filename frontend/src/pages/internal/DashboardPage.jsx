import {
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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

export function DashboardPage() {
  const navigate =
    useNavigate();

  const dashboard =
    useMemo(
      () =>
        buildDashboardData(
          currentUser,
        ),
      [],
    );

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5681a0]">
            Visão geral
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0b2340]">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#6b8190]">
            Acompanhe as principais atividades e situações que precisam de atenção.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/solicitacoes",
            )
          }
          className="w-fit rounded-[12px] bg-[#096ab2] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#075b99]"
        >
          Ver solicitações
        </button>
      </div>

      {/* =====================================================
          INDICADORES
      ===================================================== */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <IndicatorCard
          label="Solicitações abertas"
          value={
            dashboard.activeRequests
          }
          detail={
            dashboard.requestDetail
          }
          onClick={() =>
            navigate(
              "/portal/solicitacoes",
            )
          }
        />

        <IndicatorCard
          label="Orçamentos em andamento"
          value={
            dashboard.activeQuotes
          }
          detail={
            dashboard.quoteDetail
          }
          onClick={() =>
            navigate(
              "/portal/orcamentos",
            )
          }
        />

        <IndicatorCard
          label="Projetos ativos"
          value={
            dashboard.activeProjects
          }
          detail={
            dashboard.projectDetail
          }
          onClick={() =>
            navigate(
              "/portal/projetos",
            )
          }
        />

        <IndicatorCard
          label="Precisam de atenção"
          value={
            dashboard.attentionCount
          }
          detail={
            dashboard.attentionDetail
          }
          emphasis={
            dashboard.attentionCount >
            0
          }
          onClick={() =>
            navigate(
              "/portal/meu-trabalho",
            )
          }
        />
      </div>

      {/* =====================================================
          CONTEÚDO PRINCIPAL
      ===================================================== */}

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        {/* ===================================================
            SOLICITAÇÕES RECENTES
        =================================================== */}

        <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 shadow-[0_12px_35px_rgba(34,67,90,0.035)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#17394f]">
                Solicitações recentes
              </p>

              <p className="mt-1 text-xs text-[#7a8d98]">
                Últimas entradas ainda relevantes no fluxo.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/portal/solicitacoes",
                )
              }
              className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#356f9f]"
            >
              Ver todas
            </button>
          </div>

          {dashboard.recentRequests.length >
          0 ? (
            <div className="mt-5 space-y-2">
              {dashboard.recentRequests.map(
                (request) => (
                  <RequestRow
                    key={
                      request.id
                    }
                    request={
                      request
                    }
                    onClick={() =>
                      navigate(
                        `/portal/solicitacoes/${request.id}`,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyState text="Nenhuma solicitação recente." />
          )}
        </section>

        {/* ===================================================
            PRIORIDADES
        =================================================== */}

        <section className="rounded-[22px] border border-[#c7d9e3] bg-[#e5eff5] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
                Prioridades
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#17394f]">
                O que merece atenção?
              </h2>
            </div>

            {dashboard.urgentCount >
              0 && (
              <span className="rounded-full border border-[#e1c1b7] bg-[#f9ece8] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.07em] text-[#a45640]">
                {
                  dashboard.urgentCount
                }{" "}
                urgente
                {dashboard.urgentCount ===
                1
                  ? ""
                  : "s"}
              </span>
            )}
          </div>

          {dashboard.priorityItems.length >
          0 ? (
            <div className="mt-5 space-y-2">
              {dashboard.priorityItems.map(
                (
                  item,
                  index,
                ) => (
                  <PriorityAction
                    key={
                      item.id
                    }
                    number={String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                    item={
                      item
                    }
                    onClick={() =>
                      navigate(
                        item.route,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-[14px] border border-[#c3d5df] bg-white/60 px-4 py-8 text-center">
              <p className="text-xs font-semibold text-[#526f81]">
                Nenhuma prioridade crítica no momento.
              </p>

              <p className="mt-1 text-[9px] text-[#82949e]">
                O motor de atenção continuará acompanhando o fluxo.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/portal/meu-trabalho",
              )
            }
            className="mt-4 w-full rounded-[12px] border border-[#b5ccd8] bg-white/70 px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#356f9f] transition hover:bg-white"
          >
            Abrir Meu trabalho
          </button>
        </section>
      </div>

      {/* =====================================================
          SEGUNDA LINHA
      ===================================================== */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        {/* ===================================================
            PROJETOS
        =================================================== */}

        <section className="overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white shadow-[0_10px_30px_rgba(34,67,90,0.025)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#e2e9ed] px-5 py-5 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-[#17394f]">
                Projetos em andamento
              </p>

              <p className="mt-1 text-xs text-[#7e919c]">
                Visão rápida da execução atual.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/portal/projetos",
                )
              }
              className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#356f9f]"
            >
              Ver todos →
            </button>
          </div>

          {dashboard.recentProjects.length >
          0 ? (
            <div className="divide-y divide-[#e5ebef]">
              {dashboard.recentProjects.map(
                (project) => (
                  <ProjectRow
                    key={
                      project.id
                    }
                    project={
                      project
                    }
                    onClick={() =>
                      navigate(
                        `/portal/projetos/${project.id}`,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyState text="Nenhum projeto ativo." />
          )}
        </section>

        {/* ===================================================
            ACESSO RÁPIDO
        =================================================== */}

        <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
            Acesso rápido
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#17394f]">
            Áreas frequentes
          </h2>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <QuickAction
              number="01"
              title="Solicitações"
              detail="Analisar novas entradas."
              onClick={() =>
                navigate(
                  "/portal/solicitacoes",
                )
              }
            />

            <QuickAction
              number="02"
              title="Orçamentos"
              detail="Acompanhar propostas."
              onClick={() =>
                navigate(
                  "/portal/orcamentos",
                )
              }
            />

            <QuickAction
              number="03"
              title="Conhecimento"
              detail="Consultar referências."
              onClick={() =>
                navigate(
                  "/portal/conhecimento",
                )
              }
            />

            <QuickAction
              number="04"
              title="Equipamentos e custos"
              detail="Consultar parâmetros."
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

/*
 * ============================================================
 * DADOS DA DASHBOARD
 * ============================================================
 */

function buildDashboardData(
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
        4,
      );

  const recentProjects =
    [...activeProjects]
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
        4,
      );

  const priorityItems =
    work.attentionItems.slice(
      0,
      4,
    );

  return {
    activeRequests:
      openRequests.length,

    activeQuotes:
      activeQuotes.length,

    activeProjects:
      activeProjects.length,

    attentionCount:
      work.attentionCount,

    urgentCount:
      work.urgentCount,

    recentRequests,

    recentProjects,

    priorityItems,

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

/*
 * ============================================================
 * INDICADOR
 * ============================================================
 */

function IndicatorCard({
  label,
  value,
  detail,
  emphasis = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        group
        rounded-[20px]
        border
        p-5
        text-left
        shadow-[0_10px_30px_rgba(34,67,90,0.025)]
        transition
        hover:-translate-y-[1px]
        hover:shadow-[0_14px_35px_rgba(34,67,90,0.055)]

        ${
          emphasis
            ? "border-[#bdd5e1] bg-[#edf6fa]"
            : "border-[#d1dde4] bg-white"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={`
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.11em]

            ${
              emphasis
                ? "text-[#5681a0]"
                : "text-[#718895]"
            }
          `}
        >
          {label}
        </p>

        <span className="text-xs text-[#a0adb4] transition group-hover:translate-x-1 group-hover:text-[#5681a0]">
          →
        </span>
      </div>

      <p
        className={`
          mt-3
          text-3xl
          font-semibold
          tracking-[-0.04em]

          ${
            emphasis
              ? "text-[#096ab2]"
              : "text-[#0b2340]"
          }
        `}
      >
        {formatCount(
          value,
        )}
      </p>

      <div
        className={`
          mt-4 h-px

          ${
            emphasis
              ? "bg-[#cfdee6]"
              : "bg-[#e1e8ec]"
          }
        `}
      />

      <p className="mt-3 text-[11px] text-[#748995]">
        {detail}
      </p>
    </button>
  );
}

/*
 * ============================================================
 * SOLICITAÇÃO
 * ============================================================
 */

function RequestRow({
  request,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="group grid w-full grid-cols-[1fr_auto] gap-4 rounded-[15px] border border-[#dde6eb] bg-[#f9fbfc] px-4 py-4 text-left transition hover:border-[#a8c3d2] hover:bg-[#f3f8fa]"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.08em] text-[#356f9f]">
            {
              request.id
            }
          </span>

          <span className="text-[9px] text-[#9aa8b1]">
            {request.updatedAt ??
              request.createdAt}
          </span>
        </div>

        <p className="mt-2 truncate text-sm font-semibold text-[#17394f] transition group-hover:text-[#096ab2]">
          {
            request.company
          }
        </p>

        <p className="mt-1 text-[11px] text-[#758a96]">
          {
            request.service
          }
        </p>
      </div>

      <span className="self-center rounded-full border border-[#c9dce7] bg-[#e8f2f7] px-3 py-1.5 text-[9px] font-semibold text-[#47758f]">
        {
          request.status
        }
      </span>
    </button>
  );
}

/*
 * ============================================================
 * PRIORIDADE
 * ============================================================
 */

function PriorityAction({
  number,
  item,
  onClick,
}) {
  const urgent =
    item.level ===
    "urgent";

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        group
        flex w-full
        items-center gap-4
        rounded-[14px]
        border
        px-4 py-3.5
        text-left
        transition
        hover:bg-white

        ${
          urgent
            ? "border-[#e0c5bb] bg-[#f9efeb]"
            : "border-[#c3d5df] bg-white/65"
        }
      `}
    >
      <span
        className={`
          flex h-8 w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          text-[9px]
          font-semibold

          ${
            urgent
              ? "border-[#dfbeb3] bg-white text-[#a45640]"
              : "border-[#b9ced9] bg-white text-[#47758f]"
          }
        `}
      >
        {number}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.07em]

              ${
                urgent
                  ? "text-[#a45640]"
                  : "text-[#5681a0]"
              }
            `}
          >
            {
              item.urgencyLabel
            }
          </span>

          <span className="text-[8px] text-[#8a9aa3]">
            {
              item.referenceId
            }
          </span>
        </div>

        <p className="mt-1 text-xs font-semibold text-[#31566d]">
          {item.title}
        </p>

        <p className="mt-1 truncate text-[9px] text-[#83949e]">
          {item.company}
        </p>
      </div>

      <span className="text-[#65899f] transition-transform group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}

/*
 * ============================================================
 * PROJETO
 * ============================================================
 */

function ProjectRow({
  project,
  onClick,
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
        onClick
      }
      className="group w-full px-5 py-4 text-left transition hover:bg-[#f8fafb] sm:px-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#5681a0]">
            {project.id}
          </p>

          <p className="mt-1.5 truncate text-xs font-semibold text-[#31566d] transition group-hover:text-[#096ab2]">
            {
              project.company
            }
          </p>

          <p className="mt-1 text-[9px] text-[#83949e]">
            {
              project.service
            }
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-semibold text-[#5681a0]">
            {progress}%
          </p>

          <p className="mt-1 text-[8px] text-[#95a3ab]">
            {
              project.deadline
            }
          </p>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e3eaee]">
        <div
          className="h-full rounded-full bg-[#1684c5]"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </button>
  );
}

/*
 * ============================================================
 * ACESSO RÁPIDO
 * ============================================================
 */

function QuickAction({
  number,
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
      className="group flex w-full items-center gap-4 rounded-[14px] border border-[#d5e1e7] bg-[#f8fafb] px-4 py-3.5 text-left transition hover:border-[#9fbfce] hover:bg-white"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c5d8e2] bg-white text-[9px] font-semibold text-[#47758f]">
        {number}
      </span>

      <div className="min-w-0 flex-1">
        <span className="text-xs font-semibold text-[#31566d]">
          {title}
        </span>

        <p className="mt-1 text-[9px] text-[#8a9aa3]">
          {detail}
        </p>
      </div>

      <span className="text-[#65899f] transition-transform group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}

/*
 * ============================================================
 * VAZIO
 * ============================================================
 */

function EmptyState({
  text,
}) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-xs text-[#82949e]">
        {text}
      </p>
    </div>
  );
}

/*
 * ============================================================
 * UTILITÁRIOS
 * ============================================================
 */

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

function formatCount(
  value,
) {
  return String(
    value ?? 0,
  ).padStart(
    2,
    "0",
  );
}