import {
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
  RequestDetailSection,
  RequestInfoItem,
} from "../../components/internal/RequestDetailSection";

import {
  StatusBadge,
} from "../../components/internal/StatusBadge";

import {
  createQuoteFromRequest,
  getQuoteByRequestId,
} from "../../services/quoteService";

import {
  cancelRuntimeRequest,
  finishRequestAnalysis,
  getRuntimeRequestById,
  markRequestAsConverted,
  resumeRequestAnalysis,
  saveRequestInternalNotes,
  saveRequestTechnicalAnalysis,
  startRequestAnalysis,
} from "../../services/requestService";

import {
  getServiceLabel,
  normalizeServiceId,
  SERVICE_OPTIONS,
} from "../../utils/serviceLabels";

const currentUser =
  "Administrador";

export function RequestDetailPage() {
  const navigate =
    useNavigate();

  const {
    requestId,
  } = useParams();

  const [
    request,
    setRequest,
  ] = useState(() =>
    getRuntimeRequestById(
      requestId,
    ),
  );

  const [
    existingQuote,
    setExistingQuote,
  ] = useState(() =>
    getQuoteByRequestId(
      requestId,
    ),
  );

  const [
    internalNotes,
    setInternalNotes,
  ] = useState(
    request?.internalNotes ??
      "",
  );

  const [
    technicalAnalysis,
    setTechnicalAnalysis,
  ] = useState(() =>
    createAnalysisForm(
      request,
    ),
  );

  const [
    feedback,
    setFeedback,
  ] = useState("");

  const [
    feedbackType,
    setFeedbackType,
  ] = useState(
    "success",
  );

  const [
    showQuoteConfirmation,
    setShowQuoteConfirmation,
  ] = useState(false);

  const [
    showAnalysisModal,
    setShowAnalysisModal,
  ] = useState(false);

  const [
    showCancelConfirmation,
    setShowCancelConfirmation,
  ] = useState(false);

  /* ============================================================
   * NÃO ENCONTRADA
   * ============================================================ */

  if (!request) {
    return (
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/solicitacoes",
            )
          }
          className="text-[12px] font-semibold text-[#356f9f]"
        >
          ← Voltar para solicitações
        </button>

        <div className="mt-6 rounded-[22px] border border-[#d1dde4] bg-white px-6 py-16 text-center">
          <p className="text-[18px] font-semibold text-[#17394f]">
            Solicitação não encontrada.
          </p>
        </div>
      </div>
    );
  }

  const closed =
    [
      "Convertida em orçamento",
      "Recusada",
      "Cancelada",
    ].includes(
      request.status,
    );

  const analysisEditable =
    !closed &&
    [
      "Em análise",
      "Aguardando informações",
      "Apta para orçamento",
    ].includes(
      request.status,
    );

  /* ============================================================
   * INICIAR ANÁLISE
   * ============================================================ */

  function handleStartAnalysis() {
    try {
      const updated =
        startRequestAnalysis(
          request.id,
          currentUser,
        );

      syncRequest(
        updated,
      );

      showFeedback(
        "Análise iniciada.",
      );
    } catch (error) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  /* ============================================================
   * RETOMAR ANÁLISE
   * ============================================================ */

  function handleResumeAnalysis() {
    try {
      const updated =
        resumeRequestAnalysis(
          request.id,
          currentUser,
        );

      syncRequest(
        updated,
      );

      showFeedback(
        "Solicitação retomada para análise.",
      );
    } catch (error) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  /* ============================================================
   * SALVAR ANÁLISE
   * ============================================================ */

  function handleSaveTechnicalAnalysis() {
    try {
      const updated =
        saveRequestTechnicalAnalysis(
          request.id,
          technicalAnalysis,
          currentUser,
        );

      syncRequest(
        updated,
      );

      showFeedback(
        "Análise técnica salva.",
      );
    } catch (error) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  /* ============================================================
   * CONCLUIR ANÁLISE
   * ============================================================ */

  function handleFinishAnalysis(
    resultData,
  ) {
    try {
      const updated =
        finishRequestAnalysis(
          request.id,
          {
            ...technicalAnalysis,

            ...resultData,
          },
          currentUser,
        );

      syncRequest(
        updated,
      );

      setShowAnalysisModal(
        false,
      );

      showFeedback(
        "Resultado da análise registrado.",
      );
    } catch (error) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  /* ============================================================
   * ORÇAMENTO
   * ============================================================ */

  function handleQuoteAction() {
    if (existingQuote) {
      navigate(
        `/portal/orcamentos/${existingQuote.id}`,
      );

      return;
    }

    if (
      request.status !==
      "Apta para orçamento"
    ) {
      return;
    }

    setShowQuoteConfirmation(
      true,
    );
  }

  function handleConfirmQuoteCreation() {
    try {
      const result =
        createQuoteFromRequest(
          request,
        );

      const updatedRequest =
        markRequestAsConverted(
          request.id,
          result.quote.id,
          currentUser,
        );

      syncRequest(
        updatedRequest,
      );

      setExistingQuote(
        result.quote,
      );

      setShowQuoteConfirmation(
        false,
      );

      navigate(
        `/portal/orcamentos/${result.quote.id}`,
      );
    } catch (error) {
      setShowQuoteConfirmation(
        false,
      );

      showFeedback(
        error.message,
        "error",
      );
    }
  }

  /* ============================================================
   * OBSERVAÇÕES
   * ============================================================ */

  function handleSaveNotes() {
    try {
      const updated =
        saveRequestInternalNotes(
          request.id,
          internalNotes,
          currentUser,
        );

      syncRequest(
        updated,
      );

      setInternalNotes(
        updated.internalNotes ??
          "",
      );

      showFeedback(
        "Observações internas salvas.",
      );
    } catch (error) {
      showFeedback(
        error.message,
        "error",
      );
    }
  }

  /* ============================================================
   * CANCELAMENTO
   * ============================================================ */

  function handleCancelRequest(
    reason,
  ) {
    try {
      const updated =
        cancelRuntimeRequest(
          request.id,
          reason,
          currentUser,
        );

      syncRequest(
        updated,
      );

      setShowCancelConfirmation(
        false,
      );

      showFeedback(
        "Solicitação cancelada.",
      );
    } catch (error) {
      setShowCancelConfirmation(
        false,
      );

      showFeedback(
        error.message,
        "error",
      );
    }
  }

  /* ============================================================
   * AUXILIARES
   * ============================================================ */

  function syncRequest(
    updated,
  ) {
    setRequest(
      updated,
    );

    setTechnicalAnalysis(
      createAnalysisForm(
        updated,
      ),
    );
  }

  function showFeedback(
    message,
    type = "success",
  ) {
    setFeedbackType(
      type,
    );

    setFeedback(
      message,
    );

    window.setTimeout(
      () =>
        setFeedback(""),
      3200,
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1500px]">
        {/* ===================================================
            VOLTAR
        =================================================== */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/solicitacoes",
            )
          }
          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#477187] transition hover:text-[#0057b8]"
        >
          ← Voltar para solicitações
        </button>

        {/* ===================================================
            CABEÇALHO
        =================================================== */}

        <InternalPageHeader
          eyebrow={`${request.origin} · ${request.channel} · ${request.id}`}
          title={
            request.company
          }
          description={
            request.objective
          }
          action={
            <div className="flex flex-wrap items-center gap-2">
              {request.source ===
                "demo" && (
                <DemoBadge />
              )}

              <StatusBadge
                status={
                  request.status
                }
              />
            </div>
          }
        />

        {/* ===================================================
            FEEDBACK
        =================================================== */}

        {feedback && (
          <FeedbackBanner
            type={
              feedbackType
            }
            message={
              feedback
            }
          />
        )}

        {/* ===================================================
            LAYOUT
        =================================================== */}

        <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            {/* ===============================================
                01 — VISÃO GERAL
            =============================================== */}

            <RequestDetailSection
              eyebrow="01"
              title="Visão geral"
              description="Informações comerciais e de contato associadas à necessidade recebida."
            >
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <RequestInfoItem
                  label="Empresa"
                  value={
                    request.company
                  }
                />

                <RequestInfoItem
                  label="Contato"
                  value={
                    request.contact
                  }
                />

                <RequestInfoItem
                  label="Departamento"
                  value={
                    request.customer
                      ?.department
                  }
                />

                <RequestInfoItem
                  label="E-mail"
                  value={
                    request.email
                  }
                />

                <RequestInfoItem
                  label="Telefone"
                  value={
                    request.phone
                  }
                />

                <RequestInfoItem
                  label="Recebida em"
                  value={
                    request.createdAt
                  }
                />

                <RequestInfoItem
                  label="Origem"
                  value={
                    request.origin
                  }
                />

                <RequestInfoItem
                  label="Canal"
                  value={
                    request.channel
                  }
                />

                <RequestInfoItem
                  label="Serviço informado"
                  value={getServiceLabel(
                    request.service,
                  )}
                />
              </div>

              <div className="mt-6 border-t border-[#e1e8ec] pt-5">
                <RequestInfoItem
                  label="Objetivo"
                  value={
                    request.objective
                  }
                />
              </div>

              {request.comments && (
                <div className="mt-5">
                  <RequestInfoItem
                    label="Informações adicionais do cliente"
                    value={
                      request.comments
                    }
                  />
                </div>
              )}
            </RequestDetailSection>

            {/* ===============================================
                02 — PEÇAS
            =============================================== */}

            <RequestDetailSection
              eyebrow="02"
              title="Peças e requisitos"
              description="Dados técnicos recebidos para apoiar a análise e a futura elaboração do orçamento."
            >
              {request.piecesData
                ?.length > 0 ? (
                <div className="space-y-4">
                  {request.piecesData.map(
                    (
                      piece,
                      index,
                    ) => (
                      <PieceCard
                        key={
                          piece.id
                        }
                        piece={
                          piece
                        }
                        index={
                          index
                        }
                      />
                    ),
                  )}
                </div>
              ) : (
                <EmptyBlock text="Os detalhes estruturados das peças ainda não estão disponíveis nesta solicitação." />
              )}
            </RequestDetailSection>

            {/* ===============================================
                03 — ORIENTAÇÃO PRELIMINAR
            =============================================== */}

            {request.channel ===
              "Configurador" && (
              <RequestDetailSection
                eyebrow="03"
                title="Orientação preliminar do configurador"
                description="Resultado automático produzido pelas respostas do solicitante. Serve como apoio inicial e não substitui a validação técnica."
              >
                {request.piecesData?.some(
                  (piece) =>
                    piece.recommendation,
                ) ? (
                  <div className="space-y-4">
                    {request.piecesData.map(
                      (
                        piece,
                        index,
                      ) =>
                        piece.recommendation ? (
                          <RecommendationCard
                            key={
                              piece.id
                            }
                            piece={
                              piece
                            }
                            index={
                              index
                            }
                          />
                        ) : null,
                    )}
                  </div>
                ) : (
                  <EmptyBlock text="O configurador não gerou uma orientação técnica estruturada para esta solicitação." />
                )}
              </RequestDetailSection>
            )}

            {/* ===============================================
                ANÁLISE TÉCNICA
            =============================================== */}

            <RequestDetailSection
              eyebrow={
                request.channel ===
                "Configurador"
                  ? "04"
                  : "03"
              }
              title="Análise técnica"
              description="Registre a interpretação da equipe antes de liberar a solicitação para orçamento. Essas informações permanecem vinculadas ao histórico da SOL."
              action={
                analysisEditable ? (
                  <button
                    type="button"
                    onClick={
                      handleSaveTechnicalAnalysis
                    }
                    className="
                      rounded-[11px]
                      border border-[#aac8d8]
                      bg-[#edf6fa]
                      px-4 py-2.5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.06em]
                      text-[#356f9f]
                      transition
                      hover:border-[#78a9c4]
                      hover:bg-white
                    "
                  >
                    Salvar análise
                  </button>
                ) : null
              }
            >
              <TechnicalAnalysisForm
                value={
                  technicalAnalysis
                }
                onChange={
                  setTechnicalAnalysis
                }
                disabled={
                  !analysisEditable
                }
              />

              <div className="mt-6 rounded-[15px] border border-[#cbdde6] bg-[#f1f7fa] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#47758e]">
                  Preparação para Gestão do Conhecimento
                </p>

                <p className="mt-2 text-[12px] leading-5 text-[#4f6d7d]">
                  Nesta etapa apenas classificamos e registramos o contexto técnico.
                  O aprendizado definitivo será produzido após a execução do projeto,
                  quando o sistema comparar o que foi orçado com o que realmente
                  aconteceu.
                </p>
              </div>
            </RequestDetailSection>

            {/* ===============================================
                ARQUIVOS
            =============================================== */}

            <RequestDetailSection
              eyebrow={
                request.channel ===
                "Configurador"
                  ? "05"
                  : "04"
              }
              title="Arquivos"
              description="Documentos e referências enviados pelo solicitante."
            >
              {request.attachments
                ?.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {request.attachments.map(
                    (file) => (
                      <FileCard
                        key={
                          file.id
                        }
                        file={
                          file
                        }
                      />
                    ),
                  )}
                </div>
              ) : (
                <EmptyBlock text="Nenhum arquivo foi anexado." />
              )}
            </RequestDetailSection>

            {/* ===============================================
                HISTÓRICO
            =============================================== */}

            <RequestDetailSection
              eyebrow={
                request.channel ===
                "Configurador"
                  ? "06"
                  : "05"
              }
              title="Histórico e rastreabilidade"
              description="Registro cronológico das movimentações realizadas pela equipe e pelo sistema."
            >
              {request.history
                ?.length > 0 ? (
                <div>
                  {request.history.map(
                    (
                      item,
                      index,
                    ) => (
                      <HistoryItem
                        key={
                          item.id
                        }
                        item={
                          item
                        }
                        last={
                          index ===
                          request.history
                            .length -
                            1
                        }
                      />
                    ),
                  )}
                </div>
              ) : (
                <EmptyBlock text="Nenhum evento adicional registrado até o momento." />
              )}
            </RequestDetailSection>
          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-5">
            <section className="rounded-[22px] border border-[#bfd5e0] bg-[#e8f2f6] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#47758e]">
                Gestão da solicitação
              </p>

              <div className="mt-5 space-y-5">
                <SideInfo
                  label="Status"
                  value={
                    request.status
                  }
                />

                <SideInfo
                  label="Prioridade"
                  value={
                    request.priority
                  }
                />

                <SideInfo
                  label="Responsável"
                  value={
                    request.responsible
                  }
                />

                <SideInfo
                  label="Última atualização"
                  value={
                    request.updatedAt ??
                    request.createdAt
                  }
                />

                <SideInfo
                  label="Origem"
                  value={
                    request.origin
                  }
                />

                <SideInfo
                  label="Canal"
                  value={
                    request.channel
                  }
                />

                <SideInfo
                  label="Peças"
                  value={`${request.parts}`}
                />
              </div>

              <div className="mt-6 border-t border-[#c8dbe4] pt-5">
                <RequestPrimaryAction
                  request={
                    request
                  }
                  existingQuote={
                    existingQuote
                  }
                  onStartAnalysis={
                    handleStartAnalysis
                  }
                  onResumeAnalysis={
                    handleResumeAnalysis
                  }
                  onFinishAnalysis={() =>
                    setShowAnalysisModal(
                      true,
                    )
                  }
                  onQuoteAction={
                    handleQuoteAction
                  }
                />

                {!closed && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowCancelConfirmation(
                        true,
                      )
                    }
                    className="
                      mt-2
                      w-full
                      rounded-[11px]
                      border border-[#dfc7c0]
                      bg-white
                      px-4 py-2.5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.06em]
                      text-[#8f5544]
                      transition
                      hover:bg-[#faf2ef]
                    "
                  >
                    Cancelar solicitação
                  </button>
                )}
              </div>
            </section>

            {existingQuote && (
              <section className="rounded-[22px] border border-[#bcd6e3] bg-[#edf6fa] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#47758e]">
                  Orçamento vinculado
                </p>

                <p className="mt-3 text-[20px] font-semibold text-[#17394f]">
                  {
                    existingQuote.id
                  }
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#587282]">
                  Esta solicitação já avançou para a etapa comercial.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/portal/orcamentos/${existingQuote.id}`,
                    )
                  }
                  className="mt-4 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#356f9f] hover:text-[#0057b8]"
                >
                  Abrir orçamento →
                </button>
              </section>
            )}

            <section className="rounded-[22px] border border-[#cddbe3] bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#557585]">
                Observações internas
              </p>

              <p className="mt-1.5 text-[11px] leading-5 text-[#607988]">
                Não ficam visíveis para o cliente.
              </p>

              <textarea
                value={
                  internalNotes
                }
                onChange={(event) =>
                  setInternalNotes(
                    event.target.value,
                  )
                }
                rows={7}
                placeholder="Registre observações operacionais internas..."
                className="
                  mt-4
                  w-full
                  resize-y
                  rounded-[13px]
                  border border-[#d0dde4]
                  bg-[#f8fafb]
                  px-4 py-3
                  text-[13px]
                  leading-6
                  text-[#294e64]
                  outline-none
                  transition
                  placeholder:text-[#8497a2]
                  focus:border-[#78a9c4]
                  focus:bg-white
                "
              />

              <button
                type="button"
                onClick={
                  handleSaveNotes
                }
                className="
                  mt-3
                  w-full
                  rounded-[11px]
                  border border-[#c5d7e0]
                  bg-[#f5f9fb]
                  px-4 py-2.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]
                  text-[#476b7e]
                  transition
                  hover:bg-white
                  hover:text-[#0057b8]
                "
              >
                Salvar observação
              </button>
            </section>

            <section className="rounded-[22px] border border-[#d4d8e9] bg-[#f4f3fa] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#69668d]">
                Classificação do registro
              </p>

              <div className="mt-4 space-y-4">
                <SideInfo
                  label="Base"
                  value={
                    request.source ===
                    "demo"
                      ? "Demonstração"
                      : "Histórico real"
                  }
                />

                <SideInfo
                  label="Visibilidade"
                  value={
                    request.visibility ===
                    "restricted"
                      ? "Restrita"
                      : "Interna"
                  }
                />
              </div>

              <p className="mt-4 text-[11px] leading-5 text-[#676681]">
                Registros de demonstração permanecem separados do histórico
                real e não devem compor os indicadores oficiais.
              </p>
            </section>
          </aside>
        </div>
      </div>

      {/* =====================================================
          MODAIS
      ===================================================== */}

      {showQuoteConfirmation && (
        <QuoteCreationModal
          request={
            request
          }
          onCancel={() =>
            setShowQuoteConfirmation(
              false,
            )
          }
          onConfirm={
            handleConfirmQuoteCreation
          }
        />
      )}

      {showAnalysisModal && (
        <AnalysisResultModal
          request={
            request
          }
          currentAnalysis={
            technicalAnalysis
          }
          onCancel={() =>
            setShowAnalysisModal(
              false,
            )
          }
          onConfirm={
            handleFinishAnalysis
          }
        />
      )}

      {showCancelConfirmation && (
        <CancelRequestModal
          request={
            request
          }
          onCancel={() =>
            setShowCancelConfirmation(
              false,
            )
          }
          onConfirm={
            handleCancelRequest
          }
        />
      )}
    </>
  );
}

/* ============================================================
 * FORMULÁRIO DE ANÁLISE
 * ============================================================ */

function TechnicalAnalysisForm({
  value,
  onChange,
  disabled,
}) {
  function updateField(
    field,
    nextValue,
  ) {
    onChange({
      ...value,

      [field]:
        nextValue,
    });
  }

  const normalizedService =
    normalizeServiceId(
      value.recommendedService,
    );

  const knownService =
    SERVICE_OPTIONS.some(
      (option) =>
        option.value ===
        normalizedService,
    );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field>
          <FieldLabel>
            Serviço técnico recomendado
          </FieldLabel>

          <select
            value={
              normalizedService
            }
            disabled={
              disabled
            }
            onChange={(event) =>
              updateField(
                "recommendedService",
                event.target.value,
              )
            }
            className={inputClass(
              disabled,
            )}
          >
            <option value="">
              Selecione o serviço
            </option>

            {!knownService &&
              normalizedService && (
                <option
                  value={
                    normalizedService
                  }
                >
                  {getServiceLabel(
                    normalizedService,
                  )}
                </option>
              )}

            {SERVICE_OPTIONS.map(
              (option) => (
                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </option>
              ),
            )}
          </select>
        </Field>

        <Field>
          <FieldLabel>
            Equipamento preliminar
          </FieldLabel>

          <input
            type="text"
            value={
              value.recommendedEquipment
            }
            disabled={
              disabled
            }
            onChange={(event) =>
              updateField(
                "recommendedEquipment",
                event.target.value,
              )
            }
            placeholder="Ex.: ZEISS PRISMO"
            className={inputClass(
              disabled,
            )}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel>
          Resumo técnico da análise *
        </FieldLabel>

        <textarea
          rows={5}
          value={
            value.technicalSummary
          }
          disabled={
            disabled
          }
          onChange={(event) =>
            updateField(
              "technicalSummary",
              event.target.value,
            )
          }
          placeholder="Registre a interpretação técnica da equipe, principais requisitos, viabilidade e premissas que deverão ser consideradas no orçamento..."
          className={textareaClass(
            disabled,
          )}
        />
      </Field>

      <Field>
        <FieldLabel>
          Informações ainda necessárias
        </FieldLabel>

        <textarea
          rows={3}
          value={
            value.pendingInformation
          }
          disabled={
            disabled
          }
          onChange={(event) =>
            updateField(
              "pendingInformation",
              event.target.value,
            )
          }
          placeholder="Preencha caso ainda seja necessário solicitar desenho, tolerância, material, CAD, quantidade ou outra informação..."
          className={textareaClass(
            disabled,
          )}
        />
      </Field>

      <Field>
        <FieldLabel>
          Assuntos para classificação
        </FieldLabel>

        <input
          type="text"
          value={
            value.knowledgeTagsText
          }
          disabled={
            disabled
          }
          onChange={(event) =>
            onChange({
              ...value,

              knowledgeTagsText:
                event.target.value,

              knowledgeTags:
                event.target.value
                  .split(",")
                  .map(
                    (item) =>
                      item.trim(),
                  )
                  .filter(
                    Boolean,
                  ),
            })
          }
          placeholder="Ex.: dimensional, PRISMO, GD&T, alta precisão"
          className={inputClass(
            disabled,
          )}
        />

        <p className="mt-1.5 text-[10px] leading-4 text-[#6b818e]">
          Temporariamente separados por vírgula. Quando implementarmos o
          vocabulário controlado, este campo passará a consumir os termos
          administráveis do backend.
        </p>
      </Field>
    </div>
  );
}

/* ============================================================
 * AÇÃO PRINCIPAL
 * ============================================================ */

function RequestPrimaryAction({
  request,
  existingQuote,
  onStartAnalysis,
  onResumeAnalysis,
  onFinishAnalysis,
  onQuoteAction,
}) {
  switch (
    request.status
  ) {
    case "Nova":
      return (
        <PrimaryButton
          onClick={
            onStartAnalysis
          }
        >
          Iniciar análise
        </PrimaryButton>
      );

    case "Em análise":
      return (
        <PrimaryButton
          onClick={
            onFinishAnalysis
          }
        >
          Concluir análise
        </PrimaryButton>
      );

    case "Aguardando informações":
      return (
        <PrimaryButton
          onClick={
            onResumeAnalysis
          }
        >
          Retomar análise
        </PrimaryButton>
      );

    case "Apta para orçamento":
      return (
        <PrimaryButton
          onClick={
            onQuoteAction
          }
        >
          Criar orçamento
        </PrimaryButton>
      );

    case "Convertida em orçamento":
      return existingQuote ? (
        <PrimaryButton
          onClick={
            onQuoteAction
          }
        >
          Abrir{" "}
          {existingQuote.id}
        </PrimaryButton>
      ) : (
        <ClosedMessage text="Solicitação convertida em orçamento." />
      );

    case "Recusada":
      return (
        <ClosedMessage text="Solicitação encerrada após análise." />
      );

    case "Cancelada":
      return (
        <ClosedMessage text="Solicitação cancelada." />
      );

    default:
      return null;
  }
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
      className="
        w-full
        rounded-[12px]
        bg-[#096ab2]
        px-4 py-3
        text-[11px]
        font-semibold
        uppercase
        tracking-[0.07em]
        text-white
        transition
        hover:bg-[#075b99]
      "
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
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-[#617987]">
        {text}
      </p>
    </div>
  );
}

/* ============================================================
 * MODAL — RESULTADO DA ANÁLISE
 * ============================================================ */

function AnalysisResultModal({
  request,
  currentAnalysis,
  onCancel,
  onConfirm,
}) {
  const [
    selected,
    setSelected,
  ] = useState(
    "quote-ready",
  );

  const [
    technicalSummary,
    setTechnicalSummary,
  ] = useState(
    currentAnalysis
      .technicalSummary,
  );

  const [
    pendingInformation,
    setPendingInformation,
  ] = useState(
    currentAnalysis
      .pendingInformation,
  );

  const [
    decisionReason,
    setDecisionReason,
  ] = useState(
    currentAnalysis
      .decisionReason,
  );

  const options = [
    {
      value:
        "quote-ready",

      title:
        "Apta para orçamento",

      description:
        "A necessidade está suficientemente compreendida e pode seguir para elaboração comercial.",
    },

    {
      value:
        "waiting-information",

      title:
        "Aguardar informações",

      description:
        "Ainda faltam dados do cliente ou informações técnicas para concluir a análise.",
    },

    {
      value:
        "rejected",

      title:
        "Recusar solicitação",

      description:
        "A demanda não seguirá para atendimento após a avaliação técnica.",
    },
  ];

  return (
    <ModalShell>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#47758e]">
        Análise técnica
      </p>

      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#17394f]">
        Concluir análise
      </h2>

      <p className="mt-2 text-[12px] leading-5 text-[#587282]">
        Registre a decisão técnica referente à{" "}
        <strong className="font-semibold text-[#31566d]">
          {request.id}
        </strong>
        .
      </p>

      <div className="mt-5 space-y-2">
        {options.map(
          (option) => {
            const active =
              selected ===
              option.value;

            return (
              <button
                key={
                  option.value
                }
                type="button"
                onClick={() =>
                  setSelected(
                    option.value,
                  )
                }
                className={`
                  w-full
                  rounded-[14px]
                  border
                  p-4
                  text-left
                  transition

                  ${
                    active
                      ? "border-[#78a9c4] bg-[#edf6fa]"
                      : "border-[#d7e2e7] bg-[#f9fbfc] hover:border-[#b4cad5]"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`
                      mt-0.5
                      flex h-5 w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border

                      ${
                        active
                          ? "border-[#1684c5] bg-[#1684c5]"
                          : "border-[#b9cbd4] bg-white"
                      }
                    `}
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>

                  <div>
                    <p className="text-[13px] font-semibold text-[#31566d]">
                      {
                        option.title
                      }
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#617987]">
                      {
                        option.description
                      }
                    </p>
                  </div>
                </div>
              </button>
            );
          },
        )}
      </div>

      <div className="mt-5">
        <FieldLabel>
          Resumo técnico *
        </FieldLabel>

        <textarea
          rows={4}
          value={
            technicalSummary
          }
          onChange={(event) =>
            setTechnicalSummary(
              event.target.value,
            )
          }
          className={textareaClass(
            false,
          )}
        />
      </div>

      {selected ===
        "waiting-information" && (
        <div className="mt-4">
          <FieldLabel>
            Informações pendentes *
          </FieldLabel>

          <textarea
            rows={3}
            value={
              pendingInformation
            }
            onChange={(event) =>
              setPendingInformation(
                event.target.value,
              )
            }
            placeholder="O que ainda precisa ser enviado ou confirmado?"
            className={textareaClass(
              false,
            )}
          />
        </div>
      )}

      {selected ===
        "rejected" && (
        <div className="mt-4">
          <FieldLabel>
            Motivo técnico da recusa *
          </FieldLabel>

          <textarea
            rows={3}
            value={
              decisionReason
            }
            onChange={(event) =>
              setDecisionReason(
                event.target.value,
              )
            }
            placeholder="Explique por que a solicitação não seguirá para orçamento."
            className={textareaClass(
              false,
            )}
          />
        </div>
      )}

      <ModalActions
        cancelLabel="Cancelar"
        confirmLabel="Confirmar resultado"
        onCancel={
          onCancel
        }
        onConfirm={() =>
          onConfirm({
            result:
              selected,

            technicalSummary,

            pendingInformation,

            decisionReason,
          })
        }
      />
    </ModalShell>
  );
}

/* ============================================================
 * MODAL — ORÇAMENTO
 * ============================================================ */

function QuoteCreationModal({
  request,
  onCancel,
  onConfirm,
}) {
  return (
    <ModalShell
      maxWidth="max-w-[500px]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#47758e]">
        Próxima etapa
      </p>

      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#17394f]">
        Criar orçamento?
      </h2>

      <p className="mt-3 text-[13px] leading-6 text-[#587282]">
        A solicitação{" "}
        <strong className="font-semibold text-[#31566d]">
          {request.id}
        </strong>{" "}
        está tecnicamente apta. O novo orçamento manterá o vínculo com a SOL e
        herdará os dados necessários para a estimativa.
      </p>

      <div className="mt-5 rounded-[14px] border border-[#cddfe8] bg-[#f2f8fa] p-4">
        <p className="text-[13px] font-semibold text-[#31566d]">
          {getServiceLabel(
            request.service,
          )}
        </p>

        <p className="mt-1 text-[11px] leading-5 text-[#617987]">
          O orçamento será criado como “Em elaboração” e será a próxima fonte do
          ciclo de conhecimento, registrando esforço, custo, premissas e estimativa.
        </p>
      </div>

      <ModalActions
        cancelLabel="Cancelar"
        confirmLabel="Criar e continuar"
        onCancel={
          onCancel
        }
        onConfirm={
          onConfirm
        }
      />
    </ModalShell>
  );
}

/* ============================================================
 * MODAL — CANCELAMENTO
 * ============================================================ */

function CancelRequestModal({
  request,
  onCancel,
  onConfirm,
}) {
  const [
    reason,
    setReason,
  ] = useState("");

  return (
    <ModalShell
      maxWidth="max-w-[480px]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f5544]">
        Encerrar solicitação
      </p>

      <h2 className="mt-2 text-[22px] font-semibold text-[#17394f]">
        Cancelar {request.id}?
      </h2>

      <p className="mt-3 text-[12px] leading-5 text-[#587282]">
        A solicitação deixará o fluxo ativo. O registro e seu histórico serão
        preservados para rastreabilidade.
      </p>

      <div className="mt-5">
        <FieldLabel>
          Motivo do cancelamento
        </FieldLabel>

        <textarea
          rows={3}
          value={
            reason
          }
          onChange={(event) =>
            setReason(
              event.target.value,
            )
          }
          placeholder="Opcional, mas recomendado para manter o histórico claro."
          className={textareaClass(
            false,
          )}
        />
      </div>

      <ModalActions
        cancelLabel="Voltar"
        confirmLabel="Confirmar cancelamento"
        danger
        onCancel={
          onCancel
        }
        onConfirm={() =>
          onConfirm(
            reason,
          )
        }
      />
    </ModalShell>
  );
}

/* ============================================================
 * PEÇA
 * ============================================================ */

function PieceCard({
  piece,
  index,
}) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#d6e2e8] bg-[#f8fafb]">
      <div className="flex flex-col gap-3 border-b border-[#e0e7eb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#47758e]">
            Peça{" "}
            {String(
              index + 1,
            ).padStart(
              2,
              "0",
            )}
          </p>

          <h3 className="mt-1 text-[16px] font-semibold text-[#17394f]">
            {piece.name}
          </h3>
        </div>

        <span className="w-fit rounded-full border border-[#d0dfe7] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#536f80]">
          {piece.quantity}{" "}
          {piece.quantity ===
          1
            ? "unidade"
            : "unidades"}
        </span>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <RequestInfoItem
          label="Tipo"
          value={
            piece.type
          }
        />

        <RequestInfoItem
          label="Material"
          value={
            piece.material
          }
        />

        <RequestInfoItem
          label="Dimensões"
          value={
            piece.dimensions
          }
        />

        <RequestInfoItem
          label="Logística"
          value={
            piece.location
          }
        />
      </div>

      {piece.services?.length >
        0 && (
        <div className="border-t border-[#e1e8ec] px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5c7888]">
            Serviços
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {piece.services.map(
              (
                service,
                index,
              ) => (
                <span
                  key={`${service}-${index}`}
                  className="rounded-full border border-[#cbdde7] bg-[#eaf4f9] px-3 py-1.5 text-[10px] font-semibold text-[#3e708e]"
                >
                  {getServiceLabel(
                    service,
                  )}
                </span>
              ),
            )}
          </div>
        </div>
      )}

      {piece.requirements
        ?.dimensional
        ?.length > 0 && (
        <div className="border-t border-[#e1e8ec] px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5c7888]">
            Requisitos informados
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {piece.requirements.dimensional.map(
              (item) => (
                <RequestInfoItem
                  key={
                    item.label
                  }
                  label={
                    item.label
                  }
                  value={
                    item.value
                  }
                />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * ORIENTAÇÃO DO CONFIGURADOR
 * ============================================================ */

function RecommendationCard({
  piece,
  index,
}) {
  const recommendation =
    piece.recommendation;

  return (
    <div className="rounded-[18px] border border-[#c8dce6] bg-[#edf6fa] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#47758e]">
        Peça{" "}
        {String(
          index + 1,
        ).padStart(
          2,
          "0",
        )}{" "}
        · {piece.name}
      </p>

      <div className="mt-4 rounded-[16px] border border-[#b7d3e2] bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5c7888]">
          Tecnologia principal
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold text-[#17394f]">
              {
                recommendation
                  .primaryMachine
                  .name
              }
            </h3>

            <p className="mt-1 text-[12px] text-[#567487]">
              {
                recommendation
                  .primaryMachine
                  .match
              }
            </p>
          </div>

          <span className="text-[26px] font-semibold text-[#096ab2]">
            {
              recommendation
                .primaryMachine
                .score
            }
            %
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5c7888]">
            Justificativas
          </p>

          <div className="mt-3 space-y-2">
            {recommendation.reasons.map(
              (reason) => (
                <TechnicalPoint
                  key={
                    reason
                  }
                  symbol="+"
                  text={
                    reason
                  }
                />
              ),
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5c7888]">
            Alternativas consideradas
          </p>

          <div className="mt-3 space-y-2">
            {recommendation.alternatives.map(
              (
                alternative,
              ) => (
                <div
                  key={
                    alternative.name
                  }
                  className="flex items-center justify-between rounded-[11px] border border-[#d4e2e9] bg-white/75 px-3 py-2.5"
                >
                  <div>
                    <p className="text-[12px] font-semibold text-[#3b5d71]">
                      {
                        alternative.name
                      }
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#617987]">
                      {
                        alternative.match
                      }
                    </p>
                  </div>

                  <span className="text-[12px] font-semibold text-[#5681a0]">
                    {
                      alternative.score
                    }
                    %
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {recommendation.warnings
        ?.length > 0 && (
        <div className="mt-5 rounded-[13px] border border-[#e2d7bb] bg-[#f7f1e4] p-4">
          {recommendation.warnings.map(
            (warning) => (
              <TechnicalPoint
                key={
                  warning
                }
                symbol="△"
                text={
                  warning
                }
              />
            ),
          )}
        </div>
      )}

      <p className="mt-4 text-[11px] leading-5 text-[#5d7786]">
        Esta orientação foi calculada antes da análise humana e não representa
        uma decisão final da equipe.
      </p>
    </div>
  );
}

/* ============================================================
 * ARQUIVOS
 * ============================================================ */

function FileCard({
  file,
}) {
  return (
    <button
      type="button"
      className="
        flex
        w-full
        items-center
        gap-4
        rounded-[14px]
        border border-[#d6e2e8]
        bg-[#f8fafb]
        px-4 py-4
        text-left
        transition
        hover:border-[#a8c5d4]
        hover:bg-white
      "
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#ccdde6] bg-white text-[13px] text-[#5681a0]">
        ↓
      </span>

      <div className="min-w-0">
        <p className="truncate text-[12px] font-semibold text-[#31566d]">
          {file.name}
        </p>

        <p className="mt-1 text-[10px] uppercase tracking-[0.05em] text-[#617987]">
          {file.type} ·{" "}
          {file.size}
        </p>
      </div>
    </button>
  );
}

/* ============================================================
 * HISTÓRICO
 * ============================================================ */

function HistoryItem({
  item,
  last,
}) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!last && (
        <div className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-[#d5e2e8]" />
      )}

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bfd5e1] bg-[#edf6fa] text-[10px] text-[#5681a0]">
        ✓
      </div>

      <div className="pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-semibold text-[#31566d]">
            {item.action}
          </p>

          <span className="text-[10px] text-[#647f8e]">
            {item.date} ·{" "}
            {item.time}
          </span>
        </div>

        <p className="mt-1 text-[10px] font-medium text-[#607988]">
          por {item.actor}
        </p>

        <p className="mt-2 text-[12px] leading-5 text-[#587282]">
          {
            item.description
          }
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 * COMPONENTES AUXILIARES
 * ============================================================ */

function FeedbackBanner({
  type,
  message,
}) {
  const error =
    type ===
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
        px-4 py-3

        ${
          error
            ? "border-[#e3c5bc] bg-[#faf0ed]"
            : "border-[#bfd7c8] bg-[#edf7f1]"
        }
      `}
    >
      <span
        className={`
          flex h-7 w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          text-[11px]
          font-semibold

          ${
            error
              ? "text-[#9b5842]"
              : "text-[#397250]"
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
              : "text-[#397250]"
          }
        `}
      >
        {message}
      </p>
    </div>
  );
}

function DemoBadge() {
  return (
    <span className="rounded-full border border-[#e2c7b5] bg-[#fbefe8] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.07em] text-[#9b603f]">
      Demonstração
    </span>
  );
}

function SideInfo({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5c7888]">
        {label}
      </p>

      <p className="mt-1.5 text-[13px] font-semibold leading-5 text-[#31566d]">
        {value ||
          "Não informado"}
      </p>
    </div>
  );
}

function TechnicalPoint({
  symbol,
  text,
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dcecf5] text-[9px] font-semibold text-[#397392]">
        {symbol}
      </span>

      <p className="text-[11px] leading-5 text-[#587282]">
        {text}
      </p>
    </div>
  );
}

function EmptyBlock({
  text,
}) {
  return (
    <div className="rounded-[15px] border border-dashed border-[#cad9e1] bg-[#f8fafb] px-5 py-8 text-center">
      <p className="text-[12px] leading-5 text-[#617987]">
        {text}
      </p>
    </div>
  );
}

function Field({
  children,
}) {
  return (
    <div>
      {children}
    </div>
  );
}

function FieldLabel({
  children,
}) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#557585]">
      {children}
    </p>
  );
}

function inputClass(
  disabled,
) {
  return `
    h-11
    w-full
    rounded-[12px]
    border
    border-[#ccdbe3]
    px-3.5
    text-[13px]
    text-[#294e64]
    outline-none
    transition

    ${
      disabled
        ? "cursor-not-allowed bg-[#eef3f5] text-[#708795]"
        : "bg-[#f8fafb] focus:border-[#78a9c4] focus:bg-white"
    }
  `;
}

function textareaClass(
  disabled,
) {
  return `
    w-full
    resize-y
    rounded-[12px]
    border
    border-[#ccdbe3]
    px-3.5
    py-3
    text-[13px]
    leading-6
    text-[#294e64]
    outline-none
    transition
    placeholder:text-[#8497a2]

    ${
      disabled
        ? "cursor-not-allowed bg-[#eef3f5] text-[#708795]"
        : "bg-[#f8fafb] focus:border-[#78a9c4] focus:bg-white"
    }
  `;
}

/* ============================================================
 * MODAIS BASE
 * ============================================================ */

function ModalShell({
  children,
  maxWidth = "max-w-[580px]",
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#071a2b]/50 px-4 py-6 backdrop-blur-[3px]">
      <div
        className={`
          max-h-[calc(100dvh-48px)]
          w-full
          ${maxWidth}
          overflow-y-auto
          rounded-[24px]
          border border-white/35
          bg-white
          p-6
          shadow-[0_35px_100px_rgba(7,26,43,0.25)]
          sm:p-7
        `}
      >
        {children}
      </div>
    </div>
  );
}

function ModalActions({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  danger = false,
}) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={
          onCancel
        }
        className="rounded-[11px] border border-[#d0dce3] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#607989]"
      >
        {cancelLabel}
      </button>

      <button
        type="button"
        onClick={
          onConfirm
        }
        className={`
          rounded-[11px]
          px-5 py-3
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.07em]
          text-white
          transition

          ${
            danger
              ? "bg-[#9a5947] hover:bg-[#854a3b]"
              : "bg-[#096ab2] hover:bg-[#075b99]"
          }
        `}
      >
        {confirmLabel}
      </button>
    </div>
  );
}

/* ============================================================
 * HELPERS
 * ============================================================ */

function createAnalysisForm(
  request,
) {
  const analysis =
    request?.analysis ??
    {};

  const knowledgeTags =
    Array.isArray(
      analysis.knowledgeTags,
    )
      ? analysis.knowledgeTags
      : [];

  const service =
    normalizeServiceId(
      analysis.recommendedService ??
        request?.service ??
        "",
    );

  return {
    technicalSummary:
      analysis.technicalSummary ??
      "",

    pendingInformation:
      analysis.pendingInformation ??
      "",

    decisionReason:
      analysis.decisionReason ??
      "",

    recommendedService:
      service,

    recommendedEquipment:
      analysis.recommendedEquipment ??
      "",

    knowledgeTags,

    knowledgeTagsText:
      knowledgeTags.join(
        ", ",
      ),
  };
}