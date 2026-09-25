import { useNavigate } from "react-router-dom";

// Confirmação do formulário público com oferta de conta: o token único devolvido pelo backend
// vincula esta SOL à conta criada (ou a uma conta existente, ao entrar).
export function PublicRequestCreated({ created }) {
  const navigate = useNavigate();
  const claim = { requestId: created.id, claimToken: created.claimToken, company: created.company, contact: created.contact, email: created.email, phone: created.phone };
  const go = () => navigate("/cliente", { state: { claim } });
  return (
    <section role="status" className="relative z-10 mx-auto max-w-3xl px-5">
      <div className="rounded-[22px] border border-[#d6e3ea] bg-white p-8 shadow-[0_20px_50px_rgba(7,31,45,0.06)] sm:p-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">Solicitação recebida</p>
        <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.04em] text-[#071f2d]">{created.id}</h2>
        <p className="mt-3 text-[15px] leading-7 text-[#607583]">Nossa equipe fará a análise técnica inicial e entrará em contato pelo e-mail {created.email || "informado"}.</p>
        <div className="mt-7 rounded-[16px] border border-[#b8ced9]/70 bg-[#eef5f8] p-6">
          <p className="text-[15px] font-semibold text-[#12364e]">Acompanhe tudo pela área do cliente</p>
          <p className="mt-2 text-[14px] leading-6 text-[#607583]">Crie sua conta agora para ver o andamento desta solicitação, receber a proposta, aceitá-la on-line e acompanhar o projeto.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={go} className="rounded-[11px] bg-[#0057b8] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#004a9d]">Criar conta e acompanhar →</button>
            <button type="button" onClick={() => navigate("/", { replace: true })} className="rounded-[11px] border border-[#cbd9e1] bg-white px-5 py-3 text-[13px] font-semibold text-[#45525b] hover:border-[#9fbccc]">Agora não</button>
          </div>
          <p className="mt-4 text-[12px] leading-5 text-[#7b8f9a]">Já possui conta? Na próxima tela, use a aba “Entrar” — a solicitação também será vinculada.</p>
        </div>
      </div>
    </section>
  );
}
