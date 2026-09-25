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

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function RefinementStep({
  state,
  definitionScore,
  onStateChange,
}) {
  const questions =
    useMemo(
      () =>
        buildRefinementQuestions(
          state,
        ),
      [state],
    );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const safeIndex =
    Math.min(
      activeIndex,
      Math.max(
        0,
        questions.length - 1,
      ),
    );

  const activeQuestion =
    questions[safeIndex];

  function updatePiece(
    pieceId,
    updater,
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
          INTRODUÇÃO
      ===================================================== */}

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6d8795]">
          Refinamento
        </p>

        <h2 className="mt-3 max-w-[650px] text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[33px]">
          Vamos confirmar os últimos pontos.
        </h2>

        <p className="mt-3 max-w-[680px] text-[14px] leading-6 text-[#6f8592]">
          O configurador já possui uma visão inicial da aplicação.
          Agora aparecem somente informações que ainda podem melhorar
          a orientação técnica.
        </p>
      </div>

      {/* =====================================================
          NÍVEL DE DEFINIÇÃO
      ===================================================== */}

      <DefinitionCard
        definitionScore={
          definitionScore
        }
      />

      {/* =====================================================
          SEM PERGUNTAS
      ===================================================== */}

      {questions.length ===
      0 ? (
        <CompleteState />
      ) : (
        <>
          {/* =================================================
              CABEÇALHO DAS PERGUNTAS
          ================================================= */}

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#718a98]">
                Pontos de refinamento
              </p>

              <p className="mt-1.5 text-[13px] leading-5 text-[#8799a2]">
                {questions.length ===
                1
                  ? "Há 1 informação que ainda pode melhorar a orientação."
                  : `Há ${questions.length} informações que ainda podem melhorar a orientação.`}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-white/76 bg-white/36 px-3 py-1.5 text-[12px] font-semibold text-[#688494]">
              {safeIndex +
                1}{" "}
              /{" "}
              {
                questions.length
              }
            </span>
          </div>

          {/* =================================================
              PERGUNTA ATUAL
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
            <QuestionNavigation
              questions={
                questions
              }
              safeIndex={
                safeIndex
              }
              onPrevious={() =>
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
              onNext={() =>
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
              onSelect={
                setActiveIndex
              }
            />
          )}
        </>
      )}
    </div>
  );
}

/* ============================================================
 * CARD DE DEFINIÇÃO
 * ============================================================ */

function DefinitionCard({
  definitionScore,
}) {
  return (
    <section className="mt-5 rounded-[17px] border border-[#b9d0dc]/68 bg-[#e8f2f6]/54 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[14px]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#698796]">
            Definição atual do projeto
          </p>

          <p className="mt-1.5 text-[18px] font-semibold tracking-[-0.02em] text-[#31566d]">
            {getDefinitionLabel(
              definitionScore,
            )}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[22px] font-semibold tracking-[-0.035em] text-[#356f9f]">
            {
              definitionScore
            }
          </span>

          <span className="ml-0.5 text-[13px] font-semibold text-[#7690a0]">
            %
          </span>
        </div>
      </div>

      <div className="mt-3.5 h-[7px] overflow-hidden rounded-full bg-[#cadbe3]/84">
        <div
          className="h-full rounded-full bg-[#65b8ee] transition-all duration-500"
          style={{
            width: `${Math.max(
              3,
              definitionScore,
            )}%`,
          }}
        />
      </div>

      <p className="mt-3 max-w-[590px] text-[12px] leading-5 text-[#7d919c]">
        Este indicador mostra quanto já conhecemos sobre a aplicação.
        Ele não representa aprovação metrológica nem uma definição final
        de equipamento.
      </p>
    </section>
  );
}

/* ============================================================
 * CONFIGURAÇÃO JÁ BEM DEFINIDA
 * ============================================================ */

function CompleteState() {
  return (
    <section className="mt-5 rounded-[17px] border border-[#b9d0c1]/74 bg-[#edf5f0]/66 p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <div className="flex items-start gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#aac9b6] bg-white/64 text-[14px] font-semibold text-[#4c7960]">
          ✓
        </span>

        <div>
          <p className="text-[15px] font-semibold text-[#365f49]">
            Sua configuração já possui boa definição.
          </p>

          <p className="mt-1.5 max-w-[610px] text-[12px] leading-5 text-[#6f897b]">
            Não identificamos outra pergunta essencial neste momento.
            A equipe técnica continuará responsável pela validação final
            da solução.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * CARD DA PERGUNTA ATUAL
 * ============================================================ */

function RefinementQuestionCard({
  question,
  state,
  updatePiece,
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

  const service =
    getService(
      question.service,
    );

  return (
    <section className="rounded-[18px] border border-white/78 bg-white/32 p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-[14px]">
      {/* =====================================================
          IDENTIFICAÇÃO
      ===================================================== */}

      <div className="flex flex-wrap items-center gap-2">
        {service && (
          <span className="rounded-full border border-[#aac7d6]/72 bg-[#e4eff4]/76 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#537a90]">
            {service.name}
          </span>
        )}

        <span className="rounded-full border border-white/78 bg-white/48 px-3 py-1.5 text-[11px] font-medium text-[#78909d]">
          {piece.name?.trim() ||
            "Componente"}
        </span>
      </div>

      {/* =====================================================
          PERGUNTA
      ===================================================== */}

      <div className="mt-4">
        <h3 className="max-w-[620px] text-[17px] font-semibold leading-6 tracking-[-0.015em] text-[#31566d]">
          {question.title}
        </h3>

        <p className="mt-1.5 max-w-[640px] text-[13px] leading-5 text-[#7b909b]">
          {
            question.explanation
          }
        </p>
      </div>

      {/* =====================================================
          CONTEÚDO DINÂMICO
      ===================================================== */}

      <div className="mt-4">
        {question.id ===
          "dimensional-tolerance" && (
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
                      ...current
                        .requirements
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
        )}

        {question.id ===
          "dimensional-contact" && (
          <ContactRefinement
            value={
              piece
                .requirements
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
                      ...current
                        .requirements
                        .dimensional,

                      nonContactNeeded:
                        answer,
                    },
                  },
                }),
              )
            }
          />
        )}

        {question.id ===
          "scanning-detail" && (
          <ScanningDetailRefinement
            value={
              piece
                .requirements
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
                      ...current
                        .requirements
                        .scanning,

                      detailLevel,
                    },
                  },
                }),
              )
            }
          />
        )}

        {question.id ===
          "scanning-location" && (
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
        )}

        {question.id ===
          "reverse-geometry-scope" && (
          <GeometryScopeRefinement
            value={
              piece
                .requirements
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
                      ...current
                        .requirements
                        .reverseEngineering,

                      geometryScope,
                    },
                  },
                }),
              )
            }
          />
        )}

        {question.id ===
          "ct-region" && (
          <CtRegionRefinement
            value={
              piece
                .requirements
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
                      ...current
                        .requirements
                        .ct,

                      region,
                    },
                  },
                }),
              )
            }
          />
        )}
      </div>
    </section>
  );
}

