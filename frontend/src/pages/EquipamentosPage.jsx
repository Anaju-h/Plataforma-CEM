import { Link } from "react-router-dom";

import { Container } from "../components/layout/Container";

const equipment = [
  {
    number: "01",
    id: "prismo",
    name: "ZEISS PRISMO",
    category: "Medição por coordenadas",
    description:
      "Sistema de medição por coordenadas voltado a aplicações que exigem elevada precisão na avaliação dimensional e geométrica de peças e componentes.",
    application:
      "Medições dimensionais de alta precisão, geometrias complexas e avaliação de requisitos rigorosos.",
    technology: "Máquina de medição por coordenadas",
    services: [
      {
        label: "Inspeção dimensional",
        href: "/servicos#inspecao-dimensional",
      },
    ],
    image: "/images/equipment/prismo.jpeg",
    imageFit: "cover",
  },
  {
    number: "02",
    id: "o-inspect",
    name: "ZEISS O-INSPECT",
    category: "Medição multissensor",
    description:
      "Tecnologia multissensor que combina diferentes métodos de medição para avaliação flexível de características dimensionais e geométricas.",
    application:
      "Componentes que exigem combinação de medição óptica e por contato em uma mesma análise.",
    technology: "Medição óptica e por contato",
    services: [
      {
        label: "Inspeção dimensional",
        href: "/servicos#inspecao-dimensional",
      },
    ],
    image: "/images/equipment/o-inspect.jpeg",
    imageFit: "cover",
  },
  {
    number: "03",
    id: "duramax",
    name: "ZEISS DuraMax",
    category: "Medição por coordenadas",
    description:
      "Sistema de medição por coordenadas desenvolvido para inspeções dimensionais com operação flexível e aplicação em diferentes contextos industriais.",
    application:
      "Controle dimensional de peças e componentes, análises geométricas e inspeções de processo.",
    technology: "Máquina de medição por coordenadas",
    services: [
      {
        label: "Inspeção dimensional",
        href: "/servicos#inspecao-dimensional",
      },
    ],
    image: "/images/equipment/duramax.jpeg",
    imageFit: "cover",
  },
  {
    number: "04",
    id: "t-scan",
    name: "ZEISS T-SCAN",
    category: "Digitalização 3D",
    description:
      "Sistema portátil de escaneamento 3D utilizado para captura digital de geometrias e superfícies de peças e componentes.",
    application:
      "Digitalização de componentes, geometrias complexas, documentação e geração de dados tridimensionais.",
    technology: "Escaneamento 3D portátil",
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
  },
  {
    number: "05",
    id: "atos-q",
    name: "ZEISS ATOS Q",
    category: "Digitalização 3D",
    description:
      "Sistema óptico de digitalização tridimensional para aquisição detalhada de superfícies e geometrias de peças.",
    application:
      "Captura tridimensional, inspeção de superfícies, comparação com modelos CAD e suporte ao desenvolvimento.",
    technology: "Digitalização óptica 3D",
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
    image: "/images/equipment/atos-q.jpeg",
    imageFit: "cover",
  },
  {
    number: "06",
    id: "bosello-max",
    name: "ZEISS BOSELLO MAX",
    category: "Inspeção por raios X",
    description:
      "Sistema voltado à inspeção não destrutiva para análise de estruturas, características e regiões internas não acessíveis externamente.",
    application:
      "Investigação de estruturas internas, cavidades, montagens, descontinuidades e características não visíveis externamente.",
    technology: "Inspeção industrial por raios X",
    services: [
      {
        label: "Análise interna",
        href: "/servicos#analise-interna",
      },
    ],
    image: "/images/equipment/bosello-max.jpeg",
    imageFit: "cover",
  },
];

