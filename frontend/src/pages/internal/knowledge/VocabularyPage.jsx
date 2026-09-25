import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, ErrorBox, Label, Pill, SuccessBox } from "../../../components/internal/knowledge/KmUi";
import { areaClass, btn, inputClass } from "../../../components/internal/knowledge/kmUtils";
import { hasRole } from "../../../services/authApi";
import { knowledgeApi } from "../../../services/knowledgeApi";

export function VocabularyPage() {
  const { user, vocabulary, reloadVocabulary } = useOutletContext();
  const admin = hasRole(user, "ADMIN");
  const [message, setMessage] = useState("");
  const [tolerance, setTolerance] = useState(Math.round((vocabulary.tolerance || 0.15) * 100));
  const [error, setError] = useState("");

  async function saveTolerance() {
    setError(""); setMessage("");
    try { await knowledgeApi.setTolerance(Number(tolerance) / 100); setMessage("Tolerância de assertividade atualizada."); reloadVocabulary(); }
    catch (cause) { setError(cause.message); }
  }

  return (
    <div className="space-y-5">
      <Card title="Vocabulário controlado" subtitle={admin ? "Editável aqui pelo Administrador — sem programador. Termos não são apagados, apenas desativados, para o histórico continuar comparável." : "Somente o Administrador edita. Termos padronizam a classificação dos serviços: texto livre não entra."}
        action={admin && <div className="flex items-end gap-2"><Label label="Tolerância (±%)"><input className={`${inputClass} !w-24`} type="number" min="1" max="99" value={tolerance} onChange={event => setTolerance(event.target.value)} /></Label><button type="button" className={btn("secondary")} onClick={saveTolerance}>Salvar</button></div>}>
        <SuccessBox>{message}</SuccessBox><ErrorBox>{error}</ErrorBox>
      </Card>
      <div className="grid gap-5 xl:grid-cols-2">
        {vocabulary.classes.map(item => <VocabularyClass key={item.code} item={item} admin={admin} onChange={text => { setMessage(text); reloadVocabulary(); }} />)}
      </div>
    </div>
  );
}

function VocabularyClass({ item, admin, onChange }) {
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const blank = { id: null, label: "", description: "", guidance: "", active: true, sortOrder: (item.terms.length + 1) * 10 };

  async function save(event) {
    event.preventDefault();
    setError("");
    try {
      if (editing.id) await knowledgeApi.updateTerm(editing.id, editing);
      else await knowledgeApi.createTerm({ ...editing, classCode: item.code });
      onChange(`Termo "${editing.label}" salvo em ${item.label}.`); setEditing(null);
    } catch (cause) { setError(cause.message); }
  }

  return (
    <Card title={item.label} subtitle={`${item.terms.filter(term => term.active).length} termo(s) ativo(s)`} action={admin && <button type="button" className={btn("secondary")} onClick={() => setEditing(blank)}>Adicionar termo</button>}>
      <ul className="divide-y divide-[#edf1f3]">{item.terms.map(term => <li key={term.id} className="flex flex-wrap items-start justify-between gap-2 py-2.5">
        <div className="min-w-0">
          <p className={`text-[14px] font-semibold ${term.active ? "text-[#071f2d]" : "text-[#9aa8b0] line-through"}`}>{term.label} {!term.active && <Pill tone="gray">desativado</Pill>}</p>
          {term.description && <p className="text-[13px] text-[#6a808d]">{term.description}</p>}
          {term.guidance && <p className="mt-0.5 text-[12px] text-[#0b5ea8]">Possui roteiro de estimativa</p>}
        </div>
        {admin && <button type="button" className="text-[13px] font-semibold text-[#0b5ea8] hover:underline" onClick={() => setEditing({ ...term, description: term.description || "", guidance: term.guidance || "" })}>Editar</button>}
      </li>)}</ul>
      {editing && <form className="mt-4 space-y-3 rounded-[12px] bg-[#f7fafb] p-4" onSubmit={save}>
        <Label label="Termo" required><input className={inputClass} required value={editing.label} onChange={event => setEditing({ ...editing, label: event.target.value })} /></Label>
        <Label label="Definição"><input className={inputClass} value={editing.description} onChange={event => setEditing({ ...editing, description: event.target.value })} /></Label>
        {item.code === "SERVICE_TYPE" && <Label label="Roteiro de estimativa" hint="Mostrado pelo Assistente mesmo sem histórico."><textarea className={areaClass} value={editing.guidance} onChange={event => setEditing({ ...editing, guidance: event.target.value })} /></Label>}
        <div className="flex flex-wrap items-center gap-4">
          <Label label="Ordem"><input className={`${inputClass} !w-24`} type="number" value={editing.sortOrder} onChange={event => setEditing({ ...editing, sortOrder: Number(event.target.value) })} /></Label>
          <label className="flex items-center gap-2 pt-5 text-[13px] text-[#34505f]"><input type="checkbox" checked={editing.active} onChange={event => setEditing({ ...editing, active: event.target.checked })} /> Ativo</label>
        </div>
        <ErrorBox>{error}</ErrorBox>
        <div className="flex gap-2"><button type="submit" className={btn()}>Salvar termo</button><button type="button" className={btn("secondary")} onClick={() => setEditing(null)}>Cancelar</button></div>
      </form>}
    </Card>
  );
}
