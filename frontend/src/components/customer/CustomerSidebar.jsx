import { useState } from "react";
import { NavLink } from "react-router-dom";

import { CustomerContactModal } from "./CustomerContactModal";

const navigation = [
  {
    label: "Visão geral",
    href: "/cliente/dashboard",
    icon: "dashboard",
  },
  {
    label: "Solicitações",
    href: "/cliente/solicitacoes",
    icon: "requests",
  },
  {
    label: "Orçamentos",
    href: "/cliente/orcamentos",
    icon: "quotes",
  },
  {
    label: "Projetos",
    href: "/cliente/projetos",
    icon: "projects",
  },
  {
    label: "Documentos",
    href: "/cliente/documentos",
    icon: "documents",
  },
];

function NavigationIcon({ type }) {
  if (type === "dashboard") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect
          x="3"
          y="3"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <rect
          x="12"
          y="3"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <rect
          x="3"
          y="12"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <rect
          x="12"
          y="12"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    );
  }

  if (type === "requests") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M5 3.5H15V16.5H5V3.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M8 7H12M8 10H12M8 13H11"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "quotes") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M3.5 5H16.5V15H3.5V5Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M6.5 8H13.5M6.5 11H10.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "projects") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M3.5 6.5H16.5V15.5H3.5V6.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M7 6.5V4.5H13V6.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 2.8H12.5L16 6.3V17.2H5V2.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 2.8V6.3H16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8 10H13M8 13H12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CustomerSidebar() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-[240px] shrink-0 border-r border-[#dde5e9] bg-white lg:flex lg:flex-col">
        <div className="px-5 py-6">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9aa4ab]">
            Navegação
          </p>

          <nav
            className="mt-3 space-y-1"
            aria-label="Área do cliente"
          >
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => `
                  flex items-center gap-3
                  rounded-[9px]
                  px-3 py-3
                  text-[13px] font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#eaf3fb] text-[#0057b8]"
                      : "text-[#56636c] hover:bg-[#f4f7f9] hover:text-[#071f2d]"
                  }
                `}
              >
                <NavigationIcon type={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#e6ebee] p-5">
          <div className="rounded-[10px] bg-[#f5f8fa] p-4">
            <p className="text-[11px] font-semibold text-[#071f2d]">
              Precisa de ajuda?
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#76818a]">
              Entre em contato com a equipe do laboratório.
            </p>

            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="
                mt-3
                inline-flex items-center gap-2
                text-[11px] font-semibold
                text-[#0057b8]
                transition-colors
                hover:text-[#003f82]
              "
            >
              Falar com o laboratório

              <span aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>
      </aside>

      <CustomerContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}