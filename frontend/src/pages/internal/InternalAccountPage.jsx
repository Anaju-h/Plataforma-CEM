import { useState } from "react";
import { InternalPageHeader } from "../../components/internal/InternalPageHeader";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { updateInternalAccount } from "../../services/authApi";
import { setSessionUser } from "../../services/currentUserService";

const inputClass = "internal-field-value mt-2 h-12 w-full rounded-[12px] border border-[#ccdbe3] bg-[#f8fafb] px-4 text-[#294e64]";

/** Minha conta (interno): dados gravados no banco. E-mail e senha só mudam com a senha atual. */
export function InternalAccountPage() {
  const user = useCurrentUser();
  const [form, setForm] = useState({ name: user.name, email: user.email, currentPassword: "", newPassword: "", confirm: "" });
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = key => event => setForm(current => ({ ...current, [key]: event.target.value }));
  const needsPassword = form.email.trim().toLowerCase() !== String(user.email || "").toLowerCase() || Boolean(form.newPassword);

  async function save(event) {
    event.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirm) { setFeedback({ message: "A confirmação não confere com a nova senha.", error: true }); return; }
    setBusy(true); setFeedback(null);
    try {
      const saved = await updateInternalAccount({ name: form.name, email: form.email, currentPassword: form.currentPassword || null, newPassword: form.newPassword || null });
      setSessionUser(saved);
      setForm({ name: saved.name, email: saved.email, currentPassword: "", newPassword: "", confirm: "" });
      setFeedback({ message: "Dados da conta salvos.", error: false });
    } catch (error) { setFeedback({ message: error.message, error: true }); }
    finally { setBusy(false); }
  }

  return <div className="mx-auto max-w-[1500px]">
    <InternalPageHeader eyebrow="Perfil" title="Minha Conta" description="Seus dados de acesso ao portal interno." />
    <section className="mt-6 rounded-[24px] border border-[#cddbe3] bg-white/85 p-6 shadow-[0_12px_32px_rgba(7,31,45,0.04)] sm:p-8">
      <div className="flex items-center gap-4 border-b border-[#dce5eb] pb-6"><span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-[#12364e] text-xl font-semibold text-white">{user.initials}</span><div className="min-w-0"><h2 className="break-words text-xl font-semibold text-[#17394f]">{user.name}</h2><p className="internal-body mt-1 text-[#526d7c]">{user.accessProfile}</p></div></div>
      <form onSubmit={save} className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.8fr)]">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="internal-field-label block text-[#607989]">Nome de exibição *<input required autoComplete="name" className={inputClass} value={form.name} onChange={set("name")} /></label>
            <label className="internal-field-label block text-[#607989]">E-mail de acesso *<input required type="email" autoComplete="email" className={inputClass} value={form.email} onChange={set("email")} /></label>
          </div>
          <div className="rounded-[18px] border border-[#dce5eb] bg-[#f8fafb] p-5">
            <p className="internal-field-label text-[#607989]">Trocar senha (opcional)</p>
            <div className="mt-2 grid gap-5 sm:grid-cols-2">
              <label className="internal-field-label block text-[#607989]">Nova senha<input type="password" minLength={8} autoComplete="new-password" className={inputClass} value={form.newPassword} onChange={set("newPassword")} placeholder="Mínimo de 8 caracteres" /></label>
              <label className="internal-field-label block text-[#607989]">Confirmar nova senha<input type="password" autoComplete="new-password" className={inputClass} value={form.confirm} onChange={set("confirm")} /></label>
            </div>
          </div>
          {needsPassword && <label className="internal-field-label block text-[#607989]">Senha atual * <span className="normal-case tracking-normal">(necessária para trocar e-mail ou senha)</span><input required type="password" autoComplete="current-password" className={inputClass} value={form.currentPassword} onChange={set("currentPassword")} /></label>}
          <button type="submit" disabled={busy} className="internal-help-text rounded-[12px] bg-[#096ab2] px-5 py-3 font-semibold text-white disabled:opacity-60">{busy ? "Salvando..." : "Salvar dados"}</button>
          {feedback && <p role={feedback.error ? "alert" : "status"} className={"internal-body " + (feedback.error ? "text-[#9a5947]" : "text-[#397250]")}>{feedback.message}</p>}
        </div>
        <div className="rounded-[18px] border border-[#cbdde6] bg-[#edf5f9] p-5"><p className="internal-field-label text-[#607989]">Perfil de acesso · definido pelo Administrador</p><p className="mt-2 text-lg font-semibold text-[#17394f]">{user.accessProfile}</p><p className="internal-body mt-4 text-[#526d7c]">O nome aparece no histórico das ações que você registrar. O perfil de acesso é alterado na página Equipe.</p></div>
      </form>
    </section>
  </div>;
}
