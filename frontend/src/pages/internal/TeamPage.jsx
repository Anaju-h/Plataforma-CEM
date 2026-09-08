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
  getTeamOverview,
} from "../../services/teamService";

const tabs = [
  {
    id: "members",
    label: "Membros",
  },

  {
    id: "distribution",
    label: "Distribuição",
  },

  {
    id: "profiles",
    label: "Perfis futuros",
  },
];

export function TeamPage() {
  const navigate =
    useNavigate();

  const overview =
    useMemo(
      () =>
        getTeamOverview(),
      [],
    );

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "members",
  );

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Gestão"
        title="Equipe"
        description="Visualize os usuários com acesso ao portal, responsabilidades atuais e a estrutura preparada para expansão futura."
        action={
          <button
            type="button"
            disabled
            className="
              cursor-not-allowed
              rounded-[12px]
              border border-[#d0dce3]
              bg-[#eef2f4]
              px-5 py-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.09em]
              text-[#98a5ad]
            "
          >
            + Adicionar membro
          </button>
        }
      />

      {/* =====================================================
          INDICADORES
      ===================================================== */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Usuários ativos"
          value={
            overview.activeMembers
          }
          description="Perfis atualmente habilitados nesta versão."
        />

        <MetricCard
          label="Projetos ativos"
          value={
            overview.activeProjects
          }
          description="Projetos atualmente em fluxo."
        />

        <MetricCard
          label="Orçamentos em andamento"
          value={
            overview.activeQuotes
          }
          description="Propostas ainda no fluxo comercial."
        />

        <MetricCard
          label="Perfis previstos"
          value={
            overview.profiles
              .length
          }
          description="Estruturas de acesso consideradas para expansão."
        />
      </div>

      {/* =====================================================
          AVISO
      ===================================================== */}

      <section className="mt-5 rounded-[18px] border border-[#c7d9e3] bg-[#eaf3f8] p-5">
        <div className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bfd5e0] bg-white text-[11px] font-semibold text-[#5681a0]">
            i
          </span>

          <div>
            <p className="text-xs font-semibold text-[#31566d]">
              Estrutura de usuários ainda em validação
            </p>

            <p className="mt-1.5 max-w-4xl text-[10px] leading-5 text-[#718795]">
              Nesta versão somente o administrador possui acesso ativo.
              Novos usuários, funções e permissões serão configurados após a
              definição oficial de como a equipe utilizará o sistema.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABAS
      ===================================================== */}

      <div className="mt-5 overflow-x-auto">
        <div className="flex min-w-max gap-1 rounded-[15px] border border-[#d1dde4] bg-white p-1.5">
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

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <div className="mt-5">
        {activeTab ===
          "members" && (
          <MembersTab
            members={
              overview.members
            }
            onOpenWork={() =>
              navigate(
                "/portal/meu-trabalho",
              )
            }
          />
        )}

        {activeTab ===
          "distribution" && (
          <DistributionTab
            members={
              overview.members
            }
            onOpenProject={(
              projectId,
            ) =>
              navigate(
                `/portal/projetos/${projectId}`,
              )
            }
          />
        )}

        {activeTab ===
          "profiles" && (
          <ProfilesTab
            profiles={
              overview.profiles
            }
          />
        )}
      </div>
    </div>
  );
}

/*
 * ============================================================
 * MEMBROS
 * ============================================================
 */

