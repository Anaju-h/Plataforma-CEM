import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { getCustomerQuotes } from "../../services/customer/customerService";
import { ProposalPreview } from "../../components/internal/proposal/ProposalPreview";
import { downloadProposalBlob, renderProposalPdf } from "../../services/proposalPdfService";
import "../../styles/proposal.css";

export function CustomerQuotesPage() {
  const { customer } = useOutletContext();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    getCustomerQuotes().then(data => { if (active) setQuotes(data); }).catch(cause => { if (active) setError(cause.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <div className="proposal-workspace mx-auto max-w-[1180px] px-5 py-8">
    <p>{customer.company.name}</p><h1>Orçamentos</h1><p>Consulte o resultado final das propostas aceitas.</p>
    {error && <p role="alert">{error}</p>}
    {loading ? <p>Carregando orçamentos…</p> : !quotes.length ? <p>Nenhuma proposta aceita disponível.</p> : quotes.map(quote => <article key={quote.id} className="my-5 rounded-xl border border-[#dfe6ea] bg-white p-6">
      <h2>ORÇAMENTO {quote.id} • Aceito</h2>
      <p>Valor final: {quote.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
      <p>Proposta aceita: {quote.proposalId} • V{quote.document.version}</p><p>Data do aceite: {quote.acceptedAt.split("-").reverse().join("/")}</p>
      {quote.document.snapshot.media.filter(media => media.type === "file").map(media => <p key={media.id}><a href={media.dataUrl} download={media.name}>{media.name}</a></p>)}
      {quote.projectId && <p>Projeto relacionado: <Link to="/cliente/projetos">{quote.projectId}</Link></p>}
      <button onClick={() => setSelected(selected?.id === quote.id ? null : quote)}>VISUALIZAR PROPOSTA</button>
      <button disabled={busy} onClick={async () => {
        setBusy(true); setError("");
        try { downloadProposalBlob(await renderProposalPdf(quote.document), quote.pdfFileName); } catch (cause) { setError(cause.message); } finally { setBusy(false); }
      }}>BAIXAR PDF</button>
    </article>)}
    {selected && <ProposalPreview document={selected.document} />}
  </div>;
}
