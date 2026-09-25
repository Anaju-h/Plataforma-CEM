import { NavLink, Outlet } from "react-router-dom";
import { InternalPageHeader } from "../../../components/internal/InternalPageHeader";
import { Loading, Pill } from "../../../components/internal/knowledge/KmUi";
import { useLoad } from "../../../components/internal/knowledge/kmUtils";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { hasRole } from "../../../services/authApi";
import { knowledgeApi } from "../../../services/knowledgeApi";

// Cada aba corresponde a uma fase do ciclo de Gestão do Conhecimento (Vallejos, 2005).
const TABS = [
  { to: "assistente", label: "Assistente de Orçamento", phase: "Aplicar" },
  { to: "registros", label: "Registros de Serviço", phase: "Criar" },
  { to: "licoes", label: "Lições e validação", phase: "Formalizar" },
  { to: "indicadores", label: "Indicadores", phase: "Evoluir" },
  { to: "avisos", label: "Avisos e assinaturas", phase: "Disseminar" },
  { to: "vocabulario", label: "Vocabulário controlado", phase: "Organizar" },
];

export function KnowledgeLayout() {
  const user = useCurrentUser();
  const vocabulary = useLoad(() => knowledgeApi.vocabulary(), []);
  const notices = useLoad(() => knowledgeApi.notices(), []);

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Conhecimento · área interna"
        title="Gestão do Conhecimento em Orçamentação"
        description="Orçar → executar → comparar → aprender → recomendar. O Assistente só usa conhecimento formalizado e sempre mostra de onde vem cada número."
        action={<div className="flex flex-wrap items-center gap-2">
          <Pill tone="blue">Perfil: {user.accessProfile || user.role}</Pill>
        </div>}
      />

      <nav aria-label="Seções do módulo" className="mt-6 grid grid-cols-2 gap-1.5 rounded-[18px] sm:grid-cols-3 xl:grid-cols-6 border border-white/72 bg-white/48 p-1.5 shadow-[0_10px_30px_rgba(34,67,90,0.05)] backdrop-blur-[20px]">
        {TABS.filter(tab => !tab.role || hasRole(user, tab.role)).map(tab => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `rounded-[11px] px-3.5 py-2 text-left transition-colors ${isActive ? "bg-[linear-gradient(135deg,#071f2d_0%,#12364e_58%,#164b68_100%)] text-white shadow-[0_8px_20px_rgba(7,31,45,0.16)]" : "text-[#34505f] hover:bg-white/70"}`}>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] opacity-70">{tab.phase}</span>
            <span className="flex items-center gap-1.5 text-[14px] font-semibold">
              {tab.label}
              {tab.to === "avisos" && notices.data?.unread > 0 && <span className="rounded-full bg-[#d9822b] px-1.5 text-[11px] font-bold text-white">{notices.data.unread}</span>}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <Loading state={vocabulary}>
          <Outlet context={{ user, vocabulary: vocabulary.data, reloadVocabulary: vocabulary.reload, reloadNotices: notices.reload }} />
        </Loading>
      </div>
    </div>
  );
}
