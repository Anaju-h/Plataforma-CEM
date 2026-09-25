import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../layout/Container";

export function HeroSection() {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        bg-transparent
        pb-8
        pt-3
        sm:pb-9
        sm:pt-4
        lg:pb-10
        lg:pt-5
      "
    >
      {/* PROFUNDIDADE LOCAL — SEM CRIAR FAIXA HORIZONTAL */}
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
        <div
          className="
            absolute
            -left-[250px]
            top-[-220px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-white/35
            blur-[135px]
          "
        />

        <div
          className="
            absolute
            -right-[280px]
            top-[-180px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-white/24
            blur-[145px]
          "
        />
      </div>

      <Container>
        <div
          className="
            relative
            isolate
            overflow-hidden
            rounded-[24px]
            border
            border-[#9eb1bd]/26
            bg-white/46
            shadow-[0_20px_56px_rgba(7,31,45,0.085)]
            backdrop-blur-[22px]
          "
        >
          {/* GLASS */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              -z-10
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-[linear-gradient(110deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.26)_43%,rgba(255,255,255,0.12)_100%)]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_2%_55%,rgba(18,54,78,0.08)_0%,transparent_42%)]
              "
            />

            <div
              className="
                absolute
                left-[12%]
                right-[12%]
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-white
                to-transparent
              "
            />
          </div>

          <div className="grid lg:grid-cols-[0.94fr_1.06fr]">
            {/* CONTEÚDO */}
            <div
              className="
                relative
                z-10
                flex
                flex-col
                justify-center
                px-7
                py-7
                sm:px-9
                sm:py-8
                lg:min-h-[420px]
                lg:px-10
                lg:py-8
                xl:px-11
              "
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-3"
              >
                <span
                  className="
                    h-[6px]
                    w-[6px]
                    shrink-0
                    rounded-full
                    bg-[#0057b8]
                    shadow-[0_0_0_5px_rgba(0,87,184,0.07)]
                  "
                />

                <p
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#315b75]
                    sm:text-[11px]
                  "
                >
                  Centro de Excelência em Metrologia
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.07,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-4
                  max-w-[540px]
                  text-[2.35rem]
                  font-semibold
                  leading-[0.99]
                  tracking-[-0.05em]
                  text-[#071f2d]
                  sm:text-[3rem]
                  lg:text-[3.2rem]
                  xl:text-[3.45rem]
                "
              >
                Precisão para transformar

                <span className="block text-[#315b75]">
                  desafios em soluções.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.14,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-4
                  max-w-[490px]
                  text-[14px]
                  leading-6
                  text-[#526d7f]
                  sm:text-[15px]
                "
              >
                Tecnologia, metrologia e engenharia aplicadas às necessidades da
                indústria, conectando medição, análise e conhecimento técnico.
              </motion.p>

              {/* BOTÕES */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.22,
                  duration: 0.62,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-6
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <HeroButton
                  to="/orcamento"
                  label="Solicitar uma análise"
                />

                <HeroButton
                  to="/configurador"
                  label="Configurar solução"
                />
              </motion.div>

              {/* CAPACIDADES */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.32,
                  duration: 0.6,
                }}
                className="
                  mt-6
                  grid
                  max-w-[490px]
                  grid-cols-1
                  gap-3
                  border-t
                  border-[#12364e]/10
                  pt-3
                  sm:grid-cols-3
                  sm:gap-4
                "
              >
                <HeroCapability
                  number="01"
                  label="Metrologia dimensional"
                />

                <HeroCapability
                  number="02"
                  label="Digitalização 3D"
                />

                <HeroCapability
                  number="03"
                  label="Engenharia reversa"
                />
              </motion.div>
            </div>

            {/* IMAGEM */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.08,
                duration: 0.82,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                min-h-[310px]
                overflow-hidden
                border-t
                border-white/55
                lg:min-h-[420px]
                lg:border-l
                lg:border-t-0
              "
            >
              <motion.img
                src="/images/home/hero-duramax.jpeg"
                alt="DuraMax realizando a medição de uma peça no Centro de Excelência em Metrologia"
                initial={{ scale: 1.035 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 1.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  object-center
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(90deg,rgba(7,31,45,0.16)_0%,rgba(7,31,45,0.02)_30%,transparent_100%)]
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(180deg,transparent_50%,rgba(7,31,45,0.05)_70%,rgba(7,31,45,0.62)_100%)]
                "
              />

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.38,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-6
                  sm:p-7
                  lg:p-8
                "
              >
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
                    text-[19px]
                    font-medium
                    leading-[1.05]
                    tracking-[-0.025em]
                    text-white
                    sm:text-[22px]
                  "
                >
                  Medição. Análise.

                  <span className="block text-white/66">
                    Transformação.
                  </span>
                </p>
              </motion.div>

              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-5
                  right-5
                  top-5
                  hidden
                  w-px
                  bg-gradient-to-b
                  from-white/5
                  via-white/40
                  to-white/5
                  lg:block
                "
              />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroButton({ to, label }) {
  return (
    <Link
      to={to}
      className="
        group
        relative
        isolate
        inline-flex
        h-[46px]
        min-w-[178px]
        items-center
        justify-between
        gap-5
        overflow-hidden
        rounded-[12px]
        border
        border-white/75
        bg-[linear-gradient(110deg,rgba(190,213,226,0.68)_0%,rgba(155,194,216,0.58)_48%,rgba(127,174,201,0.62)_100%)]
        px-5
        text-[11px]
        font-semibold
        text-[#12364e]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.70),0_10px_24px_rgba(7,31,45,0.10)]
        backdrop-blur-[22px]
        backdrop-saturate-[145%]
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-white/90
        hover:bg-[linear-gradient(110deg,rgba(208,226,236,0.78)_0%,rgba(170,206,225,0.68)_50%,rgba(141,187,211,0.72)_100%)]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_30px_rgba(7,31,45,0.14)]
      "
    >
      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[8%]
          right-[8%]
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/90
          to-transparent
        "
      />

      <span className="relative z-10">
        {label}
      </span>

      <ArrowRight />
    </Link>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="
        relative
        z-10
        shrink-0
        transition-transform
        duration-300
        group-hover:translate-x-[3px]
      "
    >
      <path
        d="M2.5 7H11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <path
        d="M8.4 4.4L11 7L8.4 9.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroCapability({
  number,
  label,
}) {
  return (
    <div>
      <p
        className="
          text-[11px]
          font-bold
          tracking-[0.14em]
          text-[#76909f]
        "
      >
        {number}
      </p>

      <p
        className="
          mt-1
          text-[11px]
          font-medium
          leading-4
          text-[#345365]
        "
      >
        {label}
      </p>
    </div>
  );
}