import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../layout/Container";
import { ArrowRightIcon } from "../ui/ArrowIcons";
import { EQUIPMENT_SPECS_NOTE, getEquipmentSpecs } from "../../data/equipmentSpecs";

/*
 * Seções da página Sobre (área institucional): quem somos, missão/visão/valores,
 * trajetória, parceiros, infraestrutura + galeria, setores atendidos e capacitação.
 * Seguem os mesmos tokens visuais das demais páginas públicas (vidro claro, navy #071f2d, azul #315b75).
 */

const EASE = [0.22, 1, 0.36, 1];

function reveal(delay = 0, offset = { y: 26 }) {
  return {
    initial: { opacity: 0, ...offset },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: false, amount: 0.25 },
    transition: { delay, duration: 0.72, ease: EASE },
  };
}

const GLASS =
  "border border-white/74 bg-white/46 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_28px_rgba(7,31,45,0.04)] backdrop-blur-[20px]";

function Eyebrow({ children, light = false }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.21em] ${light ? "text-[#9ccce8]" : "text-[#315b75]"}`}>
      {children}
    </p>
  );
}

function SectionTitle({ first, second, className = "" }) {
  return (
    <h2 className={`mt-4 text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.045em] text-[#071f2d] sm:text-[2.85rem] ${className}`}>
      {first}
      <span className="block text-[#315b75]">{second}</span>
    </h2>
  );
}

