import { useState } from "react";
import { InternalPageHeader } from "../../components/internal/InternalPageHeader";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { updateCurrentUser } from "../../services/currentUserService";

export function InternalAccountPage() {
  const user = useCurrentUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [feedback, setFeedback] = useState(null);
  function save(event) {
    event.preventDefault();
    try {
      const saved = updateCurrentUser({ name, email });
      setName(saved.name);
      setEmail(saved.email);
      setFeedback({ message: "Dados da conta atualizados nesta sessão.", error: false });
    } catch (error) { setFeedback({ message: error.message, error: true }); }
  }
  const inputClass = "internal-field-value mt-2 h-12 w-full rounded-[12px] border border-[#ccdbe3] bg-[#f8fafb] px-4 text-[#294e64]";
  return <div className="mx-auto max-w-[1500px]">
    <InternalPageHeader eyebrow="Perfil" title="Minha Conta" description="Dados pessoais do usuário interno atual." />
    <section className="mt-6 rounded-[24px] border border-[#cddbe3] bg-white/85 p-6 shadow-[0_12px_32px_rgba(7,31,45,0.04)] sm:p-8">
      <div className="flex items-center gap-4 border-b border-[#dce5eb] pb-6"><span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-[#12364e] text-xl font-semibold text-white">{user.initials}</span><div className="min-w-0"><h2 className="break-words text-xl font-semibold text-[#17394f]">{user.name}</h2><p className="internal-body mt-1 text-[#526d7c]">{user.role}</p></div></div>
      <form onSubmit={save} className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.8fr)]">
        <div className="space-y-5"><label className="internal-field-label block text-[#607989]">Nome de exibição *<input required autoComplete="name" className={inputClass} value={name} onChange={event => setName(event.target.value)} /></label><label className="internal-field-label block text-[#607989]">E-mail<input type="email" autoComplete="email" className={inputClass} value={email} onChange={event => setEmail(event.target.value)} /></label>
          <button type="submit" className="internal-help-text rounded-[12px] bg-[#096ab2] px-5 py-3 font-semibold text-white">Salvar dados</button>
          {feedback && <p role={feedback.error ? "alert" : "status"} className={"internal-body " + (feedback.error ? "text-[#9a5947]" : "text-[#397250]")}>{feedback.message}</p>}
        </div>
        <div className="rounded-[18px] border border-[#cbdde6] bg-[#edf5f9] p-5"><p className="internal-field-label text-[#607989]">Perfil de acesso · somente leitura</p><p className="mt-2 text-lg font-semibold text-[#17394f]">{user.accessProfile}</p><p className="internal-body mt-4 text-[#526d7c]">As alterações ficam disponíveis durante esta sessão e são reiniciadas ao recarregar a página.</p></div>
      </form>
    </section>
  </div>;
}
