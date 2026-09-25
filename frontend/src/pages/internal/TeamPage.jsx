import { useEffect, useMemo, useState } from "react";
import { ApiState } from "../../components/internal/ApiState";
import { InternalPageHeader } from "../../components/internal/InternalPageHeader";
import { ROLE_TITLES, formatHours, inputClass, labelClass, linkButton, primaryButton } from "../../components/internal/tasks/taskUtils";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { createInternalUser, getTaskBoard, listInternalUsers, updateInternalUser } from "../../services/taskApi";

const ROLE_ACCESS = [
  { role: "ADMIN", title: "Administrador", text: "Acesso total: solicitações, orçamentos, propostas, projetos, equipe, quadro de tarefas, custos e administração. Cadastra perfis e delega tarefas." },
  { role: "VALIDADOR", title: "Validador", text: "Meu trabalho, projetos delegados (sem valores comerciais) e Gestão do Conhecimento, onde formaliza as lições. Recebe tarefas e aponta horas." },
  { role: "TECNICO", title: "Técnico", text: "Meu trabalho e projetos delegados: atualiza as tarefas, aponta horas e fecha o Registro de Serviço com o realizado e a lição." },
  { role: "CONSULTA", title: "Consulta", text: "Somente leitura da Gestão do Conhecimento e dos projetos em que for incluído. Não recebe tarefas." },
];
const EMPTY = { name: "Técnico", email: "", role: "TECNICO", password: "" };

