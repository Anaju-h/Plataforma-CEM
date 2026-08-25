import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";

const navigation = [
  {
    label: "Serviços",
    href: "/servicos",
  },
  {
    label: "Equipamentos",
    href: "/equipamentos",
  },
  {
    label: "Soluções",
    href: "/#solucoes",
  },
];

export function Header() {
  return (
    <header className="relative overflow-hidden bg-[#071f2d]">
      {/* Elementos técnicos decorativos */}
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

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          right-[190px] top-0
          hidden h-full w-px
          bg-white/[0.035]
          xl:block
        "
      />

      <Container>
        <div
          className="
            relative z-10
            flex h-[74px] items-center justify-between gap-8
            sm:h-[78px]
            lg:h-[82px]
          "
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Centro de Excelência em Metrologia - Página inicial"
          >
            <Image
              src="/brand/zeiss-senai-branco.png"
              alt="Centro de Excelência em Metrologia SENAI ZEISS"
              width={1536}
              height={1024}
              priority
              className="
                h-auto
                w-[205px]
                sm:w-[225px]
                lg:w-[245px]
                xl:w-[260px]
              "
            />
          </Link>

          {/* Navegação desktop */}
          <div className="hidden flex-1 items-center justify-end gap-9 lg:flex">
            <nav
              className="flex items-center gap-8 xl:gap-10"
              aria-label="Navegação principal"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    group relative
                    py-3
                    text-[13px] font-medium
                    tracking-[0.015em]
                    !text-white
                    transition-colors duration-200
                    hover:!text-[#65b8ee]
                  "
                >
                  {item.label}

                  {/* Linha de hover */}
                  <span
                    aria-hidden="true"
                    className="
                      absolute inset-x-0 bottom-[4px]
                      h-px
                      origin-left scale-x-0
                      bg-[#65b8ee]
                      transition-transform duration-300 ease-out
                      group-hover:scale-x-100
                    "
                  />
                </Link>
              ))}
            </nav>

            {/* Divisor */}
            <div className="h-5 w-px bg-white/25" />

            {/* Idioma */}
            <button
              type="button"
              className="
                group flex cursor-pointer items-center gap-2
                py-3
                text-[13px] font-medium
                tracking-[0.04em]
                !text-white
                transition-colors duration-200
                hover:!text-[#65b8ee]
              "
              aria-label="Selecionar idioma"
            >
              PT

              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-y-[1px]"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Menu mobile */}
          <button
            type="button"
            className="
              flex h-10 w-10 shrink-0 cursor-pointer
              items-center justify-center
              rounded-full
              border border-white/20
              bg-white/[0.04]
              transition-all duration-200
              hover:border-[#65b8ee]/70
              hover:bg-white/[0.08]
              lg:hidden
            "
            aria-label="Abrir menu"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block h-px w-[18px] bg-white" />
              <span className="block h-px w-[18px] bg-white" />
              <span className="block h-px w-[18px] bg-white" />
            </span>
          </button>
        </div>
      </Container>

      {/* Linha técnica inferior */}
      <div className="relative z-10 flex h-[2px]">
        <div className="w-[8%] min-w-[80px] max-w-[140px] bg-[#65b8ee]" />
        <div className="flex-1 bg-white/[0.09]" />
      </div>
    </header>
  );
}