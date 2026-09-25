import { Container } from "../components/layout/Container";
import { QuoteForm } from "../components/quote/QuoteForm";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import { createPublicRequest } from "../services/requestApi";
import { PublicRequestCreated } from "../components/quote/PublicRequestCreated";
import { useState } from "react";

export function OrcamentoPage() {
  const [created, setCreated] = useState(null);
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <div className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfc_18%,#eef5f8_46%,#e5f0f4_70%,#f5f9fb_90%,#ffffff_100%)]">
        <QuoteHero />

        <div className="relative pb-14 sm:pb-16 lg:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-[12%] h-[360px] w-[360px] rounded-full bg-[#65b8ee]/[0.07] blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 bottom-[8%] h-[420px] w-[420px] rounded-full bg-[#12364e]/[0.045] blur-[130px]"
          />

          {created ? <PublicRequestCreated created={created} /> : <QuoteForm onSubmit={async (form) => setCreated(await createPublicRequest(form))} />}
        </div>
      </div>
    </main>
  );
}

function QuoteHero() {
  return (
    <section className="relative overflow-hidden pb-8 pt-8 sm:pb-10 sm:pt-10 lg:pb-12 lg:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 -top-52 h-[520px] w-[520px] rounded-full border border-[#356f9f]/[0.05]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-20 h-[300px] w-[300px] rounded-full border border-[#65b8ee]/[0.08]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[35%] h-[320px] w-[320px] rounded-full bg-[#65b8ee]/[0.06] blur-[115px]"
      />

      <Container>
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <ScrollReveal
            direction="right"
            distance={32}
          >
            <div className="flex items-center gap-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                Solicitação rápida
              </p>

              <div className="h-px w-10 bg-[#65b8ee]" />
            </div>

            <h1 className="mt-5 max-w-[720px] text-[2.7rem] font-semibold leading-[1.01] tracking-[-0.05em] text-[#071f2d] sm:text-[3.7rem] lg:text-[4.15rem]">
              Já sabe o que
              <br />
              <span className="text-[#356f9f]">
                precisa realizar?
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={30}
          >
            <div className="max-w-[590px] lg:pb-1">
              <p className="text-[15px] leading-7 text-[#607583] sm:text-[15px]">
                Envie as principais informações da sua necessidade para
                que o Centro possa realizar uma avaliação inicial do
                projeto.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <HeroTag label="Objetivo definido" />
                <HeroTag label="Envio rápido" />
                <HeroTag label="Análise inicial" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function HeroTag({ label }) {
  return (
    <div className="rounded-full border border-white/80 bg-white/48 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5687ad] shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_6px_18px_rgba(7,31,45,0.025)] backdrop-blur-[16px]">
      {label}
    </div>
  );
}

