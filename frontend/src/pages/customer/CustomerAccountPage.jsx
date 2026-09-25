import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { changeCustomerPassword, requestCustomerClosure, updateCustomerCompany, updateCustomerProfile } from "../../services/customer/customerService";
import { formatPhone } from "../../utils/contactValidation";

const UF = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const inputClass = "mt-1.5 h-11 w-full rounded-[11px] border border-[#d3dfe6] bg-[#f8fafb] px-3.5 text-[14px] text-[#17394f] outline-none transition focus:border-[#78a9c4] focus:bg-white disabled:text-[#7b868e]";
const labelClass = "block text-[12.5px] font-semibold text-[#526d7c]";
const cardClass = "rounded-[16px] border border-[#dfe6ea] bg-white p-5 sm:p-6";
const primary = "rounded-[11px] bg-[#12364e] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0b2340] disabled:opacity-60";
const secondary = "rounded-[11px] ring-1 ring-inset ring-[#cbd9e1] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#3d5f73] transition hover:ring-[#9fbccc]";

function formatCnpj(value) {
  const n = String(value ?? "").replace(/\D/g, "").slice(0, 14);
  return n.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
}

/** Minha conta (cliente): dados pessoais, dados da empresa, senha e pedido de encerramento — tudo gravado no backend. */
export function CustomerAccountPage() {
  const { customer, updateCustomer } = useOutletContext();
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0057b8]">{customer.company.name}</p>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#071f2d]">Minha conta</h1>
        <p className="mt-2 text-[14px] text-[#6e7981]">Seus dados de contato, os dados da empresa e a segurança do acesso.</p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ProfileCard customer={customer} onSaved={updateCustomer} />
        <CompanyCard customer={customer} onSaved={updateCustomer} />
        <PasswordCard email={customer.user.email} />
        <ClosureCard />
      </div>
    </div>
  );
}

function Feedback({ state }) {
  if (!state?.message) return null;
  return <p role={state.error ? "alert" : "status"} className={`mt-4 rounded-[10px] border px-3.5 py-2.5 text-[13px] ${state.error ? "border-[#e3c5bc] bg-[#faf0ed] text-[#8f5544]" : "border-[#bcd8c7] bg-[#ebf5ee] text-[#3d7453]"}`}>{state.message}</p>;
}

function CardHeader({ eyebrow, title, text, action }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#64869a]">{eyebrow}</p>
        <h2 className="mt-1 text-[19px] font-semibold tracking-[-0.025em] text-[#071f2d]">{title}</h2>
        {text && <p className="mt-1 text-[13px] leading-5 text-[#708793]">{text}</p>}
      </div>
      {action}
    </div>
  );
}

function useSave() {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);
  async function run(action, message) {
    setBusy(true); setFeedback(null);
    try { const result = await action(); setFeedback({ message, error: false }); return result; }
    catch (error) { setFeedback({ message: error.message, error: true }); return null; }
    finally { setBusy(false); }
  }
  return { busy, feedback, run };
}

function ProfileCard({ customer, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: customer.user.name, phone: formatPhone(customer.user.phone || "") });
  const { busy, feedback, run } = useSave();
  const cancel = () => { setEditing(false); setForm({ name: customer.user.name, phone: formatPhone(customer.user.phone || "") }); };
  return (
    <section className={cardClass}>
      <CardHeader eyebrow="Perfil" title="Dados pessoais" text="Nome e telefone de contato usados pelo laboratório."
        action={!editing && <button type="button" className={secondary} onClick={() => setEditing(true)}>Editar</button>} />
      <form className="mt-5 space-y-4" onSubmit={async event => {
        event.preventDefault();
        const saved = await run(() => updateCustomerProfile({ name: form.name, phone: form.phone }), "Dados pessoais atualizados.");
        if (saved) { onSaved(saved); setEditing(false); }
      }}>
        <label className={labelClass}>Nome<input className={inputClass} required disabled={!editing} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>E-mail de acesso<input className={inputClass} disabled value={customer.user.email} /></label>
          <label className={labelClass}>Telefone<input className={inputClass} disabled={!editing} inputMode="tel" value={form.phone} onChange={event => setForm({ ...form, phone: formatPhone(event.target.value) })} placeholder="(62) 90000-0000" /></label>
        </div>
        <p className="text-[12px] leading-5 text-[#8b969e]">O e-mail identifica o seu acesso. Para trocá-lo, fale com o laboratório.</p>
        {editing && <div className="flex justify-end gap-2"><button type="button" className={secondary} onClick={cancel}>Cancelar</button><button type="submit" className={primary} disabled={busy}>{busy ? "Salvando…" : "Salvar"}</button></div>}
      </form>
      <Feedback state={feedback} />
    </section>
  );
}

