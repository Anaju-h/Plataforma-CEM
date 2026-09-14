import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../components/layout/Container";
import { ArrowRightIcon } from "../components/ui/ArrowIcons";

const capabilities = [
  {
    number: "01",
    title: "Medição dimensional",
    description:
      "Tecnologias voltadas à verificação dimensional e ao controle geométrico de componentes e peças.",
  },
  {
    number: "02",
    title: "Digitalização 3D",
    description:
      "Aquisição de geometrias e superfícies para análise, comparação e documentação digital.",
  },
  {
    number: "03",
    title: "Engenharia reversa",
    description:
      "Uso de dados de medição e digitalização como apoio à reconstrução e análise de componentes.",
  },
  {
    number: "04",
    title: "Inspeção interna",
    description:
      "Recursos voltados à inspeção de características internas de componentes.",
  },
];

const workflow = [
  {
    number: "01",
    label: "Desafio",
    description:
      "Entendimento inicial da necessidade e do contexto da aplicação.",
  },
  {
    number: "02",
    label: "Análise",
    description:
      "Avaliação das características da peça e dos requisitos do projeto.",
  },
  {
    number: "03",
    label: "Tecnologia",
    description:
      "Definição das tecnologias e recursos mais adequados à necessidade.",
  },
  {
    number: "04",
    label: "Aplicação",
    description:
      "Execução das atividades de medição, inspeção, digitalização ou engenharia.",
  },
  {
    number: "05",
    label: "Resultado",
    description:
      "Organização das informações técnicas geradas durante o processo.",
  },
];

