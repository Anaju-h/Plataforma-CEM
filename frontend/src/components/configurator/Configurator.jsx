import { Link } from "react-router-dom";
import { PublicRequestCreated } from "../quote/PublicRequestCreated";
import { submitConfiguratorRequest } from "../../services/requestApi";
import { buildConfiguratorRequest } from "./configuratorSubmission";
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
  getMachineProfile,
} from "./data/machineProfiles";

import {
  getService,
} from "./data/serviceCatalog";

import {
  buildProjectRecommendation,
} from "./engine/recommendationEngine";

import {
  clearRemovedServiceRequirements,
  createInitialConfiguratorState,
  createPieceConfiguration,
  duplicatePieceConfiguration,
} from "./state/configuratorDefaults";

/* ============================================================
 * ETAPAS
 * ============================================================ */

const TOTAL_STEPS = 8;

const CONFIGURATOR_STEPS = [
  {
    id: 1,
    label: "Necessidade",
  },
  {
    id: 2,
    label: "Peça",
  },
  {
    id: 3,
    label: "Condição",
  },
  {
    id: 4,
    label: "Requisitos",
  },
  {
    id: 5,
    label: "Critérios",
  },
  {
    id: 6,
    label: "Condições",
  },
  {
    id: 7,
    label: "Refinamento",
  },
  {
    id: 8,
    label: "Resultado",
  },
];

function mapUiStepToEngineStep(
  uiStep,
) {
  const map = {
    1: 1,
    2: 2,
    3: 2,
    4: 3,
    5: 3,
    6: 3,
    7: 4,
    8: 5,
  };

  return (
    map[uiStep] ??
    1
  );
}

/* ============================================================
 * ESTADO INICIAL
 * ============================================================ */

