import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../layout/Container";
import { ArrowRightIcon } from "../ui/ArrowIcons";

const paths = [
  {
    number: "01",
    label: "Já sei o que preciso",
    title: "Solicitar orçamento",
    description:
      "Envie as principais informações do seu projeto para nossa equipe analisar sua necessidade.",
    href: "/orcamento",
    type: "direct",
  },
  {
    number: "02",
    label: "Preciso de orientação",
    title: "Configurar minha solução",
    description:
      "Responda algumas perguntas e identifique os serviços e tecnologias mais adequados ao seu desafio.",
    href: "/configurador",
    type: "guided",
  },
];

export function SolutionsPreview() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.82, 1],
    [28, 0, 0, -24],
  );

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.88, 1],
    [0, 1, 1, 0.45],
  );

  const backgroundGlowY = useTransform(
    scrollYProgress,
    [0, 1],
    [16, -22],
  );

  return (
    <section
      ref={sectionRef}
      id="solucoes"
      className="
        relative
        isolate
        scroll-mt-20
        overflow-hidden
        bg-white
      "
    >
      {/* FUNDO PRINCIPAL */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          overflow-hidden
        "
      >
        {/* BRANCO → AZUL → NAVY
            o azul e o navy começam mais cedo */}
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfc_8%,#edf4f7_16%,#d7e7ee_24%,#bad3df_32%,#91b3c4_41%,#668fa5_50%,#44728a_59%,#2c5b73_67%,#1e4961_74%,#143b52_80%,#0f3045_86%,#0b293c_92%,#071f2d_100%)]
          "
        />

        {/* LUZ CENTRAL SUAVE */}
        <motion.div
          style={{ y: backgroundGlowY }}
          className="
            absolute
            left-1/2
            top-[20%]
            h-[270px]
            w-[74%]
            -translate-x-1/2
            rounded-[50%]
            bg-white/30
            blur-[115px]
          "
        />

        {/* PROFUNDIDADE AZUL ESQUERDA */}
        <div
          className="
            absolute
            -left-[300px]
            bottom-[3%]
            h-[470px]
            w-[470px]
            rounded-full
            bg-[#0057b8]/8
            blur-[150px]
          "
        />

        {/* PROFUNDIDADE AZUL DIREITA */}
        <div
          className="
            absolute
            -right-[290px]
            bottom-[4%]
            h-[470px]
            w-[470px]
            rounded-full
            bg-[#65b8ee]/7
            blur-[150px]
          "
        />

        {/* ARCO TÉCNICO */}
        <div
          className="
            absolute
            -bottom-[300px]
            -left-[120px]
            h-[520px]
            w-[720px]
            rounded-[50%]
            border
            border-white/[0.10]
          "
        />

        {/* REFLEXO SUPERIOR */}
        <div
          className="
            absolute
            left-[8%]
            right-[8%]
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white
            to-transparent
          "
        />
      </div>

      <motion.div
        style={{
          y: sectionY,
          opacity: sectionOpacity,
        }}
        className="
          pb-[30px]
          pt-14
          sm:pb-[34px]
          sm:pt-16
          lg:pb-[36px]
          lg:pt-[68px]
        "
      >
        <Container>
          <div
            className="
              grid
              gap-9
              lg:grid-cols-[0.76fr_1.24fr]
              lg:items-center
              lg:gap-16
            "
          >
            {/* TEXTO */}
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
                amount: 0.35,
              }}
              transition={{
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                max-w-[490px]
                lg:-mt-2
              "
            >
              {/* EYEBROW */}
              <div className="flex items-center gap-3">
                <span
                  className="
                    h-[5px]
                    w-[5px]
                    shrink-0
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
                    text-[#356f9f]
                  "
                >
                  Soluções
                </p>

                <div className="h-px w-10 bg-[#356f9f]/35" />
              </div>

              {/* TÍTULO */}
              <h2
                className="
                  mt-4
                  max-w-[490px]
                  text-[2.35rem]
                  font-semibold
                  leading-[1.01]
                  tracking-[-0.047em]
                  text-[#071f2d]
                  sm:text-[2.7rem]
                  lg:text-[2.95rem]
                "
              >
                Como podemos ajudar

                <span className="block text-[#315b75]">
                  no seu projeto?
                </span>
              </h2>

              {/* DESCRIÇÃO */}
              <p
                className="
                  mt-7
                  max-w-[455px]
                  text-[15px]
                  font-bold
                  leading-[1.8]
                  text-white
                  drop-shadow-[0_1px_12px_rgba(7,31,45,0.16)]
                  sm:text-[15px]
                "
              >
                Se você já conhece sua necessidade, envie os dados para nossa
                equipe. Se ainda está definindo a solução, nosso configurador
                pode orientar o processo.
              </p>

              {/* ASSINATURA */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: false,
                  amount: 0.4,
                }}
                transition={{
                  delay: 0.14,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-8
                  flex
                  items-center
                  gap-4
                "
              >
                <div className="h-px w-16 bg-white/35" />

                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.19em]
                    text-white/90
                  "
                >
                  Do desafio à solução
                </p>
              </motion.div>
            </motion.div>

            {/* CARDS */}
            <div className="flex flex-col gap-3">
              {paths.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{
                    opacity: 0,
                    x: 34,
                    y: 16,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                  }}
                  viewport={{
                    once: false,
                    amount: 0.28,
                  }}
                  transition={{
                    delay: 0.08 + index * 0.1,
                    duration: 0.72,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <SolutionCard item={item} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* FECHAMENTO DIREITO */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
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
              delay: 0.18,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mt-5
              hidden
              justify-end
              lg:flex
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-white/52
              "
            >
              <span>Metrologia</span>

              <span className="h-[3px] w-[3px] rounded-full bg-white/34" />

              <span>Engenharia</span>

              <span className="h-[3px] w-[3px] rounded-full bg-white/34" />

              <span>Tecnologia</span>
            </div>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}

function SolutionCard({ item }) {
  return (
    <Link
      to={item.href}
      className="
        group
        relative
        isolate
        block
        overflow-hidden
        rounded-[20px]
        border
        border-white/65
        bg-[linear-gradient(112deg,rgba(255,255,255,0.90)_0%,rgba(241,247,250,0.81)_47%,rgba(207,227,238,0.75)_100%)]
        px-5
        py-5
        shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_16px_38px_rgba(7,31,45,0.09)]
        backdrop-blur-[28px]
        backdrop-saturate-[150%]
        transition-all
        duration-500
        hover:-translate-y-[3px]
        hover:border-white/90
        hover:bg-[linear-gradient(112deg,rgba(255,255,255,0.96)_0%,rgba(237,246,250,0.89)_47%,rgba(192,220,235,0.83)_100%)]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_22px_50px_rgba(7,31,45,0.14)]
        sm:px-7
        sm:py-5
      "
    >
      {/* REFLEXO */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[7%]
          right-[7%]
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white
          to-transparent
        "
      />

      {/* PROFUNDIDADE */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-[80px]
          top-[-90px]
          -z-10
          h-[200px]
          w-[200px]
          rounded-full
          bg-white/30
          blur-[65px]
        "
      />

      {/* GLOW */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-[90px]
          -top-[90px]
          -z-10
          h-[220px]
          w-[220px]
          rounded-full
          bg-[#65b8ee]/4
          blur-[65px]
          transition-all
          duration-500
          group-hover:bg-[#65b8ee]/16
        "
      />

      {/* BARRA LATERAL */}
      <div
        aria-hidden="true"
        className="
          absolute
          bottom-[16%]
          left-0
          top-[16%]
          w-[2px]
          rounded-full
          bg-[#65b8ee]/0
          transition-all
          duration-500
          group-hover:bg-[#65b8ee]/65
        "
      />

      <div
        className="
          grid
          grid-cols-[auto_1fr_auto]
          items-center
          gap-4
          sm:gap-5
        "
      >
        {/* NÚMERO */}
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#356f9f]/14
            bg-white/64
            text-[11px]
            font-semibold
            tracking-[0.08em]
            text-[#356f9f]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]
            backdrop-blur-[16px]
            transition-all
            duration-300
            group-hover:border-[#356f9f]/24
            group-hover:bg-white/82
          "
        >
          {item.number}
        </div>

        {/* TEXTO */}
        <div
          className="
            min-w-0
            transition-transform
            duration-500
            group-hover:translate-x-[2px]
          "
        >
          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#5687ad]
              sm:text-[11px]
            "
          >
            {item.label}
          </p>

          <h3
            className="
              mt-1
              text-[1.15rem]
              font-semibold
              leading-tight
              tracking-[-0.025em]
              text-[#0b2340]
              sm:text-[1.35rem]
            "
          >
            {item.title}
          </h3>

          <p
            className="
              mt-1.5
              hidden
              max-w-[540px]
              text-[13px]
              leading-5
              text-[#667887]
              sm:block
            "
          >
            {item.description}
          </p>
        </div>

        {/* SETA */}
        <span
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border
            border-[#356f9f]/16
            bg-white/64
            text-[#12364e]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_5px_14px_rgba(7,31,45,0.04)]
            backdrop-blur-[16px]
            transition-all
            duration-300
            group-hover:translate-x-[2px]
            group-hover:border-[#0b2340]
            group-hover:bg-[#0b2340]
            group-hover:text-white
            group-hover:shadow-[0_8px_20px_rgba(7,31,45,0.20)]
            sm:h-11
            sm:w-11
          "
        >
          <ArrowRightIcon
            className="
              h-4
              w-4
              transition-transform
              duration-300
              group-hover:translate-x-[2px]
            "
          />
        </span>
      </div>

      {/* CAMINHO */}
      <div className="mt-4 flex items-center gap-3">
        <div
          className="
            relative
            h-px
            flex-1
            overflow-visible
            bg-[#cbdce6]
          "
        >
          <div
            className="
              absolute
              inset-y-0
              left-0
              w-[12%]
              bg-[#5fa9df]
              transition-all
              duration-700
              ease-out
              group-hover:w-full
            "
          />

          {item.type === "guided" && (
            <>
              <span
                className="
                  absolute
                  left-[33%]
                  top-1/2
                  h-[4px]
                  w-[4px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#5fa9df]
                  opacity-70
                  transition-all
                  duration-500
                  group-hover:scale-[1.45]
                  group-hover:opacity-100
                "
              />

              <span
                className="
                  absolute
                  left-[66%]
                  top-1/2
                  h-[4px]
                  w-[4px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#5fa9df]
                  opacity-70
                  transition-all
                  duration-500
                  group-hover:scale-[1.45]
                  group-hover:opacity-100
                "
              />
            </>
          )}
        </div>
      </div>
    </Link>
  );
}