/** Equipe (somente Administrador): perfis de acesso, situação e carga de tarefas. */
export function TeamPage() {
  const current = useCurrentUser();
  const [users, setUsers] = useState(null);
  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordFor, setPasswordFor] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([listInternalUsers(), getTaskBoard().catch(() => null)])
      .then(([list, boardData]) => { if (active) { setUsers(list); setBoard(boardData); setError(""); } })
      .catch(reason => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [retry]);

  const load = useMemo(() => {
    const map = {};
    (board?.tasks || []).forEach(row => {
      if (!row.task.assigneeId || row.project.closed) return;
      const item = map[row.task.assigneeId] ||= { open: 0, overdue: 0, spent: 0 };
      if (row.task.status !== "DONE") item.open += 1;
      if (row.overdue) item.overdue += 1;
      item.spent += Number(row.task.spentHours || 0);
    });
    return map;
  }, [board]);

  if (error || !users) return <ApiState eyebrow="Gestão" title="Equipe" description="Perfis de acesso e carga de trabalho da equipe." loading="Carregando equipe..." error={error} onRetry={() => { setError(""); setRetry(value => value + 1); }} />;

  const run = async (action, text) => {
    setMessage({ type: "", text: "" });
    try { await action(); setMessage({ type: "ok", text }); setRetry(value => value + 1); return true; }
    catch (reason) { setMessage({ type: "error", text: reason.message }); return false; }
  };
  const active = users.filter(user => user.active);

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader eyebrow="Gestão" title="Equipe" description="Somente o Administrador vê esta página: cadastra os perfis, define o nível de acesso e acompanha a carga de tarefas de cada um." />

      {message.text && <div role={message.type === "error" ? "alert" : "status"} className={`mt-5 rounded-[14px] border px-4 py-3 text-[13px] font-semibold ${message.type === "error" ? "border-[#e6c7c0] bg-[#fbefec] text-[#8b4a3c]" : "border-[#bcd8c7] bg-[#ebf5ee] text-[#3d7453]"}`}>{message.text}</div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Perfis ativos", active.length], ["Tarefas abertas", board?.totals?.open ?? 0], ["Tarefas atrasadas", board?.totals?.overdue ?? 0, (board?.totals?.overdue ?? 0) > 0], ["Horas apontadas", formatHours(board?.totals?.spentHours ?? 0)]].map(([label, value, alert]) => (
          <section key={label} className="rounded-[18px] border border-[#cbdde6] bg-white/75 p-5"><p className="internal-field-label text-[#607989]">{label}</p><p className={`mt-2 text-3xl font-semibold ${alert ? "text-[#a0522d]" : "text-[#17394f]"}`}>{value}</p></section>
        ))}
      </div>

      <section className="mt-5 overflow-hidden rounded-[22px] border border-[#cddbe3] bg-white shadow-[0_10px_30px_rgba(7,31,45,0.035)]">
        <div className="border-b border-[#dce5eb] px-5 py-4 sm:px-6">
          <h2 className="internal-section-title font-semibold text-[#17394f]">Perfis de acesso</h2>
          <p className="internal-help-text mt-1 text-[#607989]">Nesta fase os perfis são identificados pelo cargo. A troca de perfil vale a partir do próximo login da pessoa.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[14px]">
            <thead className="text-[11px] uppercase tracking-[0.08em] text-[#5f7c8c]"><tr className="border-b border-[#e3eaee]"><th className="px-6 py-3">Perfil</th><th className="px-3">E-mail</th><th className="px-3">Nível de acesso</th><th className="px-3">Situação</th><th className="px-3">Tarefas</th><th className="px-3">Horas</th><th className="px-6 text-right">Ações</th></tr></thead>
            <tbody className="divide-y divide-[#e3eaee]">
              {users.map(user => {
                const self = user.id === current.sessionId;
                const info = load[user.id] || { open: 0, overdue: 0, spent: 0 };
                return (
                  <tr key={user.id} className={user.active ? "" : "opacity-60"}>
                    <td className="px-6 py-3.5"><p className="font-semibold text-[#17394f]">{user.name}{self && <span className="ml-2 rounded-full bg-[#dcebf4] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#2d6488]">Você</span>}</p></td>
                    <td className="px-3 text-[#526d7c]">{user.email}</td>
                    <td className="px-3">
                      <select disabled={self} value={user.role} className="internal-ctl h-9 rounded-[10px] border border-[#ccdbe3] bg-[#f8fafb] px-3 text-[13px] font-semibold text-[#294e64] disabled:opacity-60"
                        onChange={event => run(() => updateInternalUser(user.id, { role: event.target.value }), `Nível de acesso de ${user.name} atualizado.`)}>
                        {Object.entries(ROLE_TITLES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </td>
                    <td className="px-3">{user.active ? <span className="rounded-full bg-[#e8f5ed] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#397250]">Ativo</span> : <span className="rounded-full bg-[#f1f3f5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#707980]">Inativo</span>}</td>
                    <td className="px-3 text-[#31566d]">{user.role === "CONSULTA" ? "—" : <>{info.open} abertas{info.overdue ? <span className="font-semibold text-[#a0522d]"> · {info.overdue} atrasada(s)</span> : ""}</>}</td>
                    <td className="px-3 text-[#31566d]">{user.role === "CONSULTA" ? "—" : formatHours(info.spent)}</td>
                    <td className="px-6 text-right">
                      <div className="flex justify-end gap-4">
                        <button type="button" className={linkButton} onClick={() => { setPasswordFor(passwordFor === user.id ? null : user.id); setNewPassword(""); }}>Senha</button>
                        {!self && <button type="button" className={linkButton} onClick={() => run(() => updateInternalUser(user.id, { active: !user.active }), `${user.name} ${user.active ? "desativado" : "reativado"}.`)}>{user.active ? "Desativar" : "Reativar"}</button>}
                      </div>
                      {passwordFor === user.id && (
                        <form className="mt-2 flex justify-end gap-2" onSubmit={async event => { event.preventDefault(); if (await run(() => updateInternalUser(user.id, { password: newPassword }), `Senha de ${user.name} redefinida.`)) setPasswordFor(null); }}>
                          <input type="password" minLength={8} required value={newPassword} onChange={event => setNewPassword(event.target.value)} placeholder="Nova senha (mín. 8)" className="h-9 w-48 rounded-[10px] border border-[#ccdbe3] bg-[#f8fafb] px-3 text-[13px]" />
                          <button type="submit" className="internal-ctl rounded-[10px] bg-[#096ab2] px-3 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-white">Salvar</button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[22px] border border-[#cbdbe5] bg-white/85 p-6 shadow-[0_12px_32px_rgba(7,31,45,0.04)]">
          <h2 className="internal-section-title font-semibold text-[#17394f]">Novo perfil</h2>
          <p className="internal-help-text mt-1 text-[#607989]">Use o cargo como identificação (ex.: “Técnico de Metrologia”). A pessoa troca a senha inicial com o Administrador.</p>
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={async event => { event.preventDefault(); if (await run(() => createInternalUser(form), `Perfil ${form.name} criado.`)) setForm(EMPTY); }}>
            <label className="block"><span className={labelClass}>Nível de acesso</span>
              <select className={inputClass} value={form.role} onChange={event => setForm(current => ({ ...current, role: event.target.value, name: current.name === ROLE_TITLES[current.role] ? ROLE_TITLES[event.target.value] : current.name }))}>
                {Object.entries(ROLE_TITLES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="block"><span className={labelClass}>Identificação (cargo)</span><input className={inputClass} required maxLength={200} value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} /></label>
            <label className="block"><span className={labelClass}>E-mail de acesso</span><input type="email" className={inputClass} required value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} placeholder="perfil@lab.local" /></label>
            <label className="block"><span className={labelClass}>Senha inicial</span><input type="password" className={inputClass} required minLength={8} value={form.password} onChange={event => setForm(current => ({ ...current, password: event.target.value }))} /></label>
            <div className="sm:col-span-2 flex justify-end"><button type="submit" className={primaryButton}>Criar perfil</button></div>
          </form>
        </section>

        <section className="rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-6">
          <h2 className="internal-section-title font-semibold text-[#17394f]">O que cada perfil acessa</h2>
          <div className="mt-4 space-y-3">
            {ROLE_ACCESS.map(item => (
              <div key={item.role} className="rounded-[14px] bg-white/80 px-4 py-3">
                <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#2d6488]">{item.title}</p>
                <p className="mt-1 text-[13px] leading-5 text-[#526d7c]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
