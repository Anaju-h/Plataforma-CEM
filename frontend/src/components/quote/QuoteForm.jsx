import {
  useMemo,
  useState,
} from "react";

import {
  Container,
} from "../layout/Container";

import {
  ContactStep,
} from "./ContactStep";

import {
  PiecesStep,
} from "./PiecesStep";

import {
  ProjectStep,
} from "./ProjectStep";

import {
  QuoteProgress,
} from "./QuoteProgress";

import {
  ReviewStep,
} from "./ReviewStep";

import {
  validateContactData,
} from "../../utils/contactValidation";

import {
  getRequestNeed,
} from "../../data/requestNeeds";

/* ============================================================
 * DADOS INICIAIS
 * ============================================================ */

const initialContactData = {
  name: "",
  company: "",
  email: "",
  phone: "",
};

const initialProjectData = {
  requestNeedId: "",
  objective: "",
  urgency: "normal",
  deadlineType: "noUrgency",
  specificDate: "",
  observations: "",
  generalFiles: [],
};

const initialInternalData = {
  channel: "E-mail",
  department: "",
  channelDetails: "",
};

/* ============================================================
 * PEÇA
 * ============================================================ */

function createPiece() {
  return {
    id:
      createId(),

    name: "",
    quantity: 1,

    material: "",

    length: "",
    width: "",
    height: "",
    unit: "mm",

    services: [],

    inspectionOptions: [],
    scanningOptions: [],
    reverseOptions: [],
    internalOptions: [],

    transportStatus:
      "unknown",

    externalService:
      false,

    locationCity: "",
    locationState: "",

    movable: "",
    surroundingAccess: "",

    locationNotes: "",
  };
}

/* ============================================================
 * CONTATO DO CLIENTE AUTENTICADO
 * ============================================================ */

function createCustomerContactData(
  customer,
) {
  if (!customer) {
    return {
      ...initialContactData,
    };
  }

  return {
    name:
      customer.user?.name ??
      "",

    company:
      customer.company?.name ??
      "",

    email:
      customer.user?.email ??
      "",

    phone:
      customer.user?.phone ??
      customer.company?.phone ??
      "",
  };
}

/* ============================================================
 * COMPONENTE
 *
 * public:
 * Contato -> Peças -> Projeto -> Revisão
 *
 * customer:
 * Peças -> Projeto -> Revisão
 *
 * internal:
 * Origem/Contato -> Peças -> Projeto -> Revisão
 * ============================================================ */