function MembersTab({
  members,
  onOpenWork,
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white shadow-[0_10px_30px_rgba(34,67,90,0.025)]">
      <div className="border-b border-[#e2e9ed] px-5 py-5 sm:px-6">
        <p className="text-sm font-semibold text-[#17394f]">
          Membros com acesso
        </p>

        <p className="mt-1 text-xs text-[#7e919c]">
          Usuários atualmente cadastrados no portal.
        </p>
      </div>

      <div className="divide-y divide-[#e5ebef]">
        {members.map(
          (member) => (
            <div
              key={
                member.id
              }
              className="px-5 py-5 sm:px-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#bdd5e1] bg-[#edf6fa] text-xs font-semibold text-[#397392]">
                    {
                      member.initials
                    }
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#17394f]">
                        {
                          member.name
                        }
                      </p>

                      <StatusBadge
                        status={
                          member.status
                        }
                      />
                    </div>

                    <p className="mt-1 text-xs text-[#718795]">
                      {member.role}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.07em] text-[#98a5ad]">
                      {member.id}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[420px]">
                  <SmallMetric
                    label="Projetos ativos"
                    value={
                      member
                        .activeProjects
                        .length
                    }
                  />

                  <SmallMetric
                    label="Orçamentos ativos"
                    value={
                      member
                        .activeQuotes
                        .length
                    }
                  />

                  <SmallMetric
                    label="Perfil"
                    value={
                      member.accessProfile
                    }
                    text
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e8edef] pt-4">
                <p className="text-[10px] text-[#82949e]">
                  Acesso completo nesta versão inicial do portal.
                </p>

                <button
                  type="button"
                  onClick={
                    onOpenWork
                  }
                  className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#356f9f]"
                >
                  Ver visão de trabalho →
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

/*
 * ============================================================
 * DISTRIBUIÇÃO
 * ============================================================
 */

function DistributionTab({
  members,
  onOpenProject,
}) {
  return (
    <div className="space-y-5">
      {members.map(
        (member) => (
          <section
            key={
              member.id
            }
            className="overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e9ed] px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#bdd5e1] bg-[#edf6fa] text-[10px] font-semibold text-[#397392]">
                  {
                    member.initials
                  }
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#17394f]">
                    {
                      member.name
                    }
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#82949e]">
                    {member.role}
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-[#c9dce6] bg-[#edf6fa] px-3 py-1.5 text-[9px] font-semibold text-[#5681a0]">
                {
                  member
                    .activeProjects
                    .length
                }{" "}
                projetos ativos
              </span>
            </div>

            {member
              .activeProjects
              .length > 0 ? (
              <div className="divide-y divide-[#e5ebef]">
                {member.activeProjects.map(
                  (project) => (
                    <button
                      key={
                        project.id
                      }
                      type="button"
                      onClick={() =>
                        onOpenProject(
                          project.id,
                        )
                      }
                      className="grid w-full gap-4 px-5 py-4 text-left transition hover:bg-[#f8fafb] sm:px-6 md:grid-cols-[120px_1fr_180px_120px] md:items-center"
                    >
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#5681a0]">
                          {
                            project.id
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-[#31566d]">
                          {
                            project.company
                          }
                        </p>

                        <p className="mt-1 text-[9px] text-[#82949e]">
                          {
                            project.service
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-[0.08em] text-[#8999a3]">
                          Equipamento
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-[#536f80]">
                          {
                            project.machine
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-[0.08em] text-[#8999a3]">
                          Prazo
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-[#536f80]">
                          {
                            project.deadline
                          }
                        </p>
                      </div>
                    </button>
                  ),
                )}
              </div>
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-xs text-[#82949e]">
                  Nenhum projeto ativo atribuído.
                </p>
              </div>
            )}
          </section>
        ),
      )}
    </div>
  );
}

/*
 * ============================================================
 * PERFIS FUTUROS
 * ============================================================
 */

function ProfilesTab({
  profiles,
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {profiles.map(
        (profile) => (
          <div
            key={
              profile.id
            }
            className="rounded-[20px] border border-[#d1dde4] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#c7dae4] bg-[#edf6fa] text-[10px] font-semibold text-[#5681a0]">
                {
                  profile.name
                    .charAt(0)
                }
              </span>

              <ProfileStatus
                status={
                  profile.status
                }
              />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-[#17394f]">
              {profile.name}
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#718795]">
              {
                profile.description
              }
            </p>

            {profile.status ===
              "A validar" && (
              <div className="mt-5 border-t border-[#e5ebef] pt-4">
                <p className="text-[9px] leading-4 text-[#8a9aa3]">
                  Permissões e funções serão definidas somente após validação do fluxo real com a empresa.
                </p>
              </div>
            )}
          </div>
        ),
      )}
    </div>
  );
}

/*
 * ============================================================
 * AUXILIARES
 * ============================================================
 */

function MetricCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-[20px] border border-[#d1dde4] bg-white p-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718895]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#17394f]">
        {value}
      </p>

      <p className="mt-3 text-[10px] leading-5 text-[#84949e]">
        {description}
      </p>
    </div>
  );
}

function SmallMetric({
  label,
  value,
  text = false,
}) {
  return (
    <div>
      <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#8999a3]">
        {label}
      </p>

      <p
        className={`
          mt-1
          font-semibold
          text-[#31566d]

          ${
            text
              ? "text-[10px]"
              : "text-lg"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}) {
  return (
    <span className="rounded-full border border-[#b8d6c4] bg-[#edf7f1] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.07em] text-[#397250]">
      {status}
    </span>
  );
}

function ProfileStatus({
  status,
}) {
  const active =
    status ===
    "Em uso";

  return (
    <span
      className={`
        rounded-full
        border
        px-2.5 py-1
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.07em]

        ${
          active
            ? "border-[#b8d6c4] bg-[#edf7f1] text-[#397250]"
            : "border-[#d8d5c6] bg-[#f5f2e9] text-[#817458]"
        }
      `}
    >
      {status}
    </span>
  );
}