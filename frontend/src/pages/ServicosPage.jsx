import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../components/layout/Container";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "../components/ui/ArrowIcons";
import { ScrollReveal } from "../components/ui/ScrollReveal";

const services = [
  {
    number: "01",
    title: "Medição dimensional",
    eyebrow: "Precisão dimensional",
    description:
      "Medição e avaliação de características dimensionais e geométricas de peças e componentes.",
    href: "#medicao-dimensional",
  },
  {
    number: "02",
    title: "Inspeção óptica",
    eyebrow: "Medição sem contato",
    description:
      "Avaliação de características visíveis com recursos ópticos, ampliando as possibilidades de inspeção de peças e detalhes.",
    href: "#inspecao-optica",
  },
  {
    number: "03",
    title: "Digitalização 3D",
    eyebrow: "Captura digital",
    description:
      "Aquisição da geometria de peças e superfícies para análise, comparação e documentação digital.",
    href: "#digitalizacao-3d",
  },
  {
    number: "04",
    title: "Engenharia reversa",
    eyebrow: "Reconstrução digital",
    description:
      "Transformação de informações da peça física em dados aplicáveis ao desenvolvimento CAD.",
    href: "#engenharia-reversa",
  },
  {
    number: "05",
    title: "Inspeção interna",
    eyebrow: "Além da superfície",
    description:
      "Investigação de estruturas e características internas por meio de tecnologias de inspeção.",
    href: "#inspecao-interna",
  },
];

const dimensionalApplications = [
  "Verificação dimensional",
  "Geometrias e tolerâncias",
  "Comparação com especificações",
  "Controle de qualidade",
];

const dimensionalTechnologies = [
  "ZEISS PRISMO",
  "ZEISS DuraMax",
  "ZEISS O-INSPECT",
];

const opticalApplications = [
  "Características visíveis e de pequenas dimensões",
  "Contornos, bordas e geometrias acessíveis opticamente",
  "Componentes delicados ou sensíveis ao contato",
  "Complemento à medição por apalpação",
];

const opticalTechnologies = [
  "ZEISS O-INSPECT",
  "Medição óptica sem contato",
  "Sistema multissensor",
];

const scanningApplications = [
  "Comparação peça × CAD",
  "Documentação de geometria",
  "Superfícies complexas",
  "Geração de dados 3D",
];

const reverseApplications = [
  "Reconstrução de componentes",
  "Ausência de desenho técnico",
  "Desenvolvimento de modelos CAD",
  "Documentação digital",
];

const internalApplications = [
  "Estruturas internas",
  "Características não acessíveis",
  "Cavidades",
  "Montagens",
  "Análise interna de componentes",
];

const integratedSolutions = [
  {
    number: "01",
    from: "Digitalização 3D",
    to: "Engenharia reversa",
    description:
      "A geometria capturada pode servir como base para reconstrução e desenvolvimento digital.",
  },
  {
    number: "02",
    from: "Engenharia reversa",
    to: "Medição dimensional",
    description:
      "Dados reconstruídos podem apoiar novas análises e verificações dimensionais.",
  },
  {
    number: "03",
    from: "Inspeção interna",
    to: "Análise dimensional",
    description:
      "Informações internas e externas podem ser combinadas de acordo com a necessidade do projeto.",
  },
];

export function ServicosPage() {
  return (
    <main className="overflow-hidden bg-white">
      <div className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfc_10%,#f1f7f9_29%,#e8f2f6_54%,#e3eff4_73%,#edf5f8_88%,#f8fbfc_96%,#ffffff_100%)]">
        <ServicesHero />
        <ServicesOverview />
      </div>

      <div className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfc_8%,#edf5f8_27%,#dfeef3_51%,#d5e8ef_67%,#e6f1f5_84%,#f8fbfc_96%,#ffffff_100%)]">
        <DimensionalSection />
        <OpticalInspectionSection />
        <ScanningSection />
      </div>

      <ReverseEngineeringSection />
      <InternalInspectionSection />

      <div className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f7fafb_12%,#edf4f7_36%,#e1edf2_62%,#eef5f8_86%,#ffffff_100%)]">
        <IntegratedSection />
      </div>

      <GuidanceSection />
    </main>
  );
}