function CompanyCard({ customer, onSaved }) {
  const initial = () => ({ name: customer.company.name || "", document: formatCnpj(customer.company.document || ""), phone: formatPhone(customer.company.phone || ""), city: customer.company.city || "", state: customer.company.state || "" });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initial);
  const { busy, feedback, run } = useSave();
  const set = key => event => setForm({ ...form, [key]: event.target.value });
  return (
    <section className={cardClass}>
      <CardHeader eyebrow="Empresa" title="Dados da empresa" text="Aparecem nas suas solicitações e propostas."
        action={!editing && <button type="button" className={secondary} onClick={() => setEditing(true)}>Editar</button>} />
      <form className="mt-5 space-y-4" onSubmit={async event => {
        event.preventDefault();
        const saved = await run(() => updateCustomerCompany(form), "Dados da empresa atualizados.");
        if (saved) { onSaved(saved); setEditing(false); }
      }}>
        <label className={labelClass}>Razão social ou nome fantasia<input className={inputClass} required disabled={!editing} value={form.name} onChange={set("name")} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>CNPJ<input className={inputClass} disabled={!editing} inputMode="numeric" value={form.document} onChange={event => setForm({ ...form, document: formatCnpj(event.target.value) })} placeholder="00.000.000/0000-00" /></label>
          <label className={labelClass}>Telefone da empresa<input className={inputClass} disabled={!editing} inputMode="tel" value={form.phone} onChange={event => setForm({ ...form, phone: formatPhone(event.target.value) })} placeholder="(62) 3000-0000" /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <label className={labelClass}>Cidade<input className={inputClass} disabled={!editing} value={form.city} onChange={set("city")} /></label>
          <label className={labelClass}>UF<select className={inputClass} disabled={!editing} value={form.state} onChange={set("state")}><option value="">—</option>{UF.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></label>
        </div>
        {editing && <div className="flex justify-end gap-2"><button type="button" className={secondary} onClick={() => { setEditing(false); setForm(initial()); }}>Cancelar</button><button type="submit" className={primary} disabled={busy}>{busy ? "Salvando…" : "Salvar"}</button></div>}
      </form>
      <Feedback state={feedback} />
    </section>
  );
}

function PasswordCard({ email }) {
  const empty = { currentPassword: "", newPassword: "", confirm: "" };
  const [form, setForm] = useState(empty);
  const { busy, feedback, run } = useSave();
  const [localError, setLocalError] = useState("");
  const set = key => event => setForm({ ...form, [key]: event.target.value });
  return (
    <section className={cardClass}>
      <CardHeader eyebrow="Segurança" title="Senha de acesso" text={`Acesso com ${email}. A sessão é protegida por cookie seguro e a senha é armazenada criptografada.`} />
      <form className="mt-5 space-y-4" onSubmit={async event => {
        event.preventDefault(); setLocalError("");
        if (form.newPassword !== form.confirm) { setLocalError("A confirmação não confere com a nova senha."); return; }
        const done = await run(() => changeCustomerPassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }), "Senha alterada. Use a nova senha no próximo acesso.");
        if (done) setForm(empty);
      }}>
        <label className={labelClass}>Senha atual<input className={inputClass} type="password" required autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Nova senha<input className={inputClass} type="password" required minLength={8} autoComplete="new-password" value={form.newPassword} onChange={set("newPassword")} placeholder="Mínimo de 8 caracteres" /></label>
          <label className={labelClass}>Confirmar nova senha<input className={inputClass} type="password" required autoComplete="new-password" value={form.confirm} onChange={set("confirm")} /></label>
        </div>
        <div className="flex justify-end"><button type="submit" className={primary} disabled={busy}>{busy ? "Salvando…" : "Alterar senha"}</button></div>
      </form>
      {localError && <Feedback state={{ message: localError, error: true }} />}
      <Feedback state={feedback} />
    </section>
  );
}

function ClosureCard() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);
  const { busy, feedback, run } = useSave();
  return (
    <section className="rounded-[16px] border border-[#ead8d3] bg-[#fdf8f6] p-5 sm:p-6">
      <CardHeader eyebrow="Conta" title="Encerrar acesso" text="O pedido é enviado ao laboratório. Solicitações, propostas e projetos da empresa continuam preservados." />
      {sent ? (
        <p className="mt-5 rounded-[10px] border border-[#bcd8c7] bg-[#ebf5ee] px-3.5 py-2.5 text-[13px] text-[#3d7453]">Pedido enviado. O laboratório entrará em contato para concluir o encerramento.</p>
      ) : !open ? (
        <button type="button" className="mt-5 rounded-[11px] ring-1 ring-inset ring-[#dfbfb6] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#8f5544] transition hover:ring-[#c99a8c]" onClick={() => setOpen(true)}>Solicitar encerramento</button>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={async event => {
          event.preventDefault();
          const done = await run(() => requestCustomerClosure(reason), "");
          if (done) setSent(true);
        }}>
          <label className={labelClass}>Motivo (opcional)<textarea className={`${inputClass} h-auto py-2.5 leading-6`} rows={3} value={reason} onChange={event => setReason(event.target.value)} maxLength={1000} /></label>
          <div className="flex justify-end gap-2"><button type="button" className={secondary} onClick={() => setOpen(false)}>Cancelar</button><button type="submit" disabled={busy} className="rounded-[11px] bg-[#8f5544] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#7a4738] disabled:opacity-60">{busy ? "Enviando…" : "Enviar pedido"}</button></div>
        </form>
      )}
      {feedback?.error && <Feedback state={feedback} />}
    </section>
  );
}
