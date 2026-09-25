import { getCurrentCustomer } from "../services/customer/customerService";
import { useCustomerData } from "../hooks/useCustomerData";
import { CustomerApiState } from "../components/customer/CustomerApiState";
import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  CustomerSidebar,
} from "../components/customer/CustomerSidebar";

import {
  CustomerTopbar,
} from "../components/customer/CustomerTopbar";

/* ============================================================
 * CONTEXTO TEMPORÁRIO DEV
 * ============================================================ */



/* ============================================================
 * LAYOUT
 * ============================================================ */

export function CustomerPortalLayout() {
  const state = useCustomerData(getCurrentCustomer);
  const customer = state.data;
  if (state.status === 401) return <Navigate to="/cliente" replace />;
  if (!customer) return <CustomerApiState {...state} />;

  const outletContext = {
    customer,
    updateCustomer: state.update,
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