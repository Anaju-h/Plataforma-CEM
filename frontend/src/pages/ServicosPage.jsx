import { Link } from "react-router-dom";

import { Container } from "../components/layout/Container";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "../components/ui/ArrowIcons";

const quickLinks = [
  {
    number: "01",
    label: "Inspeção dimensional",
    description: "Medição, tolerâncias e conformidade.",
    href: "#inspecao-dimensional",
  },
  {
    number: "02",
    label: "Digitalização 3D",
    description: "Captura digital de geometrias.",
    href: "#digitalizacao-3d",
  },
  {
    number: "03",
    label: "Engenharia reversa",
    description: "Da peça física ao modelo CAD.",
    href: "#engenharia-reversa",
  },
  {
    number: "04",
    label: "Análise interna",
    description: "Investigação de estruturas internas.",
    href: "#analise-interna",
  },
];

export function ServicosPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-18 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-60 h-[520px] w-[520px] rounded-full border border-[#356f9f]/[0.035]"
        />

        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium uppercase tracking-[0.09em] text-[#356f9f]">
                  Serviços
                </p>

                <div className="h-px w-10 bg-[#6fa7d1]" />
              </div>

              <h1 className="mt-5 max-w-3xl text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[#0b2340] sm:text-6xl">
                Tecnologia aplicada a cada etapa do seu desafio.
              </h1>
            </div>

            <div className="lg:pb-1">
              <p className="max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
                Da medição dimensional à digitalização e análise interna,
                diferentes tecnologias podem ser combinadas de acordo com as
                necessidades de cada projeto.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {quickLinks.map((item) => (
              <a
                key={item.number}
                href={item.href}
                className="
                  group relative overflow-hidden
                  rounded-[22px]
                  border border-[#d6e4ec]
                  bg-[#f0f6f9]
                  px-6 py-6
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-[#91bcd8]
                  hover:bg-[#e8f2f7]
                  hover:shadow-[0_14px_32px_rgba(8,28,44,0.07)]
                "
              >
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full border border-[#5fa9df]/15 transition-transform duration-500 group-hover:scale-125"
                />

                <div className="relative z-10 flex items-start justify-between gap-5">
                  <div>
                    <span className="text-xs font-medium tracking-[0.14em] text-[#356f9f]">
                      {item.number}
                    </span>

                    <h2 className="mt-4 text-[1.05rem] font-semibold leading-tight tracking-[-0.02em] text-[#0b2340]">
                      {item.label}
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-[#667887]">
                      {item.description}
                    </p>
                  </div>

                  <ArrowUpRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#5d7f96] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0057b8]" />
                </div>

                <div className="absolute bottom-0 left-0 h-[2px] w-10 bg-[#69aedd] transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* 01 INSPEÇÃO DIMENSIONAL */}
      <section
        id="inspecao-dimensional"
        className="scroll-mt-24 bg-[var(--color-surface)] py-14 sm:py-18 lg:py-20"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <ServiceTitle
                number="01"
                eyebrow="Precisão dimensional"
                title="Inspeção dimensional"
                intro="Medição e avaliação de características dimensionais e geométricas de peças e componentes para verificar sua conformidade com desenhos, especificações e requisitos técnicos."
              />

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <CompactInfo
                  title="Aplicações"
                  items={[
                    "Verificação dimensional",
                    "Geometrias e tolerâncias",
                    "Comparação com especificações",
                    "Controle de qualidade",
                  ]}
                />

                <CompactInfo
                  title="Tecnologias"
                  items={[
                    "ZEISS PRISMO",
                    "ZEISS DuraMax",
                    "ZEISS O-INSPECT",
                  ]}
                />
              </div>

              <ServiceAction />
            </div>

            <ServiceVideo
              src="/videos/services/inspection-dimensional.mp4"
              label="Inspeção dimensional"
              caption="Medição por coordenadas"
            />
          </div>
        </Container>
      </section>

      {/* 02 DIGITALIZAÇÃO 3D */}
      <section
        id="digitalizacao-3d"
        className="scroll-mt-24 bg-white py-14 sm:py-18 lg:py-20"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div className="order-2 lg:order-1">
              <ServiceVideo
                src="/videos/services/digitalizacao-3d.mp4"
                label="Digitalização 3D"
                caption="Captura da geometria da peça"
              />
            </div>

            <div className="order-1 lg:order-2">
              <ServiceTitle
                number="02"
                eyebrow="Captura digital"
                title="Digitalização 3D"
                intro="Captura da geometria de peças e componentes para criação de representações digitais tridimensionais com alto nível de detalhe."
              />

              <div className="mt-8">
                <p className="text-xs font-medium uppercase tracking-[0.11em] text-[#356f9f]">
                  Fluxo
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <ProcessMini number="01" label="Peça física" />
                  <ProcessMini number="02" label="Captura 3D" />
                  <ProcessMini number="03" label="Modelo digital" />
                </div>
              </div>

              <div className="mt-6">
                <CompactInfo
                  title="Aplicações"
                  items={[
                    "Comparação peça × CAD",
                    "Documentação de geometria",
                    "Superfícies complexas",
                    "Geração de dados 3D",
                  ]}
                />
              </div>

              <ServiceAction />
            </div>
          </div>
        </Container>
      </section>

      {/* 03 ENGENHARIA REVERSA */}
      <section
        id="engenharia-reversa"
        className="scroll-mt-24 bg-[#081c2c] py-14 text-white sm:py-18 lg:py-20"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-sm font-medium tracking-[0.12em] text-[#76b7e8]">
                03
              </p>

              <p className="mt-5 text-xs font-medium uppercase tracking-[0.11em] text-[#76b7e8]">
                Reconstrução digital
              </p>

              <h2 className="mt-3 text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl">
                Engenharia reversa
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#b8c4cf] sm:text-lg sm:leading-8">
                Transformação das informações obtidas de uma peça física em
                dados digitais utilizáveis para reconstrução, documentação ou
                desenvolvimento de modelos CAD.
              </p>

              <div className="mt-8">
                <CompactInfoDark
                  title="Aplicações"
                  items={[
                    "Reconstrução de peças",
                    "Ausência de desenho técnico",
                    "Desenvolvimento CAD",
                    "Documentação de componentes",
                  ]}
                />
              </div>

              <Link
                to="/orcamento"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-medium text-[#76b7e8] transition-colors hover:text-white"
              >
                Solicitar orçamento

                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#76b7e8]">
                  Processo digital
                </p>

                <span className="text-[10px] uppercase tracking-[0.13em] text-white/35">
                  Reverse engineering
                </span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-5">
                <DarkProcessStep number="01" label="Peça" />
                <DarkProcessStep number="02" label="Digitalização" />
                <DarkProcessStep number="03" label="Malha" />
                <DarkProcessStep number="04" label="Superfícies" />
                <DarkProcessStep number="05" label="CAD" />
              </div>

              <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-[20px] border border-dashed border-white/10 bg-[#061724]">
                <div className="text-center">
                  <div className="mx-auto h-px w-12 bg-[#76b7e8]/60" />

                  <p className="mt-4 text-xs uppercase tracking-[0.12em] text-white/35">
                    Área preparada para exemplo visual
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 04 ANÁLISE INTERNA */}
      <section
        id="analise-interna"
        className="scroll-mt-24 bg-white py-14 sm:py-18 lg:py-20"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <ServiceTitle
                number="04"
                eyebrow="Inspeção não destrutiva"
                title="Análise interna"
                intro="Investigação de estruturas e características internas que não podem ser avaliadas somente pela superfície da peça."
              />

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <CompactInfo
                  title="Aplicações"
                  items={[
                    "Estruturas internas",
                    "Defeitos internos",
                    "Cavidades",
                    "Montagens",
                    "Características não acessíveis",
                  ]}
                />

                <CompactInfo
                  title="Tecnologia"
                  items={["ZEISS BOSELLO MAX", "Inspeção por raios X"]}
                />
              </div>

              <ServiceAction />
            </div>

            <div className="relative min-h-[390px] overflow-hidden rounded-[28px] border border-[#dbe6ed] bg-[#eef4f7]">
              <div
                aria-hidden="true"
                className="absolute -right-24 -top-24 h-[330px] w-[330px] rounded-full border border-[#356f9f]/10"
              />

              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-[220px] w-[220px] rounded-full border border-[#356f9f]/10"
              />

              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="max-w-xs text-center">
                  <div className="mx-auto h-px w-14 bg-[#5fa9df]" />

                  <p className="mt-5 text-xs font-medium uppercase tracking-[0.12em] text-[#356f9f]">
                    Internal inspection
                  </p>

                  <p className="mt-4 text-xl font-semibold leading-snug tracking-[-0.02em] text-[#0b2340]">
                    Visualização de estruturas além da superfície.
                  </p>

                  <p className="mt-4 text-sm leading-6 text-[#667887]">
                    Espaço reservado para imagem ou vídeo de inspeção interna.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SOLUÇÃO INTEGRADA */}
      <section className="bg-[var(--color-surface)] py-14 sm:py-18 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium uppercase tracking-[0.09em] text-[#356f9f]">
                  Solução integrada
                </p>

                <div className="h-px w-10 bg-[#6fa7d1]" />
              </div>

              <h2 className="mt-4 max-w-xl text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#0b2340] sm:text-5xl">
                Um projeto pode envolver diferentes tecnologias.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
                As tecnologias podem ser combinadas de acordo com o objetivo,
                as características da peça e as informações necessárias para
                cada projeto.
              </p>
            </div>

            <div className="grid gap-3">
              <ConnectionRow
                from="Digitalização 3D"
                to="Engenharia reversa"
              />

              <ConnectionRow
                from="Engenharia reversa"
                to="Inspeção dimensional"
              />

              <ConnectionRow
                from="Análise interna"
                to="Inspeção dimensional"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-18 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -right-40 h-[470px] w-[470px] rounded-full border border-[#356f9f]/[0.05]"
        />

        <Container>
          <div className="relative z-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium uppercase tracking-[0.09em] text-[#356f9f]">
                    Próximo passo
                  </p>

                  <div className="h-px w-10 bg-[#6fa7d1]" />
                </div>

                <h2 className="mt-4 max-w-xl text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#0b2340] sm:text-5xl">
                  Como deseja continuar?
                </h2>

                <p className="mt-5 max-w-lg text-base leading-7 text-[#667887]">
                  Escolha o caminho mais adequado ao estágio atual do seu
                  projeto.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FinalCard
                  number="01"
                  label="Já sei o que preciso"
                  title="Solicitar orçamento"
                  href="/orcamento"
                />

                <FinalCard
                  number="02"
                  label="Preciso de orientação"
                  title="Configurar minha solução"
                  href="/configurador"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function ServiceTitle({ number, eyebrow, title, intro }) {
  return (
    <div>
      <p className="text-sm font-medium tracking-[0.12em] text-[#356f9f]">
        {number}
      </p>

      <p className="mt-5 text-xs font-medium uppercase tracking-[0.11em] text-[#5687ad]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.04em] text-[#0b2340] sm:text-5xl">
        {title}
      </h2>

      <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
        {intro}
      </p>
    </div>
  );
}

function ServiceVideo({ src, label, caption }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] bg-[#081c2c] shadow-[0_20px_45px_rgba(8,28,44,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        >
          <source src={src} type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061724]/80 via-transparent to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-7">
          <div className="mb-3 h-px w-12 bg-[#65b8ee]" />

          <p className="text-xs font-medium uppercase tracking-[0.11em] text-[#9ccdec]">
            {label}
          </p>

          <p className="mt-2 text-lg font-semibold text-white">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}

function CompactInfo({ title, items }) {
  return (
    <div className="rounded-[20px] border border-[#dfe6eb] bg-white p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#356f9f]">
        {title}
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#6fa7d1]" />

            <p className="text-sm leading-6 text-[#536773]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactInfoDark({ title, items }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#76b7e8]">
        {title}
      </p>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#76b7e8]" />

            <p className="text-sm leading-6 text-[#b8c4cf]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessMini({ number, label }) {
  return (
    <div className="rounded-[16px] border border-[#dce6ec] bg-[#f5f8fa] p-4">
      <span className="text-[10px] font-medium tracking-[0.1em] text-[#356f9f]">
        {number}
      </span>

      <p className="mt-3 text-xs font-semibold leading-5 text-[#0b2340]">
        {label}
      </p>
    </div>
  );
}

function DarkProcessStep({ number, label }) {
  return (
    <div className="rounded-[16px] border border-white/10 bg-white/[0.035] p-4">
      <span className="text-[10px] font-medium tracking-[0.1em] text-[#76b7e8]">
        {number}
      </span>

      <p className="mt-4 text-xs font-semibold leading-5 text-white">
        {label}
      </p>
    </div>
  );
}

function ServiceAction() {
  return (
    <Link
      to="/orcamento"
      className="group mt-8 inline-flex items-center gap-3 text-sm font-medium text-[#356f9f] transition-colors hover:text-[#0b2340]"
    >
      Solicitar orçamento

      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

function ConnectionRow({ from, to }) {
  return (
    <div className="group flex items-center gap-4 rounded-[20px] border border-[#dce5eb] bg-white px-5 py-5 transition-all duration-300 hover:border-[#9ebfd5] sm:px-6">
      <p className="flex-1 text-sm font-semibold text-[#0b2340]">
        {from}
      </p>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef5f9] text-[#356f9f]">
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>

      <p className="flex-1 text-right text-sm font-semibold text-[#0b2340]">
        {to}
      </p>
    </div>
  );
}

function FinalCard({ number, label, title, href }) {
  return (
    <Link
      to={href}
      className="
        group relative overflow-hidden
        rounded-[24px]
        border border-[#d9e5ec]
        bg-[#f2f7fa]
        p-6
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#8dbddd]
        hover:bg-[#ebf4f9]
        hover:shadow-[0_14px_35px_rgba(8,28,44,0.07)]
      "
    >
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 h-28 w-28 rounded-full border border-[#5fa9df]/15 transition-transform duration-500 group-hover:scale-125"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-[0.12em] text-[#356f9f]">
            {number}
          </span>

          <ArrowUpRightIcon className="h-4 w-4 text-[#65869b] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0057b8]" />
        </div>

        <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.1em] text-[#5687ad]">
          {label}
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#0b2340]">
          {title}
        </h3>

        <div className="mt-6 h-px w-full bg-[#d7e4eb]">
          <div className="h-px w-10 bg-[#69aedd] transition-all duration-500 group-hover:w-full" />
        </div>
      </div>
    </Link>
  );
}