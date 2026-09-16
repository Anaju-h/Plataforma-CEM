import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

const navigation = [
  {
    group: "Visão geral",
    items: [
      {
        label: "Meu trabalho",
        to: "/portal/meu-trabalho",
        icon: WorkIcon,
      },
    ],
  },

  {
    group: "Operação",
    items: [
      {
        label: "Solicitações",
        to: "/portal/solicitacoes",
        icon: RequestsIcon,
      },
      {
        label: "Orçamentos",
        to: "/portal/orcamentos",
        icon: QuoteIcon,
      },
      {
        label: "Projetos",
        to: "/portal/projetos",
        icon: ProjectsIcon,
      },
      {
        label: "Histórico",
        to: "/portal/historico",
        icon: RequestsIcon,
      },
    ],
  },

  {
    group: "Conhecimento",
    items: [
      {
        label: "Base de conhecimento",
        to: "/portal/conhecimento",
        icon: KnowledgeIcon,
      },
      {
        label: "Equipamentos e custos",
        to: "/portal/equipamentos-custos",
        icon: EquipmentIcon,
      },
    ],
  },

  {
    group: "Gestão",
    items: [
      {
        label: "Equipe",
        to: "/portal/equipe",
        icon: TeamIcon,
      },
      {
        label: "Administração",
        to: "/portal/administracao",
        icon: SettingsIcon,
      },
    ],
  },
];

