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
  startRequestAnalysis,
} from "../../services/requestService";

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
    feedback,
    setFeedback,
  ] = useState("");

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
          className="text-xs font-semibold text-[#356f9f]"
        >
          ← Voltar para solicitações
        </button>

        <div className="mt-6 rounded-[22px] border border-[#d1dde4] bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-[#17394f]">
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

  /*
   * ========================================================
   * INICIAR ANÁLISE
   * ========================================================
   */

  function handleStartAnalysis() {
    try {
      const updated =
        startRequestAnalysis(
          request.id,
          currentUser,
        );

      setRequest(
        updated,
      );

      showFeedback(
        "Análise iniciada.",
      );
    } catch (error) {
      showFeedback(
        error.message,
      );
    }
  }

  /*
   * ========================================================
   * RETOMAR ANÁLISE
   * ========================================================
   */

  function handleResumeAnalysis() {
    try {
      const updated =
        resumeRequestAnalysis(
          request.id,
          currentUser,
        );

      setRequest(
        updated,
      );

      showFeedback(
        "Solicitação retomada para análise.",
      );
    } catch (error) {
      showFeedback(
        error.message,
      );
    }
  }

  /*
   * ========================================================
   * CONCLUIR ANÁLISE
   * ========================================================
   */

  function handleFinishAnalysis(
    result,
  ) {
    try {
      const updated =
        finishRequestAnalysis(
          request.id,
          result,
          currentUser,
        );

      setRequest(
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
      );
    }
  }

  /*
   * ========================================================
   * ORÇAMENTO
   * ========================================================
   */

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

      setRequest(
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
      );
    }
  }

  /*
   * ========================================================
   * OBSERVAÇÕES
   * ========================================================
   */

  function handleSaveNotes() {
    try {
      const updated =
        saveRequestInternalNotes(
          request.id,
          internalNotes,
          currentUser,
        );

      setRequest(
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
      );
    }
  }

  /*
   * ========================================================
   * CANCELAMENTO
   * ========================================================
   */

  function handleCancelRequest() {
    try {
      const updated =
        cancelRuntimeRequest(
          request.id,
          currentUser,
        );

      setRequest(
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
      );
    }
  }

  function showFeedback(
    message,
  ) {
    setFeedback(
      message,
    );

    window.setTimeout(
      () =>
        setFeedback(""),
      2600,
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/solicitacoes",
            )
          }
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5681a0] transition hover:text-[#0b2340]"
        >
          ← Voltar para solicitações
        </button>

        <InternalPageHeader
          eyebrow={`${request.origin} · ${request.id}`}
          title={
            request.company
          }
          description={
            request.objective
          }
          action={
            <StatusBadge
              status={
                request.status
              }
            />
          }
        />

        {feedback && (
          <div className="mt-5 flex items-center gap-3 rounded-[14px] border border-[#bfd7c8] bg-[#edf7f1] px-4 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-[#397250]">
              ✓
            </span>

            <p className="text-xs font-semibold text-[#397250]">
              {feedback}
            </p>
          </div>
        )}

        <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            {/* =================================================
                VISÃO GERAL
            ================================================= */}

            <RequestDetailSection
              eyebrow="01"
              title="Visão geral"
              description="Informações principais recebidas na solicitação."
            >
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <RequestInfoItem
                  label="Cliente"
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
                  label="Origem"
                  value={
                    request.origin
                  }
                />

                <RequestInfoItem
                  label="Recebida em"
                  value={
                    request.createdAt
                  }
                />
              </div>

              <div className="mt-6 border-t border-[#e5ebef] pt-5">
                <RequestInfoItem
                  label="Objetivo do projeto"
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

            {/* =================================================
                PEÇAS
            ================================================= */}

            <RequestDetailSection
              eyebrow="02"
              title="Peças do projeto"
              description="Componentes associados à solicitação e suas principais características."
            >
              {request.piecesData
                .length > 0 ? (
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

            {/* =================================================
                CONFIGURADOR
            ================================================= */}

            {request.origin ===
              "Configurador" && (
              <RequestDetailSection
                eyebrow="03"
                title="Orientação do configurador"
                description="Resultado preliminar construído a partir das respostas fornecidas pelo cliente."
              >
                {request.piecesData.some(
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
                  <EmptyBlock text="Esta solicitação veio do configurador, mas ainda não possui uma recomendação técnica estruturada disponível." />
                )}
              </RequestDetailSection>
            )}

            {/* =================================================
                ARQUIVOS
            ================================================= */}

            <RequestDetailSection
              eyebrow={
                request.origin ===
                "Configurador"
                  ? "04"
                  : "03"
              }
              title="Arquivos"
              description="Documentos e referências enviados junto à solicitação."
            >
              {request.attachments
                .length > 0 ? (
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

            {/* =================================================
                HISTÓRICO
            ================================================= */}

            <RequestDetailSection
              eyebrow={
                request.origin ===
                "Configurador"
                  ? "05"
                  : "04"
              }
              title="Histórico"
              description="Registro das principais movimentações desta solicitação."
            >
              {request.history
                .length > 0 ? (
                <div className="space-y-0">
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

          {/* ===================================================
              SIDEBAR
          =================================================== */}

          <aside className="space-y-5">
            <section className="rounded-[22px] border border-[#c6d9e3] bg-[#e6f0f5] p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
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
                  label="Peças"
                  value={`${request.parts}`}
                />
              </div>

              <div className="mt-6 border-t border-[#c9dbe4] pt-5">
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
                    className="mt-2 w-full rounded-[11px] border border-[#dfc7c0] bg-white px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#9a5947] transition hover:bg-[#faf2ef]"
                  >
                    Cancelar solicitação
                  </button>
                )}
              </div>
            </section>

            {/* =================================================
                ORÇAMENTO VINCULADO
            ================================================= */}

            {existingQuote && (
              <section className="rounded-[22px] border border-[#bcd6e3] bg-[#edf6fa] p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
                  Orçamento vinculado
                </p>

                <p className="mt-3 text-lg font-semibold text-[#17394f]">
                  {
                    existingQuote.id
                  }
                </p>

                <p className="mt-1 text-xs leading-5 text-[#708795]">
                  Esta solicitação já possui um orçamento associado.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/portal/orcamentos/${existingQuote.id}`,
                    )
                  }
                  className="mt-4 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#356f9f]"
                >
                  Abrir orçamento →
                </button>
              </section>
            )}

            {/* =================================================
                OBSERVAÇÕES
            ================================================= */}

            <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718895]">
                Observações internas
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
                placeholder="Adicione observações visíveis apenas para a equipe interna..."
                className="
                  mt-4
                  w-full
                  resize-y
                  rounded-[13px]
                  border border-[#d5e0e6]
                  bg-[#f8fafb]
                  px-4 py-3
                  text-xs leading-5
                  text-[#294e64]
                  outline-none
                  transition
                  placeholder:text-[#9aa8b1]
                  focus:border-[#78a9c4]
                  focus:bg-white
                "
              />

              <button
                type="button"
                onClick={
                  handleSaveNotes
                }
                className="mt-3 w-full rounded-[11px] border border-[#cbd9e1] bg-[#f5f9fb] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.09em] text-[#536f80] transition hover:border-[#9fbccc] hover:bg-white"
              >
                Salvar observação
              </button>
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

/*
 * ============================================================
 * AÇÃO PRINCIPAL
 * ============================================================
 */

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
      className="w-full rounded-[12px] bg-[#096ab2] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-white transition hover:bg-[#075b99]"
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

/*
 * ============================================================
 * MODAL — RESULTADO DA ANÁLISE
 * ============================================================
 */

function AnalysisResultModal({
  request,
  onCancel,
  onConfirm,
}) {
  const [
    selected,
    setSelected,
  ] = useState(
    "quote-ready",
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#071a2b]/50 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-[560px] rounded-[24px] border border-white/30 bg-white p-6 shadow-[0_35px_100px_rgba(7,26,43,0.25)] sm:p-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
          Análise técnica
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#17394f]">
          Concluir análise da solicitação
        </h2>

        <p className="mt-2 text-xs leading-5 text-[#718795]">
          Defina o próximo passo para{" "}
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
                      <p className="text-xs font-semibold text-[#31566d]">
                        {
                          option.title
                        }
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-[#81939d]">
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
            onClick={() =>
              onConfirm(
                selected,
              )
            }
            className="rounded-[11px] bg-[#096ab2] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
          >
            Confirmar resultado
          </button>
        </div>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * MODAL — CRIAR ORÇAMENTO
 * ============================================================
 */

function QuoteCreationModal({
  request,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071a2b]/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[480px] rounded-[24px] border border-white/40 bg-white p-6 shadow-[0_30px_90px_rgba(7,26,43,0.22)] sm:p-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
          Novo orçamento
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#17394f]">
          Criar orçamento a partir desta solicitação?
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#708795]">
          Os dados de{" "}
          <strong className="font-semibold text-[#31566d]">
            {request.company}
          </strong>{" "}
          e o vínculo com{" "}
          <strong className="font-semibold text-[#31566d]">
            {request.id}
          </strong>{" "}
          serão utilizados para iniciar o orçamento.
        </p>

        <div className="mt-5 rounded-[14px] border border-[#d7e4ea] bg-[#f5f9fb] p-4">
          <p className="text-[10px] font-semibold text-[#31566d]">
            {request.service}
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#7c909b]">
            O orçamento será criado como “Em elaboração”.
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
            className="rounded-[11px] bg-[#096ab2] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#075b99]"
          >
            Criar e continuar
          </button>
        </div>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * MODAL — CANCELAMENTO
 * ============================================================
 */

function CancelRequestModal({
  request,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#071a2b]/50 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-[460px] rounded-[24px] border border-white/30 bg-white p-6 shadow-[0_35px_100px_rgba(7,26,43,0.25)]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9a5947]">
          Encerrar solicitação
        </p>

        <h2 className="mt-2 text-xl font-semibold text-[#17394f]">
          Cancelar {request.id}?
        </h2>

        <p className="mt-3 text-xs leading-5 text-[#718795]">
          A solicitação será encerrada e deixará de aparecer como item ativo no fluxo.
        </p>

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
            onClick={
              onConfirm
            }
            className="rounded-[11px] bg-[#9a5947] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
          >
            Confirmar cancelamento
          </button>
        </div>
      </div>
    </div>
  );
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
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#d9e3e8] bg-[#f8fafb]">
      <div className="flex flex-col gap-3 border-b border-[#e0e7eb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5681a0]">
            Peça{" "}
            {String(
              index + 1,
            ).padStart(
              2,
              "0",
            )}
          </p>

          <h3 className="mt-1 text-base font-semibold text-[#17394f]">
            {piece.name}
          </h3>
        </div>

        <span className="w-fit rounded-full border border-[#d2e1e8] bg-white px-3 py-1.5 text-[9px] font-semibold text-[#536f80]">
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
          value={piece.type}
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
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7a8f9a]">
            Serviços
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {piece.services.map(
              (service) => (
                <span
                  key={
                    service
                  }
                  className="rounded-full border border-[#cbdde7] bg-[#eaf4f9] px-3 py-1.5 text-[9px] font-semibold text-[#3e708e]"
                >
                  {service}
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
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7a8f9a]">
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

/*
 * ============================================================
 * RECOMENDAÇÃO
 * ============================================================
 */

function RecommendationCard({
  piece,
  index,
}) {
  const recommendation =
    piece.recommendation;

  return (
    <div className="rounded-[18px] border border-[#c8dce6] bg-[#edf6fa] p-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5681a0]">
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
        <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#718895]">
          Tecnologia principal
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#17394f]">
              {
                recommendation
                  .primaryMachine
                  .name
              }
            </h3>

            <p className="mt-1 text-xs text-[#567487]">
              {
                recommendation
                  .primaryMachine
                  .match
              }
            </p>
          </div>

          <span className="text-2xl font-semibold text-[#096ab2]">
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
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#718895]">
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
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#718895]">
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
                  className="flex items-center justify-between rounded-[11px] border border-[#d4e2e9] bg-white/70 px-3 py-2.5"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#3b5d71]">
                      {
                        alternative.name
                      }
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#84949e]">
                      {
                        alternative.match
                      }
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#5681a0]">
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

      <p className="mt-4 text-[10px] leading-5 text-[#748995]">
        A recomendação é preliminar e deve ser validada pela equipe técnica antes da definição do atendimento.
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
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-[14px] border border-[#d9e3e8] bg-[#f8fafb] px-4 py-4 text-left transition hover:border-[#a8c5d4] hover:bg-white"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#ccdde6] bg-white text-xs text-[#5681a0]">
        ↓
      </span>

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-[#31566d]">
          {file.name}
        </p>

        <p className="mt-1 text-[9px] uppercase tracking-[0.07em] text-[#84949e]">
          {file.type} ·{" "}
          {file.size}
        </p>
      </div>
    </button>
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

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bfd5e1] bg-[#edf6fa] text-[9px] text-[#5681a0]">
        ✓
      </div>

      <div className="pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold text-[#31566d]">
            {item.action}
          </p>

          <span className="text-[9px] text-[#8c9ba4]">
            {item.date} ·{" "}
            {item.time}
          </span>
        </div>

        <p className="mt-1 text-[10px] font-medium text-[#708795]">
          por {item.actor}
        </p>

        <p className="mt-2 text-xs leading-5 text-[#768b97]">
          {
            item.description
          }
        </p>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * AUXILIARES
 * ============================================================
 */

function SideInfo({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#718895]">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-[#31566d]">
        {value}
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

      <p className="text-[11px] leading-5 text-[#647d8b]">
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
      <p className="text-xs leading-5 text-[#7c909b]">
        {text}
      </p>
    </div>
  );
}