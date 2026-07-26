import Image from "next/image";
import { Container } from "@/components/layout/Container";

export function HeroSection() {
  return (
    <section className="bg-white pt-16 sm:pt-20 lg:pt-24">
      <Container>
        <div className="grid items-center gap-12 pb-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-20">
          {/* Conteúdo */}
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[var(--color-brand)]">
              Centro de Excelência em Metrologia
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-6xl">
              Precisão para transformar desafios em soluções.
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-[var(--color-text-secondary)]">
              Tecnologia, metrologia e engenharia aplicadas às necessidades da
              indústria.
            </p>
          </div>

          {/* DuraMax */}
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-technical)]">
            <div className="relative aspect-[16/10] min-h-[360px] overflow-hidden">
              <Image
                src="/images/home/hero-duramax.jpeg"
                alt="DuraMax realizando a medição de uma peça no Centro de Excelência em Metrologia"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071a2b]/80 via-[#071a2b]/5 to-transparent" />

              {/* Texto */}
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <div className="mb-4 h-px w-14 bg-[#5fa9df]" />

                <p className="max-w-sm text-2xl font-medium leading-tight text-white">
                  Medição. Análise. Transformação.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divisor visual */}
        <div className="flex items-center gap-3 pb-8">
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <div className="h-0.5 w-12 bg-[var(--color-brand)] opacity-75" />
        </div>
      </Container>
    </section>
  );
}