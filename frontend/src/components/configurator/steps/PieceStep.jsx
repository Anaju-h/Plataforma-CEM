import {
  getService,
  serviceOrder,
} from "../data/serviceCatalog";

/* ============================================================
 * OPÇÕES
 * ============================================================ */

const typeOptions = [
  {
    value: "component",
    title: "Componente",
    description:
      "Peça individual ou componente mecânico.",
  },
  {
    value: "assembly",
    title: "Conjunto",
    description:
      "Duas ou mais peças montadas ou relacionadas.",
  },
  {
    value: "structure",
    title: "Estrutura",
    description:
      "Estrutura, dispositivo ou componente de maior porte.",
  },
  {
    value: "other",
    title: "Outro",
    description:
      "A peça não se enquadra nas categorias anteriores.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "A equipe poderá ajudar na classificação.",
  },
];

const materialOptions = [
  {
    value: "steel",
    title: "Aço",
  },
  {
    value: "aluminum",
    title: "Alumínio",
  },
  {
    value: "other-metal",
    title: "Outro metal",
  },
  {
    value: "polymer",
    title: "Polímero",
  },
  {
    value: "composite",
    title: "Compósito",
  },
  {
    value: "ceramic",
    title: "Cerâmica",
  },
  {
    value: "other",
    title: "Outro",
  },
  {
    value: "unknown",
    title: "Não sei",
  },
];

const sizeOptions = [
  {
    value: "hand",
    title: "Cabe na mão",
    description:
      "Peça pequena e de fácil manipulação.",
  },
  {
    value: "table",
    title: "Cabe sobre uma mesa",
    description:
      "Peça de porte pequeno ou médio.",
  },
  {
    value: "large",
    title: "Peça grande",
    description:
      "Exige maior espaço ou cuidado para movimentação.",
  },
  {
    value: "structure",
    title: "Estrutura / grande porte",
    description:
      "Movimentação difícil ou inviável em condições comuns.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "O porte ainda precisa ser avaliado.",
  },
];

const locationOptions = [
  {
    value: "laboratory",
    title: "Pode ir ao laboratório",
    description:
      "A peça pode ser transportada até o Centro.",
  },
  {
    value: "customer-site",
    title: "Precisa ser analisada no local",
    description:
      "A análise precisa ocorrer nas instalações do cliente.",
  },
  {
    value: "installed",
    title: "Está instalada",
    description:
      "A peça está montada ou integrada a uma estrutura.",
  },
  {
    value: "needs-guidance",
    title: "Preciso de orientação",
    description:
      "Ainda não sei qual condição de atendimento é mais adequada.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "A condição ainda precisa ser avaliada.",
  },
];

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function PieceStep({
  pieces,
  activePieceId,
  onActivePieceChange,
  onPiecesChange,
  onAddPiece,
  onDuplicatePiece,
  onRemovePiece,
  section = "identity",
}) {
  const activePiece =
    pieces.find(
      (piece) =>
        piece.id === activePieceId,
    ) ??
    pieces[0];

  if (!activePiece) {
    return null;
  }

  function patchActivePiece(
    patch,
  ) {
    onPiecesChange(
      pieces.map(
        (piece) =>
          piece.id === activePiece.id
            ? {
                ...piece,
                ...patch,
              }
            : piece,
      ),
    );
  }

  if (
    section ===
    "condition"
  ) {
    return (
      <ConditionSection
        pieces={
          pieces
        }
        activePiece={
          activePiece
        }
        activePieceId={
          activePieceId
        }
        onActivePieceChange={
          onActivePieceChange
        }
        onPatch={
          patchActivePiece
        }
      />
    );
  }

  return (
    <IdentitySection
      pieces={
        pieces
      }
      activePiece={
        activePiece
      }
      activePieceId={
        activePieceId
      }
      onActivePieceChange={
        onActivePieceChange
      }
      onPatch={
        patchActivePiece
      }
      onAddPiece={
        onAddPiece
      }
      onDuplicatePiece={
        onDuplicatePiece
      }
      onRemovePiece={
        onRemovePiece
      }
    />
  );
}

