import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArrowRightIcon } from "@/components/ui/ArrowIcons";

export function AboutSection() {
  return (
    <section className="bg-[var(--color-surface)]">
      <Container>
        {/* Divisão Hero / Sobre */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <div className="h-[2px] w-12 bg-[var(--color-brand)] opacity-75" />
        </div>

        <div className="grid items-center gap-10 py-14 sm:gap-12 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-24">
          {/* Foto */}
          <div className="overflow-hidden rounded-[var(--radius-lg)]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/home/lab-bosello.jpeg"
                alt="Área do Centro de Excelência em Metrologia com o equipamento Bosello Max"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[var(--color-brand)]">
              Sobre o Centro
            </p>

            <h2 className="mt-4 text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-5xl">
              Tecnologia aplicada aos desafios da indústria.
            </h2>

            <p className="mt-5 text-base leading-7 text-[var(--color-text-secondary)] sm:mt-6 sm:text-lg sm:leading-8">
              O Centro de Excelência em Metrologia reúne tecnologias e
              conhecimentos voltados à medição, inspeção, digitalização e
              engenharia reversa, apoiando diferentes necessidades e desafios
              do setor industrial.
            </p>

            <Link
              href="/sobre"
              className="group mt-7 inline-flex items-center gap-3 text-sm font-medium text-[var(--color-brand)] transition-colors duration-200 hover:text-[var(--color-brand-dark)]"
            >
              Conheça o Centro

              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}