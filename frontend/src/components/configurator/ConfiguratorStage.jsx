import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getMachineProfile,
} from "./data/machineProfiles";

import {
  getService,
} from "./data/serviceCatalog";

export function ConfiguratorStage({
  state,
  recommendation,
}) {
  if (state.currentStep === 1) {
    return (
      <ExplorationStage
        machines={
          recommendation.activeMachines
        }
      />
    );
  }

  if (state.currentStep === 5) {
    return (
      <SolutionStage
        state={state}
        recommendation={
          recommendation
        }
      />
    );
  }

  return (
    <EvaluationStage
      step={state.currentStep}
      recommendation={
        recommendation
      }
    />
  );
}

function ExplorationStage({
  machines,
}) {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const machineKey =
    machines.join("|");

  useEffect(() => {
    setActiveIndex(0);
  }, [machineKey]);

  useEffect(() => {
    if (machines.length <= 1) {
      return undefined;
    }

    const timer =
      window.setInterval(() => {
        setActiveIndex(
          (current) =>
            (current + 1) %
            machines.length,
        );
      }, 4500);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    machineKey,
    machines.length,
  ]);

  if (machines.length === 0) {
    return (
      <StageShell>
        <StageEyebrow>
          Exploração
        </StageEyebrow>

        <h3 className="mt-3 max-w-lg text-2xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-3xl">
          Vamos descobrir a solução juntos.
        </h3>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#68808e]">
          Selecione uma necessidade para começar a explorar as tecnologias
          relacionadas ao projeto.
        </p>

        <EmptyTechnicalGraphic />
      </StageShell>
    );
  }

  const safeIndex =
    activeIndex >= 0 &&
    activeIndex < machines.length
      ? activeIndex
      : 0;

  const activeMachineId =
    machines[safeIndex];

  const activeMachine =
    activeMachineId
      ? getMachineProfile(
          activeMachineId,
        )
      : null;

  if (!activeMachine) {
    return (
      <StageShell>
        <StageEyebrow>
          Exploração
        </StageEyebrow>

        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0b2340]">
          Atualizando tecnologias...
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#68808e]">
          Estamos reorganizando as possibilidades de acordo com sua seleção.
        </p>

        <EmptyTechnicalGraphic />
      </StageShell>
    );
  }

  function previous() {
    setActiveIndex(
      (current) => {
        const currentSafe =
          current >= 0 &&
          current < machines.length
            ? current
            : 0;

        return currentSafe === 0
          ? machines.length - 1
          : currentSafe - 1;
      },
    );
  }

  function next() {
    setActiveIndex(
      (current) => {
        const currentSafe =
          current >= 0 &&
          current < machines.length
            ? current
            : 0;

        return (
          (currentSafe + 1) %
          machines.length
        );
      },
    );
  }

  return (
    <StageShell>
      <StageEyebrow>
        Tecnologias relacionadas
      </StageEyebrow>

      <div className="mt-3 flex items-start justify-between gap-5">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-3xl">
            Explore as possibilidades.
          </h3>

          <p className="mt-2 max-w-lg text-xs leading-5 text-[#6e8492] sm:text-sm sm:leading-6">
            Nenhuma tecnologia foi priorizada. As próximas respostas irão
            determinar quais opções fazem mais sentido para a aplicação.
          </p>
        </div>

        <span className="hidden shrink-0 rounded-full border border-[#bacfdb] bg-[#e4eff5] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#4d7891] sm:block">
          Candidatas
        </span>
      </div>

      <div className="relative mt-6 min-h-[400px] overflow-hidden rounded-[24px] border border-[#cbd9e1] bg-[#dce7ed] sm:min-h-[470px]">
        <StageBackground />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMachine.id}
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.96,
              filter: "blur(7px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -12,
              scale: 0.97,
              filter: "blur(6px)",
            }}
            transition={{
              duration: 0.55,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="relative z-10 flex min-h-[400px] flex-col items-center justify-center px-5 pb-24 pt-10 sm:min-h-[470px]"
          >
            <div className="relative flex h-[230px] w-full max-w-[480px] items-center justify-center sm:h-[290px]">
              <TechnicalRings />

              <img
                src={
                  activeMachine.image
                }
                alt={
                  activeMachine.name
                }
                className="relative z-10 max-h-[220px] max-w-[88%] object-contain drop-shadow-[0_25px_30px_rgba(31,67,91,0.15)] sm:max-h-[280px]"
              />
            </div>

            <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#56809a]">
              {
                activeMachine.category
              }
            </p>

            <h4 className="mt-2 text-center text-xl font-semibold text-[#143a52] sm:text-2xl">
              {activeMachine.name}
            </h4>

            <p className="mt-2 max-w-md text-center text-xs leading-5 text-[#687f8d]">
              {
                activeMachine.description
              }
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-4 sm:inset-x-6 sm:bottom-5">
          <button
            type="button"
            onClick={previous}
            aria-label="Tecnologia anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b6cad5] bg-[#eef4f7]/90 text-[#416c84] backdrop-blur transition hover:border-[#78a7c2] hover:bg-white"
          >
            ←
          </button>

          <div className="flex items-center gap-1.5">
            {machines.map(
              (
                machine,
                index,
              ) => (
                <button
                  key={machine}
                  type="button"
                  aria-label={`Ver tecnologia ${index + 1}`}
                  onClick={() =>
                    setActiveIndex(
                      index,
                    )
                  }
                  className={`
                    h-2
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      index ===
                      safeIndex
                        ? "w-7 bg-[#1476b8]"
                        : "w-2 bg-[#9db6c4] hover:bg-[#779bae]"
                    }
                  `}
                />
              ),
            )}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Próxima tecnologia"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b6cad5] bg-[#eef4f7]/90 text-[#416c84] backdrop-blur transition hover:border-[#78a7c2] hover:bg-white"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-[16px] border border-[#cad9e1] bg-[#e8f1f5] px-4 py-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6c8695]">
            Explorando
          </p>

          <p className="mt-1 text-xs font-semibold text-[#31566d]">
            {activeMachine.name}
          </p>
        </div>

        <span className="shrink-0 text-[10px] font-medium text-[#698494]">
          {safeIndex + 1} /{" "}
          {machines.length}
        </span>
      </div>
    </StageShell>
  );
}

function EvaluationStage({
  step,
  recommendation,
}) {
  const matches =
    recommendation.machineMatches;

  const [
    selectedId,
    setSelectedId,
  ] = useState(
    matches[0]?.machineId ??
      null,
  );

  useEffect(() => {
    if (matches.length === 0) {
      setSelectedId(null);
      return;
    }

    const exists =
      matches.some(
        (match) =>
          match.machineId ===
          selectedId,
      );

    if (!exists) {
      setSelectedId(
        matches[0].machineId,
      );
    }
  }, [
    matches,
    selectedId,
  ]);

  const selectedMatch =
    matches.find(
      (match) =>
        match.machineId ===
        selectedId,
    ) ??
    matches[0];

  const stageTitle =
    step === 2
      ? "O projeto começa a tomar forma."
      : step === 3
        ? "As tecnologias estão sendo avaliadas."
        : "Estamos refinando sua configuração.";

  const stageLabel =
    step === 2
      ? "Pré-seleção"
      : step === 3
        ? "Avaliação técnica"
        : "Refinamento";

  if (!selectedMatch) {
    return (
      <StageShell>
        <StageEyebrow>
          {stageLabel}
        </StageEyebrow>

        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0b2340]">
          Precisamos de mais informações.
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#68808e]">
          Continue preenchendo o projeto para que as tecnologias relacionadas
          possam ser avaliadas.
        </p>

        <EmptyTechnicalGraphic />
      </StageShell>
    );
  }

  const machine =
    getMachineProfile(
      selectedMatch.machineId,
    );

  if (!machine) {
    return (
      <StageShell>
        <StageEyebrow>
          {stageLabel}
        </StageEyebrow>

        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0b2340]">
          Atualizando avaliação...
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#68808e]">
          O conjunto de tecnologias está sendo reorganizado conforme suas
          respostas.
        </p>

        <EmptyTechnicalGraphic />
      </StageShell>
    );
  }

  return (
    <StageShell>
      <StageEyebrow>
        {stageLabel}
      </StageEyebrow>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-3xl">
            {stageTitle}
          </h3>

          <p className="mt-2 max-w-lg text-xs leading-5 text-[#6e8492] sm:text-sm sm:leading-6">
            {recommendation.summary}
          </p>
        </div>

        <DefinitionPill
          score={
            recommendation.definitionScore
          }
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-[#cbd9e1] bg-[#dce7ed]">
        <div className="relative min-h-[330px] overflow-hidden px-5 py-7 sm:min-h-[390px] sm:px-7">
          <StageBackground />

          <AnimatePresence mode="wait">
            <motion.div
              key={machine.id}
              initial={{
                opacity: 0,
                y: 16,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.97,
              }}
              transition={{
                duration: 0.45,
              }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="relative flex h-[190px] w-full items-center justify-center sm:h-[240px]">
                <TechnicalRings />

                <img
                  src={machine.image}
                  alt={machine.name}
                  className="relative z-10 max-h-[180px] max-w-[85%] object-contain drop-shadow-[0_22px_28px_rgba(31,67,91,0.16)] sm:max-h-[230px]"
                />
              </div>

              <MatchBadge
                match={
                  selectedMatch
                }
              />

              <h4 className="mt-3 text-xl font-semibold text-[#17394f]">
                {machine.name}
              </h4>

              <p className="mt-1 text-center text-[10px] uppercase tracking-[0.11em] text-[#688499]">
                {machine.category}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-[#c9d7df] bg-[#edf3f6] p-4 sm:p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5f8094]">
            Por que esta tecnologia está nessa posição?
          </p>

          {selectedMatch.reasons.length >
          0 ? (
            <div className="mt-3 space-y-2">
              {selectedMatch.reasons
                .slice(0, 3)
                .map((reason) => (
                  <TechnicalPoint
                    key={reason}
                    symbol="+"
                    text={reason}
                  />
                ))}
            </div>
          ) : (
            <p className="mt-3 text-xs leading-5 text-[#758b97]">
              Ainda não existem critérios suficientes para explicar uma
              prioridade técnica.
            </p>
          )}

          {selectedMatch.warnings.length >
            0 && (
            <div className="mt-3 space-y-2">
              {selectedMatch.warnings
                .slice(0, 2)
                .map((warning) => (
                  <TechnicalPoint
                    key={warning}
                    symbol="△"
                    text={warning}
                    warning
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {matches.length > 1 && (
        <div className="mt-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#6e8593]">
            Tecnologias em avaliação
          </p>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {matches.map(
              (match) => {
                const profile =
                  getMachineProfile(
                    match.machineId,
                  );

                if (!profile) {
                  return null;
                }

                const selected =
                  match.machineId ===
                  selectedMatch.machineId;

                return (
                  <button
                    key={
                      match.machineId
                    }
                    type="button"
                    onClick={() =>
                      setSelectedId(
                        match.machineId,
                      )
                    }
                    className={`
                      flex
                      items-center
                      justify-between
                      gap-3
                      rounded-[14px]
                      border
                      px-3
                      py-3
                      text-left
                      transition-all

                      ${
                        selected
                          ? "border-[#64a2c8] bg-[#e0eef6]"
                          : "border-[#ccd9e0] bg-[#edf3f6] hover:border-[#a9c0cd]"
                      }
                    `}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#31566d]">
                        {profile.name}
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.08em] text-[#7a909c]">
                        {matchLabel(
                          match.level,
                        )}
                      </p>
                    </div>

                    <span className="text-[#5a839a]">
                      →
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>
      )}

      {recommendation.insights.length >
        0 && (
        <div className="mt-4 rounded-[18px] border border-[#c7d8e1] bg-[#e5eff5] p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#5f8094]">
            O que entendemos até agora
          </p>

          <div className="mt-3 space-y-2">
            {recommendation.insights
              .slice(0, 4)
              .map((insight) => (
                <TechnicalPoint
                  key={insight}
                  symbol="●"
                  text={insight}
                />
              ))}
          </div>
        </div>
      )}
    </StageShell>
  );
}

function SolutionStage({
  state,
  recommendation,
}) {
  const primaryMachines =
    useMemo(
      () =>
        Array.from(
          new Set(
            recommendation.pieces.flatMap(
              (piece) =>
                piece.services
                  .map(
                    (service) =>
                      service.primaryMachine,
                  )
                  .filter(Boolean),
            ),
          ),
        ),
      [recommendation],
    );

  return (
    <StageShell>
      <StageEyebrow>
        Configuração preliminar
      </StageEyebrow>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-3xl">
            Esta é a solução que construímos.
          </h3>

          <p className="mt-2 max-w-lg text-xs leading-5 text-[#6e8492] sm:text-sm sm:leading-6">
            A configuração reúne as tecnologias com maior aderência às
            informações fornecidas e será validada pela equipe técnica.
          </p>
        </div>

        <DefinitionPill
          score={
            recommendation.definitionScore
          }
        />
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[24px] border border-[#cbd9e1] bg-[#dce7ed] p-4 sm:p-6">
        <StageBackground />

        {primaryMachines.length >
        0 ? (
          <div
            className={`
              relative
              z-10
              grid
              gap-4

              ${
                primaryMachines.length >
                1
                  ? "sm:grid-cols-2"
                  : ""
              }
            `}
          >
            {primaryMachines.map(
              (machineId) => {
                const machine =
                  getMachineProfile(
                    machineId,
                  );

                if (!machine) {
                  return null;
                }

                return (
                  <motion.div
                    key={machineId}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="flex min-h-[270px] flex-col items-center justify-center rounded-[20px] border border-[#c1d1da] bg-[#e7eff3]/75 p-4 backdrop-blur-sm"
                  >
                    <div className="relative flex h-[170px] w-full items-center justify-center">
                      <TechnicalRings />

                      <img
                        src={
                          machine.image
                        }
                        alt={
                          machine.name
                        }
                        className="relative z-10 max-h-[160px] max-w-[90%] object-contain drop-shadow-[0_18px_25px_rgba(31,67,91,0.15)]"
                      />
                    </div>

                    <h4 className="mt-3 text-center text-base font-semibold text-[#17394f]">
                      {machine.name}
                    </h4>

                    <p className="mt-1 text-center text-[9px] uppercase tracking-[0.1em] text-[#6d8797]">
                      {machine.category}
                    </p>
                  </motion.div>
                );
              },
            )}
          </div>
        ) : (
          <p className="relative z-10 py-16 text-center text-sm text-[#6b8290]">
            A configuração precisa de mais informações antes de destacar uma
            tecnologia principal.
          </p>
        )}
      </div>

      <div className="mt-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#6c8594]">
          Estratégia preliminar
        </p>

        <div className="mt-3 space-y-3">
          {recommendation.pieces.map(
            (
              piece,
              index,
            ) => {
              const sourcePiece =
                state.pieces.find(
                  (item) =>
                    item.id ===
                    piece.pieceId,
                );

              return (
                <div
                  key={piece.pieceId}
                  className="rounded-[18px] border border-[#ccd9e1] bg-[#edf3f6] p-4"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#708796]">
                    Peça{" "}
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}{" "}
                    ·{" "}
                    {sourcePiece?.name ||
                      "Componente"}
                  </p>

                  <div className="mt-3 space-y-2">
                    {piece.services.map(
                      (service) => {
                        const machine =
                          service.primaryMachine
                            ? getMachineProfile(
                                service.primaryMachine,
                              )
                            : null;

                        return (
                          <div
                            key={
                              service.service
                            }
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bfd1db] bg-white text-[11px] text-[#4d7992]">
                              →
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold text-[#31566d]">
                                {
                                  getService(
                                    service.service,
                                  ).name
                                }
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#768b97]">
                                {machine
                                  ? machine.name
                                  : "Avaliação técnica necessária"}
                              </p>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      <div className="mt-4 rounded-[18px] border border-[#bfd2dd] bg-[#e5eff5] p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#5c7f94]">
          Importante
        </p>

        <p className="mt-2 text-[11px] leading-5 text-[#6b8290]">
          O resultado representa uma orientação inicial. A estratégia final de
          medição, aquisição e processamento depende da validação da equipe
          técnica e das condições reais da peça.
        </p>
      </div>
    </StageShell>
  );
}

function StageShell({
  children,
}) {
  return (
    <aside className="relative rounded-[26px] border border-[#c8d6df] bg-[#eef3f6] p-5 shadow-[0_24px_65px_rgba(34,67,90,0.08)] sm:p-6 lg:sticky lg:top-6">
      {children}
    </aside>
  );
}

function StageEyebrow({
  children,
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-2 w-2 rounded-full bg-[#1684c5] shadow-[0_0_0_5px_rgba(22,132,197,0.09)]" />

      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#58809a]">
        {children}
      </p>
    </div>
  );
}

function DefinitionPill({
  score,
}) {
  return (
    <div className="hidden shrink-0 text-right sm:block">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#728a98]">
        Definição
      </p>

      <p className="mt-1 text-xl font-semibold text-[#1476b8]">
        {score}%
      </p>
    </div>
  );
}

function MatchBadge({
  match,
}) {
  return (
    <span className="rounded-full border border-[#aac7d7] bg-[#e7f1f6] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#3d708e]">
      {matchLabel(
        match.level,
      )}
    </span>
  );
}

function matchLabel(level) {
  return {
    candidate:
      "Tecnologia candidata",
    high:
      "Alta aderência",
    good:
      "Boa aderência",
    possible:
      "Possível aplicação",
    low:
      "Baixa prioridade",
    review:
      "Avaliação necessária",
  }[level];
}

function TechnicalPoint({
  symbol,
  text,
  warning = false,
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`
          mt-[1px]
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          text-[9px]
          font-semibold

          ${
            warning
              ? "bg-[#f1ebe1] text-[#8a7047]"
              : "bg-[#dcecf5] text-[#397392]"
          }
        `}
      >
        {symbol}
      </span>

      <p className="text-[11px] leading-5 text-[#647d8b]">
        {text}
      </p>
    </div>
  );
}

function TechnicalRings() {
  return (
    <>
      <motion.div
        aria-hidden="true"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute h-[180px] w-[180px] rounded-full border border-[#5d94b5]/20 sm:h-[230px] sm:w-[230px]"
      >
        <span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-[#6da4c4]/70" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute h-[130px] w-[130px] rounded-full border border-dashed border-[#7ba5bd]/20 sm:h-[170px] sm:w-[170px]"
      />
    </>
  );
}

function StageBackground() {
  return (
    <>
      <div className="pointer-events-none absolute -right-24 -top-24 h-[250px] w-[250px] rounded-full border border-[#5e8eaa]/10" />

      <div className="pointer-events-none absolute -bottom-20 -left-24 h-[230px] w-[230px] rounded-full border border-[#5e8eaa]/10" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.68),transparent_55%)]" />
    </>
  );
}

function EmptyTechnicalGraphic() {
  return (
    <div className="relative mx-auto mt-10 flex h-[260px] max-w-[460px] items-center justify-center">
      <TechnicalRings />

      <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#aac2d0] bg-[#e2ecf1]">
        <span className="text-3xl font-light text-[#6c95ad]">
          +
        </span>
      </div>
    </div>
  );
}