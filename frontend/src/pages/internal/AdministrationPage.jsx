import { useState } from "react";
import { Link } from "react-router-dom";
import { CommercialRateSettings } from "../../components/internal/CommercialRateSettings";
import { InternalPageHeader } from "../../components/internal/InternalPageHeader";
import { getAttentionRules, getAuditEvents, getGeneralSettings, updateAttentionRule, updateGeneralSettings, registerAuditEvent } from "../../services/administrationService";
import { getCurrentTeamMembers } from "../../services/currentUserService";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const moduleLabels = { dashboard: "Visão geral", requests: "Solicitações", quotes: "Orçamentos", projects: "Projetos", knowledge: "Conhecimento", costs: "Equipamentos e custos", team: "Equipe", administration: "Administração" };
const tabs = [{ id: "general", label: "GERAL" }, { id: "attention", label: "REGRAS DE ATENÇÃO" }, { id: "security", label: "ACESSO" }, { id: "audit", label: "AUDITORIA" }];
const inputClass = "internal-field-value mt-2 h-11 w-full rounded-[12px] border border-[#ccdbe3] bg-[#f8fafb] px-3 text-[#294e64] disabled:text-[#748995]";
const panelClass = "rounded-[22px] border border-[#cbdbe5] bg-white/85 p-6 shadow-[0_12px_32px_rgba(7,31,45,0.04)]";

