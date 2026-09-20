import { Link } from "react-router-dom";

const statuses = { generated: "Gerada", superseded: "Substituída", accepted: "Aceita", rejected: "Recusada" };
export function ProposalBuilderHeader({ proposal, document, selected, draft, busy, canGenerate, editable, onSelect, onGenerate, onDownload, onResult, onNewVersion }) {
  return <header className="proposal-builder-header">
    <Link className="proposal-back" to={`/portal/orcamentos/${proposal.quoteId}`}>← {proposal.quoteId}</Link>
    <div className="proposal-header-main"><div><p className="proposal-eyebrow">PROPOSTA COMERCIAL</p><div className="proposal-heading-line"><h1>{proposal.id}{draft && <span> • V{proposal.versions.length + 1} • Rascunho</span>}</h1>
      <span className="proposal-header-status" role="status">{draft ? `Salvo às ${new Date(draft.updatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}` : `V${selected} • ${statuses[document.status]} • Bloqueada`}</span></div>
    </div><div className="proposal-header-actions">
      {draft ? <button className="proposal-button proposal-primary" disabled={!canGenerate} onClick={onGenerate}>{busy ? "Salvando…" : `BAIXAR PDF • V${proposal.versions.length + 1}`}</button> : <>
        {editable && !proposal.draft && <button className="proposal-button proposal-primary" onClick={onNewVersion}>+ CRIAR V{proposal.versions.length + 1}</button>}
        {editable && document.status === "generated" && !proposal.draft && <button className="proposal-button" disabled={busy} onClick={onResult}>REGISTRAR RESULTADO</button>}
      </>}
    </div></div>
    {proposal.versions.length > 0 && <div className="proposal-version-strip"><label>Versão <select aria-label="Versão da proposta" value={selected} disabled={busy} onChange={event => onSelect(event.target.value === "draft" ? "draft" : Number(event.target.value))}>
      {proposal.draft && <option value="draft">Rascunho • V{proposal.versions.length + 1}</option>}
      {[...proposal.versions].reverse().map(version => <option key={version.version} value={version.version}>V{version.version} • {statuses[version.status]} • {new Date(version.createdAt).toLocaleDateString("pt-BR")}</option>)}
    </select></label>
      {!draft && <button type="button" className="proposal-button" disabled={busy} onClick={onDownload} title={`Baixar V${selected} novamente`} aria-label={`Baixar V${selected} novamente`}>↓ PDF</button>}
    </div>}
  </header>;
}
