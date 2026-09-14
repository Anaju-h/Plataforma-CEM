import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getMachineProfile,
} from "./data/machineProfiles";

/* ============================================================
 * MÁQUINAS
 * ============================================================ */

const ALL_MACHINE_IDS = [
  "prismo",
  "duramax",
  "o-inspect",
  "atos-q",
  "t-scan",
  "bosello-max",
];

/* ============================================================
 * PRINCIPAL
 * ============================================================ */

export function ConfiguratorStage({
  state,
  recommendation,
}) {
  const step =
    state.currentStep;

  if (
    step ===
    1
  ) {
    return (
      <ExplorationStage
        recommendation={
          recommendation
        }
      />
    );
  }

  if (
    step ===
    8
  ) {
    return (
      <SolutionStage
        recommendation={
          recommendation
        }
      />
    );
  }

  return (
    <EvaluationStage
      step={
        step
      }
      recommendation={
        recommendation
      }
    />
  );
}

/* ============================================================
 * EXPLORAÇÃO
 * ============================================================ */

function ExplorationStage({
  recommendation,
}) {
  const reduceMotion =
    useReducedMotion();

  const machines =
    useMemo(
      () =>
        normalizeMachineList(
          recommendation.activeMachines,
        ),
      [
        recommendation.activeMachines,
      ],
    );

  const displayMachines =
    machines.length >
    0
      ? machines
      : ALL_MACHINE_IDS;

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const machineKey =
    displayMachines.join(
      "|",
    );

  useEffect(() => {
    setActiveIndex(
      0,
    );
  }, [
    machineKey,
  ]);

  useEffect(() => {
    if (
      reduceMotion ||
      displayMachines.length <=
        1
    ) {
      return undefined;
    }

    const timer =
      window.setInterval(
        () => {
          setActiveIndex(
            (
              current,
            ) =>
              (current +
                1) %
              displayMachines.length,
          );
        },
        5400,
      );

    return () =>
      window.clearInterval(
        timer,
      );
  }, [
    reduceMotion,
    machineKey,
    displayMachines.length,
  ]);

  const safeIndex =
    activeIndex >= 0 &&
    activeIndex <
      displayMachines.length
      ? activeIndex
      : 0;

  const machineId =
    displayMachines[
      safeIndex
    ];

  const machine =
    machineId
      ? getMachineProfile(
          machineId,
        )
      : null;

  function previous() {
    setActiveIndex(
      (
        current,
      ) =>
        current <=
        0
          ? displayMachines.length -
            1
          : current -
            1,
    );
  }

  function next() {
    setActiveIndex(
      (
        current,
      ) =>
        (current +
          1) %
        displayMachines.length,
    );
  }

  if (!machine) {
    return (
      <StageShell>
        <StageHeader
          eyebrow="Explorando agora"
          counter="-- / --"
        />

        <StageTitle>
          Conhecendo as possibilidades.
        </StageTitle>

        <StageDescription>
          Selecione sua necessidade para começarmos a relacionar as tecnologias
          disponíveis no Centro.
        </StageDescription>

        <PremiumViewport>
          <PremiumMachineBackground />

          <EmptyTechnicalGraphic />
        </PremiumViewport>
      </StageShell>
    );
  }

  return (
    <StageShell>
      <StageHeader
        eyebrow="Explorando agora"
        counter={`${String(
          safeIndex + 1,
        ).padStart(
          2,
          "0",
        )} / ${String(
          displayMachines.length,
        ).padStart(
          2,
          "0",
        )}`}
      />

      <AnimatePresence
        mode="wait"
      >
        <motion.div
          key={`title-${machine.id}`}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 12,
                }
          }
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -10,
          }}
          transition={{
            duration:
              0.38,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <StageTitle>
            {
              machine.name
            }
          </StageTitle>

          <StageCategory>
            {
              machine.category
            }
          </StageCategory>

          <StageDescription>
            Nesta etapa as tecnologias ainda são possibilidades. Continue
            respondendo para que o configurador comece a comparar aderência
            técnica.
          </StageDescription>
        </motion.div>
      </AnimatePresence>

      <PremiumViewport>
        <PremiumMachineBackground />

        <AnimatePresence
          mode="wait"
          initial={false}
        >
          <motion.div
            key={
              machine.id
            }
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 38,
                    scale:
                      0.965,
                    filter:
                      "blur(5px)",
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              filter:
                "blur(0px)",
            }}
            exit={{
              opacity: 0,
              x: -30,
              scale:
                0.98,
              filter:
                "blur(4px)",
            }}
            transition={{
              duration:
                0.58,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="absolute inset-0 z-20 flex items-center justify-center px-6 pb-[72px] pt-8"
          >
            <MachineDisplay
              machine={
                machine
              }
              reduceMotion={
                reduceMotion
              }
              large
            />
          </motion.div>
        </AnimatePresence>

        <MachineSpotlightLabel
          label={
            machine.category
          }
        />

        <CarouselControls
          machines={
            displayMachines
          }
          activeIndex={
            safeIndex
          }
          onPrevious={
            previous
          }
          onNext={
            next
          }
          onSelect={
            setActiveIndex
          }
        />
      </PremiumViewport>

      <OrientationPanel
        label="Orientação em construção"
        title="Explorando tecnologias"
        text="As respostas das próximas etapas irão reduzir as possibilidades e aumentar a definição técnica da orientação."
      />
    </StageShell>
  );
}