export function InternalSidebar({
  mobileOpen = false,
  onClose,
}) {
  return (
    <>
      <aside className="fixed bottom-4 left-4 top-4 z-40 hidden w-[292px] lg:block">
        <SidebarContent />
      </aside>

      <div
        className={`
          fixed inset-0 z-[90]
          bg-[#071f2d]/34
          backdrop-blur-[5px]
          transition-opacity duration-300
          lg:hidden
          ${
            mobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={onClose}
      />

      <aside
        className={`
          fixed bottom-3 left-3 top-3 z-[100]
          w-[292px]
          transition-transform duration-300 ease-out
          lg:hidden
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-[110%]"
          }
        `}
      >
        <SidebarContent
          mobile
          onClose={onClose}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  mobile = false,
  onClose,
}) {
  const user = useCurrentUser();
  const navigate =
    useNavigate();

  function handleNavigate() {
    if (
      mobile &&
      onClose
    ) {
      onClose();
    }
  }

  function handleOpenAccount() {
    navigate(
      "/portal/conta",
    );

    handleNavigate();
  }

  function handleLogout() {
    /*
     * BACKEND FUTURO:
     *
     * Aqui entra a invalidação real da sessão interna.
     * Não usar JWT em localStorage/sessionStorage.
     */

    navigate(
      "/portal/login",
      {
        replace: true,
      },
    );

    handleNavigate();
  }

  return (
    <div
      className="
        relative isolate
        flex h-full min-h-0 flex-col
        overflow-hidden
        rounded-[28px]
        border border-white/55
        bg-[linear-gradient(180deg,rgba(129,153,168,0.60)_0%,rgba(158,177,189,0.50)_10%,rgba(190,205,213,0.43)_23%,rgba(220,230,235,0.48)_37%,rgba(244,247,249,0.62)_50%,rgba(220,230,235,0.48)_63%,rgba(190,205,213,0.43)_77%,rgba(158,177,189,0.50)_90%,rgba(129,153,168,0.60)_100%)]
        shadow-[0_18px_48px_rgba(7,31,45,0.12)]
        backdrop-blur-[30px]
        backdrop-saturate-[150%]
      "
    >
      {/* FUNDO */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
      >
        <div className="absolute inset-x-0 top-0 h-[31%] bg-[radial-gradient(circle_at_50%_0%,rgba(7,31,45,0.15)_0%,rgba(18,54,78,0.07)_38%,transparent_75%)]" />

        <div className="absolute inset-x-0 bottom-0 h-[31%] bg-[radial-gradient(circle_at_50%_100%,rgba(7,31,45,0.15)_0%,rgba(18,54,78,0.07)_38%,transparent_75%)]" />

        <div className="absolute left-[-90px] top-1/2 h-[46%] w-[470px] -translate-y-1/2 rounded-full bg-white/24 blur-[75px]" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.06)_38%,rgba(7,31,45,0.025)_100%)]" />
      </div>

      {/* PORTAL */}

      <div className="relative z-10 shrink-0 px-4 pt-5">
        <div
          className="
            relative isolate
            overflow-hidden
            rounded-[17px]
            bg-[linear-gradient(135deg,#071f2d_0%,#12364e_58%,#164b68_100%)]
            px-4 py-3.5
          "
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 -z-10 h-28 w-28 rounded-full bg-[#65b8ee]/16 blur-[34px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-14 left-8 -z-10 h-24 w-32 rounded-full bg-[#0057b8]/14 blur-[38px]"
          />

          <div className="relative z-10 flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-[11px]
                border border-white/15
                bg-white/[0.08]
                text-[#9ed8f5]
              "
            >
              <PlatformIcon />
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#afd1e1]">
                Plataforma
              </p>

              <p className="mt-0.5 text-[14px] font-semibold text-white">
                Portal Interno
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO */}

      <nav className="no-scrollbar relative z-10 mt-5 min-h-0 flex-1 overflow-y-auto px-4">
        {navigation.map(
          (
            section,
            index,
          ) => (
            <div
              key={
                section.group
              }
              className={
                index ===
                navigation.length -
                  1
                  ? "pb-2"
                  : "mb-4"
              }
            >
              <p className="px-2 pb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#527286]">
                {
                  section.group
                }
              </p>

              <div className="space-y-1">
                {section.items.map(
                  ({
                    label,
                    to,
                    icon: Icon,
                  }) => (
                    <NavLink
                      key={
                        to
                      }
                      to={
                        to
                      }
                      onClick={
                        handleNavigate
                      }
                      className={({
                        isActive,
                      }) =>
                        `
                          group relative
                          flex h-[45px]
                          items-center gap-3
                          overflow-hidden
                          rounded-[13px]
                          border px-3
                          transition-all duration-300

                          ${
                            isActive
                              ? `
                                border-white/55
                                bg-white/32
                                text-[#12364e]
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_6px_18px_rgba(7,31,45,0.055)]
                              `
                              : `
                                border-transparent
                                text-[#405f70]
                                hover:border-white/40
                                hover:bg-white/20
                                hover:text-[#12364e]
                              `
                          }
                        `
                      }
                    >
                      {({
                        isActive,
                      }) => (
                        <>
                          {isActive && (
                            <span className="absolute bottom-[8px] left-0 top-[8px] w-[3px] rounded-r-full bg-[#0057b8]" />
                          )}

                          <span
                            className={`
                              flex h-8 w-8 shrink-0
                              items-center justify-center
                              rounded-[9px]
                              border
                              transition-all

                              ${
                                isActive
                                  ? "border-white/65 bg-white/38 text-[#0057b8]"
                                  : "border-[#6f8b9b]/22 bg-white/14 text-[#527286] group-hover:bg-white/30 group-hover:text-[#0057b8]"
                              }
                            `}
                          >
                            <Icon />
                          </span>

                          <span className="text-[12px] font-semibold">
                            {
                              label
                            }
                          </span>

                          {isActive && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#65b8ee]" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ),
                )}
              </div>
            </div>
          ),
        )}
      </nav>

      {/* USUÁRIO */}

      <div className="relative z-10 shrink-0 px-4 pb-3">
        <div className="border-t border-[#29495d]/12 pt-3">
          <button
            type="button"
            onClick={
              handleOpenAccount
            }
            aria-label="Minha Conta"
            className="
              flex w-full items-center gap-3
              rounded-[14px]
              border border-white/55
              bg-white/25
              px-3 py-2.5
              text-left
              shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]
              transition
              hover:bg-white/35
            "
          >
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-[10px]
                bg-[linear-gradient(135deg,#1d5370_0%,#103e58_100%)]
                text-[11px]
                font-semibold text-white
              "
            >{user.initials}</div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-[#17384d]">{user.name}</p>

              <p className="mt-0.5 text-[12px] font-medium text-[#5d7888]">
                {user.accessProfile}
              </p>
            </div>

            <ArrowIcon />
          </button>

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="
              mt-1 flex h-[38px] w-full
              items-center gap-3
              rounded-[11px]
              px-3
              text-[12px] font-medium
              text-[#4f6c7d]
              transition
              hover:bg-white/22
              hover:text-[#12364e]
            "
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-white/45 bg-white/16">
              <LogoutIcon />
            </span>

            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

function PlatformIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 3 3 6-7" />
      <path d="M13 5h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

function RequestsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M8 3h8" />
      <path d="M9 3v3h6V3" />
      <path d="M6 5h12a2 2 0 0 1 2 2v14H4V7a2 2 0 0 1 2-2Z" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 7V5a2 2 0 0 1 2-2h5l2 2h4" />
    </svg>
  );
}

function KnowledgeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" />
    </svg>
  );
}

function EquipmentIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
      <circle cx="16" cy="16" r="1" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.5 2.4-6 6-6s6 2.5 6 6" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5" />
      <path d="M17 14c2.5.5 4 2.5 4 5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="m4.93 4.93 2.12 2.12" />
      <path d="m16.95 16.95 2.12 2.12" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-[#5d7888]"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
