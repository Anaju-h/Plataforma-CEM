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

const equipment = [
  {
    number: "01",
    name: "ZEISS PRISMO",
    category: "Medição por coordenadas",
    image: "/images/equipment/zeiss-prismo.png",
    href: "/equipamentos#prismo",
  },
  {
    number: "02",
    name: "ZEISS O-INSPECT",
    category: "Medição multissensor",
    image: "/images/equipment/zeiss-o-inspect.png",
    href: "/equipamentos#o-inspect",
  },
  {
    number: "03",
    name: "ZEISS DuraMax",
    category: "Medição por coordenadas",
    image: "/images/equipment/zeiss-duramax.png",
    href: "/equipamentos#duramax",
  },
  {
    number: "04",
    name: "ZEISS T-SCAN",
    category: "Escaneamento 3D",
    image: "/images/equipment/zeiss-t-scan.png",
    href: "/equipamentos#t-scan",
  },
  {
    number: "05",
    name: "ZEISS ATOS-Q",
    category: "Escaneamento 3D",
    image: "/images/equipment/zeiss-atos-q.png",
    href: "/equipamentos#atos-q",
  },
  {
    number: "06",
    name: "ZEISS BOSELLO MAX",
    category: "Tomografia computadorizada industrial",
    image: "/images/equipment/zeiss-bosello-max.png",
    href: "/equipamentos#bosello-max",
  },
];

