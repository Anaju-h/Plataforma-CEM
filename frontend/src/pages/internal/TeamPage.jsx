import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { InternalPageHeader } from "../../components/internal/InternalPageHeader";
import { getTeamOverview } from "../../services/teamService";

const permissions = { dashboard: "Visão geral", requests: "Solicitações", quotes: "Orçamentos", projects: "Projetos", knowledge: "Conhecimento", costs: "Equipamentos e custos", team: "Equipe", administration: "Administração" };

export function TeamPage() {
  useCurrentUser();
  const [overview, setOverview] = useState(null);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    let active = true;
    getTeamOverview().then((value) => { if (active) setOverview(value); })
      .catch((error) => { if (active) setLoadError(error.message); });
    return () => { active = false; };
  }, []);
  if (loadError) return <p role="alert">{loadError}</p>;
  if (!overview) return <p role="status">Carregando equipe...</p>;
  const { members } = overview;
  const activeMembers = members.filter(member => member.status === "Ativo");
  return <div className="mx-auto max-w-[1500px]">
    <InternalPageHeader eyebrow="Gestão" title="Equipe" description="Perfis ativos, responsabilidades e acesso à operação do laboratório." />
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[["Usuários ativos", overview.activeMembers], ["Solicitações atribuídas", overview.assignedRequests], ["Orçamentos em andamento", overview.activeQuotes], ["Projetos ativos", overview.activeProjects]].map(([label, value]) => <section key={label} className="rounded-[18px] border border-[#cbdde6] bg-white/75 p-5"><p className="internal-field-label text-[#607989]">{label}</p><p className="mt-2 text-3xl font-semibold text-[#17394f]">{value}</p></section>)}
    </div><p className="internal-help-text mt-3 text-[#607989]">Contagens dos registros da sessão, incluindo a base de demonstração.</p>
    <div className="mt-5 grid gap-5">
      {activeMembers.map(member => <section key={member.id} className="rounded-[22px] border border-[#cddbe3] bg-white/85 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4 border-b border-[#dce5eb] pb-5"><span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#e5f0f6] text-xl font-semibold text-[#17394f]">{member.initials}</span><div><h2 className="internal-section-title font-semibold text-[#17394f]">{member.name}</h2><p className="internal-body mt-1 text-[#526d7c]">{member.role}</p></div><span className="internal-help-text ml-auto rounded-full bg-[#edf7f1] px-3 py-1 font-semibold text-[#397250]">{member.status}</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">{[["Solicitações atribuídas", member.assignedRequests.length], ["Orçamentos em andamento", member.activeQuotes.length], ["Projetos ativos", member.activeProjects.length]].map(([label, value]) => <div key={label} className="rounded-[14px] bg-[#edf5f9] p-4"><p className="internal-help-text text-[#526d7c]">{label}</p><p className="mt-1 text-xl font-semibold text-[#17394f]">{value}</p></div>)}</div>
        <p className="internal-help-text mt-3 text-[#607989]">Carga atribuída: {member.workload.real} registro(s) real(is) e {member.workload.demo} demo.</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div><p className="internal-field-label text-[#607989]">Perfil de acesso</p><p className="internal-body mt-2 font-semibold text-[#17394f]">{member.accessProfile}</p><div className="mt-3 flex flex-wrap gap-2">{member.permissions.map(permission => <span key={permission} className="internal-help-text rounded-lg border border-[#d3e1e8] bg-[#f5f9fb] px-3 py-1.5 text-[#31566d]">{permissions[permission] ?? permission}</span>)}</div></div>
          <div><p className="internal-field-label text-[#607989]">Responsabilidades</p><p className="internal-body mt-2 leading-6 text-[#31566d]">Acompanhar solicitações, elaborar e revisar orçamentos, coordenar projetos e manter as referências e configurações do laboratório.</p><Link to="/portal/conta" className="internal-help-text mr-3 mt-4 inline-block rounded-[12px] bg-[#096ab2] px-4 py-3 font-semibold text-white">MINHA CONTA</Link><Link to="/portal/meu-trabalho" className="internal-help-text mt-4 inline-block rounded-[12px] bg-[#12364e] px-4 py-3 font-semibold text-white">MEU TRABALHO</Link></div>
        </div>
      </section>)}
    </div>
  </div>;
}
