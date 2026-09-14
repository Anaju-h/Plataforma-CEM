import {
  Outlet,
} from "react-router-dom";

import {
  CustomerSidebar,
} from "../components/customer/CustomerSidebar";

import {
  CustomerTopbar,
} from "../components/customer/CustomerTopbar";

/* ============================================================
 * DADOS MOCK
 * ============================================================ */

const mockCustomer = {
  company: {
    name: "Empresa cliente",
    city: "Goiânia",
    state: "GO",
  },

  user: {
    name: "Cliente",
    email: "cliente@empresa.com",
  },
};

/* ============================================================
 * LAYOUT
 * ============================================================ */

export function CustomerPortalLayout() {
  const customer =
    mockCustomer;

  const outletContext = {
    customer,
  };

  return (
    <div className="min-h-screen bg-[#e5eef3] text-[#102a43]">
      {/* =====================================================
          FUNDO
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#e5eef3]" />

        <div className="absolute -left-[220px] top-[100px] h-[500px] w-[500px] rounded-full bg-[#65b8ee]/7 blur-[130px]" />

        <div className="absolute right-[-240px] top-[22%] h-[650px] w-[650px] rounded-full bg-[#0057b8]/4 blur-[160px]" />

        <div className="absolute bottom-[-220px] left-[38%] h-[500px] w-[620px] rounded-full bg-white/34 blur-[150px]" />
      </div>

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="relative z-10 hidden min-h-screen lg:block">
        <CustomerSidebar
          customer={
            customer
          }
        />

        <div className="min-h-screen pl-[324px]">
          <CustomerTopbar
            customer={
              customer
            }
          />

          <main className="px-6 pb-10 pt-[106px] xl:px-8">
            <div className="mx-auto w-full max-w-[1480px]">
              <Outlet
                context={
                  outletContext
                }
              />
            </div>
          </main>
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET
      ===================================================== */}

      <div className="relative z-10 min-h-screen lg:hidden">
        <CustomerTopbar
          mobile
          customer={
            customer
          }
        />

        <main className="px-4 pb-8 pt-[92px] sm:px-6">
          <div className="mx-auto w-full max-w-[1100px]">
            <Outlet
              context={
                outletContext
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}