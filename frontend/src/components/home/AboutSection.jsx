import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../layout/Container";
import { ArrowRightIcon } from "../ui/ArrowIcons";

export function AboutSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.76, 1],
    [0, 1, 1, 0.22],
  );

  const sectionY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.76, 1],
    [42, 0, 0, -40],
  );

  const imageParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [18, -22],
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.04, 1, 1.02],
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 0.26, 0.76, 1],
    [26, 0, 0, -18],
  );

  return (
    <section
      ref={sectionRef}
      className="
        relative
        isolate
        overflow-hidden
        bg-transparent
        pb-16
        pt-8
        sm:pb-18
        sm:pt-10
        lg:pb-20
        lg:pt-12
      "
    >
      <motion.div
        style={{
          opacity: sectionOpacity,
          y: sectionY,
        }}
      >
        <Container>
          <div
            className="
              grid
              items-center
              gap-10
              lg:grid-cols-[1.18fr_0.82fr]
              lg:gap-14
              xl:gap-16
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                x: -42,
                y: 30,
                scale: 0.972,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: false,
                amount: 0.24,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                min-w-0
              "
            >
              <div
                aria-hidden="true"
                className="
                  absolute
                  -inset-9
                  -z-10
                  rounded-[44px]
                  bg-[radial-gradient(circle_at_45%_50%,rgba(18,54,78,0.12)_0%,rgba(101,184,238,0.06)_44%,transparent_74%)]
                  blur-[44px]
                "
              />

              <div
                className="
                  relative
                  min-h-[405px]
                  overflow-hidden
                  rounded-[24px]
                  bg-[#071f2d]
                  shadow-[0_26px_70px_rgba(7,31,45,0.14)]
                  lg:min-h-[420px]
                  xl:min-h-[435px]
                "
              >
                <motion.img
                  style={{
                    y: imageParallaxY,
                    scale: imageScale,
                  }}
                  src="/images/home/centro-foto.jpeg"
                  alt="Centro de Excelência em Metrologia SENAI ZEISS"
                  className="
                    absolute
                    -left-[1.5%]
                    -top-[4%]
                    h-[109%]
                    w-[103%]
                    max-w-none
                    object-cover
                    object-[center_40%]
                    will-change-transform
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-[linear-gradient(180deg,rgba(7,31,45,0.00)_0%,rgba(7,31,45,0.015)_48%,rgba(7,31,45,0.10)_72%,rgba(7,31,45,0.56)_100%)]
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_83%_15%,rgba(101,184,238,0.08)_0%,transparent_42%)]
                  "
                />

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
                    amount: 0.4,
                  }}
                  transition={{
                    delay: 0.15,
                    duration: 0.72,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    p-7
                    sm:p-8
                    lg:p-8
                  "
                >
                  <div
                    className="
                      mb-3
                      h-[2px]
                      w-11
                      rounded-full
                      bg-[#65b8ee]
                    "
                  />

                  <p
                    className="
                      max-w-[440px]
                      text-[19px]
                      font-medium
                      leading-[1.08]
                      tracking-[-0.025em]
                      text-white
                      sm:text-[21px]
                      lg:text-[22px]
                    "
                  >
                    Tecnologia e conhecimento

                    <span className="block">
                      aplicados à indústria.
                    </span>
                  </p>
                </motion.div>

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    bottom-7
                    right-7
                    top-7
                    hidden
                    w-px
                    bg-gradient-to-b
                    from-white/5
                    via-white/34
                    to-white/5
                    sm:block
                  "
                />
              </div>
            </motion.div>

            <motion.div
              style={{
                y: contentY,
              }}
              className="
                max-w-[565px]
                lg:justify-self-end
              "
            >
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
                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.21em]
                    text-[#315b75]
                  "
                >
                  Sobre o Centro
                </p>

                <h2
                  className="
                    mt-3
                    max-w-[560px]
                    text-[2.25rem]
                    font-semibold
                    leading-[1.015]
                    tracking-[-0.046em]
                    text-[#071f2d]
                    sm:text-[2.7rem]
                    lg:text-[2.85rem]
                    xl:text-[3rem]
                  "
                >
                  Tecnologia aplicada aos

                  <span className="block text-[#315b75]">
                    desafios da indústria.
                  </span>
                </h2>
              </motion.div>

              <motion.p
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
                  delay: 0.08,
                  duration: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-4
                  max-w-[545px]
                  text-[15px]
                  font-medium
                  leading-[1.8]
                  text-[#49697c]
                  sm:text-[14.5px]
                "
              >
                O Centro de Excelência em Metrologia reúne tecnologias e
                conhecimentos voltados à medição, inspeção, digitalização e
                engenharia reversa, apoiando diferentes necessidades e desafios
                do setor industrial.
              </motion.p>

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
                  delay: 0.15,
                  duration: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-2.5
                  sm:grid-cols-3
                "
              >
                <Capability label="Medição" />
                <Capability label="Digitalização 3D" />
                <Capability label="Engenharia reversa" />
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
                  amount: 0.3,
                }}
                transition={{
                  delay: 0.22,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-5
                  border-t
                  border-[#12364e]/11
                  pt-4
                "
              >
                <Link
                  to="/sobre"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-3
                    text-[12px]
                    font-semibold
                    text-[#12364e]
                    transition-colors
                    duration-300
                    hover:text-[#0057b8]
                  "
                >
                  Conheça o Centro

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#12364e]/14
                      bg-white/42
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]
                      backdrop-blur-[18px]
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                      group-hover:border-[#0057b8]/22
                      group-hover:bg-[#dceaf2]/65
                    "
                  >
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}

function Capability({ label }) {
  return (
    <div
      className="
        rounded-[12px]
        border
        border-white/64
        bg-white/42
        px-4
        py-3
        shadow-[inset_0_1px_0_rgba(255,255,255,0.86),0_7px_18px_rgba(7,31,45,0.04)]
        backdrop-blur-[18px]
      "
    >
      <div
        className="
          mb-1.5
          h-[4px]
          w-[4px]
          rounded-full
          bg-[#315b75]
        "
      />

      <p
        className="
          text-[11px]
          font-semibold
          leading-4
          text-[#345365]
        "
      >
        {label}
      </p>
    </div>
  );
}