/* ============================================================
 * ETAPA 02 — IDENTIDADE
 * ============================================================ */

function IdentitySection({
  pieces,
  activePiece,
  activePieceId,
  onActivePieceChange,
  onPatch,
  onAddPiece,
  onDuplicatePiece,
  onRemovePiece,
}) {
  function toggleService(
    serviceId,
  ) {
    const selected =
      activePiece.services.includes(
        serviceId,
      );

    const nextServices =
      selected
        ? activePiece.services.filter(
            (item) =>
              item !== serviceId,
          )
        : [
            ...activePiece.services,
            serviceId,
          ];

    onPatch({
      services:
        nextServices,
    });
  }

  return (
    <div>
      <PieceNavigation
        pieces={
          pieces
        }
        activePieceId={
          activePieceId
        }
        onActivePieceChange={
          onActivePieceChange
        }
        onAddPiece={
          onAddPiece
        }
      />

      <div className="mt-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6d8795]">
          Identificação da peça
        </p>

        <h2 className="mt-3 max-w-[640px] text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[33px]">
          Conte um pouco sobre o que será analisado.
        </h2>

        <p className="mt-3 max-w-[680px] text-[14px] leading-6 text-[#6f8592]">
          Nesta etapa precisamos apenas das informações gerais da peça.
          Dimensões e condições de atendimento entram em seguida.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <QuestionBlock
          number="01"
          title="Como podemos identificar esta peça?"
          help="O nome é opcional, mas ajuda a organizar projetos com mais de uma peça."
        >
          <input
            type="text"
            value={
              activePiece.name ??
              ""
            }
            onChange={(
              event,
            ) =>
              onPatch({
                name:
                  event.target.value,
              })
            }
            placeholder="Ex.: Carcaça, suporte, conjunto..."
            className="h-11 w-full rounded-[12px] border border-white/80 bg-white/44 px-3.5 text-[14px] font-medium text-[#31566d] outline-none transition-all placeholder:text-[#a0afb7] focus:border-[#93b8ca] focus:bg-white/70 focus:ring-2 focus:ring-[#65b8ee]/10"
          />
        </QuestionBlock>

        <QuestionBlock
          number="02"
          title="Que tipo de item será analisado?"
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {typeOptions.map(
              (
                option,
              ) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    activePiece.type ===
                    option.value
                  }
                  title={
                    option.title
                  }
                  description={
                    option.description
                  }
                  onClick={() =>
                    onPatch({
                      type:
                        option.value,
                    })
                  }
                />
              ),
            )}
          </div>
        </QuestionBlock>

        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
          <QuestionBlock
            number="03"
            title="Qual é o material?"
          >
            <div className="grid grid-cols-2 gap-2">
              {materialOptions.map(
                (
                  option,
                ) => (
                  <CompactChoice
                    key={
                      option.value
                    }
                    selected={
                      activePiece.material ===
                      option.value
                    }
                    label={
                      option.title
                    }
                    onClick={() =>
                      onPatch({
                        material:
                          option.value,
                      })
                    }
                  />
                ),
              )}
            </div>
          </QuestionBlock>

          <QuestionBlock
            number="04"
            title="Quantidade"
            help="Peças deste tipo."
          >
            <input
              type="number"
              min="1"
              step="1"
              value={
                activePiece.quantity ??
                ""
              }
              onChange={(
                event,
              ) =>
                onPatch({
                  quantity:
                    event.target.value,
                })
              }
              placeholder="1"
              className="h-11 w-full rounded-[12px] border border-white/80 bg-white/44 px-3 text-[14px] font-semibold text-[#31566d] outline-none transition-all placeholder:text-[#a0afb7] focus:border-[#93b8ca] focus:bg-white/70 focus:ring-2 focus:ring-[#65b8ee]/10"
            />
          </QuestionBlock>
        </div>

        <QuestionBlock
          number="05"
          title="Quais frentes se aplicam a esta peça?"
          help="Os serviços escolhidos anteriormente já aparecem selecionados. Ajuste apenas se esta peça tiver uma necessidade diferente."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {serviceOrder.map(
              (
                serviceId,
              ) => {
                const service =
                  getService(
                    serviceId,
                  );

                if (!service) {
                  return null;
                }

                return (
                  <ServiceChoice
                    key={
                      serviceId
                    }
                    service={
                      service
                    }
                    selected={
                      activePiece.services.includes(
                        serviceId,
                      )
                    }
                    onClick={() =>
                      toggleService(
                        serviceId,
                      )
                    }
                  />
                );
              },
            )}
          </div>
        </QuestionBlock>
      </div>

      <PieceActions
        pieces={
          pieces
        }
        activePiece={
          activePiece
        }
        onDuplicatePiece={
          onDuplicatePiece
        }
        onRemovePiece={
          onRemovePiece
        }
        onAddPiece={
          onAddPiece
        }
      />
    </div>
  );
}