export function EquipmentPreview() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.82, 1],
    [40, 0, 0, -32],
  );

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.86, 1],
    [0, 1, 1, 0.36],
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white pb-14 pt-5 sm:pb-18 sm:pt-7 lg:pb-20 lg:pt-8"
    >
      {/* FUNDO SUAVE */}
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
            -left-[280px]
            top-[18%]
            h-[560px]
            w-[560px]
            rounded-full
            bg-[#65b8ee]/5
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            -right-[280px]
            bottom-[8%]
            h-[560px]
            w-[560px]
            rounded-full
            bg-[#315b75]/4
            blur-[150px]
          "
        />
      </div>

      <motion.div
        style={{
          y: sectionY,
          opacity: sectionOpacity,
        }}
      >
        <Container>
          <div
            className="
              grid
              gap-10
              lg:grid-cols-[0.72fr_1.28fr]
              lg:items-center
              lg:gap-16
            "
          >
            {/* TEXTO */}
            <motion.div
              initial={{
                opacity: 0,
                y: 28,
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
            >
              <div className="flex items-center gap-4">
                <p
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-[#356f9f]
                  "
                >
                  Tecnologia
                </p>

                <div className="h-px w-10 bg-[#6fa7d1]" />
              </div>

              <h2
                className="
                  mt-4
                  max-w-xl
                  text-[2.45rem]
                  font-semibold
                  leading-[1.06]
                  tracking-[-0.04em]
                  text-[#0b2340]
                  sm:text-[3rem]
                  lg:text-[3.2rem]
                "
              >
                Infraestrutura para
                <span className="block text-[#315b75]">
                  diferentes desafios de medição.
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-lg
                  text-[14px]
                  font-medium
                  leading-[1.8]
                  text-[#526d7f]
                  sm:text-[15px]
                "
              >
                O Centro reúne tecnologias para medição dimensional,
                digitalização 3D e inspeção interna, atendendo a diferentes
                necessidades da indústria.
              </p>

              <Link
                to="/equipamentos"
                className="
                  group
                  mt-7
                  inline-flex
                  items-center
                  gap-3
                  text-[11px]
                  font-semibold
                  text-[#356f9f]
                  transition-colors
                  duration-300
                  hover:text-[#0b2340]
                "
              >
                Conheça nossos equipamentos

                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#356f9f]/15
                    bg-white/55
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_6px_18px_rgba(7,31,45,0.05)]
                    backdrop-blur-[16px]
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:border-[#356f9f]/25
                    group-hover:bg-[#e9f3f8]
                  "
                >
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>

            {/* GRID DE EQUIPAMENTOS */}
            <div
              className="
                grid
                grid-cols-2
                items-start
                gap-3
                sm:gap-4
                lg:grid-cols-2
                xl:grid-cols-3
              "
            >
              {equipment.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{
                    opacity: 0,
                    y: 30,
                    scale: 0.985,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  viewport={{
                    once: false,
                    amount: 0.2,
                  }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.68,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <EquipmentCard item={item} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* MOBILE */}
          <div
            className="
              mt-8
              flex
              justify-end
              border-t
              border-[#e1e8ed]
              pt-6
              lg:hidden
            "
          >
            <Link
              to="/equipamentos"
              className="
                group
                inline-flex
                items-center
                gap-3
                text-sm
                font-medium
                text-[#356f9f]
              "
            >
              Ver todos os equipamentos

              <ArrowRightIcon
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}

function EquipmentCard({ item }) {
  return (
    <Link
      to={item.href}
      className="
        group
        relative
        isolate
        flex
        min-h-[250px]
        flex-col
        overflow-hidden
        rounded-[20px]
        border
        border-[#d9e4eb]
        bg-[linear-gradient(145deg,rgba(255,255,255,0.94)_0%,rgba(247,251,253,0.86)_100%)]
        p-4
        shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_20px_rgba(7,31,45,0.035)]
        backdrop-blur-[18px]
        transition-all
        duration-500
        hover:border-[#9bbfd9]/75
        hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(232,244,250,0.90)_100%)]
        sm:min-h-[280px]
        sm:rounded-[24px]
        sm:p-5
        lg:h-[250px]
        lg:min-h-0
        lg:hover:h-[330px]
        lg:hover:-translate-y-[4px]
        lg:hover:shadow-[0_18px_42px_rgba(8,28,44,0.09),inset_0_1px_0_rgba(255,255,255,0.95)]
      "
    >
      {/* REFLEXO SUPERIOR */}
      <div
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
          via-white
          to-transparent
        "
      />

      {/* NÉVOA AZUL DO HOVER */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-[80px]
          -top-[80px]
          -z-10
          h-[190px]
          w-[190px]
          rounded-full
          bg-[#65b8ee]/0
          blur-[55px]
          transition-all
          duration-500
          group-hover:bg-[#65b8ee]/12
        "
      />

      {/* TOPO */}
      <div className="relative z-20 flex items-center justify-between">
        <span
          className="
            text-[11px]
            font-medium
            tracking-[0.14em]
            text-[#356f9f]
            sm:text-xs
          "
        >
          {item.number}
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
            border-[#315b75]/10
            bg-white/45
            text-[#657b8d]
            backdrop-blur-[14px]
            transition-all
            duration-300
            lg:opacity-0
            lg:group-hover:opacity-100
            group-hover:border-[#356f9f]/20
            group-hover:bg-[#e7f2f8]
            group-hover:text-[#356f9f]
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

      {/* IMAGEM */}
      <div
        className="
          relative
          mt-1
          h-[130px]
          shrink-0
          overflow-hidden
          transition-all
          duration-500
          sm:h-[160px]
          lg:h-[185px]
          lg:group-hover:h-[170px]
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-[18%]
            bottom-[12%]
            h-[45%]
            rounded-full
            bg-[#65b8ee]/0
            blur-[28px]
            transition-all
            duration-500
            group-hover:bg-[#65b8ee]/7
          "
        />

        <img
          src={item.image}
          alt={item.name}
          className="
            relative
            z-10
            h-full
            w-full
            scale-[1.25]
            object-contain
            transition-all
            duration-500
            ease-out
            group-hover:scale-[1.035]
            lg:group-hover:-translate-y-[3px]
          "
        />
      </div>

      {/* MOBILE / TABLET */}
      <div className="mt-auto lg:hidden">
        <div
          className="
            mb-2.5
            h-px
            w-8
            bg-[#6fa7d1]
            transition-all
            duration-500
            group-hover:w-12
            sm:w-10
          "
        />

        <h3
          className="
            text-[13px]
            font-semibold
            leading-[1.2]
            tracking-[-0.02em]
            text-[#0b2340]
            sm:text-base
          "
        >
          {item.name}
        </h3>

        <p
          className="
            mt-1
            text-[8px]
            font-medium
            uppercase
            leading-4
            tracking-[0.06em]
            text-[#356f9f]
            sm:text-[10px]
            sm:tracking-[0.08em]
          "
        >
          {item.category}
        </p>
      </div>

      {/* DESKTOP — CONTEÚDO REVELADO */}
      <div
        className="
          hidden
          overflow-hidden
          lg:block
          lg:max-h-0
          lg:translate-y-3
          lg:opacity-0
          lg:transition-all
          lg:duration-500
          lg:group-hover:max-h-[125px]
          lg:group-hover:translate-y-0
          lg:group-hover:opacity-100
        "
      >
        <div
          className="
            mb-3
            h-px
            w-8
            bg-[#6fa7d1]
            transition-all
            duration-500
            group-hover:w-12
          "
        />

        <h3
          className="
            text-base
            font-semibold
            leading-tight
            tracking-[-0.02em]
            text-[#0b2340]
          "
        >
          {item.name}
        </h3>

        <p
          className="
            mt-1.5
            text-[10px]
            font-medium
            uppercase
            leading-4
            tracking-[0.07em]
            text-[#356f9f]
          "
        >
          {item.category}
        </p>
      </div>
    </Link>
  );
}