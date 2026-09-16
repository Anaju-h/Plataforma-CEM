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
            className="internal-eyebrow 
              cursor-not-allowed
              rounded-[12px]
              border border-[#d0dce3]
              bg-[#eef2f4]
              px-5 py-3
              
              font-semibold
              uppercase
              
              text-[#526d7c]
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
          <span className="internal-card-title flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bfd5e0] bg-white font-semibold text-[#5681a0]">
            i
          </span>

          <div>
            <p className="internal-card-title font-semibold text-[#31566d]">
              Estrutura de usuários ainda em validação
            </p>

            <p className="internal-section-description mt-1.5 max-w-4xl text-[#526d7c]">
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
                className={`internal-eyebrow 
                  rounded-[10px]
                  px-4 py-2.5
                  
                  font-semibold
                  uppercase
                  
                  transition

                  ${
                    activeTab ===
                    tab.id
                      ? "bg-[#0b3550] text-white"
                      : "text-[#526d7c] hover:bg-[#f3f7f9]"
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
        <p className="internal-section-title font-semibold text-[#17394f]">
          Membros com acesso
        </p>

        <p className="internal-help-text mt-1 text-[#526d7c]">
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
                  <div className="internal-card-title flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#bdd5e1] bg-[#edf6fa] font-semibold text-[#397392]">
                    {
                      member.initials
                    }
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="internal-card-title font-semibold text-[#17394f]">
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

                    <p className="internal-help-text mt-1 text-[#526d7c]">
                      {member.role}
                    </p>

                    <p className="internal-eyebrow mt-1 uppercase text-[#526d7c]">
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
                <p className="internal-help-text text-[#526d7c]">
                  Acesso completo nesta versão inicial do portal.
                </p>

                <button
                  type="button"
                  onClick={
                    onOpenWork
                  }
                  className="internal-eyebrow font-semibold uppercase text-[#356f9f]"
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
                <div className="internal-card-title flex h-9 w-9 items-center justify-center rounded-full border border-[#bdd5e1] bg-[#edf6fa] font-semibold text-[#397392]">
                  {
                    member.initials
                  }
                </div>

                <div>
                  <p className="internal-card-title font-semibold text-[#17394f]">
                    {
                      member.name
                    }
                  </p>

                  <p className="internal-help-text mt-0.5 text-[#526d7c]">
                    {member.role}
                  </p>
                </div>
              </div>

              <span className="internal-card-title rounded-full border border-[#c9dce6] bg-[#edf6fa] px-3 py-1.5 font-semibold text-[#5681a0]">
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
                        <p className="internal-eyebrow font-semibold uppercase text-[#5681a0]">
                          {
                            project.id
                          }
                        </p>
                      </div>

                      <div>
                        <p className="internal-card-title font-semibold text-[#31566d]">
                          {
                            project.company
                          }
                        </p>

                        <p className="internal-help-text mt-1 text-[#526d7c]">
                          {
                            project.service
                          }
                        </p>
                      </div>

                      <div>
                        <p className="internal-eyebrow uppercase text-[#526d7c]">
                          Equipamento
                        </p>

                        <p className="internal-card-title mt-1 font-semibold text-[#536f80]">
                          {
                            project.machine
                          }
                        </p>
                      </div>

                      <div>
                        <p className="internal-eyebrow uppercase text-[#526d7c]">
                          Prazo
                        </p>

                        <p className="internal-card-title mt-1 font-semibold text-[#536f80]">
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
                <p className="internal-help-text text-[#526d7c]">
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
              <span className="internal-card-title flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#c7dae4] bg-[#edf6fa] font-semibold text-[#5681a0]">
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

            <h3 className="internal-section-title mt-5 font-semibold text-[#17394f]">
              {profile.name}
            </h3>

            <p className="internal-card-description mt-2 text-[#526d7c]">
              {
                profile.description
              }
            </p>

            {profile.status ===
              "A validar" && (
              <div className="mt-5 border-t border-[#e5ebef] pt-4">
                <p className="internal-card-description text-[#526d7c]">
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
      <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#17394f]">
        {value}
      </p>

      <p className="internal-card-description mt-3 text-[#526d7c]">
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
      <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
        {label}
      </p>

      <p
        className={`
          mt-1
          font-semibold
          text-[#31566d]

          ${
            text
              ? "internal-help-text "
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
    <span className="internal-eyebrow rounded-full border border-[#b8d6c4] bg-[#edf7f1] px-2.5 py-1 font-semibold uppercase text-[#397250]">
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
      className={`internal-eyebrow 
        rounded-full
        border
        px-2.5 py-1
        
        font-semibold
        uppercase
        

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