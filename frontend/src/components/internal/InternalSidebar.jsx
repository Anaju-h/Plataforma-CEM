import {
  NavLink,
  useNavigate,
} from "react-router-dom";

const navigation = [
  {
    group: "Visão geral",

    items: [
      {
        label: "Dashboard",
        to: "/portal",
        end: true,
        icon: "▦",
      },

      {
        label: "Meu trabalho",
        to: "/portal/meu-trabalho",
        icon: "✓",
      },
    ],
  },

  {
    group: "Operação",

    items: [
      {
        label: "Solicitações",
        to: "/portal/solicitacoes",
        icon: "◇",
      },

      {
        label: "Orçamentos",
        to: "/portal/orcamentos",
        icon: "▤",
      },

      {
        label: "Projetos",
        to: "/portal/projetos",
        icon: "□",
      },
    ],
  },

  {
    group: "Conhecimento",

    items: [
      {
        label: "Base de conhecimento",
        to: "/portal/conhecimento",
        icon: "◎",
      },

      {
        label: "Equipamentos e custos",
        to: "/portal/equipamentos-custos",
        icon: "△",
      },
    ],
  },

  {
    group: "Gestão",

    items: [
      {
        label: "Equipe",
        to: "/portal/equipe",
        icon: "○",
      },

      {
        label: "Administração",
        to: "/portal/administracao",
        icon: "⚙",
      },
    ],
  },
];

export function InternalSidebar() {
  const navigate =
    useNavigate();

  function logout() {
    localStorage.removeItem(
      "lab-portal-session",
    );

    navigate(
      "/portal/login",
    );
  }

  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-50
        hidden w-[280px]
        flex-col
        border-r border-white/[0.07]
        bg-[#071f2d]
        lg:flex
      "
    >
      <div className="px-6 pb-7 pt-6">
        <img
          src="/brand/zeiss-senai-branco.png"
          alt="Centro de Excelência em Metrologia"
          className="w-[250px]"
        />

        <div className="mt-6 h-px bg-white/10" />

        <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#65b8ee]">
          Portal interno
        </p>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-5">
        {navigation.map(
          (section) => (
            <div
              key={
                section.group
              }
              className="mb-6"
            >
              <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#627f90]">
                {section.group}
              </p>

              <div className="mt-2 space-y-1">
                {section.items.map(
                  (item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({
                        isActive,
                      }) => `
                        group
                        flex items-center
                        gap-3
                        rounded-[12px]
                        px-3 py-2.5
                        transition-all
                        duration-200

                        ${
                          isActive
                            ? "bg-[#0d3d5a]"
                            : "hover:bg-white/[0.05]"
                        }
                      `}
                    >
                      {({
                        isActive,
                      }) => (
                        <>
                          <span
                            className={`
                              flex h-7 w-7
                              shrink-0
                              items-center
                              justify-center
                              rounded-[8px]
                              border
                              text-[11px]
                              transition-all

                              ${
                                isActive
                                  ? "border-[#3383b5]/50 bg-[#0b3047] text-[#6dc3f5]"
                                  : "border-white/10 text-[#65b8ee] group-hover:border-white/20"
                              }
                            `}
                          >
                            {
                              item.icon
                            }
                          </span>

                          <span
                            className={`
                              text-[12px]
                              font-medium
                              transition-colors

                              ${
                                isActive
                                  ? "text-white"
                                  : "text-[#a9bdc9] group-hover:text-white"
                              }
                            `}
                          >
                            {
                              item.label
                            }
                          </span>
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

      <div className="border-t border-white/10 p-4">
        <div className="rounded-[14px] bg-white/[0.045] p-3">
          <p className="text-xs font-semibold text-white">
            Administrador
          </p>

          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.09em] text-[#7595a7]">
            Acesso total
          </p>

          <button
            type="button"
            onClick={logout}
            className="
              mt-3
              cursor-pointer
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-[#65b8ee]
              transition-colors
              hover:text-white
            "
          >
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}