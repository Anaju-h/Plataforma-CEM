import { useEffect, useMemo, useState } from "react";
import { ApiState } from "../../components/internal/ApiState";
import { Link, useParams } from "react-router-dom";
import { getQuoteById } from "../../services/quoteService";
import { createNextProposalDraft, generateProposalVersion, getDraftDocument, openProposal, registerProposalResult, saveProposalDraft } from "../../services/proposalService";
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
async function load(quoteId) {
  const quote = await getQuoteById(quoteId);
  const proposal = quote.proposal ?? await openProposal(quoteId);
  const draftDocument = proposal.draft ? await getDraftDocument(quoteId) : null;
  return { quote, proposal, draftDocument };
}
function Builder({ quoteId }) {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [measurement, setMeasurement] = useState(null);
  const [previewNote, setPreviewNote] = useState(null);
  const document = useMemo(() => {
    if (!data) return null;
    const original = selected === "draft" ? data.draftDocument : data.proposal.versions.find(version => version.version === selected);
    if (!original || selected !== "draft" || previewNote === null) return original;
    return { ...original, snapshot: { ...original.snapshot, content: { ...original.snapshot.content, notes: previewNote } } };
  }, [data, selected, previewNote]);
  useEffect(() => {
    let active = true;
    load(quoteId).then(value => {
      if (active) { setData(value); setSelected(value.proposal.draft ? "draft" : value.proposal.versions.at(-1)?.version); }
    }).catch(cause => { if (active) setError(cause.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [quoteId, retry]);
  if (loading) return <div className="proposal-workspace"><ApiState title="Proposta comercial" loading="Carregando proposta..." /></div>;
  if (!data) return <div className="proposal-workspace"><Link to={"/portal/orcamentos/" + quoteId}>← Voltar ao ORC</Link><p role="alert">{error}</p><button onClick={() => { setError(""); setLoading(true); setRetry(value => value + 1); }}>Tentar novamente</button></div>;
  const { quote, proposal } = data;
  if (!document) return <div className="proposal-workspace"><Link to={"/portal/orcamentos/" + quoteId}>← Voltar ao ORC</Link><p>Aprove o orçamento internamente antes de montar a proposta.</p></div>;
  const closed = ["Aceito", "Recusado", "Cancelado"].includes(quote.status);
  const editable = !closed && quote.status === "Aprovado internamente" && !busy;
  const draft = selected === "draft" ? proposal.draft : null;
  const unsavedNote = draft && previewNote !== null && previewNote !== (draft.content.notes ?? "");
  const overflow = measurement?.document === document && measurement.overflow;
  const configuration = draft ?? { sections: document.snapshot.sections, content: document.snapshot.content, investmentDisplay: document.investmentDisplay, selectedMedia: document.selectedMedia ?? [] };
  const media = draft ? getPermittedProposalMedia(quote) : document.snapshot.media;
  async function run(action) {
    if (busy) return;
    setBusy(true); setError("");
    try { await action(); } catch (cause) { setError(cause.message); } finally { setBusy(false); }
  }
  async function refresh(selection = selected) {
    const value = await load(quoteId);
    setData(value); setSelected(selection);
  }
  function save(patch) {
    return run(async () => { await saveProposalDraft(quoteId, { ...draft, ...patch }, proposal.revision); await refresh(); setPreviewNote(null); });
  }
  return <div className="proposal-workspace">
    <ProposalBuilderHeader proposal={proposal} document={document} selected={selected} draft={draft} busy={busy} editable={editable}
      canGenerate={editable && !unsavedNote && measurement?.document === document && !overflow}
      onSelect={value => { setSelected(value); setShowResult(false); setError(""); }}
      onGenerate={() => run(async () => {
        if (overflow) return;
        const generated = await generateProposalVersion(quoteId, proposal);
        if (generated.cancelled) return;
        await refresh(generated.version.version);
      })}
      onDownload={() => run(() => saveExistingProposalPdf(document))}
      onResult={() => setShowResult(true)}
      onNewVersion={() => run(async () => { await createNextProposalDraft(quoteId, proposal.revision); await refresh("draft"); setShowResult(false); })} />
    {typeof window !== "undefined" && typeof window.showSaveFilePicker !== "function" && <p className="proposal-header-status">O navegador controla o destino do download; a emissão é registrada ao encaminhar o PDF para download.</p>}
    {error && !showResult && <p role="alert" className="proposal-alert">{error} {unsavedNote
      ? <button disabled={busy} onClick={() => save({ content: { ...draft.content, notes: previewNote } })}>Tentar salvar novamente</button>
      : <button disabled={busy} onClick={() => run(() => refresh())}>Recarregar</button>}</p>}
    {!draft && document.sourceQuoteRevision !== (quote.revision ?? 0) && !closed && <p className="proposal-alert">O orçamento foi alterado após a geração da V{selected}. A versão existente permanece inalterada. Crie uma nova versão para usar os dados atuais.</p>}
    {!closed && quote.status !== "Aprovado internamente" && <p className="proposal-alert">O ORC precisa passar por revisão e aprovação interna antes de gerar uma nova versão.</p>}
    {proposal.acceptedVersion && <p className="proposal-accepted">Proposta aceita • V{proposal.acceptedVersion}. Projeto será tratado na próxima etapa.</p>}
    <div className="proposal-columns">
      <ProposalConfigPanel configuration={configuration} media={media} disabled={!draft || !editable} readOnly={!draft} onSave={save} onNotePreview={setPreviewNote} overflow={overflow} />
      <ProposalPreview document={document} onOverflowChange={setMeasurement} enableZoom />
    </div>
    {!draft && document.result && <details className="proposal-result-history"><summary>Resultado registrado • {({ accepted: "Aceita", revision: "Revisão solicitada", rejected: "Recusada" })[document.result.type]}</summary><p>{document.result.date} • {document.result.actor}</p><p>Observação interna: {document.result.note || "—"}</p></details>}
    {showResult && <ProposalResultDialog version={selected} busy={busy} error={error} onClose={() => { setShowResult(false); setError(""); }} onConfirm={result => run(async () => { await registerProposalResult(quoteId, selected, result, proposal.revision); await refresh(); setShowResult(false); })} />}
  </div>;
}
