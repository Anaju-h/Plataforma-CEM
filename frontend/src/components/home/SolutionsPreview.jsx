import { Link } from "react-router-dom";

import { Container } from "../layout/Container";
import { ArrowRightIcon } from "../ui/ArrowIcons";

const paths = [
  {
    number: "01",
    label: "Já sei o que preciso",
    title: "Solicitar orçamento",
    description:
      "Envie as principais informações do seu projeto para nossa equipe analisar sua necessidade.",
    href: "/orcamento",
  },
  {
    number: "02",
    label: "Preciso de orientação",
    title: "Configurar minha solução",
    description:
      "Responda algumas perguntas e identifique os serviços e tecnologias mais adequados ao seu desafio.",
    href: "/configurador",
  },
];

export function SolutionsPreview() {
  return (
    <section
      id="solucoes"
      className="relative scroll-mt-20 overflow-hidden bg-[#071f2d] py-12 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-40 h-[320px] w-[320px] rounded-full border border-white/[0.035]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 -top-20 h-[210px] w-[210px] rounded-full border border-white/[0.035]"
      />

      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          <div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.09em] text-[#68b7ed]">
                Soluções
              </p>

              <div className="h-px w-10 bg-[#68b7ed]/70" />
            </div>

            <h2 className="mt-4 max-w-xl text-[2.4rem] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl">
              Como podemos ajudar no seu projeto?
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#c4d2dc] sm:text-lg">
              Se você já conhece sua necessidade, envie os dados para nossa
              equipe. Se ainda está definindo a solução, nosso configurador
              pode orientar o processo.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {paths.map((item) => (
              <Link
                key={item.number}
                to={item.href}
                className="
                  group relative overflow-hidden
                  rounded-[22px]
                  border border-white/10
                  bg-white
                  px-5 py-5
                  transition-all duration-300 ease-out
                  hover:-translate-y-1
                  hover:border-[#9ccce9]
                  hover:shadow-[0_16px_38px_rgba(0,0,0,0.12)]
                  sm:px-7 sm:py-6
                "
              >
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9e5ec] text-[11px] font-medium tracking-[0.08em] text-[#356f9f] transition-colors duration-300 group-hover:border-[#8dbddd]">
                    {item.number}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#5687ad] sm:text-[11px] sm:tracking-[0.1em]">
                      {item.label}
                    </p>

                    <h3 className="mt-1.5 text-lg font-semibold leading-tight tracking-[-0.025em] text-[#0b2340] sm:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 hidden max-w-xl text-sm leading-6 text-[#667887] sm:block">
                      {item.description}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d8e3ea] text-[#0b2340] transition-all duration-300 group-hover:border-[#0b2340] group-hover:bg-[#0b2340] group-hover:text-white sm:h-11 sm:w-11">
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>

                <div className="mt-4 h-px w-full bg-[#e3eaef]">
                  <div className="h-px w-12 bg-[#69aedd] transition-all duration-500 ease-out group-hover:w-full" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}