import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../components/layout/Container";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "../components/ui/ArrowIcons";
import { ScrollReveal } from "../components/ui/ScrollReveal";

const equipment = [
  {
    number: "01",
    id: "prismo",
    name: "ZEISS PRISMO",
    shortName: "PRISMO",
    category: "Medição por coordenadas",
    description:
      "Sistema de medição por coordenadas voltado a aplicações que exigem elevada precisão na avaliação dimensional e geométrica de peças e componentes.",
    application:
      "Medições dimensionais de alta precisão, geometrias complexas e avaliação de requisitos rigorosos.",
    technology: "Máquina de medição por coordenadas",
    highlights: [
      "Alta precisão",
      "Geometrias complexas",
      "Medição dimensional",
    ],
    services: [
      {
        label: "Medição dimensional",
        href: "/servicos#medicao-dimensional",
      },
    ],
    image: "/images/equipment/prismo-foto-2.jpeg",
    imageFit: "cover",
  },
  {
    number: "02",
    id: "o-inspect",
    name: "ZEISS O-INSPECT",
    shortName: "O-INSPECT",
    category: "Medição multissensor",
    description:
      "Tecnologia multissensor que combina diferentes métodos de medição para avaliação flexível de características dimensionais e geométricas.",
    application:
      "Componentes que exigem combinação de medição óptica e por contato em uma mesma análise.",
    technology: "Medição óptica e por contato",
    highlights: [
      "Multissensor",
      "Medição óptica",
      "Medição por contato",
    ],
    services: [
      {
        label: "Medição dimensional",
        href: "/servicos#medicao-dimensional",
      },
      {
        label: "Inspeção óptica",
        href: "/servicos#inspecao-optica",
      },
    ],
    image: "/images/equipment/oinspect.jpeg",
    imageFit: "cover",
  },
  {
    number: "03",
    id: "duramax",
    name: "ZEISS DuraMax",
    shortName: "DuraMax",
    category: "Medição por coordenadas",
    description:
      "Sistema de medição por coordenadas desenvolvido para inspeções dimensionais com operação flexível e aplicação em diferentes contextos industriais.",
    application:
      "Controle dimensional de peças e componentes, análises geométricas e inspeções de processo.",
    technology: "Máquina de medição por coordenadas",
    highlights: [
      "Controle dimensional",
      "Flexibilidade",
      "Inspeção de processo",
    ],
    services: [
      {
        label: "Medição dimensional",
        href: "/servicos#medicao-dimensional",
      },
    ],
    image: "/images/equipment/duramax.jpeg",
    imageFit: "cover",
  },
  {
    number: "04",
    id: "t-scan",
    name: "ZEISS T-SCAN",
    shortName: "T-SCAN",
    category: "Digitalização 3D",
    description:
      "Sistema portátil de escaneamento 3D utilizado para captura digital de geometrias e superfícies de peças e componentes.",
    application:
      "Digitalização de componentes, geometrias complexas, documentação e geração de dados tridimensionais.",
    technology: "Escaneamento 3D portátil",
    highlights: [
      "Mobilidade",
      "Captura 3D",
      "Geometrias complexas",
    ],
    services: [
      {
        label: "Digitalização 3D",
        href: "/servicos#digitalizacao-3d",
      },
      {
        label: "Engenharia reversa",
        href: "/servicos#engenharia-reversa",
      },
    ],
    image: "/images/equipment/t-scan.jpeg",
    imageFit: "cover",
  },
  {
    number: "05",
    id: "atos-q",
    name: "ZEISS ATOS Q",
    shortName: "ATOS Q",
    category: "Digitalização 3D",
    description:
      "Sistema óptico de digitalização tridimensional para aquisição detalhada de superfícies e geometrias de peças.",
    application:
      "Captura tridimensional, inspeção de superfícies, comparação com modelos CAD e suporte ao desenvolvimento.",
    technology: "Digitalização óptica 3D",
    highlights: [
      "Detalhamento",
      "Digitalização óptica",
      "Comparação com CAD",
    ],
    services: [
      {
        label: "Digitalização 3D",
        href: "/servicos#digitalizacao-3d",
      },
      {
        label: "Engenharia reversa",
        href: "/servicos#engenharia-reversa",
      },
    ],
    image: "/images/equipment/atos-q-2.jpeg",
    imageFit: "cover",
  },
  {
    number: "06",
    id: "bosello-max",
    name: "ZEISS BOSELLO MAX",
    shortName: "BOSELLO MAX",
    category: "Inspeção por raios X",
    description:
      "Sistema voltado à inspeção não destrutiva para análise de estruturas, características e regiões internas não acessíveis externamente.",
    application:
      "Investigação de estruturas internas, cavidades, montagens, descontinuidades e características não visíveis externamente.",
    technology: "Inspeção industrial por raios X",
    highlights: [
      "Inspeção interna",
      "Ensaio não destrutivo",
      "Raios X",
    ],
    services: [
      {
        label: "Inspeção interna",
        href: "/servicos#inspecao-interna",
      },
    ],
    image: "/images/equipment/bosello-max.jpeg",
    imageFit: "cover",
  },
];

