import { Outlet } from "react-router-dom";

import { Header } from "../components/layout/Header";

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#e5eef3]">
      <Header />

      <main className="relative pt-[84px] sm:pt-[88px] lg:pt-[92px]">
        <Outlet />
      </main>
    </div>
  );
}