/* ============================================================
 * AVALIAÇÃO
 * ============================================================ */

function EvaluationStage({
  step,
  recommendation,
}) {
  const reduceMotion =
    useReducedMotion();

  const matches =
    useMemo(
      () =>
        collectMachineMatches(
          recommendation,
        ),
      [
        recommendation,
      ],
    );

  const [
    selectedId,
    setSelectedId,
  ] = useState(
    null,
  );

  const matchKey =
    matches
      .map(
        (
          match,
        ) =>
          match.machineId,
      )
      .join(
        "|",
      );

  useEffect(() => {
    if (
      matches.length ===
      0
    ) {
      setSelectedId(
        null,
      );

      return;
    }

    const exists =
      matches.some(
        (
          match,
        ) =>
          match.machineId ===
          selectedId,
      );

    if (!exists) {
      setSelectedId(
        matches[0].machineId,
      );
    }
  }, [
    matchKey,
    selectedId,
    matches,
  ]);

  const selectedMatch =
    matches.find(
      (
        match,
      ) =>
        match.machineId ===
        selectedId,
    ) ??
    matches[0];

  const stageCopy =
    getStageCopy(
      step,
    );

  if (!selectedMatch) {
    return (
      <StageShell>
        <StageHeader
          eyebrow={
            stageCopy.eyebrow
          }
          counter="Em análise"
        />

        <StageTitle>
          {
            stageCopy.title
          }
        </StageTitle>

        <StageDescription>
          Continue preenchendo o projeto para que as tecnologias possam ser
          comparadas com mais precisão.
        </StageDescription>

        <PremiumViewport
          compact
        >
          <PremiumMachineBackground />

          <EmptyTechnicalGraphic />
        </PremiumViewport>

        <DefinitionPanel
          score={
            recommendation.definitionScore ??
            0
          }
          label={
            stageCopy.progressLabel
          }
        />
      </StageShell>
    );
  }

  const machine =
    getMachineProfile(
      selectedMatch.machineId,
    );

  if (!machine) {
    return null;
  }

  return (
    <StageShell>
      <StageHeader
        eyebrow={
          stageCopy.eyebrow
        }
        counter={
          getDefinitionLabel(
            recommendation.definitionScore,
          )
        }
      />

      <AnimatePresence
        mode="wait"
      >
        <motion.div
          key={`evaluation-title-${step}-${machine.id}`}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 6,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration:
              0.3,
          }}
        >
          <StageTitle>
            {
              machine.name
            }
          </StageTitle>

          <StageCategory>
            {
              machine.category
            }
          </StageCategory>

          <StageDescription>
            {
              stageCopy.description
            }
          </StageDescription>
        </motion.div>
      </AnimatePresence>

      <PremiumViewport
        compact
      >
        <PremiumMachineBackground />

        <AnimatePresence
          mode="wait"
          initial={false}
        >
          <motion.div
            key={
              machine.id
            }
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 32,
                    scale:
                      0.97,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: -24,
              scale:
                0.98,
            }}
            transition={{
              duration:
                0.5,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="absolute inset-0 z-20 flex items-center justify-center px-6 py-6"
          >
            <MachineDisplay
              machine={
                machine
              }
              reduceMotion={
                reduceMotion
              }
            />
          </motion.div>
        </AnimatePresence>

        <MatchBadge
          level={
            selectedMatch.level
          }
        />
      </PremiumViewport>

      <DefinitionPanel
        score={
          recommendation.definitionScore ??
          0
        }
        label={
          stageCopy.progressLabel
        }
      />

      <ReasonPanel
        match={
          selectedMatch
        }
      />

      {matches.length >
        1 && (
        <MachineAlternatives
          matches={
            matches
          }
          selectedId={
            selectedMatch.machineId
          }
          onSelect={
            setSelectedId
          }
        />
      )}
    </StageShell>
  );
}