/* ============================================================
 * ETAPA 03 — CONDIÇÃO
 * ============================================================ */

function ConditionSection({
  pieces,
  activePiece,
  activePieceId,
  onActivePieceChange,
  onPatch,
}) {
  const dimensions =
    activePiece.dimensions ?? {
      length: "",
      width: "",
      height: "",
    };

  const hasExactDimensions =
    Boolean(
      dimensions.length ||
        dimensions.width ||
        dimensions.height,
    );

  function updateDimension(
    key,
    nextValue,
  ) {
    onPatch({
      dimensions: {
        ...dimensions,

        [key]:
          nextValue,
      },

      sizeCategory:
        nextValue ||
        Object.entries(
          dimensions,
        ).some(
          ([
            dimensionKey,
            value,
          ]) =>
            dimensionKey !==
              key &&
            Boolean(
              value,
            ),
        )
          ? ""
          : activePiece.sizeCategory,
    });
  }

  function chooseSize(
    size,
  ) {
    onPatch({
      sizeCategory:
        size,

      dimensions: {
        length: "",
        width: "",
        height: "",
      },
    });
  }

  return (
    <div>
      {pieces.length >
        1 && (
        <PieceNavigation
          pieces={
            pieces
          }
          activePieceId={
            activePieceId
          }
          onActivePieceChange={
            onActivePieceChange
          }
          compact
        />
      )}

      <div className={pieces.length > 1 ? "mt-6" : ""}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6d8795]">
          Condição da peça
        </p>

        <h2 className="mt-3 max-w-[640px] text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[33px]">
          Agora precisamos entender porte e mobilidade.
        </h2>

        <p className="mt-3 max-w-[680px] text-[14px] leading-6 text-[#6f8592]">
          Você pode informar as dimensões aproximadas ou simplesmente
          selecionar uma referência de tamanho.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <QuestionBlock
          number="01"
          title="Você conhece as dimensões aproximadas?"
          help="Use milímetros. Não precisa ser uma medida metrológica exata."
          important
        >
          <div className="grid grid-cols-3 gap-2.5">
            <DimensionInput
              label="Comprimento"
              value={
                dimensions.length
              }
              onChange={(
                nextValue,
              ) =>
                updateDimension(
                  "length",
                  nextValue,
                )
              }
            />

            <DimensionInput
              label="Largura"
              value={
                dimensions.width
              }
              onChange={(
                nextValue,
              ) =>
                updateDimension(
                  "width",
                  nextValue,
                )
              }
            />

            <DimensionInput
              label="Altura"
              value={
                dimensions.height
              }
              onChange={(
                nextValue,
              ) =>
                updateDimension(
                  "height",
                  nextValue,
                )
              }
            />
          </div>
        </QuestionBlock>

        <div className="flex items-center gap-3 px-1">
          <div className="h-px flex-1 bg-[#cad9e0]/72" />

          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b9ca5]">
            ou
          </span>

          <div className="h-px flex-1 bg-[#cad9e0]/72" />
        </div>

        <QuestionBlock
          number="02"
          title="Selecione uma referência de tamanho"
          help={
            hasExactDimensions
              ? "Ao selecionar uma referência, as dimensões informadas acima serão substituídas."
              : "Use esta opção caso não conheça as dimensões."
          }
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {sizeOptions.map(
              (
                option,
              ) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    activePiece.sizeCategory ===
                    option.value
                  }
                  title={
                    option.title
                  }
                  description={
                    option.description
                  }
                  onClick={() =>
                    chooseSize(
                      option.value,
                    )
                  }
                />
              ),
            )}
          </div>
        </QuestionBlock>

        <QuestionBlock
          number="03"
          title="Onde a peça pode ser analisada?"
          help="A mobilidade é importante para diferenciar tecnologias de laboratório e soluções portáteis."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {locationOptions.map(
              (
                option,
              ) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    activePiece.location ===
                    option.value
                  }
                  title={
                    option.title
                  }
                  description={
                    option.description
                  }
                  onClick={() =>
                    onPatch({
                      location:
                        option.value,
                    })
                  }
                />
              ),
            )}
          </div>
        </QuestionBlock>
      </div>
    </div>
  );
}

