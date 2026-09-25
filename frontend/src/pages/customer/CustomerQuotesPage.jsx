import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { getCustomerQuotes, respondToCustomerProposal } from "../../services/customer/customerService";
import { useCustomerData } from "../../hooks/useCustomerData";
import { CustomerListLayout, CustomerListPanel, CustomerListRow, CustomerStatus } from "../../components/customer/CustomerListLayout";
import { ProposalPreview } from "../../components/internal/proposal/ProposalPreview";
import { downloadProposalBlob, renderProposalPdf } from "../../services/proposalPdfService";
import "../../styles/proposal.css";

const currency = value => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ConfirmDialog({ pending, busy, onCancel, onConfirm }) {
  if (!pending) return null;
  const accept = pending.type === "accepted";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071f2d]/45 p-5" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="w-full max-w-[460px] rounded-[18px] bg-white p-7 shadow-[0_30px_80px_rgba(7,31,45,0.25)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">{pending.quote.id} · Proposta V{pending.document.version}</p>
        <h2 id="confirm-title" className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#071f2d]">{accept ? "Confirmar aceite da proposta?" : "Confirmar recusa da proposta?"}</h2>
        <p className="mt-3 text-[14px] leading-6 text-[#607583]">
          {accept
            ? <>Ao aceitar, você aprova o escopo e o investimento de <strong>{currency(pending.document.snapshot?.total)}</strong>. O laboratório será avisado para iniciar o projeto.</>
            : "A recusa encerra esta proposta. Se preferir ajustes, fale com o laboratório antes de recusar."}
        </p>
        {pending.note && <p className="mt-3 rounded-[10px] bg-[#f4f7f9] p-3 text-[13px] text-[#45525b]">Observação: {pending.note}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" disabled={busy} onClick={onCancel} className="rounded-[10px] border border-[#cbd9e1] px-4 py-2.5 text-[13px] font-semibold text-[#45525b]">Voltar</button>
          <button type="button" disabled={busy} onClick={onConfirm} className={`rounded-[10px] px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60 ${accept ? "bg-[#0057b8] hover:bg-[#004a9d]" : "bg-[#9a4a35] hover:bg-[#843d2b]"}`}>
            {busy ? "Registrando…" : accept ? "Sim, aceitar proposta" : "Sim, recusar proposta"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CustomerQuotesPage() {
  const { customer } = useOutletContext();
  const [params] = useSearchParams();
  const focus = params.get("orc");
  const state = useCustomerData(getCustomerQuotes);
  const [selected, setSelected] = useState(null);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const previewRef = useRef(null);

  // Deep link (?orc=ORC-0001): abre a versão mais recente daquele orçamento até o cliente escolher outra.
  const [dismissedFocus, setDismissedFocus] = useState(false);
  const focused = useMemo(() => {
    const quote = focus && !dismissedFocus ? state.data?.find(item => item.id === focus) : null;
    const document = quote?.versions.at(-1);
    return quote && document ? { quote, document } : null;
  }, [focus, dismissedFocus, state.data]);
  const current = selected || focused;
  const select = value => { setSelected(value); setDismissedFocus(true); };

  useEffect(() => { if (current) previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [current]);

  async function confirm() {
    const { quote, document, type } = pending;
    setBusy(true); setError(""); setSuccess("");
    try {
      await respondToCustomerProposal(quote, document, type, note);
      setSuccess(type === "accepted" ? `Proposta V${document.version} aceita. O laboratório foi avisado e iniciará o projeto.` : "Recusa registrada. Obrigado pelo retorno.");
      select(null); setNote(""); setPending(null); state.retry();
    } catch (cause) { setError(cause.message); setPending(null); } finally { setBusy(false); }
  }

  return <CustomerListLayout company={customer.company.name} title="Orçamentos" description="Consulte suas propostas comerciais e registre sua resposta.">
    {error && <p role="alert" className="mt-5 rounded-[10px] border border-[#e3c5bc] bg-[#faf0ed] p-4 text-[13px] text-[#8f5544]">{error}</p>}
    {success && <p role="status" className="mt-5 rounded-[10px] bg-[#edf8f2] p-4 text-[13px] text-[#16704a]">{success}</p>}
    <CustomerListPanel columns={["Orçamento", "Serviço", "Proposta / versão", "Status"]} state={state}
      emptyTitle="Nenhum orçamento disponível por enquanto." emptyDescription="Quando o laboratório disponibilizar uma proposta, ela aparecerá aqui.">
    {state.data?.map(quote => <CustomerListRow key={quote.id} details={quote.versions.length > 0 && <div className="mt-4 space-y-3 border-t border-[#edf1f3] pt-4">
      {quote.versions.map(document => <div key={document.version} className={`flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-[10px] p-3 ${current?.quote.id === quote.id && current?.document.version === document.version ? "bg-[#e8f1fa] ring-1 ring-[#9cc1e3]" : "bg-[#f8fafb]"}`}>
        <div className="min-w-0 text-[13px] leading-6 text-[#45525b]"><p>Proposta V{document.version} • {document.statusLabel}</p>
        <p className="font-semibold text-[#071f2d]">{currency(document.snapshot?.total)}</p></div>
        <div className="flex flex-wrap gap-2"><button className="rounded-[9px] bg-[#0057b8] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#004a9d]" onClick={() => { select({ quote, document }); setNote(""); }}>{quote.canRespond && document.status === "generated" ? `Ver e responder V${document.version}` : `Visualizar proposta V${document.version}`}</button>
        <button className="rounded-[9px] border border-[#cbd9e1] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#45525b] disabled:opacity-50" disabled={busy} onClick={async () => {
          setBusy(true); setError("");
          try { downloadProposalBlob(await renderProposalPdf(document), document.pdfFileName); }
          catch (cause) { setError(cause.message); } finally { setBusy(false); }
        }}>Baixar PDF</button></div>
      </div>)}
    </div>}>
      <div><p className="text-[14px] font-semibold text-[#071f2d]">{quote.id}</p><Link to={"/cliente/solicitacoes/" + quote.requestId} className="mt-1 inline-flex text-[12px] text-[#6a808d] hover:underline">Solicitação: {quote.requestId}</Link></div>
      <div><p className="text-[14px] font-medium text-[#34424b]">{quote.service}</p></div>
      <div className="text-[12px] leading-5 text-[#89939a]">{quote.versions.length ? `${quote.versions.length} versão(ões) disponível(is)` : "A proposta está sendo preparada pelo laboratório."}
        {quote.projectId && <Link to="/cliente/projetos" className="mt-1 block font-semibold text-[#0057b8] hover:underline">Projeto {quote.projectId} →</Link>}</div>
      <div><CustomerStatus tone={quote.tone}>{quote.status}</CustomerStatus></div>
    </CustomerListRow>)}
    </CustomerListPanel>
    {current && <section ref={previewRef} className="proposal-workspace mt-6 min-w-0 scroll-mt-24" aria-label="Proposta selecionada">
      <ProposalPreview document={current.document} />
      {current.quote.canRespond && current.document.status === "generated" && <div className="rounded-xl bg-white p-6">
        <p className="text-[15px] font-semibold text-[#071f2d]">Sua resposta para a proposta V{current.document.version}</p>
        <label className="mt-3 block text-[13px] text-[#45525b]">Observação ou motivo da recusa (opcional)<textarea className="mt-2 block min-h-24 w-full rounded-[9px] border border-[#cbd9e1] p-3" value={note} onChange={event => setNote(event.target.value)} /></label>
        <div className="mt-4 flex flex-wrap gap-3"><button className="proposal-button proposal-primary" disabled={busy} onClick={() => setPending({ quote: current.quote, document: current.document, type: "accepted", note })}>Aceitar proposta V{current.document.version}</button>
        <button className="proposal-button" disabled={busy} onClick={() => setPending({ quote: current.quote, document: current.document, type: "rejected", note })}>Recusar proposta</button></div>
      </div>}
    </section>}
    <ConfirmDialog pending={pending} busy={busy} onCancel={() => setPending(null)} onConfirm={confirm} />
  </CustomerListLayout>;
}
