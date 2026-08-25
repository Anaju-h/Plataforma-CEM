import { Link } from "react-router-dom";

import { Container } from "../layout/Container";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "../ui/ArrowIcons";

function ServiceIcon({ type }) {
  const commonProps = {
    width: 38,
    height: 38,
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
        <path d="M10 30L18 38" stroke="currentColor" strokeWidth="1.5" />
        <path d="M27 11L35 19" stroke="currentColor" strokeWidth="1.5" />
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
    icon: "measurement",
    title: "Inspeção dimensional",
    description:
      "Medição e análise dimensional para avaliação de peças, geometrias e requisitos técnicos.",
    href: "/servicos#inspecao-dimensional",
  },
  {
    number: "02",
    icon: "scan",
    title: "Digitalização 3D",
    description:
      "Captura precisa da geometria de peças e componentes para análise, documentação e desenvolvimento.",
    href: "/servicos#digitalizacao-3d",
  },
  {
    number: "03",
    icon: "reverse",
    title: "Engenharia reversa",
    description:
      "Transformação de componentes físicos em informações digitais para reconstrução e desenvolvimento CAD.",
    href: "/servicos#engenharia-reversa",
  },
  {
    number: "04",
    icon: "internal",
    title: "Análise interna",
    description:
      "Tecnologias de inspeção para investigação de características internas e estruturas não acessíveis externamente.",
    href: "/servicos#analise-interna",
  },
];

export function ServicesPreview() {
  return (
    <section className="bg-[#081c2c] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-10">
          <div>
            <p className="text-sm font-medium text-[#76b7e8]">
              O que fazemos
            </p>

            <h2 className="mt-3 max-w-xl text-[2.55rem] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl">
              Soluções para diferentes desafios industriais.
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-xl text-base leading-7 text-[#b8c4cf] sm:text-lg sm:leading-8">
              Aplicamos tecnologias de metrologia, digitalização e engenharia
              reversa para apoiar diferentes etapas de análise, inspeção e
              desenvolvimento.
            </p>
          </div>
        </div>

        <div
          className="
            no-scrollbar
            mt-10
            flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3
            md:grid md:grid-cols-2 md:overflow-visible md:pb-0
            xl:grid-cols-4
          "
        >
          {services.map((service) => (
            <Link
              key={service.number}
              to={service.href}
              className="
                group
                flex min-h-[340px] min-w-[82%] snap-start flex-col
                rounded-[var(--radius-lg)]
                border border-white/15
                bg-white/[0.035]
                p-6
                transition-all duration-300
                hover:-translate-y-1 hover:border-[#76b7e8]/60 hover:bg-white/[0.06]
                sm:min-w-[62%]
                md:min-h-[330px] md:min-w-0 md:p-6
                xl:min-h-[345px]
              "
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-[0.16em] text-[#76b7e8]">
                  {service.number}
                </span>

                <ArrowUpRightIcon className="h-[18px] w-[18px] text-white/70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#76b7e8]" />
              </div>

              <div className="mt-7 text-[#76b7e8] transition-colors duration-300 group-hover:text-[#9ac9eb]">
                <ServiceIcon type={service.icon} />
              </div>

              <div className="mt-7">
                <h3 className="text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-white sm:text-2xl">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#aebbc6]">
                  {service.description}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <span className="inline-flex items-center gap-3 text-sm font-medium text-[#76b7e8]">
                  Explorar

                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 hidden justify-end md:flex">
          <Link
            to="/servicos"
            className="group inline-flex items-center gap-3 text-sm font-medium text-[#76b7e8] transition-colors duration-200 hover:text-white"
          >
            Ver todos os serviços

            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between md:hidden">
          <p className="text-xs uppercase tracking-[0.12em] text-[#7d9aab]">
            Deslize para explorar
          </p>

          <Link
            to="/servicos"
            className="group inline-flex items-center gap-2 text-xs font-medium text-[#76b7e8]"
          >
            Todos

            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}