/* ============================================================
 * TOLERÂNCIA
 * ============================================================ */

function ToleranceRefinement({
  piece,
  onChange,
}) {
  const requirements =
    piece.requirements
      .dimensional;

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
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
        Sei o valor da tolerância
      </Choice>

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

      {requirements.toleranceKnowledge ===
        "exact" && (
        <div className="sm:col-span-2">
          <div className="rounded-[13px] border border-[#bdd3df]/68 bg-[#e8f2f6]/54 p-3.5">
            <label className="block max-w-[240px]">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c8797]">
                Menor tolerância
              </span>

              <div className="relative">
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
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="0,010"
                  className="h-11 w-full rounded-[11px] border border-white/82 bg-white/50 px-3 pr-11 text-[14px] font-semibold text-[#31566d] outline-none transition-all placeholder:font-normal placeholder:text-[#a2afb6] focus:border-[#92b6c8] focus:bg-white/76 focus:ring-2 focus:ring-[#65b8ee]/10"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#8296a1]">
                  mm
                </span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * CONTATO
 * ============================================================ */

function ContactRefinement({
  value,
  onChange,
}) {
  const options = [
    {
      value: "yes",
      label:
        "Existem regiões que não devem ser tocadas",
    },
    {
      value: "no",
      label:
        "A medição pode ser realizada por contato",
    },
    {
      value: "maybe",
      label:
        "Depende da característica",
    },
    {
      value: "unknown",
      label:
        "Não sei",
    },
  ];

  return (
    <ChoiceGrid
      options={
        options
      }
      value={
        value
      }
      onChange={
        onChange
      }
    />
  );
}

/* ============================================================
 * DETALHE DE DIGITALIZAÇÃO
 * ============================================================ */

function ScanningDetailRefinement({
  value,
  onChange,
}) {
  const options = [
    {
      value: "general",
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
      value: "unknown",
      label:
        "Não sei",
    },
  ];

  return (
    <ChoiceGrid
      options={
        options
      }
      value={
        value
      }
      onChange={
        onChange
      }
    />
  );
}

/* ============================================================
 * LOCALIZAÇÃO
 * ============================================================ */

function LocationRefinement({
  value,
  onChange,
}) {
  const options = [
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
      value: "unknown",
      label:
        "Não sei",
    },
  ];

  return (
    <ChoiceGrid
      options={
        options
      }
      value={
        value
      }
      onChange={
        onChange
      }
    />
  );
}

/* ============================================================
 * ESCOPO DA ENGENHARIA REVERSA
 * ============================================================ */

function GeometryScopeRefinement({
  value,
  onChange,
}) {
  const options = [
    {
      value: "external",
      label:
        "Somente externa",
    },
    {
      value: "internal",
      label:
        "Somente interna",
    },
    {
      value: "both",
      label:
        "Externa e interna",
    },
    {
      value: "unknown",
      label:
        "Não sei",
    },
  ];

  return (
    <ChoiceGrid
      options={
        options
      }
      value={
        value
      }
      onChange={
        onChange
      }
    />
  );
}

/* ============================================================
 * REGIÃO DA TOMOGRAFIA
 * ============================================================ */

function CtRegionRefinement({
  value,
  onChange,
}) {
  const options = [
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
      value: "unknown",
      label:
        "Não sei",
    },
  ];

  return (
    <ChoiceGrid
      options={
        options
      }
      value={
        value
      }
      onChange={
        onChange
      }
    />
  );
}