function createConfiguratorState() {
  return {
    ...createInitialConfiguratorState(),

    currentStep: 1,

    highestStep: 1,

    selectedNeedSituations: [],
  };
}

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function Configurator() {
  const [
    state,
    setState,
  ] = useState(
    () =>
      createConfiguratorState(),
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [created, setCreated] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const contentRef =
    useRef(null);

  /* ==========================================================
   * ESTADO PARA O MOTOR
   * ========================================================== */

  const engineState =
    useMemo(
      () => ({
        ...state,

        currentStep:
          mapUiStepToEngineStep(
            state.currentStep,
          ),
      }),
      [state],
    );

  const recommendation =
    useMemo(
      () =>
        buildProjectRecommendation(
          engineState,
        ),
      [engineState],
    );

  /* ==========================================================
   * SCROLL ENTRE ETAPAS
   * ========================================================== */

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          contentRef.current?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start",
          });
        },
        80,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    state.currentStep,
  ]);

  /* ==========================================================
   * NAVEGAÇÃO
   * ========================================================== */

  function goToStep(
    step,
  ) {
    if (
      step >
      state.highestStep
    ) {
      return;
    }

    if (
      step < 1 ||
      step >
        TOTAL_STEPS
    ) {
      return;
    }

    setState(
      (
        current,
      ) => ({
        ...current,

        currentStep:
          step,
      }),
    );
  }

  function goBack() {
    if (
      state.currentStep <=
      1
    ) {
      return;
    }

    setState(
      (
        current,
      ) => ({
        ...current,

        currentStep:
          current.currentStep -
          1,
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
      state.currentStep >=
      TOTAL_STEPS
    ) {
      return;
    }

    const nextStep =
      state.currentStep +
      1;

    setState(
      (
        current,
      ) => ({
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

  /* ==========================================================
   * NECESSIDADE
   * ========================================================== */

  function handleSelectedNeedSituationsChange(
    situations,
  ) {
    setState(
      (
        current,
      ) => ({
        ...current,

        selectedNeedSituations:
          situations,
      }),
    );
  }

  function handleProjectServicesChange(
    services,
  ) {
    setState(
      (
        current,
      ) => ({
        ...current,

        projectServices:
          services,

        pieces:
          current.pieces.map(
            (
              piece,
              index,
            ) => {
              if (
                index !==
                0
              ) {
                return piece;
              }

              return clearRemovedServiceRequirements(
                {
                  ...piece,

                  services,
                },
                services,
              );
            },
          ),
      }),
    );
  }

  /* ==========================================================
   * PEÇAS
   * ========================================================== */

  function handlePiecesChange(
    nextPieces,
  ) {
    setState(
      (
        current,
      ) => ({
        ...current,

        pieces:
          nextPieces.map(
            (
              piece,
            ) =>
              clearRemovedServiceRequirements(
                piece,
                piece.services,
              ),
          ),
      }),
    );
  }

  function handleActivePieceChange(
    pieceId,
  ) {
    setState(
      (
        current,
      ) => ({
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
      (
        current,
      ) => ({
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
        (
          piece,
        ) =>
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
      (
        current,
      ) => ({
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
      state.pieces.length <=
      1
    ) {
      return;
    }

    const nextPieces =
      state.pieces.filter(
        (
          piece,
        ) =>
          piece.id !==
          pieceId,
      );

    setState(
      (
        current,
      ) => ({
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

  /* ==========================================================
   * ENVIO
   * ========================================================== */

  async function handleSubmit() {
    if (
      submitting
    ) {
      return;
    }

    setSubmitting(
      true,
    );

    setSubmitError("");

    try {
      const result =
        await submitConfiguratorRequest(
          buildConfiguratorRequest(
            state,
            recommendation,
          ),
        );

      setCreated(result);

      setSubmitted(
        true,
      );
    } catch (error) {
      setSubmitError(
        error.message,
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }

  function restart() {
    setState(
      createConfiguratorState(),
    );

    setCreated(null);

    setSubmitted(
      false,
    );
  }

  /* ==========================================================
   * SUCESSO
   * ========================================================== */

  if (
    submitted &&
    created?.kind === "public"
  ) {
    return (
      <section className="relative min-h-screen bg-transparent pb-20 pt-10 sm:pt-12">
        <ConfiguratorPageBackground />
        <PublicRequestCreated created={created} />
      </section>
    );
  }

  if (
    submitted
  ) {
    return (
      <section className="relative min-h-screen bg-transparent px-4 pb-20 pt-7 sm:px-8 sm:pt-8 lg:px-10 lg:pt-8">
        <ConfiguratorPageBackground />

        <div className="relative z-10 mx-auto max-w-[860px]">
          <div className="rounded-[28px] border border-white/72 bg-white/48 p-7 text-center shadow-[0_28px_80px_rgba(31,68,92,0.10)] backdrop-blur-[18px] sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#9fc4ad] bg-[#e5f0e8]/84 text-[18px] font-semibold text-[#356c4b]">
              ✓
            </div>

            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#56809a]">
              Configuração enviada · {created?.id}
            </p>

            <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.04em] text-[#071f2d] sm:text-[36px]">
              Projeto preparado para análise.
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-[14px] leading-6 text-[#667d8b]">
              A solicitação {created?.id} foi registrada com a configuração técnica completa. A equipe do
              Centro fará a análise e você acompanha tudo pela área do cliente.
            </p>

            {created?.kind === "customer" && (
              <Link to={`/cliente/solicitacoes/${created.id}`} className="mt-6 inline-block rounded-[12px] bg-[#0057b8] px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#004a9d]">
                Acompanhar solicitação →
              </Link>
            )}

            <button
              type="button"
              onClick={
                restart
              }
              className="mt-7 rounded-[12px] border border-[#9fbccc] bg-[#e3eef4]/82 px-6 py-3 text-[13px] font-semibold text-[#3d708e] transition-all hover:border-[#79a9c2] hover:bg-[#d9eaf2]"
            >
              Nova configuração
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ==========================================================
   * RESULTADO
   * ========================================================== */

  if (
    state.currentStep ===
    8
  ) {
    return (
      <FinalStepLayout
        state={
          state
        }
        recommendation={
          recommendation
        }
        contentRef={
          contentRef
        }
        onStepChange={
          goToStep
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
        submitError={
          submitError
        }
        onBack={
          goBack
        }
      />
    );
  }

  /* ==========================================================
   * ETAPAS 01–07
   * ========================================================== */

  return (
    <section className="relative min-h-screen bg-transparent pb-16 pt-6 text-[#102a43] sm:pt-7 lg:pt-7">
      <ConfiguratorPageBackground />

      <div className="relative z-10">
        {/* ===================================================
            INTRODUÇÃO + PROGRESSO
        =================================================== */}

        <div className="mx-auto max-w-[1520px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-10">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                  Experiência guiada
                </p>

                <div className="h-px w-8 bg-[#79acd0]" />
              </div>

              <h1 className="mt-2.5 text-[34px] font-semibold leading-[1.04] tracking-[-0.045em] text-[#071f2d] sm:text-[38px] lg:text-[40px]">
                Configure seu projeto.
              </h1>

              <p className="mt-2.5 max-w-[600px] text-[14px] leading-6 text-[#617887] sm:text-[15px]">
                Explore as possibilidades, descreva sua aplicação e construa
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
              steps={
                CONFIGURATOR_STEPS
              }
            />
          </div>
        </div>

        <div
          ref={
            contentRef
          }
          className="scroll-mt-[118px]"
        />

        {/* ===================================================
            CONTEÚDO
        =================================================== */}

        <div className="mx-auto max-w-[1520px] px-4 pt-6 sm:px-8 sm:pt-7 lg:px-10 lg:pt-8">
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(430px,0.96fr)_minmax(560px,1.04fr)] xl:grid-cols-[minmax(500px,1fr)_minmax(610px,1fr)] xl:gap-7">
            <div className="order-2 lg:order-1">
              <ConfiguratorStage
                state={
                  state
                }
                recommendation={
                  recommendation
                }
              />
            </div>

            <div className="order-1 lg:order-2">
              <div className="overflow-visible rounded-[24px] border border-white/72 bg-white/38 shadow-[0_24px_70px_rgba(31,68,92,0.08)] backdrop-blur-[18px]">
                <div className="px-5 py-5 sm:px-6 sm:py-6 lg:px-7">
                  {state.currentStep ===
                    1 && (
                    <NeedStep
                      value={
                        state.projectServices
                      }
                      onChange={
                        handleProjectServicesChange
                      }
                      selectedSituations={
                        state.selectedNeedSituations
                      }
                      onSelectedSituationsChange={
                        handleSelectedNeedSituationsChange
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
                      section="identity"
                    />
                  )}

                  {state.currentStep ===
                    3 && (
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
                      section="condition"
                    />
                  )}

                  {state.currentStep ===
                    4 && (
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
                      section="primary"
                    />
                  )}

                  {state.currentStep ===
                    5 && (
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
                      section="detail"
                      detailPage="core"
                    />
                  )}

                  {state.currentStep ===
                    6 && (
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
                      section="detail"
                      detailPage="context"
                    />
                  )}

                  {state.currentStep ===
                    7 && (
                    <RefinementStep
                      state={
                        state
                      }
                      definitionScore={
                        recommendation.definitionScore
                      }
                      onStateChange={
                        setState
                      }
                    />
                  )}
                </div>

                {/* ===========================================
                    NAVEGAÇÃO
                =========================================== */}

                <div className="border-t border-white/64 bg-white/26 px-5 py-4 backdrop-blur-[18px] sm:px-6 lg:px-7">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={
                        state.currentStep ===
                        1
                      }
                      onClick={
                        goBack
                      }
                      className="flex h-[48px] min-w-[112px] items-center justify-center gap-2 rounded-[11px] border border-white/78 bg-white/42 px-4 text-[12px] font-semibold text-[#607b89] transition-all hover:border-[#abc4d0] hover:bg-white/68 hover:text-[#12364e] disabled:cursor-not-allowed disabled:opacity-30 sm:min-w-[128px]"
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
                      onClick={
                        goNext
                      }
                      className="group flex h-[48px] flex-1 items-center justify-center gap-3 rounded-[11px] bg-[#12364e] px-5 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#0d2d41] hover:shadow-[0_12px_25px_rgba(18,54,78,0.15)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#d5dfe5] disabled:text-[#8e9da6] disabled:shadow-none"
                    >
                      {state.currentStep ===
                      7
                        ? "Ver resultado"
                        : "Continuar"}

                      <span className="text-[16px] font-light transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>

                  {!canContinueCurrentStep(
                    state,
                  ) && (
                    <p className="mt-2.5 text-center text-[12px] leading-5 text-[#83949e]">
                      {getValidationMessage(
                        state,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * RESULTADO FINAL
 * ============================================================ */

function FinalStepLayout({
  state,
  recommendation,
  contentRef,
  onStepChange,
  onStateChange,
  onSubmit,
  submitting,
  submitError,
  onBack,
}) {
  return (
    <section className="relative min-h-screen bg-transparent pb-20 pt-7 text-[#102a43] sm:pt-8 lg:pt-8">
      <ConfiguratorPageBackground />

      <div className="relative z-10">
        <div className="mx-auto max-w-[1520px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-10">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                Resultado
              </p>

              <h1 className="mt-2 text-[32px] font-semibold leading-[1.05] tracking-[-0.045em] text-[#071f2d] sm:text-[36px]">
                Sua configuração.
              </h1>

              <p className="mt-2 max-w-[520px] text-[13px] leading-5 text-[#667d8b]">
                Uma orientação inicial construída a partir das informações
                fornecidas.
              </p>
            </div>

            <ConfiguratorProgress
              currentStep={
                8
              }
              highestStep={
                8
              }
              onStepChange={
                onStepChange
              }
              steps={
                CONFIGURATOR_STEPS
              }
            />
          </div>
        </div>

        <div
          ref={
            contentRef
          }
          className="scroll-mt-[118px]"
        />

        <div className="mx-auto max-w-[1520px] px-4 pt-6 sm:px-8 lg:px-10">
          <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(500px,1.03fr)_minmax(500px,0.97fr)] xl:gap-6">
            <ConfiguratorStage
              state={
                state
              }
              recommendation={
                recommendation
              }
            />

            <FinalSummary
              state={
                state
              }
              recommendation={
                recommendation
              }
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={
                onBack
              }
              className="rounded-[10px] border border-white/78 bg-white/36 px-4 py-2.5 text-[12px] font-semibold text-[#66818f] transition-all hover:border-[#aec5d1] hover:bg-white/64 hover:text-[#12364e]"
            >
              ← Voltar e revisar
            </button>
          </div>

          <div className="mt-6 rounded-[26px] border border-white/72 bg-white/34 p-5 shadow-[0_24px_70px_rgba(31,68,92,0.08)] backdrop-blur-[18px] sm:p-6 lg:p-7">
            <RequestStep
              state={
                state
              }
              recommendation={
                recommendation
              }
              onStateChange={
                onStateChange
              }
              onSubmit={
                onSubmit
              }
              submitError={
                submitError
              }
              submitting={
                submitting
              }
              expanded
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * RESUMO FINAL
 * ============================================================ */

function FinalSummary({
  state,
  recommendation,
}) {
  const serviceCount =
    state.pieces.reduce(
      (
        total,
        piece,
      ) =>
        total +
        piece.services.length,
      0,
    );

  const technologies =
    getPrioritizedTechnologies(
      recommendation,
    );

  const insights =
    Array.isArray(
      recommendation.insights,
    )
      ? recommendation.insights.slice(
          0,
          3,
        )
      : [];

  return (
    <div className="flex h-full flex-col rounded-[26px] border border-white/74 bg-white/42 p-6 shadow-[0_24px_70px_rgba(31,68,92,0.09)] backdrop-blur-[18px] sm:p-7">
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[#9fc3d5]/74 bg-[#e2eff5]/82 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4c7890]">
          Resultado
        </span>

        <div className="h-px flex-1 bg-[#bfd2dc]/76" />
      </div>

      <h2 className="mt-5 text-[29px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[31px]">
        Sua orientação inicial está pronta.
      </h2>

      <p className="mt-3 text-[13px] leading-6 text-[#667f8d]">
        O configurador organizou as informações fornecidas e identificou
        tecnologias com maior aderência ao cenário descrito. A definição final
        continua sujeita à validação da equipe técnica.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <ResultMetric
          value={String(
            state.pieces.length,
          ).padStart(
            2,
            "0",
          )}
          label={
            state.pieces.length ===
            1
              ? "Peça configurada"
              : "Peças configuradas"
          }
        />

        <ResultMetric
          value={String(
            serviceCount,
          ).padStart(
            2,
            "0",
          )}
          label={
            serviceCount ===
            1
              ? "Frente analisada"
              : "Frentes analisadas"
          }
        />
      </div>

      <div className="mt-4 rounded-[16px] border border-[#bdd3df]/70 bg-[#e8f2f6]/62 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#628397]">
          Tecnologia priorizada
        </p>

        {technologies.length >
        0 ? (
          <div className="mt-3 space-y-2.5">
            {technologies
              .slice(
                0,
                2,
              )
              .map(
                (
                  technology,
                  index,
                ) => (
                  <div
                    key={`${technology.machineId}-${technology.serviceId}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-[12px] border border-white/72 bg-white/42 px-3.5 py-3"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-[#31566d]">
                        {
                          technology.machineName
                        }
                      </p>

                      <p className="mt-0.5 text-[12px] text-[#7a909b]">
                        {
                          technology.serviceName
                        }
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-[#acd0e0]/76 bg-[#edf6fa]/72 px-2.5 py-1.5 text-[11px] font-semibold text-[#4e7890]">
                      Maior aderência
                    </span>
                  </div>
                ),
              )}
          </div>
        ) : (
          <p className="mt-2 text-[13px] leading-5 text-[#718895]">
            A tecnologia continuará sendo avaliada pela equipe técnica.
          </p>
        )}
      </div>

      <div className="mt-4 rounded-[16px] border border-white/70 bg-white/30 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#6b8796]">
          Por que essa orientação apareceu?
        </p>

        {insights.length >
        0 ? (
          <div className="mt-3 space-y-2.5">
            {insights.map(
              (
                insight,
                index,
              ) => (
                <div
                  key={`${insight}-${index}`}
                  className="flex items-start gap-2.5"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#65b8ee]" />

                  <p className="text-[12px] leading-5 text-[#6f8592]">
                    {
                      insight
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        ) : (
          <p className="mt-2 text-[12px] leading-5 text-[#748b97]">
            A recomendação considera os serviços escolhidos, características da
            peça, porte, localização e requisitos técnicos informados ao longo
            do configurador.
          </p>
        )}
      </div>

      <div className="mt-4 flex-1 rounded-[16px] border border-[#b3cedb]/74 bg-[#e5f0f5]/68 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#5d8094]">
          Orientação técnica
        </p>

        <p className="mt-2 text-[13px] leading-6 text-[#315f79]">
          {
            recommendation.summary
          }
        </p>

        <div className="mt-3 border-t border-[#bdd4df]/64 pt-3">
          <p className="text-[12px] leading-5 text-[#728a96]">
            Esta orientação não substitui a análise técnica do Centro. A equipe
            poderá combinar tecnologias ou ajustar a estratégia conforme os
            arquivos e requisitos do projeto.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * MÉTRICA
 * ============================================================ */

function ResultMetric({
  value,
  label,
}) {
  return (
    <div className="rounded-[15px] border border-white/72 bg-white/36 px-4 py-4">
      <p className="text-[22px] font-semibold tracking-[-0.035em] text-[#12364e]">
        {value}
      </p>

      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#768f9c]">
        {label}
      </p>
    </div>
  );
}

/* ============================================================
 * TECNOLOGIAS PRIORIZADAS
 * ============================================================ */

function getPrioritizedTechnologies(
  recommendation,
) {
  const result = [];

  for (
    const piece of recommendation.pieces ??
    []
  ) {
    for (
      const serviceRecommendation of piece.services ??
      []
    ) {
      const machineId =
        serviceRecommendation.primaryMachine;

      if (
        !machineId
      ) {
        continue;
      }

      const machine =
        getMachineProfile(
          machineId,
        );

      const service =
        getService(
          serviceRecommendation.service,
        );

      const alreadyAdded =
        result.some(
          (
            item,
          ) =>
            item.machineId ===
              machineId &&
            item.serviceId ===
              serviceRecommendation.service,
        );

      if (
        alreadyAdded
      ) {
        continue;
      }

      result.push({
        machineId,

        machineName:
          machine?.name ??
          machineId,

        serviceId:
          serviceRecommendation.service,

        serviceName:
          service?.name ??
          serviceRecommendation.service,
      });
    }
  }

  return result;
}

/* ============================================================
 * FUNDO ÚNICO DA PÁGINA
 *
 * Este é o elemento que pinta toda a viewport.
 * O PublicLayout permanece transparente.
 * A Header fica sobre este mesmo fundo.
 * ============================================================ */

function ConfiguratorPageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-[#dfeaf0]"
    />
  );
}

/* ============================================================
 * VALIDAÇÃO
 * ============================================================ */

function canContinueCurrentStep(
  state,
) {
  if (
    state.currentStep ===
    1
  ) {
    return (
      state.selectedNeedSituations.length >
      0
    );
  }

  if (
    state.currentStep ===
    2
  ) {
    return state.pieces.every(
      (
        piece,
      ) =>
        piece.services.length >
          0 &&
        Boolean(
          piece.type,
        ) &&
        Boolean(
          piece.material,
        ) &&
        Boolean(
          piece.quantity,
        ),
    );
  }

  if (
    state.currentStep ===
    3
  ) {
    return state.pieces.every(
      (
        piece,
      ) =>
        Boolean(
          piece.location,
        ) &&
        hasPieceSize(
          piece,
        ),
    );
  }

  if (
    state.currentStep ===
    4
  ) {
    return state.pieces.every(
      (
        piece,
      ) =>
        piece.services.every(
          (
            service,
          ) =>
            hasServiceGoals(
              piece,
              service,
            ),
        ),
    );
  }

  if (
    state.currentStep ===
    5
  ) {
    return state.pieces.every(
      (
        piece,
      ) =>
        piece.services.every(
          (
            service,
          ) =>
            hasCoreTechnicalRequirement(
              piece,
              service,
            ),
        ),
    );
  }

  if (
    state.currentStep ===
    6
  ) {
    return true;
  }

  if (
    state.currentStep ===
    7
  ) {
    return true;
  }

  return false;
}

/* ============================================================
 * TAMANHO DA PEÇA
 * ============================================================ */

function hasPieceSize(
  piece,
) {
  const dimensions =
    piece.dimensions ?? {};

  const hasAnyDimension =
    Boolean(
      dimensions.length ||
        dimensions.width ||
        dimensions.height,
    );

  return Boolean(
    hasAnyDimension ||
      piece.sizeCategory,
  );
}

/* ============================================================
 * OBJETIVOS
 * ============================================================ */

function hasServiceGoals(
  piece,
  service,
) {
  if (
    service ===
    "dimensional"
  ) {
    return (
      piece.requirements
        .dimensional.goals
        .length >
      0
    );
  }

  if (
    service ===
    "scan"
  ) {
    return (
      piece.requirements
        .scanning.goals
        .length >
      0
    );
  }

  if (
    service ===
    "reverse-engineering"
  ) {
    return (
      piece.requirements
        .reverseEngineering
        .goals.length >
      0
    );
  }

  if (
    service ===
    "internal"
  ) {
    return (
      piece.requirements
        .ct.goals.length >
      0
    );
  }

  return true;
}

/* ============================================================
 * CRITÉRIOS PRINCIPAIS
 * ============================================================ */

function hasCoreTechnicalRequirement(
  piece,
  service,
) {
  if (
    service ===
    "dimensional"
  ) {
    return Boolean(
      piece.requirements
        .dimensional
        .toleranceKnowledge,
    );
  }

  if (
    service ===
    "scan"
  ) {
    return Boolean(
      piece.requirements
        .scanning
        .detailLevel,
    );
  }

  if (
    service ===
    "reverse-engineering"
  ) {
    return Boolean(
      piece.requirements
        .reverseEngineering
        .geometryScope,
    );
  }

  if (
    service ===
    "internal"
  ) {
    return Boolean(
      piece.requirements
        .ct.region,
    );
  }

  return true;
}

/* ============================================================
 * MENSAGENS
 * ============================================================ */

function getValidationMessage(
  state,
) {
  if (
    state.currentStep ===
    1
  ) {
    return "Selecione pelo menos uma necessidade para continuar.";
  }

  if (
    state.currentStep ===
    2
  ) {
    return "Complete tipo, material, quantidade e frente de análise das peças.";
  }

  if (
    state.currentStep ===
    3
  ) {
    return "Informe uma referência de tamanho e a condição de atendimento.";
  }

  if (
    state.currentStep ===
    4
  ) {
    return "Selecione pelo menos um objetivo para cada frente de análise.";
  }

  if (
    state.currentStep ===
    5
  ) {
    return "Complete o principal critério técnico de cada frente antes de continuar.";
  }

  return "";
}