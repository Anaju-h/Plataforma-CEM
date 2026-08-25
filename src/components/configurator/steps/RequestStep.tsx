import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getMachineProfile,
} from "../data/machineProfiles";

import {
  getService,
} from "../data/serviceCatalog";

import type {
  ConfiguratorState,
  ProjectAttachment,
  ProjectRecommendation,
} from "../types";

type RequestStepProps = {
  state: ConfiguratorState;

  recommendation: ProjectRecommendation;

  onStateChange: (
    state: ConfiguratorState,
  ) => void;

  onSubmit: () => void;

  submitting?: boolean;
};

export function RequestStep({
  state,
  recommendation,
  onStateChange,
  onSubmit,
  submitting = false,
}: RequestStepProps) {
  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    dragging,
    setDragging,
  ] = useState(false);

  const recommendedFiles =
    useMemo(
      () =>
        buildRecommendedFiles(
          state,
        ),
      [state],
    );

  const canSubmit =
    Boolean(
      state.customer.name.trim() &&
        state.customer.company.trim() &&
        state.customer.email.trim() &&
        state.customer.phone.trim(),
    );

  function updateCustomer(
    field:
      keyof ConfiguratorState["customer"],
    value: string,
  ) {
    onStateChange({
      ...state,

      customer: {
        ...state.customer,

        [field]:
          value,
      },
    });
  }

  function addFiles(
    files: File[],
  ) {
    if (!files.length) {
      return;
    }

    const attachments:
      ProjectAttachment[] =
        files.map(
          (file) => ({
            id:
              createAttachmentId(),

            file,

            category:
              inferAttachmentCategory(
                file,
              ),
          }),
        );

    onStateChange({
      ...state,

      attachments: [
        ...state.attachments,
        ...attachments,
      ],
    });
  }

  function removeFile(
    id: string,
  ) {
    onStateChange({
      ...state,

      attachments:
        state.attachments.filter(
          (attachment) =>
            attachment.id !==
            id,
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
          05 / 05
        </span>

        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#78909e]">
          Solicitação
        </span>
      </div>

      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-[2rem]">
        Envie seu projeto para análise.
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-[#667d8b] sm:text-base">
        A configuração foi construída com base nas informações fornecidas.
        Agora complete seus dados e adicione qualquer material que possa ajudar
        a equipe técnica.
      </p>

      {/* =====================================================
          INTERPRETAÇÃO
      ===================================================== */}

      <section className="mt-6 rounded-[20px] border border-[#c5d8e2] bg-[#e5eff5] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#62859a]">
              O que entendemos do projeto
            </p>

            <p className="mt-2 text-sm font-medium leading-6 text-[#294e64]">
              {recommendation.summary}
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-[#aac5d5] bg-white/70 px-3 py-1.5 text-[10px] font-semibold text-[#39718f]">
            {recommendation.definitionScore}% definido
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVIÇOS E TECNOLOGIAS
      ===================================================== */}

      <section className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#657f90]">
          Configuração preliminar
        </p>

        <div className="mt-3 space-y-3">
          {recommendation.pieces.map(
            (
              pieceRecommendation,
              index,
            ) => {
              const piece =
                state.pieces.find(
                  (item) =>
                    item.id ===
                    pieceRecommendation.pieceId,
                );

              return (
                <div
                  key={
                    pieceRecommendation.pieceId
                  }
                  className="rounded-[18px] border border-[#d0dce3] bg-[#edf3f6] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#708796]">
                        Peça{" "}
                        {String(
                          index +
                            1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#17394f]">
                        {piece?.name ||
                          "Componente"}
                      </p>
                    </div>

                    <span className="text-[10px] font-medium text-[#718794]">
                      {
                        pieceRecommendation.definitionScore
                      }
                      % definido
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {pieceRecommendation.services.map(
                      (
                        service,
                      ) => {
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
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d2dde3] bg-white px-4 py-3"
                          >
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#668397]">
                                {
                                  getService(
                                    service.service,
                                  ).name
                                }
                              </p>

                              <p className="mt-1 text-xs font-semibold text-[#294e64]">
                                {machine
                                  ? machine.name
                                  : "Tecnologia ainda em avaliação"}
                              </p>
                            </div>

                            {service.matches[0] && (
                              <MatchBadge
                                level={
                                  service.matches[0]
                                    .level
                                }
                              />
                            )}
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
      </section>

      {/* =====================================================
          DADOS DO CLIENTE
      ===================================================== */}

      <section className="mt-7 border-t border-[#d3dde3] pt-6">
        <div>
          <p className="text-sm font-semibold text-[#17394f]">
            Seus dados
          </p>

          <p className="mt-1 text-xs leading-5 text-[#758996]">
            Essas informações serão utilizadas pela equipe para retornar sobre
            a solicitação.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InputField
            label="Nome"
            required
            value={
              state.customer.name
            }
            onChange={(
              value,
            ) =>
              updateCustomer(
                "name",
                value,
              )
            }
            placeholder="Seu nome"
          />

          <InputField
            label="Empresa"
            required
            value={
              state.customer.company
            }
            onChange={(
              value,
            ) =>
              updateCustomer(
                "company",
                value,
              )
            }
            placeholder="Nome da empresa"
          />

          <InputField
            label="E-mail"
            required
            type="email"
            value={
              state.customer.email
            }
            onChange={(
              value,
            ) =>
              updateCustomer(
                "email",
                value,
              )
            }
            placeholder="nome@empresa.com"
          />

          <InputField
            label="Telefone / WhatsApp"
            required
            value={
              state.customer.phone
            }
            onChange={(
              value,
            ) =>
              updateCustomer(
                "phone",
                value,
              )
            }
            placeholder="(00) 00000-0000"
          />

          <div className="sm:col-span-2">
            <InputField
              label="Setor / área"
              value={
                state.customer.department
              }
              onChange={(
                value,
              ) =>
                updateCustomer(
                  "department",
                  value,
                )
              }
              placeholder="Ex.: Engenharia, Qualidade, Compras..."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          COMENTÁRIOS
      ===================================================== */}

      <section className="mt-7 border-t border-[#d3dde3] pt-6">
        <p className="text-sm font-semibold text-[#17394f]">
          Existe algo mais que nossa equipe deveria saber?
        </p>

        <p className="mt-1 text-xs leading-5 text-[#758996]">
          Você pode incluir prazo, contexto, dificuldade, requisitos especiais,
          dúvidas ou qualquer informação que não apareceu durante a
          configuração.
        </p>

        <textarea
          value={
            state.comments
          }
          onChange={(
            event,
          ) =>
            onStateChange({
              ...state,

              comments:
                event.target
                  .value,
            })
          }
          placeholder="Conte detalhes adicionais sobre o projeto..."
          rows={5}
          className="mt-4 w-full resize-y rounded-[16px] border border-[#cad8e0] bg-[#f9fbfc] px-4 py-4 text-sm leading-6 text-[#17394f] outline-none transition placeholder:text-[#9aabb5] focus:border-[#61a1ca] focus:bg-white"
        />
      </section>

      {/* =====================================================
          ARQUIVOS RECOMENDADOS
      ===================================================== */}

      {recommendedFiles.length >
        0 && (
        <section className="mt-7 border-t border-[#d3dde3] pt-6">
          <p className="text-sm font-semibold text-[#17394f]">
            Arquivos que podem ajudar nesta análise
          </p>

          <div className="mt-3 grid gap-2">
            {recommendedFiles.map(
              (item) => (
                <div
                  key={
                    item.title
                  }
                  className="flex items-start gap-3 rounded-[14px] border border-[#c5d8e2] bg-[#e6f0f5] p-3.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#b6cedb] bg-white text-[#4f7d98]">
                    +
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-[#315d76]">
                      {
                        item.title
                      }
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#718894]">
                      {
                        item.description
                      }
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          UPLOAD
      ===================================================== */}

      <section className="mt-7 border-t border-[#d3dde3] pt-6">
        <p className="text-sm font-semibold text-[#17394f]">
          Arquivos do projeto
        </p>

        <p className="mt-1 text-xs leading-5 text-[#758996]">
          Adicione fotos, desenhos, modelos CAD ou outros documentos que possam
          ajudar na avaliação.
        </p>

        <input
          ref={
            inputRef
          }
          type="file"
          multiple
          className="hidden"
          onChange={(
            event,
          ) => {
            addFiles(
              Array.from(
                event.target
                  .files ??
                  [],
              ),
            );

            event.target.value =
              "";
          }}
        />

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          onDragEnter={(
            event,
          ) => {
            event.preventDefault();

            setDragging(
              true,
            );
          }}
          onDragOver={(
            event,
          ) => {
            event.preventDefault();

            setDragging(
              true,
            );
          }}
          onDragLeave={(
            event,
          ) => {
            event.preventDefault();

            setDragging(
              false,
            );
          }}
          onDrop={(
            event,
          ) => {
            event.preventDefault();

            setDragging(
              false,
            );

            addFiles(
              Array.from(
                event.dataTransfer
                  .files,
              ),
            );
          }}
          className={`
            mt-4
            flex min-h-[150px]
            w-full
            flex-col
            items-center
            justify-center
            rounded-[18px]
            border
            border-dashed
            px-6 py-8
            text-center
            transition-all

            ${
              dragging
                ? "border-[#1476b8] bg-[#dfedf6]"
                : "border-[#a9c2d0] bg-[#edf3f6] hover:border-[#70a7c8] hover:bg-[#e8f1f5]"
            }
          `}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b9ceda] bg-white text-xl text-[#4c7c98]">
            ↑
          </span>

          <p className="mt-3 text-xs font-semibold text-[#315d76]">
            Arraste arquivos aqui
          </p>

          <p className="mt-1 text-[10px] leading-4 text-[#7b909c]">
            ou clique para selecionar
          </p>
        </button>

        {state.attachments.length >
          0 && (
          <div className="mt-3 space-y-2">
            {state.attachments.map(
              (
                attachment,
              ) => (
                <div
                  key={
                    attachment.id
                  }
                  className="flex items-center justify-between gap-4 rounded-[14px] border border-[#d0dce3] bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#3a5d71]">
                      {
                        attachment.file
                          .name
                      }
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.08em] text-[#8295a0]">
                      {formatFileSize(
                        attachment.file
                          .size,
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeFile(
                        attachment.id,
                      )
                    }
                    className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#927171] transition hover:text-[#734f4f]"
                  >
                    Remover
                  </button>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          AVISO E ENVIO
      ===================================================== */}

      <section className="mt-7 rounded-[18px] border border-[#c5d8e2] bg-[#e5eff5] p-4">
        <p className="text-xs font-semibold text-[#315d76]">
          Orientação preliminar
        </p>

        <p className="mt-1.5 text-[11px] leading-5 text-[#6b8290]">
          A configuração apresentada foi construída com base nas respostas
          fornecidas. A definição final da estratégia, tecnologias e condições
          de atendimento será realizada pela equipe técnica do Centro.
        </p>
      </section>

      <button
        type="button"
        disabled={
          !canSubmit ||
          submitting
        }
        onClick={
          onSubmit
        }
        className="
          mt-5
          flex h-[54px]
          w-full
          items-center
          justify-center
          gap-4
          rounded-[14px]
          bg-[#096ab2]
          px-5
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.13em]
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
        {submitting
          ? "Enviando..."
          : "Enviar solicitação para análise"}

        {!submitting && (
          <span>
            →
          </span>
        )}
      </button>

      {!canSubmit && (
        <p className="mt-3 text-center text-[10px] text-[#7c909b]">
          Preencha nome, empresa, e-mail e telefone para enviar a solicitação.
        </p>
      )}
    </div>
  );
}

/* ============================================================
 * CAMPOS
 * ============================================================ */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  placeholder?: string;

  required?: boolean;

  type?: string;
}) {
  return (
    <label>
      <span className="text-[11px] font-medium text-[#607988]">
        {label}

        {required && (
          <span className="ml-1 text-[#1476b8]">
            *
          </span>
        )}
      </span>

      <input
        type={
          type
        }
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
        placeholder={
          placeholder
        }
        className="mt-2 h-[50px] w-full rounded-xl border border-[#cad8e0] bg-[#f9fbfc] px-4 text-sm text-[#17394f] outline-none transition placeholder:text-[#9aabb5] focus:border-[#61a1ca] focus:bg-white"
      />
    </label>
  );
}

/* ============================================================
 * MATCH
 * ============================================================ */

function MatchBadge({
  level,
}: {
  level:
    "candidate"
    | "high"
    | "good"
    | "possible"
    | "low"
    | "review";
}) {
  const label = {
    candidate:
      "Relacionada",

    high:
      "Alta aderência",

    good:
      "Boa aderência",

    possible:
      "Possível",

    low:
      "Baixa prioridade",

    review:
      "Avaliar",
  }[level];

  return (
    <span className="rounded-full border border-[#b7ceda] bg-[#e5eff5] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#47758f]">
      {label}
    </span>
  );
}

/* ============================================================
 * ARQUIVOS RECOMENDADOS
 * ============================================================ */

function buildRecommendedFiles(
  state:
    ConfiguratorState,
) {
  const result: {
    title: string;
    description: string;
  }[] = [];

  const hasDrawing =
    state.pieces.some(
      (piece) =>
        piece.requirements
          .dimensional
          .technicalDrawing ===
        "yes",
    );

  const hasCad =
    state.pieces.some(
      (piece) =>
        piece.requirements
          .dimensional
          .cadModel ===
          "yes" ||
        piece.requirements
          .reverseEngineering
          .existingModel ===
          "yes" ||
        piece.requirements
          .reverseEngineering
          .existingModel ===
          "outdated",
    );

  const hasReverse =
    state.pieces.some(
      (piece) =>
        piece.services.includes(
          "reverse-engineering",
        ),
    );

  if (hasDrawing) {
    result.push({
      title:
        "Desenho técnico",

      description:
        "Você informou que possui um desenho. Ele pode ajudar na validação de medidas, tolerâncias e requisitos.",
    });
  }

  if (hasCad) {
    result.push({
      title:
        "Modelo CAD",

      description:
        "A referência digital pode ajudar na comparação, análise ou reconstrução do componente.",
    });
  }

  if (hasReverse) {
    result.push({
      title:
        "Fotos da peça",

      description:
        "Imagens gerais e detalhes da peça podem ajudar a equipe a compreender a geometria e o objetivo da reconstrução.",
    });
  }

  return result;
}

/* ============================================================
 * ARQUIVOS
 * ============================================================ */

function createAttachmentId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `attachment-${crypto.randomUUID()}`;
  }

  return `attachment-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function inferAttachmentCategory(
  file: File,
): ProjectAttachment["category"] {
  const name =
    file.name.toLowerCase();

  if (
    file.type.startsWith(
      "image/",
    )
  ) {
    return "photo";
  }

  if (
    name.endsWith(
      ".step",
    ) ||
    name.endsWith(
      ".stp",
    ) ||
    name.endsWith(
      ".iges",
    ) ||
    name.endsWith(
      ".igs",
    ) ||
    name.endsWith(
      ".stl",
    )
  ) {
    return "cad";
  }

  if (
    name.endsWith(
      ".pdf",
    )
  ) {
    return "document";
  }

  return "other";
}

function formatFileSize(
  bytes: number,
) {
  if (
    bytes <
    1024
  ) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(
      1,
    )} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(
    1,
  )} MB`;
}