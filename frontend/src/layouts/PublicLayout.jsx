import { Outlet } from "react-router-dom";

import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main
        className="
          relative
          pt-[84px]
          sm:pt-[88px]
          lg:pt-[92px]
        "
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}