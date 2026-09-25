import { useState } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { Card, ErrorBox, Label, Loading, Pill, SuccessBox } from "../../../components/internal/knowledge/KmUi";
import { btn, inputClass, useLoad } from "../../../components/internal/knowledge/kmUtils";
import { ROLE_LABELS, hasRole } from "../../../services/authApi";
import { knowledgeApi } from "../../../services/knowledgeApi";

export function ModuleAdminPage() {
  const { user } = useOutletContext();
  const users = useLoad(() => knowledgeApi.users(), []);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", role: "TECNICO", password: "" });
  if (!hasRole(user, "ADMIN")) return <Navigate to="../assistente" replace />;

  const run = async (action, text) => {
    setError(""); setMessage("");
    try { const data = await action(); if (text) setMessage(typeof text === "function" ? text(data) : text); users.reload(); return data; }
    catch (cause) { setError(cause.message); return null; }
  };

  return (
    <div className="space-y-5">
      <SuccessBox>{message}</SuccessBox><ErrorBox>{error}</ErrorBox>
      <Card title="Usuários e perfis" subtitle="Consulta: vê tudo, não edita · Técnico: cria registros e envia lições · Validador: valida e marca como superado · Administrador: usuários e vocabulário.">
        <Loading state={users}>
          <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="text-[12px] uppercase tracking-[0.06em] text-[#5f7c8c]"><tr><th className="py-2 pr-3">Cargo</th><th className="pr-3">E-mail</th><th className="pr-3">Perfil</th><th className="pr-3">Situação</th><th /></tr></thead>
            <tbody className="divide-y divide-[#edf1f3]">{(users.data || []).map(item => <tr key={item.id}>
              <td className="py-2 pr-3 font-semibold text-[#071f2d]">{item.name}</td>
              <td className="pr-3">{item.email}</td>
              <td className="pr-3"><select className={`${inputClass} !mt-0 !h-8 !w-auto`} value={item.role} onChange={event => run(() => knowledgeApi.updateUser(item.id, { role: event.target.value }), `Perfil de ${item.name} atualizado.`)}>
                {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select></td>
              <td className="pr-3">{item.active ? <Pill tone="green">Ativo</Pill> : <Pill tone="gray">Inativo</Pill>}</td>
              <td><button type="button" className="text-[13px] font-semibold text-[#0b5ea8] hover:underline" onClick={() => run(() => knowledgeApi.updateUser(item.id, { active: !item.active }), `${item.name} ${item.active ? "desativado" : "reativado"}.`)}>{item.active ? "Desativar" : "Reativar"}</button></td>
            </tr>)}</tbody>
          </table></div>
        </Loading>
        <form className="mt-5 grid gap-3 rounded-[12px] bg-[#f7fafb] p-4 md:grid-cols-5" onSubmit={async event => { event.preventDefault(); const created = await run(() => knowledgeApi.createUser(form), `Acesso ${form.name} criado.`); if (created) setForm({ name: "", email: "", role: "TECNICO", password: "" }); }}>
          <Label label="Cargo (identificação)" required><input className={inputClass} required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></Label>
          <Label label="E-mail" required><input className={inputClass} type="email" required value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></Label>
          <Label label="Perfil"><select className={inputClass} value={form.role} onChange={event => setForm({ ...form, role: event.target.value })}>{Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Label>
          <Label label="Senha inicial" required><input className={inputClass} type="password" minLength={8} required value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} /></Label>
          <div className="flex items-end"><button type="submit" className={`${btn()} w-full`}>Criar usuário</button></div>
        </form>
      </Card>
    </div>
  );
}
