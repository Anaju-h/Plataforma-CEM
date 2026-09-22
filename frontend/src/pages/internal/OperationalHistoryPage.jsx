import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InternalPageHeader } from "../../components/internal/InternalPageHeader";
import { getOperationalHistory } from "../../services/operationalHistoryService";

const fieldClass = "internal-field-value mt-2 h-11 min-w-0 w-full rounded-[12px] border border-[#d3dfe6] bg-[#f8fafb] px-3 py-2 text-[#294e64]";

export function OperationalHistoryPage() {

  const [filters, setFilters] = useState({ search: "", type: "", status: "", from: "", to: "" });
  const [all, setAll] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([getOperationalHistory(), getOperationalHistory(filters)])
      .then(([allItems, filteredItems]) => { if (active) { setAll(allItems); setEntries(filteredItems); } })
      .catch((error) => { if (active) setLoadError(error.message); });
    return () => { active = false; };
  }, [filters]);
  const statuses = [...new Set(all.filter(entry => !filters.type || entry.type === filters.type).map(entry => entry.record.status))];
  const change = (field, value) => setFilters(previous => ({ ...previous, [field]: value, ...(field === "type" ? { status: "" } : {}) }));
  
  return <div className="mx-auto max-w-[1500px]">
    {loadError && <p role="alert">{loadError}</p>}
    <InternalPageHeader eyebrow="Operação" title="Histórico" description="Consulta de solicitações, orçamentos e projetos encerrados." />
    <div className="mt-6 grid gap-3 rounded-[20px] border border-[#d1dde4] bg-white/80 p-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <label className="internal-field-label flex min-w-0 flex-col justify-end text-[#607989] md:col-span-2 xl:col-span-1"><span className="flex min-h-9 items-end">BUSCA</span><input type="search" value={filters.search} onChange={event => change("search", event.target.value)} className={fieldClass} /></label>
      <label className="internal-field-label flex min-w-0 flex-col justify-end text-[#607989]"><span className="flex min-h-9 items-end">Tipo de registro</span><select className={fieldClass} value={filters.type} onChange={event => change("type", event.target.value)}><option value="">Todos</option>{[...new Set(all.map(entry => entry.type))].map(type => <option key={type}>{type}</option>)}</select></label>
      <label className="internal-field-label flex min-w-0 flex-col justify-end text-[#607989]"><span className="flex min-h-9 items-end">Status final</span><select className={fieldClass} value={filters.status} onChange={event => change("status", event.target.value)}><option value="">Todos</option>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
      <label className="internal-field-label flex min-w-0 flex-col justify-end text-[#607989]"><span className="flex min-h-9 items-end">Atualizado desde</span><input type="date" className={fieldClass} value={filters.from} onChange={event => change("from", event.target.value)} /></label>
      <label className="internal-field-label flex min-w-0 flex-col justify-end text-[#607989]"><span className="flex min-h-9 items-end">Atualizado até</span><input type="date" className={fieldClass} value={filters.to} onChange={event => change("to", event.target.value)} /></label>
    </div>
    <p className="internal-help-text my-4 text-[#607989]">{entries.length} registro(s).</p>
    <div className="grid gap-4 lg:grid-cols-2">
      {entries.map(({ record, type, path, nextId }) => <article key={`${type}-${record.id}`} className="rounded-[20px] border border-[#d1dde4] bg-white/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="internal-card-title font-semibold text-[#17394f]">{record.id} · {type}</h2><span className="internal-help-text text-[#806b3d]">{record.source === "real" ? "Base real" : "Demonstração"}</span></div>
        <p className="internal-body mt-2 text-[#31566d]">{record.company}</p>
        <p className="internal-help-text mt-1 text-[#607989]">{record.service || "Serviço não informado"}</p>
        <p className="internal-help-text mt-3 font-semibold text-[#31566d]">{nextId ? `Convertido em ${nextId}` : record.status}</p>
        {record.quoteId && <p className="internal-help-text mt-1 text-[#607989]">Origem: <Link className="underline" to={`/portal/orcamentos/${record.quoteId}`}>{record.quoteId}</Link></p>}
        <p className="internal-help-text mt-1 text-[#607989]">Última atualização: {record.updatedAt ?? record.createdAt ?? "Não informada"}</p>
        <Link to={path} className="internal-help-text mt-4 inline-block font-semibold text-[#096ab2]">Visualizar →</Link>
      </article>)}
    </div>
    {!entries.length && <p className="internal-body rounded-[20px] border border-[#d1dde4] bg-white p-8 text-[#607989]">Nenhum registro encontrado para os filtros selecionados.</p>}
  </div>;
}
