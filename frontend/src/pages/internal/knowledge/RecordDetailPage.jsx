import { useState } from "react";
import { Link, useLocation, useOutletContext, useParams } from "react-router-dom";
import { Card, ErrorBox, Label, Loading, Pill, RestrictedTag, Stat, SuccessBox, TermChips } from "../../../components/internal/knowledge/KmUi";
import { LESSON_TONES, areaClass, btn, fmt, inputClass, useLoad } from "../../../components/internal/knowledge/kmUtils";
import { hasRole } from "../../../services/authApi";
import { knowledgeApi } from "../../../services/knowledgeApi";
import { DemoBadge } from "../../../components/internal/DemoBadge";

function Row({ label, children }) {
  return <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-3 border-b border-[#f0f4f6] py-2 text-[14px] last:border-0"><span className="text-[#6a808d]">{label}</span><span className="text-[#17394f]">{children ?? "—"}</span></div>;
}

export function RecordDetailPage() {
  const { code } = useParams();
  const location = useLocation();
  const { user, vocabulary, reloadNotices } = useOutletContext();
  const state = useLoad(() => knowledgeApi.record(code), [code]);
  const record = state.data;
  return (
    <Loading state={state}>
      {record && <div className="space-y-5">
        {location.state?.created && <SuccessBox>Registro {record.code} criado com o bloco A. Feche-o (blocos B e C) quando o serviço terminar.</SuccessBox>}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="../registros" className="text-[13px] font-semibold text-[#0b5ea8] hover:underline">← Registros</Link>
          <h2 className="ml-2 text-[22px] font-semibold tracking-[-0.03em] text-[#071f2d]">{record.code}</h2>
          {record.demo && <DemoBadge />}
          <RestrictedTag value={record.confidentiality} />
          {record.projectCode && <Link to={`/portal/projetos/${record.projectCode}`} className="text-[13px] font-semibold text-[#0b5ea8] hover:underline">{record.projectCode}</Link>}
          {record.status === "OPEN" ? <Pill tone="amber">Aberto · falta B e C</Pill> : <Pill tone="green">Fechado</Pill>}
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Card title="A · Orçado" subtitle={`por ${record.a.estimatedBy} em ${fmt.date(record.a.estimatedAt)}`}>
            <Row label="Tipo de serviço">{record.a.serviceType?.label}</Row>
            <Row label="Porte">{record.a.size?.label}</Row>
            <Row label="Material">{record.a.material?.label}</Row>
            <Row label="Complexidade">{record.a.complexity?.label}</Row>
            <Row label="Características">{record.a.featureCount?.label}</Row>
            <Row label="GD&T">{record.a.gdt?.label}</Row>
            <Row label="Recursos">{record.a.resources.map(item => item.label).join(", ") || "—"}</Row>
            <Row label="Esforço estimado">{fmt.hours(record.a.estimatedHours)}</Row>
            <Row label="Custo estimado">{fmt.money(record.a.estimatedCost)}</Row>
            <Row label="Valor proposto">{fmt.money(record.a.proposedValue)}</Row>
            <Row label="Entrega prevista">{fmt.date(record.a.plannedDelivery)}</Row>
            <Row label="ORC / cliente">{[record.quoteCode, record.clientCode].filter(Boolean).join(" · ") || "—"}</Row>
            <Row label="Premissas"><span className="whitespace-pre-line">{record.a.assumptions}</span></Row>
            {record.a.recommendation && <Row label="Assistente no orçamento">{record.a.recommendation.n} caso(s) · {record.a.recommendation.range ? `faixa ${fmt.hours(record.a.recommendation.range.q1)}–${fmt.hours(record.a.recommendation.range.q3)}` : "sem faixa"}{record.a.recommendation.caseCodes?.length ? <span className="block text-[12px] text-[#6a808d]">Casos: {record.a.recommendation.caseCodes.join(", ")}</span> : null}</Row>}
            {record.a.deviationJustification && <Row label="Justificativa">{record.a.deviationJustification}</Row>}
          </Card>

          <Card title="B · Realizado" subtitle={record.b ? `fechado por ${record.b.closedBy} em ${fmt.date(record.b.closedAt)}` : "Preenchido ao fechar o serviço."}>
            {record.b ? <>
              <Row label="Esforço real">{fmt.hours(record.b.actualHours)}</Row>
              <Row label="Custo real">{fmt.money(record.b.actualCost)}</Row>
              <Row label="Valor faturado">{fmt.money(record.b.billedValue)}</Row>
              <Row label="Entrega real">{fmt.date(record.b.actualDelivery)}</Row>
              <Row label="Retrabalho">{record.b.rework ? "Sim" : "Não"}</Row>
              <Row label="Mudança de escopo">{record.b.scopeChange ? "Sim" : "Não"}</Row>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Stat label="Desvio de esforço" value={fmt.signedPct(record.indicators.effortDeviation)} />
                <Stat label="Desvio de custo" value={fmt.signedPct(record.indicators.costDeviation)} />
                <Stat label="Desvio de prazo" value={fmt.signedPct(record.indicators.scheduleDeviation)} />
                <Stat label="Margem orçada → realizada" value={`${fmt.pct(record.indicators.budgetedMargin)} → ${fmt.pct(record.indicators.realizedMargin)}`} />
              </div>
            </> : <p className="text-[14px] text-[#6a808d]">Aguardando o fechamento do serviço.</p>}
          </Card>

          <Card title="C · Aprendizado" subtitle="Causa do desvio (vocabulário) e lição aprendida.">
            {record.causes.length > 0 && <div className="mb-3 flex flex-wrap gap-2">{record.causes.map(cause => <Pill key={cause.id} tone="amber">{cause.label}</Pill>)}</div>}
            {record.lessons.length ? record.lessons.map(lesson => <div key={lesson.code} className="rounded-[12px] border border-[#e2e9ee] p-3">
              <div className="flex flex-wrap items-center gap-2"><span className="text-[12px] font-semibold text-[#0b5ea8]">{lesson.code}</span><Pill tone={LESSON_TONES[lesson.status]}>{lesson.statusLabel}</Pill></div>
              <p className="mt-1.5 text-[14px] font-semibold text-[#071f2d]">{lesson.title}</p>
              <p className="mt-1 text-[14px] leading-6 text-[#34505f]">{lesson.body}</p>
              <p className="mt-2 text-[12px] text-[#6a808d]">{lesson.feedsRecommendations ? "Alimenta o Assistente." : "Ainda não alimenta o Assistente (só conhecimento formalizado)."} <Link to="../licoes" className="font-semibold text-[#0b5ea8] hover:underline">Ir para validação →</Link></p>
            </div>) : <p className="text-[14px] text-[#6a808d]">Preenchido junto com o bloco B.</p>}
          </Card>
        </div>

        {record.status === "OPEN" && hasRole(user, "TECNICO") && <CloseForm record={record} vocabulary={vocabulary} onClosed={() => { state.reload(); reloadNotices(); }} />}
      </div>}
    </Loading>
  );
}

function CloseForm({ record, vocabulary, onClosed }) {
  const [form, setForm] = useState({ actualHours: record.loggedHours > 0 ? String(record.loggedHours) : "", actualCost: "", billedValue: "", actualDelivery: "", rework: "", scopeChange: "", causeIds: [], title: "", body: "", subjectIds: [], confidentiality: record.confidentiality, submit: true });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = key => value => setForm(current => ({ ...current, [key]: value }));
  const deviation = form.actualHours ? (Number(form.actualHours) - Number(record.a.estimatedHours)) / Number(record.a.estimatedHours) : null;

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      await knowledgeApi.closeRecord(record.code, {
        actualHours: Number(form.actualHours), actualCost: form.actualCost === "" ? null : Number(form.actualCost), billedValue: form.billedValue === "" ? null : Number(form.billedValue),
        actualDelivery: form.actualDelivery || null, rework: form.rework === "" ? null : form.rework === "yes", scopeChange: form.scopeChange === "" ? null : form.scopeChange === "yes",
        causeIds: form.causeIds, lesson: { title: form.title, body: form.body, subjectIds: form.subjectIds, confidentiality: form.confidentiality, submit: form.submit },
      });
      onClosed();
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }
  const yesNo = key => <select className={inputClass} required value={form[key]} onChange={event => set(key)(event.target.value)}><option value="">Selecione</option><option value="no">Não</option><option value="yes">Sim</option></select>;

  return (
    <Card title="Fechar o serviço — blocos B e C" subtitle="Obrigatórios: sem eles o serviço não pode ser concluído e o histórico não se forma.">
      <form className="grid gap-3.5 md:grid-cols-3" onSubmit={submit}>
        {record.loggedHours > 0 && <p className="md:col-span-3 rounded-[12px] border border-[#cbdde6] bg-[#edf6fa] px-4 py-3 text-[13px] leading-5 text-[#34505f]">Esforço preenchido com as <strong>{fmt.hours(record.loggedHours)}</strong> apontadas pela equipe nas tarefas do {record.projectCode}. Ajuste se houver horas fora do sistema.</p>}
        <Label label="Esforço realmente gasto (h)" required hint={deviation !== null ? `Desvio: ${fmt.signedPct(deviation)} sobre ${fmt.hours(record.a.estimatedHours)} orçadas` : undefined}><input className={inputClass} type="number" min="0.5" step="0.5" required value={form.actualHours} onChange={event => set("actualHours")(event.target.value)} /></Label>
        <Label label="Data real de entrega" required><input className={inputClass} type="date" required value={form.actualDelivery} onChange={event => set("actualDelivery")(event.target.value)} /></Label>
        <Label label="Custo real (R$)"><input className={inputClass} type="number" min="0" step="0.01" value={form.actualCost} onChange={event => set("actualCost")(event.target.value)} /></Label>
        <Label label="Valor faturado (R$)"><input className={inputClass} type="number" min="0" step="0.01" value={form.billedValue} onChange={event => set("billedValue")(event.target.value)} /></Label>
        <Label label="Houve retrabalho?" required>{yesNo("rework")}</Label>
        <Label label="Houve mudança de escopo?" required>{yesNo("scopeChange")}</Label>
        <div className="md:col-span-3"><TermChips vocabulary={vocabulary} classCode="DEVIATION_CAUSE" values={form.causeIds} onChange={set("causeIds")} label="Causa do desvio (lista padronizada)" required /></div>
        <div className="md:col-span-3"><Label label="Lição aprendida — título" required><input className={inputClass} required maxLength={200} value={form.title} onChange={event => set("title")(event.target.value)} placeholder="Ex.: Fixação de peças fundidas exige dispositivo dedicado" /></Label></div>
        <div className="md:col-span-3"><Label label="Lição aprendida — o que fazer diferente" required><textarea className={areaClass} required value={form.body} onChange={event => set("body")(event.target.value)} /></Label></div>
        <div className="md:col-span-3 space-y-3 rounded-[12px] bg-[#f7fafb] p-4">
          <p className="text-[13px] text-[#526d7c]">Assuntos relacionados: tipo de serviço, porte e causas entram automaticamente. Acrescente outros para quem assina esses assuntos ser avisado.</p>
          <TermChips vocabulary={vocabulary} classCode="MATERIAL" values={form.subjectIds} onChange={set("subjectIds")} />
          <TermChips vocabulary={vocabulary} classCode="GDT" values={form.subjectIds} onChange={set("subjectIds")} />
          <TermChips vocabulary={vocabulary} classCode="RESOURCE" values={form.subjectIds} onChange={set("subjectIds")} />
        </div>
        <Label label="Sigilo da lição">
          <select className={inputClass} value={form.confidentiality} onChange={event => set("confidentiality")(event.target.value)}><option value="PUBLIC">Interno público</option><option value="RESTRICTED">Restrito</option></select>
        </Label>
        <label className="flex items-center gap-2 self-end pb-2 text-[13px] text-[#34505f] md:col-span-2"><input type="checkbox" checked={form.submit} onChange={event => set("submit")(event.target.checked)} /> Enviar a lição para validação agora</label>
        <div className="md:col-span-3 space-y-3"><ErrorBox>{error}</ErrorBox><button type="submit" disabled={busy} className={btn("success")}>{busy ? "Fechando…" : "Fechar serviço com B e C"}</button></div>
      </form>
    </Card>
  );
}
