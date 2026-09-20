import { useEffect, useRef, useState } from "react";

export function ProposalResultDialog({ version, busy, onClose, onConfirm, error }) {
  const dialogRef = useRef(null);
  const [result, setResult] = useState({ type: "", date: new Date().toISOString().slice(0, 10), note: "" });
  useEffect(() => { const dialog = dialogRef.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={dialogRef} className="proposal-result-dialog" aria-labelledby="proposal-result-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <form onSubmit={event => { event.preventDefault(); onConfirm(result); }}>
      <p className="proposal-eyebrow">RESULTADO DA NEGOCIAÇÃO</p><h2 id="proposal-result-title">Registrar resultado • V{version}</h2><p>A negociação acontece fora da plataforma.</p>
      {error && <p className="proposal-alert" role="alert">{error}</p>}
      <fieldset disabled={busy}>
        <label>Resultado<select required value={result.type} onChange={event => setResult({ ...result, type: event.target.value })}><option value="">Selecione</option><option value="accepted">Aceita</option><option value="revision">Revisão solicitada</option><option value="rejected">Recusada</option></select></label>
        <label>Data<input required type="date" value={result.date} onChange={event => setResult({ ...result, date: event.target.value })} /></label>
        <label>Observação interna<textarea rows={3} value={result.note} onChange={event => setResult({ ...result, note: event.target.value })} /></label>
      </fieldset>
      <div className="proposal-dialog-actions"><button className="proposal-button" disabled={busy} type="button" onClick={onClose}>CANCELAR</button><button className="proposal-button proposal-primary" disabled={busy} type="submit">CONFIRMAR</button></div>
    </form>
  </dialog>;
}
