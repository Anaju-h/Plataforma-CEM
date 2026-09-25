import { useCallback } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getCustomerRequest } from "../../services/customer/customerService";
import { useCustomerData } from "../../hooks/useCustomerData";
import { CustomerApiState } from "../../components/customer/CustomerApiState";
import { CustomerStatus } from "../../components/customer/CustomerListLayout";
import { customerDate } from "../../utils/customerDate";

const DOT = {
  done: "border-[#16704a] bg-[#16704a] text-white",
  current: "border-[#0057b8] bg-white text-[#0057b8] ring-4 ring-[#0057b8]/12",
  closed: "border-[#9aa6ad] bg-[#9aa6ad] text-white",
  pending: "border-[#cfdbe2] bg-white text-[#a3b3bc]",
};

export function CustomerRequestDetailPage() {
  const { requestId } = useParams();
  const location = useLocation();
  const load = useCallback(() => getCustomerRequest(requestId), [requestId]);
  const state = useCustomerData(load);
  if (!state.data) return <div className="mx-auto max-w-[1180px] px-5 py-8"><CustomerApiState {...state} /></div>;
  const request = state.data;
  const quote = request.quotes[0];
  const project = request.projects[0];

  return <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10">
    <Link to="/cliente/solicitacoes" className="text-[13px] font-semibold text-[#0057b8] hover:underline">← Minhas solicitações</Link>
    {location.state?.created && <p role="status" className="mt-5 rounded-[10px] bg-[#edf8f2] p-4 text-[13px] text-[#16704a]">Solicitação registrada com sucesso. O laboratório fará a análise técnica inicial.</p>}
    {location.state?.linked && <p role="status" className="mt-5 rounded-[10px] bg-[#edf8f2] p-4 text-[13px] text-[#16704a]">Conta pronta! Esta solicitação agora está vinculada à sua área do cliente.</p>}

    <header className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0057b8]">{request.service}</p>
        <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#071f2d]">{request.id}</h1>
        <p className="mt-1 text-[13px] text-[#6e7981]">Enviada em {customerDate(request.createdAt)} · atualizada em {customerDate(request.updatedAt)}</p>
      </div>
      <CustomerStatus tone={request.tone}>{request.status}</CustomerStatus>
    </header>

    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <section className="rounded-[14px] border border-[#dfe6ea] bg-white p-6 shadow-[0_8px_24px_rgba(7,31,45,0.03)]" aria-labelledby="journey-title">
        <h2 id="journey-title" className="text-[16px] font-semibold text-[#071f2d]">Jornada do atendimento</h2>
        <ol className="mt-6">
          {request.journey.map((step, index) => (
            <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
              {index < request.journey.length - 1 && <span aria-hidden="true" className={`absolute left-[13px] top-7 h-[calc(100%-20px)] w-px ${step.state === "done" ? "bg-[#16704a]/40" : "bg-[#dfe6ea]"}`} />}
              <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[12px] font-bold ${DOT[step.state] || DOT.pending}`}>{step.state === "done" ? "✓" : index + 1}</span>
              <div className="min-w-0 pt-0.5">
                <p className={`text-[14px] font-semibold ${step.state === "pending" ? "text-[#98a6ae]" : "text-[#071f2d]"}`}>
                  {step.label}{step.code && <span className="ml-2 font-medium text-[#0057b8]">{step.code}</span>}
                </p>
                {step.detail && <p className="mt-0.5 text-[13px] text-[#5f6f78]">{step.detail}</p>}
                {step.date && <p className="mt-0.5 text-[12px] text-[#8b959c]">{customerDate(step.date)}</p>}
                {step.key === "proposal" && step.state === "current" && quote && <Link to={"/cliente/orcamentos?orc=" + quote.id} className="mt-2 inline-flex rounded-[9px] bg-[#0057b8] px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-[#004a9d]">Ver proposta e responder →</Link>}
                {step.key === "proposal" && step.state === "done" && quote && <Link to={"/cliente/orcamentos?orc=" + quote.id} className="mt-1 inline-flex text-[12px] font-semibold text-[#0057b8] hover:underline">Ver proposta aceita</Link>}
                {step.key === "project" && project && <div className="mt-2 w-full max-w-[260px]"><div className="flex justify-between text-[11px] text-[#89939a]"><span>Progresso</span><span>{project.progress}%</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#edf1f3]"><div className="h-full rounded-full bg-[#0057b8]" style={{ width: `${project.progress}%` }} /></div>{project.estimatedDelivery && <p className="mt-1 text-[12px] text-[#8b959c]">Entrega prevista: {customerDate(project.estimatedDelivery)}</p>}</div>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-[14px] border border-[#dfe6ea] bg-white p-6 shadow-[0_8px_24px_rgba(7,31,45,0.03)]" aria-labelledby="request-title">
        <h2 id="request-title" className="text-[16px] font-semibold text-[#071f2d]">O que foi solicitado</h2>
        {request.objective && <p className="mt-3 whitespace-pre-line text-[14px] leading-6 text-[#45525b]">{request.objective}</p>}
        {request.pieces.length > 0 && <ul className="mt-5 divide-y divide-[#edf1f3] rounded-[10px] border border-[#edf1f3]">
          {request.pieces.map((piece, index) => <li key={index} className="px-4 py-3 text-[13px] text-[#45525b]"><p className="font-semibold text-[#071f2d]">{piece.quantity} × {piece.name}</p><p className="mt-0.5 text-[#7b868e]">{[piece.material, piece.dimensions].filter(Boolean).join(" · ")}</p></li>)}
        </ul>}
      </section>
    </div>
  </div>;
}
