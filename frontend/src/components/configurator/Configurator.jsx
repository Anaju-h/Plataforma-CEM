import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ConfiguratorProgress,
} from "./ConfiguratorProgress";

import {
  ConfiguratorStage,
} from "./ConfiguratorStage";

import {
  NeedStep,
} from "./steps/NeedStep";

import {
  PieceStep,
} from "./steps/PieceStep";

import {
  RequirementsStep,
} from "./steps/RequirementsStep";

import {
  RefinementStep,
} from "./steps/RefinementStep";

import {
  RequestStep,
} from "./steps/RequestStep";

import {
  buildProjectRecommendation,
} from "./engine/recommendationEngine";

import {
  buildRefinementQuestions,
} from "./engine/refinementEngine";

import {
  clearRemovedServiceRequirements,
  createInitialConfiguratorState,
  createPieceConfiguration,
  duplicatePieceConfiguration,
} from "./state/configuratorDefaults";

export function Configurator() {
  const [
    state,
    setState,
  ] = useState(
    () =>
      createInitialConfiguratorState(),
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const contentRef =
    useRef(null);

  const recommendation =
    useMemo(
      () =>
        buildProjectRecommendation(
          state,
        ),
      [state],
    );

  const refinementQuestions =
    useMemo(
      () =>
        buildRefinementQuestions(
          state,
        ),
      [state],
    );

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);

    return () =>
      window.clearTimeout(timer);
  }, [
    state.currentStep,
  ]);

  function goToStep(step) {
    if (
      step >
      state.highestStep
    ) {
      return;
    }

    setState(
      (current) => ({
        ...current,
        currentStep: step,
      }),
    );
  }

  function goBack() {
    if (
      state.currentStep === 1
    ) {
      return;
    }

    const previousStep =
      state.currentStep - 1;

    setState(
      (current) => ({
        ...current,
        currentStep:
          previousStep,
      }),
    );
  }

  function goNext() {
    if (
      !canContinueCurrentStep(
        state,
      )
    ) {
      return;
    }

    if (
      state.currentStep === 5
    ) {
      return;
    }

    let nextStep =
      state.currentStep + 1;

    if (
      state.currentStep === 3 &&
      refinementQuestions.length ===
        0
    ) {
      nextStep = 4;
    }

    setState(
      (current) => ({
        ...current,

        currentStep:
          nextStep,

        highestStep:
          Math.max(
            current.highestStep,
            nextStep,
          ),
      }),
    );
  }

  function handleProjectServicesChange(
    services,
  ) {
    setState(
      (current) => ({
        ...current,

        projectServices:
          services,

        pieces:
          current.pieces.map(
            (
              piece,
              index,
            ) => {
              if (index !== 0) {
                return piece;
              }

              return clearRemovedServiceRequirements(
                piece,
                services,
              );
            },
          ),
      }),
    );
  }

  function handlePiecesChange(
    nextPieces,
  ) {
    setState(
      (current) => ({
        ...current,

        pieces:
          current.pieces.map(
            (oldPiece) => {
              const nextPiece =
                nextPieces.find(
                  (piece) =>
                    piece.id ===
                    oldPiece.id,
                );

              if (!nextPiece) {
                return oldPiece;
              }

              return clearRemovedServiceRequirements(
                {
                  ...nextPiece,
                  requirements:
                    nextPiece.requirements,
                },
                nextPiece.services,
              );
            },
          ),
      }),
    );

    setState(
      (current) => {
        const currentIds =
          new Set(
            current.pieces.map(
              (piece) =>
                piece.id,
            ),
          );

        const newPieces =
          nextPieces.filter(
            (piece) =>
              !currentIds.has(
                piece.id,
              ),
          );

        if (!newPieces.length) {
          return current;
        }

        return {
          ...current,

          pieces: [
            ...current.pieces,
            ...newPieces,
          ],
        };
      },
    );
  }

  function handleActivePieceChange(
    pieceId,
  ) {
    setState(
      (current) => ({
        ...current,
        activePieceId:
          pieceId,
      }),
    );
  }

  function handleAddPiece() {
    const newPiece =
      createPieceConfiguration(
        state.projectServices,
      );

    setState(
      (current) => ({
        ...current,

        pieces: [
          ...current.pieces,
          newPiece,
        ],

        activePieceId:
          newPiece.id,
      }),
    );
  }

  function handleDuplicatePiece(
    pieceId,
  ) {
    const source =
      state.pieces.find(
        (piece) =>
          piece.id ===
          pieceId,
      );

    if (!source) {
      return;
    }

    const copy =
      duplicatePieceConfiguration(
        source,
      );

    setState(
      (current) => ({
        ...current,

        pieces: [
          ...current.pieces,
          copy,
        ],

        activePieceId:
          copy.id,
      }),
    );
  }

  function handleRemovePiece(
    pieceId,
  ) {
    if (
      state.pieces.length <= 1
    ) {
      return;
    }

    const nextPieces =
      state.pieces.filter(
        (piece) =>
          piece.id !==
          pieceId,
      );

    setState(
      (current) => ({
        ...current,

        pieces:
          nextPieces,

        activePieceId:
          current.activePieceId ===
          pieceId
            ? nextPieces[0].id
            : current.activePieceId,
      }),
    );
  }

  async function handleSubmit() {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      /*
       * Futuramente esta parte chamará o backend.
       *
       * Exemplo:
       *
       * await createRequest({
       *   source: "configurator",
       *   state,
       *   recommendation,
       * });
       */

      await new Promise(
        (resolve) =>
          window.setTimeout(
            resolve,
            500,
          ),
      );

      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setState(
      createInitialConfiguratorState(),
    );

    setSubmitted(false);
  }

  if (submitted) {
    return (
      <section className="min-h-[70vh] bg-[#e4ebf0] px-4 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[820px]">
          <div className="rounded-[30px] border border-[#c7d6de] bg-[#f1f6f8] p-7 text-center shadow-[0_25px_70px_rgba(34,67,90,0.08)] sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#9fc4ad] bg-[#e5f0e8] text-xl text-[#356c4b]">
              ✓
            </div>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#56809a]">
              Configuração concluída
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0b2340]">
              Projeto preparado para análise.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#667d8b]">
              A experiência do configurador foi concluída. Quando conectarmos
              o backend, esta ação passará a criar uma solicitação real para o
              painel administrativo.
            </p>

            <button
              type="button"
              onClick={restart}
              className="mt-7 rounded-xl border border-[#a9c1cf] bg-[#e5eff5] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#3d708e] transition hover:border-[#70a7c8] hover:bg-[#dcebf3]"
            >
              Nova configuração
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#e4ebf0] text-[#102a43]">
      <div className="border-b border-[#cbd8e0] bg-[#eef3f6]">
        <div className="mx-auto max-w-[1520px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-12">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#356f9f]">
                  Experiência guiada
                </p>

                <div className="h-px w-8 bg-[#79acd0]" />
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0b2340] sm:text-4xl">
                Configure seu projeto.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#617887]">
                Entenda as possibilidades, descreva sua aplicação e construa
                uma orientação técnica inicial junto com o Centro.
              </p>
            </div>

            <ConfiguratorProgress
              currentStep={
                state.currentStep
              }
              highestStep={
                state.highestStep
              }
              onStepChange={
                goToStep
              }
            />
          </div>
        </div>
      </div>

      <div
        ref={contentRef}
        className="scroll-mt-5"
      />

      <div className="mx-auto max-w-[1520px] px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div
          className={`
            grid
            items-start
            gap-5
            xl:gap-8

            ${
              state.currentStep === 5
                ? "lg:grid-cols-[minmax(460px,1fr)_minmax(560px,0.95fr)]"
                : "lg:grid-cols-[minmax(410px,0.92fr)_minmax(560px,1.08fr)]"
            }
          `}
        >
          <div className="order-2 lg:order-1">
            <ConfiguratorStage
              state={state}
              recommendation={
                recommendation
              }
            />
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-visible rounded-[26px] border border-[#c9d7df] bg-[#f5f9fb] shadow-[0_22px_65px_rgba(34,67,90,0.08)] sm:rounded-[30px]">
              <div className="px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
                {state.currentStep ===
                  1 && (
                  <NeedStep
                    value={
                      state.projectServices
                    }
                    onChange={
                      handleProjectServicesChange
                    }
                  />
                )}

                {state.currentStep ===
                  2 && (
                  <PieceStep
                    pieces={
                      state.pieces
                    }
                    activePieceId={
                      state.activePieceId
                    }
                    onActivePieceChange={
                      handleActivePieceChange
                    }
                    onPiecesChange={
                      handlePiecesChange
                    }
                    onAddPiece={
                      handleAddPiece
                    }
                    onDuplicatePiece={
                      handleDuplicatePiece
                    }
                    onRemovePiece={
                      handleRemovePiece
                    }
                  />
                )}

                {state.currentStep ===
                  3 && (
                  <RequirementsStep
                    pieces={
                      state.pieces
                    }
                    activePieceId={
                      state.activePieceId
                    }
                    onActivePieceChange={
                      handleActivePieceChange
                    }
                    onPiecesChange={
                      handlePiecesChange
                    }
                  />
                )}

                {state.currentStep ===
                  4 && (
                  <RefinementStep
                    state={state}
                    definitionScore={
                      recommendation.definitionScore
                    }
                    onStateChange={
                      setState
                    }
                  />
                )}

                {state.currentStep ===
                  5 && (
                  <RequestStep
                    state={state}
                    recommendation={
                      recommendation
                    }
                    onStateChange={
                      setState
                    }
                    onSubmit={
                      handleSubmit
                    }
                    submitting={
                      submitting
                    }
                  />
                )}
              </div>

              {state.currentStep < 5 && (
                <div className="sticky bottom-0 z-40 border-t border-[#d4dfe5] bg-[#edf3f6]/95 px-4 py-4 backdrop-blur-xl sm:px-7 lg:static lg:bg-[#edf3f6] lg:px-8">
                  <div className="flex gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      disabled={
                        state.currentStep ===
                        1
                      }
                      onClick={goBack}
                      className="
                        flex h-[50px]
                        min-w-[105px]
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[#cbd9e1]
                        bg-[#f8fbfc]
                        px-4
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        text-[#536e7f]
                        transition-all
                        hover:border-[#9eb9c9]
                        hover:bg-white
                        hover:text-[#0b2340]
                        disabled:cursor-not-allowed
                        disabled:opacity-30
                        sm:min-w-[130px]
                      "
                    >
                      ← Voltar
                    </button>

                    <button
                      type="button"
                      disabled={
                        !canContinueCurrentStep(
                          state,
                        )
                      }
                      onClick={goNext}
                      className="
                        group
                        flex h-[50px]
                        flex-1
                        items-center
                        justify-center
                        gap-4
                        rounded-xl
                        bg-[#096ab2]
                        px-5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-white
                        transition-all
                        duration-300
                        hover:bg-[#075b99]
                        hover:shadow-[0_12px_25px_rgba(9,106,178,0.20)]
                        disabled:cursor-not-allowed
                        disabled:bg-[#d5dfe5]
                        disabled:text-[#8e9da6]
                        disabled:shadow-none
                      "
                    >
                      {state.currentStep ===
                      4
                        ? "Ver solução"
                        : "Continuar"}

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>

                  {!canContinueCurrentStep(
                    state,
                  ) && (
                    <p className="mt-2 text-center text-[9px] leading-4 text-[#83949e]">
                      {getValidationMessage(
                        state,
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function canContinueCurrentStep(
  state,
) {
  if (state.currentStep === 1) {
    return (
      state.projectServices.length >
      0
    );
  }

  if (state.currentStep === 2) {
    return state.pieces.every(
      (piece) =>
        piece.services.length >
          0 &&
        Boolean(piece.type) &&
        Boolean(piece.material) &&
        Boolean(piece.quantity) &&
        Boolean(piece.location) &&
        hasPieceSize(piece),
    );
  }

  if (state.currentStep === 3) {
    return state.pieces.every(
      (piece) =>
        piece.services.every(
          (service) =>
            hasMinimumRequirements(
              piece,
              service,
            ),
        ),
    );
  }

  if (state.currentStep === 4) {
    return true;
  }

  return false;
}

function hasPieceSize(piece) {
  const hasExact =
    Boolean(
      piece.dimensions.length &&
        piece.dimensions.width &&
        piece.dimensions.height,
    );

  return Boolean(
    hasExact ||
      piece.sizeCategory,
  );
}

function hasMinimumRequirements(
  piece,
  service,
) {
  if (
    service === "dimensional"
  ) {
    const req =
      piece.requirements.dimensional;

    return (
      req.goals.length > 0 &&
      Boolean(
        req.toleranceKnowledge,
      )
    );
  }

  if (service === "scan") {
    const req =
      piece.requirements.scanning;

    return (
      req.goals.length > 0 &&
      Boolean(
        req.detailLevel,
      )
    );
  }

  if (
    service ===
    "reverse-engineering"
  ) {
    const req =
      piece.requirements
        .reverseEngineering;

    return (
      req.goals.length > 0 &&
      Boolean(
        req.geometryScope,
      )
    );
  }

  const req =
    piece.requirements.ct;

  return (
    req.goals.length > 0 &&
    Boolean(req.region)
  );
}

function getValidationMessage(
  state,
) {
  if (state.currentStep === 1) {
    return "Selecione pelo menos uma necessidade para continuar.";
  }

  if (state.currentStep === 2) {
    return "Complete os dados gerais das peças antes de continuar.";
  }

  if (state.currentStep === 3) {
    return "Complete as informações principais de cada serviço selecionado.";
  }

  return "";
}