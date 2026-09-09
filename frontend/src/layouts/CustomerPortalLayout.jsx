import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { CustomerSidebar } from "../components/customer/CustomerSidebar";
import { CustomerTopbar } from "../components/customer/CustomerTopbar";
import { getCurrentCustomer } from "../services/customer/customerService";

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

export function CustomerPortalLayout() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCustomer() {
      try {
        const data = await getCurrentCustomer();

        if (active) {
          setCustomer(data);
          setLoadError(false);
        }
      } catch {
        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCustomer();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f9]">
        <p className="text-[13px] text-[#68737d]">
          Carregando área do cliente...
        </p>
      </div>
    );
  }

  if (loadError || !customer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f9] px-5">
        <div className="max-w-[420px] text-center">
          <h1 className="text-[22px] font-semibold text-[#071f2d]">
            Não foi possível carregar sua área
          </h1>

          <p className="mt-3 text-[13px] leading-6 text-[#68737d]">
            Tente acessar novamente. Se o problema continuar, entre em contato
            com o laboratório.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9]">
      <CustomerTopbar customer={customer} />

      <div className="border-b border-[#dce5e9] bg-white lg:hidden">
        <nav
          className="flex gap-1 overflow-x-auto px-4 py-2"
          aria-label="Navegação da área do cliente"
        >
          {mobileNavigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => `
                shrink-0 rounded-[8px] px-3 py-2
                text-[12px] font-medium
                ${
                  isActive
                    ? "bg-[#eaf3fb] text-[#0057b8]"
                    : "text-[#65717a]"
                }
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex min-h-[calc(100vh-78px)]">
        <CustomerSidebar />

        <main className="min-w-0 flex-1">
          <Outlet context={{ customer }} />
        </main>
      </div>
    </div>
  );
}