export function EquipamentosPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-18 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-64 h-[540px] w-[540px] rounded-full border border-[#356f9f]/[0.035]"
        />

        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium uppercase tracking-[0.09em] text-[#356f9f]">
                  Equipamentos
                </p>

                <div className="h-px w-10 bg-[#6fa7d1]" />
              </div>

              <h1 className="mt-5 max-w-3xl text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[#0b2340] sm:text-6xl">
                Tecnologia de medição para diferentes escalas e aplicações.
              </h1>
            </div>

            <p className="max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
              O Centro reúne diferentes tecnologias para medição dimensional,
              digitalização tridimensional e inspeção interna, permitindo
              selecionar a solução adequada a cada desafio.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {equipment.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="
                  group rounded-[22px]
                  border border-[#d6e4ec]
                  bg-[#f0f6f9]
                  px-6 py-5
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-[#91bcd8]
                  hover:bg-[#e8f2f7]
                  hover:shadow-[0_14px_32px_rgba(8,28,44,0.06)]
                "
              >
                <span className="text-[11px] font-medium tracking-[0.13em] text-[#356f9f]">
                  {item.number}
                </span>

                <h2 className="mt-3 text-base font-semibold text-[#0b2340]">
                  {item.name}
                </h2>

                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#5687ad]">
                  {item.category}
                </p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* EQUIPAMENTOS */}
      {equipment.map((item, index) => (
        <EquipmentSection
          key={item.id}
          equipment={item}
          reversed={index % 2 !== 0}
          surface={index % 2 === 0}
        />
      ))}

      {/* TECNOLOGIA + SERVIÇO */}
      <section className="bg-[var(--color-surface)] py-14 sm:py-18 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium uppercase tracking-[0.09em] text-[#356f9f]">
                  Tecnologia e aplicação
                </p>

                <div className="h-px w-10 bg-[#6fa7d1]" />
              </div>

              <h2 className="mt-4 max-w-xl text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#0b2340] sm:text-5xl">
                O equipamento é parte de uma solução maior.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
                A tecnologia utilizada é definida a partir das características
                da peça, do objetivo da análise e das informações necessárias
                ao projeto.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <RelationCard
                number="01"
                technology="Medição por coordenadas"
                service="Inspeção dimensional"
                href="/servicos#inspecao-dimensional"
              />

              <RelationCard
                number="02"
                technology="Digitalização 3D"
                service="Digitalização 3D e engenharia reversa"
                href="/servicos#digitalizacao-3d"
              />

              <RelationCard
                number="03"
                technology="Inspeção interna por ensaio não destrutivo"
                service="Análise interna"
                href="/servicos#analise-interna"
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
          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
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
        </Container>
      </section>
    </main>
  );
}

function EquipmentSection({ equipment, reversed, surface }) {
  return (
    <section
      id={equipment.id}
      className={`scroll-mt-24 py-14 sm:py-18 lg:py-20 ${
        surface ? "bg-[var(--color-surface)]" : "bg-white"
      }`}
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className={reversed ? "lg:order-2" : ""}>
            {equipment.image ? (
              <div className="group relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#eef3f6]">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className={
                    equipment.imageFit === "contain"
                      ? "absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                      : "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  }
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#071a2b]/20 via-transparent to-transparent" />

                <div className="absolute left-6 top-6 flex items-center gap-3">
                  <span className="text-[10px] font-medium tracking-[0.13em] text-[#356f9f]">
                    {equipment.number}
                  </span>

                  <div className="h-px w-9 bg-[#6fa7d1]" />
                </div>
              </div>
            ) : (
              <TScanPlaceholder number={equipment.number} />
            )}
          </div>

          <div className={reversed ? "lg:order-1" : ""}>
            <p className="text-xs font-medium uppercase tracking-[0.11em] text-[#356f9f]">
              {equipment.category}
            </p>

            <h2 className="mt-3 text-[2.45rem] font-semibold leading-[1.06] tracking-[-0.04em] text-[#0b2340] sm:text-5xl">
              {equipment.name}
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
              {equipment.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <TechnicalBox
                title="Aplicação principal"
                text={equipment.application}
              />

              <TechnicalBox
                title="Tecnologia"
                text={equipment.technology}
              />
            </div>

            <div className="mt-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.11em] text-[#5687ad]">
                Serviços relacionados
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {equipment.services.map((service) => (
                  <Link
                    key={service.label}
                    to={service.href}
                    className="
                      inline-flex min-h-[36px] items-center
                      rounded-full
                      border border-[#d6e3eb]
                      bg-[#f1f6f9]
                      px-4 py-2
                      text-xs font-medium text-[#356f9f]
                      transition-all duration-300
                      hover:border-[#8dbddd]
                      hover:bg-[#e8f2f7]
                      hover:text-[#0b2340]
                    "
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function TechnicalBox({ title, text }) {
  return (
    <div className="rounded-[20px] border border-[#dfe6eb] bg-white p-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.11em] text-[#356f9f]">
        {title}
      </p>

      <p className="mt-3 text-sm leading-6 text-[#536773]">{text}</p>
    </div>
  );
}

function RelationCard({ number, technology, service, href }) {
  return (
    <Link
      to={href}
      className="
        group flex min-h-[170px] flex-col
        rounded-[22px]
        border border-[#d9e5ec]
        bg-white
        p-5
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#8dbddd]
        hover:shadow-[0_12px_28px_rgba(8,28,44,0.05)]
      "
    >
      <span className="text-[10px] font-medium tracking-[0.12em] text-[#356f9f]">
        {number}
      </span>

      <p className="mt-5 text-sm font-semibold leading-5 text-[#0b2340]">
        {technology}
      </p>

      <div className="mt-auto pt-5">
        <div className="mb-3 h-px w-8 bg-[#69aedd]" />

        <p className="text-xs leading-5 text-[#617584]">{service}</p>
      </div>
    </Link>
  );
}

function TScanPlaceholder({ number }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#0a2435]">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-28 h-[350px] w-[350px] rounded-full border border-[#76b7e8]/10"
      />

      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-[230px] w-[230px] rounded-full border border-[#76b7e8]/10"
      />

      <div className="absolute left-6 top-6 flex items-center gap-3">
        <span className="text-[10px] font-medium tracking-[0.13em] text-[#76b7e8]">
          {number}
        </span>

        <div className="h-px w-9 bg-[#76b7e8]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="max-w-sm text-center">
          <ScanIcon />

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.13em] text-[#76b7e8]">
            Portable 3D scanning
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-white">
            ZEISS T-SCAN
          </p>

          <p className="mt-4 text-sm leading-6 text-[#aebfc9]">
            Fotografia do equipamento será adicionada posteriormente.
          </p>
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
        <span className="text-[11px] font-medium tracking-[0.12em] text-[#356f9f]">
          {number}
        </span>

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