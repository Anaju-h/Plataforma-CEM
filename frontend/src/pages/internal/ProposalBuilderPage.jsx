import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRuntimeQuoteById } from "../../services/quoteService";
import { createNextProposalDraft, generateProposalVersion, getDraftDocument, getProposalByQuoteId, openProposal, registerProposalResult, saveProposalDraft } from "../../services/proposalService";
import { getPermittedProposalMedia } from "../../services/commercialProposalService";
import { saveExistingProposalPdf } from "../../services/proposalFileService";
import { ProposalPreview } from "../../components/internal/proposal/ProposalPreview";
import { ProposalConfigPanel } from "../../components/internal/proposal/ProposalConfigPanel";
import { ProposalBuilderHeader } from "../../components/internal/proposal/ProposalBuilderHeader";
import { ProposalResultDialog } from "../../components/internal/proposal/ProposalResultDialog";
import "../../styles/proposal.css";

export function ProposalBuilderPage() {
  const { quoteId } = useParams();
  return <Builder key={quoteId} quoteId={quoteId} />;
}
function Builder({ quoteId }) {
  const [proposal, setProposal] = useState(() => {
    try { return getProposalByQuoteId(quoteId) ?? openProposal(quoteId); } catch { return null; }
  });
  const [selected, setSelected] = useState(proposal?.draft ? "draft" : proposal?.versions.at(-1)?.version);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [measurement, setMeasurement] = useState(null);
  const quote = getRuntimeQuoteById(quoteId);
  const document = useMemo(() => {
    if (!proposal) return null;
    return selected === "draft" ? getDraftDocument(quoteId) : proposal.versions.find(version => version.version === selected);
  }, [proposal, selected, quoteId]);
  if (!proposal || !document) return <div className="proposal-workspace"><Link to={"/portal/orcamentos/" + quoteId}>← Voltar ao ORC</Link><p>Aprove o orçamento internamente antes de montar a proposta.</p></div>;
  const closed = ["Aceito", "Recusado", "Cancelado"].includes(quote.status);
  const editable = !closed && quote.status === "Aprovado internamente" && !busy;
  const draft = selected === "draft" ? proposal.draft : null;
  const overflow = measurement?.document === document && measurement.overflow;
  const configuration = draft ?? { sections: document.snapshot.sections, content: document.snapshot.content, investmentDisplay: document.investmentDisplay, selectedMedia: document.selectedMedia ?? [] };
  const media = draft ? getPermittedProposalMedia(quote) : document.snapshot.media;
  function save(patch) {
    try { setProposal(saveProposalDraft(quoteId, { ...draft, ...patch })); setError(""); } catch (cause) { setError(cause.message); }
  }
  async function run(action) {
    setBusy(true); setError("");
    try { await action(); } catch (cause) { setError(cause.message); } finally { setBusy(false); }
  }
  return <div className="proposal-workspace">
    <ProposalBuilderHeader proposal={proposal} document={document} selected={selected} draft={draft} busy={busy} editable={editable}
      canGenerate={editable && measurement?.document === document && !overflow}
      onSelect={value => { setSelected(value); setShowResult(false); setError(""); }}
      onGenerate={() => run(async () => {
        if (overflow) return;
        const generated = await generateProposalVersion(quoteId);
        if (generated.cancelled) return;
        setProposal(generated.proposal); setSelected(generated.version.version);
      })}
      onDownload={() => run(() => saveExistingProposalPdf(document))}
      onResult={() => setShowResult(true)}
      onNewVersion={() => { try { setProposal(createNextProposalDraft(quoteId)); setSelected("draft"); setShowResult(false); setError(""); } catch (cause) { setError(cause.message); } }} />
    {typeof window !== "undefined" && typeof window.showSaveFilePicker !== "function" && <p className="proposal-header-status">O navegador controla o destino do download; a emissão é registrada ao encaminhar o PDF para download.</p>}
    {error && !showResult && <p role="alert" className="proposal-alert">{error}</p>}
    {!draft && document.sourceQuoteRevision !== (quote.revision ?? 0) && !closed && <p className="proposal-alert">O orçamento foi alterado após a geração da V{selected}. A versão existente permanece inalterada. Crie uma nova versão para usar os dados atuais.</p>}
    {!closed && quote.status !== "Aprovado internamente" && <p className="proposal-alert">O ORC precisa passar por revisão e aprovação interna antes de gerar uma nova versão.</p>}
    {proposal.acceptedVersion && <p className="proposal-accepted">Proposta aceita • V{proposal.acceptedVersion}. A criação do projeto está disponível no orçamento.</p>}
    <div className="proposal-columns">
      <ProposalConfigPanel configuration={configuration} media={media} disabled={!draft || !editable} readOnly={!draft} onSave={save} overflow={overflow} />
      <ProposalPreview document={document} onOverflowChange={setMeasurement} enableZoom />
    </div>
    {!draft && document.result && <details className="proposal-result-history"><summary>Resultado registrado • {({ accepted: "Aceita", revision: "Revisão solicitada", rejected: "Recusada" })[document.result.type]}</summary><p>{document.result.date} • {document.result.actor}</p><p>Observação interna: {document.result.note || "—"}</p></details>}
    {showResult && <ProposalResultDialog version={selected} busy={busy} error={error} onClose={() => { setShowResult(false); setError(""); }} onConfirm={result => run(() => { setProposal(registerProposalResult(quoteId, selected, result)); setShowResult(false); })} />}
  </div>;
}
