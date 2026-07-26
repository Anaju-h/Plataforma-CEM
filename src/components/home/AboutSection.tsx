import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function AboutSection() {
  return (
    <section className="bg-[var(--color-surface)] py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Foto do laboratório / Bosello provisória */}
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

            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-5xl">
              Tecnologia aplicada aos desafios da indústria.
            </h2>

            <p className="mt-6 text-lg leading-8 text-[var(--color-text-secondary)]">
              O Centro de Excelência em Metrologia reúne tecnologias e
              conhecimentos voltados à medição, inspeção, digitalização e
              engenharia, apoiando diferentes necessidades e desafios do setor
              industrial.
            </p>

            <Link
              href="/sobre"
              className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-[var(--color-brand)] transition-colors duration-200 hover:text-[var(--color-brand-dark)]"
            >
              Conheça o Centro
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}