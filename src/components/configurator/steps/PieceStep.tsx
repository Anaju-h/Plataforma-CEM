import {
  motion,
} from "motion/react";

import {
  getService,
  serviceOrder,
} from "../data/serviceCatalog";

import type {
  MaterialType,
  PieceConfiguration,
  PieceLocation,
  PieceType,
  ServiceId,
  SizeCategory,
} from "../types";

type PieceStepProps = {
  pieces: PieceConfiguration[];

  activePieceId: string;

  onActivePieceChange: (
    pieceId: string,
  ) => void;

  onPiecesChange: (
    pieces:
      PieceConfiguration[],
  ) => void;

  onAddPiece:
    () => void;

  onDuplicatePiece: (
    pieceId: string,
  ) => void;

  onRemovePiece: (
    pieceId: string,
  ) => void;
};

const pieceTypeOptions: {
  value: PieceType;
  label: string;
  description: string;
}[] = [
  {
    value: "component",

    label:
      "Peça individual",

    description:
      "Um único componente.",
  },

  {
    value: "assembly",

    label:
      "Conjunto montado",

    description:
      "Duas ou mais peças analisadas juntas.",
  },

  {
    value: "structure",

    label:
      "Estrutura ou máquina",

    description:
      "Estrutura maior ou componente instalado.",
  },

  {
    value: "other",

    label: "Outro",

    description:
      "Outro tipo de componente.",
  },

  {
    value: "unknown",

    label:
      "Não sei classificar",

    description:
      "A equipe poderá avaliar depois.",
  },
];

const materialOptions: {
  value:
    MaterialType;
  label: string;
}[] = [
  {
    value: "steel",
    label: "Aço",
  },

  {
    value:
      "aluminum",
    label: "Alumínio",
  },

  {
    value:
      "other-metal",
    label:
      "Outro metal",
  },

  {
    value:
      "polymer",
    label:
      "Polímero / plástico",
  },

  {
    value:
      "composite",
    label: "Compósito",
  },

  {
    value:
      "ceramic",
    label: "Cerâmica",
  },

  {
    value: "other",
    label: "Outro",
  },

  {
    value:
      "unknown",
    label: "Não sei",
  },
];

const sizeOptions: {
  value:
    SizeCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "hand",

    label:
      "Cabe na mão",

    description:
      "Componente de pequeno porte.",
  },

  {
    value: "table",

    label:
      "Cabe sobre uma mesa",

    description:
      "Peça pequena ou média e relativamente fácil de movimentar.",
  },

  {
    value: "large",

    label:
      "Grande / difícil de movimentar",

    description:
      "Pode exigir apoio, equipamento ou mais pessoas para movimentação.",
  },

  {
    value:
      "structure",

    label:
      "Estrutura ou máquina de grande porte",

    description:
      "Componente grande, estrutura ou equipamento instalado.",
  },

  {
    value: "unknown",

    label:
      "Não sei estimar",

    description:
      "Você pode continuar sem informar medidas.",
  },
];

const locationOptions: {
  value:
    PieceLocation;
  label: string;
  description: string;
}[] = [
  {
    value:
      "laboratory",

    label:
      "Pode ser levada ao Centro",

    description:
      "A peça pode ser transportada para o laboratório.",
  },

  {
    value:
      "customer-site",

    label:
      "Precisa ser analisada no local",

    description:
      "A análise precisa ocorrer onde a peça está.",
  },

  {
    value:
      "installed",

    label:
      "Está instalada em uma máquina ou estrutura",

    description:
      "A peça não pode ser tratada como um componente livre.",
  },

  {
    value:
      "needs-guidance",

    label:
      "Preciso de orientação",

    description:
      "Ainda não sabe qual logística será possível.",
  },

  {
    value: "unknown",

    label:
      "Ainda não sei",

    description:
      "Podemos continuar e validar isso posteriormente.",
  },
];

