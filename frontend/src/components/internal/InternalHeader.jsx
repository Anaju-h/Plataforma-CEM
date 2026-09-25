import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  useLocation,
  Link,
} from "react-router-dom";

import {
  NotificationBell,
} from "./NotificationBell";

const pageInformation = {
  "/portal/conta": { eyebrow: "Perfil", title: "Minha Conta" },
  "/portal": {
    eyebrow: "Visão geral",
    title: "Meu trabalho",
  },

  "/portal/meu-trabalho": {
    eyebrow: "Visão geral",
    title: "Meu trabalho",
  },

  "/portal/solicitacoes": {
    eyebrow: "Operação",
    title: "Solicitações",
  },

  "/portal/orcamentos": {
    eyebrow: "Operação",
    title: "Orçamentos",
  },

  "/portal/projetos": {
    eyebrow: "Operação",
    title: "Projetos",
  },

  "/portal/conhecimento": {
    eyebrow: "Conhecimento",
    title: "Gestão do Conhecimento",
  },

  "/portal/equipamentos-custos": {
    eyebrow: "Conhecimento",
    title: "Equipamentos e custos",
  },

  "/portal/tarefas": {
    eyebrow: "Gestão",
    title: "Quadro de tarefas",
  },

  "/portal/equipe": {
    eyebrow: "Gestão",
    title: "Equipe",
  },

  "/portal/administracao": {
    eyebrow: "Gestão",
    title: "Administração",
  },
};

export function InternalHeader({
  onOpenSidebar,
}) {
  const user = useCurrentUser();
  const location =
    useLocation();

  const currentPage =
    resolveCurrentPage(
      location.pathname,
    );

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-7">
      <div
        className="
          relative
          mx-auto
          flex
          h-[78px]
          w-full
          max-w-[1600px]
          items-center
          justify-between
          overflow-visible
          rounded-[24px]
          border
          border-white/70
          bg-[linear-gradient(90deg,rgba(246,249,251,0.90)_0%,rgba(255,255,255,0.79)_48%,rgba(225,237,244,0.80)_100%)]
          px-4
          shadow-[0_12px_36px_rgba(7,31,45,0.08),inset_0_1px_0_rgba(255,255,255,0.85)]
          backdrop-blur-[26px]
          sm:px-5
          lg:px-6
        "
      >
        {/* ===================================================
            CAMADA VISUAL
            Fica recortada sem cortar dropdowns e menus
        =================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
            overflow-hidden
            rounded-[inherit]
          "
        >
          <div
            className="
              absolute
              -left-20
              top-1/2
              h-32
              w-56
              -translate-y-1/2
              rounded-full
              bg-[#65b8ee]/10
              blur-[42px]
            "
          />

          <div
            className="
              absolute
              -right-20
              top-1/2
              h-32
              w-56
              -translate-y-1/2
              rounded-full
              bg-[#0057b8]/8
              blur-[46px]
            "
          />

          <div
            className="
              absolute
              inset-x-[8%]
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/80
              to-transparent
            "
          />
        </div>

        {/* ===================================================
            ESQUERDA
        =================================================== */}

        <div className="relative z-10 flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={
              onOpenSidebar
            }
            aria-label="Abrir menu"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-[11px]
              border
              border-[#afc4cf]/45
              bg-white/46
              text-[#12364e]
              transition-all
              hover:bg-white/70
              lg:hidden
            "
          >
            <MenuIcon />
          </button>

          <div className="min-w-0">
            <p
              className="
                text-[13px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-[#52758a]
              "
            >
              {
                currentPage.eyebrow
              }
            </p>

            <p
              className="
                mt-1
                truncate
                text-[18px]
                font-semibold
                tracking-[-0.025em]
                text-[#12364e]
              "
            >
              {
                currentPage.title
              }
            </p>
          </div>

          {/* =================================================
              LOGOS
          ================================================= */}

          <div className="ml-5 hidden items-center gap-4 md:flex">
            <img
              src="/brand/centro-de-excelencia-senai.png"
              alt="Centro de Excelência em Metrologia"
              className="h-auto w-[185px] object-contain lg:w-[205px]"
            />

            <img
              src="/brand/logo-senai.png"
              alt="SENAI"
              className="h-auto w-[78px] object-contain lg:w-[88px]"
            />
          </div>
        </div>

        {/* ===================================================
            DIREITA
        =================================================== */}

        <div
          className="
            relative
            z-20
            flex
            items-center
            gap-3
          "
        >
          {/* =================================================
              NOTIFICAÇÕES
          ================================================= */}

          <div className="relative z-[70]">
            <NotificationBell />
          </div>

          <div className="hidden h-8 w-px bg-[#7895a5]/22 sm:block" />

          {/* =================================================
              USUÁRIO
          ================================================= */}

          <Link to="/portal/conta" aria-label="Minha Conta"
            className="
              hidden
              items-center
              gap-3
              rounded-[13px]
              border
              border-white/65
              bg-white/30
              px-2.5
              py-1.5
              sm:flex
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-[10px]
                bg-[linear-gradient(135deg,#173f58_0%,#0d3046_100%)]
                text-[12px]
                font-semibold
                text-white
              "
            >{user.initials}</div>

            <div className="hidden pr-1 xl:block">
              <p className="text-[13px] font-semibold text-[#17384d]">{user.name}</p>

              <p
                className="
                  mt-0.5
                  text-[13px]
                  font-medium
                  uppercase
                  tracking-[0.06em]
                  text-[#617b89]
                "
              >
                {user.accessProfile}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

function resolveCurrentPage(
  pathname,
) {
  if (
    pageInformation[
      pathname
    ]
  ) {
    return pageInformation[
      pathname
    ];
  }

  if (
    pathname.startsWith(
      "/portal/solicitacoes/",
    )
  ) {
    return {
      eyebrow: "Operação",
      title: "Detalhes da solicitação",
    };
  }

  if (
    pathname.startsWith(
      "/portal/orcamentos/",
    )
  ) {
    return {
      eyebrow: "Operação",
      title: "Detalhes do orçamento",
    };
  }

  if (
    pathname.startsWith(
      "/portal/projetos/",
    )
  ) {
    return {
      eyebrow: "Operação",
      title: "Detalhes do projeto",
    };
  }

  if (
    pathname.startsWith(
      "/portal/conhecimento/",
    )
  ) {
    return {
      eyebrow: "Conhecimento",
      title: "Gestão do Conhecimento",
    };
  }

  return {
    eyebrow: "Portal interno",
    title: "Gestão interna",
  };
}

function MenuIcon() {
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
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}