/* ============================================================
 * SOLUÇÃO
 * ============================================================ */

function SolutionStage({
  recommendation,
}) {
  const reduceMotion =
    useReducedMotion();

  const primaryMachines =
    useMemo(
      () =>
        collectPrimaryMachines(
          recommendation,
        ),
      [
        recommendation,
      ],
    );

  const primaryId =
    primaryMachines[0] ??
    null;

  const machine =
    primaryId
      ? getMachineProfile(
          primaryId,
        )
      : null;

  if (!machine) {
    return (
      <StageShell>
        <StageHeader
          eyebrow="Orientação final"
          counter="Validação técnica"
        />

        <StageTitle>
          Configuração preparada.
        </StageTitle>

        <StageDescription>
          A equipe técnica poderá complementar a orientação antes de definir a
          estratégia final.
        </StageDescription>
      </StageShell>
    );
  }

  return (
    <StageShell
      final
    >
      <StageHeader
        eyebrow="Tecnologia priorizada"
        counter={
          getDefinitionLabel(
            recommendation.definitionScore,
          )
        }
      />

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[27px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#071f2d] sm:text-[29px]">
            {
              machine.name
            }
          </h3>

          <StageCategory>
            {
              machine.category
            }
          </StageCategory>
        </div>

        <span className="shrink-0 rounded-full border border-[#65b8ee]/45 bg-[#071f2d] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_8px_20px_rgba(7,31,45,0.12)]">
          Orientação inicial
        </span>
      </div>

      <PremiumViewport
        solution
      >
        <PremiumMachineBackground
          strong
        />

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 16,
                  scale:
                    0.965,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration:
              0.65,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="absolute inset-0 z-20 flex items-center justify-center px-6 py-6"
        >
          <MachineDisplay
            machine={
              machine
            }
            reduceMotion={
              reduceMotion
            }
            solution
          />
        </motion.div>

        <MachineSpotlightLabel
          label="Maior aderência ao cenário informado"
          strong
        />
      </PremiumViewport>

      <DefinitionPanel
        score={
          recommendation.definitionScore ??
          0
        }
        label="Definição da orientação"
        final
      />

      {primaryMachines.length >
        1 && (
        <div className="mt-3 rounded-[16px] border border-[#b5ccd8]/70 bg-white/34 px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#688595]">
            Tecnologias complementares
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {primaryMachines
              .slice(
                1,
              )
              .map(
                (
                  machineId,
                ) => {
                  const profile =
                    getMachineProfile(
                      machineId,
                    );

                  if (!profile) {
                    return null;
                  }

                  return (
                    <span
                      key={
                        machineId
                      }
                      className="rounded-full border border-[#a9c5d3]/70 bg-[#e4eff4] px-3 py-1.5 text-[10px] font-semibold text-[#456f86]"
                    >
                      {
                        profile.name
                      }
                    </span>
                  );
                },
              )}
          </div>
        </div>
      )}
    </StageShell>
  );
}

/* ============================================================
 * VIEWPORT PREMIUM
 * ============================================================ */

function PremiumViewport({
  children,
  compact = false,
  solution = false,
}) {
  let height =
    "min-h-[435px] sm:min-h-[475px]";

  if (
    compact
  ) {
    height =
      "min-h-[355px] sm:min-h-[390px]";
  }

  if (
    solution
  ) {
    height =
      "min-h-[440px] sm:min-h-[485px]";
  }

  return (
    <div
      className={`
        relative
        mt-5
        overflow-hidden
        rounded-[22px]
        border
        border-[#87abc0]/45
        bg-[#d9e7ee]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_18px_40px_rgba(31,68,92,0.06)]

        ${height}
      `}
    >
      {children}
    </div>
  );
}

/* ============================================================
 * FUNDO DA MÁQUINA
 * ============================================================ */

function PremiumMachineBackground({
  strong = false,
}) {
  const reduceMotion =
    useReducedMotion();

  return (
    <>
      {/* PROFUNDIDADE */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0

          ${
            strong
              ? "bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.98)_0%,rgba(224,239,247,0.86)_36%,rgba(134,181,208,0.42)_68%,rgba(38,91,125,0.18)_100%)]"
              : "bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.96)_0%,rgba(229,241,247,0.84)_38%,rgba(157,197,219,0.34)_70%,rgba(70,124,157,0.13)_100%)]"
          }
        `}
      />

      {/* BLUE GLOW */}

      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [
                  0.24,
                  0.42,
                  0.24,
                ],
                scale: [
                  0.96,
                  1.05,
                  0.96,
                ],
              }
        }
        transition={{
          duration: 7,
          repeat:
            Infinity,
          ease:
            "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-[47%] h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0057B8]/10 blur-[60px]"
      />

      {/* HALO CENTRAL */}

      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                rotate:
                  360,
              }
        }
        transition={{
          duration: 42,
          repeat:
            Infinity,
          ease:
            "linear",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0057B8]/16"
      >
        <span className="absolute left-1/2 top-[-4px] h-2 w-2 -translate-x-1/2 rounded-full bg-[#65B8EE] shadow-[0_0_16px_rgba(101,184,238,0.65)]" />

        <span className="absolute bottom-[11%] right-[6%] h-1.5 w-1.5 rounded-full bg-[#0057B8]/60" />
      </motion.div>

      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                rotate:
                  -360,
              }
        }
        transition={{
          duration: 58,
          repeat:
            Infinity,
          ease:
            "linear",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[235px] w-[235px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#12364E]/16"
      />

      {/* EIXOS */}

      <div className="pointer-events-none absolute left-[13%] right-[13%] top-1/2 h-px bg-gradient-to-r from-transparent via-[#0057B8]/16 to-transparent" />

      <div className="pointer-events-none absolute bottom-[12%] top-[12%] left-1/2 w-px bg-gradient-to-b from-transparent via-[#0057B8]/12 to-transparent" />

      {/* CORNER ELEMENT */}

      <div className="pointer-events-none absolute -right-[90px] -top-[90px] h-[220px] w-[220px] rounded-full border border-[#0057B8]/12" />

      <div className="pointer-events-none absolute -bottom-[110px] -left-[110px] h-[250px] w-[250px] rounded-full border border-[#65B8EE]/15" />

      {/* SHOWROOM LIGHT SWEEP */}

      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          initial={{
            x: "-180%",
          }}
          animate={{
            x: "300%",
          }}
          transition={{
            duration: 2.4,
            repeat:
              Infinity,
            repeatDelay: 6.5,
            ease:
              "easeInOut",
          }}
          className="pointer-events-none absolute -top-[40%] z-10 h-[180%] w-[18%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[8px]"
        />
      )}

      {/* TOP LIGHT */}

      <div className="pointer-events-none absolute left-[16%] right-[16%] top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
    </>
  );
}

/* ============================================================
 * MÁQUINA
 * ============================================================ */

function MachineDisplay({
  machine,
  reduceMotion,
  large = false,
  solution = false,
}) {
  const imageSize =
    solution
      ? "max-h-[350px] sm:max-h-[390px] max-w-[94%]"
      : large
        ? "max-h-[300px] sm:max-h-[340px] max-w-[94%]"
        : "max-h-[245px] sm:max-h-[285px] max-w-[91%]";

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* SOMBRA */}

      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [
                  0.18,
                  0.3,
                  0.18,
                ],
                scaleX: [
                  0.92,
                  1.07,
                  0.92,
                ],
              }
        }
        transition={{
          duration: 7,
          repeat:
            Infinity,
          ease:
            "easeInOut",
        }}
        className="absolute bottom-[10%] h-8 w-[46%] rounded-[100%] bg-[#12364E]/20 blur-[16px]"
      />

      {/* GLOW IMEDIATO */}

      <div className="pointer-events-none absolute h-[62%] w-[62%] rounded-full bg-white/34 blur-[42px]" />

      {/* EQUIPAMENTO */}

      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                y: [
                  0,
                  -6,
                  0,
                ],
              }
        }
        transition={{
          duration:
            solution
              ? 7.8
              : 7,
          repeat:
            Infinity,
          ease:
            "easeInOut",
        }}
        className="relative z-20 flex h-full w-full items-center justify-center"
      >
        <img
          src={
            machine.image
          }
          alt={
            machine.name
          }
          draggable="false"
          className={`
            select-none
            object-contain
            drop-shadow-[0_32px_34px_rgba(23,63,87,0.24)]

            ${imageSize}
          `}
        />
      </motion.div>
    </div>
  );
}

/* ============================================================
 * LABEL SOBRE O PALCO
 * ============================================================ */

function MachineSpotlightLabel({
  label,
  strong = false,
}) {
  return (
    <div className="pointer-events-none absolute left-4 top-4 z-30">
      <div
        className={`
          flex
          items-center
          gap-2
          rounded-full
          border
          px-3
          py-1.5
          backdrop-blur-[16px]

          ${
            strong
              ? "border-[#65B8EE]/40 bg-[#071F2D]/88 text-white"
              : "border-white/58 bg-[#071F2D]/72 text-white"
          }
        `}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#65B8EE] shadow-[0_0_10px_rgba(101,184,238,0.55)]" />

        <p className="text-[9px] font-semibold uppercase tracking-[0.1em]">
          {label}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 * SHELL
 * ============================================================ */

function StageShell({
  children,
  final = false,
}) {
  return (
    <aside
      className={`
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-white/72
        bg-white/36
        p-5
        shadow-[0_26px_72px_rgba(31,68,92,0.09)]
        backdrop-blur-[18px]
        sm:p-6
        lg:sticky
        lg:top-[112px]

        ${
          final
            ? "h-full"
            : ""
        }
      `}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-[#65B8EE]/7 blur-[55px]" />

      <div className="pointer-events-none absolute left-[12%] right-[12%] top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="relative z-10">
        {children}
      </div>
    </aside>
  );
}

/* ============================================================
 * CABEÇALHO
 * ============================================================ */

function StageHeader({
  eyebrow,
  counter,
}) {
  const reduceMotion =
    useReducedMotion();

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <motion.span
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [
                    1,
                    1.18,
                    1,
                  ],
                  boxShadow: [
                    "0 0 0 0 rgba(101,184,238,0.12)",
                    "0 0 0 6px rgba(101,184,238,0.05)",
                    "0 0 0 0 rgba(101,184,238,0.12)",
                  ],
                }
          }
          transition={{
            duration: 3.5,
            repeat:
              Infinity,
            ease:
              "easeInOut",
          }}
          className="h-2 w-2 rounded-full bg-[#0057B8]"
        />

        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4c7892]">
          {eyebrow}
        </p>
      </div>

      <span className="rounded-full border border-[#b3cad6]/62 bg-white/42 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.09em] text-[#688390] backdrop-blur-[12px]">
        {counter}
      </span>
    </div>
  );
}

function StageTitle({
  children,
}) {
  return (
    <h3 className="mt-4 text-[27px] font-semibold leading-[1.07] tracking-[-0.04em] text-[#071F2D] sm:text-[29px]">
      {children}
    </h3>
  );
}

function StageCategory({
  children,
}) {
  return (
    <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#527f98]">
      {children}
    </p>
  );
}

function StageDescription({
  children,
}) {
  return (
    <p className="mt-2.5 max-w-[560px] text-[12px] leading-6 text-[#69818e]">
      {children}
    </p>
  );
}

/* ============================================================
 * CARROSSEL
 * ============================================================ */

function CarouselControls({
  machines,
  activeIndex,
  onPrevious,
  onNext,
  onSelect,
}) {
  return (
    <div className="absolute inset-x-4 bottom-4 z-30 flex items-center justify-between gap-4 sm:inset-x-5">
      <button
        type="button"
        onClick={
          onPrevious
        }
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-[#071F2D]/78 text-[14px] text-white shadow-[0_8px_18px_rgba(7,31,45,0.14)] backdrop-blur-[14px] transition-all duration-300 hover:-translate-x-0.5 hover:bg-[#12364E]"
        aria-label="Tecnologia anterior"
      >
        ←
      </button>

      <div className="flex items-center gap-1.5 rounded-full border border-white/45 bg-[#071F2D]/68 px-3 py-2 shadow-[0_8px_18px_rgba(7,31,45,0.10)] backdrop-blur-[14px]">
        {machines.map(
          (
            machineId,
            index,
          ) => (
            <button
              key={
                machineId
              }
              type="button"
              onClick={() =>
                onSelect(
                  index,
                )
              }
              className={`
                h-[6px]
                rounded-full
                transition-all
                duration-500

                ${
                  index ===
                  activeIndex
                    ? "w-7 bg-[#65B8EE]"
                    : "w-[6px] bg-white/34 hover:bg-white/70"
                }
              `}
              aria-label={`Ver tecnologia ${index + 1}`}
            />
          ),
        )}
      </div>

      <button
        type="button"
        onClick={
          onNext
        }
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-[#071F2D]/78 text-[14px] text-white shadow-[0_8px_18px_rgba(7,31,45,0.14)] backdrop-blur-[14px] transition-all duration-300 hover:translate-x-0.5 hover:bg-[#12364E]"
        aria-label="Próxima tecnologia"
      >
        →
      </button>
    </div>
  );
}

/* ============================================================
 * DEFINIÇÃO
 * ============================================================ */

function DefinitionPanel({
  score,
  label,
  final = false,
}) {
  const safeScore =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          score,
        ) ||
          0,
      ),
    );

  return (
    <div
      className={`
        mt-3
        overflow-hidden
        rounded-[16px]
        border
        px-4
        py-3.5

        ${
          final
            ? "border-[#12364E]/20 bg-[#12364E]"
            : "border-white/72 bg-white/34"
        }
      `}
    >
      <div className="flex items-center justify-between gap-5">
        <div>
          <p
            className={`
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.12em]

              ${
                final
                  ? "text-[#8ccbf2]"
                  : "text-[#6f8795]"
              }
            `}
          >
            {label}
          </p>

          <p
            className={`
              mt-1
              text-[11px]
              font-semibold

              ${
                final
                  ? "text-white/82"
                  : "text-[#315c72]"
              }
            `}
          >
            {
              getDefinitionDescription(
                safeScore,
              )
            }
          </p>
        </div>

        <motion.span
          key={
            safeScore
          }
          initial={{
            opacity: 0,
            y: 3,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className={`
            text-[20px]
            font-semibold
            tracking-[-0.04em]

            ${
              final
                ? "text-white"
                : "text-[#0057B8]"
            }
          `}
        >
          {Math.round(
            safeScore,
          )}
          %
        </motion.span>
      </div>

      <div
        className={`
          mt-3
          h-[4px]
          overflow-hidden
          rounded-full

          ${
            final
              ? "bg-white/15"
              : "bg-[#bbccd5]/62"
          }
        `}
      >
        <motion.div
          initial={false}
          animate={{
            width: `${safeScore}%`,
          }}
          transition={{
            duration:
              0.65,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className={`
            h-full
            rounded-full

            ${
              final
                ? "bg-[#65B8EE]"
                : "bg-[#0057B8]"
            }
          `}
        />
      </div>
    </div>
  );
}

/* ============================================================
 * ORIENTAÇÃO
 * ============================================================ */

function OrientationPanel({
  label,
  title,
  text,
}) {
  return (
    <div className="mt-3 rounded-[16px] border border-[#adc6d3]/60 bg-white/35 px-4 py-3.5 backdrop-blur-[14px]">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#0057B8]" />

        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#688798]">
          {label}
        </p>
      </div>

      <p className="mt-2 text-[12px] font-semibold text-[#214d65]">
        {title}
      </p>

      <p className="mt-1.5 text-[11px] leading-5 text-[#748995]">
        {text}
      </p>
    </div>
  );
}

/* ============================================================
 * BADGE
 * ============================================================ */

function MatchBadge({
  level,
}) {
  return (
    <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2">
      <span className="inline-flex whitespace-nowrap rounded-full border border-[#65B8EE]/40 bg-[#071F2D]/84 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_8px_20px_rgba(7,31,45,0.14)] backdrop-blur-[14px]">
        {
          getMatchLabel(
            level,
          )
        }
      </span>
    </div>
  );
}

/* ============================================================
 * MOTIVOS
 * ============================================================ */

function ReasonPanel({
  match,
}) {
  const reasons =
    Array.isArray(
      match?.reasons,
    )
      ? match.reasons.slice(
          0,
          2,
        )
      : [];

  const warnings =
    Array.isArray(
      match?.warnings,
    )
      ? match.warnings.slice(
          0,
          1,
        )
      : [];

  if (
    reasons.length ===
      0 &&
    warnings.length ===
      0
  ) {
    return null;
  }

  return (
    <div className="mt-3 rounded-[16px] border border-[#b8ccd7]/60 bg-white/30 px-4 py-3.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#688697]">
        Leitura técnica
      </p>

      <div className="mt-2.5 space-y-2">
        {reasons.map(
          (
            reason,
          ) => (
            <TechnicalPoint
              key={
                reason
              }
              text={
                reason
              }
            />
          ),
        )}

        {warnings.map(
          (
            warning,
          ) => (
            <TechnicalPoint
              key={
                warning
              }
              text={
                warning
              }
              warning
            />
          ),
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * ALTERNATIVAS
 * ============================================================ */

function MachineAlternatives({
  matches,
  selectedId,
  onSelect,
}) {
  return (
    <div className="mt-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718997]">
        Tecnologias em avaliação
      </p>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {matches
          .slice(
            0,
            4,
          )
          .map(
            (
              match,
            ) => {
              const machine =
                getMachineProfile(
                  match.machineId,
                );

              if (!machine) {
                return null;
              }

              const selected =
                match.machineId ===
                selectedId;

              return (
                <button
                  key={
                    match.machineId
                  }
                  type="button"
                  onClick={() =>
                    onSelect(
                      match.machineId,
                    )
                  }
                  className={`
                    min-w-[140px]
                    rounded-[13px]
                    border
                    px-3
                    py-2.5
                    text-left
                    transition-all
                    duration-300

                    ${
                      selected
                        ? "border-[#0057B8]/25 bg-[#12364E] shadow-[0_8px_18px_rgba(18,54,78,0.10)]"
                        : "border-white/70 bg-white/28 hover:border-[#aac5d2] hover:bg-white/50"
                    }
                  `}
                >
                  <p
                    className={`
                      truncate
                      text-[10px]
                      font-semibold

                      ${
                        selected
                          ? "text-white"
                          : "text-[#315a70]"
                      }
                    `}
                  >
                    {
                      machine.name
                    }
                  </p>

                  <p
                    className={`
                      mt-1
                      text-[9px]
                      uppercase
                      tracking-[0.07em]

                      ${
                        selected
                          ? "text-[#8ccbf2]"
                          : "text-[#80939d]"
                      }
                    `}
                  >
                    {
                      getMatchLabel(
                        match.level,
                      )
                    }
                  </p>
                </button>
              );
            },
          )}
      </div>
    </div>
  );
}

/* ============================================================
 * PONTO TÉCNICO
 * ============================================================ */

function TechnicalPoint({
  text,
  warning = false,
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`
          mt-[6px]
          h-1.5
          w-1.5
          shrink-0
          rounded-full

          ${
            warning
              ? "bg-[#d39a4a]"
              : "bg-[#0057B8]"
          }
        `}
      />

      <p className="text-[11px] leading-5 text-[#6d8390]">
        {text}
      </p>
    </div>
  );
}

/* ============================================================
 * VAZIO
 * ============================================================ */

function EmptyTechnicalGraphic() {
  const reduceMotion =
    useReducedMotion();

  return (
    <motion.div
      animate={
        reduceMotion
          ? undefined
          : {
              y: [
                0,
                -4,
                0,
              ],
            }
      }
      transition={{
        duration: 6,
        repeat:
          Infinity,
        ease:
          "easeInOut",
      }}
      className="relative z-20 flex h-20 w-20 items-center justify-center rounded-full border border-[#65B8EE]/40 bg-[#071F2D]/78 text-[27px] font-light text-white shadow-[0_12px_30px_rgba(7,31,45,0.14)] backdrop-blur-[14px]"
    >
      +
    </motion.div>
  );
}

/* ============================================================
 * COPY POR ETAPA
 * ============================================================ */

function getStageCopy(
  step,
) {
  if (
    step <=
    2
  ) {
    return {
      eyebrow:
        "Mapeando aplicação",

      title:
        "A solução começa a tomar forma.",

      description:
        "As características iniciais da peça já começam a reduzir o conjunto de possibilidades.",

      progressLabel:
        "Definição inicial",
    };
  }

  if (
    step ===
    3
  ) {
    return {
      eyebrow:
        "Entendendo a peça",

      title:
        "O contexto físico começa a pesar na análise.",

      description:
        "Porte e condição de atendimento ajudam a separar tecnologias com aplicações diferentes.",

      progressLabel:
        "Definição da aplicação",
    };
  }

  if (
    step ===
    4
  ) {
    return {
      eyebrow:
        "Analisando requisitos",

      title:
        "Agora comparamos objetivos técnicos.",

      description:
        "As necessidades informadas começam a destacar tecnologias com maior aderência ao projeto.",

      progressLabel:
        "Definição técnica",
    };
  }

  if (
    step ===
    5
  ) {
    return {
      eyebrow:
        "Avaliando critérios",

      title:
        "Os critérios decisivos refinam a seleção.",

      description:
        "Precisão, detalhe, região de interesse e geometria passam a ter maior peso na orientação.",

      progressLabel:
        "Aderência técnica",
    };
  }

  if (
    step ===
    6
  ) {
    return {
      eyebrow:
        "Validando condições",

      title:
        "As condições reais refinam a estratégia.",

      description:
        "Superfície, acesso, documentação e demais condições complementam a avaliação.",

      progressLabel:
        "Definição da estratégia",
    };
  }

  return {
    eyebrow:
      "Refinando solução",

    title:
      "Estamos fechando a orientação inicial.",

    description:
      "Os últimos pontos ajudam a consolidar a tecnologia com maior aderência ao cenário informado.",

    progressLabel:
      "Definição da orientação",
  };
}

/* ============================================================
 * LABELS
 * ============================================================ */

function getDefinitionLabel(
  score,
) {
  const value =
    Number(
      score,
    ) ||
    0;

  if (
    value >=
    85
  ) {
    return "Muito definida";
  }

  if (
    value >=
    65
  ) {
    return "Bem definida";
  }

  if (
    value >=
    40
  ) {
    return "Em definição";
  }

  return "Exploratória";
}

function getDefinitionDescription(
  score,
) {
  if (
    score >=
    85
  ) {
    return "Cenário técnico consistente.";
  }

  if (
    score >=
    65
  ) {
    return "Bons critérios para comparação.";
  }

  if (
    score >=
    40
  ) {
    return "Critérios importantes já identificados.";
  }

  return "Construindo contexto técnico.";
}

function getMatchLabel(
  level,
) {
  const labels = {
    candidate:
      "Candidata",

    high:
      "Alta aderência",

    good:
      "Boa aderência",

    possible:
      "Possível",

    low:
      "Baixa prioridade",

    review:
      "Requer avaliação",
  };

  return (
    labels[
      level
    ] ??
    "Em análise"
  );
}

/* ============================================================
 * NORMALIZAÇÃO
 * ============================================================ */

function normalizeMachineId(
  value,
) {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return (
      value.machineId ??
      value.id ??
      null
    );
  }

  return null;
}

function normalizeMachineList(
  list,
) {
  if (
    !Array.isArray(
      list,
    )
  ) {
    return [];
  }

  return Array.from(
    new Set(
      list
        .map(
          normalizeMachineId,
        )
        .filter(
          Boolean,
        ),
    ),
  );
}

function collectMachineMatches(
  recommendation,
) {
  if (
    Array.isArray(
      recommendation.machineMatches,
    ) &&
    recommendation.machineMatches.length >
      0
  ) {
    return recommendation.machineMatches;
  }

  const collected =
    [];

  for (
    const piece of recommendation.pieces ??
    []
  ) {
    for (
      const service of piece.services ??
      []
    ) {
      for (
        const match of service.matches ??
        []
      ) {
        const existing =
          collected.find(
            (
              item,
            ) =>
              item.machineId ===
              match.machineId,
          );

        if (!existing) {
          collected.push(
            match,
          );

          continue;
        }

        if (
          Number(
            match.score,
          ) >
          Number(
            existing.score,
          )
        ) {
          const index =
            collected.indexOf(
              existing,
            );

          collected[
            index
          ] =
            match;
        }
      }
    }
  }

  return collected.sort(
    (
      a,
      b,
    ) =>
      Number(
        b.score,
      ) -
      Number(
        a.score,
      ),
  );
}

function collectPrimaryMachines(
  recommendation,
) {
  const machines =
    [];

  for (
    const piece of recommendation.pieces ??
    []
  ) {
    for (
      const service of piece.services ??
      []
    ) {
      const machineId =
        normalizeMachineId(
          service.primaryMachine,
        );

      if (
        machineId &&
        !machines.includes(
          machineId,
        )
      ) {
        machines.push(
          machineId,
        );
      }
    }
  }

  return machines;
}