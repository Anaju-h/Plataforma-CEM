import { Link, Outlet } from "react-router-dom";

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#f4f7f9]">
      <header className="relative overflow-hidden bg-[#071f2d]">
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute
            -right-[110px] -top-[230px]
            h-[430px] w-[430px]
            rounded-full
            border border-white/[0.045]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute
            right-[25px] -top-[165px]
            h-[310px] w-[310px]
            rounded-full
            border border-[#65b8ee]/[0.08]
          "
        />

        <div className="mx-auto flex min-h-[76px] max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-7 lg:px-9">
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="Voltar para a página inicial"
          >
            <img
              src="/brand/zeiss-senai-branco.png"
              alt="Centro de Excelência em Metrologia SENAI ZEISS"
              className="
                h-auto
                w-[205px]
                sm:w-[225px]
                lg:w-[245px]
              "
            />
          </Link>

          <div className="flex items-center gap-4">
            <span
              className="
                hidden
                text-[12px] font-medium uppercase
                tracking-[0.12em]
                text-white/60
                sm:block
              "
            >
              Área do cliente
            </span>

            <Link
              to="/"
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-white/15
                px-4 py-2
                text-[12px] font-medium
                text-white
                transition-all duration-200
                hover:border-[#65b8ee]/60
                hover:bg-white/[0.05]
              "
            >
              Voltar ao site

              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 3.5L5.5 8L10 12.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex h-[2px]">
          <div className="w-[8%] min-w-[80px] max-w-[140px] bg-[#65b8ee]" />
          <div className="flex-1 bg-white/[0.09]" />
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}