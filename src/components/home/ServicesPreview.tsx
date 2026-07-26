import Link from "next/link";
import { Container } from "@/components/layout/Container";

type ServiceIconProps = {
  type: "measurement" | "scan" | "reverse" | "internal";
};

function ServiceIcon({ type }: ServiceIconProps) {
  const commonProps = {
    width: 42,
    height: 42,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (type === "measurement") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path
          d="M12 34L31 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <path
          d="M10 30L18 38"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <path
          d="M27 11L35 19"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <path
          d="M9 37L6 40M38 10L41 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <circle
          cx="24"
          cy="24"
          r="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (type === "scan") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path
          d="M16 19L24 14L32 19V29L24 34L16 29V19Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <path
          d="M16 19L24 24L32 19M24 24V34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <path
          d="M8 16V9H15M33 9H40V16M40 32V39H33M15 39H8V32"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "reverse") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <rect
          x="8"
          y="10"
          width="32"
          height="24"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <path
          d="M18 39H30M24 34V39"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <path
          d="M18 19L24 15L30 19V26L24 30L18 26V19Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <path
          d="M18 19L24 23L30 19M24 23V30"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg {...commonProps} aria-hidden="true">
      <circle
        cx="24"
        cy="22"
        r="12"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="24"
        cy="22"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M24 10V34M12 22H36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      <path
        d="M15 35L10 40M33 35L38 40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const services = [
  {
    number: "01",
    icon: "measurement" as const,
    title: "Inspeção dimensional",
    description:
      "Medição e análise dimensional para avaliação de peças, geometrias e requisitos técnicos.",
  },
  {
    number: "02",
    icon: "scan" as const,
    title: "Digitalização 3D",
    description:
      "Captura precisa da geometria de peças e componentes para análise, documentação e desenvolvimento.",
  },
  {
    number: "03",
    icon: "reverse" as const,
    title: "Engenharia reversa",
    description:
      "Transformação de componentes físicos em informações digitais para reconstrução e desenvolvimento CAD.",
  },
  {
    number: "04",
    icon: "internal" as const,
    title: "Análise interna",
    description:
      "Tecnologias de inspeção para investigação de características internas e estruturas não acessíveis externamente.",
  },
];

export function ServicesPreview() {
  return (
    <section className="bg-[#081c2c] py-20 sm:py-24 lg:py-28">
      <Container>
        {/* Cabeçalho */}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium text-[#76b7e8]">
              O que fazemos
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
              Soluções para diferentes desafios industriais.
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-xl text-lg leading-8 text-[#b8c4cf]">
              Aplicamos tecnologias de metrologia, digitalização e engenharia
              para apoiar diferentes etapas de análise, inspeção e
              desenvolvimento.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.number}
              href="/servicos"
              className="group flex min-h-[390px] flex-col rounded-[var(--radius-lg)] border border-white/15 bg-white/[0.035] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#76b7e8]/60 hover:bg-white/[0.06]"
            >
              {/* Número + seta */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-[0.16em] text-[#76b7e8]">
                  {service.number}
                </span>

                <span
                  aria-hidden="true"
                  className="text-xl text-white/70 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#76b7e8]"
                >
                  ↗
                </span>
              </div>

              {/* Ícone */}
              <div className="mt-8 text-[#76b7e8] transition-colors duration-300 group-hover:text-[#9ac9eb]">
                <ServiceIcon type={service.icon} />
              </div>

              {/* Texto */}
              <div className="mt-8">
                <h3 className="text-2xl font-medium leading-tight tracking-[-0.02em] text-white">
                  {service.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#aebbc6]">
                  {service.description}
                </p>
              </div>

              {/* Explorar */}
              <div className="mt-auto pt-8">
                <span className="inline-flex items-center gap-3 text-sm font-medium text-[#76b7e8]">
                  Explorar

                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Todos os serviços */}
        <div className="mt-10 flex justify-end">
          <Link
            href="/servicos"
            className="group inline-flex items-center gap-3 text-sm font-medium text-[#76b7e8] transition-colors duration-200 hover:text-white"
          >
            Ver todos os serviços

            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}