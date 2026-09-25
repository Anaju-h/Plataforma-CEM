import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  acceptFiles,
  FILE_LIMITS_HINT,
} from "../../../utils/fileLimits";

import {
  getMachineProfile,
} from "../data/machineProfiles";

import {
  getService,
} from "../data/serviceCatalog";

import {
  applyEmailSuffix,
  canSuggestEmailSuffix,
  EMAIL_SUFFIXES,
  formatPhone,
  isValidEmail,
  isValidPhone,
  sanitizeEmail,
} from "../../../utils/contactValidation";

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function RequestStep({
  state,
  recommendation,
  onStateChange,
  onSubmit,
  submitting = false,
  submitError = "",
  expanded = false,
}) {
  const inputRef =
    useRef(null);

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

  const [touched, setTouched] = useState({});
  const [fileError, setFileError] = useState(null);
  const emailError = state.customer.email.trim() && !isValidEmail(state.customer.email) ? "Informe um e-mail válido (ex.: nome@empresa.com.br)." : "";
  const phoneError = state.customer.phone.trim() && !isValidPhone(state.customer.phone) ? "Informe DDD + número (10 ou 11 dígitos)." : "";

  const canSubmit =
    Boolean(
      state.customer.name.trim() &&
        state.customer.company.trim() &&
        isValidEmail(state.customer.email) &&
        isValidPhone(state.customer.phone),
    );

  function updateCustomer(
    field,
    value,
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

  function addFiles(files) {
    if (!files.length) {
      return;
    }

    const { accepted, message } = acceptFiles(
      state.attachments.map((attachment) => attachment.file),
      files,
    );
    setFileError(message);

    if (!accepted.length) {
      return;
    }

    const attachments =
      accepted.map(
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

  function removeFile(id) {
    setFileError(null);
    onStateChange({
      ...state,

      attachments:
        state.attachments.filter(
          (attachment) =>
            attachment.id !== id,
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
          Solicitação
        </p>

        <h2 className="mt-3 max-w-[760px] text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[34px]">
          Transforme a orientação em uma solicitação.
        </h2>

        <p className="mt-3 max-w-[760px] text-[14px] leading-6 text-[#6f8592]">
          Revise o que entendemos do projeto, informe seus dados e envie
          materiais que possam ajudar a equipe técnica na avaliação.
        </p>
      </div>

      {/* =====================================================
          RESUMO GERAL
      ===================================================== */}

      <section className="mt-5 rounded-[18px] border border-[#b9d0dc]/70 bg-[#e7f1f5]/58 p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[14px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.11em] text-[#628294]">
              O que entendemos do projeto
            </p>

            <p className="mt-2 max-w-[820px] text-[14px] font-medium leading-6 text-[#31566d]">
              {
                recommendation.summary
              }
            </p>
          </div>

          <div className="shrink-0 self-start rounded-full border border-[#a9c4d2]/76 bg-white/58 px-3.5 py-2">
            <span className="text-[13px] font-semibold text-[#3f718c]">
              {
                recommendation.definitionScore
              }
              %
            </span>

            <span className="ml-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8196a1]">
              definido
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONFIGURAÇÃO TÉCNICA
      ===================================================== */}

      <section className="mt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.11em] text-[#6c8593]">
              Configuração preliminar
            </p>

            <p className="mt-1.5 text-[13px] leading-5 text-[#84969f]">
              Tecnologias com maior aderência às informações fornecidas.
            </p>
          </div>
        </div>

        <div
          className={`
            mt-3
            grid
            gap-3

            ${
              expanded
                ? "xl:grid-cols-2"
                : ""
            }
          `}
        >
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
                <ProjectPieceCard
                  key={
                    pieceRecommendation.pieceId
                  }
                  piece={
                    piece
                  }
                  recommendation={
                    pieceRecommendation
                  }
                  index={
                    index
                  }
                />
              );
            },
          )}
        </div>
      </section>

      {/* =====================================================
          DADOS DE CONTATO
      ===================================================== */}

      <section className="mt-6 rounded-[18px] border border-white/76 bg-white/30 p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[14px]">
        <div>
          <p className="text-[15px] font-semibold text-[#31566d]">
            Seus dados
          </p>

          <p className="mt-1.5 text-[13px] leading-5 text-[#7d919c]">
            A equipe utilizará essas informações para dar continuidade à
            solicitação.
          </p>
        </div>

        <div
          className={`
            mt-4
            grid
            gap-3

            ${
              expanded
                ? "md:grid-cols-2 xl:grid-cols-4"
                : "sm:grid-cols-2"
            }
          `}
        >
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
            inputMode="email"
            value={
              state.customer.email
            }
            onChange={(
              value,
            ) =>
              updateCustomer(
                "email",
                sanitizeEmail(value),
              )
            }
            onBlur={() => setTouched(current => ({ ...current, email: true }))}
            error={touched.email ? emailError : ""}
            placeholder="nome@empresa.com.br"
          >
            {canSuggestEmailSuffix(state.customer.email) && (
              <span className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-[#6a808d]">
                Completar com:
                {EMAIL_SUFFIXES.map(suffix => (
                  <button key={suffix} type="button" onClick={() => updateCustomer("email", applyEmailSuffix(state.customer.email, suffix))}
                    className="rounded-full bg-white/80 px-2.5 py-1 text-[12px] font-semibold text-[#0057b8] ring-1 ring-inset ring-[#c9d9e2] hover:ring-[#0057b8]/50">{suffix}</button>
                ))}
              </span>
            )}
          </InputField>

          <InputField
            label="Telefone / WhatsApp"
            required
            type="tel"
            inputMode="tel"
            value={
              state.customer.phone
            }
            onChange={(
              value,
            ) =>
              updateCustomer(
                "phone",
                formatPhone(value),
              )
            }
            onBlur={() => setTouched(current => ({ ...current, phone: true }))}
            error={touched.phone ? phoneError : ""}
            placeholder="(62) 90000-0000"
          />

          <div
            className={
              expanded
                ? "md:col-span-2 xl:col-span-4"
                : "sm:col-span-2"
            }
          >
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
          CONTEXTO + ARQUIVOS
      ===================================================== */}

      <div
        className={`
          mt-5
          grid
          gap-4

          ${
            expanded
              ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)]"
              : ""
          }
        `}
      >
        {/* ===================================================
            CONTEXTO
        =================================================== */}

        <section className="rounded-[18px] border border-white/76 bg-white/30 p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[14px]">
          <p className="text-[15px] font-semibold text-[#31566d]">
            Existe algo mais que a equipe deveria saber?
          </p>

          <p className="mt-1.5 text-[13px] leading-5 text-[#7d919c]">
            Inclua prazo, contexto, dificuldades, requisitos especiais ou
            qualquer informação importante que ainda não apareceu.
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
                  event.target.value,
              })
            }
            placeholder="Conte detalhes adicionais sobre o projeto..."
            rows={
              expanded
                ? 7
                : 5
            }
            className="mt-4 w-full resize-y rounded-[14px] border border-white/82 bg-white/46 px-4 py-3.5 text-[14px] leading-6 text-[#31566d] outline-none transition-all placeholder:text-[#9caeb7] focus:border-[#8eb5c8] focus:bg-white/74 focus:ring-2 focus:ring-[#65b8ee]/10"
          />

          {recommendedFiles.length >
            0 && (
            <RecommendedFiles
              files={
                recommendedFiles
              }
            />
          )}
        </section>

        {/* ===================================================
            UPLOAD
        =================================================== */}

        <section className="rounded-[18px] border border-white/76 bg-white/30 p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[14px]">
          <p className="text-[15px] font-semibold text-[#31566d]">
            Arquivos do projeto
          </p>

          <p className="mt-1.5 text-[13px] leading-5 text-[#7d919c]">
            Fotos, desenhos, CADs e documentos podem ajudar na avaliação
            técnica. {FILE_LIMITS_HINT}
          </p>

          {fileError && (
            <p role="alert" className="mt-2 text-[12.5px] leading-5 text-[#a4452f]">
              {fileError}
            </p>
          )}

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
                  event.target.files ??
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
                  event.dataTransfer.files,
                ),
              );
            }}
            className={`
              mt-4
              flex
              min-h-[165px]
              w-full
              flex-col
              items-center
              justify-center
              rounded-[15px]
              border
              border-dashed
              px-5
              py-6
              text-center
              transition-all
              duration-300

              ${
                dragging
                  ? "border-[#65b8ee] bg-[#e1eff6]/82"
                  : "border-[#a9c5d3]/82 bg-[#edf4f7]/54 hover:border-[#82afc4] hover:bg-[#e8f2f6]/76"
              }
            `}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b6ced9] bg-white/74 text-[19px] font-light text-[#4d7890]">
              ↑
            </span>

            <p className="mt-3 text-[14px] font-semibold text-[#456d82]">
              Arraste arquivos aqui
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#82959f]">
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
                  <AttachmentCard
                    key={
                      attachment.id
                    }
                    attachment={
                      attachment
                    }
                    onRemove={() =>
                      removeFile(
                        attachment.id,
                      )
                    }
                  />
                ),
              )}
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          AVISO + ENVIO
      ===================================================== */}

      <section className="mt-5 overflow-hidden rounded-[18px] border border-[#b8d0dc]/72 bg-[#e5f0f5]/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
        <div
          className={`
            flex
            flex-col
            gap-4
            px-4.5
            py-4

            ${
              expanded
                ? "lg:flex-row lg:items-center lg:justify-between"
                : ""
            }
          `}
        >
          <div className="max-w-[760px]">
            <p className="text-[13px] font-semibold text-[#416b81]">
              Orientação técnica preliminar
            </p>

            <p className="mt-1.5 text-[12px] leading-5 text-[#728a96]">
              A configuração foi construída a partir das respostas fornecidas.
              A definição final da estratégia, tecnologias e condições de
              atendimento será validada pela equipe técnica do Centro.
            </p>
          </div>

          <button
            type="button"
            disabled={
              !canSubmit ||
              submitting
            }
            onClick={
              onSubmit
            }
            className={`
              flex
              h-[50px]
              shrink-0
              items-center
              justify-center
              gap-3
              rounded-[12px]
              bg-[#12364e]
              px-6
              text-[13px]
              font-semibold
              text-white
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:bg-[#0d2d41]
              hover:shadow-[0_12px_26px_rgba(18,54,78,0.16)]
              disabled:cursor-not-allowed
              disabled:bg-[#d5dfe4]
              disabled:text-[#8d9ca4]
              disabled:shadow-none

              ${
                expanded
                  ? "w-full lg:w-auto lg:min-w-[250px]"
                  : "w-full"
              }
            `}
          >
            {submitting
              ? "Enviando..."
              : "Enviar solicitação"}

            {!submitting && (
              <span className="text-[16px] font-light">
                →
              </span>
            )}
          </button>
        </div>

        {submitError && (
          <div role="alert" className="border-t border-white/58 px-4.5 py-2.5">
            <p className="text-[12.5px] leading-5 text-[#8f5544]">{submitError}</p>
          </div>
        )}

        {!canSubmit && (
          <div className="border-t border-white/58 px-4.5 py-2.5">
            <p className="text-[12px] leading-5 text-[#82949e]">
              Preencha nome, empresa, e-mail válido e telefone com DDD para liberar o envio.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

/* ============================================================
 * CARD DA PEÇA
 * ============================================================ */

function ProjectPieceCard({
  piece,
  recommendation,
  index,
}) {
  return (
    <div className="rounded-[17px] border border-white/76 bg-white/32 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[14px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78909d]">
            Peça{" "}
            {String(
              index + 1,
            ).padStart(
              2,
              "0",
            )}
          </p>

          <p className="mt-1.5 text-[15px] font-semibold text-[#31566d]">
            {piece?.name ||
              "Componente"}
          </p>
        </div>

        <span className="rounded-full border border-white/74 bg-white/44 px-2.5 py-1.5 text-[11px] font-semibold text-[#718895]">
          {
            recommendation.definitionScore
          }
          %
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {recommendation.services.map(
          (
            service,
          ) => {
            const serviceData =
              getService(
                service.service,
              );

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
                className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#ccdce3]/72 bg-white/52 px-3.5 py-3"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#668596]">
                    {serviceData?.name ??
                      service.service}
                  </p>

                  <p className="mt-1 text-[13px] font-semibold leading-5 text-[#31566d]">
                    {machine
                      ? machine.name
                      : "Tecnologia ainda em avaliação"}
                  </p>
                </div>

                {service.matches?.[0] && (
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
}

/* ============================================================
 * ARQUIVOS RECOMENDADOS
 * ============================================================ */

function RecommendedFiles({
  files,
}) {
  return (
    <div className="mt-4">
      <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#728b98]">
        Materiais que podem ajudar
      </p>

      <div className="mt-2 grid gap-2">
        {files.map(
          (
            item,
          ) => (
            <div
              key={
                item.title
              }
              className="flex items-start gap-3 rounded-[12px] border border-[#c2d5df]/64 bg-[#e7f1f5]/52 px-3 py-2.5"
            >
              <span className="mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#b5ceda] bg-white/68 text-[13px] font-semibold text-[#5b8297]">
                +
              </span>

              <div>
                <p className="text-[13px] font-semibold text-[#416b81]">
                  {
                    item.title
                  }
                </p>

                <p className="mt-0.5 text-[12px] leading-5 text-[#7c919c]">
                  {
                    item.description
                  }
                </p>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * INPUT
 * ============================================================ */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  inputMode,
  onBlur,
  error = "",
  children,
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[#607d8c]">
        {label}

        {required && (
          <span className="ml-1 text-[#356f9f]">
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
            event.target.value,
          )
        }
        placeholder={
          placeholder
        }
        inputMode={inputMode}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className={`mt-2 h-[46px] w-full rounded-[11px] border bg-white/46 px-3.5 text-[14px] text-[#31566d] outline-none transition-all placeholder:text-[#9eafb7] focus:bg-white/74 focus:ring-2 focus:ring-[#65b8ee]/10 ${error ? "border-[#d9a495] focus:border-[#c98574]" : "border-white/82 focus:border-[#8eb5c8]"}`}
      />
      {error && <span role="alert" className="mt-1.5 block text-[12px] text-[#9a5947]">{error}</span>}
      {children}
    </label>
  );
}

/* ============================================================
 * ARQUIVO ANEXADO
 * ============================================================ */

function AttachmentCard({
  attachment,
  onRemove,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-[#ccdce3]/72 bg-white/56 px-3.5 py-3">
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-[#456d82]">
          {
            attachment.file.name
          }
        </p>

        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#8799a2]">
          {formatFileSize(
            attachment.file.size,
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={
          onRemove
        }
        className="shrink-0 rounded-[8px] border border-transparent px-2.5 py-1.5 text-[11px] font-semibold text-[#936e6e] transition-all hover:border-[#dec5c5] hover:bg-[#f7eeee]/64 hover:text-[#7c5555]"
      >
        Remover
      </button>
    </div>
  );
}

/* ============================================================
 * BADGE DE ADERÊNCIA
 * ============================================================ */

function MatchBadge({
  level,
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
    <span className="rounded-full border border-[#b7ceda]/80 bg-[#e4eff4]/74 px-2.5 py-1.5 text-[11px] font-semibold text-[#52798e]">
      {label ??
        "Avaliar"}
    </span>
  );
}

/* ============================================================
 * ARQUIVOS RECOMENDADOS
 * ============================================================ */

function buildRecommendedFiles(
  state,
) {
  const result = [];

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
        "Imagens gerais e detalhes podem ajudar a equipe a compreender a geometria e o objetivo da reconstrução.",
    });
  }

  return result;
}

/* ============================================================
 * UTILITÁRIOS DE ANEXO
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
  file,
) {
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
  bytes,
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