export function SobrePage() {
  return (
    <div className="overflow-hidden bg-white">
      {/* =====================================================
          HERO + ORIGEM
      ====================================================== */}

      <div
        className="
          relative
          isolate
          overflow-hidden
          bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_7%,#f8fbfc_18%,#eef5f8_42%,#f4f8fa_72%,#ffffff_100%)]
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[290px]
            top-[40px]
            -z-10
            h-[640px]
            w-[640px]
            rounded-full
            bg-[#65b8ee]/10
            blur-[155px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-[270px]
            bottom-[-40px]
            -z-10
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#315b75]/7
            blur-[150px]
          "
        />

        <AboutHero />
        <PurposeSection />
      </div>

      {/* =====================================================
          MEMÓRIA / CITAÇÃO
      ====================================================== */}

      <LegacySection />

      {/* =====================================================
          CONTINUIDADE + ESTRUTURA
      ====================================================== */}

      <div
        className="
          relative
          isolate
          overflow-hidden
          bg-[linear-gradient(180deg,#ffffff_0%,#f7fafb_12%,#eef4f7_42%,#f5f9fb_70%,#ffffff_100%)]
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-[310px]
            top-[120px]
            -z-10
            h-[580px]
            w-[580px]
            rounded-full
            bg-[#65b8ee]/8
            blur-[150px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[300px]
            bottom-[20px]
            -z-10
            h-[580px]
            w-[580px]
            rounded-full
            bg-[#315b75]/7
            blur-[150px]
          "
        />

        <ContinuitySection />
        <CapabilitiesSection />
      </div>

      <WorkflowSection />
      <FinalCta />
    </div>
  );
}

/* =========================================================
   HERO
========================================================= */

function AboutHero() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 58],
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 22],
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.84],
    [1, 0.28],
  );

  return (
    <section
      ref={sectionRef}
      className="
        relative
        pb-8
        pt-6
        sm:pb-10
        sm:pt-8
        lg:pb-12
        lg:pt-9
      "
    >
      <Container>
        <div
          className="
            grid
            min-h-[515px]
            items-center
            gap-10
            lg:grid-cols-[0.82fr_1.18fr]
            lg:gap-14
          "
        >
          <motion.div
            style={{
              y: contentY,
              opacity: contentOpacity,
            }}
            className="
              relative
              z-10
              max-w-[590px]
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-3"
            >
              <span
                className="
                  h-[5px]
                  w-[5px]
                  rounded-full
                  bg-[#0057b8]
                  shadow-[0_0_0_5px_rgba(0,87,184,0.07)]
                "
              />

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#315b75]
                "
              >
                Sobre o Centro
              </p>

              <div className="h-px w-10 bg-[#315b75]/28" />
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
                duration: 0.78,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-5
                text-[2.8rem]
                font-semibold
                leading-[0.98]
                tracking-[-0.052em]
                text-[#071f2d]
                sm:text-[3.5rem]
                lg:text-[4rem]
                xl:text-[4.35rem]
              "
            >
              Conheça o
              <span className="block">Centro de</span>
              <span className="block">Excelência</span>
              <span className="block text-[#315b75]">
                em Metrologia.
              </span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.16,
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-6
                max-w-[535px]
                text-[14px]
                font-medium
                leading-[1.85]
                text-[#527083]
                sm:text-[14.5px]
              "
            >
              Um ambiente voltado à aplicação de tecnologias de metrologia,
              inspeção, digitalização e engenharia em desafios reais da
              indústria.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.24,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <Link
                to="/servicos"
                className="
                  group
                  inline-flex
                  h-[46px]
                  items-center
                  gap-3
                  rounded-[12px]
                  border
                  border-[#12364e]/12
                  bg-[#12364e]
                  px-5
                  text-[11px]
                  font-semibold
                  text-white
                  shadow-[0_10px_26px_rgba(7,31,45,0.15)]
                  transition-all
                  duration-300
                  hover:-translate-y-[1px]
                  hover:bg-[#173f57]
                "
              >
                Conheça nossos serviços

                <ArrowRightIcon
                  className="
                    h-3.5
                    w-3.5
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              <Link
                to="/equipamentos"
                className="
                  group
                  inline-flex
                  h-[46px]
                  items-center
                  gap-3
                  rounded-[12px]
                  border
                  border-white/80
                  bg-white/52
                  px-5
                  text-[11px]
                  font-semibold
                  text-[#12364e]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_8px_22px_rgba(7,31,45,0.05)]
                  backdrop-blur-[20px]
                  transition-all
                  duration-300
                  hover:bg-white/80
                "
              >
                Ver equipamentos
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 38,
              scale: 0.975,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              delay: 0.06,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              min-h-[420px]
              lg:min-h-[495px]
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                -inset-12
                -z-10
                rounded-[60px]
                bg-[radial-gradient(circle_at_55%_45%,rgba(49,91,117,0.14)_0%,rgba(101,184,238,0.06)_42%,transparent_72%)]
                blur-[55px]
              "
            />

            <div
              className="
                absolute
                inset-0
                overflow-hidden
                rounded-[26px]
                bg-[#071f2d]
                shadow-[0_28px_80px_rgba(7,31,45,0.16)]
              "
            >
              <motion.img
                style={{
                  y: imageY,
                }}
                src="/images/home/centro-foto.jpeg"
                alt="Centro de Excelência em Metrologia"
                className="
                  absolute
                  -left-[2%]
                  -top-[7%]
                  h-[114%]
                  w-[104%]
                  max-w-none
                  object-cover
                  object-[center_42%]
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(180deg,rgba(7,31,45,0)_0%,rgba(7,31,45,0.015)_47%,rgba(7,31,45,0.56)_100%)]
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_82%_18%,rgba(101,184,238,0.10)_0%,transparent_42%)]
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  flex
                  items-end
                  justify-between
                  gap-6
                  p-7
                  sm:p-8
                "
              >
                <div>
                  <div
                    className="
                      mb-3
                      h-[2px]
                      w-10
                      rounded-full
                      bg-[#65b8ee]
                    "
                  />

                  <p
                    className="
                      max-w-[320px]
                      text-[18px]
                      font-medium
                      leading-[1.12]
                      tracking-[-0.025em]
                      text-white
                      sm:text-[21px]
                    "
                  >
                    Tecnologia, conhecimento e aplicação industrial.
                  </p>
                </div>

                <span
                  className="
                    hidden
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-white/52
                    sm:block
                  "
                >
                  SENAI · ZEISS
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
/* =========================================================
   ORIGEM E PROPÓSITO
========================================================= */

function PurposeSection() {
  return (
    <section
      className="
        relative
        pb-8
        pt-3
        sm:pb-9
        sm:pt-5
        lg:pb-10
        lg:pt-6
      "
    >
      <Container>
        <div
          className="
            grid
            gap-10
            lg:grid-cols-[0.78fr_1.22fr]
            lg:gap-20
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 26,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.3,
            }}
            transition={{
              duration: 0.72,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.21em]
                text-[#315b75]
              "
            >
              Origem e propósito
            </p>

            <h2
              className="
                mt-4
                max-w-[470px]
                text-[2.3rem]
                font-semibold
                leading-[1.02]
                tracking-[-0.045em]
                text-[#071f2d]
                sm:text-[2.85rem]
              "
            >
              Aproximar tecnologia

              <span className="block text-[#315b75]">
                dos desafios reais.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 26,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.3,
            }}
            transition={{
              delay: 0.08,
              duration: 0.72,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              max-w-[710px]
              lg:pt-1
            "
          >
            <p
              className="
                text-[14.5px]
                font-medium
                leading-[1.9]
                text-[#49697c]
              "
            >
              O Centro de Excelência em Metrologia reúne infraestrutura,
              tecnologias e conhecimento técnico voltados à aplicação da
              metrologia em diferentes necessidades da indústria.
            </p>

            <p
              className="
                mt-4
                text-[14.5px]
                leading-[1.9]
                text-[#657d8c]
              "
            >
              Mais do que concentrar equipamentos, o espaço busca conectar
              diferentes recursos de medição, inspeção e análise a problemas
              concretos, permitindo que cada demanda seja estudada de acordo
              com suas características e objetivos.
            </p>

            <div
              className="
                mt-7
                grid
                gap-3
                sm:grid-cols-3
              "
            >
              <PurposeItem number="01" label="Tecnologia" />
              <PurposeItem number="02" label="Conhecimento" />
              <PurposeItem number="03" label="Aplicação" />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function PurposeItem({ number, label }) {
  return (
    <div
      className="
        rounded-[16px]
        border
        border-white/72
        bg-white/44
        px-5
        py-5
        shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_24px_rgba(7,31,45,0.04)]
        backdrop-blur-[18px]
      "
    >
      <span
        className="
          text-[9px]
          font-semibold
          tracking-[0.15em]
          text-[#7190a2]
        "
      >
        {number}
      </span>

      <p
        className="
          mt-5
          text-[13px]
          font-semibold
          text-[#12364e]
        "
      >
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   MEMÓRIA / CITAÇÃO
========================================================= */

function LegacySection() {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        py-[82px]
        sm:py-[94px]
        lg:py-[106px]
      "
    >
      {/* ===================================================
          FUNDO PRINCIPAL

          A seção permanece branca no início,
          entra gradualmente no azul,
          concentra o navy no centro,
          volta gradualmente ao azul claro
          e termina novamente em branco puro.
      ==================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-30
          bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_8%,#ffffff_13%,#fbfcfd_16%,#f4f8fa_20%,#e8f1f5_25%,#d6e5ec_30%,#bed4de_35%,#9db9c7_40%,#789bac_45%,#567d91_50%,#38647a_54%,#214d64_58%,#12394f_62%,#0a2d42_65%,#08293e_68%,#0a2d42_71%,#12394f_74%,#214d64_78%,#38647a_82%,#567d91_85%,#789bac_88%,#9db9c7_91%,#bed4de_94%,#d6e5ec_96%,#e8f1f5_97.5%,#f4f8fa_98.5%,#fbfcfd_99%,#ffffff_100%)]
        "
      />

      {/* ===================================================
          PROFUNDIDADE CENTRAL

          Restrita ao miolo para não contaminar
          as extremidades brancas.
      ==================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[67%]
          -z-20
          h-[330px]
          w-[82%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-[50%]
          bg-[#071f2d]/16
          blur-[105px]
        "
      />

      {/* AZUL LATERAL ESQUERDO */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-[190px]
          top-[43%]
          -z-20
          h-[360px]
          w-[360px]
          rounded-full
          bg-[#315b75]/7
          blur-[110px]
        "
      />

      {/* AZUL LATERAL DIREITO */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-[190px]
          top-[43%]
          -z-20
          h-[360px]
          w-[360px]
          rounded-full
          bg-[#65b8ee]/7
          blur-[110px]
        "
      />

      {/* ===================================================
          FAIXA BRANCA SUPERIOR

          Mantém a extremidade superior realmente branca.
          O fade só começa depois.
      ==================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          -z-10
          h-[20%]
          bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_48%,rgba(255,255,255,0.98)_62%,rgba(255,255,255,0.82)_75%,rgba(255,255,255,0.42)_88%,rgba(255,255,255,0)_100%)]
        "
      />

      {/* ===================================================
          FAIXA BRANCA INFERIOR

          A seção volta completamente ao branco antes
          de encontrar a seção seguinte.
      ==================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          -z-10
          h-[20%]
          bg-[linear-gradient(0deg,#ffffff_0%,#ffffff_48%,rgba(255,255,255,0.98)_62%,rgba(255,255,255,0.82)_75%,rgba(255,255,255,0.42)_88%,rgba(255,255,255,0)_100%)]
        "
      />

      <Container>
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.992,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: false,
            amount: 0.26,
          }}
          transition={{
            duration: 0.82,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-white/26
            bg-[linear-gradient(112deg,rgba(7,31,45,0.73)_0%,rgba(10,43,60,0.67)_38%,rgba(14,55,75,0.62)_68%,rgba(21,73,99,0.58)_100%)]
            px-7
            py-10
            shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_28px_68px_rgba(7,31,45,0.20)]
            backdrop-blur-[30px]
            backdrop-saturate-[145%]
            sm:px-10
            sm:py-11
            lg:px-14
            lg:py-12
          "
        >
          {/* REFLEXO SUPERIOR DO VIDRO */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-[4%]
              right-[4%]
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/48
              to-transparent
            "
          />

          {/* BRILHO INTERNO DIREITO */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-[120px]
              -top-[150px]
              h-[350px]
              w-[350px]
              rounded-full
              bg-[#65b8ee]/13
              blur-[100px]
            "
          />

          {/* PROFUNDIDADE INTERNA ESQUERDA */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -bottom-[180px]
              -left-[100px]
              h-[350px]
              w-[350px]
              rounded-full
              bg-[#071f2d]/24
              blur-[100px]
            "
          />

          <div
            className="
              relative
              z-10
              grid
              gap-10
              lg:grid-cols-[0.78fr_1.22fr]
              lg:items-center
              lg:gap-16
            "
          >
            {/* LADO ESQUERDO */}

            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.21em]
                  text-[#bfe2f2]
                "
              >
                Memória do Centro
              </p>

              <h2
                className="
                  mt-4
                  max-w-[455px]
                  text-[2.2rem]
                  font-semibold
                  leading-[1.04]
                  tracking-[-0.043em]
                  text-white
                  drop-shadow-[0_2px_18px_rgba(0,0,0,0.20)]
                  sm:text-[2.65rem]
                "
              >
                Uma história

                <span className="block">
                  contada por quem
                </span>

                <span className="block text-[#b8ddef]">
                  esteve no início.
                </span>
              </h2>
            </div>

            {/* LADO DIREITO / CITAÇÃO */}

            <div
              className="
                relative
                border-l
                border-white/28
                pl-7
                sm:pl-9
              "
            >
              <span
                aria-hidden="true"
                className="
                  absolute
                  -left-[7px]
                  top-[-8px]
                  text-[74px]
                  font-medium
                  leading-none
                  text-[#b9e3f5]/82
                "
              >
                “
              </span>

              <p
                className="
                  max-w-[690px]
                  text-[18px]
                  font-semibold
                  leading-[1.68]
                  tracking-[-0.015em]
                  text-white
                  drop-shadow-[0_2px_18px_rgba(0,0,0,0.30)]
                  sm:text-[20px]
                "
              >
                O Centro de Excelência em Metrologia nasceu para criar uma cultura de medição e precisão na região de Goiás e Centro-Oeste. Eu havia percebido que, nessa área de metrologia, mecânica e metalmecânica de precisão, nós éramos muito carentes.

                A ideia de colocar em uma faculdade, onde temos cursos de Engenharia Mecânica e outros cursos de engenharia, foi para criar um conceito desde a parte de educação: ensinar para estudantes, docentes e industriários o que nós temos de melhor para medir componentes de precisão.

                Para isso, buscamos a melhor empresa parceira, que foi a Carl Zeiss. Não era apenas uma compra de tecnologia, mas principalmente que nós aprendamos com eles.

                Então, ele tem vários objetivos principais: criar uma cultura de metrologia dimensional de precisão na região, ofertar serviços de alto nível e capacitar nossos estudantes, docentes e profissionais.
              </p>

              <div
                className="
                  mt-5
                  h-px
                  w-11
                  bg-[#9fd3ec]/85
                "
              />

              <p
                className="
                  mt-4
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.17em]
                  text-[#e2f4fc]/85
                "
              >
                - Rolando Vargas Vallejos - Precursor do Centro de Excelência SENAI ZEISS
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
/* =========================================================
   CONTINUIDADE
========================================================= */

function ContinuitySection() {
  return (
    <section
      className="
        relative
        pb-10
        pt-7
        sm:pb-12
        sm:pt-8
        lg:pb-14
        lg:pt-10
      "
    >
      <Container>
        <div
          className="
            grid
            items-center
            gap-10
            lg:grid-cols-[1.08fr_0.92fr]
            lg:gap-16
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              x: -28,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: false,
              amount: 0.3,
            }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.21em]
                text-[#315b75]
              "
            >
              Continuidade
            </p>

            <h2
              className="
                mt-4
                max-w-[620px]
                text-[2.3rem]
                font-semibold
                leading-[1.02]
                tracking-[-0.045em]
                text-[#071f2d]
                sm:text-[2.85rem]
              "
            >
              As pessoas evoluem.

              <span className="block text-[#315b75]">
                O conhecimento permanece.
              </span>
            </h2>

            <p
              className="
                mt-6
                max-w-[650px]
                text-[14px]
                leading-[1.88]
                text-[#5a7586]
              "
            >
              A composição do Centro pode evoluir ao longo do tempo. Ao mesmo
              tempo, o conhecimento técnico e as experiências desenvolvidas em
              suas atividades contribuem para a continuidade do trabalho e
              para a incorporação de novos aprendizados.
            </p>

            <p
              className="
                mt-4
                max-w-[650px]
                text-[14px]
                leading-[1.88]
                text-[#5a7586]
              "
            >
              Dessa forma, diferentes experiências podem se somar ao ambiente,
              mantendo o foco na aplicação da tecnologia e no desenvolvimento
              técnico.
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 28,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: false,
              amount: 0.3,
            }}
            transition={{
              delay: 0.08,
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-white/80
              bg-white/54
              p-7
              shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_18px_50px_rgba(7,31,45,0.06)]
              backdrop-blur-[22px]
              sm:p-8
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                -right-16
                -top-16
                h-[190px]
                w-[190px]
                rounded-full
                bg-[#65b8ee]/10
                blur-[55px]
              "
            />

            <ContinuityItem
              number="01"
              title="Experiência"
              description="As atividades realizadas contribuem para ampliar a experiência técnica construída dentro do Centro."
            />

            <ContinuityDivider />

            <ContinuityItem
              number="02"
              title="Conhecimento"
              description="O contato com diferentes desafios permite incorporar novos aprendizados ao ambiente."
            />

            <ContinuityDivider />

            <ContinuityItem
              number="03"
              title="Evolução"
              description="Novas pessoas, tecnologias e aplicações podem ampliar continuamente as possibilidades de atuação."
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function ContinuityItem({
  number,
  title,
  description,
}) {
  return (
    <div className="relative flex gap-5">
      <span
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-[#315b75]/12
          bg-[#eef4f7]/86
          text-[9px]
          font-semibold
          text-[#315b75]
        "
      >
        {number}
      </span>

      <div>
        <h3
          className="
            text-[15px]
            font-semibold
            text-[#12364e]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1.5
            max-w-[420px]
            text-[12.5px]
            leading-[1.7]
            text-[#647d8c]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function ContinuityDivider() {
  return (
    <div
      className="
        my-5
        ml-[18px]
        h-7
        w-px
        bg-gradient-to-b
        from-[#315b75]/20
        to-transparent
      "
    />
  );
}

/* =========================================================
   ESTRUTURA TECNOLÓGICA
========================================================= */

function CapabilitiesSection() {
  return (
    <section
      className="
        relative
        pb-14
        pt-3
        sm:pb-16
        sm:pt-5
        lg:pb-[72px]
        lg:pt-6
      "
    >
      <Container>
        <motion.div
          initial={{
            opacity: 0,
            y: 26,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.3,
          }}
          transition={{
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            flex
            flex-col
            justify-between
            gap-6
            lg:flex-row
            lg:items-end
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.21em]
                text-[#315b75]
              "
            >
              Estrutura tecnológica
            </p>

            <h2
              className="
                mt-4
                max-w-[660px]
                text-[2.3rem]
                font-semibold
                leading-[1.02]
                tracking-[-0.045em]
                text-[#071f2d]
                sm:text-[2.85rem]
              "
            >
              Diferentes tecnologias,

              <span className="block text-[#315b75]">
                uma estrutura integrada.
              </span>
            </h2>
          </div>

          <Link
            to="/equipamentos"
            className="
              group
              inline-flex
              items-center
              gap-3
              text-[11px]
              font-semibold
              text-[#12364e]
            "
          >
            Conheça os equipamentos

            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-[#12364e]/12
                bg-white/52
                shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]
                backdrop-blur-[16px]
                transition-all
                duration-300
                group-hover:translate-x-1
                group-hover:bg-white/82
              "
            >
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
          </Link>
        </motion.div>

        <div
          className="
            mt-8
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {capabilities.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{
                opacity: 0,
                y: 26,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: false,
                amount: 0.25,
              }}
              transition={{
                delay: index * 0.07,
                duration: 0.68,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-[20px]
                border
                border-white/74
                bg-white/46
                p-6
                shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_28px_rgba(7,31,45,0.04)]
                backdrop-blur-[20px]
                transition-all
                duration-500
                hover:-translate-y-[3px]
                hover:border-white
                hover:bg-white/68
                hover:shadow-[0_20px_48px_rgba(7,31,45,0.08)]
              "
            >
              <div
                aria-hidden="true"
                className="
                  absolute
                  -right-14
                  -top-14
                  h-[150px]
                  w-[150px]
                  rounded-full
                  bg-[#65b8ee]/0
                  blur-[45px]
                  transition-all
                  duration-500
                  group-hover:bg-[#65b8ee]/11
                "
              />

              <span
                className="
                  text-[9px]
                  font-semibold
                  tracking-[0.16em]
                  text-[#6d8797]
                "
              >
                {item.number}
              </span>

              <h3
                className="
                  mt-10
                  text-[17px]
                  font-semibold
                  tracking-[-0.025em]
                  text-[#12364e]
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  mt-3
                  text-[12.5px]
                  leading-[1.75]
                  text-[#667f8e]
                "
              >
                {item.description}
              </p>

              <div
                className="
                  mt-6
                  h-px
                  bg-[#12364e]/8
                "
              />

              <div
                className="
                  mt-3
                  h-[2px]
                  w-8
                  rounded-full
                  bg-[#65b8ee]
                  transition-all
                  duration-500
                  group-hover:w-full
                "
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
/* =========================================================
   FLUXO DE ATUAÇÃO
========================================================= */

function WorkflowSection() {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        pb-16
        pt-10
        sm:pb-[72px]
        sm:pt-12
        lg:pb-20
        lg:pt-14
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          bg-[linear-gradient(180deg,#ffffff_0%,#f8fafb_10%,#eef4f7_40%,#e5eff4_68%,#d8e7ee_100%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-[220px]
          bottom-[-190px]
          -z-10
          h-[470px]
          w-[470px]
          rounded-full
          bg-[#65b8ee]/8
          blur-[135px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-[260px]
          top-[50px]
          -z-10
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#315b75]/6
          blur-[145px]
        "
      />

      <Container>
        <motion.div
          initial={{
            opacity: 0,
            y: 26,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.3,
          }}
          transition={{
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-[690px]"
        >
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.21em]
              text-[#315b75]
            "
          >
            Da necessidade ao resultado
          </p>

          <h2
            className="
              mt-4
              text-[2.3rem]
              font-semibold
              leading-[1.02]
              tracking-[-0.045em]
              text-[#071f2d]
              sm:text-[2.85rem]
            "
          >
            Tecnologia começa

            <span className="block text-[#315b75]">
              entendendo o desafio.
            </span>
          </h2>
        </motion.div>

        <div
          className="
            relative
            mt-9
            grid
            gap-3
            md:grid-cols-5
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              left-[8%]
              right-[8%]
              top-[26px]
              hidden
              h-px
              bg-[#315b75]/16
              md:block
            "
          />

          {workflow.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{
                opacity: 0,
                y: 26,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: false,
                amount: 0.3,
              }}
              transition={{
                delay: index * 0.08,
                duration: 0.68,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                z-10
                rounded-[18px]
                border
                border-white/82
                bg-white/56
                p-5
                shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_10px_28px_rgba(7,31,45,0.05)]
                backdrop-blur-[22px]
                transition-all
                duration-300
                hover:-translate-y-[3px]
                hover:bg-white/72
                hover:shadow-[0_18px_42px_rgba(7,31,45,0.08)]
              "
            >
              <span
                className="
                  flex
                  h-[52px]
                  w-[52px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white
                  bg-[#12364e]
                  text-[9px]
                  font-semibold
                  tracking-[0.12em]
                  text-white
                  shadow-[0_8px_22px_rgba(7,31,45,0.14)]
                "
              >
                {item.number}
              </span>

              <h3
                className="
                  mt-7
                  text-[15px]
                  font-semibold
                  text-[#12364e]
                "
              >
                {item.label}
              </h3>

              <p
                className="
                  mt-2
                  text-[11.5px]
                  leading-[1.7]
                  text-[#667f8e]
                "
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   CTA FINAL
========================================================= */

function FinalCta() {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        bg-[#071f2d]
        py-14
        sm:py-16
        lg:py-[78px]
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-[220px]
          -top-[260px]
          -z-10
          h-[560px]
          w-[560px]
          rounded-full
          bg-[#315b75]/22
          blur-[150px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-[250px]
          -right-[180px]
          -z-10
          h-[540px]
          w-[540px]
          rounded-full
          bg-[#65b8ee]/10
          blur-[150px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[10%]
          right-[10%]
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/22
          to-transparent
        "
      />

      <Container>
        <motion.div
          initial={{
            opacity: 0,
            y: 26,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.3,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            flex
            flex-col
            justify-between
            gap-10
            lg:flex-row
            lg:items-center
          "
        >
          <div className="max-w-[670px]">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.21em]
                text-[#9ccce8]
              "
            >
              Fale com o Centro
            </p>

            <h2
              className="
                mt-4
                max-w-[650px]
                text-[2.4rem]
                font-semibold
                leading-[1.02]
                tracking-[-0.045em]
                text-white
                sm:text-[3rem]
              "
            >
              Tem um desafio

              <span className="block text-[#a7d4eb]">
                para o laboratório?
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-[610px]
                text-[14px]
                leading-[1.8]
                text-white/62
              "
            >
              Escolha o caminho que melhor representa sua necessidade e envie
              as informações para análise.
            </p>
          </div>

          <div
            className="
              flex
              w-full
              flex-col
              gap-4
              lg:w-[410px]
            "
          >
            <Link
              to="/orcamento"
              className="
                group
                flex
                h-[66px]
                w-full
                items-center
                justify-between
                rounded-[16px]
                border
                border-white/28
                bg-white/[0.09]
                px-6
                text-[13px]
                font-semibold
                text-white
                shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_30px_rgba(0,0,0,0.08)]
                backdrop-blur-[22px]
                backdrop-saturate-[135%]
                transition-all
                duration-300
                hover:-translate-y-[2px]
                hover:border-white/38
                hover:bg-white/[0.14]
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_38px_rgba(0,0,0,0.12)]
              "
            >
              <span>
                Solicitar orçamento
              </span>

              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/18
                  bg-white/[0.08]
                  transition-all
                  duration-300
                  group-hover:bg-white/[0.14]
                "
              >
                <ArrowRightIcon
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </span>
            </Link>

            <Link
              to="/configurador"
              className="
                group
                flex
                h-[66px]
                w-full
                items-center
                justify-between
                rounded-[16px]
                border
                border-white/28
                bg-white/[0.09]
                px-6
                text-[13px]
                font-semibold
                text-white
                shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_30px_rgba(0,0,0,0.08)]
                backdrop-blur-[22px]
                backdrop-saturate-[135%]
                transition-all
                duration-300
                hover:-translate-y-[2px]
                hover:border-white/38
                hover:bg-white/[0.14]
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_38px_rgba(0,0,0,0.12)]
              "
            >
              <span>
                Configurar solução
              </span>

              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/18
                  bg-white/[0.08]
                  transition-all
                  duration-300
                  group-hover:bg-white/[0.14]
                "
              >
                <ArrowRightIcon
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </span>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}