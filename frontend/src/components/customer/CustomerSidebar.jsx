import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

/* ============================================================
 * NAVEGAÇÃO
 * ============================================================ */

const navigation = [
  {
    label: "Visão geral",
    href: "/cliente/dashboard",
    icon: HomeIcon,
  },
  {
    label: "Solicitações",
    href: "/cliente/solicitacoes",
    icon: RequestsIcon,
  },
  {
    label: "Orçamentos",
    href: "/cliente/orcamentos",
    icon: QuoteIcon,
  },
  {
    label: "Projetos",
    href: "/cliente/projetos",
    icon: ProjectsIcon,
  },
  {
    label: "Documentos",
    href: "/cliente/documentos",
    icon: DocumentsIcon,
  },
];

/* ============================================================
 * SIDEBAR
 * ============================================================ */

export function CustomerSidebar({
  customer,
}) {
  const navigate =
    useNavigate();

  const [
    logoutModalOpen,
    setLogoutModalOpen,
  ] = useState(false);

  const userName =
    customer?.user?.name ??
    "Cliente";

  const userInitials =
    getInitials(
      userName,
    );

  function handleOpenAccount() {
    navigate(
      "/cliente/conta",
    );
  }

  function handleOpenLogout() {
    setLogoutModalOpen(
      true,
    );
  }

  function handleCloseLogout() {
    setLogoutModalOpen(
      false,
    );
  }

  function handleConfirmLogout() {
    /*
     * BACKEND FUTURO:
     *
     * Aqui será executado o logout real.
     *
     * Exemplo:
     * await authService.logout();
     *
     * Depois:
     * navigate("/cliente", { replace: true });
     *
     * Nesta fase ainda não existe uma sessão real.
     */

    setLogoutModalOpen(
      false,
    );

    navigate(
      "/cliente",
      {
        replace: true,
      },
    );
  }

  return (
    <>
      <aside className="fixed bottom-4 left-4 top-4 z-40 w-[292px]">
        <div
          className="
            relative
            isolate
            flex
            h-full
            min-h-0
            flex-col
            overflow-hidden
            rounded-[28px]
            border
            border-white/55
            bg-[linear-gradient(180deg,rgba(129,153,168,0.60)_0%,rgba(158,177,189,0.50)_10%,rgba(190,205,213,0.43)_23%,rgba(220,230,235,0.48)_37%,rgba(244,247,249,0.62)_50%,rgba(220,230,235,0.48)_63%,rgba(190,205,213,0.43)_77%,rgba(158,177,189,0.50)_90%,rgba(129,153,168,0.60)_100%)]
            shadow-[0_18px_48px_rgba(7,31,45,0.12)]
            backdrop-blur-[30px]
            backdrop-saturate-[150%]
          "
        >
          {/* ===================================================
              CAMADAS DE GLASS DA SIDEBAR
          =================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              -z-10
              overflow-hidden
              rounded-[inherit]
            "
          >
            <div
              className="
                absolute
                inset-x-0
                top-0
                h-[31%]
                bg-[radial-gradient(circle_at_50%_0%,rgba(7,31,45,0.15)_0%,rgba(18,54,78,0.07)_38%,transparent_75%)]
              "
            />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-[31%]
                bg-[radial-gradient(circle_at_50%_100%,rgba(7,31,45,0.15)_0%,rgba(18,54,78,0.07)_38%,transparent_75%)]
              "
            />

            <div
              className="
                absolute
                left-[-90px]
                top-1/2
                h-[46%]
                w-[470px]
                -translate-y-1/2
                rounded-full
                bg-white/24
                blur-[75px]
              "
            />

            <div
              className="
                absolute
                left-[10%]
                right-[10%]
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/80
                to-transparent
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-[10%]
                right-[10%]
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/55
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-[linear-gradient(90deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.06)_38%,rgba(7,31,45,0.025)_100%)]
              "
            />
          </div>

          {/* ===================================================
              IDENTIFICAÇÃO DO PORTAL
              SEM BORDA / SEM HALO EXTERNO
          =================================================== */}

          <div className="relative z-10 shrink-0 px-4 pt-5">
            <div
              className="
                relative
                isolate
                overflow-hidden
                rounded-[17px]
                border-0
                bg-[linear-gradient(135deg,#071f2d_0%,#12364e_58%,#164b68_100%)]
                px-4
                py-3.5
                shadow-none
                outline-none
              "
            >
              {/* ===============================================
                  EFEITOS INTERNOS
                  nenhum toca a borda
              =============================================== */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  -z-10
                  h-28
                  w-28
                  rounded-full
                  bg-[#65b8ee]/16
                  blur-[34px]
                "
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -bottom-14
                  left-8
                  -z-10
                  h-24
                  w-32
                  rounded-full
                  bg-[#0057b8]/14
                  blur-[38px]
                "
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-6
                  right-6
                  top-2
                  -z-10
                  h-8
                  rounded-full
                  bg-white/[0.035]
                  blur-[14px]
                "
              />

              <div className="relative z-10 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-[11px]
                    border
                    border-white/15
                    bg-white/[0.08]
                    text-[#9ed8f5]
                  "
                >
                  <PortalIcon />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.17em]
                      text-[#9fc8dc]
                    "
                  >
                    Plataforma
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[13px]
                      font-semibold
                      tracking-[-0.015em]
                      text-white
                    "
                  >
                    Portal do Cliente
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              NAVEGAÇÃO
          =================================================== */}

          <nav className="relative z-10 mt-5 min-h-0 flex-1 px-4">
            <p
              className="
                px-2
                pb-2
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#668393]
              "
            >
              Navegação
            </p>

            <div className="space-y-1">
              {navigation.map(
                ({
                  label,
                  href,
                  icon: Icon,
                }) => (
                  <NavLink
                    key={
                      href
                    }
                    to={
                      href
                    }
                    className={({
                      isActive,
                    }) =>
                      `
                        group
                        relative
                        flex
                        h-[44px]
                        items-center
                        gap-3
                        overflow-hidden
                        rounded-[13px]
                        border
                        px-3
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              border-white/55
                              bg-white/30
                              text-[#12364e]
                              shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_6px_18px_rgba(7,31,45,0.055)]
                              backdrop-blur-[18px]
                            `
                            : `
                              border-transparent
                              text-[#486779]
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
                          <span
                            className="
                              absolute
                              bottom-[8px]
                              left-0
                              top-[8px]
                              w-[3px]
                              rounded-r-full
                              bg-[#0057b8]
                            "
                          />
                        )}

                        <span
                          className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-[9px]
                            border
                            transition-all
                            duration-300

                            ${
                              isActive
                                ? `
                                  border-white/65
                                  bg-white/35
                                  text-[#0057b8]
                                  shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]
                                `
                                : `
                                  border-[#6f8b9b]/18
                                  bg-white/12
                                  text-[#607d8d]
                                  group-hover:border-white/50
                                  group-hover:bg-white/28
                                  group-hover:text-[#0057b8]
                                `
                            }
                          `}
                        >
                          <Icon />
                        </span>

                        <span className="text-[12px] font-medium">
                          {
                            label
                          }
                        </span>

                        {isActive && (
                          <span
                            className="
                              ml-auto
                              h-1.5
                              w-1.5
                              rounded-full
                              bg-[#65b8ee]
                            "
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ),
              )}
            </div>
          </nav>

          {/* ===================================================
              CONTA + SAIR
          =================================================== */}

          <div className="relative z-10 shrink-0 px-4 pb-3">
            <div className="border-t border-[#29495d]/10 pt-3">
              <button
                type="button"
                onClick={
                  handleOpenAccount
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-[14px]
                  border
                  border-white/55
                  bg-white/24
                  px-3
                  py-2
                  text-left
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_5px_16px_rgba(7,31,45,0.04)]
                  backdrop-blur-[18px]
                  transition-all
                  duration-200
                  hover:border-white/72
                  hover:bg-white/32
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-[linear-gradient(135deg,rgba(29,83,112,0.86)_0%,rgba(16,62,88,0.92)_100%)]
                    text-[10px]
                    font-semibold
                    text-white
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_7px_18px_rgba(7,31,45,0.12)]
                  "
                >
                  {
                    userInitials
                  }
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-[11px]
                      font-semibold
                      text-[#17384d]
                    "
                  >
                    {
                      userName
                    }
                  </p>

                  <p className="mt-0.5 text-[9px] text-[#718997]">
                    Minha conta
                  </p>
                </div>

                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-[8px]
                    text-[#698594]
                  "
                >
                  <ArrowIcon />
                </span>
              </button>

              <button
                type="button"
                onClick={
                  handleOpenLogout
                }
                className="
                  mt-1
                  flex
                  h-[36px]
                  w-full
                  items-center
                  gap-3
                  rounded-[11px]
                  px-3
                  text-[11px]
                  font-medium
                  text-[#587585]
                  transition-all
                  duration-200
                  hover:bg-white/20
                  hover:text-[#12364e]
                "
              >
                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-[8px]
                    border
                    border-white/40
                    bg-white/14
                  "
                >
                  <LogoutIcon />
                </span>

                Sair
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MODAL DE LOGOUT
      ===================================================== */}

      {logoutModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            bg-[#071f2d]/34
            px-5
            backdrop-blur-[6px]
          "
        >
          <div
            className="
              relative
              w-full
              max-w-[430px]
              overflow-hidden
              rounded-[22px]
              border
              border-white/72
              bg-[#f4f8fa]
              shadow-[0_30px_90px_rgba(7,31,45,0.22)]
            "
          >
            <button
              type="button"
              onClick={
                handleCloseLogout
              }
              aria-label="Fechar"
              className="
                absolute
                right-4
                top-4
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                text-[#748995]
                transition-all
                hover:bg-white
                hover:text-[#12364e]
              "
            >
              ×
            </button>

            <div className="px-7 pb-7 pt-8">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-[13px]
                  border
                  border-[#d3e0e6]
                  bg-[#eaf2f6]
                  text-[#356f9f]
                "
              >
                <LogoutIcon />
              </div>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64869a]">
                Sessão
              </p>

              <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#071f2d]">
                Deseja sair da sua conta?
              </h2>

              <p className="mt-3 text-[11px] leading-5 text-[#687f8c]">
                Você será direcionado para a tela de acesso da Área do Cliente.
              </p>

              <div
                className="
                  mt-5
                  rounded-[12px]
                  border
                  border-[#d9e5eb]
                  bg-white/54
                  px-4
                  py-3.5
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-[10px]
                      bg-[#12364e]
                      text-[10px]
                      font-semibold
                      text-white
                    "
                  >
                    {
                      userInitials
                    }
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-[#29495d]">
                      {
                        userName
                      }
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#7b909b]">
                      Área do Cliente
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={
                    handleCloseLogout
                  }
                  className="
                    rounded-[9px]
                    border
                    border-[#d1dee4]
                    bg-white
                    px-4
                    py-2.5
                    text-[12px]
                    font-semibold
                    text-[#607785]
                    transition-all
                    hover:bg-[#f8fafb]
                  "
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={
                    handleConfirmLogout
                  }
                  className="
                    rounded-[9px]
                    bg-[#12364e]
                    px-4
                    py-2.5
                    text-[12px]
                    font-semibold
                    text-white
                    transition-all
                    hover:bg-[#0d2d41]
                  "
                >
                  Sair da conta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
 * AUXILIAR
 * ============================================================ */

function getInitials(
  name,
) {
  const parts =
    String(
      name,
    )
      .trim()
      .split(/\s+/)
      .filter(
        Boolean,
      );

  if (
    parts.length ===
    0
  ) {
    return "CL";
  }

  if (
    parts.length ===
    1
  ) {
    return parts[0]
      .slice(
        0,
        2,
      )
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/* ============================================================
 * ÍCONES
 * ============================================================ */

function PortalIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1.5"
      />

      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1.5"
      />

      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1.5"
      />

      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1.5"
      />
    </svg>
  );
}

function HomeIcon() {
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
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 7V5a2 2 0 0 1 2-2h5l2 2h4" />
    </svg>
  );
}

function DocumentsIcon() {
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
      <path d="M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}