import { ConfiguratorConfigSection } from "../../components/internal/ConfiguratorConfigSection";
import { DemoBadge } from "../../components/internal/DemoBadge";
import "../../styles/internalWorkspace.css";

import { useEffect, useState } from "react";
import { validateRequestAnalysis } from "../../services/workflowValidation";
import { ValidationFeedback, FieldIssue } from "../../components/internal/ValidationFeedback";
import { ApiState } from "../../components/internal/ApiState";

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
  validateRequestForQuote,
} from "../../services/quoteService";

import {
  isArchivedRequest,
  getRequestById, startRequestAnalysis, resumeRequestAnalysis,
  saveRequestTechnicalAnalysis, finishRequestAnalysis, saveRequestInternalNotes,
  cancelRequest,
} from "../../services/requestService";

import {
  getServiceLabel,
  normalizeServiceId,
  SERVICE_OPTIONS,
} from "../../utils/serviceLabels";

export function RequestDetailPage() {
  const { requestId } = useParams();
  return <RequestDetail key={requestId} requestId={requestId} />;
}

function RequestDetail({ requestId }) {
  const navigate =
    useNavigate();


  const [
    request,
    setRequest,
  ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState(false);

  const existingQuote = request?.linkedQuoteId ? { id: request.linkedQuoteId } : null;

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
  useEffect(() => {
    let active = true;
    getRequestById(requestId).then((item) => {
      if (active) {
        setRequest(item);
        setInternalNotes(item.internalNotes || "");
        setTechnicalAnalysis(createAnalysisForm(item));
      }
    }).catch((error) => { if (active) setLoadError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [requestId, reloadKey]);

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

  /*
   * ============================================================
   * NÃO ENCONTRADA
   * ============================================================
   */

  if (!request) {
    if (loading || loadError) return <ApiState title={requestId} loading="Carregando solicitação..." error={loadError} onRetry={() => { setLoading(true); setLoadError(""); setReloadKey((value) => value + 1); }} />;
    return (
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/solicitacoes",
            )
          }
          className="text-[13px] font-semibold text-[#356f9f]"
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
    isArchivedRequest(
      request,
    );

  const quoteValidation =
    validateRequestForQuote(
      request,
    );

  /*
   * A análise só fica editável depois de iniciada.
   *
   * A SOL Nova exibe o botão "Iniciar análise".
   * Depois da ação o status passa para "Em análise".
   */
  const analysisEditable =
    !closed &&
    [
      "Em análise",
      "Aguardando informações",
    ].includes(
      request.status,
    );

  const analysisValidation = validateRequestAnalysis(technicalAnalysis);

  /*
   * ============================================================
   * INICIAR ANÁLISE
   * ============================================================
   */

  async function handleStartAnalysis() {
    if (busy) return;
    setBusy(true);
    try {
      const updated =
        await startRequestAnalysis(request.id);

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
    finally { setBusy(false); }
  }

  /*
   * ============================================================
   * RETOMAR ANÁLISE
   * ============================================================
   */

  async function handleResumeAnalysis() {
    if (busy) return;
    setBusy(true);
    try {
      const updated =
        await resumeRequestAnalysis(request.id);

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
    finally { setBusy(false); }
  }

  /*
   * ============================================================
   * SALVAR ANÁLISE
   * ============================================================
   */

  async function handleSaveTechnicalAnalysis() {
    if (busy) return;
    setBusy(true);
    try {
      const updated =
        await saveRequestTechnicalAnalysis(
          request.id,
          technicalAnalysis,
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
    finally { setBusy(false); }
  }

  /*
   * ============================================================
   * CONCLUIR ANÁLISE
   * ============================================================
   */

  async function handleFinishAnalysis(
    resultData,
  ) {
    if (busy) return;
    const validation = validateRequestAnalysis({ ...technicalAnalysis, ...resultData }, resultData.result);
    if (!validation.isValid) { showFeedback(validation.problems.join(" "), "error"); return; }
    setBusy(true);
    try {
      const updated =
        await finishRequestAnalysis(
          request.id,
          {
            ...technicalAnalysis,
            ...resultData,
          },
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
    finally { setBusy(false); }
  }

  /*
   * ============================================================
   * ORÇAMENTO
   * ============================================================
   */

  function handleQuoteAction() {
    if (existingQuote) {
      navigate(
        `/portal/orcamentos/${existingQuote.id}`,
      );

      return;
    }

    if (
      !quoteValidation.isValid
    ) {
      showFeedback(
        quoteValidation.problems.join(
          " ",
        ),
        "error",
      );

      return;
    }

    setShowQuoteConfirmation(
      true,
    );
  }

  async function handleConfirmQuoteCreation() {
    if (busy) return;
    setBusy(true);
    try {
      const quote = await createQuoteFromRequest(request);
      const updated = await getRequestById(request.id);
      syncRequest(updated);
      setShowQuoteConfirmation(false);
      navigate('/portal/orcamentos/' + quote.id);
    } catch (error) { showFeedback(error.message, "error"); }
    finally { setBusy(false); }
  }

  /*
   * ============================================================
   * OBSERVAÇÕES
   * ============================================================
   */

  async function handleSaveNotes() {
    if (busy) return;
    setBusy(true);
    try {
      const updated =
        await saveRequestInternalNotes(
          request.id,
          internalNotes,
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
    finally { setBusy(false); }
  }

  /*
   * ============================================================
   * CANCELAMENTO
   * ============================================================
   */

  async function handleCancelRequest(
    reason,
  ) {
    if (busy) return;
    setBusy(true);
    try {
      const updated =
        await cancelRequest(
          request.id,
          reason,
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
    finally { setBusy(false); }
  }

  /*
   * ============================================================
   * AUXILIARES
   * ============================================================
   */

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
      () => {
        setFeedback("");
      },
      3200,
    );
  }

  return (
    <>
      <div className="internal-workspace mx-auto max-w-[1500px]">
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
          className="mb-5 internal-help-text font-semibold uppercase tracking-[0.08em] text-[#477187] transition hover:text-[#0057b8]"
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
            <div className="flex flex-wrap items-center gap-2">{request.source === "demo" && <DemoBadge />}
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
          {/* =================================================
              CONTEÚDO
          ================================================= */}

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
                  label="Necessidade principal"
                  value={
                    request.requestNeed
                      ?.name
                  }
                />

                <RequestInfoItem
                  label="Serviço principal"
                  value={getServiceLabel(
                    request.service,
                  )}
                />
              </div>

              {Array.isArray(
                request.services,
              ) &&
                request.services
                  .length > 1 && (
                  <div className="mt-6 border-t border-[#e1e8ec] pt-5">
                    <p className="internal-field-label">
                      Serviços relacionados
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {request.services.map(
                        (
                          service,
                        ) => {
                          const serviceId =
                            normalizeServiceId(
                              service,
                            );

                          return (
                            <span
                              key={
                                serviceId ||
                                service
                              }
                              className="internal-soft-chip"
                            >
                              {getServiceLabel(
                                service,
                              )}
                            </span>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

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

            <ConfiguratorConfigSection configuration={request.configuration} />

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
                          piece.id ??
                          index
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
                <EmptyBlock text="Nenhuma peça foi cadastrada para esta solicitação." />
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
                              piece.id ??
                              index
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
                    disabled={busy}
                    onClick={
                      handleSaveTechnicalAnalysis
                    }
                    className="
                      internal-secondary-button
                      px-4
                      py-2.5
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
                  !analysisEditable || busy
                }
              />
              {analysisEditable && <div className="mt-5"><ValidationFeedback validation={analysisValidation} title="Pendências para concluir a análise" /></div>}

              <div className="mt-6 rounded-[15px] border border-[#cbdde6] bg-[#f1f7fa] p-4">
                <p className="internal-field-label">
                  Preparação para Gestão do Conhecimento
                </p>

                <p className="mt-2 internal-help-text leading-5">
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
                        requestId={
                          request.id
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
              SIDEBAR DE GESTÃO
          ================================================= */}

          <aside className="space-y-5">
            <section className="internal-soft-panel p-5">
              <p className="internal-section-eyebrow">
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
                  value={`${request.parts ?? request.piecesData?.length ?? 0}`}
                />

                <SideInfo
                  label="Serviço principal"
                  value={getServiceLabel(
                    request.service,
                  )}
                />
              </div>

              {Array.isArray(
                request.services,
              ) &&
                request.services
                  .length > 1 && (
                  <div className="mt-5 border-t border-[#c8dbe4] pt-5">
                    <p className="internal-field-label">
                      Serviços relacionados
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {request.services.map(
                        (
                          service,
                        ) => {
                          const serviceId =
                            normalizeServiceId(
                              service,
                            );

                          return (
                            <span
                              key={
                                serviceId ||
                                service
                              }
                              className="internal-soft-chip"
                            >
                              {getServiceLabel(
                                service,
                              )}
                            </span>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

              <div className="mt-6 border-t border-[#c8dbe4] pt-5">
                <RequestPrimaryAction
                  busy={busy}
                  analysisValid={analysisValidation.isValid}
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
                    disabled={busy}
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
                      px-4
                      py-2.5
                      text-[11px]
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
                        {/* ===============================================
                ORÇAMENTO VINCULADO
            =============================================== */}

            {existingQuote && (
              <section className="internal-soft-panel p-5">
                <p className="internal-section-eyebrow">
                  Orçamento vinculado
                </p>

                <p className="mt-3 text-[20px] font-semibold text-[#17394f]">
                  {existingQuote.id}
                </p>

                <p className="mt-1 internal-help-text leading-5">
                  Esta solicitação já avançou para a etapa comercial.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/portal/orcamentos/${existingQuote.id}`,
                    )
                  }
                  className="
                    mt-4
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.07em]
                    text-[#356f9f]
                    transition
                    hover:text-[#0057b8]
                  "
                >
                  Abrir orçamento →
                </button>
              </section>
            )}

            {/* ===============================================
                OBSERVAÇÕES INTERNAS
            =============================================== */}

            <section className="internal-card p-5">
              <p className="internal-section-eyebrow">
                Observações internas
              </p>

              <p className="mt-1.5 internal-help-text leading-5">
                Não ficam visíveis para o cliente.
              </p>

              <textarea
                disabled={closed || busy}
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
                  internal-input
                  mt-4
                  w-full
                  resize-y
                "
              />

              <button
                type="button"
                onClick={
                  handleSaveNotes
                }
                disabled={
                  closed || busy
                }
                className="
                  internal-secondary-button
                  mt-3
                  w-full
                  px-4
                  py-2.5
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Salvar observação
              </button>
            </section>

            {/* ===============================================
                CLASSIFICAÇÃO
            =============================================== */}

            <section className="internal-card p-5">
              <p className="internal-section-eyebrow">
                Classificação do registro
              </p>

              <p className="mt-1.5 internal-help-text leading-5">
                Informações usadas para organizar a solicitação e manter
                rastreabilidade entre necessidade, serviços e orçamento.
              </p>

              <div className="mt-5 space-y-4">
                <SideInfo
                  label="Necessidade"
                  value={
                    request.requestNeed
                      ?.name
                  }
                />

                <SideInfo
                  label="ID da necessidade"
                  value={
                    request.requestNeedId
                  }
                />

                <SideInfo
                  label="Serviço normalizado"
                  value={
                    request.service &&
                    request.service !==
                      "Não definido"
                      ? getServiceLabel(
                          request.service,
                        )
                      : "Não definido"
                  }
                />

                <SideInfo
                  label="Quantidade de serviços"
                  value={`${
                    Array.isArray(
                      request.services,
                    ) &&
                    request.services.length > 0
                      ? request.services.length
                      : request.service &&
                          request.service !==
                            "Não definido"
                        ? 1
                        : 0
                  }`}
                />

                <SideInfo
                  label="Tipo de entrada"
                  value={
                    request.requestNeed
                      ?.flow ===
                    "direct-request"
                      ? "Solicitação direta"
                      : request.channel ===
                          "Configurador"
                        ? "Solicitação orientada pelo configurador"
                        : "Solicitação técnica"
                  }
                />

                <SideInfo
                  label="Situação do registro"
                  value={
                    closed
                      ? "Arquivado"
                      : "Ativo"
                  }
                />
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* =====================================================
          MODAL — RESULTADO DA ANÁLISE
      ===================================================== */}

      {showAnalysisModal && (
        <AnalysisResultModal
          busy={busy}
          error={feedbackType === "error" ? feedback : ""}
          request={
            request
          }
          analysis={
            technicalAnalysis
          }
          onClose={() =>
            setShowAnalysisModal(
              false,
            )
          }
          onConfirm={
            handleFinishAnalysis
          }
        />
      )}

      {/* =====================================================
          MODAL — CRIAR ORÇAMENTO
      ===================================================== */}

      {showQuoteConfirmation && (
        <ConfirmationModal
          busy={busy}
          error={feedbackType === "error" ? feedback : ""}
          eyebrow="Criar orçamento"
          title="Gerar orçamento a partir desta solicitação?"
          description="Os dados já registrados serão utilizados como base para o novo orçamento. A necessidade principal, os serviços e as peças vinculadas serão preservados no registro comercial."
          confirmLabel="Criar orçamento"
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

      {/* =====================================================
          MODAL — CANCELAMENTO
      ===================================================== */}

      {showCancelConfirmation && (
        <CancelRequestModal
          busy={busy}
          error={feedbackType === "error" ? feedback : ""}
          onClose={() =>
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

/*
 * ============================================================
 * FEEDBACK LOCAL
 * ============================================================
 */

function FeedbackBanner({
  type,
  message,
}) {
  const isError =
    type === "error";

  return (
    <div
      role={
        isError
          ? "alert"
          : "status"
      }
      className={`
        mt-5
        rounded-[14px]
        border
        px-4
        py-3
        text-[13px]
        font-medium
        leading-5

        ${
          isError
            ? "border-[#e4c9c2] bg-[#fbf2ef] text-[#8c5142]"
            : "border-[#c5ddd2] bg-[#f0f8f4] text-[#3e6d59]"
        }
      `}
    >
      {message}
    </div>
  );
}

/*
 * ============================================================
 * FORMULÁRIO DE ANÁLISE TÉCNICA
 * ============================================================
 */

function TechnicalAnalysisForm({
  value,
  onChange,
  disabled,
}) {
  const validation = validateRequestAnalysis(value);
  function updateField(
    field,
    fieldValue,
  ) {
    onChange({
      ...value,

      [field]:
        fieldValue,
    });
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <AnalysisField
        label="Serviço validado"
        help="Confirme ou ajuste a classificação técnica principal desta solicitação."
      >
        <select
          value={
            value.service
          }
          disabled={
            disabled
          }
          onChange={(
            event,
          ) =>
            updateField(
              "service",
              event.target.value,
            )
          }
          className="internal-input w-full"
        >
          <option value="">
            Selecione
          </option>

          {SERVICE_OPTIONS.map(
            (
              option,
            ) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {option.label}
              </option>
            ),
          )}
        </select>
      </AnalysisField>

      <AnalysisField
        label="Complexidade"
        help="Classificação preliminar para apoiar priorização e orçamento."
      >
        <select
          value={
            value.complexity
          }
          disabled={
            disabled
          }
          onChange={(
            event,
          ) =>
            updateField(
              "complexity",
              event.target.value,
            )
          }
          className="internal-input w-full"
        >
          <option value="">
            Selecione
          </option>

          <option value="Baixa">
            Baixa
          </option>

          <option value="Média">
            Média
          </option>

          <option value="Alta">
            Alta
          </option>
        </select>
      </AnalysisField>

      <AnalysisField
        label="Tecnologia sugerida"
        help="Equipamento ou tecnologia mais adequada após avaliação inicial."
      >
        <input
          type="text"
          value={
            value.technology
          }
          disabled={
            disabled
          }
          onChange={(
            event,
          ) =>
            updateField(
              "technology",
              event.target.value,
            )
          }
          placeholder="Ex.: PRISMO, O-INSPECT, ATOS Q..."
          className="internal-input w-full"
        />
      </AnalysisField>

      <AnalysisField
        label="Responsável técnico"
        help="Profissional responsável pela análise desta necessidade."
      >
        <input
          type="text"
          value={
            value.technicalResponsible
          }
          disabled={
            disabled
          }
          onChange={(
            event,
          ) =>
            updateField(
              "technicalResponsible",
              event.target.value,
            )
          }
          placeholder="Nome do responsável"
          className="internal-input w-full"
        />
      </AnalysisField>

      <div className="md:col-span-2">
        <AnalysisField
          label="Resumo técnico *"
          help="Registre os principais pontos identificados na análise da solicitação."
        >
          <textarea
            id="analysis-summary"
            aria-label="Resumo técnico"
            required
            aria-invalid={!disabled && !validation.isValid}
            aria-describedby="analysis-summary-issue"
            value={
              value.summary
            }
            disabled={
              disabled
            }
            onChange={(
              event,
            ) =>
              updateField(
                "summary",
                event.target.value,
              )
            }
            rows={5}
            placeholder="Descreva a interpretação técnica da necessidade..."
            className="internal-input w-full resize-y"
          />
          {!disabled && <span id="analysis-summary-issue"><FieldIssue issues={validation.issues} field="summary" /></span>}
        </AnalysisField>
      </div>

      <div className="md:col-span-2">
        <AnalysisField
          label="Pendências ou informações necessárias"
          help="Informe o que ainda precisa ser confirmado com o cliente antes do orçamento."
        >
          <textarea
            value={
              value.pendingInformation
            }
            disabled={
              disabled
            }
            onChange={(
              event,
            ) =>
              updateField(
                "pendingInformation",
                event.target.value,
              )
            }
            rows={4}
            placeholder="Ex.: desenho técnico, tolerâncias, quantidade de peças..."
            className="internal-input w-full resize-y"
          />
        </AnalysisField>
      </div>
    </div>
  );
}

function AnalysisField({
  label,
  help,
  children,
}) {
  return (
    <div>
      <label className="internal-field-label">
        {label}
      </label>

      {help && (
        <p className="mt-1 internal-help-text leading-5">
          {help}
        </p>
      )}

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}
/*
 * ============================================================
 * AÇÃO PRINCIPAL DA SOLICITAÇÃO
 * ============================================================
 */

function RequestPrimaryAction({
  busy,
  analysisValid,
  request,
  existingQuote,
  onStartAnalysis,
  onResumeAnalysis,
  onFinishAnalysis,
  onQuoteAction,
}) {
  if (
    request.status ===
    "Nova"
  ) {
    return (
      <button
        type="button"
        onClick={
          onStartAnalysis
        }
        disabled={busy}
        className="internal-primary-button w-full px-4 py-2.5"
      >
        Iniciar análise
      </button>
    );
  }

  if (
    request.status ===
      "Em análise" ||
    request.status ===
      "Aguardando informações"
  ) {
    return (
      <div className="space-y-2">
        {request.status ===
          "Aguardando informações" && (
          <button
            type="button"
            onClick={
              onResumeAnalysis
            }
            disabled={busy}
            className="internal-secondary-button w-full px-4 py-2.5"
          >
            Retomar análise
          </button>
        )}

        <button
          type="button"
          onClick={
            onFinishAnalysis
          }
          disabled={busy || !analysisValid || request.status !== "Em análise"}
          className="internal-primary-button w-full px-4 py-2.5"
        >
          Concluir análise
        </button>
      </div>
    );
  }

  if (
    request.status ===
      "Apta para orçamento" ||
    existingQuote
  ) {
    return (
      <button
        type="button"
        onClick={
          onQuoteAction
        }
        disabled={busy}
        className="internal-primary-button w-full px-4 py-2.5"
      >
        {existingQuote
          ? "Abrir orçamento"
          : "Criar orçamento"}
      </button>
    );
  }

  return null;
}

/*
 * ============================================================
 * PEÇA
 * ============================================================
 */

function PieceCard({
  piece,
  index,
}) {
  const services =
    Array.isArray(
      piece.services,
    )
      ? piece.services
      : [];

  const requirements =
    piece.requirements &&
    typeof piece.requirements ===
      "object"
      ? piece.requirements
      : {};

  const inspectionOptions =
    normalizeRequirementArray(
      requirements.inspectionOptions,
    );

  const scanningOptions =
    normalizeRequirementArray(
      requirements.scanningOptions,
    );

  const reverseOptions =
    normalizeRequirementArray(
      requirements.reverseOptions,
    );

  const internalOptions =
    normalizeRequirementArray(
      requirements.internalOptions,
    );

  const legacyDimensional =
    Array.isArray(
      requirements.dimensional,
    )
      ? requirements.dimensional
      : [];

  const hasModernRequirements =
    inspectionOptions.length >
      0 ||
    scanningOptions.length >
      0 ||
    reverseOptions.length >
      0 ||
    internalOptions.length >
      0 ||
    Boolean(
      requirements.movable,
    ) ||
    Boolean(
      requirements.surroundingAccess,
    ) ||
    Boolean(
      requirements.locationNotes,
    );

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#d6e2e8] bg-[#f8fafb]">
      {/* =====================================================
          CABEÇALHO DA PEÇA
      ===================================================== */}

      <div className="flex flex-col gap-3 border-b border-[#e0e7eb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="internal-field-label">
            Peça{" "}
            {String(
              index + 1,
            ).padStart(
              2,
              "0",
            )}
          </p>

          <h3 className="mt-1 text-[16px] font-semibold text-[#17394f]">
            {piece.name ||
              "Peça sem identificação"}
          </h3>
        </div>

        <span className="internal-soft-chip w-fit">
          {piece.quantity ??
            1}{" "}
          {(piece.quantity ??
            1) === 1
            ? "unidade"
            : "unidades"}
        </span>
      </div>

      {/* =====================================================
          DADOS DA PEÇA
      ===================================================== */}

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

      {/* =====================================================
          SERVIÇOS DA PEÇA
      ===================================================== */}

      {services.length >
        0 && (
        <div className="border-t border-[#e1e8ec] px-5 py-4">
          <p className="internal-field-label">
            Serviços
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {services.map(
              (
                service,
              ) => {
                const serviceId =
                  normalizeServiceId(
                    service,
                  );

                return (
                  <span
                    key={
                      serviceId ||
                      service
                    }
                    className="internal-soft-chip"
                  >
                    {getServiceLabel(
                      service,
                    )}
                  </span>
                );
              },
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          REQUISITOS — FORMATO ATUAL
      ===================================================== */}

      {hasModernRequirements && (
        <div className="border-t border-[#e1e8ec] px-5 py-5">
          <p className="internal-field-label">
            Requisitos técnicos
          </p>

          <div className="mt-4 space-y-5">
            {inspectionOptions.length >
              0 && (
              <RequirementGroup
                title="Metrologia e inspeção"
                items={
                  inspectionOptions
                }
              />
            )}

            {scanningOptions.length >
              0 && (
              <RequirementGroup
                title="Escaneamento e digitalização 3D"
                items={
                  scanningOptions
                }
              />
            )}

            {reverseOptions.length >
              0 && (
              <RequirementGroup
                title="Engenharia reversa"
                items={
                  reverseOptions
                }
                formatter={
                  formatReverseRequirementValue
                }
              />
            )}

            {internalOptions.length >
              0 && (
              <RequirementGroup
                title="Tomografia industrial"
                items={
                  internalOptions
                }
              />
            )}

            {(requirements.movable ||
              requirements.surroundingAccess ||
              requirements.locationNotes) && (
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.07em] text-[#477187]">
                  Condições de atendimento
                </p>

                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {requirements.movable && (
                    <RequestInfoItem
                      label="Peça movimentável"
                      value={
                        formatMovableValue(
                          requirements.movable,
                        )
                      }
                    />
                  )}

                  {requirements.surroundingAccess && (
                    <RequestInfoItem
                      label="Acesso ao redor da peça"
                      value={
                        formatSurroundingAccessValue(
                          requirements.surroundingAccess,
                        )
                      }
                    />
                  )}

                  {requirements.locationNotes && (
                    <div className="sm:col-span-2">
                      <RequestInfoItem
                        label="Observações de localização"
                        value={
                          requirements.locationNotes
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          REQUISITOS — COMPATIBILIDADE DEMO ANTIGA
      ===================================================== */}

      {!hasModernRequirements &&
        legacyDimensional.length >
          0 && (
          <div className="border-t border-[#e1e8ec] px-5 py-5">
            <p className="internal-field-label">
              Requisitos informados
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {legacyDimensional.map(
                (
                  item,
                  itemIndex,
                ) => (
                  <RequestInfoItem
                    key={
                      item.label ??
                      itemIndex
                    }
                    label={
                      item.label ??
                      "Requisito"
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

/*
 * ============================================================
 * GRUPO DE REQUISITOS
 * ============================================================
 */

function RequirementGroup({
  title,
  items,
  formatter = formatRequirementValue,
}) {
  if (
    !Array.isArray(
      items,
    ) ||
    items.length === 0
  ) {
    return null;
  }

  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.07em] text-[#477187]">
        {title}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map(
          (
            item,
            index,
          ) => (
            <span
              key={`${item}-${index}`}
              className="internal-soft-chip"
            >
              {formatter(
                item,
              )}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

/*
 * ============================================================
 * RECOMENDAÇÃO DO CONFIGURADOR
 * ============================================================
 */

function RecommendationCard({
  piece,
  index,
}) {
  const recommendation =
    piece.recommendation;

  if (!recommendation) {
    return null;
  }

  const primaryMachine =
    recommendation.primaryMachine;

  const reasons =
    Array.isArray(
      recommendation.reasons,
    )
      ? recommendation.reasons
      : [];

  const alternatives =
    Array.isArray(
      recommendation.alternatives,
    )
      ? recommendation.alternatives
      : [];

  const warnings =
    Array.isArray(
      recommendation.warnings,
    )
      ? recommendation.warnings
      : [];

  return (
    <div className="rounded-[18px] border border-[#c8dce6] bg-[#edf6fa] p-5">
      <p className="internal-field-label">
        Peça{" "}
        {String(
          index + 1,
        ).padStart(
          2,
          "0",
        )}{" "}
        ·{" "}
        {piece.name ||
          "Sem identificação"}
      </p>

      {primaryMachine && (
        <div className="mt-4 rounded-[16px] border border-[#b7d3e2] bg-white p-4">
          <p className="internal-field-label">
            Tecnologia principal
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[#17394f]">
                {primaryMachine.name}
              </h3>

              {primaryMachine.match && (
                <p className="mt-1 internal-help-text">
                  {primaryMachine.match}
                </p>
              )}
            </div>

            {primaryMachine.score !==
              undefined && (
              <span className="text-[24px] font-semibold text-[#096ab2]">
                {primaryMachine.score}%
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="internal-field-label">
            Justificativas
          </p>

          {reasons.length >
          0 ? (
            <div className="mt-3 space-y-2">
              {reasons.map(
                (
                  reason,
                ) => (
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
          ) : (
            <p className="mt-2 internal-help-text">
              Nenhuma justificativa estruturada disponível.
            </p>
          )}
        </div>

        <div>
          <p className="internal-field-label">
            Alternativas consideradas
          </p>

          {alternatives.length >
          0 ? (
            <div className="mt-3 space-y-2">
              {alternatives.map(
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
                      <p className="text-[13px] font-semibold text-[#3b5d71]">
                        {
                          alternative.name
                        }
                      </p>

                      {alternative.match && (
                        <p className="mt-0.5 text-[11px] text-[#617987]">
                          {
                            alternative.match
                          }
                        </p>
                      )}
                    </div>

                    {alternative.score !==
                      undefined && (
                      <span className="text-[13px] font-semibold text-[#5681a0]">
                        {
                          alternative.score
                        }
                        %
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>
          ) : (
            <p className="mt-2 internal-help-text">
              Nenhuma alternativa registrada.
            </p>
          )}
        </div>
      </div>

      {warnings.length >
        0 && (
        <div className="mt-5 rounded-[13px] border border-[#e2d7bb] bg-[#f7f1e4] p-4">
          <div className="space-y-2">
            {warnings.map(
              (
                warning,
              ) => (
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
        </div>
      )}

      <p className="mt-4 internal-help-text leading-5">
        Esta orientação foi calculada antes da análise humana e não representa
        uma decisão final da equipe.
      </p>
    </div>
  );
}
/*
 * ============================================================
 * ARQUIVO
 * ============================================================
 */

function FileCard({
  file,
  requestId,
}) {
  const size = Number(file.size) > 0 ? (Number(file.size) >= 1048576 ? `${(Number(file.size) / 1048576).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(Number(file.size) / 1024))} KB`) : "";
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#ccdde6] bg-white text-[14px] text-[#5681a0]">
        {file.stored ? "↗" : "—"}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-[#31566d]">{file.name}</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.05em] text-[#617987]">
          {file.type || "Arquivo"}{size ? ` · ${size}` : ""}{file.stored ? " · abrir" : " · arquivo não enviado"}
        </p>
      </div>
    </>
  );
  const className = "flex w-full items-center gap-4 rounded-[14px] border border-[#d6e2e8] bg-[#f8fafb] px-4 py-4 text-left transition hover:border-[#a8c5d4] hover:bg-white";
  if (!file.stored) return <div className={`${className} cursor-default opacity-80`} title="Registrado antes do envio de arquivos: só o nome foi guardado.">{content}</div>;
  return (
    <a href={`/api/requests/${encodeURIComponent(requestId)}/attachments/${encodeURIComponent(file.id)}`} target="_blank" rel="noreferrer" className={className} title="Abrir em uma nova aba">
      {content}
    </a>
  );
}

/*
 * ============================================================
 * HISTÓRICO
 * ============================================================
 */

function HistoryItem({
  item,
  last,
}) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!last && (
        <div className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-[#d5e2e8]" />
      )}

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bfd5e1] bg-[#edf6fa] text-[11px] text-[#5681a0]">
        ✓
      </div>

      <div className="pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-semibold text-[#31566d]">
            {item.action}
          </p>

          {(item.date ||
            item.time) && (
            <span className="text-[11px] text-[#8c9ba4]">
              {item.date}

              {item.date &&
              item.time
                ? " · "
                : ""}

              {item.time}
            </span>
          )}
        </div>

        {item.actor && (
          <p className="mt-1 text-[11px] font-medium text-[#708795]">
            por{" "}
            {item.actor}
          </p>
        )}

        {item.description && (
          <p className="mt-2 text-[13px] leading-5 text-[#768b97]">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

/*
 * ============================================================
 * INFORMAÇÃO DA SIDEBAR
 * ============================================================
 */

function SideInfo({
  label,
  value,
}) {
  return (
    <div>
      <p className="internal-field-label">
        {label}
      </p>

      <p className="mt-1.5 text-[15px] font-semibold text-[#31566d]">
        {value ||
          "A definir"}
      </p>
    </div>
  );
}

/*
 * ============================================================
 * PONTO TÉCNICO
 * ============================================================
 */

function TechnicalPoint({
  symbol,
  text,
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className="
          mt-[1px]
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#dcecf5]
          text-[11px]
          font-semibold
          text-[#397392]
        "
      >
        {symbol}
      </span>

      <p className="text-[12px] leading-5 text-[#647d8b]">
        {text}
      </p>
    </div>
  );
}

/*
 * ============================================================
 * MODAL — RESULTADO DA ANÁLISE
 * ============================================================
 */

function AnalysisResultModal({
  busy,
  error,
  request,
  analysis,
  onClose,
  onConfirm,
}) {
  const [
    result,
    setResult,
  ] = useState(
    "quote-ready",
  );

  const [
    pendingInformation,
    setPendingInformation,
  ] = useState(
    analysis.pendingInformation ??
      "",
  );

  const [
    decisionReason,
    setDecisionReason,
  ] = useState(
    analysis.decisionReason ??
      "",
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
        "Ainda existem dados ou documentos que precisam ser confirmados antes da elaboração do orçamento.",
    },

    {
      value:
        "rejected",

      title:
        "Recusar solicitação",

      description:
        "A demanda não seguirá para orçamento após a avaliação técnica.",
    },
  ];

  const validation = validateRequestAnalysis({ ...analysis, pendingInformation, decisionReason }, result);

  function handleConfirm() {
    if (busy || !validation.isValid) return;
    onConfirm({
      result,

      technicalSummary:
        analysis.summary,

      pendingInformation:
        result ===
        "waiting-information"
          ? pendingInformation
          : "",

      decisionReason:
        result ===
        "rejected"
          ? decisionReason
          : "",
    });
  }

  return (
    <ModalShell>
      <p className="internal-section-eyebrow">
        Análise técnica
      </p>

      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#17394f]">
        Concluir análise
      </h2>

      <p className="mt-2 internal-help-text leading-5">
        Defina o resultado técnico da solicitação{" "}
        <strong className="font-semibold text-[#31566d]">
          {request.id}
        </strong>
        .
      </p>

      <div className="mt-5 space-y-2">
        {options.map(
          (
            option,
          ) => {
            const active =
              result ===
              option.value;

            return (
              <button
                key={
                  option.value
                }
                type="button"
                disabled={busy}
                onClick={() =>
                  setResult(
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
                      flex
                      h-5
                      w-5
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
                    <p className="text-[14px] font-semibold text-[#31566d]">
                      {option.title}
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-[#617987]">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          },
        )}
      </div>

      {result ===
        "waiting-information" && (
        <div className="mt-5">
          <label className="internal-field-label">
            Informações pendentes *
          </label>

          <textarea
            aria-label="Informações pendentes"
            required
            disabled={busy}
            aria-invalid={validation.issues.some(issue => issue.field === "pendingInformation")}
            rows={4}
            value={
              pendingInformation
            }
            onChange={(
              event,
            ) =>
              setPendingInformation(
                event.target.value,
              )
            }
            placeholder="Informe o que ainda precisa ser recebido ou confirmado."
            className="internal-input mt-2 w-full resize-y"
          />
        </div>
      )}

      {result ===
        "rejected" && (
        <div className="mt-5">
          <label className="internal-field-label">
            Motivo técnico da recusa *
          </label>

          <textarea
            aria-label="Motivo técnico da recusa"
            required
            disabled={busy}
            aria-invalid={validation.issues.some(issue => issue.field === "decisionReason")}
            rows={4}
            value={
              decisionReason
            }
            onChange={(
              event,
            ) =>
              setDecisionReason(
                event.target.value,
              )
            }
            placeholder="Explique por que a solicitação não seguirá para orçamento."
            className="internal-input mt-2 w-full resize-y"
          />
        </div>
      )}

      <div className="mt-5"><ValidationFeedback validation={validation} title="Requisitos do resultado" /></div>
      {error && <p role="alert" className="mt-3 text-[#9a5947]">{error}</p>}
      <ModalActions
        busy={busy}
        confirmDisabled={!validation.isValid}
        cancelLabel="Voltar"
        confirmLabel="Confirmar resultado"
        onCancel={
          onClose
        }
        onConfirm={
          handleConfirm
        }
      />
    </ModalShell>
  );
}

/*
 * ============================================================
 * MODAL — CONFIRMAÇÃO GENÉRICA
 * ============================================================
 */

function ConfirmationModal({
  busy,
  error,
  eyebrow,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}) {
  return (
    <ModalShell
      maxWidth="max-w-[500px]"
    >
      <p className="internal-section-eyebrow">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#17394f]">
        {title}
      </h2>

      <p className="mt-3 internal-help-text leading-6">
        {description}
      </p>
      {error && <p role="alert" className="mt-3 text-[#9a5947]">{error}</p>}

      <ModalActions
        busy={busy}
        cancelLabel="Cancelar"
        confirmLabel={
          confirmLabel
        }
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

/*
 * ============================================================
 * MODAL — CANCELAMENTO
 * ============================================================
 */

function CancelRequestModal({
  busy,
  error,
  onClose,
  onConfirm,
}) {
  const [
    reason,
    setReason,
  ] = useState("");

  return (
    <ModalShell
      maxWidth="max-w-[500px]"
    >
      <p className="internal-section-eyebrow">
        Encerrar solicitação
      </p>

      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#17394f]">
        Cancelar solicitação?
      </h2>

      <p className="mt-3 internal-help-text leading-6">
        O cancelamento encerra o fluxo desta solicitação e permanece registrado
        no histórico para rastreabilidade.
      </p>

      <div className="mt-5">
        <label className="internal-field-label">
          Motivo do cancelamento
        </label>

        <textarea
          aria-label="Motivo do cancelamento"
          required
          disabled={busy}
          rows={4}
          value={
            reason
          }
          onChange={(
            event,
          ) =>
            setReason(
              event.target.value,
            )
          }
          placeholder="Registre o motivo do cancelamento..."
          className="internal-input mt-2 w-full resize-y"
        />
      </div>

      <ModalActions
        busy={busy}
        confirmDisabled={!reason.trim()}
        cancelLabel="Voltar"
        confirmLabel="Cancelar solicitação"
        danger
        onCancel={
          onClose
        }
        onConfirm={() =>
          onConfirm(
            reason,
          )
        }
      />
      {error && <p role="alert" className="mt-3 text-[#9a5947]">{error}</p>}
    </ModalShell>
  );
}

/*
 * ============================================================
 * ESTRUTURA DOS MODAIS
 * ============================================================
 */

function ModalShell({
  children,
  maxWidth = "max-w-[620px]",
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071f2d]/45 px-4 py-8 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        className={`
          w-full
          ${maxWidth}
          max-h-[calc(100vh-64px)]
          overflow-y-auto
          rounded-[22px]
          border border-[#cbdbe3]
          bg-white
          p-6
          shadow-[0_28px_80px_rgba(7,31,45,0.22)]
        `}
      >
        {children}
      </div>
    </div>
  );
}

function ModalActions({
  busy = false,
  confirmDisabled = false,
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
        disabled={busy}
        className="internal-secondary-button px-5 py-3"
      >
        {cancelLabel}
      </button>

      <button
        type="button"
        onClick={
          onConfirm
        }
        disabled={busy || confirmDisabled}
        className={`
          rounded-[11px]
          px-5
          py-3
          text-[11px]
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
        {busy ? "Salvando..." : confirmLabel}
      </button>
    </div>
  );
}

/*
 * ============================================================
 * OUTROS COMPONENTES
 * ============================================================
 */

function EmptyBlock({
  text,
}) {
  return (
    <div className="rounded-[14px] border border-dashed border-[#ccdbe2] bg-[#f8fafb] px-5 py-8 text-center">
      <p className="internal-help-text">
        {text}
      </p>
    </div>
  );
}

/*
 * ============================================================
 * HELPERS — REQUISITOS
 * ============================================================
 */

const REQUIREMENT_LABELS = {
  dimensions:
    "Dimensões",

  geometry:
    "Geometria",

  tolerances:
    "Tolerâncias",

  drawing:
    "Comparação com desenho",

  cad:
    "Comparação com CAD",

  other:
    "Outro",

  model:
    "Modelo 3D",

  cadComparison:
    "Comparação com CAD",

  documentation:
    "Documentação da geometria",

  reverseBase:
    "Base para engenharia reversa",

  surfaces:
    "Superfícies",

  reconstruction:
    "Reconstrução geométrica",

  modification:
    "Modificação do projeto",

  unknown:
    "Não sei",

  structure:
    "Estrutura interna",

  defects:
    "Defeitos internos",

  cavities:
    "Cavidades",

  assembly:
    "Montagem",

  discontinuities:
    "Descontinuidades",
};

function normalizeRequirementArray(
  values,
) {
  if (
    !Array.isArray(
      values,
    )
  ) {
    return [];
  }

  return values
    .map(
      (value) =>
        String(
          value ?? "",
        ).trim(),
    )
    .filter(
      Boolean,
    );
}

function formatRequirementValue(
  value,
) {
  const normalized =
    String(
      value ?? "",
    ).trim();

  if (!normalized) {
    return "Não informado";
  }

  return (
    REQUIREMENT_LABELS[
      normalized
    ] ??
    normalized
  );
}

function formatReverseRequirementValue(
  value,
) {
  const normalized =
    String(
      value ?? "",
    ).trim();

  if (!normalized) {
    return "Não informado";
  }

  if (
    normalized === "cad"
  ) {
    return "Modelo CAD";
  }

  if (
    normalized === "unknown"
  ) {
    return "Ainda não sei";
  }

  return formatRequirementValue(
    normalized,
  );
}

function formatMovableValue(
  value,
) {
  switch (
    value
  ) {
    case "yes":
      return "Sim";

    case "no":
      return "Não";

    case "partial":
      return "Parcialmente";

    default:
      return value;
  }
}

function formatSurroundingAccessValue(
  value,
) {
  switch (
    value
  ) {
    case "yes":
      return "Sim";

    case "partial":
      return "Parcial";

    case "unknown":
      return "Não sei";

    default:
      return value;
  }
}

/*
 * ============================================================
 * FORMULÁRIO INICIAL DA ANÁLISE
 * ============================================================
 */

function createAnalysisForm(
  request,
) {
  const analysis =
    request?.analysis ??
    {};

  return {
    service:
      normalizeServiceId(
        analysis.service ??
          analysis.recommendedService ??
          request?.service ??
          "",
      ),

    complexity:
      analysis.complexity ??
      "",

    technology:
      analysis.technology ??
      analysis.recommendedEquipment ??
      "",

    technicalResponsible:
      analysis.technicalResponsible ??
      analysis.responsible ??
      request?.responsible ??
      "",

    summary:
      analysis.summary ??
      analysis.technicalSummary ??
      "",

    pendingInformation:
      analysis.pendingInformation ??
      "",

    decisionReason:
      analysis.decisionReason ??
      "",
  };
}

