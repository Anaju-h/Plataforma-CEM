import {
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

/* ============================================================
 * ROTAS
 * ============================================================ */

const routeInformation = {
  "/cliente/dashboard": {
    eyebrow: "Área do Cliente",
    title: "Visão geral",
  },

  "/cliente/nova-solicitacao": {
    eyebrow: "Atendimentos",
    title: "Nova solicitação",
  },

  "/cliente/solicitacoes": {
    eyebrow: "Atendimentos",
    title: "Solicitações",
  },

  "/cliente/orcamentos": {
    eyebrow: "Comercial",
    title: "Orçamentos",
  },

  "/cliente/projetos": {
    eyebrow: "Execução",
    title: "Projetos",
  },

  "/cliente/documentos": {
    eyebrow: "Arquivos",
    title: "Documentos",
  },

  "/cliente/conta": {
    eyebrow: "Área do Cliente",
    title: "Minha conta",
  },
};

const mobileNavigation = [
  {
    label: "Visão geral",
    href: "/cliente/dashboard",
  },
  {
    label: "Solicitações",
    href: "/cliente/solicitacoes",
  },
  {
    label: "Orçamentos",
    href: "/cliente/orcamentos",
  },
  {
    label: "Projetos",
    href: "/cliente/projetos",
  },
  {
    label: "Documentos",
    href: "/cliente/documentos",
  },
];

/* ============================================================
 * COMPONENTE
 * ============================================================ */

export function CustomerTopbar({
  mobile = false,
  customer,
}) {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const information =
    useMemo(
      () =>
        routeInformation[
          location.pathname
        ] ?? {
          eyebrow:
            "Área do Cliente",

          title:
            "Portal",
        },
      [
        location.pathname,
      ],
    );

  function handleOpenAccount() {
    navigate(
      "/cliente/conta",
    );
  }

  if (
    mobile
  ) {
    return (
      <MobileTopbar
        information={
          information
        }
        customer={
          customer
        }
        open={
          mobileMenuOpen
        }
        onToggle={() =>
          setMobileMenuOpen(
            (
              current,
            ) =>
              !current,
          )
        }
        onClose={() =>
          setMobileMenuOpen(
            false,
          )
        }
        onOpenAccount={
          handleOpenAccount
        }
      />
    );
  }

  return (
    <header className="fixed left-[324px] right-0 top-0 z-30 px-6 pt-4 xl:px-8">
      <div
        className="
          mx-auto
          flex
          h-[72px]
          max-w-[1480px]
          items-center
          justify-between
          rounded-[22px]
          border
          border-white/70
          bg-white/52
          px-5
          shadow-[0_14px_38px_rgba(31,68,92,0.07)]
          backdrop-blur-[24px]
        "
      >
        {/* ===================================================
            IDENTIFICAÇÃO DA PÁGINA + MARCAS
        =================================================== */}

        <div className="flex min-w-0 items-center gap-4">
          <div className="shrink-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5f8297]">
              {
                information.eyebrow
              }
            </p>

            <h1 className="mt-0.5 text-[19px] font-semibold tracking-[-0.025em] text-[#071f2d]">
              {
                information.title
              }
            </h1>
          </div>

          <div className="hidden h-8 w-px bg-[#cbd9e0]/66 lg:block" />

          {/* ===============================================
              LOGOS INSTITUCIONAIS
          =============================================== */}

          <div className="hidden items-center gap-5 lg:flex">
            <img
              src="/brand/centro-de-excelencia-senai.png"
              alt="Centro de Excelência em Metrologia"
              className="
                h-auto
                w-[200px]
                shrink-0
                object-contain
                xl:w-[210px]
              "
            />

            <img
              src="/brand/logo-senai.png"
              alt="SENAI"
              className="
                h-auto
                w-[68px]
                shrink-0
                object-contain
                xl:w-[78px]
              "
            />
          </div>
        </div>

        {/* ===================================================
            AÇÕES
        =================================================== */}

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Notificações"
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-[12px]
              border
              border-white/74
              bg-white/36
              text-[#617e8d]
              transition-all
              hover:border-[#acc5d1]
              hover:bg-white/70
              hover:text-[#12364e]
            "
          >
            <BellIcon />

            <span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#0057b8]" />
          </button>

          <button
            type="button"
            onClick={
              handleOpenAccount
            }
            className="
              flex
              h-10
              items-center
              gap-3
              rounded-[12px]
              border
              border-white/74
              bg-white/36
              pl-2
              pr-3
              transition-all
              hover:border-[#acc5d1]
              hover:bg-white/70
            "
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12364e] text-[9px] font-semibold text-white">
              {getInitials(
                customer?.user?.name,
              )}
            </span>

            <span className="hidden text-left xl:block">
              <span className="block text-[10px] font-semibold text-[#31566d]">
                {customer?.user?.name ??
                  "Cliente"}
              </span>

              <span className="mt-0.5 block text-[8px] text-[#8a9aa3]">
                Minha conta
              </span>
            </span>

            <ChevronIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
 * MOBILE
 * ============================================================ */

function MobileTopbar({
  information,
  customer,
  open,
  onToggle,
  onClose,
  onOpenAccount,
}) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
        <div className="flex h-[70px] items-center justify-between rounded-[20px] border border-white/70 bg-white/72 px-4 shadow-[0_16px_38px_rgba(31,68,92,0.12)] backdrop-blur-[24px]">
          <div className="flex min-w-0 items-center gap-4">
            <img
              src="/brand/centro-de-excelencia-senai.png"
              alt="Centro de Excelência em Metrologia"
              className="w-[132px] object-contain"
            />

            <img
              src="/brand/logo-senai.png"
              alt="SENAI"
              className="w-[66px] object-contain"
            />
          </div>

          <button
            type="button"
            onClick={
              onToggle
            }
            aria-label="Abrir navegação"
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#bfd0d9]/54 bg-white/44 text-[#31566d]"
          >
            {open ? (
              <CloseIcon />
            ) : (
              <MenuIcon />
            )}
          </button>
        </div>
      </header>

      <div
        className={`
          fixed
          inset-0
          z-40
          bg-[#071f2d]/20
          backdrop-blur-[6px]
          transition-all
          duration-300

          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={
          onClose
        }
      />

      <div
        className={`
          fixed
          left-3
          right-3
          top-[90px]
          z-50
          overflow-hidden
          rounded-[22px]
          border
          border-white/70
          bg-[#eef5f8]/94
          p-3
          shadow-[0_24px_60px_rgba(31,68,92,0.18)]
          backdrop-blur-[26px]
          transition-all
          duration-300

          ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          }
        `}
      >
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenAccount();
          }}
          className="
            mb-3
            flex
            w-full
            items-center
            justify-between
            rounded-[15px]
            border
            border-white/70
            bg-white/38
            px-3
            py-3
            text-left
            transition-all
            hover:bg-white/55
          "
        >
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#356f9f]">
              {
                information.eyebrow
              }
            </p>

            <p className="mt-1 text-[11px] font-semibold text-[#12364e]">
              {
                customer?.user?.name ??
                "Cliente"
              }
            </p>

            <p className="mt-0.5 text-[8px] text-[#7c929e]">
              Minha conta
            </p>
          </div>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12364e] text-[10px] font-semibold text-white">
            {getInitials(
              customer?.user?.name,
            )}
          </span>
        </button>

        <nav className="space-y-1">
          {mobileNavigation.map(
            (
              item,
            ) => (
              <NavLink
                key={
                  item.href
                }
                to={
                  item.href
                }
                onClick={
                  onClose
                }
                className={({
                  isActive,
                }) =>
                  `
                    flex
                    h-11
                    items-center
                    justify-between
                    rounded-[12px]
                    px-3
                    text-[11px]
                    font-medium
                    transition

                    ${
                      isActive
                        ? "bg-[#d8ebf5] text-[#0057b8]"
                        : "text-[#617b89] hover:bg-white/48 hover:text-[#12364e]"
                    }
                  `
                }
              >
                <span>
                  {
                    item.label
                  }
                </span>

                <span>
                  →
                </span>
              </NavLink>
            ),
          )}
        </nav>
      </div>
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
      name ??
      "Cliente",
    )
      .trim()
      .split(/\s+/)
      .filter(
        Boolean,
      );

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

function BellIcon() {
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
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#8c9da5]"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}