export function QuoteForm({
  mode = "public",
  customer = null,
  onSubmit = null,
}) {
  const isCustomerMode =
    mode ===
    "customer";

  const isInternalMode =
    mode ===
    "internal";

  const totalSteps =
    isCustomerMode
      ? 3
      : 4;

  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);

  const [
    maxStepReached,
    setMaxStepReached,
  ] = useState(1);

  const [
    contactValidationVisible,
    setContactValidationVisible,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const [
    contactData,
    setContactData,
  ] = useState(() =>
    isCustomerMode
      ? createCustomerContactData(
          customer,
        )
      : {
          ...initialContactData,
        },
  );

  const [
    internalData,
    setInternalData,
  ] = useState({
    ...initialInternalData,
  });

  const [
    pieces,
    setPieces,
  ] = useState(() => [
    createPiece(),
  ]);

  const [
    projectData,
    setProjectData,
  ] = useState({
    ...initialProjectData,
  });

  const [
    includePiecesForDirectRequest,
    setIncludePiecesForDirectRequest,
  ] = useState(false);

  const selectedRequestNeed = getRequestNeed(
    projectData.requestNeedId,
  );

  const isDirectRequest =
    selectedRequestNeed?.flow === "direct-request";

  const shouldIncludePieces =
    !isDirectRequest || includePiecesForDirectRequest;

  const effectivePieces = useMemo(
    () => (shouldIncludePieces ? pieces : []),
    [pieces, shouldIncludePieces],
  );

  /* ==========================================================
   * RESUMOS
   * ========================================================== */

  const totalUnits =
    useMemo(
      () =>
        effectivePieces.reduce(
          (
            total,
            piece,
          ) =>
            total +
            Number(
              piece.quantity ||
                0,
            ),
          0,
        ),
      [
        effectivePieces,
      ],
    );

  const externalCount =
    useMemo(
      () =>
        effectivePieces.filter(
          (piece) =>
            piece.externalService,
        ).length,
      [
        effectivePieces,
      ],
    );

  /* ==========================================================
   * CONTATO
   * ========================================================== */

  function handleContactChange(
    field,
    value,
  ) {
    setContactData(
      (
        current,
      ) => ({
        ...current,

        [field]:
          value,
      }),
    );
  }

  function canLeaveContactStep() {
    if (
      isCustomerMode
    ) {
      return true;
    }

    const validation =
      validateContactData(
        contactData,
      );

    if (
      validation.valid
    ) {
      setContactValidationVisible(
        false,
      );

      return true;
    }

    setContactValidationVisible(
      true,
    );

    return false;
  }

  /* ==========================================================
   * DADOS INTERNOS
   * ========================================================== */

  function handleInternalChange(
    field,
    value,
  ) {
    setInternalData(
      (
        current,
      ) => ({
        ...current,

        [field]:
          value,
      }),
    );
  }

  /* ==========================================================
   * PEÇAS
   * ========================================================== */

  function handlePieceChange(
    id,
    changes,
  ) {
    setPieces(
      (
        current,
      ) =>
        current.map(
          (piece) =>
            piece.id ===
            id
              ? {
                  ...piece,
                  ...changes,
                }
              : piece,
        ),
    );
  }

  function handleAddPiece() {
    setPieces(
      (
        current,
      ) => [
        ...current,
        createPiece(),
      ],
    );
  }

  function handleDeletePiece(
    id,
  ) {
    setPieces(
      (
        current,
      ) =>
        current.length ===
        1
          ? current
          : current.filter(
              (piece) =>
                piece.id !==
                id,
            ),
    );
  }

  /* ==========================================================
   * PROJETO
   * ========================================================== */

  function handleProjectChange(
    field,
    value,
  ) {
    setProjectData(
      (
        current,
      ) => ({
        ...current,

        [field]:
          value,
      }),
    );
  }

  /* ==========================================================
   * NAVEGAÇÃO
   * ========================================================== */

  function handleNext() {
    if (
      currentStep ===
        1 &&
      !isCustomerMode &&
      !canLeaveContactStep()
    ) {
      return;
    }

    if (
      currentStep === pieceStep &&
      !projectData.requestNeedId
    ) {
      return;
    }

    const nextStep =
      Math.min(
        currentStep + 1,
        totalSteps,
      );

    setCurrentStep(
      nextStep,
    );

    setMaxStepReached(
      (
        current,
      ) =>
        Math.max(
          current,
          nextStep,
        ),
    );

    scrollToFormTop();
  }

  function handleBack() {
    const previousStep =
      Math.max(
        currentStep - 1,
        1,
      );

    setCurrentStep(
      previousStep,
    );

    scrollToFormTop();
  }

  function handleStepChange(
    step,
  ) {
    if (
      step < 1 ||
      step >
        maxStepReached
    ) {
      return;
    }

    /*
     * Evita este bypass:
     *
     * 1. usuário preenche e avança;
     * 2. volta para contato;
     * 3. altera o e-mail para algo inválido;
     * 4. tenta clicar diretamente em outra etapa.
     */

    if (
      currentStep ===
        1 &&
      step > 1 &&
      !isCustomerMode &&
      !canLeaveContactStep()
    ) {
      return;
    }

    setCurrentStep(
      step,
    );

    scrollToFormTop();
  }

  function handleEditStep(
    step,
  ) {
    setCurrentStep(
      step,
    );

    scrollToFormTop();
  }

  function scrollToFormTop() {
    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
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

    if (
      !isCustomerMode
    ) {
      const validation =
        validateContactData(
          contactData,
        );

      if (
        !validation.valid
      ) {
        setContactValidationVisible(
          true,
        );

        setCurrentStep(
          1,
        );

        scrollToFormTop();

        return;
      }
    }

    if (
      typeof onSubmit !==
      "function"
    ) {
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    try {
      await onSubmit({
        mode,

        contact: {
          ...contactData,
        },

        internal:
          isInternalMode
            ? {
                ...internalData,
              }
                          : null,

        pieces:
          effectivePieces.map(
            (piece) => ({
              ...piece,
            }),
          ),

        project: {
          ...projectData,
        },
      });
    } catch (error) {
      setSubmitError(
        error?.message ||
          "Não foi possível enviar a solicitação.",
      );

      setSubmitting(false);
    }
  }

  /* ==========================================================
   * ETAPAS
   * ========================================================== */

  const pieceStep =
    isCustomerMode
      ? 1
      : 2;

  const projectStep =
    isCustomerMode
      ? 2
      : 3;

  const reviewStep =
    isCustomerMode
      ? 3
      : 4;

  /* ==========================================================
   * CONTEÚDO
   * ========================================================== */

  const formContent = (
    <div className="mx-auto w-full max-w-[1180px]">
      {/* =====================================================
          IDENTIDADE
      ===================================================== */}

      {isCustomerMode && (
        <CustomerIdentity
          contactData={
            contactData
          }
        />
      )}

      {isInternalMode && (
        <InternalIdentity />
      )}

      {/* =====================================================
          PROGRESSO
      ===================================================== */}

      <div
        className={`
          rounded-[22px]
          border
          border-white/70
          bg-white/44
          px-5
          py-5
          shadow-[0_10px_34px_rgba(31,68,92,0.06)]
          backdrop-blur-[18px]
          sm:px-7
          sm:py-6

          ${
            isCustomerMode ||
            isInternalMode
              ? "mt-4"
              : ""
          }
        `}
      >
        {isCustomerMode ? (
          <CustomerQuoteProgress
            currentStep={
              currentStep
            }
            maxStepReached={
              maxStepReached
            }
            onStepChange={
              handleStepChange
            }
          />
        ) : (
          <QuoteProgress
            currentStep={
              currentStep
            }
            maxStepReached={
              maxStepReached
            }
            onStepChange={
              handleStepChange
            }
          />
        )}
      </div>

      {/* =====================================================
          FORM + RESUMO
      ===================================================== */}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="rounded-[24px] border border-white/72 bg-white/48 p-6 shadow-[0_12px_36px_rgba(31,68,92,0.065)] backdrop-blur-[18px] sm:p-8 lg:p-10">
          {/* ===============================================
              CONTATO / ORIGEM
          =============================================== */}

          {!isCustomerMode &&
            currentStep ===
              1 && (
              <>
                {isInternalMode && (
                  <InternalRequestFields
                    data={
                      internalData
                    }
                    onChange={
                      handleInternalChange
                    }
                  />
                )}

                <ContactStep
                  data={
                    contactData
                  }
                  onChange={
                    handleContactChange
                  }
                  mode={
                    isInternalMode
                      ? "internal"
                      : "public"
                  }
                  showValidation={
                    contactValidationVisible
                  }
                />
              </>
            )}

          {/* ===============================================
              PEÇAS
          =============================================== */}

          {currentStep ===
            pieceStep && (
            <PiecesStep
              pieces={
                pieces
              }
              onChange={
                handlePieceChange
              }
              onAdd={
                handleAddPiece
              }
              onDelete={
                handleDeletePiece
              }
              requestNeedId={
                projectData.requestNeedId
              }
              onRequestNeedChange={(requestNeedId) =>
                handleProjectChange(
                  "requestNeedId",
                  requestNeedId,
                )
              }
              includePiecesForDirectRequest={
                includePiecesForDirectRequest
              }
              onIncludePiecesForDirectRequestChange={
                setIncludePiecesForDirectRequest
              }
              stepNumber={
                isCustomerMode
                  ? "01"
                  : "02"
              }
            />
          )}

          {/* ===============================================
              PROJETO
          =============================================== */}

          {currentStep ===
            projectStep && (
            <ProjectStep
              data={
                projectData
              }
              onChange={
                handleProjectChange
              }
            />
          )}

          {/* ===============================================
              REVISÃO
          =============================================== */}

          {currentStep ===
            reviewStep && (
            <>
              {isInternalMode && (
                <InternalReviewSummary
                  data={
                    internalData
                  }
                />
              )}

              <ReviewStep
                contact={
                  contactData
                }
                pieces={
                  effectivePieces
                }
                project={
                  projectData
                }
                onEditContact={
                  isCustomerMode
                    ? undefined
                    : () =>
                        handleEditStep(
                          1,
                        )
                }
                onEditPieces={() =>
                  handleEditStep(
                    pieceStep,
                  )
                }
                onEditProject={() =>
                  handleEditStep(
                    projectStep,
                  )
                }
              />
            </>
          )}

          {/* ===============================================
              ERRO
          =============================================== */}

          {submitError && (
            <div className="mt-6 rounded-[13px] border border-[#e3c5bc] bg-[#faf0ed] px-4 py-3">
              <p className="text-[12px] font-medium text-[#8f5544]">
                {
                  submitError
                }
              </p>
            </div>
          )}

          {/* ===============================================
              NAVEGAÇÃO
          =============================================== */}

          <div className="mt-10 flex items-center justify-between border-t border-[#d8e4ea]/72 pt-6">
            {currentStep >
            1 ? (
              <button
                type="button"
                onClick={
                  handleBack
                }
                disabled={
                  submitting
                }
                className="
                  cursor-pointer
                  rounded-[12px]
                  border
                  border-[#c8d9e1]/74
                  bg-white/40
                  px-5
                  py-3
                  text-[12px]
                  font-medium
                  text-[#415b6c]
                  transition-all
                  duration-200
                  hover:border-[#9eb9c9]
                  hover:bg-white/72
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Voltar
              </button>
            ) : (
              <div />
            )}

            {currentStep <
            totalSteps ? (
              <button
                type="button"
                onClick={
                  handleNext
                }
                disabled={
                  currentStep === pieceStep &&
                  !projectData.requestNeedId
                }
                className="
                  cursor-pointer
                  rounded-[12px]
                  bg-[#12364e]
                  px-6
                  py-3
                  text-[12px]
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:-translate-y-[1px]
                  hover:bg-[#0d2d41]
                  hover:shadow-[0_8px_20px_rgba(11,35,64,0.16)]
                  disabled:cursor-not-allowed
                  disabled:opacity-45
                  disabled:hover:translate-y-0
                  disabled:hover:shadow-none
                "
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  handleSubmit
                }
                disabled={
                  submitting
                }
                className="
                  cursor-pointer
                  rounded-[12px]
                  bg-[#356f9f]
                  px-6
                  py-3
                  text-[12px]
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:-translate-y-[1px]
                  hover:bg-[#285d89]
                  disabled:cursor-wait
                  disabled:opacity-60
                "
              >
                {submitting
                  ? "Registrando..."
                  : isInternalMode
                    ? "Criar solicitação"
                    : "Enviar solicitação"}
              </button>
            )}
          </div>
        </div>

        {/* ===================================================
            RESUMO
        =================================================== */}

        <aside className="h-fit rounded-[24px] border border-[#bdd1dc]/66 bg-[#e9f2f6]/62 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[18px] lg:sticky lg:top-[110px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#5687ad]">
            Solicitação
          </p>

          <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.025em] text-[#0b2340]">
            Resumo do projeto
          </h3>

          <div className="mt-6 space-y-5">
            {isInternalMode && (
              <SummaryItem
                label="Canal de entrada"
                value={
                  internalData.channel
                }
              />
            )}

            <SummaryItem
              label="Contato"
              value={
                contactData.name ||
                "Não informado"
              }
            />

            <SummaryItem
              label="Empresa"
              value={
                contactData.company ||
                "Não informada"
              }
            />

            <SummaryItem
              label="Necessidade principal"
              value={
                selectedRequestNeed?.name ||
                "Não informada"
              }
            />

            <SummaryItem
              label="Tipos de peça"
              value={
                effectivePieces.length > 0
                  ? `${effectivePieces.length}`
                  : "Não se aplica"
              }
            />

            <SummaryItem
              label="Unidades"
              value={`${totalUnits}`}
            />

            <SummaryItem
              label="Atendimento externo"
              value={
                externalCount >
                0
                  ? `${externalCount} ${
                      externalCount ===
                      1
                        ? "peça"
                        : "peças"
                    }`
                  : "Não indicado"
              }
            />

            <SummaryItem
              label="Prioridade"
              value={getUrgencyLabel(
                projectData.urgency,
              )}
            />

            <SummaryItem
              label="Prazo"
              value={getDeadlineLabel(
                projectData,
              )}
            />

            <SummaryItem
              label="Arquivos gerais"
              value={`${projectData.generalFiles.length}`}
            />
          </div>

          {currentStep >= pieceStep &&
            effectivePieces.length > 0 && (
            <div className="mt-7 border-t border-[#c9dbe3]/74 pt-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#718895]">
                Itens
              </p>

              <div className="mt-3 space-y-3">
                {effectivePieces.map(
                  (
                    piece,
                    index,
                  ) => (
                    <div
                      key={
                        piece.id
                      }
                      className="rounded-[12px] border border-white/68 bg-white/46 px-3 py-3"
                    >
                      <p className="text-[12px] font-semibold text-[#0b2340]">
                        {piece.name ||
                          `Peça ${index + 1}`}
                      </p>

                      <p className="mt-1 text-[11px] text-[#728691]">
                        {
                          piece.quantity
                        }{" "}
                        {piece.quantity ===
                        1
                          ? "unidade"
                          : "unidades"}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="mt-7 border-t border-[#c9dbe3]/74 pt-5">
            <p className="text-[11px] leading-5 text-[#657b89]">
              {isInternalMode
                ? "A solicitação será registrada no fluxo operacional interno e seguirá para análise técnica."
                : "O resumo é atualizado conforme as informações do projeto são preenchidas."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );

  /* ==========================================================
   * INTERNO
   * ========================================================== */

  if (
    isInternalMode
  ) {
    return (
      <section className="pb-8 pt-1">
        {formContent}
      </section>
    );
  }

  /* ==========================================================
   * CLIENTE
   * ========================================================== */

  if (
    isCustomerMode
  ) {
    return (
      <section className="pb-6 pt-2">
        {formContent}
      </section>
    );
  }

  /* ==========================================================
   * PÚBLICO
   * ========================================================== */

  return (
    <section className="py-10 sm:py-12 lg:py-14">
      <Container>
        {formContent}
      </Container>
    </section>
  );
}

/* ============================================================
 * IDENTIDADE INTERNA
 * ============================================================ */

function InternalIdentity() {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#c6dae4] bg-[#e9f3f7] px-5 py-4 shadow-[0_10px_30px_rgba(31,68,92,0.04)] sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#65b8ee]/10 blur-[55px]"
      />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#12364e] text-[14px] font-semibold text-white">
          +
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-semibold text-[#173f57]">
              Registro interno
            </p>
                        <span className="rounded-full border border-[#9fc5d7]/60 bg-white/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.09em] text-[#4c7890]">
              Equipe do laboratório
            </span>
          </div>

          <p className="mt-1 text-[11px] leading-5 text-[#667f8d]">
            Utilize este fluxo para registrar demandas recebidas fora dos canais
            digitais da plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * DADOS DA ORIGEM INTERNA
 * ============================================================ */

function InternalRequestFields({
  data,
  onChange,
}) {
  return (
    <div className="mb-8 rounded-[18px] border border-[#c8dce6] bg-[#edf6fa] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#47758e]">
        Origem da demanda
      </p>

      <h2 className="mt-2 text-[18px] font-semibold tracking-[-0.025em] text-[#17394f]">
        Como esta solicitação chegou ao laboratório?
      </h2>

      <p className="mt-1.5 text-[12px] leading-5 text-[#5b7584]">
        Essa informação mantém a rastreabilidade dos canais de entrada sem
        alterar o fluxo técnico da solicitação.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#557585]">
            Canal de entrada
          </span>

          <select
            value={
              data.channel
            }
            onChange={(event) =>
              onChange(
                "channel",
                event.target.value,
              )
            }
            className="
              h-11
              w-full
              rounded-[12px]
              border
              border-[#c4d7e0]
              bg-white
              px-3.5
              text-[13px]
              text-[#294e64]
              outline-none
              transition
              focus:border-[#78a9c4]
            "
          >
            <option value="E-mail">
              E-mail
            </option>

            <option value="Telefone">
              Telefone
            </option>

            <option value="Presencial">
              Presencial
            </option>

            <option value="Indicação">
              Indicação
            </option>

            <option value="Evento ou visita">
              Evento ou visita
            </option>

            <option value="Outro">
              Outro
            </option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#557585]">
            Departamento do contato
          </span>

          <input
            type="text"
            value={
              data.department
            }
            onChange={(event) =>
              onChange(
                "department",
                event.target.value,
              )
            }
            placeholder="Ex.: Qualidade"
            className="
              h-11
              w-full
              rounded-[12px]
              border
              border-[#c4d7e0]
              bg-white
              px-3.5
              text-[13px]
              text-[#294e64]
              outline-none
              transition
              placeholder:text-[#8497a2]
              focus:border-[#78a9c4]
            "
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#557585]">
          Observação sobre o contato
        </span>

        <textarea
          rows={3}
          value={
            data.channelDetails
          }
          onChange={(event) =>
            onChange(
              "channelDetails",
              event.target.value,
            )
          }
          placeholder="Ex.: contato recebido após visita técnica; cliente solicitou retorno por e-mail..."
          className="
            w-full
            resize-y
            rounded-[12px]
            border
            border-[#c4d7e0]
            bg-white
            px-3.5
            py-3
            text-[13px]
            leading-6
            text-[#294e64]
            outline-none
            transition
            placeholder:text-[#8497a2]
            focus:border-[#78a9c4]
          "
        />
      </label>
    </div>
  );
}

/* ============================================================
 * REVISÃO INTERNA
 * ============================================================ */

function InternalReviewSummary({
  data,
}) {
  return (
    <div className="mb-5 rounded-[16px] border border-[#c8dce6] bg-[#edf6fa] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#47758e]">
        Registro interno
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SummaryItem
          label="Origem"
          value="Interno"
        />

        <SummaryItem
          label="Canal"
          value={
            data.channel
          }
        />

        <SummaryItem
          label="Departamento"
          value={
            data.department ||
            "Não informado"
          }
        />

        <SummaryItem
          label="Observação do canal"
          value={
            data.channelDetails ||
            "Não informada"
          }
        />
      </div>
    </div>
  );
}

/* ============================================================
 * CLIENTE IDENTIFICADO
 * ============================================================ */

function CustomerIdentity({
  contactData,
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-white/72
        bg-white/44
        px-5
        py-4
        shadow-[0_10px_30px_rgba(31,68,92,0.055)]
        backdrop-blur-[18px]
        sm:px-6
      "
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#65b8ee]/10 blur-[55px]"
      />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#12364e] text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(18,54,78,0.13)]">
            {getInitials(
              contactData.name,
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[12px] font-semibold text-[#173f57]">
                {contactData.company ||
                  "Empresa cadastrada"}
              </p>

              <span className="rounded-full border border-[#9fc5d7]/52 bg-[#e1eff5]/72 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#4c7890]">
                Conta identificada
              </span>
            </div>

            <p className="mt-1 text-[10px] leading-5 text-[#708690]">
              {contactData.name ||
                "Cliente"}

              {contactData.email
                ? ` • ${contactData.email}`
                : ""}
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7b929e]">
            Dados cadastrais
          </p>

          <p className="mt-1 text-[10px] text-[#718792]">
            Utilizados automaticamente nesta solicitação.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * PROGRESSO — CLIENTE
 * ============================================================ */

const customerSteps = [
  {
    number: 1,
    label: "Necessidade",
  },

  {
    number: 2,
    label: "Projeto",
  },

  {
    number: 3,
    label: "Revisão",
  },
];

function CustomerQuoteProgress({
  currentStep,
  maxStepReached,
  onStepChange,
}) {
  return (
    <div>
      <div className="hidden grid-cols-3 gap-3 md:grid">
        {customerSteps.map(
          (step) => {
            const active =
              step.number ===
              currentStep;

            const visited =
              step.number <=
              maxStepReached;

            const completed =
              step.number <
              currentStep;

            return (
              <button
                key={
                  step.number
                }
                type="button"
                disabled={
                  !visited
                }
                onClick={() => {
                  if (
                    visited
                  ) {
                    onStepChange(
                      step.number,
                    );
                  }
                }}
                className={`
                  relative
                  rounded-[16px]
                  px-4
                  py-3.5
                  text-left
                  transition-all
                  duration-200

                  ${
                    visited
                      ? "cursor-pointer"
                      : "cursor-default"
                  }

                  ${
                    active
                      ? "bg-[#e4eff5]/80"
                      : visited
                        ? "hover:bg-white/42"
                        : ""
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      text-[11px]
                      font-semibold

                      ${
                        active
                          ? "border-[#356f9f] bg-[#356f9f] text-white"
                          : completed
                            ? "border-[#85b3d0] bg-[#e9f3f9] text-[#356f9f]"
                            : visited
                              ? "border-[#9bbfd6] bg-white/50 text-[#356f9f]"
                              : "border-[#d0dde4] bg-white/30 text-[#97a5ae]"
                      }
                    `}
                  >
                    {completed
                      ? "✓"
                      : String(
                          step.number,
                        ).padStart(
                          2,
                          "0",
                        )}
                  </div>

                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.11em] text-[#7a8e9b]">
                      Etapa
                    </p>

                    <p
                      className={`
                        mt-0.5
                        text-[13px]
                        font-semibold

                        ${
                          active
                            ? "text-[#0b2340]"
                            : visited
                              ? "text-[#526b7a]"
                              : "text-[#9aa8b1]"
                        }
                      `}
                    >
                      {
                        step.label
                      }
                    </p>
                  </div>
                </div>
              </button>
            );
          },
        )}
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6e8794]">
            Etapa{" "}
            {currentStep} de 3
          </p>

          <p className="text-[11px] font-semibold text-[#315f79]">
            {
              customerSteps[
                currentStep -
                  1
              ]?.label
            }
          </p>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {customerSteps.map(
            (step) => (
              <div
                key={
                  step.number
                }
                className={`
                  h-[4px]
                  rounded-full

                  ${
                    step.number <=
                    currentStep
                      ? "bg-[#356f9f]"
                      : "bg-[#c5d5dd]"
                  }
                `}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * RESUMO
 * ============================================================ */

function SummaryItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#718895]">
        {label}
      </p>

      <p className="mt-1.5 break-words text-[13px] font-medium leading-5 text-[#0b2340]">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
 * LABELS
 * ============================================================ */

function getUrgencyLabel(
  urgency,
) {
  const labels = {
    normal:
      "Normal",

    priority:
      "Prioritário",

    urgent:
      "Urgente",
  };

  return (
    labels[
      urgency
    ] ??
    "Normal"
  );
}

function getDeadlineLabel(
  data,
) {
  if (
    data.deadlineType ===
    "15days"
  ) {
    return "Até 15 dias";
  }

  if (
    data.deadlineType ===
    "30days"
  ) {
    return "Até 30 dias";
  }

  if (
    data.deadlineType ===
    "specificDate"
  ) {
    if (
      !data.specificDate
    ) {
      return "Data a informar";
    }

    const [
      year,
      month,
      day,
    ] =
      data.specificDate.split(
        "-",
      );

    return `${day}/${month}/${year}`;
  }

  return "Sem prazo definido";
}

function getInitials(
  name,
) {
  const parts =
    String(
      name ||
        "Cliente",
    )
      .trim()
      .split(/\s+/)
      .filter(
        Boolean,
      );

  if (
    parts.length ===
    1
  ) {
    return parts[0]
      .slice(
        0,
        2,
      )
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function createId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}