import { Link } from "react-router-dom";

export function CustomerTopbar({ customer }) {
  const userName = customer?.user?.name || "Cliente";
  const companyName = customer?.company?.name || "";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <header className="relative border-b border-[#dce5e9] bg-[#071f2d]">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-[90px] -top-[180px]
          h-[330px] w-[330px]
          rounded-full
          border border-white/[0.045]
        "
      />

      <div className="relative z-10 flex h-[76px] items-center justify-between gap-6 px-5 sm:px-7 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="Voltar para o site do laboratório"
        >
          <img
            src="/brand/zeiss-senai-branco.png"
            alt="Centro de Excelência em Metrologia SENAI ZEISS"
            className="h-auto w-[205px] sm:w-[225px] lg:w-[235px]"
          />
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden text-right md:block">
            <p className="text-[12px] font-medium text-white">
              {userName}
            </p>

            <p className="mt-0.5 text-[10px] text-white/50">
              {companyName}
            </p>
          </div>

          <button
            type="button"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full border border-white/15
              bg-white/[0.07]
              text-[11px] font-semibold text-white
              transition-all
              hover:border-[#65b8ee]/60
              hover:bg-white/[0.1]
            "
            aria-label="Abrir opções do usuário"
          >
            {initials}
          </button>

          <div className="hidden h-5 w-px bg-white/15 sm:block" />

          <Link
            to="/"
            className="
              hidden text-[11px] font-medium
              text-white/65 transition-colors
              hover:text-[#65b8ee]
              sm:block
            "
          >
            Voltar ao site
          </Link>
        </div>
      </div>

      <div className="flex h-[2px]">
        <div className="w-[8%] min-w-[80px] max-w-[140px] bg-[#65b8ee]" />
        <div className="flex-1 bg-white/[0.08]" />
      </div>
    </header>
  );
}