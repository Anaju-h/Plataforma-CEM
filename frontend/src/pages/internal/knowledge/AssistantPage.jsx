import { useState } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { Card, ErrorBox, Label, Pill, RestrictedTag, Stat, TermChips, TermSelect } from "../../../components/internal/knowledge/KmUi";
import { CONFIDENCE_TONES, areaClass, btn, fmt, inputClass } from "../../../components/internal/knowledge/kmUtils";
import { hasRole } from "../../../services/authApi";
import { knowledgeApi } from "../../../services/knowledgeApi";
import { DemoBadge } from "../../../components/internal/DemoBadge";

export function AssistantPage() {
  const { user, vocabulary } = useOutletContext();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState({ serviceTypeId: null, sizeId: null, materialId: null, complexityId: null, featureCountId: null, gdtId: null });
  const [result, setResult] = useState(null);
  const [showCases, setShowCases] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [record, setRecord] = useState({ quoteCode: params.get("orc") || "", clientCode: "", resourceIds: [], estimatedHours: "", estimatedCost: "", proposedValue: "", plannedDelivery: "", assumptions: "", confidentiality: "PUBLIC", deviationJustification: "" });
  const [saveError, setSaveError] = useState("");
  // O bloco A nasce do orçamento, atribuição do Administrador.
  const canRecord = hasRole(user, "ADMIN");
  const set = key => value => setQuery(current => ({ ...current, [key]: value }));
  const setR = key => value => setRecord(current => ({ ...current, [key]: value }));

  async function consult(event) {
    event?.preventDefault();
    setBusy(true); setError("");
    try { setResult(await knowledgeApi.recommend({ ...query, estimateHours: record.estimatedHours ? Number(record.estimatedHours) : null })); setShowCases(false); }
    catch (cause) { setError(cause.message); setResult(null); }
    finally { setBusy(false); }
  }

  const estimate = Number(record.estimatedHours) || null;
  const outside = result?.range && estimate !== null && (estimate < result.range.q1 || estimate > result.range.q3);

  async function save(event) {
    event.preventDefault();
    setBusy(true); setSaveError("");
    try {
      const created = await knowledgeApi.createRecord({
        ...query, quoteCode: record.quoteCode, clientCode: record.clientCode, resourceIds: record.resourceIds,
        estimatedHours: Number(record.estimatedHours), estimatedCost: record.estimatedCost === "" ? null : Number(record.estimatedCost),
        proposedValue: record.proposedValue === "" ? null : Number(record.proposedValue), plannedDelivery: record.plannedDelivery || null,
        assumptions: record.assumptions, confidentiality: record.confidentiality, deviationJustification: record.deviationJustification,
      });
      navigate(`../registros/${created.code}`, { state: { created: true } });
    } catch (cause) { setSaveError(cause.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="space-y-5">
        <Card title="1. Descreva o novo orçamento" subtitle="Classificação somente pelo vocabulário controlado — sem texto livre, para que os casos sejam comparáveis.">
          <form className="space-y-3.5" onSubmit={consult}>
            <TermSelect vocabulary={vocabulary} classCode="SERVICE_TYPE" value={query.serviceTypeId} onChange={set("serviceTypeId")} required />
            <TermSelect vocabulary={vocabulary} classCode="SIZE" value={query.sizeId} onChange={set("sizeId")} required />
            <TermSelect vocabulary={vocabulary} classCode="MATERIAL" value={query.materialId} onChange={set("materialId")} />
            <TermSelect vocabulary={vocabulary} classCode="COMPLEXITY" value={query.complexityId} onChange={set("complexityId")} />
            <TermSelect vocabulary={vocabulary} classCode="FEATURE_COUNT" value={query.featureCountId} onChange={set("featureCountId")} />
            <TermSelect vocabulary={vocabulary} classCode="GDT" value={query.gdtId} onChange={set("gdtId")} />
            <ErrorBox>{error}</ErrorBox>
            <button type="submit" disabled={busy} className={`${btn()} w-full`}>{busy ? "Consultando…" : "Consultar histórico"}</button>
          </form>
        </Card>
      </div>

      <div className="min-w-0 space-y-5">
        {!result && <Card><p className="py-10 text-center text-[14px] leading-6 text-[#526d7c]">Escolha o tipo de serviço e o porte para ver o que o laboratório já sabe sobre casos parecidos.<br />O Assistente sugere; quem orça decide — e justifica quando decidir diferente.</p></Card>}
        {result && <AssistantResult result={result} showCases={showCases} setShowCases={setShowCases} />}

        {result && <Card title="2. Registrar o orçamento (Bloco A — Orçado)" subtitle={canRecord ? "Grava o que foi orçado e as premissas. Os blocos B e C são preenchidos ao fechar o serviço." : "Seu perfil (Consulta) não registra orçamentos."}>
          {canRecord ? <form className="grid gap-3.5 md:grid-cols-2" onSubmit={save}>
            <Label label="Orçamento (ORC)" hint="Vincula o registro ao ORC; o projeto só conclui com o registro fechado."><input className={inputClass} value={record.quoteCode} onChange={event => setR("quoteCode")(event.target.value)} placeholder="ORC-0001" /></Label>
            <Label label="Cliente (código)" hint="Identifique por código; nunca pelo nome."><input className={inputClass} value={record.clientCode} onChange={event => setR("clientCode")(event.target.value)} placeholder="CLI-0001" /></Label>
            <Label label="Esforço estimado (h)" required><input className={inputClass} type="number" min="0.5" step="0.5" required value={record.estimatedHours} onChange={event => setR("estimatedHours")(event.target.value)} /></Label>
            <Label label="Entrega prevista"><input className={inputClass} type="date" value={record.plannedDelivery} onChange={event => setR("plannedDelivery")(event.target.value)} /></Label>
            <Label label="Custo estimado (R$)" hint="Interno — nunca aparece ao cliente."><input className={inputClass} type="number" min="0" step="0.01" value={record.estimatedCost} onChange={event => setR("estimatedCost")(event.target.value)} /></Label>
            <Label label="Valor proposto (R$)"><input className={inputClass} type="number" min="0" step="0.01" value={record.proposedValue} onChange={event => setR("proposedValue")(event.target.value)} /></Label>
            <div className="md:col-span-2"><TermChips vocabulary={vocabulary} classCode="RESOURCE" values={record.resourceIds} onChange={setR("resourceIds")} label="Recursos previstos" /></div>
            <div className="md:col-span-2"><Label label="Premissas assumidas" required hint={result.guidance ? "Use o roteiro de estimativa como checklist." : undefined}><textarea className={areaClass} required value={record.assumptions} onChange={event => setR("assumptions")(event.target.value)} placeholder="Ex.: desenho rev. C recebido; 1 peça; estabilização térmica de 2 h; relatório padrão." /></Label></div>
            {outside && <div className="md:col-span-2 rounded-[12px] border border-[#f0d49a] bg-[#fff8e8] p-4">
              <p className="text-[14px] font-semibold text-[#7a5000]">Sua estimativa ({fmt.hours(estimate)}) está fora da faixa provável ({fmt.hours(result.range.q1)} – {fmt.hours(result.range.q3)}).</p>
              <p className="mt-1 text-[13px] text-[#7a5a1a]">Tudo bem orçar diferente — mas justifique. A justificativa também vira conhecimento.</p>
              <textarea className={areaClass} required value={record.deviationJustification} onChange={event => setR("deviationJustification")(event.target.value)} placeholder="Por que este caso é diferente dos anteriores?" />
            </div>}
            <Label label="Sigilo">
              <select className={inputClass} value={record.confidentiality} onChange={event => setR("confidentiality")(event.target.value)}>
                <option value="PUBLIC">Interno público (todos os perfis)</option>
                <option value="RESTRICTED">Restrito (Validador e Administrador)</option>
              </select>
            </Label>
            <div className="md:col-span-2 space-y-3"><ErrorBox>{saveError}</ErrorBox><button type="submit" disabled={busy} className={btn()}>Registrar orçamento</button></div>
          </form> : <p className="text-[13px] text-[#526d7c]">O registro do orçamento (bloco A) é feito pelo Administrador junto com o ORC.</p>}
        </Card>}
      </div>
    </div>
  );
}

function AssistantResult({ result, showCases, setShowCases }) {
  const confidence = result.confidence;
  return (
    <>
      <Card title={`${result.serviceType} · porte ${result.size}`} action={<Pill tone={CONFIDENCE_TONES[confidence.level]}>{confidence.label} · {result.n} caso(s)</Pill>}>
        <p className="text-[14px] leading-6 text-[#34505f]">{confidence.message}</p>
        {result.demoCases > 0 && <p className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[#5b3aa5]"><DemoBadge /> {result.demoCases} dos {result.n} casos são de demonstração.</p>}
        {(result.excluded.awaitingValidation > 0 || result.excluded.superseded > 0) && <p className="mt-2 text-[13px] text-[#6a808d]">Fora do cálculo: {result.excluded.awaitingValidation} caso(s) aguardando validação e {result.excluded.superseded} com conhecimento superado.</p>}

        {(result.range || result.factor) && <div className="mt-5 grid gap-3 md:grid-cols-3">
          {result.range && <Stat tone="accent" label="Faixa provável de esforço" value={`${fmt.hours(result.range.q1)} – ${fmt.hours(result.range.q3)}`} hint={`Mediana ${fmt.hours(result.range.median)} (1º a 3º quartil das horas realizadas). Orçado típico: ${fmt.hours(result.range.estimatedMedian)}.`} />}
          {result.factor ? <Stat tone="accent" label="Fator de correção" value={`× ${Number(result.factor.value).toLocaleString("pt-BR")}`} hint={result.factor.explanation + (result.factor.corrected ? ` Sua estimativa corrigida: ${fmt.hours(result.factor.corrected)}.` : "")} />
            : result.range && <Stat label="Fator de correção" value="—" hint="Só com 15 casos ou mais. O Assistente não finge saber." />}
          {result.assertiveness !== null && <Stat label="Assertividade histórica" value={`${Number(result.assertiveness).toLocaleString("pt-BR")}%`} hint={`Casos dentro de ±${Math.round(result.tolerance * 100)}% do orçado.`} />}
        </div>}

        {result.causes.length > 0 && <div className="mt-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#4f6b7b]">Causas de desvio mais frequentes</p>
          <div className="mt-2 flex flex-wrap gap-2">{result.causes.map(cause => <Pill key={cause.id} tone="amber">{cause.label} · {cause.count}</Pill>)}</div>
        </div>}

        {result.n > 0 && <div className="mt-5 border-t border-[#e6edf1] pt-4">
          <button type="button" className={btn("secondary")} onClick={() => setShowCases(!showCases)} aria-expanded={showCases}>{showCases ? "Ocultar casos" : `Ver os ${result.n} casos que geraram esta recomendação`}</button>
          {showCases && <CasesTable cases={result.cases} />}
        </div>}
        <details className="mt-4 text-[13px] text-[#526d7c]"><summary className="cursor-pointer font-semibold text-[#34505f]">Como o Assistente calcula</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">{Object.values(result.rule).map(text => <li key={text}>{text}</li>)}</ul>
        </details>
      </Card>

      {result.lessons.length > 0 && <Card title="Lições formalizadas relacionadas" subtitle="Somente conhecimento validado. Superado e em validação não entram.">
        <ul className="space-y-3">{result.lessons.map(lesson => <li key={lesson.code} className="rounded-[12px] border border-[#e2e9ee] p-4">
          <div className="flex flex-wrap items-center gap-2"><span className="text-[12px] font-semibold text-[#0b5ea8]">{lesson.code}</span>{lesson.demo && <DemoBadge />}<RestrictedTag value={lesson.confidentiality} /></div>
          <p className="mt-1.5 text-[15px] font-semibold text-[#071f2d]">{lesson.title}</p>
          <p className="mt-1 text-[14px] leading-6 text-[#34505f]">{lesson.body}</p>
          <p className="mt-2 text-[12px] text-[#6a808d]">Relacionada por: {lesson.matches.join(", ")} · validada por {lesson.validatedBy || "—"}</p>
        </li>)}</ul>
      </Card>}

      {result.guidance && <Card title={result.n === 0 ? "Roteiro de estimativa (sem histórico)" : "Roteiro de estimativa"} subtitle="Do vocabulário: útil desde o primeiro dia, mesmo sem nenhum caso.">
        <p className="whitespace-pre-line text-[14px] leading-7 text-[#34505f]">{result.guidance}</p>
      </Card>}
    </>
  );
}

function CasesTable({ cases }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-[13px]">
        <thead className="text-[12px] uppercase tracking-[0.06em] text-[#5f7c8c]"><tr>
          <th className="py-2 pr-3">Registro</th><th className="pr-3">Semelhança</th><th className="pr-3">Orçado</th><th className="pr-3">Realizado</th><th className="pr-3">Desvio</th><th className="pr-3">Causas</th><th>Lição</th>
        </tr></thead>
        <tbody className="divide-y divide-[#edf1f3]">{cases.map(item => <tr key={item.code} className="align-top">
          <td className="py-2.5 pr-3"><Link to={`../registros/${item.code}`} className="font-semibold text-[#0b5ea8] hover:underline">{item.code}</Link><div className="mt-1 flex gap-1">{item.demo && <DemoBadge />}<RestrictedTag value={item.confidentiality} /></div></td>
          <td className="pr-3 text-[#34505f]">{item.similarityOf ? `${item.similarity}/${item.similarityOf}` : "—"}<div className="text-[12px] text-[#7b8f9a]">{[item.material, item.complexity, item.featureCount, item.gdt].filter(Boolean).join(" · ")}</div></td>
          <td className="pr-3">{fmt.hours(item.estimatedHours)}</td>
          <td className="pr-3">{fmt.hours(item.actualHours)}</td>
          <td className={`pr-3 font-semibold ${item.deviation > 0.15 ? "text-[#9a3b2b]" : item.deviation < -0.15 ? "text-[#8a5a00]" : "text-[#17704a]"}`}>{fmt.signedPct(item.deviation)}</td>
          <td className="pr-3 text-[#34505f]">{item.causes.join(", ")}</td>
          <td className="text-[#34505f]">{item.lesson ? `${item.lesson.code} — ${item.lesson.title}` : "—"}</td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}
