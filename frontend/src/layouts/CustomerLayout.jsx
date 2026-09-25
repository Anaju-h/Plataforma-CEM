import { Outlet } from "react-router-dom";

import { Header } from "../components/layout/Header";
import { AutoTranslate } from "../i18n/AutoTranslate";

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#e5eef3]">
      <AutoTranslate>
        <Header />

        <main className="relative pt-[84px] sm:pt-[88px] lg:pt-[92px]">
          <Outlet />
        </main>
      </AutoTranslate>
    </div>
  );
}