export function PieceStep({
  pieces,
  activePieceId,
  onActivePieceChange,
  onPiecesChange,
  onAddPiece,
  onDuplicatePiece,
  onRemovePiece,
}: PieceStepProps) {
  const activePiece =
    pieces.find(
      (piece) =>
        piece.id ===
        activePieceId,
    ) ??
    pieces[0];

  if (!activePiece) {
    return null;
  }

  function updatePiece(
    nextPiece:
      PieceConfiguration,
  ) {
    onPiecesChange(
      pieces.map(
        (piece) =>
          piece.id ===
          nextPiece.id
            ? nextPiece
            : piece,
      ),
    );
  }

  function patchPiece(
    patch:
      Partial<PieceConfiguration>,
  ) {
    updatePiece({
      ...activePiece,
      ...patch,
    });
  }

  function toggleService(
    service:
      ServiceId,
  ) {
    const selected =
      activePiece.services.includes(
        service,
      );

    const nextServices =
      selected
        ? activePiece.services.filter(
            (item) =>
              item !==
              service,
          )
        : [
            ...activePiece.services,
            service,
          ];

    /*
     * A limpeza automática dos requisitos removidos será
     * feita pelo controlador usando
     * clearRemovedServiceRequirements().
     *
     * Aqui atualizamos somente a seleção visual da peça.
     */
    patchPiece({
      services:
        nextServices,
    });
  }

  const hasExactDimensions =
    Boolean(
      activePiece.dimensions.length ||
        activePiece.dimensions.width ||
        activePiece.dimensions.height,
    );

  return (
    <div>
      {/* =====================================================
          INTRODUÇÃO
      ===================================================== */}

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[#dbeaf3] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#1476b8]">
          02 / 05
        </span>

        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#78909e]">
          Peça
        </span>
      </div>

      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-[2rem]">
        O que será analisado?
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-[#667d8b] sm:text-base">
        Vamos entender as características gerais de cada componente.
        Perguntas técnicas específicas serão feitas na próxima etapa.
      </p>

      {/* =====================================================
          NAVEGAÇÃO ENTRE PEÇAS
      ===================================================== */}

      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#637f90]">
            Componentes do projeto
          </p>

          <button
            type="button"
            onClick={
              onAddPiece
            }
            className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1476b8] transition hover:text-[#0a5d91]"
          >
            + Adicionar peça
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {pieces.map(
            (
              piece,
              index,
            ) => {
              const active =
                piece.id ===
                activePiece.id;

              return (
                <button
                  key={
                    piece.id
                  }
                  type="button"
                  onClick={() =>
                    onActivePieceChange(
                      piece.id,
                    )
                  }
                  className={`
                    min-w-[145px]
                    shrink-0
                    rounded-[14px]
                    border
                    px-4 py-3
                    text-left
                    transition-all

                    ${
                      active
                        ? "border-[#61a1ca] bg-[#e0eef6] shadow-[0_8px_20px_rgba(53,111,159,0.07)]"
                        : "border-[#d0dce3] bg-[#edf3f6] hover:border-[#b0c5d1]"
                    }
                  `}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718897]">
                    Peça{" "}
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-[#17394f]">
                    {piece.name.trim() ||
                      "Sem nome"}
                  </p>

                  <p className="mt-1 text-[10px] text-[#788d99]">
                    {piece.services.length}{" "}
                    {piece.services.length ===
                    1
                      ? "serviço"
                      : "serviços"}
                  </p>
                </button>
              );
            },
          )}

          <button
            type="button"
            onClick={
              onAddPiece
            }
            className="flex min-w-[120px] shrink-0 items-center justify-center rounded-[14px] border border-dashed border-[#9fbac9] bg-[#eaf1f5] px-4 py-3 text-xs font-semibold text-[#4b7892] transition hover:border-[#6fa5c4] hover:bg-[#e2edf3]"
          >
            + Nova peça
          </button>
        </div>
      </div>

      {/* =====================================================
          CARD DA PEÇA ATIVA
      ===================================================== */}

      <motion.div
        key={
          activePiece.id
        }
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-5 rounded-[22px] border border-[#cad8e0] bg-[#edf3f6] p-4 sm:p-6"
      >
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#66869a]">
              Componente ativo
            </p>

            <p className="mt-1 text-lg font-semibold text-[#0b2340]">
              {activePiece.name.trim() ||
                "Nova peça"}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                onDuplicatePiece(
                  activePiece.id,
                )
              }
              className="rounded-lg border border-[#c6d5de] bg-white px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#587386] transition hover:border-[#9fb9c8]"
            >
              Duplicar
            </button>

            {pieces.length >
              1 && (
              <button
                type="button"
                onClick={() =>
                  onRemovePiece(
                    activePiece.id,
                  )
                }
                className="rounded-lg border border-[#d8caca] bg-white px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8d6666] transition hover:border-[#c9aaaa]"
              >
                Remover
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            NOME
        ================================================= */}

        <FieldSection
          title="Como podemos identificar esta peça?"
          description="O nome é opcional, mas ajuda quando o projeto possui vários componentes."
        >
          <input
            type="text"
            value={
              activePiece.name
            }
            onChange={(
              event,
            ) =>
              patchPiece({
                name:
                  event.target
                    .value,
              })
            }
            placeholder="Ex.: Flange, carcaça, coletor..."
            className="h-[50px] w-full rounded-xl border border-[#cad8e0] bg-[#f9fbfc] px-4 text-sm text-[#17394f] outline-none transition focus:border-[#61a1ca] focus:bg-white"
          />
        </FieldSection>

        {/* =================================================
            SERVIÇOS DA PEÇA
        ================================================= */}

        <FieldSection
          title="O que precisa ser feito nesta peça?"
          description="Uma mesma peça pode passar por vários serviços."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {serviceOrder.map(
              (service) => {
                const selected =
                  activePiece.services.includes(
                    service,
                  );

                return (
                  <button
                    key={
                      service
                    }
                    type="button"
                    onClick={() =>
                      toggleService(
                        service,
                      )
                    }
                    className={`
                      rounded-xl
                      border
                      px-4 py-3.5
                      text-left
                      transition-all

                      ${
                        selected
                          ? "border-[#63a3cb] bg-[#dcecf5]"
                          : "border-[#ccd9e1] bg-[#f9fbfc] hover:border-[#aac0cd]"
                      }
                    `}
                  >
                    <p
                      className={`
                        text-xs
                        font-semibold

                        ${
                          selected
                            ? "text-[#0b639e]"
                            : "text-[#506b7b]"
                        }
                      `}
                    >
                      {selected
                        ? "✓ "
                        : ""}
                      {
                        getService(
                          service,
                        ).name
                      }
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#7a8e99]">
                      {
                        getService(
                          service,
                        ).userFacingTitle
                      }
                    </p>
                  </button>
                );
              },
            )}
          </div>
        </FieldSection>

        {/* =================================================
            TIPO
        ================================================= */}

        <FieldSection title="Que tipo de item será analisado?">
          <div className="grid gap-2 sm:grid-cols-2">
            {pieceTypeOptions.map(
              (option) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    activePiece.type ===
                    option.value
                  }
                  title={
                    option.label
                  }
                  description={
                    option.description
                  }
                  onClick={() =>
                    patchPiece({
                      type:
                        option.value,
                    })
                  }
                />
              ),
            )}
          </div>
        </FieldSection>

        {/* =================================================
            MATERIAL
        ================================================= */}

        <FieldSection
          title="Qual é o material predominante?"
          description="Não tem problema se você não souber exatamente."
        >
          <div className="flex flex-wrap gap-2">
            {materialOptions.map(
              (option) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    patchPiece({
                      material:
                        option.value,
                    })
                  }
                  className={`
                    rounded-full
                    border
                    px-4 py-2.5
                    text-xs
                    font-medium
                    transition-all

                    ${
                      activePiece.material ===
                      option.value
                        ? "border-[#61a1ca] bg-[#dcecf5] text-[#0b639e]"
                        : "border-[#ccd9e1] bg-[#f9fbfc] text-[#607684] hover:border-[#acc2ce]"
                    }
                  `}
                >
                  {
                    option.label
                  }
                </button>
              ),
            )}
          </div>
        </FieldSection>

        {/* =================================================
            TAMANHO
        ================================================= */}

        <FieldSection
          title="Qual é o tamanho aproximado?"
          description="Você pode informar as medidas ou escolher uma referência simples."
        >
          {/* Medidas exatas */}
          <div className="grid gap-3 sm:grid-cols-3">
            <DimensionField
              label="Comprimento"
              value={
                activePiece.dimensions.length
              }
              onChange={(
                value,
              ) =>
                patchPiece({
                  dimensions: {
                    ...activePiece.dimensions,
                    length:
                      value,
                  },

                  /*
                   * Se começa a fornecer medidas reais,
                   * a categoria deixa de ser necessária.
                   */
                  sizeCategory:
                    value
                      ? null
                      : activePiece.sizeCategory,
                })
              }
            />

            <DimensionField
              label="Largura"
              value={
                activePiece.dimensions.width
              }
              onChange={(
                value,
              ) =>
                patchPiece({
                  dimensions: {
                    ...activePiece.dimensions,
                    width:
                      value,
                  },

                  sizeCategory:
                    value
                      ? null
                      : activePiece.sizeCategory,
                })
              }
            />

            <DimensionField
              label="Altura"
              value={
                activePiece.dimensions.height
              }
              onChange={(
                value,
              ) =>
                patchPiece({
                  dimensions: {
                    ...activePiece.dimensions,
                    height:
                      value,
                  },

                  sizeCategory:
                    value
                      ? null
                      : activePiece.sizeCategory,
                })
              }
            />
          </div>

          {/* Separador */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d1dce2]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a9aa4]">
              ou estime
            </span>

            <div className="h-px flex-1 bg-[#d1dce2]" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {sizeOptions.map(
              (option) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    activePiece.sizeCategory ===
                    option.value
                  }
                  disabled={
                    hasExactDimensions
                  }
                  title={
                    option.label
                  }
                  description={
                    option.description
                  }
                  onClick={() =>
                    patchPiece({
                      sizeCategory:
                        option.value,

                      dimensions: {
                        length: "",
                        width: "",
                        height: "",
                      },
                    })
                  }
                />
              ),
            )}
          </div>

          {hasExactDimensions && (
            <p className="mt-3 text-[11px] leading-5 text-[#678194]">
              Como você começou a informar medidas, utilizaremos os valores
              inseridos em vez da classificação aproximada.
            </p>
          )}
        </FieldSection>

        {/* =================================================
            QUANTIDADE
        ================================================= */}

        <FieldSection
          title="Quantas unidades deste mesmo componente fazem parte do projeto?"
          description="Se for outra peça com características diferentes, use “Adicionar peça”."
        >
          <input
            type="number"
            min="1"
            step="1"
            value={
              activePiece.quantity
            }
            onChange={(
              event,
            ) =>
              patchPiece({
                quantity:
                  event.target
                    .value,
              })
            }
            className="h-[50px] w-full max-w-[180px] rounded-xl border border-[#cad8e0] bg-[#f9fbfc] px-4 text-sm text-[#17394f] outline-none transition focus:border-[#61a1ca] focus:bg-white"
          />
        </FieldSection>

        {/* =================================================
            LOGÍSTICA
        ================================================= */}

        <FieldSection
          title="Onde essa peça pode ser analisada?"
          description="Essa informação é especialmente importante para tecnologias que dependem de mobilidade."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {locationOptions.map(
              (option) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    activePiece.location ===
                    option.value
                  }
                  title={
                    option.label
                  }
                  description={
                    option.description
                  }
                  onClick={() =>
                    patchPiece({
                      location:
                        option.value,
                    })
                  }
                />
              ),
            )}
          </div>
        </FieldSection>
      </motion.div>

      {/* =====================================================
          EXPLICAÇÃO MULTI-PEÇA
      ===================================================== */}

      {pieces.length >
        1 && (
        <div className="mt-5 rounded-[18px] border border-[#bfd2dd] bg-[#e5eff5] p-4">
          <p className="text-xs font-semibold text-[#315f7b]">
            Projeto com múltiplos componentes
          </p>

          <p className="mt-1.5 text-xs leading-5 text-[#66808f]">
            Cada peça será avaliada individualmente. Isso permite que uma
            mesma solicitação combine componentes, serviços e tecnologias
            diferentes.
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * COMPONENTES AUXILIARES
 * ============================================================ */

function FieldSection({
  title,
  description,
  children,
}: {
  title: string;

  description?: string;

  children:
    React.ReactNode;
}) {
  return (
    <section className="mt-7 border-t border-[#d2dde3] pt-6 first:border-t-0">
      <p className="text-sm font-semibold text-[#17394f]">
        {title}
      </p>

      {description && (
        <p className="mt-1 text-xs leading-5 text-[#768a96]">
          {description}
        </p>
      )}

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

function ChoiceCard({
  selected,
  title,
  description,
  onClick,
  disabled = false,
}: {
  selected: boolean;

  title: string;

  description?: string;

  onClick:
    () => void;

  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={
        disabled
      }
      onClick={
        onClick
      }
      className={`
        rounded-xl
        border
        px-4 py-3.5
        text-left
        transition-all

        ${
          disabled
            ? "cursor-not-allowed border-[#d5dfe4] bg-[#e8eef1] opacity-45"
            : selected
              ? "border-[#61a1ca] bg-[#dcecf5]"
              : "border-[#ccd9e1] bg-[#f9fbfc] hover:border-[#a9c0cc] hover:bg-white"
        }
      `}
    >
      <p
        className={`
          text-xs
          font-semibold

          ${
            selected
              ? "text-[#0b639e]"
              : "text-[#526e7f]"
          }
        `}
      >
        {selected
          ? "✓ "
          : ""}
        {title}
      </p>

      {description && (
        <p className="mt-1 text-[10px] leading-4 text-[#7a8e99]">
          {description}
        </p>
      )}
    </button>
  );
}

function DimensionField({
  label,
  value,
  onChange,
}: {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <label>
      <span className="text-[11px] font-medium text-[#637b8a]">
        {label}
      </span>

      <div className="relative mt-2">
        <input
          type="number"
          min="0"
          step="0.1"
          value={
            value
          }
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          className="h-[50px] w-full rounded-xl border border-[#cad8e0] bg-[#f9fbfc] px-4 pr-12 text-sm text-[#17394f] outline-none transition focus:border-[#61a1ca] focus:bg-white"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#8a9ba5]">
          mm
        </span>
      </div>
    </label>
  );
}