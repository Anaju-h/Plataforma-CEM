import {
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Footer,
} from "../components/layout/Footer";

import {
  Header,
} from "../components/layout/Header";

import { AutoTranslate } from "../i18n/AutoTranslate";

export function PublicLayout() {
  const location =
    useLocation();

  const isConfigurator =
    location.pathname ===
    "/configurador";

  return (
    <div
      className={`
        min-h-screen

        ${
          isConfigurator
            ? "bg-transparent"
            : "bg-white"
        }
      `}
    >
      <AutoTranslate>
      <Header />

      <main
        className="
          relative
          bg-transparent
          pt-[84px]
          sm:pt-[88px]
          lg:pt-[92px]
        "
      >
        <Outlet />
      </main>

      <Footer />
      </AutoTranslate>
    </div>
  );
}