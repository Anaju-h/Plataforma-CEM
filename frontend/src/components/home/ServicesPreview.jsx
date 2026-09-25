import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../layout/Container";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "../ui/ArrowIcons";

function ServiceIcon({ type }) {
  const commonProps = {
    width: 34,
    height: 34,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (type === "measurement") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path
          d="M12 34L31 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10 30L18 38"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M27 11L35 19"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 37L6 40M38 10L41 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="24"
          cy="24"
          r="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (type === "scan") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path
          d="M16 19L24 14L32 19V29L24 34L16 29V19Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M16 19L24 24L32 19M24 24V34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 16V9H15M33 9H40V16M40 32V39H33M15 39H8V32"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "reverse") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <rect
          x="8"
          y="10"
          width="32"
          height="24"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M18 39H30M24 34V39"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M18 19L24 15L30 19V26L24 30L18 26V19Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M18 19L24 23L30 19M24 23V30"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg {...commonProps} aria-hidden="true">
      <circle
        cx="24"
        cy="22"
        r="12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="24"
        cy="22"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M24 10V34M12 22H36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M15 35L10 40M33 35L38 40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const services = [
  {
    number: "01",
    icon: "measurement",
    title: "Inspeção dimensional",
    description:
      "Medição e análise dimensional para avaliação de peças, geometrias e requisitos técnicos.",
    href: "/servicos#metrologia-inspecao",
  },
  {
    number: "02",
    icon: "scan",
    title: "Digitalização 3D",
    description:
      "Captura precisa da geometria de peças e componentes para análise, documentação e desenvolvimento.",
    href: "/servicos#digitalizacao-3d",
  },
  {
    number: "03",
    icon: "reverse",
    title: "Engenharia reversa",
    description:
      "Transformação de componentes físicos em informações digitais para reconstrução e desenvolvimento CAD.",
    href: "/servicos#engenharia-desenvolvimento",
  },
  {
    number: "04",
    icon: "internal",
    title: "Análise interna",
    description:
      "Tecnologias de inspeção para investigação de características internas e estruturas não acessíveis externamente.",
    href: "/servicos#tomografia-industrial",
  },
];

export function ServicesPreview() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [28, 0, 0, -28],
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.84, 1],
    [0, 1, 1, 0.4],
  );

  const leftGlowY = useTransform(
    scrollYProgress,
    [0, 1],
    [30, -38],
  );

  const rightGlowY = useTransform(
    scrollYProgress,
    [0, 1],
    [-20, 34],
  );

  return (
    <section
      ref={sectionRef}
      className="
        relative
        isolate
        overflow-hidden
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
          bg-[linear-gradient(180deg,#ffffff_0%,#f7fafb_10%,#e9f0f4_20%,#c8d7df_34%,#86a0af_48%,#496b7f_58%,#315b75_64%,#496b7f_72%,#86a0af_80%,#d7e2e8_88%,#f4f7f9_94%,#ffffff_97%,#ffffff_100%)]
        "
      >
        {/* LUZ SUPERIOR */}
        <div
          className="
            absolute
            left-1/2
            top-[-60px]
            h-[230px]
            w-[62%]
            -translate-x-1/2
            rounded-full
            bg-white/70
            blur-[105px]
          "
        />

        {/* PROFUNDIDADE ESQUERDA */}
        <motion.div
          style={{ y: leftGlowY }}
          className="
            absolute
            -left-[240px]
            top-[30%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#0057b8]/10
            blur-[150px]
          "
        />

        {/* PROFUNDIDADE DIREITA */}
        <motion.div
          style={{ y: rightGlowY }}
          className="
            absolute
            -right-[250px]
            top-[34%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#65b8ee]/9
            blur-[150px]
          "
        />

        {/* GLOW CENTRAL */}
        <div
          className="
            absolute
            left-1/2
            top-[44%]
            h-[300px]
            w-[46%]
            -translate-x-1/2
            rounded-full
            bg-[#12364e]/8
            blur-[125px]
          "
        />

        {/* LUZ INFERIOR — MAIS FORTE PARA FECHAR EM BRANCO */}
        <div
          className="
            absolute
            bottom-[-40px]
            left-1/2
            h-[300px]
            w-[85%]
            -translate-x-1/2
            rounded-full
            bg-white/90
            blur-[115px]
          "
        />
      </div>

      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="
          py-[84px]
          sm:py-[90px]
          lg:py-[94px]
        "
      >
        <Container>
          {/* CABEÇALHO */}
          <div
            className="
              grid
              gap-5
              lg:grid-cols-[1.05fr_0.95fr]
              lg:items-end
              lg:gap-14
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 24,
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
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
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
                  O que fazemos
                </p>
              </div>

              <h2
                className="
                  mt-3
                  max-w-[610px]
                  text-[2.25rem]
                  font-semibold
                  leading-[1.02]
                  tracking-[-0.045em]
                  text-[#071f2d]
                  sm:text-[2.7rem]
                  lg:text-[2.85rem]
                "
              >
                Soluções para diferentes

                <span className="block text-[#315b75]">
                  desafios industriais.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 22,
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
                delay: 0.08,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                max-w-[520px]
                lg:justify-self-end
                lg:pb-1
              "
            >
              <p
                className="
                  text-[14px]
                  font-medium
                  leading-[1.75]
                  text-[#345365]
                  sm:text-[15px]
                "
              >
                Aplicamos tecnologias de metrologia, digitalização e engenharia
                reversa para apoiar diferentes etapas de análise, inspeção e
                desenvolvimento.
              </p>
            </motion.div>
          </div>

          {/* LINHA */}
          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scaleX: 1,
            }}
            viewport={{
              once: false,
              amount: 0.4,
            }}
            transition={{
              delay: 0.1,
              duration: 0.72,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mt-7
              flex
              origin-left
              items-center
              gap-3
            "
          >
            <div className="h-px flex-1 bg-[#12364e]/12" />

            <div
              className="
                h-[2px]
                w-10
                rounded-full
                bg-[#315b75]/70
              "
            />
          </motion.div>

          {/* CARDS */}
          <div
            className="
              no-scrollbar
              mt-6
              flex
              snap-x
              snap-mandatory
              gap-3
              overflow-x-auto
              pb-3
              md:grid
              md:grid-cols-2
              md:overflow-visible
              md:pb-0
              xl:grid-cols-4
            "
          >
            {services.map((service, index) => (
              <motion.div
                key={service.number}
                initial={{
                  opacity: 0,
                  y: 34,
                  scale: 0.985,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: false,
                  amount: 0.22,
                }}
                transition={{
                  delay: index * 0.07,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  min-w-[82%]
                  snap-start
                  sm:min-w-[60%]
                  md:min-w-0
                "
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>

          {/* RODAPÉ */}
          <motion.div
            initial={{
              opacity: 0,
              y: 14,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.5,
            }}
            transition={{
              delay: 0.2,
              duration: 0.62,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mt-6
              flex
              items-center
              justify-between
              border-t
              border-[#12364e]/12
              pt-4
            "
          >
            <p
              className="
                hidden
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#526f80]
                sm:block
              "
            >
              Metrologia · Digitalização · Engenharia
            </p>

            <Link
              to="/servicos"
              className="
                group
                ml-auto
                inline-flex
                items-center
                gap-3
                text-[11px]
                font-semibold
                text-[#12364e]
                transition-colors
                duration-300
                hover:text-[#0057b8]
              "
            >
              Ver todos os serviços

              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/65
                  bg-white/40
                  text-[#12364e]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_6px_18px_rgba(7,31,45,0.06)]
                  backdrop-blur-[18px]
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:border-[#0057b8]/20
                  group-hover:bg-white/70
                "
              >
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          </motion.div>

          <p
            className="
              mt-4
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#526f80]
              md:hidden
            "
          >
            Deslize para explorar
          </p>
        </Container>
      </motion.div>
    </section>
  );
}

function ServiceCard({ service }) {
  return (
    <Link
      to={service.href}
      className="
        group
        relative
        isolate
        flex
        min-h-[274px]
        h-full
        flex-col
        overflow-hidden
        rounded-[18px]
        border
        border-[#8fc4e5]/32
        bg-[linear-gradient(145deg,rgba(9,47,72,0.92)_0%,rgba(13,72,108,0.86)_46%,rgba(7,49,77,0.92)_100%)]
        p-5
        text-white
        shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_16px_40px_rgba(7,31,45,0.18)]
        backdrop-blur-[24px]
        backdrop-saturate-[145%]
        transition-all
        duration-500
        hover:-translate-y-[5px]
        hover:border-[#9fd0ef]/52
        hover:bg-[linear-gradient(145deg,rgba(11,58,88,0.94)_0%,rgba(16,85,126,0.90)_46%,rgba(8,57,88,0.94)_100%)]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_24px_52px_rgba(7,31,45,0.24)]
        md:min-h-[270px]
        xl:min-h-[278px]
      "
    >
      {/* REFLEXO SUPERIOR */}
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
          via-white/45
          to-transparent
        "
      />

      {/* LUZ GLASS INTERNA */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-[40px]
          top-[-75px]
          -z-10
          h-[180px]
          w-[180px]
          rounded-full
          bg-[#65b8ee]/8
          blur-[55px]
        "
      />

      {/* GLOW HOVER */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-[70px]
          -top-[70px]
          -z-10
          h-[190px]
          w-[190px]
          rounded-full
          bg-[#65b8ee]/0
          blur-[55px]
          transition-all
          duration-500
          group-hover:bg-[#65b8ee]/20
        "
      />

      {/* NÉVOA INFERIOR */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-[90px]
          left-[15%]
          -z-10
          h-[160px]
          w-[70%]
          rounded-full
          bg-[#0057b8]/7
          blur-[55px]
        "
      />

      {/* TOPO */}
      <div className="flex items-center justify-between">
        <span
          className="
            text-[11px]
            font-bold
            tracking-[0.18em]
            text-[#9fd0ef]
          "
        >
          {service.number}
        </span>

        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-white/16
            bg-white/[0.07]
            text-white/72
            shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
            backdrop-blur-[16px]
            transition-all
            duration-300
            group-hover:border-[#9fd0ef]/48
            group-hover:bg-[#65b8ee]/14
            group-hover:text-white
          "
        >
          <ArrowUpRightIcon
            className="
              h-3.5
              w-3.5
              transition-transform
              duration-300
              group-hover:-translate-y-0.5
              group-hover:translate-x-0.5
            "
          />
        </span>
      </div>

      {/* ÍCONE ANIMADO */}
      <AnimatedServiceIcon type={service.icon} />

      {/* CONTEÚDO */}
      <div className="mt-4">
        <h3
          className="
            text-[1.2rem]
            font-medium
            leading-[1.08]
            tracking-[-0.025em]
            text-white
            sm:text-[1.3rem]
          "
        >
          {service.title}
        </h3>

        <p
          className="
            mt-2.5
            text-[13px]
            leading-[1.65]
            text-[#d0dde4]
          "
        >
          {service.description}
        </p>
      </div>

      {/* AÇÃO */}
      <div className="mt-auto pt-4">
        <div
          className="
            mb-3
            h-px
            w-full
            bg-gradient-to-r
            from-[#8fd0f4]/36
            via-white/10
            to-transparent
          "
        />

        <span
          className="
            inline-flex
            items-center
            gap-2.5
            text-[11px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-[#a9d9f4]
          "
        >
          Explorar

          <ArrowRightIcon
            className="
              h-3
              w-3
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </span>
      </div>
    </Link>
  );
}

function AnimatedServiceIcon({ type }) {
  if (type === "measurement") {
    return (
      <div
        className="
          relative
          mt-4
          h-[54px]
          w-[54px]
        "
      >
        <motion.div
          className="
            absolute
            inset-[5px]
            rounded-full
            border
            border-[#8fd0f4]/20
          "
          animate={{
            scale: [0.92, 1.06, 0.92],
            opacity: [0.22, 0.48, 0.22],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-[#8fd0f4]
            drop-shadow-[0_0_10px_rgba(101,184,238,0.18)]
          "
          animate={{
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.08,
            rotate: 4,
          }}
        >
          <ServiceIcon type={type} />
        </motion.div>
      </div>
    );
  }

  if (type === "scan") {
    return (
      <div
        className="
          relative
          mt-4
          h-[54px]
          w-[54px]
        "
      >
        <motion.div
          className="
            absolute
            left-[7px]
            right-[7px]
            h-px
            bg-[linear-gradient(90deg,transparent,#8fd0f4,transparent)]
            shadow-[0_0_8px_rgba(143,208,244,0.42)]
          "
          animate={{
            top: ["10px", "42px", "10px"],
            opacity: [0.15, 0.8, 0.15],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-[#8fd0f4]
            drop-shadow-[0_0_10px_rgba(101,184,238,0.18)]
          "
          animate={{
            scale: [1, 1.035, 1],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.1,
          }}
        >
          <ServiceIcon type={type} />
        </motion.div>
      </div>
    );
  }

  if (type === "reverse") {
    return (
      <div
        className="
          relative
          mt-4
          h-[54px]
          w-[58px]
        "
      >
        <motion.div
          className="
            absolute
            left-[3px]
            right-[3px]
            top-[13px]
            h-[28px]
            rounded-[50%]
            border
            border-[#8fd0f4]/22
          "
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span
            className="
              absolute
              -top-[2px]
              left-1/2
              h-[4px]
              w-[4px]
              -translate-x-1/2
              rounded-full
              bg-[#8fd0f4]
              shadow-[0_0_8px_rgba(143,208,244,0.7)]
            "
          />
        </motion.div>

        <motion.div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-[#8fd0f4]
            drop-shadow-[0_0_10px_rgba(101,184,238,0.18)]
          "
          animate={{
            y: [0, -1.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.08,
          }}
        >
          <ServiceIcon type={type} />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="
        relative
        mt-4
        h-[54px]
        w-[54px]
      "
    >
      <motion.div
        className="
          absolute
          left-[12px]
          right-[12px]
          top-[14px]
          h-[18px]
          border
          border-[#8fd0f4]/16
        "
        animate={{
          y: [-2, 2, -2],
          opacity: [0.18, 0.35, 0.18],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="
          absolute
          left-[9px]
          right-[9px]
          top-[18px]
          h-[18px]
          border
          border-[#8fd0f4]/20
        "
        animate={{
          y: [2, -2, 2],
          opacity: [0.22, 0.42, 0.22],
        }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          text-[#8fd0f4]
          drop-shadow-[0_0_10px_rgba(101,184,238,0.18)]
        "
        animate={{
          scale: [1, 1.035, 1],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.1,
          rotate: -4,
        }}
      >
        <ServiceIcon type={type} />
      </motion.div>
    </div>
  );
}