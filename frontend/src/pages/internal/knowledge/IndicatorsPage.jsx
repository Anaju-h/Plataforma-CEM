import { Link } from "react-router-dom";
import { Card, Loading, Pill, Stat } from "../../../components/internal/knowledge/KmUi";
import { fmt, useLoad } from "../../../components/internal/knowledge/kmUtils";
import { knowledgeApi } from "../../../services/knowledgeApi";
import { DemoBadge } from "../../../components/internal/DemoBadge";

// Evolução do fator de correção a cada caso fechado (Evoluir).
function FactorLine({ points }) {
  if (points.length < 2) return <span className="text-[12px] text-[#7b8f9a]">—</span>;
  const width = 180, height = 44, pad = 4;
  const values = points.map(point => point.factor);
  const min = Math.min(1, ...values), max = Math.max(1, ...values);
  const x = index => pad + (index * (width - 2 * pad)) / (points.length - 1);
  const y = value => height - pad - ((value - min) / (max - min || 1)) * (height - 2 * pad);
  const path = points.map((point, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(point.factor).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} role="img" aria-label={`Fator de correção de ${values[0]} para ${values.at(-1)} ao longo de ${points.length} casos`}>
      <line x1={pad} x2={width - pad} y1={y(1)} y2={y(1)} stroke="#c9d6de" strokeDasharray="3 3" />
      <path d={path} fill="none" stroke="#096ab2" strokeWidth="2" />
      <circle cx={x(points.length - 1)} cy={y(values.at(-1))} r="3" fill="#096ab2" />
    </svg>
  );
}

function IndicatorsSummary({ summary, demo = false }) {
  return (
    <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-4">
            <Stat label="Serviços fechados" value={summary.total} hint="Registros com blocos A e B." />
            <Stat label="Índice de assertividade" value={summary.assertiveness === null ? "—" : `${Number(summary.assertiveness).toLocaleString("pt-BR")}%`} hint={`Dentro de ±${Math.round(summary.tolerance * 100)}% do esforço orçado (tolerância configurável).`} tone="accent" />
            <Stat label="Com retrabalho" value={summary.reworkShare === null ? "—" : `${Number(summary.reworkShare).toLocaleString("pt-BR")}%`} />
            <Stat label="Com mudança de escopo" value={summary.scopeChangeShare === null ? "—" : `${Number(summary.scopeChangeShare).toLocaleString("pt-BR")}%`} />
          </div>

          <Card title="Por tipo de serviço" subtitle="Faixa = quartis das horas realizadas (mediana no centro). Fator = mediana de realizado ÷ orçado. Margens: mediana por tipo.">
            {!summary.types.length ? <p className="py-6 text-center text-[14px] text-[#526d7c]">{demo ? "Sem registros de demonstração fechados." : "Nenhum serviço real fechado ainda. O histórico cresce a cada serviço concluído com o bloco B preenchido."}</p> :
            <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-[14px]">
              <thead className="text-[12px] uppercase tracking-[0.06em] text-[#5f7c8c]"><tr><th className="py-2 pr-3">Tipo de serviço</th><th className="pr-3">Casos</th><th className="pr-3">Assertividade</th><th className="pr-3">Faixa de esforço</th><th className="pr-3">Fator</th><th className="pr-3">Evolução do fator</th><th className="pr-3">Margem orçada → realizada</th><th>Causas mais frequentes</th></tr></thead>
              <tbody className="divide-y divide-[#edf1f3]">{summary.types.map(type => <tr key={type.serviceTypeId} className="align-top">
                <td className="py-3 pr-3 font-semibold text-[#071f2d]">{type.serviceType}</td>
                <td className="pr-3">{type.n}</td>
                <td className="pr-3">{Number(type.assertiveness).toLocaleString("pt-BR")}%</td>
                <td className="pr-3">{fmt.hours(type.effort.q1)} – {fmt.hours(type.effort.q3)}<div className="text-[12px] text-[#7b8f9a]">mediana {fmt.hours(type.effort.median)}</div></td>
                <td className="pr-3 font-semibold">× {Number(type.correctionFactor).toLocaleString("pt-BR")}<div className="text-[12px] font-normal text-[#7b8f9a]">{type.correctionFactor > 1 ? "subestimado" : type.correctionFactor < 1 ? "superestimado" : "no alvo"}</div></td>
                <td className="pr-3"><FactorLine points={type.evolution} /></td>
                <td className="pr-3">{fmt.pct(type.budgetedMargin)} → <span className={type.realizedMargin < type.budgetedMargin ? "font-semibold text-[#9a3b2b]" : "font-semibold text-[#17704a]"}>{fmt.pct(type.realizedMargin)}</span></td>
                <td><div className="flex flex-wrap gap-1">{type.causes.slice(0, 3).map(cause => <Pill key={cause.label} tone="amber">{cause.label} · {cause.count}</Pill>)}</div></td>
              </tr>)}</tbody>
            </table></div>}
          </Card>

          {summary.records.length > 0 && <Card title="Por registro" subtitle="Desvios = (realizado − orçado) ÷ orçado. Margem = (valor − custo) ÷ valor.">
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-[14px]">
              <thead className="text-[12px] uppercase tracking-[0.06em] text-[#5f7c8c]"><tr><th className="py-2 pr-3">Registro</th><th className="pr-3">Tipo</th><th className="pr-3">Esforço</th><th className="pr-3">Custo</th><th className="pr-3">Prazo</th><th className="pr-3">Margem orçada</th><th className="pr-3">Margem realizada</th><th>Fechado</th></tr></thead>
              <tbody className="divide-y divide-[#edf1f3]">{summary.records.map(row => <tr key={row.code}>
                <td className="py-2 pr-3"><Link className="font-semibold text-[#0b5ea8] hover:underline" to={`../registros/${row.code}`}>{row.code}</Link> {row.demo && <DemoBadge className="ml-1" />}</td>
                <td className="pr-3">{row.serviceType}</td>
                <td className="pr-3">{fmt.signedPct(row.effortDeviation)}</td>
                <td className="pr-3">{fmt.signedPct(row.costDeviation)}</td>
                <td className="pr-3">{fmt.signedPct(row.scheduleDeviation)}</td>
                <td className="pr-3">{fmt.pct(row.budgetedMargin)}</td>
                <td className="pr-3">{fmt.pct(row.realizedMargin)}</td>
                <td>{fmt.date(row.closedAt)}</td>
              </tr>)}</tbody>
            </table></div>
          </Card>}
            </div>
  );
}

export function IndicatorsPage() {
  const state = useLoad(() => knowledgeApi.indicators(), []);
  const data = state.data;
  return (
    <div className="space-y-5">
      <Loading state={state}>
        {data && <>
          <div>
            <h2 className="text-[17px] font-semibold text-[#071f2d]">Histórico real do laboratório</h2>
            <p className="mt-1 text-[13px] text-[#5f7c8c]">Somente serviços reais. Registros de demonstração nunca entram nestes números.</p>
          </div>
          <IndicatorsSummary summary={data} />
          {data.demo && <section className="space-y-4 rounded-[18px] border border-dashed border-[#d9cdf2] bg-[#faf8fe] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <DemoBadge />
              <h2 className="text-[17px] font-semibold text-[#3d2a70]">Demonstração (separada do histórico real)</h2>
            </div>
            <p className="text-[13px] text-[#5b4a85]">Dados fictícios usados para mostrar o mecanismo funcionando. Ficam fora dos indicadores reais e somem ao apagar a demonstração em Administração.</p>
            <IndicatorsSummary summary={data.demo} demo />
          </section>}
        </>}
      </Loading>
    </div>
  );
}