function ServicesHero() {
  return (
    <section className="relative overflow-hidden pb-5 pt-7 sm:pb-6 sm:pt-9 lg:pb-7 lg:pt-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10%] top-[12%] h-[360px] w-[360px] rounded-full bg-[#65b8ee]/[0.08] blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[8%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#12364e]/[0.06] blur-[125px]"
      />

      <Container>
        <div className="relative z-10 grid min-h-[455px] gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-12">
          <ScrollReveal
            direction="right"
            distance={34}
            className="relative z-10"
          >
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                Centro de Excelência
              </p>

              <div className="h-px w-10 bg-[#65b8ee]" />
            </div>

            <h1 className="mt-5 max-w-[680px] text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.052em] text-[#071f2d] sm:text-[3.55rem] lg:text-[4.15rem]">
              Serviços para
              <br />
              transformar desafios
              <br />
              <span className="text-[#356f9f]">
                em informação técnica.
              </span>
            </h1>

            <p className="mt-6 max-w-[585px] text-[14px] leading-7 text-[#607583] sm:text-[15px]">
              Soluções em metrologia, digitalização e inspeção para
              apoiar diferentes etapas de desenvolvimento, análise e
              controle de peças e componentes.
            </p>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={38}
            className="relative min-h-[390px] sm:min-h-[430px] lg:min-h-[470px]"
          >
            <div className="group absolute inset-[4%] overflow-hidden rounded-[30px] border border-white/60 bg-[#071f2d] shadow-[0_26px_65px_rgba(7,31,45,0.14)]">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
              >
                <source
                  src="/videos/services/coletor.mp4"
                  type="video/mp4"
                />
              </video>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,31,45,0.04)_0%,rgba(7,31,45,0.10)_46%,rgba(7,31,45,0.86)_100%)]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[7%] right-[7%] top-0 h-px bg-gradient-to-r from-transparent via-white/65 to-transparent"
              />

              <div className="absolute left-6 top-6 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-white backdrop-blur-[18px]">
                Metrologia aplicada
              </div>

              <div className="absolute right-6 top-6 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/60">
                SENAI · ZEISS
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                <div className="mb-3 h-px w-11 bg-[#65b8ee]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9dd1ef]">
                  Do físico ao digital
                </p>

                <h3 className="mt-2 max-w-[440px] text-[20px] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[23px]">
                  Tecnologia aplicada a desafios reais.
                </h3>

                <p className="mt-3 text-[11px] text-white/55">
                  Centro de Excelência
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <HeroVideoMetric
                    number="01"
                    label="Medir"
                  />

                  <HeroVideoMetric
                    number="02"
                    label="Digitalizar"
                  />

                  <HeroVideoMetric
                    number="03"
                    label="Analisar"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function HeroVideoMetric({
  number,
  label,
}) {
  return (
    <div className="rounded-[13px] border border-white/15 bg-white/[0.08] px-3 py-3 backdrop-blur-[14px]">
      <span className="text-[8px] font-semibold tracking-[0.13em] text-white/45">
        {number}
      </span>

      <p className="mt-1 text-[10px] font-semibold text-white/82">
        {label}
      </p>
    </div>
  );
}
function ServicesOverview() {
  return (
    <section
      id="servicos"
      className="scroll-mt-24 pb-8 pt-5 sm:pb-10 sm:pt-6 lg:pb-11 lg:pt-7"
    >
      <Container>
        <ScrollReveal
          direction="up"
          distance={30}
        >
          <div className="flex items-center gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
              Serviços
            </p>

            <div className="h-px w-10 bg-[#65b8ee]" />
          </div>

          <h2 className="mt-4 max-w-[650px] text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[#071f2d] sm:text-[2.8rem]">
            Cinco caminhos.
            <br />

            <span className="text-[#356f9f]">
              Diferentes possibilidades.
            </span>
          </h2>
        </ScrollReveal>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service, index) => (
            <ServiceOverviewCard
              key={service.number}
              service={service}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ServiceOverviewCard({
  service,
  index,
}) {
  return (
    <motion.a
      href={service.href}
      initial={{
        opacity: 0,
        y: 18,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
      }}
      className="group relative overflow-hidden rounded-[20px] border border-white/72 bg-white/48 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_30px_rgba(7,31,45,0.035)] backdrop-blur-[18px] transition-colors duration-300 hover:bg-white/66"
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-24 w-24 rounded-full border border-[#356f9f]/[0.06] transition-transform duration-500 group-hover:scale-110"
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="text-[10px] font-semibold tracking-[0.14em] text-[#5687ad]">
          {service.number}
        </span>

        <ArrowUpRightIcon className="h-4 w-4 text-[#5687ad] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <div className="relative z-10 mt-8">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5687ad]">
          {service.eyebrow}
        </p>

        <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.025em] text-[#071f2d]">
          {service.title}
        </h3>

        <p className="mt-3 text-[12px] leading-6 text-[#607583]">
          {service.description}
        </p>
      </div>
    </motion.a>
  );
}

function DimensionalSection() {
  return (
    <section
      id="medicao-dimensional"
      className="scroll-mt-24 pb-8 pt-8 sm:pb-10 sm:pt-9 lg:pb-10 lg:pt-10"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <ScrollReveal
            direction="right"
            distance={32}
          >
            <ServiceHeading
              number="01"
              eyebrow="Precisão dimensional"
              title="Medição dimensional"
              description="Medição e avaliação de características dimensionais e geométricas de peças e componentes para verificar sua conformidade com desenhos, especificações e requisitos técnicos."
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoCard
                title="Aplicações"
                items={dimensionalApplications}
              />

              <InfoCard
                title="Tecnologias"
                items={dimensionalTechnologies}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={36}
          >
            <ServiceMedia
              src="/videos/services/inspection-dimensional.mp4"
              eyebrow="Medição por coordenadas"
              title="Precisão aplicada à geometria da peça."
              number="01"
            />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function OpticalInspectionSection() {
  return (
    <section
      id="inspecao-optica"
      className="scroll-mt-24 pb-8 pt-5 sm:pb-9 sm:pt-6 lg:pb-10 lg:pt-6"
    >
      <Container>
        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <ScrollReveal
            direction="right"
            distance={36}
            className="order-2 lg:order-1"
          >
            <ServiceMedia
              src="/videos/services/oinspect.mp4"
              eyebrow="Medição óptica multissensor"
              title="Detalhes visíveis avaliados sem depender apenas do contato."
              number="02"
            />
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={32}
            className="order-1 lg:order-2"
          >
            <ServiceHeading
              number="02"
              eyebrow="Medição sem contato"
              title="Inspeção óptica"
              description="Avaliação de características dimensionais e geométricas por recursos ópticos do ZEISS O-INSPECT, ampliando as possibilidades de inspeção em detalhes visíveis, componentes delicados e regiões adequadas à medição sem contato."
              compact
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoCard
                title="Aplicações"
                items={opticalApplications}
              />

              <InfoCard
                title="Tecnologia"
                items={opticalTechnologies}
              />
            </div>

            <ServiceAction />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function ScanningSection() {
  return (
    <section
      id="digitalizacao-3d"
      className="scroll-mt-24 pb-8 pt-5 sm:pb-9 sm:pt-6 lg:pb-10 lg:pt-6"
    >
      <Container>
        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <ScrollReveal
            direction="right"
            distance={36}
            className="order-2 lg:order-1 lg:-mt-2"
          >
            <ServiceMedia
              src="/videos/services/digitalizacao-3d.mp4"
              eyebrow="Captura da geometria"
              title="Da superfície física ao ambiente digital."
              number="03"
            />
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={32}
            className="order-1 lg:order-2 lg:-mt-2"
          >
            <ServiceHeading
              number="03"
              eyebrow="Captura digital"
              title="Digitalização 3D"
              description="Captura da geometria de peças e componentes para criação de representações digitais que podem apoiar análises, comparações e outras etapas do projeto."
              compact
            />

            <div className="mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5687ad]">
                Fluxo
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <ProcessStep
                  number="01"
                  label="Peça física"
                />

                <ProcessStep
                  number="02"
                  label="Captura 3D"
                />

                <ProcessStep
                  number="03"
                  label="Modelo digital"
                />
              </div>
            </div>

            <div className="mt-4">
              <CompactApplicationsCard
                title="Aplicações"
                items={scanningApplications}
              />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
function ServiceHeading({
  number,
  eyebrow,
  title,
  description,
  compact = false,
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-semibold tracking-[0.15em] text-[#356f9f]">
          {number}
        </span>

        <div className="h-px w-10 bg-[#65b8ee]" />
      </div>

      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5687ad]">
        {eyebrow}
      </p>

      <h2
        className={`
          mt-2
          font-semibold
          leading-[1.02]
          tracking-[-0.045em]
          text-[#071f2d]
          ${
            compact
              ? "text-[2.3rem] sm:text-[2.9rem]"
              : "text-[2.45rem] sm:text-[3.15rem]"
          }
        `}
      >
        {title}
      </h2>

      <p className="mt-4 max-w-[580px] text-[14px] leading-7 text-[#607583] sm:text-[15px]">
        {description}
      </p>
    </div>
  );
}

function InfoCard({
  title,
  items,
}) {
  return (
    <div className="rounded-[18px] border border-white/72 bg-white/48 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_24px_rgba(7,31,45,0.03)] backdrop-blur-[18px]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#5687ad]">
        {title}
      </p>

      <div className="mt-3 space-y-2.5">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2.5"
          >
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#65b8ee]" />

            <p className="text-[11px] leading-5 text-[#526b79]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactApplicationsCard({
  title,
  items,
}) {
  return (
    <div className="rounded-[18px] border border-white/72 bg-white/48 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_24px_rgba(7,31,45,0.03)] backdrop-blur-[18px]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#5687ad]">
        {title}
      </p>

      <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2.5"
          >
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#65b8ee]" />

            <p className="text-[11px] leading-5 text-[#526b79]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessStep({
  number,
  label,
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.25,
      }}
      className="rounded-[15px] border border-white/72 bg-white/45 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[16px]"
    >
      <span className="text-[8px] font-semibold tracking-[0.13em] text-[#5687ad]">
        {number}
      </span>

      <p className="mt-1.5 text-[10px] font-semibold text-[#12364e]">
        {label}
      </p>
    </motion.div>
  );
}

function ServiceMedia({
  src,
  eyebrow,
  title,
  number,
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-[#071f2d] shadow-[0_22px_58px_rgba(7,31,45,0.12)]">
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
        >
          <source
            src={src}
            type="video/mp4"
          />
        </video>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,31,45,0.01)_0%,rgba(7,31,45,0.06)_45%,rgba(7,31,45,0.82)_100%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[7%] right-[7%] top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-7">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="mb-3 h-px w-11 bg-[#65b8ee]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9dd1ef]">
                {eyebrow}
              </p>

              <p className="mt-2 max-w-[420px] text-[18px] font-semibold leading-snug tracking-[-0.02em] text-white">
                {title}
              </p>
            </div>

            <span className="text-[11px] font-semibold tracking-[0.14em] text-white/45">
              {number}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceAction({
  dark = false,
}) {
  return (
    <Link
      to="/orcamento"
      className={`group mt-8 inline-flex items-center gap-3 text-sm font-medium transition-colors ${
        dark
          ? "text-[#b9ddf2] hover:text-white"
          : "text-[#356f9f] hover:text-[#0b2340]"
      }`}
    >
      Solicitar orçamento

      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

function ReverseEngineeringSection() {
  return (
    <section
      id="engenharia-reversa"
      className="relative scroll-mt-24 overflow-hidden pb-8 pt-5 sm:pb-9 sm:pt-6 lg:pb-10 lg:pt-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f7fafb_9%,#eef5f8_19%,#dceaf0_33%,#c8dce5_45%,#a7c0cc_57%,#7f9faf_69%,#5d8193_78%,#3f677b_87%,#264e63_94%,#173e54_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-[22%] h-[300px] w-[300px] rounded-full bg-white/[0.16] blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-[10%] h-[320px] w-[320px] rounded-full bg-[#65b8ee]/[0.10] blur-[120px]"
      />

      <Container>
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <ScrollReveal
            direction="right"
            distance={34}
          >
            <div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-semibold tracking-[0.15em] text-[#356f9f]">
                  04
                </span>

                <div className="h-px w-10 bg-[#65b8ee]" />
              </div>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5687ad]">
                Reconstrução digital
              </p>

              <h2 className="mt-2 text-[2.45rem] font-semibold leading-[1.02] tracking-[-0.045em] text-[#071f2d] sm:text-[3.1rem]">
                Engenharia reversa
              </h2>

              <p className="mt-4 max-w-[580px] text-[14px] leading-7 text-[#455f6f] sm:text-[15px]">
                Transformação das informações obtidas de uma peça
                física em dados digitais que podem apoiar reconstrução,
                documentação e desenvolvimento de modelos CAD.
              </p>
            </div>

            <div className="mt-6">
              <ReverseInfoCard
                title="Aplicações"
                items={reverseApplications}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
              <ReverseProcessStep
                number="01"
                label="Peça"
              />

              <ReverseProcessStep
                number="02"
                label="Captura"
              />

              <ReverseProcessStep
                number="03"
                label="Malha"
              />

              <ReverseProcessStep
                number="04"
                label="Superfícies"
              />

              <ReverseProcessStep
                number="05"
                label="CAD"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={38}
          >
            <div className="group relative overflow-hidden rounded-[30px] border border-white/35 bg-[#071f2d] shadow-[0_24px_62px_rgba(7,31,45,0.14)]">
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                >
                  <source
                    src="/videos/services/pistao.mp4"
                    type="video/mp4"
                  />
                </video>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,31,45,0.01)_0%,rgba(7,31,45,0.06)_45%,rgba(7,31,45,0.82)_100%)]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[7%] right-[7%] top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <div className="mb-3 h-px w-11 bg-[#65b8ee]" />

                      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9dd1ef]">
                        Processo digital
                      </p>

                      <p className="mt-2 max-w-[420px] text-[18px] font-semibold leading-snug tracking-[-0.02em] text-white">
                        Da peça física à reconstrução digital.
                      </p>
                    </div>

                    <span className="text-[11px] font-semibold tracking-[0.14em] text-white/45">
                      04
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function ReverseInfoCard({
  title,
  items,
}) {
  return (
    <div className="rounded-[18px] border border-white/42 bg-white/26 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_28px_rgba(7,31,45,0.035)] backdrop-blur-[20px]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#356f9f]">
        {title}
      </p>

      <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2.5"
          >
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#65b8ee]" />

            <p className="text-[11px] leading-5 text-[#314f60]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReverseProcessStep({
  number,
  label,
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.25,
      }}
      className="rounded-[15px] border border-white/35 bg-white/20 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] backdrop-blur-[18px]"
    >
      <span className="text-[8px] font-semibold tracking-[0.13em] text-[#356f9f]">
        {number}
      </span>

      <p className="mt-1.5 text-[10px] font-semibold text-[#12364e]">
        {label}
      </p>
    </motion.div>
  );
}
function InternalInspectionSection() {
  return (
    <section
      id="inspecao-interna"
      className="relative scroll-mt-24 overflow-hidden bg-[linear-gradient(180deg,#173e54_0%,#0f3348_16%,#082a3e_34%,#071f2d_54%,#0a293b_72%,#31596d_88%,#7f9eac_95%,#dce8ed_99%,#ffffff_100%)] pb-20 pt-10 sm:pb-22 sm:pt-11 lg:pb-24 lg:pt-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 top-[10%] h-[420px] w-[420px] rounded-full bg-[#65b8ee]/[0.08] blur-[135px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-[34%] h-[440px] w-[440px] rounded-full bg-white/[0.04] blur-[140px]"
      />

      <Container>
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <ScrollReveal
            direction="right"
            distance={32}
          >
            <div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-semibold tracking-[0.15em] text-[#9dd1ef]">
                  05
                </span>

                <div className="h-px w-10 bg-[#65b8ee]" />
              </div>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9dd1ef]">
                Além da superfície
              </p>

              <h2 className="mt-2 text-[2.45rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-[3.1rem]">
                Inspeção interna
              </h2>

              <p className="mt-4 max-w-[580px] text-[14px] leading-7 text-white/62 sm:text-[15px]">
                Investigação de estruturas e características internas que não podem ser avaliadas somente pela superfície da peça.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DarkInfoCard
                title="Aplicações"
                items={internalApplications}
              />

              <DarkInfoCard
                title="Tecnologia"
                items={[
                  "ZEISS BOSELLO MAX",
                  "Inspeção por raios X",
                  "Análise interna não destrutiva",
                ]}
              />
            </div>

            <ServiceAction dark />
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={36}
          >
            <ServiceMedia
              src="/videos/services/inspecao.mp4"
              eyebrow="Inspeção por raios X"
              title="O interior da peça também pode revelar informações importantes."
              number="05"
            />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function DarkInfoCard({
  title,
  items,
}) {
  return (
    <div className="rounded-[18px] border border-white/16 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_28px_rgba(0,0,0,0.08)] backdrop-blur-[20px]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#9dd1ef]">
        {title}
      </p>

      <div className="mt-3 space-y-2.5">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2.5"
          >
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#65b8ee]" />

            <p className="text-[11px] leading-5 text-white/64">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegratedSection() {
  return (
    <section className="relative pb-10 pt-7 sm:pb-11 sm:pt-8 lg:pb-12 lg:pt-9">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-14">
          <ScrollReveal
            direction="right"
            distance={32}
          >
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                Solução integrada
              </p>

              <div className="h-px w-10 bg-[#65b8ee]" />
            </div>

            <h2 className="mt-4 max-w-[620px] text-[2.35rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[#071f2d] sm:text-[3rem]">
              Um desafio pode exigir
              <br />

              <span className="text-[#356f9f]">
                mais de uma tecnologia.
              </span>
            </h2>

            <p className="mt-5 max-w-[555px] text-[14px] leading-7 text-[#607583] sm:text-[15px]">
              As tecnologias podem ser combinadas de acordo com o
              objetivo, a geometria da peça e as informações necessárias
              para cada projeto.
            </p>
          </ScrollReveal>

          <div className="space-y-3">
            {integratedSolutions.map((solution, index) => (
              <IntegratedRow
                key={solution.number}
                solution={solution}
                index={index}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function IntegratedRow({
  solution,
  index,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 22,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        x: 4,
      }}
      className="group relative overflow-hidden rounded-[19px] border border-white/72 bg-white/46 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_9px_26px_rgba(7,31,45,0.03)] backdrop-blur-[18px] sm:p-5"
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-24 w-24 rounded-full border border-[#356f9f]/[0.06] transition-transform duration-500 group-hover:scale-110"
      />

      <div className="relative z-10 flex gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/50 text-[9px] font-semibold tracking-[0.1em] text-[#356f9f] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          {solution.number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[12px] font-semibold text-[#12364e]">
              {solution.from}
            </span>

            <ArrowRightIcon className="h-3.5 w-3.5 text-[#65b8ee]" />

            <span className="text-[12px] font-semibold text-[#356f9f]">
              {solution.to}
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-[#607583]">
            {solution.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
function GuidanceSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfc_9%,#edf4f7_26%,#dcebf1_48%,#c7dde6_66%,#a7c4d0_79%,#789aa9_89%,#496f82_95%,#264e63_98%,#173e54_100%)] pb-[78px] pt-9 sm:pb-[88px] sm:pt-11 lg:pb-[96px] lg:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-[12%] h-[320px] w-[320px] rounded-full bg-white/[0.16] blur-[115px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-[8%] h-[330px] w-[330px] rounded-full bg-[#65b8ee]/[0.10] blur-[120px]"
      />

      <Container>
        <ScrollReveal
          direction="up"
          distance={34}
          className="relative z-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-14"
        >
          <div>
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                Próximo passo
              </p>

              <div className="h-px w-10 bg-[#65b8ee]" />
            </div>

            <h2 className="mt-4 max-w-[660px] text-[2.4rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[#071f2d] sm:text-[3.05rem]">
              Não sabe qual serviço
              <br />

              <span className="text-[#356f9f]">
                é o mais adequado?
              </span>
            </h2>

            <p className="mt-5 max-w-[560px] text-[14px] leading-7 text-[#566f7e] sm:text-[15px]">
              Você pode enviar diretamente uma solicitação ou utilizar
              o configurador para organizar as principais informações
              da sua necessidade e direcionar melhor o atendimento.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/62 bg-white/42 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_18px_46px_rgba(7,31,45,0.07)] backdrop-blur-[24px] sm:p-7 lg:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-36 w-36 rounded-full border border-[#356f9f]/10"
            />

            <div
              aria-hidden="true"
              className="absolute -right-5 -top-5 h-24 w-24 rounded-full border border-[#356f9f]/[0.07]"
            />

            <div
              aria-hidden="true"
              className="absolute left-[8%] right-[8%] top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
            />

            <div className="relative z-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5687ad]">
                Escolha o caminho
              </p>

              <h3 className="mt-3 text-[24px] font-semibold leading-tight tracking-[-0.035em] text-[#071f2d] sm:text-[26px]">
                Como deseja continuar?
              </h3>

              <p className="mt-3 max-w-[480px] text-[12px] leading-6 text-[#607583]">
                Escolha a opção que melhor representa o momento da sua
                necessidade. As informações serão direcionadas para
                análise do Centro.
              </p>

              <div className="mt-7 flex flex-col gap-3.5">
                <GuidanceActionButton
                  href="/orcamento"
                  label="Solicitar orçamento"
                />

                <GuidanceActionButton
                  href="/configurador"
                  label="Configurar solução"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function GuidanceActionButton({
  href,
  label,
}) {
  return (
    <Link
      to={href}
      className="group flex h-16 w-full items-center justify-between rounded-[17px] border border-white/72 bg-white/48 px-5 text-[12px] font-semibold text-[#12364e] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_24px_rgba(7,31,45,0.04)] backdrop-blur-[18px] transition-all duration-300 hover:-translate-y-[2px] hover:bg-white/68 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_12px_30px_rgba(7,31,45,0.07)]"
    >
      <span>{label}</span>

      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12364e]/[0.06] text-[#356f9f] transition-all duration-300 group-hover:bg-[#12364e] group-hover:text-white">
        <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}