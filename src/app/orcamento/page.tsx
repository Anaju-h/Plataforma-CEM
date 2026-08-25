import { Container } from "@/components/layout/Container";
import { QuoteForm } from "@/components/quote/QuoteForm";

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-[#f5f8fa]">
      {/* Introdução */}
      <section className="relative overflow-hidden border-b border-[#dfe7ec] bg-white py-12 sm:py-14 lg:py-16">
        {/* Elementos decorativos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-44 -top-60 h-[520px] w-[520px] rounded-full border border-[#356f9f]/[0.04]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-32 h-[320px] w-[320px] rounded-full border border-[#356f9f]/[0.04]"
        />

        <Container>
          <div className="relative z-10 grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium uppercase tracking-[0.09em] text-[#356f9f]">
                  Solicitar orçamento
                </p>

                <div className="h-px w-10 bg-[#6fa7d1]" />
              </div>

              <h1 className="mt-5 max-w-3xl text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[#0b2340] sm:text-6xl">
                Conte um pouco sobre o seu projeto.
              </h1>
            </div>

            <p className="max-w-xl text-base leading-7 text-[#667887] sm:text-lg sm:leading-8">
              Envie as principais informações da sua necessidade para que nossa
              equipe possa realizar uma avaliação inicial do projeto.
            </p>
          </div>
        </Container>
      </section>

      {/* Formulário */}
      <QuoteForm />
    </main>
  );
}