/* ============================================================
 * NAVEGAÇÃO ENTRE PEÇAS
 * ============================================================ */

function PieceNavigation({
  pieces,
  activePieceId,
  onActivePieceChange,
  onAddPiece,
  compact = false,
}) {
  if (
    pieces.length ===
      1 &&
    compact
  ) {
    return null;
  }

  return (
    <div className="rounded-[16px] border border-white/74 bg-white/28 p-2.5 backdrop-blur-[14px]">
      <div className="flex items-center gap-2 overflow-x-auto">
        {pieces.map(
          (
            piece,
            index,
          ) => {
            const active =
              piece.id ===
              activePieceId;

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
                  min-w-[130px]
                  rounded-[11px]
                  border
                  px-3.5
                  py-2.5
                  text-left
                  transition-all

                  ${
                    active
                      ? "border-[#93b7c9] bg-[#e1eef4]/82"
                      : "border-transparent bg-white/20 hover:border-[#c2d4dd] hover:bg-white/48"
                  }
                `}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#81949e]">
                  Peça{" "}
                  {String(
                    index + 1,
                  ).padStart(
                    2,
                    "0",
                  )}
                </p>

                <p className="mt-1 truncate text-[13px] font-semibold text-[#31566d]">
                  {piece.name ||
                    "Sem nome"}
                </p>
              </button>
            );
          },
        )}

        {onAddPiece && (
          <button
            type="button"
            onClick={
              onAddPiece
            }
            className="flex h-[46px] min-w-[46px] items-center justify-center rounded-[11px] border border-dashed border-[#b6ccd7] bg-white/24 text-[18px] font-light text-[#668797] transition-all hover:border-[#86afc3] hover:bg-white/58 hover:text-[#356f9f]"
            aria-label="Adicionar peça"
            title="Adicionar peça"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * AÇÕES
 * ============================================================ */

function PieceActions({
  pieces,
  activePiece,
  onDuplicatePiece,
  onRemovePiece,
  onAddPiece,
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-white/70 bg-white/24 px-4 py-3">
      <p className="max-w-[430px] text-[12px] leading-5 text-[#8799a2]">
        Configure cada tipo de peça separadamente quando o projeto envolver
        itens diferentes.
      </p>

      <div className="flex flex-wrap gap-2">
        <SmallAction
          onClick={() =>
            onDuplicatePiece(
              activePiece.id,
            )
          }
        >
          Duplicar
        </SmallAction>

        {pieces.length >
          1 && (
          <SmallAction
            onClick={() =>
              onRemovePiece(
                activePiece.id,
              )
            }
            danger
          >
            Remover
          </SmallAction>
        )}

        <SmallAction
          onClick={
            onAddPiece
          }
          primary
        >
          + Nova peça
        </SmallAction>
      </div>
    </div>
  );
}

/* ============================================================
 * COMPONENTES VISUAIS
 * ============================================================ */

function QuestionBlock({
  number,
  title,
  help,
  children,
  important = false,
}) {
  return (
    <section
      className={`
        rounded-[17px]
        border
        p-4.5
        shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]
        backdrop-blur-[14px]

        ${
          important
            ? "border-[#b7d0dc]/72 bg-[#e9f3f7]/54"
            : "border-white/76 bg-white/30"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span
          className={`
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            text-[11px]
            font-semibold

            ${
              important
                ? "border-[#9fc1d2]/76 bg-[#dcebf2]/72 text-[#4d7890]"
                : "border-[#cad9e1]/78 bg-white/44 text-[#688697]"
            }
          `}
        >
          {number}
        </span>

        <div>
          <p className="text-[15px] font-semibold leading-5 text-[#31566d]">
            {title}
          </p>

          {help && (
            <p className="mt-1 text-[12px] leading-5 text-[#82949e]">
              {help}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3.5">
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
        w-full
        overflow-hidden
        rounded-[13px]
        border
        px-4
        py-3
        text-left
        transition-all
        duration-300

        ${
          selected
            ? "border-[#83b2cd]/82 bg-[#e3f0f5]/86"
            : "border-white/74 bg-white/38 hover:-translate-y-[1px] hover:border-[#bfd3de] hover:bg-white/62"
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

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold leading-5 text-[#31566d]">
            {title}
          </p>

          {description && (
            <p className="mt-1 text-[12px] leading-5 text-[#7c909b]">
              {description}
            </p>
          )}
        </div>

        <span
          className={`
            mt-0.5
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            text-[11px]
            font-semibold

            ${
              selected
                ? "border-[#12364e] bg-[#12364e] text-white"
                : "border-[#cddce3] bg-white/54 text-transparent"
            }
          `}
        >
          ✓
        </span>
      </div>
    </button>
  );
}

function CompactChoice({
  selected,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        min-h-[40px]
        rounded-[10px]
        border
        px-2.5
        py-2
        text-[12px]
        font-semibold
        transition-all

        ${
          selected
            ? "border-[#12364e] bg-[#12364e] text-white"
            : "border-white/78 bg-white/42 text-[#667f8d] hover:border-[#aac4d0] hover:bg-white/66 hover:text-[#356f9f]"
        }
      `}
    >
      {label}
    </button>
  );
}

function ServiceChoice({
  service,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        flex
        min-h-[66px]
        items-center
        justify-between
        gap-3
        rounded-[13px]
        border
        px-3.5
        py-3
        text-left
        transition-all

        ${
          selected
            ? "border-[#8eb6ca] bg-[#e1eef4]/82"
            : "border-white/76 bg-white/36 hover:border-[#b8ced9] hover:bg-white/58"
        }
      `}
    >
      <div>
        <p className="text-[14px] font-semibold text-[#31566d]">
          {service.shortName ??
            service.name}
        </p>

        {service.description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#84969f]">
            {service.description}
          </p>
        )}
      </div>

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
          font-semibold

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

function DimensionInput({
  label,
  value,
  onChange,
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#81949e]">
        {label}
      </span>

      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.1"
          value={
            value ??
            ""
          }
          onChange={(
            event,
          ) =>
            onChange(
              event.target.value,
            )
          }
          placeholder="0"
          className="h-11 w-full rounded-[11px] border border-white/80 bg-white/44 px-3 pr-10 text-[13px] font-semibold text-[#31566d] outline-none transition-all placeholder:text-[#a0afb7] focus:border-[#93b8ca] focus:bg-white/70 focus:ring-2 focus:ring-[#65b8ee]/10"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#8a9ba4]">
          mm
        </span>
      </div>
    </label>
  );
}

function SmallAction({
  children,
  onClick,
  primary = false,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        rounded-[10px]
        border
        px-3.5
        py-2
        text-[11px]
        font-semibold
        transition-all

        ${
          primary
            ? "border-[#9ab9c8] bg-[#dcebf2]/72 text-[#477087] hover:border-[#79a5bb] hover:bg-[#d2e5ee]"
            : danger
              ? "border-[#dec5c5]/76 bg-white/34 text-[#9a6868] hover:border-[#d5aaaa] hover:bg-[#f7eeee]/66"
              : "border-white/80 bg-white/36 text-[#718792] hover:border-[#b6cbd5] hover:bg-white/64"
        }
      `}
    >
      {children}
    </button>
  );
}