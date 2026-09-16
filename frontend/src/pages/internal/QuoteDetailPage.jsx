import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import {
  QuoteStatusBadge,
} from "../../components/internal/QuoteStatusBadge";

import {
  RequestDetailSection,
  RequestInfoItem,
} from "../../components/internal/RequestDetailSection";

import {
  acceptRuntimeQuote,
  approveQuoteInternally,
  cancelRuntimeQuote,
  getQuoteKnowledgeSupport,
  getRuntimeQuoteById,
  markQuoteAsSent,
  recordQuoteEvent,
  rejectRuntimeQuote,
  returnQuoteToEditing,
  sendQuoteToReview,
  updateRuntimeQuote,
} from "../../services/quoteService";

import {
  createProjectFromQuote,
  getProjectByQuoteId,
} from "../../services/projectService";

import {
  buildPricingInsights,
  calculateCommercialTotal,
  getCommercialReference,
} from "../../services/pricingService";

import {
  getAllMachineCostKnowledge,
} from "../../data/internal/pricingKnowledge";

const currentUser =
  "Administrador";

const editableStatuses = [
  "Rascunho",
  "Em elaboração",
];

export function QuoteDetailPage() {
  const navigate =
    useNavigate();

  const {
    quoteId,
  } = useParams();

  const initialQuote =
    getRuntimeQuoteById(
      quoteId,
    );

  const commercialReference =
    getCommercialReference();

  const machines =
    getAllMachineCostKnowledge();

  const [
    quote,
    setQuote,
  ] = useState(
    initialQuote,
  );

  const [
    linkedProject,
    setLinkedProject,
  ] = useState(() =>
    initialQuote
      ? getProjectByQuoteId(
          initialQuote.id,
        )
      : null,
  );

  const [
    scope,
    setScope,
  ] = useState(
    initialQuote?.scope ||
      `Executar ${
        initialQuote?.service?.toLowerCase() ??
        "o serviço"
      } conforme o escopo técnico aprovado na solicitação ${
        initialQuote?.requestId ??
        ""
      }.`,
  );

  const [
    machineId,
    setMachineId,
  ] = useState(
    initialQuote?.machineId ??
      "",
  );

  const [
    technicalHours,
    setTechnicalHours,
  ] = useState(
    String(
      initialQuote?.technicalHours ??
        "",
    ),
  );

  const [
    billableHours,
    setBillableHours,
  ] = useState(
    String(
      initialQuote?.billableHours ??
        "",
    ),
  );

  const [
    hourlyRate,
    setHourlyRate,
  ] = useState(
    String(
      initialQuote?.hourlyRate ??
        commercialReference.hourlyRate,
    ),
  );

  const [
    deadlineDays,
    setDeadlineDays,
  ] = useState(
    String(
      initialQuote?.deadlineDays ??
        "",
    ),
  );

  const [
    validityDays,
    setValidityDays,
  ] = useState(
    String(
      initialQuote?.validityDays ??
        15,
    ),
  );

  const [
    estimateJustification,
    setEstimateJustification,
  ] = useState(
    initialQuote?.estimateJustification ??
      "",
  );

  const [
    commercialNotes,
    setCommercialNotes,
  ] = useState(
    initialQuote?.commercialNotes ??
      "",
  );

  const [
    feedback,
    setFeedback,
  ] = useState(
    null,
  );

  const [
    showProposal,
    setShowProposal,
  ] = useState(
    false,
  );

  const [
    showProjectConfirmation,
    setShowProjectConfirmation,
  ] = useState(
    false,
  );

  const [
    confirmationAction,
    setConfirmationAction,
  ] = useState(
    null,
  );

  const [
    confirmationReason,
    setConfirmationReason,
  ] = useState(
    "",
  );

  const pricingContext =
    useMemo(
      () =>
        buildPricingInsights({
          machineId:
            machineId ||
            null,

          technicalHours:
            toNumber(
              technicalHours,
            ),

          hourlyRate:
            toNumber(
              hourlyRate,
            ),

          billableHours:
            toNumber(
              billableHours,
            ),
        }),
      [
        machineId,
        technicalHours,
        hourlyRate,
        billableHours,
      ],
    );

  const commercialTotal =
    calculateCommercialTotal({
      hourlyRate:
        toNumber(
          hourlyRate,
        ),

      billableHours:
        toNumber(
          billableHours,
        ),
    });

  if (
    !quote
  ) {
    return (
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/orcamentos",
            )
          }
          className="text-xs font-semibold text-[#356f9f]"
        >
          ← Voltar para orçamentos
        </button>

        <div className="mt-6 rounded-[22px] border border-[#d1dde4] bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-[#17394f]">
            Orçamento não encontrado.
          </p>
        </div>
      </div>
    );
  }

  const knowledgeSupport =
    getQuoteKnowledgeSupport(
      quote.id,
    );

  const isEditable =
    editableStatuses.includes(
      quote.status,
    );

  function saveQuote(
    showMessage = true,
  ) {
    if (
      !isEditable
    ) {
      return quote;
    }

    const updatedQuote =
      updateRuntimeQuote(
        quote.id,
        {
          scope:
            scope.trim(),

          machineId:
            machineId ||
            null,

          technicalHours:
            toNumber(
              technicalHours,
            ),

          billableHours:
            toNumber(
              billableHours,
            ),

          hourlyRate:
            toNumber(
              hourlyRate,
            ),

          internalCost:
            pricingContext
              .technicalReference
              ?.estimatedCost ??
            0,

          proposedValue:
            commercialTotal,

          deadlineDays:
            toNumber(
              deadlineDays,
            ),

          validityDays:
            toNumber(
              validityDays,
            ),

          estimateJustification:
            estimateJustification.trim(),

          commercialNotes:
            commercialNotes.trim(),
        },
      );

    setQuote(
      updatedQuote,
    );

    if (
      showMessage
    ) {
      showFeedback(
        "Alterações salvas.",
        "success",
      );
    }

    return updatedQuote;
  }

  function handleSendToReview() {
    try {
      saveQuote(
        false,
      );

      const updatedQuote =
        sendQuoteToReview(
          quote.id,
          currentUser,
        );

      setQuote(
        updatedQuote,
      );

      showFeedback(
        "Orçamento enviado para revisão. A estimativa foi registrada no histórico.",
        "success",
      );
    } catch (
      error
    ) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  function handleApprove() {
    try {
      const updatedQuote =
        approveQuoteInternally(
          quote.id,
          currentUser,
        );

      setQuote(
        updatedQuote,
      );

      showFeedback(
        "Orçamento aprovado internamente.",
        "success",
      );
    } catch (
      error
    ) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  function handleReturnToEditing() {
    try {
      const updatedQuote =
        returnQuoteToEditing(
          quote.id,
          currentUser,
        );

      setQuote(
        updatedQuote,
      );

      showFeedback(
        "Orçamento retornou para elaboração.",
        "success",
      );
    } catch (
      error
    ) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  function handleGenerateProposal() {
    setShowProposal(
      true,
    );
  }

  function handleMarkAsSent() {
    try {
      const updatedQuote =
        markQuoteAsSent(
          quote.id,
          currentUser,
        );

      setQuote(
        updatedQuote,
      );

      setShowProposal(
        false,
      );

      showFeedback(
        "Proposta marcada como enviada ao cliente.",
        "success",
      );
    } catch (
      error
    ) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  function handleAccept() {
    try {
      const updatedQuote =
        acceptRuntimeQuote(
          quote.id,
          currentUser,
        );

      setQuote(
        updatedQuote,
      );

      closeConfirmation();

      showFeedback(
        "Aceite do cliente registrado.",
        "success",
      );
    } catch (
      error
    ) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  function handleReject() {
    try {
      const updatedQuote =
        rejectRuntimeQuote(
          quote.id,
          currentUser,
          confirmationReason,
        );

      setQuote(
        updatedQuote,
      );

      closeConfirmation();

      showFeedback(
        "Recusa do cliente registrada.",
        "success",
      );
    } catch (
      error
    ) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  function handleCancel() {
    try {
      const updatedQuote =
        cancelRuntimeQuote(
          quote.id,
          currentUser,
          confirmationReason,
        );

      setQuote(
        updatedQuote,
      );

      closeConfirmation();

      showFeedback(
        "Orçamento cancelado.",
        "success",
      );
    } catch (
      error
    ) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  function openConfirmation(
    action,
  ) {
    setConfirmationReason(
      "",
    );

    setConfirmationAction(
      action,
    );
  }

  function closeConfirmation() {
    setConfirmationAction(
      null,
    );

    setConfirmationReason(
      "",
    );
  }

  function handleProjectAction() {
    if (
      linkedProject
    ) {
      navigate(
        `/portal/projetos/${linkedProject.id}`,
      );

      return;
    }

    if (
      quote.status !==
      "Aceito"
    ) {
      return;
    }

    setShowProjectConfirmation(
      true,
    );
  }

  function handleConfirmProjectCreation() {
    try {
      const result =
        createProjectFromQuote(
          quote.id,
        );

      recordQuoteEvent(
        quote.id,
        {
          action:
            "Projeto criado",

          actor:
            currentUser,

          description:
            `O orçamento aceito originou o projeto ${result.project.id}.`,
        },
      );

      const updatedQuote =
        getRuntimeQuoteById(
          quote.id,
        );

      setQuote(
        updatedQuote,
      );

      setLinkedProject(
        result.project,
      );

      setShowProjectConfirmation(
        false,
      );

      navigate(
        `/portal/projetos/${result.project.id}`,
      );
    } catch (
      error
    ) {
      setShowProjectConfirmation(
        false,
      );

      showFeedback(
        error.message,
        "error",
      );
    }
  }

  function showFeedback(
    message,
    type = "success",
  ) {
    setFeedback({
      message,
      type,
    });

    window.setTimeout(
      () => {
        setFeedback(
          null,
        );
      },
      3200,
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/orcamentos",
            )
          }
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5681a0] transition hover:text-[#0b2340]"
        >
          ← Voltar para orçamentos
        </button>

        <InternalPageHeader
          eyebrow={`${quote.requestId} · ${quote.id}`}
          title={
            quote.company
          }
          description="Proposta comercial e técnica vinculada à solicitação."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge
                source={
                  quote.source
                }
              />

              <QuoteStatusBadge
                status={
                  quote.status
                }
              />

              {isEditable && (
                <button
                  type="button"
                  onClick={() =>
                    saveQuote()
                  }
                  className="rounded-[12px] bg-[#12364e] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#0d2d41]"
                >
                  Salvar orçamento
                </button>
              )}
            </div>
          }
        />

        {feedback && (
          <FeedbackMessage
            feedback={
              feedback
            }
          />
        )}

        {quote.source !==
          "real" && (
          <div className="mt-5 rounded-[14px] border border-[#ded1b3] bg-[#faf5e9] px-4 py-3">
            <p className="text-[12px] leading-5 text-[#806b3d]">
              <strong className="font-semibold">
                Base de demonstração.
              </strong>{" "}
              Este orçamento pode ser usado para validar o fluxo da interface, mas não deve alimentar os indicadores nem o aprendizado da futura base real.
            </p>
          </div>
        )}

        {!isEditable &&
          ![
            "Aceito",
            "Recusado",
            "Cancelado",
          ].includes(
            quote.status,
          ) && (
            <div className="mt-5 rounded-[14px] border border-[#cadce6] bg-[#edf5f9] px-4 py-3">
              <p className="text-[12px] leading-5 text-[#58788b]">
                Os dados da estimativa e as condições comerciais estão bloqueados nesta etapa. Para alterá-los, o orçamento deve retornar para elaboração.
              </p>
            </div>
          )}

        <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <RequestDetailSection
              eyebrow="01"
              title="Identificação"
              description="Dados herdados da solicitação de origem."
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <RequestInfoItem
                  label="Orçamento"
                  value={
                    quote.id
                  }
                />

                <RequestInfoItem
                  label="Solicitação"
                  value={
                    quote.requestId
                  }
                />

                <RequestInfoItem
                  label="Cliente"
                  value={
                    quote.company
                  }
                />

                <RequestInfoItem
                  label="Contato"
                  value={
                    quote.contact
                  }
                />

                <RequestInfoItem
                  label="Serviço"
                  value={
                    quote.service
                  }
                />

                <RequestInfoItem
                  label="Responsável"
                  value={
                    quote.responsible
                  }
                />
              </div>
            </RequestDetailSection>

            <RequestDetailSection
              eyebrow="02"
              title="Escopo técnico"
              description="Descrição do que será considerado na proposta."
            >
              <textarea
                value={
                  scope
                }
                disabled={
                  !isEditable
                }
                onChange={(event) =>
                  setScope(
                    event.target.value,
                  )
                }
                rows={7}
                placeholder="Descreva o escopo técnico do atendimento..."
                className={getTextareaClasses(
                  !isEditable,
                )}
              />
            </RequestDetailSection>

            <RequestDetailSection
              eyebrow="03"
              title="Assistente de orçamento"
              description="Apoio técnico e comercial para a estimativa. O sistema apresenta referências e evidências; a decisão permanece sob responsabilidade do profissional."
            >
              <KnowledgeAssistantPanel
                knowledge={
                  knowledgeSupport
                }
                onOpenKnowledge={() =>
                  navigate(
                    "/portal/conhecimento",
                  )
                }
              />

              <div className="mt-6">
                <label>
                  <span className={labelClasses}>
                    Tecnologia de referência
                  </span>

                  <select
                    value={
                      machineId
                    }
                    disabled={
                      !isEditable
                    }
                    onChange={(event) =>
                      setMachineId(
                        event.target.value,
                      )
                    }
                    className={`${getInputClasses(
                      !isEditable,
                    )} mt-2`}
                  >
                    <option value="">
                      Selecionar tecnologia
                    </option>

                    {machines.map(
                      (machine) => (
                        <option
                          key={
                            machine.id
                          }
                          value={
                            machine.id
                          }
                        >
                          {
                            machine.name + (machine.local ? "" : " · Outra unidade (indisponível localmente)")
                          }
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>

              <div className="mt-6 rounded-[18px] border border-[#c8dbe5] bg-[#edf6fa] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5681a0]">
                  Base técnica disponível
                </p>

                <p className="mt-1.5 text-[12px] leading-5 text-[#718795]">
                  Estes valores vêm das referências internas de custo e precificação. Eles não são tratados como aprendizado histórico de serviços executados.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <KnowledgeMetric
                    label="Custo técnico de referência"
                    value={
                      pricingContext
                        .technicalReference
                        ? `${formatCurrency(
                            pricingContext
                              .technicalReference
                              .hourlyCost,
                          )}/h`
                        : "Selecione uma tecnologia"
                    }
                    detail={
                      pricingContext
                        .technicalReference
                        ? "Referência calculada a partir da base interna de custos do equipamento."
                        : "A referência será exibida quando uma tecnologia for selecionada."
                    }
                  />

                  <KnowledgeMetric
                    label="Referência comercial vigente"
                    value={`${formatCurrency(
                      commercialReference.hourlyRate,
                    )}/h`}
                    detail="Parâmetro comercial atualmente cadastrado. O responsável continua livre para definir a proposta."
                  />
                </div>

                {pricingContext
                  .technicalReference && (
                  <div className="mt-4 border-t border-[#cfdee6] pt-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7b909c]">
                      Fonte da referência técnica
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#48697d]">
                      {
                        pricingContext
                          .technicalReference
                          .machine
                          .source
                      }
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#607989]">
                  Estimativa do responsável
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <NumberInput
                    label="Horas técnicas previstas"
                    value={
                      technicalHours
                    }
                    onChange={
                      setTechnicalHours
                    }
                    suffix="h"
                    disabled={
                      !isEditable
                    }
                  />

                  <NumberInput
                    label="Horas cobradas"
                    value={
                      billableHours
                    }
                    onChange={
                      setBillableHours
                    }
                    suffix="h"
                    disabled={
                      !isEditable
                    }
                  />

                  <CurrencyInput
                    label="Valor/hora definido"
                    value={
                      hourlyRate
                    }
                    onChange={
                      setHourlyRate
                    }
                    suffix="/h"
                    disabled={
                      !isEditable
                    }
                  />
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[18px] border border-[#b9d3e1] bg-[#e5f0f6]">
                <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#5681a0]">
                      Valor da proposta
                    </p>

                    <p className="mt-2 text-[12px] leading-5 text-[#6b8290]">
                      {formatHours(
                        billableHours,
                      )}{" "}
                      ×{" "}
                      {formatCurrency(
                        toNumber(
                          hourlyRate,
                        ),
                      )}
                      /h
                    </p>
                  </div>

                  <p className="text-3xl font-semibold tracking-[-0.035em] text-[#096ab2]">
                    {formatCurrency(
                      commercialTotal,
                    )}
                  </p>
                </div>
              </div>

              {pricingContext
                .technicalReference && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <ReferenceSummary
                    label="Custo técnico estimado"
                    value={
                      technicalHours
                        ? formatCurrency(
                            pricingContext
                              .technicalReference
                              .estimatedCost,
                          )
                        : "Informe as horas técnicas"
                    }
                    description={`${formatCurrency(
                      pricingContext
                        .technicalReference
                        .hourlyCost,
                    )}/h × ${formatHours(
                      technicalHours,
                    )}`}
                  />

                  <ReferenceSummary
                    label="Diferença comercial"
                    value={
                      getDifferenceLabel(
                        pricingContext
                          .technicalReference
                          .estimatedCost,
                        commercialTotal,
                      )
                    }
                    description="Comparação informativa entre custo técnico de referência e valor comercial."
                  />
                </div>
              )}

              {pricingContext
                .insights
                .length > 0 && (
                <div className="mt-5 space-y-2">
                  {pricingContext.insights.map(
                    (
                      insight,
                      index,
                    ) => (
                      <PricingInsight
                        key={`${insight.title}-${index}`}
                        insight={
                          insight
                        }
                      />
                    ),
                  )}
                </div>
              )}

              <label className="mt-6 block">
                <span className={labelClasses}>
                  Justificativa técnica da estimativa
                </span>

                <p className="mt-1 text-[11px] leading-5 text-[#7a8f9a]">
                  Registre por que estas horas, tecnologia e condições foram escolhidas. Esta informação será importante para comparar o orçado com o realizado e alimentar o conhecimento futuro.
                </p>

                <textarea
                  value={
                    estimateJustification
                  }
                  disabled={
                    !isEditable
                  }
                  onChange={(event) =>
                    setEstimateJustification(
                      event.target.value,
                    )
                  }
                  rows={5}
                  placeholder="Ex.: estimativa considera preparação, fixação, programação, medição e análise dos resultados..."
                  className={`${getTextareaClasses(
                    !isEditable,
                  )} mt-3`}
                />
              </label>
            </RequestDetailSection>

            <RequestDetailSection
              eyebrow="04"
              title="Condições comerciais"
              description="Informações que poderão aparecer na proposta enviada ao cliente."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Validade da proposta"
                  value={
                    validityDays
                  }
                  onChange={
                    setValidityDays
                  }
                  suffix="dias"
                  disabled={
                    !isEditable
                  }
                />

                <NumberInput
                  label="Prazo de execução"
                  value={
                    deadlineDays
                  }
                  onChange={
                    setDeadlineDays
                  }
                  suffix="dias"
                  disabled={
                    !isEditable
                  }
                />
              </div>

              <label className="mt-5 block">
                <span className={labelClasses}>
                  Observações comerciais
                </span>

                <textarea
                  value={
                    commercialNotes
                  }
                  disabled={
                    !isEditable
                  }
                  onChange={(event) =>
                    setCommercialNotes(
                      event.target.value,
                    )
                  }
                  rows={5}
                  placeholder="Condições de pagamento, transporte, entrega ou outras observações..."
                  className={getTextareaClasses(
                    !isEditable,
                  )}
                />
              </label>
            </RequestDetailSection>

            {quote.status ===
              "Aceito" && (
              <RequestDetailSection
                eyebrow="05"
                title="Execução do serviço"
                description="Um projeto pode ser iniciado somente após o aceite comercial do orçamento."
              >
                {linkedProject ? (
                  <div className="rounded-[18px] border border-[#bdd7c8] bg-[#edf7f1] p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#4c7b5e]">
                      Projeto criado
                    </p>

                    <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xl font-semibold text-[#315f45]">
                          {
                            linkedProject.id
                          }
                        </p>

                        <p className="mt-1 text-[12px] text-[#6d8677]">
                          O orçamento já avançou para execução.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          handleProjectAction
                        }
                        className="w-fit rounded-[11px] bg-[#397250] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-white"
                      >
                        Abrir projeto
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[18px] border border-[#c7d9e3] bg-[#edf6fa] p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5681a0]">
                      Orçamento aceito
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-[#17394f]">
                      O serviço pode avançar para execução.
                    </h3>

                    <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[#718795]">
                      Ao criar o projeto, a estimativa comercial será preservada para permitir a futura comparação entre o que foi orçado e o que realmente foi executado.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleProjectAction
                      }
                      className="mt-5 rounded-[11px] bg-[#096ab2] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-white transition hover:bg-[#075b99]"
                    >
                      Criar projeto
                    </button>
                  </div>
                )}
              </RequestDetailSection>
            )}

            <RequestDetailSection
              eyebrow={
                quote.status ===
                "Aceito"
                  ? "06"
                  : "05"
              }
              title="Histórico comercial"
              description="Registro das principais movimentações e versões da estimativa."
            >
              {quote.history
                ?.length >
              0 ? (
                <div>
                  {quote.history.map(
                    (
                      item,
                      index,
                    ) => (
                      <QuoteHistoryItem
                        key={
                          item.id ??
                          `${item.action}-${index}`
                        }
                        item={
                          item
                        }
                        last={
                          index ===
                          quote.history
                            .length -
                            1
                        }
                      />
                    ),
                  )}
                </div>
              ) : (
                <EmptyBlock text="Nenhuma movimentação comercial registrada neste orçamento." />
              )}
            </RequestDetailSection>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[22px] border border-[#c6d9e3] bg-[#e6f0f5] p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
                Resumo comercial
              </p>

              <div className="mt-5 space-y-5">
                <SummaryLine
                  label="Valor/hora"
                  value={
                    toNumber(
                      hourlyRate,
                    ) > 0
                      ? `${formatCurrency(
                          toNumber(
                            hourlyRate,
                          ),
                        )}/h`
                      : "A definir"
                  }
                />

                <SummaryLine
                  label="Horas cobradas"
                  value={
                    toNumber(
                      billableHours,
                    ) > 0
                      ? `${formatNumber(
                          toNumber(
                            billableHours,
                          ),
                        )} h`
                      : "A definir"
                  }
                />

                <div className="border-t border-[#cadbe4] pt-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#5681a0]">
                    Total
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#096ab2]">
                    {commercialTotal >
                    0
                      ? formatCurrency(
                          commercialTotal,
                        )
                      : "A definir"}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[#c9dbe4] pt-5">
                <QuoteWorkflowActions
                  quote={
                    quote
                  }
                  linkedProject={
                    linkedProject
                  }
                  onSendToReview={
                    handleSendToReview
                  }
                  onApprove={
                    handleApprove
                  }
                  onReturnToEditing={
                    handleReturnToEditing
                  }
                  onGenerateProposal={
                    handleGenerateProposal
                  }
                  onAccept={() =>
                    openConfirmation(
                      "accept",
                    )
                  }
                  onReject={() =>
                    openConfirmation(
                      "reject",
                    )
                  }
                  onProject={
                    handleProjectAction
                  }
                />

                {![
                  "Aceito",
                  "Recusado",
                  "Cancelado",
                ].includes(
                  quote.status,
                ) && (
                  <button
                    type="button"
                    onClick={() =>
                      openConfirmation(
                        "cancel",
                      )
                    }
                    className="mt-2 w-full rounded-[11px] border border-[#dfc7c0] bg-white px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#9a5947] transition hover:bg-[#faf2ef]"
                  >
                    Cancelar orçamento
                  </button>
                )}
              </div>
            </section>

            <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718895]">
                Rastreabilidade da estimativa
              </p>

              <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#31566d]">
                {
                  quote.estimateVersions
                    ?.length ??
                  0
                }
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#718795]">
                {quote.estimateVersions
                  ?.length ===
                1
                  ? "versão enviada para revisão"
                  : "versões enviadas para revisão"}
              </p>

              <p className="mt-4 border-t border-[#e0e8ec] pt-4 text-[11px] leading-5 text-[#748995]">
                Uma nova versão é registrada sempre que o orçamento sai da elaboração e segue para revisão.
              </p>
            </section>

            {quote.status ===
              "Enviado" && (
              <section className="rounded-[22px] border border-[#c9dbea] bg-[#f0f6fa] p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
                  Situação comercial
                </p>

                <p className="mt-3 text-lg font-semibold text-[#31566d]">
                  Aguardando cliente
                </p>

                <p className="mt-2 text-[12px] leading-5 text-[#708795]">
                  A proposta foi enviada. Registre o retorno do cliente quando ele ocorrer.
                </p>
              </section>
            )}

            {quote.status ===
              "Aceito" && (
              <section className="rounded-[22px] border border-[#bdd8c7] bg-[#edf7f1] p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#4b795c]">
                  Situação comercial
                </p>

                <p className="mt-3 text-lg font-semibold text-[#315f45]">
                  Orçamento aceito
                </p>

                <p className="mt-2 text-[12px] leading-5 text-[#708778]">
                  A etapa comercial foi concluída e o serviço pode seguir para execução.
                </p>

                <button
                  type="button"
                  onClick={
                    handleProjectAction
                  }
                  className="mt-4 w-full rounded-[11px] bg-[#397250] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.09em] text-white"
                >
                  {linkedProject
                    ? `Abrir ${linkedProject.id}`
                    : "Criar projeto"}
                </button>
              </section>
            )}

            {quote.status ===
              "Recusado" && (
              <StateCard
                title="Proposta recusada"
                description={
                  quote.rejection
                    ?.reason ||
                  "O cliente recusou a proposta e o orçamento foi encerrado."
                }
              />
            )}

            {quote.status ===
              "Cancelado" && (
              <StateCard
                title="Orçamento cancelado"
                description={
                  quote.cancellation
                    ?.reason ||
                  "Este orçamento foi encerrado antes da conclusão da negociação."
                }
              />
            )}

            <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718895]">
                Origem
              </p>

              <p className="mt-3 text-[12px] leading-5 text-[#6d8390]">
                Este orçamento foi criado a partir da solicitação{" "}
                <span className="font-semibold text-[#356f9f]">
                  {
                    quote.requestId
                  }
                </span>
                .
              </p>

              {quote.requestOrigin && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <ControlInfo
                    label="Origem da solicitação"
                    value={
                      quote.requestOrigin
                    }
                  />

                  <ControlInfo
                    label="Canal"
                    value={
                      quote.requestChannel ||
                      "Não informado"
                    }
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/portal/solicitacoes/${quote.requestId}`,
                  )
                }
                className="mt-4 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#356f9f]"
              >
                Consultar solicitação original →
              </button>
            </section>

            <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718895]">
                Controle
              </p>

              <div className="mt-4 space-y-4">
                <ControlInfo
                  label="Status"
                  value={
                    quote.status
                  }
                />

                <ControlInfo
                  label="Base"
                  value={
                    quote.source ===
                    "real"
                      ? "Real"
                      : "Demonstração"
                  }
                />

                <ControlInfo
                  label="Criado em"
                  value={
                    quote.createdAt
                  }
                />

                <ControlInfo
                  label="Última atualização"
                  value={
                    quote.updatedAt
                  }
                />

                <ControlInfo
                  label="Responsável"
                  value={
                    quote.responsible
                  }
                />
              </div>
            </section>
          </aside>
        </div>
      </div>

      {showProposal && (
        <ProposalPreviewModal
          quote={
            quote
          }
          scope={
            scope
          }
          hourlyRate={toNumber(
            hourlyRate,
          )}
          billableHours={toNumber(
            billableHours,
          )}
          total={
            commercialTotal
          }
          deadlineDays={
            deadlineDays
          }
          validityDays={
            validityDays
          }
          commercialNotes={
            commercialNotes
          }
          allowMarkAsSent={
            quote.status ===
            "Aprovado internamente"
          }
          onMarkAsSent={
            handleMarkAsSent
          }
          onClose={() =>
            setShowProposal(
              false,
            )
          }
        />
      )}

      {showProjectConfirmation && (
        <ProjectCreationModal
          quote={
            quote
          }
          onCancel={() =>
            setShowProjectConfirmation(
              false,
            )
          }
          onConfirm={
            handleConfirmProjectCreation
          }
        />
      )}

      {confirmationAction ===
        "accept" && (
        <ConfirmationModal
          eyebrow="Retorno do cliente"
          title={`Registrar aceite de ${quote.id}?`}
          description="Depois do aceite, este orçamento poderá originar um projeto."
          confirmLabel="Confirmar aceite"
          onCancel={
            closeConfirmation
          }
          onConfirm={
            handleAccept
          }
        />
      )}

      {confirmationAction ===
        "reject" && (
        <ConfirmationModal
          eyebrow="Retorno do cliente"
          title={`Registrar recusa de ${quote.id}?`}
          description="O orçamento será encerrado como recusado. O motivo ficará registrado no histórico comercial."
          confirmLabel="Confirmar recusa"
          danger
          reasonLabel="Motivo da recusa"
          reason={
            confirmationReason
          }
          onReasonChange={
            setConfirmationReason
          }
          reasonRequired
          onCancel={
            closeConfirmation
          }
          onConfirm={
            handleReject
          }
        />
      )}

      {confirmationAction ===
        "cancel" && (
        <ConfirmationModal
          eyebrow="Encerrar orçamento"
          title={`Cancelar ${quote.id}?`}
          description="O orçamento será encerrado e sairá do fluxo comercial ativo. Registre o motivo para manter a rastreabilidade."
          confirmLabel="Confirmar cancelamento"
          danger
          reasonLabel="Motivo do cancelamento"
          reason={
            confirmationReason
          }
          onReasonChange={
            setConfirmationReason
          }
          reasonRequired
          onCancel={
            closeConfirmation
          }
          onConfirm={
            handleCancel
          }
        />
      )}
    </>
  );
}

/* ============================================================
 * ASSISTENTE DE ORÇAMENTO
 * ============================================================ */

function KnowledgeAssistantPanel({
  knowledge,
  onOpenKnowledge,
}) {
  if (
    !knowledge
  ) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[19px] border border-[#b8d2e0] bg-[linear-gradient(135deg,#eef7fb_0%,#e4f0f6_100%)]">
      <div className="border-b border-[#cadde7] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#397392]">
                Motor de conhecimento e recomendação
              </p>

              <span className="rounded-full border border-[#c2d8e4] bg-white/70 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#658090]">
                Histórico ainda não conectado
              </span>
            </div>

            <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.025em] text-[#17394f]">
              A recomendação deve ser explicável.
            </h3>

            <p className="mt-2 max-w-[680px] text-[12px] leading-5 text-[#617b89]">
              {knowledge.message}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onOpenKnowledge
            }
            className="w-fit shrink-0 rounded-[10px] border border-[#aac8d8] bg-white/70 px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#356f9f] transition hover:bg-white"
          >
            Gestão do conhecimento
          </button>
        </div>
      </div>

      <div className="grid gap-px bg-[#cbdde6] sm:grid-cols-3">
        <KnowledgeStatusItem
          label="Casos reais comparáveis"
          value="0"
          detail="Nenhum Registro de Serviço conectado"
        />

        <KnowledgeStatusItem
          label="Confiança"
          value={
            knowledge.confidence
          }
          detail="Sem dados suficientes para classificar"
        />

        <KnowledgeStatusItem
          label="Fator de correção"
          value="—"
          detail="Não calculado sem histórico validado"
        />
      </div>
    </div>
  );
}

function KnowledgeStatusItem({
  label,
  value,
  detail,
}) {
  return (
    <div className="bg-white/70 p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#718895]">
        {label}
      </p>

      <p className="mt-2 text-[17px] font-semibold text-[#31566d]">
        {value}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-[#81939e]">
        {detail}
      </p>
    </div>
  );
}

/* ============================================================
 * WORKFLOW
 * ============================================================ */

function QuoteWorkflowActions({
  quote,
  linkedProject,
  onSendToReview,
  onApprove,
  onReturnToEditing,
  onGenerateProposal,
  onAccept,
  onReject,
  onProject,
}) {
  if (
    quote.status ===
      "Rascunho" ||
    quote.status ===
      "Em elaboração"
  ) {
    return (
      <PrimaryButton
        onClick={
          onSendToReview
        }
      >
        Enviar para revisão
      </PrimaryButton>
    );
  }

  if (
    quote.status ===
    "Em revisão"
  ) {
    return (
      <>
        <PrimaryButton
          onClick={
            onApprove
          }
        >
          Aprovar internamente
        </PrimaryButton>

        <SecondaryButton
          onClick={
            onReturnToEditing
          }
        >
          Solicitar ajustes
        </SecondaryButton>
      </>
    );
  }

  if (
    quote.status ===
    "Aprovado internamente"
  ) {
    return (
      <PrimaryButton
        onClick={
          onGenerateProposal
        }
      >
        Gerar proposta
      </PrimaryButton>
    );
  }

  if (
    quote.status ===
    "Enviado"
  ) {
    return (
      <>
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#5681a0]">
          Retorno do cliente
        </p>

        <PrimaryButton
          onClick={
            onAccept
          }
        >
          Registrar aceite
        </PrimaryButton>

        <button
          type="button"
          onClick={
            onReject
          }
          className="mt-2 w-full rounded-[11px] border border-[#dfc7c0] bg-white px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#9a5947]"
        >
          Registrar recusa
        </button>

        <SecondaryButton
          onClick={
            onGenerateProposal
          }
        >
          Visualizar proposta
        </SecondaryButton>
      </>
    );
  }

  if (
    quote.status ===
    "Aceito"
  ) {
    return (
      <PrimaryButton
        onClick={
          onProject
        }
      >
        {linkedProject
          ? `Abrir ${linkedProject.id}`
          : "Criar projeto"}
      </PrimaryButton>
    );
  }

  if (
    quote.status ===
    "Recusado"
  ) {
    return (
      <ClosedMessage text="Negociação encerrada após recusa do cliente." />
    );
  }

  if (
    quote.status ===
    "Cancelado"
  ) {
    return (
      <ClosedMessage text="Orçamento cancelado." />
    );
  }

  return null;
}

function PrimaryButton({
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="w-full rounded-[12px] bg-[#096ab2] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-white transition hover:bg-[#075b99]"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="mt-2 w-full rounded-[12px] border border-[#aac6d5] bg-white px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.09em] text-[#356f9f] transition hover:bg-[#f8fbfc]"
    >
      {children}
    </button>
  );
}

function ClosedMessage({
  text,
}) {
  return (
    <div className="rounded-[12px] border border-[#cbd9e1] bg-white/70 px-4 py-3">
      <p className="text-center text-[9px] font-semibold uppercase tracking-[0.07em] text-[#718895]">
        {text}
      </p>
    </div>
  );
}

/* ============================================================
 * FEEDBACK
 * ============================================================ */

function FeedbackMessage({
  feedback,
}) {
  const error =
    feedback.type ===
    "error";

  return (
    <div
      className={`
        mt-5
        flex
        items-center
        gap-3
        rounded-[14px]
        border
        px-4
        py-3

        ${
          error
            ? "border-[#e2c6bd] bg-[#faf0ed]"
            : "border-[#bcd8c7] bg-[#ebf5ee]"
        }
      `}
    >
      <span
        className={`
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          text-[10px]
          font-semibold

          ${
            error
              ? "text-[#9a5947]"
              : "text-[#3d7453]"
          }
        `}
      >
        {error
          ? "!"
          : "✓"}
      </span>

      <p
        className={`
          text-[12px]
          font-semibold

          ${
            error
              ? "text-[#8f5544]"
              : "text-[#3d7453]"
          }
        `}
      >
        {
          feedback.message
        }
      </p>
    </div>
  );
}

/* ============================================================
 * CONFIRMAÇÃO
 * ============================================================ */

function ConfirmationModal({
  eyebrow,
  title,
  description,
  confirmLabel,
  danger = false,
  reasonLabel = "",
  reason = "",
  onReasonChange = null,
  reasonRequired = false,
  onCancel,
  onConfirm,
}) {
  const blocked =
    reasonRequired &&
    !reason.trim();

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#071a2b]/50 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-[500px] rounded-[24px] border border-white/30 bg-white p-6 shadow-[0_35px_100px_rgba(7,26,43,0.25)] sm:p-7">
        <p
          className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${
            danger
              ? "text-[#9a5947]"
              : "text-[#5681a0]"
          }`}
        >
          {eyebrow}
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#17394f]">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#708795]">
          {description}
        </p>

        {onReasonChange && (
          <label className="mt-5 block">
            <span className={labelClasses}>
              {reasonLabel}
            </span>

            <textarea
              rows={4}
              value={
                reason
              }
              onChange={(event) =>
                onReasonChange(
                  event.target.value,
                )
              }
              placeholder="Registre o motivo..."
              className={`${getTextareaClasses(
                false,
              )} mt-2`}
            />
          </label>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={
              onCancel
            }
            className="rounded-[11px] border border-[#d0dce3] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#607989]"
          >
            Voltar
          </button>

          <button
            type="button"
            disabled={
              blocked
            }
            onClick={
              onConfirm
            }
            className={`rounded-[11px] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition disabled:cursor-not-allowed disabled:opacity-45 ${
              danger
                ? "bg-[#9a5947]"
                : "bg-[#096ab2]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * PROJETO
 * ============================================================ */

function ProjectCreationModal({
  quote,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#071a2b]/50 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-[500px] rounded-[24px] border border-white/30 bg-white p-6 shadow-[0_35px_100px_rgba(7,26,43,0.25)] sm:p-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
          Iniciar execução
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#17394f]">
          Criar projeto a partir do orçamento aceito?
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#708795]">
          O orçamento{" "}
          <strong className="font-semibold text-[#31566d]">
            {
              quote.id
            }
          </strong>{" "}
          será utilizado como origem comercial do projeto de{" "}
          <strong className="font-semibold text-[#31566d]">
            {
              quote.service
            }
          </strong>
          .
        </p>

        <div className="mt-5 rounded-[14px] border border-[#d7e4ea] bg-[#f5f9fb] p-4">
          <p className="text-xs font-semibold text-[#31566d]">
            {
              quote.company
            }
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#7c909b]">
            A estimativa deste orçamento deverá ser preservada para futura comparação com a execução real.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={
              onCancel
            }
            className="rounded-[11px] border border-[#d0dce3] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#607989]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={
              onConfirm
            }
            className="rounded-[11px] bg-[#096ab2] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
          >
            Criar projeto
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * PROPOSTA
 * ============================================================ */

function ProposalPreviewModal({
  quote,
  scope,
  hourlyRate,
  billableHours,
  total,
  deadlineDays,
  validityDays,
  commercialNotes,
  allowMarkAsSent,
  onMarkAsSent,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#071a2b]/55 px-4 py-8 backdrop-blur-[3px]">
      <div className="mx-auto w-full max-w-[850px] overflow-hidden rounded-[26px] border border-white/30 bg-white shadow-[0_35px_100px_rgba(7,26,43,0.25)]">
        <div className="flex items-center justify-between border-b border-[#dce5ea] bg-[#f6f9fb] px-6 py-5 sm:px-8">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
              Prévia
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#17394f]">
              Proposta comercial
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d0dce3] bg-white text-sm text-[#607989]"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-7 sm:px-9 sm:py-9">
          <div className="border-b border-[#dbe4e9] pb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
              Centro de Excelência em Metrologia
            </p>

            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-[#0b2340]">
              Proposta {
                quote.id
              }
            </h3>
          </div>

          <div className="grid gap-6 border-b border-[#e0e7eb] py-6 sm:grid-cols-2">
            <PreviewInfo
              label="Cliente"
              value={
                quote.company
              }
            />

            <PreviewInfo
              label="Contato"
              value={
                quote.contact
              }
            />

            <PreviewInfo
              label="Serviço"
              value={
                quote.service
              }
            />

            <PreviewInfo
              label="Validade"
              value={
                validityDays
                  ? `${validityDays} dias`
                  : "A definir"
              }
            />
          </div>

          <div className="border-b border-[#e0e7eb] py-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718895]">
              Escopo
            </p>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#405f73]">
              {scope ||
                "Escopo técnico a definir."}
            </p>
          </div>

          <div className="border-b border-[#e0e7eb] py-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718895]">
              Investimento
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <PreviewInfo
                label="Horas"
                value={`${formatNumber(
                  billableHours,
                )} h`}
              />

              <PreviewInfo
                label="Valor/hora"
                value={
                  formatCurrency(
                    hourlyRate,
                  )
                }
              />

              <PreviewInfo
                label="Valor total"
                value={
                  total > 0
                    ? formatCurrency(
                        total,
                      )
                    : "A definir"
                }
              />
            </div>
          </div>

          <div className="grid gap-6 border-b border-[#e0e7eb] py-6 sm:grid-cols-2">
            <PreviewInfo
              label="Prazo de execução"
              value={
                deadlineDays
                  ? `${deadlineDays} dias`
                  : "A definir"
              }
            />

            <PreviewInfo
              label="Validade da proposta"
              value={
                validityDays
                  ? `${validityDays} dias`
                  : "A definir"
              }
            />
          </div>

          <div className="pt-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718895]">
              Condições e observações
            </p>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#405f73]">
              {commercialNotes ||
                "Nenhuma observação comercial adicional informada."}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#dce5ea] bg-[#f6f9fb] px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-[11px] border border-[#cedae1] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#607989]"
          >
            {allowMarkAsSent
              ? "Voltar"
              : "Fechar"}
          </button>

          {allowMarkAsSent && (
            <button
              type="button"
              onClick={
                onMarkAsSent
              }
              className="rounded-[11px] bg-[#096ab2] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
            >
              Marcar como enviada
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * HISTÓRICO
 * ============================================================ */

function QuoteHistoryItem({
  item,
  last,
}) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!last && (
        <div className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-[#d5e2e8]" />
      )}

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bfd5e1] bg-[#edf6fa] text-[9px] text-[#5681a0]">
        ✓
      </div>

      <div className="pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold text-[#31566d]">
            {
              item.action
            }
          </p>

          <span className="text-[9px] text-[#8c9ba4]">
            {item.date}
            {item.time
              ? ` · ${item.time}`
              : ""}
          </span>
        </div>

        {item.actor && (
          <p className="mt-1 text-[10px] font-medium text-[#708795]">
            por {
              item.actor
            }
          </p>
        )}

        {item.description && (
          <p className="mt-2 text-xs leading-5 text-[#768b97]">
            {
              item.description
            }
          </p>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * COMPONENTES MENORES
 * ============================================================ */

function SourceBadge({
  source,
}) {
  const real =
    source ===
    "real";

  return (
    <span
      className={`
        rounded-full
        border
        px-2.5
        py-1
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.08em]

        ${
          real
            ? "border-[#bdd8c7] bg-[#edf7f1] text-[#4c7b5e]"
            : "border-[#d7caa9] bg-[#f8f2e5] text-[#876e36]"
        }
      `}
    >
      {real
        ? "Base real"
        : "Demonstração"}
    </span>
  );
}

function StateCard({
  title,
  description,
}) {
  return (
    <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718895]">
        Situação comercial
      </p>

      <p className="mt-3 text-lg font-semibold text-[#31566d]">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#708795]">
        {description}
      </p>
    </section>
  );
}

function KnowledgeMetric({
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-[14px] border border-[#d2e1e8] bg-white/75 p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#718895]">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-[#31566d]">
        {value}
      </p>

      <p className="mt-2 text-[10px] leading-4 text-[#83949e]">
        {detail}
      </p>
    </div>
  );
}

function ReferenceSummary({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-[14px] border border-[#d4e1e7] bg-[#f8fafb] p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7a8f9a]">
        {label}
      </p>

      <p className="mt-2 text-base font-semibold text-[#3b5e73]">
        {value}
      </p>

      <p className="mt-1.5 text-[10px] leading-4 text-[#8998a1]">
        {description}
      </p>
    </div>
  );
}

function PricingInsight({
  insight,
}) {
  const attention =
    insight.type ===
    "attention";

  return (
    <div
      className={`flex items-start gap-3 rounded-[14px] border p-4 ${
        attention
          ? "border-[#e2d5b6] bg-[#f8f2e5]"
          : "border-[#c8dce6] bg-[#edf6fa]"
      }`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-[#397392]">
        {attention
          ? "!"
          : "i"}
      </span>

      <div>
        <p className="text-xs font-semibold text-[#315d76]">
          {
            insight.title
          }
        </p>

        <p className="mt-1 text-[10px] leading-5 text-[#748995]">
          {
            insight.description
          }
        </p>
      </div>
    </div>
  );
}

function CurrencyInput({
  label,
  value,
  onChange,
  suffix,
  disabled = false,
}) {
  return (
    <label>
      <span className={labelClasses}>
        {label}
      </span>

      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#7c909b]">
          R$
        </span>

        <input
          type="number"
          min="0"
          step="0.01"
          value={
            value
          }
          disabled={
            disabled
          }
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className={`${getInputClasses(
            disabled,
          )} pl-10 pr-12`}
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#84949e]">
          {suffix}
        </span>
      </div>
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  suffix,
  disabled = false,
}) {
  return (
    <label>
      <span className={labelClasses}>
        {label}
      </span>

      <div className="relative mt-2">
        <input
          type="number"
          min="0"
          step="0.5"
          value={
            value
          }
          disabled={
            disabled
          }
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className={`${getInputClasses(
            disabled,
          )} pr-14`}
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#84949e]">
          {suffix}
        </span>
      </div>
    </label>
  );
}

function SummaryLine({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#718895]">
        {label}
      </p>

      <p className="mt-1.5 text-lg font-semibold text-[#31566d]">
        {value}
      </p>
    </div>
  );
}

function ControlInfo({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#82949e]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#476579]">
        {value}
      </p>
    </div>
  );
}

function PreviewInfo({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-[#718895]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-[#31566d]">
        {value}
      </p>
    </div>
  );
}

function EmptyBlock({
  text,
}) {
  return (
    <div className="rounded-[15px] border border-dashed border-[#cad9e1] bg-[#f8fafb] px-5 py-8 text-center">
      <p className="text-xs leading-5 text-[#7c909b]">
        {text}
      </p>
    </div>
  );
}

/* ============================================================
 * FORMATADORES
 * ============================================================ */

function toNumber(
  value,
) {
  const result =
    Number(
      value,
    );

  return Number.isFinite(
    result,
  )
    ? result
    : 0;
}

function formatCurrency(
  value,
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style:
        "currency",

      currency:
        "BRL",
    },
  ).format(
    value ||
      0,
  );
}

function formatNumber(
  value,
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      maximumFractionDigits:
        2,
    },
  ).format(
    value ||
      0,
  );
}

function formatHours(
  value,
) {
  return `${formatNumber(
    toNumber(
      value,
    ),
  )} h`;
}

function getDifferenceLabel(
  technicalCost,
  commercialTotal,
) {
  if (
    !technicalCost ||
    !commercialTotal
  ) {
    return "A definir";
  }

  const difference =
    commercialTotal -
    technicalCost;

  if (
    difference >=
    0
  ) {
    return `+ ${formatCurrency(
      difference,
    )}`;
  }

  return `- ${formatCurrency(
    Math.abs(
      difference,
    ),
  )}`;
}

const labelClasses =
  "text-[10px] font-semibold uppercase tracking-[0.08em] text-[#607989]";

function getInputClasses(
  disabled,
) {
  return `
    h-12
    w-full
    rounded-[12px]
    border
    border-[#d3dfe6]
    px-4
    text-sm
    outline-none
    transition

    ${
      disabled
        ? "cursor-not-allowed bg-[#eef2f4] text-[#748995]"
        : "bg-[#f8fafb] text-[#294e64] focus:border-[#78a9c4] focus:bg-white"
    }
  `;
}

function getTextareaClasses(
  disabled,
) {
  return `
    w-full
    rounded-[13px]
    border
    border-[#d3dfe6]
    px-4
    py-3
    text-sm
    leading-6
    outline-none
    transition
    placeholder:text-[#9aa8b1]

    ${
      disabled
        ? "cursor-not-allowed resize-none bg-[#eef2f4] text-[#748995]"
        : "resize-y bg-[#f8fafb] text-[#294e64] focus:border-[#78a9c4] focus:bg-white"
    }
  `;
}