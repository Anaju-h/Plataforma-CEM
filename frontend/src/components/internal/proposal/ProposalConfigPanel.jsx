import { proposalSections } from "../../../services/commercialProposalService";
import { useState } from "react";

function CommercialNote({ value, disabled, onSave, onPreview }) {
  const [text, setText] = useState(value ?? "");
  return <textarea id="proposal-commercial-note" aria-label="Observação no documento" rows={2} readOnly={disabled} value={text} placeholder="Observação destinada ao cliente"
    onChange={event => { setText(event.target.value); onPreview?.(event.target.value); }} onBlur={event => { if (event.currentTarget.value !== (value ?? "")) onSave(event.currentTarget.value); }} />;
}

function Choice({ label, summary, selected, disabled, onClick, radio = false }) {
  return <button type="button" role={radio ? "radio" : "checkbox"} aria-checked={selected} disabled={disabled} onClick={onClick} className={"proposal-choice" + (selected ? " is-selected" : "")}>
    <span className="proposal-choice-copy"><span>{label}</span></span>
    {summary && <small className="proposal-choice-summary">{summary}</small>}
    <span className={"proposal-check" + (radio ? " is-radio" : "")} aria-hidden="true">{selected && (radio ? <span /> : <svg viewBox="0 0 20 20"><path d="m5 10 3 3 7-7" /></svg>)}</span>
  </button>;
}

export function ProposalConfigPanel({ configuration, media, disabled, onSave, onNotePreview, readOnly = false, overflow }) {
  const { sections, content, investmentDisplay, selectedMedia } = configuration;
  const labels = { items: "Serviços", notes: "Observação comercial", files: "Arquivos / referências" };
  const options = [
    ["total-only", "Total", "Somente o valor total"],
    ["items", "Itens", "Itens + subtotais + total"],
    ["hours", "Detalhado", "Peças + serviços + horas cotadas + valor"],
  ];
  return <aside className="proposal-config" aria-label="Configuração da proposta">
    <div className="proposal-config-intro"><h2>Conteúdo</h2>{readOnly && <p>Documento bloqueado • somente leitura</p>}</div>
    {overflow && <div className="proposal-alert" role="alert">O conteúdo excede o limite da proposta de uma página. Reduza textos ou elementos opcionais antes de gerar a versão.</div>}
    <div className="proposal-section-options">
      {Object.entries(proposalSections).map(([key, originalLabel]) => {
        const isMedia = key === "photos" || key === "files";
        const available = isMedia ? media.filter(item => item.type === (key === "photos" ? "photo" : "file")) : [];
        return <div key={key}>
          <Choice label={labels[key] ?? originalLabel} summary={["deadline", "validity"].includes(key) ? content[key] : null} selected={sections[key]} disabled={disabled} onClick={() => onSave({ sections: { ...sections, [key]: !sections[key] } })} />
          {sections[key] && key === "notes" && <div className="proposal-note"><CommercialNote key={content.notes} value={content.notes} disabled={disabled} onPreview={onNotePreview} onSave={notes => onSave({ content: { ...content, notes } })} /></div>}
          {sections[key] && isMedia && available.length > 0 && <div className="proposal-media-options">{available.map(item => <Choice key={item.id} label={item.name} selected={selectedMedia.includes(item.id)} disabled={disabled} onClick={() => onSave({ selectedMedia: selectedMedia.includes(item.id) ? selectedMedia.filter(id => id !== item.id) : [...selectedMedia, item.id] })} />)}</div>}
        </div>;
      })}
    </div>
    <div className="proposal-investment"><h2>Investimento</h2><div role="radiogroup" aria-label="Exibição do investimento">{options.map(([value, label]) => <Choice key={value} radio label={label} selected={investmentDisplay === value} disabled={disabled} onClick={() => onSave({ investmentDisplay: value })} />)}</div><p className="proposal-investment-summary">{options.find(([value]) => value === investmentDisplay)?.[2]}</p></div>
  </aside>;
}