const needProfiles = [
  {
    number: "01",
    need: "Alta precisão",
    equipment: "PRISMO · O-INSPECT",
  },
  {
    number: "02",
    need: "Peças menores",
    equipment: "DuraMax · O-INSPECT",
  },
  {
    number: "03",
    need: "Digitalização detalhada",
    equipment: "ATOS Q",
  },
  {
    number: "04",
    need: "Mobilidade",
    equipment: "T-SCAN",
  },
  {
    number: "05",
    need: "Inspeção interna",
    equipment: "BOSELLO MAX",
  },
];

function getEquipment(id) {
  return equipment.find((item) => item.id === id);
}

export function EquipamentosPage() {
  const prismo = getEquipment("prismo");
  const oInspect = getEquipment("o-inspect");
  const duramax = getEquipment("duramax");
  const tScan = getEquipment("t-scan");
  const atosQ = getEquipment("atos-q");
  const bosello = getEquipment("bosello-max");

  return (
    <main className="overflow-hidden bg-white">
      <div className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfc_20%,#edf5f8_52%,#e3f0f4_76%,#ffffff_100%)]">
        <EquipmentHero />
        <EquipmentOverview />
      </div>

      <div className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f6fafb_16%,#eaf3f6_44%,#deedf2_70%,#ffffff_100%)]">
        <PrismoSection equipment={prismo} />

        <DimensionalSection
          duramax={duramax}
          oInspect={oInspect}
        />
      </div>

      <ScanningShowcase
        atosQ={atosQ}
        tScan={tScan}
      />

      <BoselloSection equipment={bosello} />

      <div className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f4f8fa_35%,#e8f2f5_72%,#ffffff_100%)]">
        <NeedGuideSection />
        <EquipmentGuidanceSection />
      </div>
    </main>
  );
}