/* ============================================================
 * GRID DE ESCOLHAS
 * ============================================================ */

function ChoiceGrid({
  options,
  value,
  onChange,
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map(
        (
          option,
        ) => (
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
 * ESCOLHA
 * ============================================================ */

function Choice({
  selected,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        group
        relative
        flex
        min-h-[50px]
        w-full
        items-center
        justify-between
        gap-3
        overflow-hidden
        rounded-[12px]
        border
        px-3.5
        py-3
        text-left
        text-[13px]
        font-semibold
        leading-5
        transition-all
        duration-300

        ${
          selected
            ? "border-[#87b2c9]/84 bg-[#e1eef4]/86 text-[#315f79]"
            : "border-white/78 bg-white/40 text-[#657f8e] hover:-translate-y-[1px] hover:border-[#b7ced9] hover:bg-white/64"
        }
      `}
    >
      <div
        aria-hidden="true"
        className={`
          absolute
          bottom-0
          left-0
          top-0
          w-[3px]
          transition-opacity

          ${
            selected
              ? "bg-[#65b8ee] opacity-100"
              : "opacity-0"
          }
        `}
      />

      <span>
        {children}
      </span>

      <span
        className={`
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          text-[11px]
          transition-all

          ${
            selected
              ? "border-[#12364e] bg-[#12364e] text-white"
              : "border-[#cad9e0] bg-white/48 text-transparent"
          }
        `}
      >
        ✓
      </span>
    </button>
  );
}

/* ============================================================
 * NAVEGAÇÃO ENTRE PERGUNTAS
 * ============================================================ */

function QuestionNavigation({
  questions,
  safeIndex,
  onPrevious,
  onNext,
  onSelect,
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-[15px] border border-white/72 bg-white/24 px-3 py-2.5">
      <button
        type="button"
        disabled={
          safeIndex ===
          0
        }
        onClick={
          onPrevious
        }
        className="rounded-[10px] border border-white/80 bg-white/40 px-3.5 py-2 text-[12px] font-semibold text-[#708995] transition-all hover:border-[#b1c8d3] hover:bg-white/66 disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← Anterior
      </button>

      <div className="flex items-center gap-1.5">
        {questions.map(
          (
            question,
            index,
          ) => (
            <button
              key={`${question.pieceId}-${question.id}`}
              type="button"
              aria-label={`Ir para refinamento ${index + 1}`}
              onClick={() =>
                onSelect(
                  index,
                )
              }
              className={`
                h-[7px]
                rounded-full
                transition-all
                duration-300

                ${
                  index ===
                  safeIndex
                    ? "w-7 bg-[#65b8ee]"
                    : "w-[7px] bg-[#b8cbd5] hover:bg-[#8cabb9]"
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
        onClick={
          onNext
        }
        className="rounded-[10px] border border-[#a9c6d5]/76 bg-[#e1eef4]/74 px-3.5 py-2 text-[12px] font-semibold text-[#52778c] transition-all hover:border-[#88b3c8] hover:bg-[#d7e9f1] disabled:cursor-not-allowed disabled:opacity-30"
      >
        Próximo →
      </button>
    </div>
  );
}

/* ============================================================
 * DEFINIÇÃO
 * ============================================================ */

function getDefinitionLabel(
  score,
) {
  if (
    score >=
    85
  ) {
    return "Muito boa";
  }

  if (
    score >=
    65
  ) {
    return "Boa";
  }

  if (
    score >=
    40
  ) {
    return "Parcial";
  }

  return "Inicial";
}