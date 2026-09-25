import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../components/layout/Container";
import { ArrowRightIcon } from "../components/ui/ArrowIcons";
import {
  ActivitySection,
  IdentitySection,
  InfrastructureSection,
  PartnersSection,
  TimelineSection,
} from "../components/about/AboutSections";


/*
 * Página Sobre (área institucional do desafio): quem somos, missão, visão e valores,
 * trajetória, memória do Centro, parceiros, infraestrutura + galeria, localização,
 * setores atendidos e capacitação.
 */
export function SobrePage() {
  return (
    <div className="overflow-hidden bg-white">
      {/* HERO + QUEM SOMOS + TRAJETÓRIA */}
      <div className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_7%,#f8fbfc_18%,#eef5f8_42%,#f4f8fa_72%,#ffffff_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-[290px] top-[40px] -z-10 h-[640px] w-[640px] rounded-full bg-[#65b8ee]/10 blur-[155px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-[270px] bottom-[-40px] -z-10 h-[520px] w-[520px] rounded-full bg-[#315b75]/7 blur-[150px]" />
        <AboutHero />
        <IdentitySection />
        <TimelineSection />
      </div>

      {/* MEMÓRIA / CITAÇÃO + PARCEIROS */}
      <LegacySection />
      <PartnersSection />

      {/* INFRAESTRUTURA + GALERIA + LOCALIZAÇÃO */}
      <div className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fafb_12%,#eef4f7_42%,#f5f9fb_70%,#ffffff_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-[310px] top-[120px] -z-10 h-[580px] w-[580px] rounded-full bg-[#65b8ee]/8 blur-[150px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-[300px] bottom-[20px] -z-10 h-[580px] w-[580px] rounded-full bg-[#315b75]/7 blur-[150px]" />
        <InfrastructureSection />
        <LocationSection />
      </div>

      {/* SETORES + CAPACITAÇÃO */}
      <div className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafb_10%,#eef4f7_40%,#e5eff4_68%,#d8e7ee_100%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-[220px] bottom-[-190px] -z-10 h-[470px] w-[470px] rounded-full bg-[#65b8ee]/8 blur-[135px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-[260px] top-[50px] -z-10 h-[500px] w-[500px] rounded-full bg-[#315b75]/6 blur-[145px]" />
        <ActivitySection />
      </div>

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
                  text-[11px]
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
                text-[15px]
                font-medium
                leading-[1.85]
                text-[#527083]
                sm:text-[14.5px]
              "
            >
              O primeiro Centro de Excelência em Metrologia SENAI ZEISS do
              Brasil: medição de precisão, formação e aplicação em desafios
              reais da indústria.
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
                  text-[12px]
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
                  text-[12px]
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
                    text-[11px]
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
   MEMÓRIA / CITAÇÃO
========================================================= */

function LegacySection() {
  // O observador fica na <section> (que não se move); só o card anima.
  // Observar o próprio card com y/scale fazia o limite de visibilidade oscilar e o card piscar.
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const hidden = { opacity: 0, y: 30, scale: 0.992 };
  const shown = { opacity: 1, y: 0, scale: 1 };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pb-[82px] pt-[44px] sm:pb-[94px] sm:pt-[52px] lg:pb-[104px] lg:pt-[60px]"
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
          initial={hidden}
          animate={inView ? shown : hidden}
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
                  text-[11px]
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
                  text-[11px]
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
   LOCALIZAÇÃO
========================================================= */


function LocationSection() {
  const mapsUrl = "https://maps.app.goo.gl/VANnfLem1ExzaLdR8";
  const mapEmbedUrl =
    "https://www.google.com/maps?ll=-16.6556338,-49.2707544&z=16&output=embed";

  return (
    <section
      className="
        relative
        pb-14
        pt-4
        sm:pb-16
        sm:pt-6
        lg:pb-[72px]
        lg:pt-8
      "
    >
      <Container>
        <div
          className="
            grid
            items-stretch
            gap-8
            lg:grid-cols-[1.08fr_0.92fr]
            lg:gap-12
          "
        >
          <motion.a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{
              opacity: 0,
              x: -28,
              scale: 0.985,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: false,
              amount: 0.25,
            }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              group
              relative
              min-h-[360px]
              overflow-hidden
              rounded-[26px]
              border
              border-white/80
              bg-[#dce7ed]
              shadow-[0_22px_58px_rgba(7,31,45,0.10)]
              sm:min-h-[410px]
              lg:min-h-[450px]
            "
            aria-label="Abrir localização do Centro de Excelência em Metrologia no Google Maps"
          >
            <iframe
              src={mapEmbedUrl}
              title="Localização do Centro de Excelência em Metrologia"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="
                pointer-events-none
                absolute
                inset-0
                h-full
                w-full
                border-0
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                ring-1
                ring-inset
                ring-white/45
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-5
                w-5
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border-[4px]
                border-white
                bg-[#0057b8]
                shadow-[0_7px_18px_rgba(7,31,45,0.28),0_0_0_5px_rgba(0,87,184,0.16)]
              "
            />
          </motion.a>

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
              amount: 0.25,
            }}
            transition={{
              delay: 0.08,
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              flex
              flex-col
              justify-center
              lg:pl-2
            "
          >
            <div className="flex items-center gap-3">
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
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.21em]
                  text-[#315b75]
                "
              >
                Onde estamos
              </p>

              <div className="h-px w-10 bg-[#315b75]/24" />
            </div>

            <h2
              className="
                mt-5
                max-w-[520px]
                text-[2.3rem]
                font-semibold
                leading-[1.02]
                tracking-[-0.045em]
                text-[#071f2d]
                sm:text-[2.85rem]
              "
            >
              Em Goiânia,
              <span className="block text-[#315b75]">
                junto à indústria e à formação.
              </span>
            </h2>

            <p
              className="
                mt-6
                max-w-[560px]
                text-[15px]
                font-medium
                leading-[1.88]
                text-[#557284]
              "
            >
              O Centro de Excelência em Metrologia está instalado na Faculdade
              SENAI Ítalo Bologna, em Goiânia. Inaugurado em novembro de 2024,
              foi o primeiro Centro de Excelência em Metrologia SENAI ZEISS do
              Brasil, resultado da parceria entre o SENAI e a Carl Zeiss para
              aproximar metrologia de precisão, qualificação profissional e as
              necessidades da indústria.
            </p>

            <div
              className="
                mt-8
                border-l-2
                border-[#65b8ee]
                pl-5
              "
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#6c8797]
                "
              >
                Centro de Excelência em Metrologia
              </p>

              <p
                className="
                  mt-2
                  max-w-[470px]
                  text-[15px]
                  font-semibold
                  leading-[1.7]
                  text-[#12364e]
                "
              >
                R. Armogaste José da Silveira, 612
                <br />
                St. Centro Oeste, Goiânia - GO
                <br />
                74560-550
              </p>
            </div>

            <p
              className="
                mt-5
                max-w-[500px]
                text-[13px]
                leading-[1.7]
                text-[#78909d]
              "
            >
              Clique no mapa para abrir a localização no Google Maps.
            </p>
          </motion.div>
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
                text-[11px]
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
                text-[15px]
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
                text-[14px]
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
                text-[14px]
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