function EquipmentHero() {
  return (
    <section className="relative overflow-hidden pb-8 pt-8 sm:pb-10 sm:pt-10 lg:pb-12 lg:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[12%] top-[10%] h-[420px] w-[420px] rounded-full bg-[#65b8ee]/[0.08] blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] top-[5%] h-[460px] w-[460px] rounded-full bg-[#12364e]/[0.05] blur-[130px]"
      />

      <Container>
        <div className="relative z-10 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
          <ScrollReveal
            direction="right"
            distance={34}
          >
            <div className="max-w-[610px]">
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                  Portfólio tecnológico
                </p>

                <div className="h-px w-10 bg-[#65b8ee]" />
              </div>

              <h1 className="mt-5 text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.052em] text-[#071f2d] sm:text-[3.7rem] lg:text-[4.2rem]">
                Tecnologia para
                <br />
                diferentes desafios
                <br />

                <span className="text-[#356f9f]">
                  de medição.
                </span>
              </h1>

              <p className="mt-6 max-w-[550px] text-[14px] leading-7 text-[#607583] sm:text-[15px]">
                O Centro reúne tecnologias para medição dimensional,
                digitalização tridimensional e inspeção interna,
                permitindo selecionar a solução adequada às
                características de cada projeto.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <HeroTag label="Medição dimensional" />
                <HeroTag label="Digitalização 3D" />
                <HeroTag label="Inspeção interna" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={38}
          >
            <div className="group relative overflow-hidden rounded-[30px] border border-white/65 bg-[#071f2d] shadow-[0_28px_70px_rgba(7,31,45,0.14)]">
              <div className="relative aspect-[16/11] overflow-hidden">
                <img
                  src="/images/equipment/laboratorio.jpeg"
                  alt="Centro de Excelência em Metrologia"
                  className="h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,31,45,0.02)_0%,rgba(7,31,45,0.06)_48%,rgba(7,31,45,0.88)_100%)]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[7%] right-[7%] top-0 h-px bg-gradient-to-r from-transparent via-white/65 to-transparent"
                />

                <div className="absolute left-6 top-6 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-white backdrop-blur-[18px]">
                  Tecnologia de medição
                </div>

                <div className="absolute right-6 top-6 text-[9px] font-semibold uppercase tracking-[0.13em] text-white/60">
                  SENAI · ZEISS
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <div className="mb-3 h-px w-11 bg-[#65b8ee]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#9dd1ef]">
                    Portfólio tecnológico
                  </p>

                  <h2 className="mt-2 max-w-[450px] text-[20px] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[23px]">
                    Diferentes formas de enxergar uma peça.
                  </h2>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <EquipmentHeroMetric
                      number="01"
                      label="Medir"
                    />

                    <EquipmentHeroMetric
                      number="02"
                      label="Digitalizar"
                    />

                    <EquipmentHeroMetric
                      number="03"
                      label="Inspecionar"
                    />
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

function HeroTag({ label }) {
  return (
    <span className="rounded-full border border-white/75 bg-white/48 px-3.5 py-2 text-[9px] font-semibold text-[#526b79] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[16px]">
      {label}
    </span>
  );
}

function EquipmentHeroMetric({
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
function EquipmentOverview() {
  return (
    <section
      id="equipamentos"
      className="scroll-mt-24 pb-10 pt-4 sm:pb-12 sm:pt-5 lg:pb-14 lg:pt-6"
    >
      <Container>
        <ScrollReveal
          direction="up"
          distance={30}
        >
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-12">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                  Equipamentos
                </p>

                <div className="h-px w-10 bg-[#65b8ee]" />
              </div>

              <h2 className="mt-4 max-w-[650px] text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[#071f2d] sm:text-[2.8rem]">
                Um portfólio.
                <br />

                <span className="text-[#356f9f]">
                  Diferentes possibilidades.
                </span>
              </h2>
            </div>

            <p className="max-w-[570px] text-[13px] leading-6 text-[#607583] sm:text-[14px]">
              Explore as tecnologias disponíveis no Centro e conheça
              diferentes formas de medir, digitalizar e investigar
              peças e componentes.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item, index) => (
            <EquipmentOverviewCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function EquipmentOverviewCard({
  item,
  index,
}) {
  return (
    <motion.a
      href={`#${item.id}`}
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.48,
        delay: index * 0.055,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
      }}
      className="group relative overflow-hidden rounded-[20px] border border-white/72 bg-white/46 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_30px_rgba(7,31,45,0.035)] backdrop-blur-[18px] transition-colors duration-300 hover:bg-white/68"
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-24 w-24 rounded-full border border-[#356f9f]/[0.06] transition-transform duration-500 group-hover:scale-110"
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="text-[10px] font-semibold tracking-[0.14em] text-[#5687ad]">
          {item.number}
        </span>

        <ArrowUpRightIcon className="h-4 w-4 text-[#5687ad] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <div className="relative z-10 mt-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5687ad]">
          {item.category}
        </p>

        <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.025em] text-[#071f2d]">
          {item.name}
        </h3>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.highlights.slice(0, 2).map((highlight) => (
            <span
              key={highlight}
              className="rounded-full border border-[#d9e7ed]/80 bg-white/45 px-2.5 py-1 text-[9px] font-medium text-[#607583]"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

function PrismoSection({
  equipment,
}) {
  return (
    <section
      id={equipment.id}
      className="scroll-mt-24 pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-14 lg:pt-12"
    >
      <Container>
        <div className="grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
          <ScrollReveal
            direction="right"
            distance={38}
          >
            <EquipmentMedia
              equipment={equipment}
              eyebrow="Alta precisão dimensional"
              statement="Precisão aplicada a requisitos rigorosos."
              imagePosition="center"
            />
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={34}
          >
            <EquipmentHeading
              number={equipment.number}
              category={equipment.category}
              name={equipment.name}
              description={equipment.description}
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <EquipmentInfoCard
                title="Aplicação principal"
                text={equipment.application}
              />

              <EquipmentInfoCard
                title="Tecnologia"
                text={equipment.technology}
              />
            </div>

            <EquipmentHighlights
              items={equipment.highlights}
            />

            <EquipmentServices
              services={equipment.services}
            />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function EquipmentHeading({
  number,
  category,
  name,
  description,
  light = false,
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span
          className={`text-[11px] font-semibold tracking-[0.15em] ${
            light ? "text-[#9dd1ef]" : "text-[#356f9f]"
          }`}
        >
          {number}
        </span>

        <div className="h-px w-10 bg-[#65b8ee]" />
      </div>

      <p
        className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.13em] ${
          light ? "text-[#9dd1ef]" : "text-[#5687ad]"
        }`}
      >
        {category}
      </p>

      <h2
        className={`mt-2 text-[2.45rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[3.15rem] ${
          light ? "text-white" : "text-[#071f2d]"
        }`}
      >
        {name}
      </h2>

      <p
        className={`mt-4 max-w-[580px] text-[14px] leading-7 sm:text-[15px] ${
          light ? "text-white/65" : "text-[#607583]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function EquipmentMedia({
  equipment,
  eyebrow,
  statement,
  dark = false,
  imagePosition = "center",
}) {
  if (!equipment.image) {
    return (
      <TScanVisual
        equipment={equipment}
        eyebrow={eyebrow}
        statement={statement}
      />
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-[#071f2d] shadow-[0_22px_58px_rgba(7,31,45,0.12)]">
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
        <img
          src={equipment.image}
          alt={equipment.name}
          style={{
            objectPosition: imagePosition,
          }}
          className={`h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025] ${
            equipment.imageFit === "contain"
              ? "object-contain"
              : "object-cover"
          }`}
        />

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${
            dark
              ? "bg-[linear-gradient(180deg,rgba(7,31,45,0.10)_0%,rgba(7,31,45,0.18)_44%,rgba(7,31,45,0.94)_100%)]"
              : "bg-[linear-gradient(180deg,rgba(7,31,45,0.01)_0%,rgba(7,31,45,0.05)_44%,rgba(7,31,45,0.84)_100%)]"
          }`}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[7%] right-[7%] top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />

        <div className="absolute left-6 top-6 rounded-full border border-white/22 bg-white/10 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-white backdrop-blur-[16px]">
          {equipment.category}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="mb-3 h-px w-11 bg-[#65b8ee]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#9dd1ef]">
                {eyebrow}
              </p>

              <h3 className="mt-2 max-w-[430px] text-[18px] font-semibold leading-snug tracking-[-0.025em] text-white sm:text-[21px]">
                {statement}
              </h3>
            </div>

            <span className="text-[11px] font-semibold tracking-[0.14em] text-white/40">
              {equipment.number}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EquipmentInfoCard({
  title,
  text,
  light = false,
}) {
  return (
    <div
      className={`rounded-[18px] border p-4 backdrop-blur-[18px] ${
        light
          ? "border-white/15 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
          : "border-white/72 bg-white/48 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_24px_rgba(7,31,45,0.03)]"
      }`}
    >
      <p
        className={`text-[9px] font-semibold uppercase tracking-[0.13em] ${
          light ? "text-[#9dd1ef]" : "text-[#5687ad]"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-3 text-[11px] leading-5 ${
          light ? "text-white/65" : "text-[#526b79]"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function EquipmentHighlights({
  items,
  light = false,
}) {
  return (
    <div className="mt-5">
      <p
        className={`text-[9px] font-semibold uppercase tracking-[0.13em] ${
          light ? "text-[#9dd1ef]" : "text-[#5687ad]"
        }`}
      >
        Destaques
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full border px-3 py-1.5 text-[10px] font-medium backdrop-blur-[14px] ${
              light
                ? "border-white/15 bg-white/[0.07] text-white/70"
                : "border-white/72 bg-white/48 text-[#526b79]"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function EquipmentServices({
  services,
  light = false,
}) {
  return (
    <div className="mt-6">
      <p
        className={`text-[9px] font-semibold uppercase tracking-[0.13em] ${
          light ? "text-[#9dd1ef]" : "text-[#5687ad]"
        }`}
      >
        Serviços relacionados
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {services.map((service) => (
          <Link
            key={service.label}
            to={service.href}
            className={`group inline-flex min-h-[38px] items-center gap-2.5 rounded-full border px-4 py-2 text-[10px] font-semibold transition-all duration-300 ${
              light
                ? "border-white/18 bg-white/[0.08] text-white/75 hover:bg-white/[0.14] hover:text-white"
                : "border-white/72 bg-white/50 text-[#356f9f] hover:-translate-y-[1px] hover:bg-white/75 hover:text-[#071f2d]"
            }`}
          >
            {service.label}

            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
function DimensionalSection({
  duramax,
  oInspect,
}) {
  return (
    <section className="relative pb-10 pt-4 sm:pb-12 sm:pt-6 lg:pb-14 lg:pt-8">
      <Container>
        <ScrollReveal
          direction="up"
          distance={30}
        >
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-12">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                  Medição dimensional
                </p>

                <div className="h-px w-10 bg-[#65b8ee]" />
              </div>

              <h2 className="mt-4 max-w-[650px] text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[#071f2d] sm:text-[2.9rem]">
                Diferentes recursos para
                <br />

                <span className="text-[#356f9f]">
                  diferentes necessidades.
                </span>
              </h2>
            </div>

            <p className="max-w-[570px] text-[13px] leading-6 text-[#607583] sm:text-[14px]">
              DuraMax e O-INSPECT ampliam as possibilidades de medição
              dimensional do Centro, atendendo diferentes características
              de peça, processo e método de aquisição.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 space-y-12 sm:mt-12 sm:space-y-14 lg:mt-14 lg:space-y-16">
          <LargeEquipmentSection
            equipment={duramax}
            direction="right"
            imageSide="left"
            eyebrow="Medição dimensional"
            statement="Flexibilidade para diferentes contextos de inspeção."
            imagePosition="center"
          />

          <LargeEquipmentSection
            equipment={oInspect}
            direction="left"
            imageSide="right"
            eyebrow="Tecnologia multissensor"
            statement="Diferentes formas de medição em uma mesma análise."
            imagePosition="center"
          />
        </div>
      </Container>
    </section>
  );
}

function LargeEquipmentSection({
  equipment,
  direction,
  imageSide,
  eyebrow,
  statement,
  imagePosition = "center",
}) {
  const imageFirst = imageSide === "left";

  return (
    <article
      id={equipment.id}
      className="scroll-mt-24"
    >
      <div className="grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
        <ScrollReveal
          direction={direction}
          distance={38}
          className={imageFirst ? "" : "lg:order-2"}
        >
          <EquipmentMedia
            equipment={equipment}
            eyebrow={eyebrow}
            statement={statement}
            imagePosition={imagePosition}
          />
        </ScrollReveal>

        <ScrollReveal
          direction={direction === "right" ? "left" : "right"}
          distance={34}
          className={imageFirst ? "" : "lg:order-1"}
        >
          <EquipmentHeading
            number={equipment.number}
            category={equipment.category}
            name={equipment.name}
            description={equipment.description}
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <EquipmentInfoCard
              title="Aplicação principal"
              text={equipment.application}
            />

            <EquipmentInfoCard
              title="Tecnologia"
              text={equipment.technology}
            />
          </div>

          <EquipmentHighlights
            items={equipment.highlights}
          />

          <EquipmentServices
            services={equipment.services}
          />
        </ScrollReveal>
      </div>
    </article>
  );
}
function ScanningShowcase({
  atosQ,
  tScan,
}) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f5f9fb_10%,#e8f2f6_24%,#d3e5ec_42%,#a9c5d1_62%,#7295a6_78%,#3f687d_90%,#173e54_100%)] pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-14 lg:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[20%] h-[380px] w-[380px] rounded-full bg-white/[0.16] blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-[8%] h-[380px] w-[380px] rounded-full bg-[#65b8ee]/[0.10] blur-[125px]"
      />

      <Container>
        <ScrollReveal
          direction="up"
          distance={32}
        >
          <div className="relative z-10 grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-12">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                  Digitalização 3D
                </p>

                <div className="h-px w-10 bg-[#65b8ee]" />
              </div>

              <h2 className="mt-4 max-w-[650px] text-[2.3rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[#071f2d] sm:text-[3rem]">
                Da geometria física
                <br />

                <span className="text-[#356f9f]">
                  à informação digital.
                </span>
              </h2>
            </div>

            <p className="max-w-[575px] text-[13px] leading-6 text-[#526b79] sm:text-[14px]">
              Tecnologias de digitalização permitem capturar superfícies
              e geometrias para análise, documentação, comparação e
              desenvolvimento digital.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative z-10 mt-9 grid gap-6 lg:grid-cols-2">
          <ScanningEquipment
            equipment={atosQ}
            direction="right"
            statement="Digitalização óptica para aquisição detalhada de superfícies."
          />

          <ScanningEquipment
            equipment={tScan}
            direction="left"
            statement="Mobilidade para capturar geometrias diretamente onde o desafio está."
          />
        </div>

        <ScrollReveal
          direction="up"
          distance={28}
          className="relative z-10 mt-7"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <ScanningCapability
              number="01"
              title="Capturar"
              description="Aquisição digital da geometria e das superfícies da peça."
            />

            <ScanningCapability
              number="02"
              title="Comparar"
              description="Dados tridimensionais podem apoiar análises e comparações digitais."
            />

            <ScanningCapability
              number="03"
              title="Reconstruir"
              description="A captura pode servir como base para processos de engenharia reversa."
            />
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function ScanningEquipment({
  equipment,
  direction,
  statement,
}) {
  return (
    <ScrollReveal
      direction={direction}
      distance={36}
    >
      <article
        id={equipment.id}
        className="group scroll-mt-24 overflow-hidden rounded-[28px] border border-white/28 bg-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_18px_46px_rgba(7,31,45,0.08)] backdrop-blur-[22px]"
      >
        <EquipmentMedia
          equipment={equipment}
          eyebrow="Captura tridimensional"
          statement={statement}
          dark
        />

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#356f9f]">
                {equipment.category}
              </p>

              <h3 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.035em] text-[#071f2d] sm:text-[29px]">
                {equipment.name}
              </h3>
            </div>

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/45 bg-white/20 text-[9px] font-semibold tracking-[0.1em] text-[#356f9f] backdrop-blur-[16px]">
              {equipment.number}
            </span>
          </div>

          <p className="mt-4 text-[12px] leading-6 text-[#3f5968]">
            {equipment.description}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ScanningInfoCard
              title="Aplicação"
              text={equipment.application}
            />

            <ScanningInfoCard
              title="Tecnologia"
              text={equipment.technology}
            />
          </div>

          <div className="mt-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#356f9f]">
              Destaques
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {equipment.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-white/42 bg-white/20 px-3 py-1.5 text-[9px] font-medium text-[#314f60] backdrop-blur-[14px]"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-white/28 pt-5">
            {equipment.services.map((service) => (
              <Link
                key={service.label}
                to={service.href}
                className="group/link inline-flex items-center gap-2 text-[10px] font-semibold text-[#214f70] transition-colors duration-300 hover:text-[#071f2d]"
              >
                {service.label}

                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}

function ScanningInfoCard({
  title,
  text,
}) {
  return (
    <div className="rounded-[16px] border border-white/36 bg-white/[0.16] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-[16px]">
      <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#356f9f]">
        {title}
      </p>

      <p className="mt-2 text-[10px] leading-5 text-[#314f60]">
        {text}
      </p>
    </div>
  );
}

function ScanningCapability({
  number,
  title,
  description,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.25,
      }}
      className="rounded-[18px] border border-white/20 bg-white/[0.09] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[18px]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[9px] font-semibold tracking-[0.13em] text-[#b9ddf2]">
          {number}
        </span>

        <div className="h-px w-8 bg-[#65b8ee]/70" />
      </div>

      <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.02em] text-white">
        {title}
      </h3>

      <p className="mt-2 text-[10px] leading-5 text-white/55">
        {description}
      </p>
    </motion.div>
  );
}

function TScanVisual({
  equipment,
  eyebrow,
  statement,
}) {
  return (
    <div className="relative overflow-hidden bg-[#071f2d]">
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_68%_38%,rgba(101,184,238,0.18),transparent_22%),radial-gradient(circle_at_25%_76%,rgba(255,255,255,0.06),transparent_22%),linear-gradient(135deg,#071f2d_0%,#0a2a3d_48%,#12364e_100%)]"
        />

        <motion.div
          aria-hidden="true"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 34,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
        >
          <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9dd1ef]/50 bg-[#65b8ee]/20" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#65b8ee]/20"
        >
          <div className="absolute bottom-[7%] right-[12%] h-2 w-2 rounded-full bg-[#9dd1ef]/60" />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute left-[12%] right-[12%] top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <div
          aria-hidden="true"
          className="absolute bottom-[12%] left-1/2 top-[12%] w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent"
        />

        <div className="absolute left-6 top-6 rounded-full border border-white/18 bg-white/[0.08] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-white/80 backdrop-blur-[16px]">
          {equipment.category}
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center">
            <ScanIcon />

            <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9dd1ef]">
              Portable 3D scanning
            </p>

            <p className="mt-2 text-[25px] font-semibold tracking-[-0.035em] text-white">
              ZEISS T-SCAN
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(180deg,transparent_0%,rgba(7,31,45,0.88)_100%)] p-6 sm:p-7">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="mb-3 h-px w-11 bg-[#65b8ee]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#9dd1ef]">
                {eyebrow}
              </p>

              <p className="mt-2 max-w-[390px] text-[15px] font-semibold leading-6 text-white">
                {statement}
              </p>
            </div>

            <span className="text-[10px] font-semibold tracking-[0.14em] text-white/35">
              {equipment.number}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanIcon() {
  return (
    <svg
      className="mx-auto h-14 w-14 text-[#76b7e8]"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 19L24 14L32 19V29L24 34L16 29V19Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      <path
        d="M16 19L24 24L32 19M24 24V34"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M8 16V9H15M33 9H40V16M40 32V39H33M15 39H8V32"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoselloSection({
  equipment,
}) {
  return (
    <section
      id={equipment.id}
      className="relative scroll-mt-24 overflow-hidden bg-[linear-gradient(180deg,#173e54_0%,#0d3044_18%,#071f2d_52%,#0a293b_76%,#31596d_91%,#ffffff_100%)] pb-18 pt-12 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[8%] h-[460px] w-[460px] rounded-full bg-[#65b8ee]/[0.07] blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-[30%] h-[480px] w-[480px] rounded-full bg-white/[0.035] blur-[145px]"
      />

      <Container>
        <ScrollReveal
          direction="up"
          distance={30}
        >
          <div className="relative z-10 grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-12">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9dd1ef]">
                  Inspeção interna
                </p>

                <div className="h-px w-10 bg-[#65b8ee]" />
              </div>

              <h2 className="mt-4 max-w-[650px] text-[2.3rem] font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-[3rem]">
                Enxergar além
                <br />

                <span className="text-[#9dd1ef]">
                  da superfície.
                </span>
              </h2>
            </div>

            <p className="max-w-[570px] text-[13px] leading-6 text-white/58 sm:text-[14px]">
              A inspeção por raios X permite investigar regiões internas
              de peças e componentes sem depender apenas das superfícies
              externamente acessíveis.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative z-10 mt-9 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-12">
          <ScrollReveal
            direction="right"
            distance={38}
          >
            <div className="group relative overflow-hidden rounded-[30px] border border-white/15 bg-white/[0.06] shadow-[0_26px_70px_rgba(0,0,0,0.18)] backdrop-blur-[20px]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className={`h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025] ${
                    equipment.imageFit === "contain"
                      ? "object-contain"
                      : "object-cover"
                  }`}
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,31,45,0.03)_0%,rgba(7,31,45,0.12)_45%,rgba(7,31,45,0.94)_100%)]"
                />

                <div className="absolute left-6 top-6 rounded-full border border-white/18 bg-[#071f2d]/25 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-white/85 backdrop-blur-[18px]">
                  Inspeção industrial por raios X
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <div className="mb-3 h-px w-11 bg-[#65b8ee]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#9dd1ef]">
                    Inspeção não destrutiva
                  </p>

                  <h3 className="mt-2 max-w-[470px] text-[19px] font-semibold leading-snug tracking-[-0.025em] text-white sm:text-[22px]">
                    Investigar características que não estão visíveis externamente.
                  </h3>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={34}
          >
            <EquipmentHeading
              number={equipment.number}
              category={equipment.category}
              name={equipment.name}
              description={equipment.description}
              light
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <EquipmentInfoCard
                title="Aplicação principal"
                text={equipment.application}
                light
              />

              <EquipmentInfoCard
                title="Tecnologia"
                text={equipment.technology}
                light
              />
            </div>

            <EquipmentHighlights
              items={equipment.highlights}
              light
            />

            <EquipmentServices
              services={equipment.services}
              light
            />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
function NeedGuideSection() {
  return (
    <section className="pb-5 pt-8 sm:pb-6 sm:pt-10 lg:pb-7 lg:pt-12">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-12">
          <ScrollReveal
            direction="right"
            distance={30}
          >
            <div>
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                  Escolha da tecnologia
                </p>

                <div className="h-px w-10 bg-[#65b8ee]" />
              </div>

              <h2 className="mt-4 max-w-[560px] text-[2.3rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[#071f2d] sm:text-[3rem]">
                Cada necessidade
                <br />

                <span className="text-[#356f9f]">
                  direciona a tecnologia.
                </span>
              </h2>

              <p className="mt-5 max-w-[510px] text-[13px] leading-6 text-[#607583] sm:text-[14px]">
                A escolha do equipamento depende das características da
                peça, do objetivo da análise e do tipo de informação
                necessária para o projeto.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            distance={30}
          >
            <div className="overflow-hidden rounded-[24px] border border-white/72 bg-white/46 shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_14px_40px_rgba(7,31,45,0.04)] backdrop-blur-[20px]">
              {needProfiles.map((profile, index) => (
                <NeedProfileRow
                  key={profile.number}
                  profile={profile}
                  index={index}
                  last={index === needProfiles.length - 1}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function NeedProfileRow({
  profile,
  index,
  last,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.35,
      }}
      transition={{
        duration: 0.42,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`grid gap-3 px-5 py-4 sm:grid-cols-[48px_1fr_1fr] sm:items-center sm:gap-5 sm:px-6 ${
        last ? "" : "border-b border-[#dce8ed]/65"
      }`}
    >
      <span className="text-[9px] font-semibold tracking-[0.14em] text-[#7894a4]">
        {profile.number}
      </span>

      <div>
        <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#8ba0ac]">
          Necessidade
        </p>

        <h3 className="mt-1 text-[13px] font-semibold tracking-[-0.01em] text-[#071f2d]">
          {profile.need}
        </h3>
      </div>

      <div>
        <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#8ba0ac]">
          Tecnologias relacionadas
        </p>

        <p className="mt-1 text-[10px] font-medium text-[#356f9f]">
          {profile.equipment}
        </p>
      </div>
    </motion.div>
  );
}

function EquipmentGuidanceSection() {
  return (
    <section className="relative overflow-hidden pb-12 pt-2 sm:pb-14 sm:pt-3 lg:pb-16 lg:pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 -right-36 h-[420px] w-[420px] rounded-full bg-[#65b8ee]/[0.08] blur-[125px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[8%] h-[380px] w-[380px] rounded-full bg-[#12364e]/[0.04] blur-[120px]"
      />

      <Container>
        <ScrollReveal
          direction="up"
          distance={28}
          fadeOut={false}
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/75 bg-white/46 px-5 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_18px_48px_rgba(7,31,45,0.05)] backdrop-blur-[22px] sm:px-7 sm:py-8 lg:px-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-[280px] w-[280px] rounded-full border border-[#356f9f]/[0.055]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-10 h-[180px] w-[180px] rounded-full border border-[#65b8ee]/[0.08]"
            />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-12">
              <div>
                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                    Próximo passo
                  </p>

                  <div className="h-px w-10 bg-[#65b8ee]" />
                </div>

                <h2 className="mt-4 max-w-[650px] text-[2.15rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[#071f2d] sm:text-[2.8rem]">
                  Não sabe qual equipamento
                  <br />

                  <span className="text-[#356f9f]">
                    atende sua necessidade?
                  </span>
                </h2>

                <p className="mt-5 max-w-[560px] text-[12px] leading-6 text-[#607583] sm:text-[13px]">
                  Você não precisa definir a tecnologia antes de entrar
                  em contato. Descreva sua necessidade e o Centro poderá
                  direcionar a solicitação de acordo com o objetivo do
                  projeto.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <EquipmentFinalAction
                  number="01"
                  eyebrow="Já tenho uma necessidade"
                  title="Solicitar orçamento"
                  description="Envie as informações disponíveis sobre a peça e o objetivo da análise."
                  href="/orcamento"
                />

                <EquipmentFinalAction
                  number="02"
                  eyebrow="Preciso de orientação"
                  title="Configurar minha solução"
                  description="Responda algumas perguntas para organizar e direcionar sua necessidade."
                  href="/configurador"
                />
              </div>
            </div>

            <div className="relative z-10 mt-7 flex flex-col gap-3 border-t border-[#dce8ed]/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#7894a4]">
                Medir · Digitalizar · Inspecionar
              </p>

              <p className="text-[10px] text-[#7894a4]">
                Centro de Excelência
              </p>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function EquipmentFinalAction({
  number,
  eyebrow,
  title,
  description,
  href,
}) {
  return (
    <Link
      to={href}
      className="group relative flex min-h-[190px] flex-col overflow-hidden rounded-[22px] border border-white/80 bg-white/52 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_10px_28px_rgba(7,31,45,0.035)] backdrop-blur-[18px] transition-all duration-300 hover:-translate-y-[3px] hover:bg-white/72 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_16px_36px_rgba(7,31,45,0.065)]"
    >
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 h-28 w-28 rounded-full border border-[#356f9f]/[0.07] transition-transform duration-500 group-hover:scale-125"
      />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <span className="text-[9px] font-semibold tracking-[0.14em] text-[#5687ad]">
          {number}
        </span>

        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dce8ed] bg-white/60 text-[#356f9f] transition-all duration-300 group-hover:border-[#12364e] group-hover:bg-[#12364e] group-hover:text-white">
          <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>

      <div className="relative z-10 mt-6">
        <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#7894a4]">
          {eyebrow}
        </p>

        <h3 className="mt-2 text-[18px] font-semibold leading-tight tracking-[-0.025em] text-[#071f2d]">
          {title}
        </h3>

        <p className="mt-3 max-w-[350px] text-[10px] leading-5 text-[#607583]">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-5">
        <div className="h-px w-full bg-[#dce8ed]">
          <div className="h-px w-10 bg-[#65b8ee] transition-all duration-500 group-hover:w-full" />
        </div>
      </div>
    </Link>
  );
}