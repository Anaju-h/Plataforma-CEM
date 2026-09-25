import { getCurrentUser } from "../../services/currentUserService";
import { DemoBadge } from "../../components/internal/DemoBadge";
import { getQuoteEquipmentRequirement, requiresQuoteEquipment } from "../../data/serviceCatalog";
import { canCreateProject, createProjectFromQuote } from "../../services/projectService";
import { getQuotePieces } from "../../services/quotePieceService";
import { getAcceptedProposalVersion } from "../../services/proposalService";
import { useQuote } from "../../hooks/useQuote";
import { ApiState } from "../../components/internal/ApiState";
import "../../styles/internalWorkspace.css";
import { ValidationFeedback, FieldIssue } from "../../components/internal/ValidationFeedback";
import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import {
  QuoteStatusBadge,
} from "../../components/internal/QuoteStatusBadge";
import { QuoteItemsEditor } from "../../components/internal/QuoteItemsEditor";
import { calculateQuoteItemTotals } from "../../services/quoteItemService";

import {
  RequestDetailSection,
  RequestInfoItem,
} from "../../components/internal/RequestDetailSection";

import {
  approveQuoteInternally,
  cancelQuote,
  getQuoteKnowledgeSupport,


  returnQuoteToEditing,
  sendQuoteToReview,
  updateQuote,
  validateQuoteForReview,
  isQuoteEditable,
} from "../../services/quoteService";


import {
  buildPricingInsights,
  calculateTechnicalReference,
  getCommercialReference,
} from "../../services/pricingService";

import {
  getAllMachineCostKnowledge,
} from "../../data/internal/pricingKnowledge";

const labelClasses = "internal-field-label font-semibold text-[#607989]";

