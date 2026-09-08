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
  getCurrentUserWork,
} from "../../services/workService";

const currentUser =
  "Administrador";

export function MyWorkPage() {
  const navigate =
    useNavigate();

  const work =
    useMemo(
      () =>
        getCurrentUserWork(
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
    work.attentionItems.filter(
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
        eyebrow="Visão pessoal"
        title="Meu trabalho"
        description="Uma visão concentrada do que está sob sua responsabilidade e do que precisa da sua atenção agora."
      />

      {/* =====================================================
          INDICADORES
      ===================================================== */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Projetos ativos"
          value={
            work.activeProjects
              .length
          }
          description="Serviços atualmente sob sua responsabilidade."
        />

        <MetricCard
          label="Precisam de atenção"
          value={
            work.attentionCount
          }
          description="Situações do fluxo que exigem alguma ação."
          emphasis={
            work.attentionCount >
            0
          }
        />

        <MetricCard
          label="Próximos prazos"
          value={
            work.upcomingDeadlineCount
          }
          description="Projetos com os próximos prazos registrados."
        />

        <MetricCard
          label="Orçamentos em andamento"
          value={
            work.activeQuotes
              .length
          }
          description="Propostas comerciais ainda em fluxo."
        />
      </div>

      {/* =====================================================
          ATENÇÃO
      ===================================================== */}

      <section className="mt-5 overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white shadow-[0_10px_30px_rgba(34,67,90,0.025)]">
        <div className="flex flex-col gap-4 border-b border-[#e2e9ed] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#bdd4e0] bg-[#edf6fa] text-[11px] font-semibold text-[#397392]">
              !
            </span>

            <div>
              <p className="text-sm font-semibold text-[#17394f]">
                Precisam da minha atenção
              </p>

              <p className="mt-1 text-xs text-[#7e919c]">
                O sistema reúne aqui somente situações que pedem uma ação.
              </p>
            </div>
          </div>

          {/* =================================================
              FILTRO
          ================================================= */}

          <div className="flex items-center gap-2">
            <span className="hidden text-[8px] font-semibold uppercase tracking-[0.09em] text-[#8999a3] sm:block">
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
                className="
                  h-9
                  min-w-[155px]
                  cursor-pointer
                  appearance-none
                  rounded-[10px]
                  border border-[#d2dfe6]
                  bg-[#f8fafb]
                  pl-3 pr-9
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-[#536f80]
                  outline-none
                  transition
                  hover:border-[#acc5d2]
                  focus:border-[#78a9c4]
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

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#718895]">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            RESUMO DO FILTRO
        =================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf1f3] bg-[#fbfcfd] px-5 py-2.5 sm:px-6">
          <p className="text-[9px] text-[#8a9aa3]">
            Exibindo{" "}
            <span className="font-semibold text-[#607989]">
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
              className="text-[8px] font-semibold uppercase tracking-[0.07em] text-[#5681a0] transition hover:text-[#096ab2]"
            >
              Limpar filtro
            </button>
          )}
        </div>

        {visibleAttention.length >
        0 ? (
          <div className="divide-y divide-[#e5ebef]">
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
            description="Quando alguma etapa do fluxo precisar de uma ação sua, ela aparecerá aqui."
          />
        )}
      </section>

      {/* =====================================================
          PROJETOS + PRAZOS
      ===================================================== */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        {/* PROJETOS */}

        <section className="overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white shadow-[0_10px_30px_rgba(34,67,90,0.025)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#e2e9ed] px-5 py-5 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-[#17394f]">
                Projetos sob minha responsabilidade
              </p>

              <p className="mt-1 text-xs text-[#7e919c]">
                Acompanhamento resumido dos projetos ativos.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/portal/projetos",
                )
              }
              className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.09em] text-[#356f9f] transition hover:text-[#0b2340]"
            >
              Ver todos →
            </button>
          </div>

          {work.activeProjects
            .length > 0 ? (
            <div className="divide-y divide-[#e5ebef]">
              {work.activeProjects
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
              description="Projetos sob sua responsabilidade aparecerão nesta área."
            />
          )}
        </section>

        {/* PRAZOS */}

        <section className="overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white shadow-[0_10px_30px_rgba(34,67,90,0.025)]">
          <div className="border-b border-[#e2e9ed] px-5 py-5 sm:px-6">
            <p className="text-sm font-semibold text-[#17394f]">
              Próximos prazos
            </p>

            <p className="mt-1 text-xs text-[#7e919c]">
              Projetos ordenados pela proximidade da data prevista.
            </p>
          </div>

          {work.upcomingDeadlines
            .length > 0 ? (
            <div className="divide-y divide-[#e5ebef]">
              {work.upcomingDeadlines.map(
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
              title="Nenhum prazo disponível."
              description="Projetos com datas previstas aparecerão aqui."
            />
          )}
        </section>
      </div>

      {/* =====================================================
          EXPLICAÇÃO
      ===================================================== */}

      <section className="mt-5 rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
              Visão orientada por prioridade
            </p>

            <h2 className="mt-2 text-lg font-semibold text-[#17394f]">
              Nem toda atividade precisa aparecer aqui.
            </h2>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-[#6d8390]">
              Meu trabalho prioriza situações que exigem decisão ou ação,
              desde uma nova solicitação até propostas em elaboração,
              revisões, orçamentos aceitos aguardando início e projetos
              próximos do prazo. O acompanhamento detalhado continua
              dentro de cada processo.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/portal/projetos",
              )
            }
            className="w-fit rounded-[11px] border border-[#a9c6d6] bg-white px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.09em] text-[#356f9f] transition hover:border-[#7ca9c0]"
          >
            Abrir projetos
          </button>
        </div>
      </section>
    </div>
  );
}

/*
 * ============================================================
 * ITEM DE ATENÇÃO
 * ============================================================
 */

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
      className="group flex w-full gap-4 px-5 py-5 text-left transition hover:bg-[#f8fafb] sm:px-6"
    >
      <span
        className={`
          mt-0.5
          flex h-9 w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          text-[9px]
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
            className={`
              rounded-full
              border
              px-2.5 py-1
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.08em]
              ${style.badge}
            `}
          >
            {
              item.urgencyLabel
            }
          </span>

          <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#81939d]">
            {
              item.referenceId
            }
          </span>

          <span className="text-[9px] text-[#a0adb4]">
            ·
          </span>

          <span className="text-[9px] text-[#82949e]">
            {getTypeLabel(
              item.type,
            )}
          </span>
        </div>

        <p className="mt-2 text-sm font-semibold text-[#294e64] transition group-hover:text-[#096ab2]">
          {item.title}
        </p>

        <p className="mt-1 text-xs font-medium text-[#607989]">
          {item.company}
        </p>

        <p className="mt-1.5 text-[10px] leading-5 text-[#8999a3]">
          {
            item.description
          }
        </p>
      </div>

      <span className="mt-2 shrink-0 text-sm text-[#9aabb4] transition group-hover:translate-x-1 group-hover:text-[#356f9f]">
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
      className="group w-full px-5 py-5 text-left transition hover:bg-[#f8fafb] sm:px-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#5681a0]">
            {project.id}
          </p>

          <p className="mt-1.5 truncate text-sm font-semibold text-[#17394f] transition group-hover:text-[#096ab2]">
            {
              project.company
            }
          </p>

          <p className="mt-1 text-[10px] text-[#7e919c]">
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
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e3eaee]">
          <div
            className="h-full rounded-full bg-[#1684c5]"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <span className="w-9 text-right text-[10px] font-semibold text-[#5681a0]">
          {progress}%
        </span>
      </div>
    </button>
  );
}

/*
 * ============================================================
 * PRAZO
 * ============================================================
 */

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
      className="group flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-[#f8fafb] sm:px-6"
    >
      <div
        className={`
          flex h-11 w-11
          shrink-0
          flex-col
          items-center
          justify-center
          rounded-[11px]
          border

          ${
            urgent
              ? "border-[#e0c7b5] bg-[#f8eee7]"
              : "border-[#cadce5] bg-[#edf6fa]"
          }
        `}
      >
        <span
          className={`
            text-sm
            font-semibold

            ${
              urgent
                ? "text-[#a2603f]"
                : "text-[#397392]"
            }
          `}
        >
          {
            item.daysRemaining
          }
        </span>

        <span className="text-[7px] font-semibold uppercase tracking-[0.06em] text-[#82949e]">
          dias
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#5681a0]">
            {
              item.projectId
            }
          </p>

          {urgent && (
            <span className="rounded-full border border-[#e1c9b8] bg-[#f8eee7] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.07em] text-[#9a5b3d]">
              Próximo
            </span>
          )}
        </div>

        <p className="mt-1.5 truncate text-xs font-semibold text-[#31566d] transition group-hover:text-[#096ab2]">
          {item.company}
        </p>

        <p className="mt-1 text-[9px] text-[#8999a3]">
          Prazo:{" "}
          {item.deadline}
        </p>
      </div>
    </button>
  );
}

/*
 * ============================================================
 * CARDS
 * ============================================================
 */

function MetricCard({
  label,
  value,
  description,
  emphasis = false,
}) {
  return (
    <div
      className={`
        rounded-[20px]
        border
        p-5

        ${
          emphasis
            ? "border-[#bed5e1] bg-[#edf6fa]"
            : "border-[#d1dde4] bg-white"
        }
      `}
    >
      <p
        className={`
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.12em]

          ${
            emphasis
              ? "text-[#5681a0]"
              : "text-[#718895]"
          }
        `}
      >
        {label}
      </p>

      <p
        className={`
          mt-3
          text-3xl
          font-semibold
          tracking-[-0.035em]

          ${
            emphasis
              ? "text-[#096ab2]"
              : "text-[#17394f]"
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

function EmptyState({
  title,
  description,
}) {
  return (
    <div className="px-6 py-14 text-center">
      <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#d5e1e7] bg-[#f5f9fb] text-[11px] text-[#82949e]">
        ✓
      </span>

      <p className="mt-3 text-xs font-semibold text-[#607989]">
        {title}
      </p>

      <p className="mx-auto mt-1.5 max-w-sm text-[10px] leading-5 text-[#8b9aa3]">
        {description}
      </p>
    </div>
  );
}

/*
 * ============================================================
 * TIPO
 * ============================================================
 */

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

/*
 * ============================================================
 * CORES DE PRIORIDADE
 * ============================================================
 */

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