function CircleLink({ to, children }) {
  return (
    <Link to={to} className="group inline-flex shrink-0 items-center gap-3 text-[12px] font-semibold text-[#12364e]">
      {children}
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#12364e]/12 bg-white/52 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[16px] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/82">
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

/* =========================================================
   QUEM SOMOS · MISSÃO · VISÃO · VALORES
========================================================= */

const identity = [
  {
    number: "01",
    title: "Missão",
    text: "Oferecer serviços de metrologia dimensional de alto nível e capacitar estudantes, docentes e profissionais da indústria.",
  },
  {
    number: "02",
    title: "Visão",
    text: "Ser referência em metrologia dimensional de precisão no Centro-Oeste, na indústria e na formação.",
  },
  {
    number: "03",
    title: "Valores",
    text: "Precisão, rigor técnico, conhecimento compartilhado e parceria com a indústria.",
  },
];

export function IdentitySection() {
  return (
    <section className="relative pb-8 pt-3 sm:pb-9 sm:pt-5 lg:pb-10 lg:pt-6">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <motion.div {...reveal()}>
            <Eyebrow>Quem somos</Eyebrow>
            <SectionTitle first="Precisão que começa" second="pela formação." className="max-w-[470px]" />
          </motion.div>

          <motion.div {...reveal(0.08)} className="max-w-[710px] lg:pt-1">
            <p className="text-[14.5px] font-medium leading-[1.9] text-[#49697c]">
              O Centro de Excelência em Metrologia nasceu para criar uma cultura de medição de precisão em Goiás e no Centro-Oeste, uma região que ainda carecia de estrutura em metrologia e metalmecânica de precisão.
            </p>
            <p className="mt-4 text-[14.5px] leading-[1.9] text-[#657d8c]">
              Instalado em uma faculdade com cursos de engenharia, o Centro une serviços de alto nível para a indústria à formação de estudantes, docentes e profissionais, com tecnologia e conhecimento da Carl Zeiss.
            </p>
          </motion.div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {identity.map((item, index) => (
            <motion.div
              key={item.title}
              {...reveal(index * 0.07)}
              className={`group relative overflow-hidden rounded-[18px] px-6 py-5 transition-all duration-500 hover:-translate-y-[3px] hover:bg-white/68 hover:shadow-[0_20px_48px_rgba(7,31,45,0.08)] ${GLASS}`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#12364e]">{item.title}</h3>
                <span className="text-[11px] font-semibold tracking-[0.15em] text-[#7190a2]">{item.number}</span>
              </div>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-[#647d8c]">{item.text}</p>
              <div className="mt-4 h-[2px] w-8 rounded-full bg-[#65b8ee] transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   TRAJETÓRIA
========================================================= */

const timeline = [
  { tag: "Origem", text: "A região carecia de metrologia e metalmecânica de precisão." },
  { tag: "Parceria", text: "Escolha da Carl Zeiss como parceira em tecnologia e conhecimento." },
  { tag: "Alemanha", text: "Visitas técnicas à fábrica da ZEISS para aprender com quem desenvolve a tecnologia." },
  { tag: "Implantação", text: "Instalação na Faculdade SENAI Ítalo Bologna, junto aos cursos de engenharia." },
  { tag: "Nov. 2024", text: "Inauguração do primeiro Centro de Excelência em Metrologia SENAI ZEISS do Brasil.", highlight: true },
  { tag: "Em andamento", text: "Intercâmbio de profissionais na Alemanha e busca da acreditação Inmetro.", ongoing: true },
];

export function TimelineSection() {
  return (
    <section className="relative pb-2 pt-4 sm:pb-3 lg:pb-4">
      <Container>
        <motion.div {...reveal()} className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>Trajetória</Eyebrow>
            <SectionTitle first="Da necessidade regional" second="ao primeiro do Brasil." className="max-w-[640px]" />
          </div>
        </motion.div>

        <div className="relative mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div aria-hidden="true" className="absolute left-[21px] right-[calc(16.666%-21px)] top-[21px] hidden h-px bg-[#315b75]/16 lg:block" />
          {timeline.map((step, index) => (
            <motion.div key={step.tag} {...reveal(index * 0.06)} className="relative z-10">
              <span
                className={`flex h-[42px] w-[42px] items-center justify-center rounded-full text-[11px] font-semibold tracking-[0.1em] shadow-[0_8px_22px_rgba(7,31,45,0.12)] ${
                  step.highlight
                    ? "border border-white bg-[#0057b8] text-white"
                    : step.ongoing
                      ? "border border-dashed border-[#315b75]/45 bg-white/80 text-[#315b75]"
                      : "border border-white bg-[#12364e] text-white"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className={`mt-4 text-[11px] font-bold uppercase tracking-[0.16em] ${step.highlight ? "text-[#0057b8]" : "text-[#315b75]"}`}>
                {step.tag}
              </p>
              <p className="mt-1.5 max-w-[260px] text-[13.5px] leading-[1.65] text-[#5f7888]">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   PARCEIROS
========================================================= */

export function PartnersSection() {
  return (
    <section className="relative pb-12 pt-0 sm:pb-14">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
          <motion.div {...reveal()}>
            <Eyebrow>Parceiros</Eyebrow>
            <h2 className="mt-4 max-w-[430px] text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#071f2d] sm:text-[2.2rem]">
              Educação e tecnologia
              <span className="block text-[#315b75]">na mesma bancada.</span>
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div {...reveal(0.05)} className={`flex min-h-[210px] flex-col rounded-[20px] p-6 ${GLASS}`}>
              <div className="flex h-[84px] items-center justify-center">
                <img src="/brand/logo-senai.png" alt="SENAI" className="h-[80px] w-auto max-w-full object-contain" />
              </div>
              <p className="mt-auto pt-5 text-[14px] leading-[1.65] text-[#647d8c]">
                Educação profissional e tecnológica para a indústria.
              </p>
            </motion.div>
            <motion.div {...reveal(0.1)} className={`flex min-h-[210px] flex-col rounded-[20px] p-6 ${GLASS}`}>
              <div className="flex h-[84px] items-center justify-center">
                <img src="/brand/logo-ZEISS-cooperacao.png" alt="ZEISS Cooperação Tecnológica" className="h-[70px] w-auto max-w-full object-contain" />
              </div>
              <p className="mt-auto pt-5 text-[14px] leading-[1.65] text-[#647d8c]">
                Tecnologia de medição, equipamentos e transferência de conhecimento.
              </p>
            </motion.div>
            <motion.div {...reveal(0.15)} className="flex min-h-[210px] flex-col rounded-[20px] border border-dashed border-[#315b75]/28 bg-white/30 p-6">
              <div className="flex h-[84px] flex-col justify-center">
                <span className="w-fit rounded-full bg-[#eef4f7] px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#315b75]">
                  Em andamento
                </span>
                <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.02em] text-[#12364e]">Acreditação Inmetro</h3>
              </div>
              <p className="mt-auto pt-5 text-[14px] leading-[1.65] text-[#647d8c]">Processo de acreditação em curso.</p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   INFRAESTRUTURA + GALERIA
========================================================= */

const stats = [
  { value: "6", label: "sistemas ZEISS de medição, digitalização e tomografia" },
  { value: "µm", label: "precisão na escala do micrômetro" },
  { value: "1º", label: "Centro de Excelência SENAI ZEISS do Brasil" },
  { value: "2024", label: "ano de inauguração, em Goiânia" },
];

const machines = [
  { id: "prismo", name: "ZEISS PRISMO", category: "Medição por coordenadas" },
  { id: "duramax", name: "ZEISS DuraMax", category: "Medição por coordenadas" },
  { id: "o-inspect", name: "ZEISS O-INSPECT", category: "Medição multissensor" },
  { id: "atos-q", name: "ZEISS ATOS Q", category: "Digitalização 3D" },
  { id: "t-scan", name: "ZEISS T-SCAN", category: "Digitalização 3D" },
  { id: "bosello-max", name: "ZEISS BOSELLO MAX", category: "Inspeção por raios X" },
];

const gallery = [
  { src: "/images/equipment/laboratorio.jpeg", alt: "Laboratório de metrologia", className: "col-span-2 h-[230px] sm:h-[270px]", position: "object-[center_55%]" },
  { src: "/images/equipment/centro-1.jpeg", alt: "Vista do laboratório", className: "h-[170px] sm:h-[200px]", position: "object-center" },
  { src: "/images/equipment/centro-2.jpeg", alt: "Acesso ao Centro", className: "h-[170px] sm:h-[200px]", position: "object-center" },
];

export function InfrastructureSection() {
  return (
    <section className="relative pb-12 pt-10 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-14">
      <Container>
        <motion.div {...reveal()} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>Infraestrutura</Eyebrow>
            <SectionTitle first="Seis sistemas ZEISS," second="precisão em micrômetros." className="max-w-[660px]" />
          </div>
          <CircleLink to="/equipamentos">Conheça os equipamentos</CircleLink>
        </motion.div>

        <motion.div {...reveal(0.05)} className={`mt-8 grid grid-cols-2 overflow-hidden rounded-[20px] lg:grid-cols-4 ${GLASS}`}>
          {stats.map((item, index) => (
            <div
              key={item.value}
              className={`px-5 py-5 sm:px-6 ${index % 2 === 1 ? "border-l border-[#12364e]/8" : ""} ${index > 1 ? "border-t border-[#12364e]/8 lg:border-t-0" : ""} ${index === 2 ? "lg:border-l lg:border-[#12364e]/8" : ""}`}
            >
              <p className="text-[1.9rem] font-semibold leading-none tracking-[-0.045em] text-[#12364e]">{item.value}</p>
              <p className="mt-2 text-[12.5px] leading-[1.5] text-[#667f8e]">{item.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div {...reveal(0.05, { x: -24 })} className="grid grid-cols-2 gap-3">
            {gallery.map(photo => (
              <figure key={photo.src} className={`group relative overflow-hidden rounded-[20px] bg-[#071f2d] shadow-[0_18px_46px_rgba(7,31,45,0.10)] ${photo.className}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${photo.position}`}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,31,45,0)_45%,rgba(7,31,45,0.55)_100%)]" />
                <figcaption className="absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  {photo.alt}
                </figcaption>
              </figure>
            ))}
          </motion.div>

          <motion.div {...reveal(0.1, { x: 24 })} className={`flex flex-col rounded-[20px] p-5 sm:p-6 ${GLASS}`}>
            <ul className="flex flex-1 flex-col justify-between divide-y divide-[#12364e]/8">
              {machines.map(machine => {
                const spec = getEquipmentSpecs(machine.id)?.key;
                return (
                  <li key={machine.id}>
                    <Link
                      to={`/equipamentos#${machine.id}`}
                      className="group flex items-center justify-between gap-4 py-3.5"
                    >
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-semibold text-[#12364e]">{machine.name}</p>
                        <p className="mt-0.5 text-[12px] text-[#7790a0]">{machine.category}</p>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        {spec && (
                          <div className="hidden sm:block">
                            <p className="text-[12.5px] font-semibold text-[#315b75]">{spec.value}</p>
                            <p className="text-[11px] text-[#8aa0ad]">{spec.label}</p>
                          </div>
                        )}
                        <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-[#315b75] transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 border-t border-[#12364e]/8 pt-3 text-[11.5px] leading-[1.55] text-[#8aa0ad]">{EQUIPMENT_SPECS_NOTE}</p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   SETORES ATENDIDOS + FORMAÇÃO
========================================================= */

const sectors = [
  { title: "Automotivo", text: "Controle dimensional de componentes, dispositivos e peças de fornecedores." },
  { title: "Aeronáutico", text: "Inspeção de geometrias complexas com tolerâncias rigorosas." },
  { title: "Agroindústria", text: "Peças de máquinas agrícolas, reposição e engenharia reversa." },
  { title: "Moldes e matrizes", text: "Digitalização, comparação com o CAD e correção de ferramentas." },
  { title: "Manutenção industrial", text: "Análise de falhas, desgaste e reconstrução de componentes." },
];

// Mesmas áreas da seção "Treinamentos técnicos" em Serviços (cursos de graduação/pós são do SENAI, não do Centro).
const trainingAreas = [
  "Manutenção",
  "Metrologia",
  "Engenharia reversa",
  "Lubrificação",
  "Análise de falhas",
];

export function ActivitySection() {
  return (
    <section className="relative pb-16 pt-10 sm:pb-[72px] sm:pt-12 lg:pb-20 lg:pt-14">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8">
          <motion.div {...reveal()}>
            <Eyebrow>Setores atendidos</Eyebrow>
            <SectionTitle first="Metrologia para" second="a indústria da região." className="max-w-[560px]" />
            <div className="mt-7 grid gap-x-8 sm:grid-cols-2">
              {sectors.map((sector, index) => (
                <div key={sector.title} className="flex gap-4 border-t border-[#12364e]/8 py-4">
                  <span className="pt-0.5 text-[11px] font-semibold tracking-[0.15em] text-[#7190a2]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#12364e]">{sector.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-[1.6] text-[#647d8c]">{sector.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...reveal(0.08, { x: 26 })}
            className="relative self-start overflow-hidden rounded-[24px] border border-white/80 bg-white/54 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_18px_50px_rgba(7,31,45,0.06)] backdrop-blur-[22px] sm:p-8 lg:mt-2"
          >
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-[190px] w-[190px] rounded-full bg-[#65b8ee]/10 blur-[55px]" />
            <Eyebrow>Capacitação</Eyebrow>
            <h3 className="mt-4 text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#071f2d] sm:text-[2.15rem]">
              Treinamentos técnicos
              <span className="block text-[#315b75]">para equipes da indústria.</span>
            </h3>
            <p className="mt-4 text-[14px] leading-[1.75] text-[#5a7586]">
              Além dos serviços, o Centro capacita equipes em temas ligados à prática do laboratório.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {trainingAreas.map(area => (
                <span key={area} className="rounded-full border border-[#315b75]/14 bg-[#eef4f7]/80 px-3 py-1.5 text-[12px] font-semibold text-[#315b75]">
                  {area}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <CircleLink to="/servicos#treinamentos">Ver treinamentos</CircleLink>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
