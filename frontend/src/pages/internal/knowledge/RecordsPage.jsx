import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, Loading, Pill, RestrictedTag } from "../../../components/internal/knowledge/KmUi";
import { btn, fmt, inputClass, useLoad } from "../../../components/internal/knowledge/kmUtils";
import { knowledgeApi } from "../../../services/knowledgeApi";
import { DemoBadge } from "../../../components/internal/DemoBadge";

export function RecordsPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("");
  const quote = params.get("orc") || "";
  const state = useLoad(() => knowledgeApi.records({ status, quote }), [status, quote]);

  return (
    <Card title="Registros de Serviço" subtitle="Bloco A (orçado) ao enviar a proposta; blocos B (realizado) e C (aprendizado) ao fechar o serviço. Sem B e C o serviço não conclui."
      action={<Link to="../assistente" className={btn()}>Novo orçamento no Assistente</Link>}>
      <div className="mb-4 flex flex-wrap gap-3">
        <select className={`${inputClass} !mt-0 !w-auto`} value={status} onChange={event => setStatus(event.target.value)} aria-label="Situação">
          <option value="">Todas as situações</option><option value="OPEN">Abertos (aguardando B e C)</option><option value="CLOSED">Fechados</option>
        </select>
        {quote && <Pill tone="blue">Filtrando {quote}</Pill>}
      </div>
      <Loading state={state}>
        {!state.data?.length ? <p className="py-8 text-center text-[14px] text-[#526d7c]">Nenhum registro nesta seleção. Os registros são criados a partir dos orçamentos (bloco A).</p> :
        <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-[14px]">
          <thead className="text-[12px] uppercase tracking-[0.06em] text-[#5f7c8c]"><tr><th className="py-2 pr-3">Registro</th><th className="pr-3">Serviço · porte</th><th className="pr-3">ORC / cliente</th><th className="pr-3">Orçado</th><th className="pr-3">Realizado</th><th className="pr-3">Desvio</th><th>Situação</th></tr></thead>
          <tbody className="divide-y divide-[#edf1f3]">{state.data.map(record => <tr key={record.code}>
            <td className="py-2.5 pr-3"><Link className="font-semibold text-[#0b5ea8] hover:underline" to={record.code}>{record.code}</Link><div className="mt-1 flex gap-1">{record.demo && <DemoBadge />}<RestrictedTag value={record.confidentiality} /></div></td>
            <td className="pr-3">{record.serviceType}<div className="text-[12px] text-[#7b8f9a]">{record.size}</div></td>
            <td className="pr-3">{record.quoteCode || "—"}<div className="text-[12px] text-[#7b8f9a]">{record.clientCode || ""}</div></td>
            <td className="pr-3">{fmt.hours(record.estimatedHours)}</td>
            <td className="pr-3">{fmt.hours(record.actualHours)}</td>
            <td className="pr-3">{fmt.signedPct(record.deviation)}</td>
            <td>{record.status === "OPEN" ? <Pill tone="amber">Aberto · falta B e C</Pill> : <Pill tone="green">Fechado {fmt.date(record.closedAt)}</Pill>}</td>
          </tr>)}</tbody>
        </table></div>}
      </Loading>
    </Card>
  );
}
