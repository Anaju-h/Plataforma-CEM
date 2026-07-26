import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";

const navigation = [
  { label: "Serviços", href: "/servicos" },
  { label: "Soluções", href: "/solucoes" },
  { label: "Equipamentos", href: "/equipamentos" },
  { label: "Sobre", href: "/sobre" },
];

export function Header() {
  return (
    <header className="bg-white">
      <Container>
        <div className="flex h-24 items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Centro de Excelência em Metrologia - Página inicial"
          >
            <Image
              src="/brand/centro-excelencia.png"
              alt="Centro de Excelência em Metrologia SENAI ZEISS"
              width={700}
              height={190}
              priority
              className="h-auto w-[220px] sm:w-[250px] xl:w-[280px]"
            />
          </Link>

          {/* Navegação desktop */}
          <div className="hidden flex-1 items-center justify-end gap-10 lg:flex">
            <nav
              className="flex items-center gap-8"
              aria-label="Navegação principal"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Idioma - ainda provisório */}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
              aria-label="Selecionar idioma"
            >
              PT

              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
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
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] lg:hidden"
            aria-label="Abrir menu"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-px w-5 bg-[var(--color-text-primary)]" />
              <span className="block h-px w-5 bg-[var(--color-text-primary)]" />
              <span className="block h-px w-5 bg-[var(--color-text-primary)]" />
            </span>
          </button>
        </div>
      </Container>

      {/* Linha inferior bem discreta */}
      <div className="h-px bg-[var(--color-border)] opacity-60" />
    </header>
  );
}