"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  getService,
} from "../data/serviceCatalog";

import {
  buildRefinementQuestions,
} from "../engine/refinementEngine";

import type {
  ConfiguratorState,
  CriticalToleranceKnowledge,
  CtRegion,
  DetailLevel,
  GeometryScope,
  PieceConfiguration,
  PieceLocation,
  RefinementQuestion,
  YesNoMaybeUnknown,
} from "../types";

type RefinementStepProps = {
  state:
    ConfiguratorState;

  definitionScore:
    number;

  onStateChange: (
    state:
      ConfiguratorState,
  ) => void;
};

export function RefinementStep({
  state,
  definitionScore,
  onStateChange,
}: RefinementStepProps) {
  const questions =
    useMemo<
      RefinementQuestion[]
    >(
      () =>
        buildRefinementQuestions(
          state,
        ),
      [state],
    );

  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  const safeIndex =
    Math.min(
      activeIndex,
      Math.max(
        0,
        questions.length -
          1,
      ),
    );

  const activeQuestion:
    RefinementQuestion | undefined =
      questions[
        safeIndex
      ];

  function updatePiece(
    pieceId: string,

    updater: (
      piece:
        PieceConfiguration,
    ) => PieceConfiguration,
  ) {
    onStateChange({
      ...state,

      pieces:
        state.pieces.map(
          (piece) =>
            piece.id ===
            pieceId
              ? updater(
                  piece,
                )
              : piece,
        ),
    });
  }

  return (
    <div>
      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[#dbeaf3] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#1476b8]">
          04 / 05
        </span>

        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#78909e]">
          Refinamento
        </span>
      </div>

      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-[2rem]">
        Vamos confirmar os últimos pontos.
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-[#667d8b] sm:text-base">
        Já temos uma visão inicial do projeto. Agora aparecem somente
        informações que ainda podem melhorar a orientação técnica.
      </p>

      {/* =====================================================
          DEFINIÇÃO
      ===================================================== */}

      <section className="mt-6 rounded-[20px] border border-[#c6d8e2] bg-[#e5eff5] p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#62859a]">
              Definição do projeto
            </p>

            <p className="mt-1.5 text-lg font-semibold text-[#17394f]">
              {getDefinitionLabel(
                definitionScore,
              )}
            </p>
          </div>

          <span className="text-sm font-semibold text-[#1476b8]">
            {definitionScore}%
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ccdce4]">
          <div
            className="h-full rounded-full bg-[#1684c5] transition-all duration-500"
            style={{
              width: `${Math.max(
                3,
                definitionScore,
              )}%`,
            }}
          />
        </div>

        <p className="mt-3 text-[11px] leading-5 text-[#6c8391]">
          Esse indicador representa quanto já conhecemos sobre a aplicação.
          Ele não representa uma certeza metrológica ou aprovação técnica.
        </p>
      </section>

      {/* =====================================================
          SEM PERGUNTAS
      ===================================================== */}

      {questions.length ===
      0 ? (
        <section className="mt-5 rounded-[20px] border border-[#bcd5c7] bg-[#eaf3ed] p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#a9c9b6] bg-white/70 text-sm text-[#427258]">
              ✓
            </span>

            <div>
              <p className="text-sm font-semibold text-[#315d46]">
                Sua configuração já possui boa definição.
              </p>

              <p className="mt-2 text-xs leading-5 text-[#668274]">
                Não identificamos outra pergunta essencial antes da
                solicitação. A equipe técnica continuará responsável pela
                validação final.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* =================================================
              STATUS DAS PERGUNTAS
          ================================================= */}

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#648092]">
              {questions.length}{" "}
              {questions.length ===
              1
                ? "ponto pode melhorar"
                : "pontos podem melhorar"}{" "}
              a configuração
            </p>

            <span className="shrink-0 text-[10px] font-medium text-[#738996]">
              {safeIndex +
                1}{" "}
              /{" "}
              {
                questions.length
              }
            </span>
          </div>

          {/* =================================================
              PERGUNTA ATIVA
          ================================================= */}

          {activeQuestion && (
            <div className="mt-3">
              <RefinementQuestionCard
                question={
                  activeQuestion
                }
                state={
                  state
                }
                updatePiece={
                  updatePiece
                }
              />
            </div>
          )}

          {/* =================================================
              NAVEGAÇÃO
          ================================================= */}

          {questions.length >
            1 && (
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={
                  safeIndex ===
                  0
                }
                onClick={() =>
                  setActiveIndex(
                    (
                      current,
                    ) =>
                      Math.max(
                        0,
                        current -
                          1,
                      ),
                  )
                }
                className="
                  rounded-xl
                  border
                  border-[#cad8e0]
                  bg-[#f8fbfc]
                  px-3
                  py-3
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]
                  text-[#607887]
                  transition

                  hover:border-[#9eb8c7]

                  disabled:cursor-not-allowed
                  disabled:opacity-30

                  sm:px-4
                  sm:text-[10px]
                "
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-1.5">
                {questions.map(
                  (
                    question:
                      RefinementQuestion,

                    index:
                      number,
                  ) => (
                    <button
                      key={`${question.pieceId}-${question.id}`}
                      type="button"
                      aria-label={`Ir para refinamento ${index + 1}`}
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
                            : "w-2 bg-[#b6cbd7] hover:bg-[#8faebe]"
                        }
                      `}
                    />
                  ),
                )}
              </div>

              <button
                type="button"
                disabled={
                  safeIndex ===
                  questions.length -
                    1
                }
                onClick={() =>
                  setActiveIndex(
                    (
                      current,
                    ) =>
                      Math.min(
                        questions.length -
                          1,
                        current +
                          1,
                      ),
                  )
                }
                className="
                  rounded-xl
                  border
                  border-[#9cbdd1]
                  bg-[#dfeef6]
                  px-3
                  py-3
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]
                  text-[#286d98]
                  transition

                  hover:border-[#70a7c7]

                  disabled:cursor-not-allowed
                  disabled:opacity-30

                  sm:px-4
                  sm:text-[10px]
                "
              >
                Próximo →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============================================================
 * CARD DINÂMICO
 * ============================================================ */

function RefinementQuestionCard({
  question,
  state,
  updatePiece,
}: {
  question:
    RefinementQuestion;

  state:
    ConfiguratorState;

  updatePiece: (
    pieceId: string,

    updater: (
      piece:
        PieceConfiguration,
    ) => PieceConfiguration,
  ) => void;
}) {
  const piece =
    state.pieces.find(
      (item) =>
        item.id ===
        question.pieceId,
    );

  if (!piece) {
    return null;
  }

  return (
    <section className="rounded-[20px] border border-[#cbd9e1] bg-[#f2f7f9] p-5 sm:p-6">
      {/* Identificação */}

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#b6cdda] bg-[#e2eef5] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#47758f]">
          {
            getService(
              question.service,
            ).name
          }
        </span>

        <span className="rounded-full border border-[#d0dce3] bg-white px-3 py-1 text-[9px] font-medium text-[#718794]">
          {piece.name.trim() ||
            "Componente"}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-7 text-[#17394f]">
        {question.title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[#708692]">
        {
          question.explanation
        }
      </p>

      {/* =====================================================
          TOLERÂNCIA
      ===================================================== */}

      {question.id ===
        "dimensional-tolerance" && (
        <div className="mt-5">
          <ToleranceRefinement
            piece={
              piece
            }
            onChange={(
              knowledge,
              tolerance,
            ) =>
              updatePiece(
                piece.id,

                (
                  current,
                ) => ({
                  ...current,

                  requirements: {
                    ...current.requirements,

                    dimensional: {
                      ...current.requirements
                        .dimensional,

                      toleranceKnowledge:
                        knowledge,

                      criticalToleranceMm:
                        tolerance,
                    },
                  },
                }),
              )
            }
          />
        </div>
      )}

      {/* =====================================================
          CONTATO
      ===================================================== */}

      {question.id ===
        "dimensional-contact" && (
        <div className="mt-5">
          <ContactRefinement
            value={
              piece.requirements
                .dimensional
                .nonContactNeeded
            }
            onChange={(
              answer,
            ) =>
              updatePiece(
                piece.id,

                (
                  current,
                ) => ({
                  ...current,

                  requirements: {
                    ...current.requirements,

                    dimensional: {
                      ...current.requirements
                        .dimensional,

                      nonContactNeeded:
                        answer,
                    },
                  },
                }),
              )
            }
          />
        </div>
      )}

      {/* =====================================================
          DETALHE DO SCAN
      ===================================================== */}

      {question.id ===
        "scanning-detail" && (
        <div className="mt-5">
          <ScanningDetailRefinement
            value={
              piece.requirements
                .scanning
                .detailLevel
            }
            onChange={(
              detailLevel,
            ) =>
              updatePiece(
                piece.id,

                (
                  current,
                ) => ({
                  ...current,

                  requirements: {
                    ...current.requirements,

                    scanning: {
                      ...current.requirements
                        .scanning,

                      detailLevel,
                    },
                  },
                }),
              )
            }
          />
        </div>
      )}

      {/* =====================================================
          LOCAL
      ===================================================== */}

      {question.id ===
        "scanning-location" && (
        <div className="mt-5">
          <LocationRefinement
            value={
              piece.location
            }
            onChange={(
              location,
            ) =>
              updatePiece(
                piece.id,

                (
                  current,
                ) => ({
                  ...current,

                  location,
                }),
              )
            }
          />
        </div>
      )}

      {/* =====================================================
          ESCOPO RE
      ===================================================== */}

      {question.id ===
        "reverse-geometry-scope" && (
        <div className="mt-5">
          <GeometryScopeRefinement
            value={
              piece.requirements
                .reverseEngineering
                .geometryScope
            }
            onChange={(
              geometryScope,
            ) =>
              updatePiece(
                piece.id,

                (
                  current,
                ) => ({
                  ...current,

                  requirements: {
                    ...current.requirements,

                    reverseEngineering: {
                      ...current.requirements
                        .reverseEngineering,

                      geometryScope,
                    },
                  },
                }),
              )
            }
          />
        </div>
      )}

      {/* =====================================================
          REGIÃO CT
      ===================================================== */}

      {question.id ===
        "ct-region" && (
        <div className="mt-5">
          <CtRegionRefinement
            value={
              piece.requirements
                .ct.region
            }
            onChange={(
              region,
            ) =>
              updatePiece(
                piece.id,

                (
                  current,
                ) => ({
                  ...current,

                  requirements: {
                    ...current.requirements,

                    ct: {
                      ...current.requirements
                        .ct,

                      region,
                    },
                  },
                }),
              )
            }
          />
        </div>
      )}
    </section>
  );
}

/* ============================================================
 * REFINAMENTO — TOLERÂNCIA
 * ============================================================ */

function ToleranceRefinement({
  piece,
  onChange,
}: {
  piece:
    PieceConfiguration;

  onChange: (
    knowledge:
      CriticalToleranceKnowledge,

    tolerance:
      string,
  ) => void;
}) {
  const requirements =
    piece.requirements
      .dimensional;

  return (
    <div className="space-y-2">
      <Choice
        selected={
          requirements.toleranceKnowledge ===
          "exact"
        }
        onClick={() =>
          onChange(
            "exact",

            requirements.criticalToleranceMm,
          )
        }
      >
        Sei o valor
      </Choice>

      {requirements.toleranceKnowledge ===
        "exact" && (
        <div className="relative max-w-[220px]">
          <input
            type="number"
            min="0"
            step="0.001"
            value={
              requirements.criticalToleranceMm
            }
            onChange={(
              event,
            ) =>
              onChange(
                "exact",
                event.target
                  .value,
              )
            }
            placeholder="0,010"
            className="h-12 w-full rounded-xl border border-[#c9d7df] bg-white px-4 pr-12 text-sm text-[#17394f] outline-none transition focus:border-[#61a1ca]"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8396a2]">
            mm
          </span>
        </div>
      )}

      <Choice
        selected={
          requirements.toleranceKnowledge ===
          "high-precision"
        }
        onClick={() =>
          onChange(
            "high-precision",
            "",
          )
        }
      >
        Não sei o valor, mas exige alta precisão
      </Choice>

      <Choice
        selected={
          requirements.toleranceKnowledge ===
          "not-critical"
        }
        onClick={() =>
          onChange(
            "not-critical",
            "",
          )
        }
      >
        Não é uma aplicação de alta precisão
      </Choice>

      <Choice
        selected={
          requirements.toleranceKnowledge ===
          "unknown"
        }
        onClick={() =>
          onChange(
            "unknown",
            "",
          )
        }
      >
        Ainda não sei
      </Choice>
    </div>
  );
}

/* ============================================================
 * REFINAMENTO — CONTATO
 * ============================================================ */

function ContactRefinement({
  value,
  onChange,
}: {
  value:
    YesNoMaybeUnknown | null;

  onChange: (
    value:
      YesNoMaybeUnknown,
  ) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Choice
        selected={
          value === "yes"
        }
        onClick={() =>
          onChange(
            "yes",
          )
        }
      >
        Existem regiões que não devem ser tocadas
      </Choice>

      <Choice
        selected={
          value === "no"
        }
        onClick={() =>
          onChange(
            "no",
          )
        }
      >
        A medição pode ser realizada por contato
      </Choice>

      <Choice
        selected={
          value === "maybe"
        }
        onClick={() =>
          onChange(
            "maybe",
          )
        }
      >
        Depende da característica
      </Choice>

      <Choice
        selected={
          value ===
          "unknown"
        }
        onClick={() =>
          onChange(
            "unknown",
          )
        }
      >
        Não sei
      </Choice>
    </div>
  );
}

/* ============================================================
 * REFINAMENTO — DETALHE
 * ============================================================ */

function ScanningDetailRefinement({
  value,
  onChange,
}: {
  value:
    DetailLevel | null;

  onChange: (
    value:
      DetailLevel,
  ) => void;
}) {
  const options: {
    value:
      DetailLevel;

    label:
      string;
  }[] = [
    {
      value:
        "general",

      label:
        "Forma geral",
    },

    {
      value:
        "visible-details",

      label:
        "Detalhes visíveis",
    },

    {
      value:
        "fine-details",

      label:
        "Pequenos detalhes",
    },

    {
      value:
        "maximum-fidelity",

      label:
        "Maior fidelidade possível",
    },

    {
      value:
        "unknown",

      label:
        "Não sei",
    },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map(
        (option) => (
          <Choice
            key={
              option.value
            }
            selected={
              value ===
              option.value
            }
            onClick={() =>
              onChange(
                option.value,
              )
            }
          >
            {
              option.label
            }
          </Choice>
        ),
      )}
    </div>
  );
}

/* ============================================================
 * REFINAMENTO — LOCAL
 * ============================================================ */

function LocationRefinement({
  value,
  onChange,
}: {
  value:
    PieceLocation | null;

  onChange: (
    value:
      PieceLocation,
  ) => void;
}) {
  const options: {
    value:
      PieceLocation;

    label:
      string;
  }[] = [
    {
      value:
        "laboratory",

      label:
        "Pode ser levada ao Centro",
    },

    {
      value:
        "customer-site",

      label:
        "Precisa ser analisada no local",
    },

    {
      value:
        "installed",

      label:
        "Permanece instalada",
    },

    {
      value:
        "needs-guidance",

      label:
        "Preciso de orientação",
    },

    {
      value:
        "unknown",

      label:
        "Não sei",
    },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map(
        (option) => (
          <Choice
            key={
              option.value
            }
            selected={
              value ===
              option.value
            }
            onClick={() =>
              onChange(
                option.value,
              )
            }
          >
            {
              option.label
            }
          </Choice>
        ),
      )}
    </div>
  );
}

/* ============================================================
 * REFINAMENTO — GEOMETRIA RE
 * ============================================================ */

function GeometryScopeRefinement({
  value,
  onChange,
}: {
  value:
    GeometryScope | null;

  onChange: (
    value:
      GeometryScope,
  ) => void;
}) {
  const options: {
    value:
      GeometryScope;

    label:
      string;
  }[] = [
    {
      value:
        "external",

      label:
        "Somente externa",
    },

    {
      value:
        "internal",

      label:
        "Somente interna",
    },

    {
      value:
        "both",

      label:
        "Externa e interna",
    },

    {
      value:
        "unknown",

      label:
        "Não sei",
    },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map(
        (option) => (
          <Choice
            key={
              option.value
            }
            selected={
              value ===
              option.value
            }
            onClick={() =>
              onChange(
                option.value,
              )
            }
          >
            {
              option.label
            }
          </Choice>
        ),
      )}
    </div>
  );
}

/* ============================================================
 * REFINAMENTO — CT
 * ============================================================ */

function CtRegionRefinement({
  value,
  onChange,
}: {
  value:
    CtRegion | null;

  onChange: (
    value:
      CtRegion,
  ) => void;
}) {
  const options: {
    value:
      CtRegion;

    label:
      string;
  }[] = [
    {
      value:
        "whole-piece",

      label:
        "Peça inteira",
    },

    {
      value:
        "specific-region",

      label:
        "Região específica",
    },

    {
      value:
        "assembled-set",

      label:
        "Conjunto montado",
    },

    {
      value:
        "unknown",

      label:
        "Não sei",
    },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map(
        (option) => (
          <Choice
            key={
              option.value
            }
            selected={
              value ===
              option.value
            }
            onClick={() =>
              onChange(
                option.value,
              )
            }
          >
            {
              option.label
            }
          </Choice>
        ),
      )}
    </div>
  );
}

/* ============================================================
 * CHOICE
 * ============================================================ */

function Choice({
  selected,
  onClick,
  children,
}: {
  selected:
    boolean;

  onClick:
    () => void;

  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        w-full
        rounded-xl
        border
        px-4
        py-3.5
        text-left
        text-xs
        font-medium
        transition-all

        ${
          selected
            ? "border-[#61a1ca] bg-[#dcecf5] text-[#0b639e]"
            : "border-[#ccd9e1] bg-white text-[#5c7585] hover:border-[#a9c0cd]"
        }
      `}
    >
      {selected
        ? "✓ "
        : ""}

      {children}
    </button>
  );
}

/* ============================================================
 * DEFINITION LABEL
 * ============================================================ */

function getDefinitionLabel(
  score: number,
): string {
  if (
    score >= 85
  ) {
    return "Muito boa";
  }

  if (
    score >= 65
  ) {
    return "Boa";
  }

  if (
    score >= 40
  ) {
    return "Parcial";
  }

  return "Inicial";
}