export function AdministrationPage() {
  const user = useCurrentUser();
  const teamMembers = getCurrentTeamMembers();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(getGeneralSettings);
  const [rules, setRules] = useState(getAttentionRules);
  const [events, setEvents] = useState(getAuditEvents);
  const [feedback, setFeedback] = useState("");
  const refreshAudit = () => setEvents(getAuditEvents());
  function saveSettings(event) {
    event.preventDefault();
    try {
      setSettings(updateGeneralSettings({ defaultQuoteValidityDays: Number(settings.defaultQuoteValidityDays), defaultExecutionDeadlineDays: Number(settings.defaultExecutionDeadlineDays), defaultResponsible: settings.defaultResponsible }));
      refreshAudit();
      setFeedback("Padrões salvos para novos orçamentos.");
    } catch (error) { setFeedback(error.message); }
  }
  function changeRule(id, patch) {
    updateAttentionRule(id, patch);
    setRules(getAttentionRules());
    refreshAudit();
  }
  return <div className="mx-auto max-w-[1500px]">
    <InternalPageHeader eyebrow="Gestão" title="Administração" description="Referências comerciais, padrões do orçamento e acompanhamento da operação." />
    <p className="internal-help-text mt-4 text-[#526d7c]">As alterações são mantidas nesta sessão e reiniciadas ao recarregar a página.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-3">{[["Perfil ativo", user.accessProfile], ["Usuários ativos", teamMembers.filter(member => member.status === "Ativo").length], ["Regras habilitadas", rules.filter(rule => rule.enabled).length]].map(([label, value]) => <div key={label} className="rounded-[18px] border border-[#cadce6] bg-white/65 p-5"><p className="internal-field-label text-[#607989]">{label}</p><p className="mt-2 text-xl font-semibold text-[#17394f]">{value}</p></div>)}</div>
    <nav aria-label="Configurações administrativas" className="mt-4 flex flex-wrap gap-2 rounded-[16px] border border-[#d1dde4] bg-white/80 p-2">{tabs.map(tab => <button type="button" key={tab.id} aria-current={activeTab === tab.id ? "page" : undefined} onClick={() => { setActiveTab(tab.id); if (tab.id === "audit") refreshAudit(); }} className={"internal-help-text rounded-[10px] px-4 py-2.5 font-semibold " + (activeTab === tab.id ? "bg-[#12364e] text-white" : "text-[#526d7c] hover:bg-[#edf5f9]")}>{tab.label}</button>)}</nav>
    <div className="mt-5">
      {activeTab === "general" && <>
        <CommercialRateSettings onSaved={result => { if (result.historyItem) { registerAuditEvent({ action: "Referência comercial atualizada", area: "Referência comercial", description: "Valor/hora de referência: R$ " + result.reference.hourlyRate.toFixed(2) }); refreshAudit(); } }} />
        <div className="grid items-start gap-5 xl:grid-cols-2">
          <form className={panelClass} onSubmit={saveSettings}><h2 className="internal-section-title font-semibold text-[#17394f]">Padrões para novos orçamentos</h2><p className="internal-body mt-2 text-[#526d7c]">Valores iniciais; o responsável pode ajustar cada orçamento.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="internal-field-label text-[#607989]">Validade padrão (dias)<input className={inputClass} type="number" required min="1" step="1" value={settings.defaultQuoteValidityDays} onChange={event => setSettings({ ...settings, defaultQuoteValidityDays: event.target.value })} /></label>
              <label className="internal-field-label text-[#607989]">Prazo padrão (dias)<input className={inputClass} type="number" required min="0" step="1" value={settings.defaultExecutionDeadlineDays} onChange={event => setSettings({ ...settings, defaultExecutionDeadlineDays: event.target.value })} /><span className="internal-help-text mt-1 block normal-case tracking-normal">Zero exige informar o prazo em cada ORC.</span></label>
              <div className="sm:col-span-2"><p className="internal-field-label text-[#607989]">Responsável padrão</p><p className="internal-body mt-2 font-semibold text-[#31566d]">{settings.defaultResponsible}</p></div>
            </div><button type="submit" className="internal-help-text mt-5 rounded-[12px] bg-[#12364e] px-4 py-3 font-semibold text-white">Salvar padrões</button><p role="status" className="internal-help-text mt-3 text-[#31566d]">{feedback}</p>
          </form>
          <section className={panelClass}><h2 className="internal-section-title font-semibold text-[#17394f]">Regras operacionais</h2><div className="mt-4 rounded-[14px] bg-[#edf5f9] p-4"><p className="internal-field-label text-[#607989]">Status inicial do projeto</p><p className="internal-body mt-2 font-semibold text-[#17394f]">{settings.initialProjectStatus}</p></div><ul className="internal-body mt-4 list-disc space-y-3 pl-5 text-[#31566d]"><li>Solicitações aptas podem originar orçamentos.</li><li>Orçamentos passam por revisão antes do envio.</li><li>Projetos são criados a partir de orçamentos aceitos e iniciam em Planejamento.</li><li>Horas cotadas e valor/hora são informados pelo responsável.</li></ul><Link to="/portal/equipe" className="internal-help-text mt-5 inline-block font-semibold text-[#096ab2]">Consultar equipe →</Link></section>
        </div>
      </>}
      {activeTab === "attention" && <><p className="internal-body mb-4 text-[#526d7c]">Limites utilizados em Meu trabalho para destacar inatividade e proximidade de prazo. Alterações são aplicadas ao editar os campos.</p><div className="flex flex-col gap-5">{rules.map(rule => <section className={panelClass + " border-l-4 " + (rule.enabled ? "border-l-[#096ab2]" : "border-l-[#9aaeb9]")} key={rule.id}>
        <div className="flex items-start justify-between gap-4"><div><p className="internal-field-label text-[#607989]">{rule.entity}</p><h2 className="mt-1 text-xl font-semibold text-[#17394f]">{rule.situation}</h2></div>
          <button type="button" role="switch" aria-checked={rule.enabled} aria-label={`Ativa: ${rule.entity} · ${rule.situation}`} onClick={() => changeRule(rule.id, { enabled: !rule.enabled })} className="flex shrink-0 items-center gap-2.5 rounded-full text-[14px] font-medium text-[#31566d] outline-none focus-visible:ring-2 focus-visible:ring-[#096ab2] focus-visible:ring-offset-4">
            <span>Ativa</span><span aria-hidden="true" className={"relative h-6 w-11 rounded-full border shadow-inner transition-colors duration-200 motion-reduce:transition-none " + (rule.enabled ? "border-[#125381] bg-[#145c91]" : "border-[#b7c9d3] bg-[#dce5eb]")}><span className={"absolute left-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 motion-reduce:transition-none " + (rule.enabled ? "translate-x-5" : "translate-x-0")} /></span>
          </button>
        </div>
        <p className="internal-body mt-3 text-[#526d7c]">{rule.description}</p><div className="mt-5 grid gap-5 border-t border-[#dce5eb] pt-5 sm:grid-cols-2">{[["attentionAfterDays", "Atenção"], ["urgentAfterDays", "Urgente"]].map(([field, label]) => <label key={field} className="internal-field-label text-[#607989]">{label}{rule.mode === "before-deadline" ? " faltando" : " após"} (dias)<input type="number" min="0" step="1" className={inputClass} disabled={!rule.enabled} value={rule[field]} onChange={event => { const value = Number(event.target.value); if (Number.isInteger(value) && value >= 0) changeRule(rule.id, { [field]: value }); }} /></label>)}</div>
      </section>)}</div></>}
      {activeTab === "security" && <section className={panelClass}><h2 className="internal-section-title font-semibold text-[#17394f]">Perfil ativo</h2>{teamMembers.filter(member => member.status === "Ativo").map(member => <div key={member.id} className="mt-4"><p className="internal-card-title font-semibold text-[#31566d]">{member.name} · {member.accessProfile}</p><p className="internal-body mt-2 text-[#526d7c]">{member.role}</p><p className="internal-field-label mt-5 text-[#607989]">Módulos disponíveis</p><div className="mt-3 flex flex-wrap gap-2">{member.permissions.map(permission => <span className="internal-body rounded-[10px] border border-[#cadce6] bg-[#edf5f9] px-3 py-2 text-[#31566d]" key={permission}>{moduleLabels[permission] ?? permission}</span>)}</div></div>)}<Link to="/portal/equipe" className="internal-help-text mt-5 inline-block font-semibold text-[#096ab2]">Consultar acessos e responsabilidades →</Link></section>}
      {activeTab === "audit" && <section className={panelClass}><h2 className="internal-section-title font-semibold text-[#17394f]">Eventos administrativos da sessão</h2>{events.length ? <div className="mt-4 divide-y divide-[#dce5eb]">{events.map(event => <article key={event.id} className="grid gap-2 py-4 sm:grid-cols-[140px_1fr]"><p className="internal-help-text text-[#607989]">{event.date}</p><div><h3 className="internal-card-title font-semibold text-[#31566d]">{event.action}</h3><p className="internal-body mt-1 text-[#526d7c]">{event.description}</p><p className="internal-help-text mt-2 text-[#607989]">{event.actor} · {event.area}</p></div></article>)}</div> : <p className="internal-body mt-4 text-[#526d7c]">Nenhuma alteração administrativa registrada nesta sessão.</p>}</section>}
    </div>
  </div>;
}