export function QuoteDetailPage() {
  const { quoteId } = useParams();
  const { quote, loading, error, retry } = useQuote(quoteId);
  if (loading || error) return <ApiState title={quoteId} loading="Carregando orçamento..." error={error} onRetry={retry} />;
  return <QuoteEditor key={quoteId} initialQuote={quote} />;
}
function QuoteEditor({ initialQuote }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
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

  const linkedProject = quote.projectId ? { id: quote.projectId } : null;

  async function handleCreateProject() {
    if (busy) return;
    if (linkedProject) { navigate(`/portal/projetos/${linkedProject.id}`); return; }
    if (!canCreateProject(quote)) return;
    setBusy(true);
    try {
      const project = await createProjectFromQuote(quote);
      setQuote(value => ({ ...value, projectId: project.id, convertedToProject: true }));
      navigate(`/portal/projetos/${project.id}`);
    } catch (error) { showFeedback(error.message, "error"); }
    finally { setBusy(false); }
  }

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

  const [items, setItems] = useState(initialQuote?.items ?? []);
  const { technicalHours, billableHours, hourlyRate, proposedValue: commercialTotal } = calculateQuoteItemTotals(items);
  const itemTechnicalCost = useMemo(() => {
    if (!items.length) return null;
    const references = items.map(item => item.technicalHours == null || item.technicalHours === ""
      ? null : calculateTechnicalReference(item));
    if (references.some(reference => !reference)) return null;
    return references.reduce((total, reference) => total + reference.estimatedCost, 0);
  }, [items]);

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

  const pricingContext = useMemo(() => ({
    technicalReference: calculateTechnicalReference({ machineId, technicalHours: 0 }),
    insights: items.filter(item => !item.isDemoCompatibility).flatMap((item, index) => buildPricingInsights({
      machineId: item.machineId,
      technicalHours: item.technicalHours,
      billableHours: item.quotedHours,
      hourlyRate: item.hourlyRate,
    }).insights.map(insight => ({ ...insight, title: `Item ${index + 1}: ${insight.title}` }))),
  }), [items, machineId]);

  if (
    !quote
  ) {
    return (
      <div className="internal-workspace mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/orcamentos",
            )
          }
          className="text-[13px] font-semibold text-[#356f9f]"
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

  const isEditable = isQuoteEditable(quote);
  const equipmentRequired = requiresQuoteEquipment({ ...quote, items });
  const equipmentNotApplicable = getQuoteEquipmentRequirement({ ...quote, items }) === "NOT_APPLICABLE";

  const reviewValidation = validateQuoteForReview({ ...quote, items, scope, machineId, deadlineDays, validityDays, estimateJustification });
  const fieldIssue = field => isEditable && <FieldIssue issues={reviewValidation.issues} field={field} />;
  const invalid = field => isEditable && reviewValidation.issues.some(issue => issue.field === field);

  async function saveQuote(
    showMessage = true,
  ) {
    if (
      !isEditable
    ) {
      return quote;
    }

    if (equipmentRequired && !machineId) throw new Error("Selecione a tecnologia de referência obrigatória.");
    const updatedQuote =
      await updateQuote(
        quote,
        {
          items,
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

          internalCost: itemTechnicalCost,

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
    setItems(updatedQuote.items);

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

  async function handleSendToReview() {
    if (busy) return;
    setBusy(true);
    try {
      const saved = await saveQuote(
        false,
      );

      const updatedQuote =
        await sendQuoteToReview(
          saved,
          getCurrentUser().name,
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
    } finally { setBusy(false); }
  }

  async function handleApprove() {
    if (busy) return;
    setBusy(true);
    try {
      const updatedQuote =
        await approveQuoteInternally(
          quote,
          getCurrentUser().name,
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
    } finally { setBusy(false); }
  }

  async function handleReturnToEditing() {
    if (busy) return;
    setBusy(true);
    try {
      const updatedQuote =
        await returnQuoteToEditing(
          quote,
          getCurrentUser().name,
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
    } finally { setBusy(false); }
  }

  function handleGenerateProposal() {
    navigate(`/portal/orcamentos/${quote.id}/proposta`);
  }

  async function handleCancel() {
    if (busy) return;
    setBusy(true);
    try {
      const updatedQuote =
        await cancelQuote(
          quote,
          getCurrentUser().name,
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
    } finally { setBusy(false); }
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
      <div className="internal-workspace mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/orcamentos",
            )
          }
          className="mb-5 internal-field-label font-semibold uppercase tracking-[0.1em] text-[#5681a0] transition hover:text-[#0b2340]"
        >
          ← Voltar para orçamentos
        </button>

        <InternalPageHeader
          eyebrow={`${quote.requestId} · ${quote.id}`}
          title={
            quote.company
          }
          description={quote.service || "Orçamento vinculado à solicitação."}
          action={
            <div className="flex flex-wrap items-center gap-2">{quote.demo && <DemoBadge />}

              <QuoteStatusBadge
                status={
                  quote.status
                }
              />

              {/* Aplicar: o Assistente de Orçamento consulta casos parecidos e registra o bloco A vinculado a este ORC. */}
              <Link
                to={`/portal/conhecimento/assistente?orc=${encodeURIComponent(quote.id)}`}
                className="rounded-[12px] border border-[#b9cfdc] bg-white px-4 py-3 internal-field-label font-semibold uppercase tracking-[0.1em] text-[#12364e] transition hover:border-[#7fa6bd]"
              >
                Assistente de orçamento
              </Link>

              {isEditable && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    if (busy) return;
                    setBusy(true);
                    try { await saveQuote(); }
                    catch (error) { showFeedback(error.message, "error"); }
                    finally { setBusy(false); }
                  }}
                  className="rounded-[12px] bg-[#12364e] px-5 py-3 internal-field-label font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#0d2d41]"
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

        {!isEditable &&
          ![
            "Aceito",
            "Recusado",
            "Cancelado",
          ].includes(
            quote.status,
          ) && (
            <div className="mt-5 rounded-[14px] border border-[#cadce6] bg-[#edf5f9] px-4 py-3">
              <p className="internal-body leading-5 text-[#58788b]">
                Os dados da estimativa e as condições comerciais estão bloqueados nesta etapa. Para alterá-los, o orçamento deve retornar para elaboração.
              </p>
            </div>
          )}

        <fieldset disabled={busy} className="internal-workspace-columns mt-6 grid min-w-0 items-start gap-6 border-0 p-0 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.85fr)]"><div className="flex min-w-0 flex-col gap-5">
            <RequestDetailSection title="Dados e escopo do orçamento" description="* Obrigatório para revisão. Informações técnicas permanecem internas.">
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <RequestInfoItem label="Serviço" value={quote.service} />
                <RequestInfoItem label="Contato" value={quote.contact} />
              </div>
              <label className={labelClasses}>Escopo técnico *
                <textarea value={scope} disabled={!isEditable} onChange={event => setScope(event.target.value)} rows={3} aria-invalid={invalid("scope")} className={getTextareaClasses(!isEditable)} />
                {fieldIssue("scope")}
              </label>
              <div className="mt-4 grid items-start gap-4 2xl:grid-cols-2"><label className="block"><span className={labelClasses}>Tecnologia de referência{equipmentRequired ? " *" : ""}</span>
                <select value={machineId} disabled={!isEditable || equipmentNotApplicable} aria-invalid={invalid("machineId")} onChange={event => setMachineId(event.target.value)} className={getInputClasses(!isEditable) + " mt-2"}>
                  <option value="">{equipmentRequired ? "Selecionar tecnologia" : equipmentNotApplicable ? "Não se aplica" : "Sem equipamento específico / Não se aplica"}</option>{machines.map(machine => <option key={machine.id} value={machine.id}>{machine.name}{machine.local ? "" : " · Outra unidade"}</option>)}
                </select>{fieldIssue("machineId")}
              </label>
              <label className="block"><span className={labelClasses}>Justificativa técnica da estimativa *</span>
                <p className="internal-help-text mt-1 text-[#607989]">Premissas internas de horas e tecnologia.</p>
                <textarea value={estimateJustification} disabled={!isEditable} onChange={event => setEstimateJustification(event.target.value)} rows={2} aria-invalid={invalid("estimateJustification")} className={getTextareaClasses(!isEditable)} />
                {fieldIssue("estimateJustification")}
              </label></div>
            </RequestDetailSection>
          

            <QuoteItemsEditor pieces={getQuotePieces(quote)} legacyEstimate={quote.legacyEstimate} items={items} onChange={setItems} isEditable={isEditable} machines={machines} />
          

            <RequestDetailSection title="Condições comerciais" description="Informações comerciais do orçamento.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><NumberInput label="Validade da proposta *" value={validityDays} onChange={setValidityDays} suffix="dias" disabled={!isEditable} invalid={invalid("validityDays")} />{fieldIssue("validityDays")}</div>
                <div><NumberInput label="Prazo de execução *" value={deadlineDays} onChange={setDeadlineDays} suffix="dias" disabled={!isEditable} invalid={invalid("deadlineDays")} />{fieldIssue("deadlineDays")}</div>
              </div>
              <label className="mt-4 block"><span className={labelClasses}>Observações comerciais</span><textarea value={commercialNotes} disabled={!isEditable} onChange={event => setCommercialNotes(event.target.value)} rows={4} className={getTextareaClasses(!isEditable)} /></label>
            </RequestDetailSection>
            <RequestDetailSection title={isEditable ? "Prontidão para revisão" : "Revisão"} description={isEditable ? "Resolva as pendências para enviar o orçamento à revisão." : quote.status}>
              {isEditable ? <ValidationFeedback validation={reviewValidation} title="Pendências para revisão" /> : <p className="internal-help-text text-[#607989]">{linkedProject ? "Orçamento convertido em " + linkedProject.id + ". O registro permanece disponível no Histórico." : "Os dados desta etapa são preservados para consulta e rastreabilidade."}</p>}
            </RequestDetailSection>
            <RequestDetailSection title="Histórico do orçamento" description="Movimentações do processo e registros da estimativa enviada para revisão.">
              <p className="internal-help-text mb-4 text-[#607989]">{quote.history?.filter(item => item.action === "Status: Em revisão").length ?? 0} envio(s) registrado(s) para revisão.</p>
              {quote.history?.length ? quote.history.map((item, index) => <QuoteHistoryItem key={item.id ?? index} item={item} last={index === quote.history.length - 1} />) : <EmptyBlock text="Nenhuma movimentação registrada." />}
              <button type="button" className="internal-help-text mt-3 font-semibold text-[#096ab2]" onClick={() => navigate("/portal/historico")}>Consultar histórico operacional →</button>
            </RequestDetailSection>
          </div><aside className="flex min-w-0 flex-col gap-5">
            <RequestDetailSection title="Controle do ORC" description="Vínculo com a solicitação original.">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <ControlInfo label="Solicitação" value={quote.requestId} />
                <ControlInfo label="Origem" value={quote.requestOrigin || "Não informada"} />
                <ControlInfo label="Canal" value={quote.requestChannel || "Não informado"} />
                <ControlInfo label="Status" value={quote.status} /><ControlInfo label="Criado em" value={quote.createdAt} /><ControlInfo label="Atualizado em" value={quote.updatedAt} />
                <ControlInfo label="Responsável" value={quote.responsible || "Não informado"} />
              </div>
              <button type="button" onClick={() => navigate('/portal/solicitacoes/' + quote.requestId)} className="internal-help-text mt-4 font-semibold text-[#096ab2]">Consultar solicitação original →</button>
            </RequestDetailSection>
          

            <RequestDetailSection title="Resumo comercial" description="Composição comercial atual.">
              <div className="space-y-4" aria-live="polite">
                <SummaryLine label="Horas cotadas totais" value={billableHours == null ? "Não informadas" : formatNumber(billableHours) + " h"} />
                <SummaryLine label="Itens no orçamento" value={items.length} />
                <SummaryLine label="Referência vigente para novos itens" value={formatCurrency(commercialReference.hourlyRate) + "/h"} />
                <p className="internal-help-text text-[#607989]">Cada item preserva sua referência capturada. O responsável escolhe o valor/hora adotado.</p>
                <div className="border-t border-[#cadbe4] pt-4"><p className={labelClasses}>Valor total do ORC</p><p className="mt-2 text-4xl font-semibold tracking-tight text-[#096ab2]">{formatCurrency(commercialTotal)}</p></div>
              </div>
              <details className="internal-help-text mt-4 border-t border-[#cadbe4] pt-4 text-[#607989]"><summary className="cursor-pointer font-semibold">Referências internas de custo</summary>
                <p className="mt-2">Horas técnicas: {technicalHours == null ? "Não informadas" : formatNumber(technicalHours) + " h"}. Uso interno • não incluído na proposta comercial.</p>
                <p className="mt-2">Custo técnico estimado: {itemTechnicalCost == null ? "Indisponível sem horas e referências válidas." : formatCurrency(itemTechnicalCost)}</p>
                {pricingContext.insights.map((insight, index) => <PricingInsight key={index} insight={insight} />)}
              </details>
            </RequestDetailSection>
            <KnowledgeAssistantPanel knowledge={knowledgeSupport} onOpenKnowledge={() => navigate("/portal/conhecimento")} />
          

            <RequestDetailSection title="Etapa atual" description={quote.status}>
                <div>
                  <QuoteWorkflowActions quote={quote} linkedProject={linkedProject} reviewValidation={reviewValidation} onSendToReview={handleSendToReview} onApprove={handleApprove} onReturnToEditing={handleReturnToEditing} onGenerateProposal={handleGenerateProposal} onCreateProject={handleCreateProject} busy={busy} />
                  {!["Aceito", "Recusado", "Cancelado"].includes(quote.status) && <button type="button" onClick={() => openConfirmation("cancel")} className="internal-help-text mt-3 w-full text-[#9a5947]">Cancelar orçamento</button>}
                </div>
            </RequestDetailSection>
          </aside></fieldset>
      </div>

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

function KnowledgeAssistantPanel({ knowledge, onOpenKnowledge }) {
  if (!knowledge) return null;
  return <RequestDetailSection title="Assistente de orçamento" description="Sugestões explicáveis; a decisão permanece com o responsável.">
    <p className="internal-body text-[#31566d]">Ainda não há casos reais comparáveis suficientes.</p>
    <p className="internal-help-text mt-3 text-[#607989]">Registros formalizados permitirão consultar:</p>
    <ul className="internal-help-text mt-2 list-disc space-y-1 pl-5 text-[#607989]"><li>Casos semelhantes e horas históricas</li><li>Desvios entre cotado e realizado</li><li>Referências comerciais e lições relevantes</li></ul>
    <button type="button" onClick={onOpenKnowledge} className="internal-help-text mt-4 font-semibold text-[#096ab2]">Gestão do conhecimento →</button>
  </RequestDetailSection>;
}

export function QuoteWorkflowActions({ reviewValidation, quote, linkedProject, onCreateProject, busy, onSendToReview, onApprove, onReturnToEditing, onGenerateProposal }) {
  const proposal = quote.proposal;
  const accepted = getAcceptedProposalVersion(proposal);
  const latest = proposal?.versions.at(-1);
  const stale = latest && latest.sourceQuoteRevision !== (quote.revision ?? 0);
  return <fieldset disabled={busy} className="min-w-0 border-0 p-0">
    {["Rascunho", "Em elaboração"].includes(quote.status) && <PrimaryButton disabled={!reviewValidation.isValid} onClick={onSendToReview}>Enviar para revisão</PrimaryButton>}
    {stale && <p className="internal-help-text my-3 text-[#806b3d]">PROPOSTA EMITIDA · V{latest.version} foi emitida com uma versão anterior deste orçamento. Alterações atuais não modificam a proposta já emitida. Para apresentar os novos dados, crie uma nova versão.</p>}
    {!accepted && quote.status === "Aprovado internamente" && <SecondaryButton onClick={onReturnToEditing}>Ajustar orçamento</SecondaryButton>}
    {quote.status === "Em revisão" && <><PrimaryButton onClick={onApprove}>Aprovar internamente</PrimaryButton><SecondaryButton onClick={onReturnToEditing}>Solicitar ajustes</SecondaryButton></>}
    {(proposal || quote.status === "Aprovado internamente") && <PrimaryButton onClick={onGenerateProposal}>{proposal ? "ABRIR PROPOSTA" : "MONTAR PROPOSTA"}</PrimaryButton>}
    {accepted && <p>Proposta aceita • {proposal.id} • V{accepted.version}.</p>}
    {(linkedProject || canCreateProject(quote)) && <PrimaryButton onClick={onCreateProject}>{linkedProject ? `Abrir projeto ${linkedProject.id}` : "Criar projeto"}</PrimaryButton>}
    {quote.status === "Recusado" && <ClosedMessage text="Negociação encerrada após recusa do cliente." />}
    {quote.status === "Cancelado" && <ClosedMessage text="Orçamento cancelado." />}
    {busy && <p role="status" className="internal-help-text mt-3">Salvando orçamento...</p>}
  </fieldset>;
}

function PrimaryButton({
  disabled = false,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={
        onClick
      }
      className="disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-[12px] bg-[#096ab2] px-4 py-3 internal-field-label font-semibold uppercase tracking-[0.09em] text-white transition hover:bg-[#075b99]"
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
      className="mt-2 w-full rounded-[12px] border border-[#aac6d5] bg-white px-4 py-3 internal-help-text font-semibold uppercase tracking-[0.09em] text-[#356f9f] transition hover:bg-[#f8fbfc]"
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
      <p className="text-center internal-help-text font-semibold uppercase tracking-[0.07em] text-[#718895]">
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
          internal-field-label
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
          internal-body
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
          className={`internal-help-text font-semibold uppercase tracking-[0.14em] ${
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
            className="rounded-[11px] border border-[#d0dce3] bg-white px-5 py-3 internal-field-label font-semibold uppercase tracking-[0.08em] text-[#607989]"
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
            className={`rounded-[11px] px-5 py-3 internal-field-label font-semibold uppercase tracking-[0.08em] text-white transition disabled:cursor-not-allowed disabled:opacity-45 ${
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


function QuoteHistoryItem({
  item,
  last,
}) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!last && (
        <div className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-[#d5e2e8]" />
      )}

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bfd5e1] bg-[#edf6fa] internal-help-text text-[#5681a0]">
        ✓
      </div>

      <div className="pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-semibold text-[#31566d]">
            {
              item.action
            }
          </p>

          <span className="internal-help-text text-[#8c9ba4]">
            {item.date}
            {item.time
              ? ` · ${item.time}`
              : ""}
          </span>
        </div>

        {item.actor && (
          <p className="mt-1 internal-field-label font-medium text-[#708795]">
            por {
              item.actor
            }
          </p>
        )}

        {item.description && (
          <p className="mt-2 text-[13px] leading-5 text-[#768b97]">
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
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white internal-field-label font-semibold text-[#397392]">
        {attention
          ? "!"
          : "i"}
      </span>

      <div>
        <p className="text-[13px] font-semibold text-[#315d76]">
          {
            insight.title
          }
        </p>

        <p className="mt-1 internal-field-label leading-5 text-[#748995]">
          {
            insight.description
          }
        </p>
      </div>
    </div>
  );
}

function NumberInput({
  invalid = false,
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
          aria-invalid={invalid}
          min="0"
          step="0.5"
          value={
            value ?? ""
          }
          placeholder="Não informadas"
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

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 internal-field-label text-[#84949e]">
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
      <p className="internal-help-text font-semibold uppercase tracking-[0.1em] text-[#718895]">
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
      <p className="internal-help-text font-semibold uppercase tracking-[0.1em] text-[#82949e]">
        {label}
      </p>

      <p className="mt-1 text-[13px] font-semibold text-[#476579]">
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
      <p className="text-[13px] leading-5 text-[#7c909b]">
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
