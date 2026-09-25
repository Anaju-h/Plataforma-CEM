import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getLanguage, loadDictionary, subscribeLanguage, translateText } from "../i18n/languageStore";

const SITE = "CEM SENAI ZEISS";

// Primeira regra que casar com o início do endereço define o título da aba (a mais específica vem antes).
const TITLES = [
  ["/portal/conhecimento/assistente", "Assistente de Orçamento"],
  ["/portal/conhecimento/registros", "Registros de Serviço"],
  ["/portal/conhecimento/licoes", "Lições e validação"],
  ["/portal/conhecimento/indicadores", "Indicadores"],
  ["/portal/conhecimento/avisos", "Avisos"],
  ["/portal/conhecimento/vocabulario", "Vocabulário controlado"],
  ["/portal/conhecimento", "Gestão do Conhecimento"],
  ["/portal/solicitacoes", "Solicitações"],
  ["/portal/orcamentos", "Orçamentos"],
  ["/portal/projetos", "Projetos"],
  ["/portal/meu-trabalho", "Meu trabalho"],
  ["/portal/tarefas", "Quadro de tarefas"],
  ["/portal/equipe", "Equipe"],
  ["/portal/equipamentos-custos", "Custos de equipamentos"],
  ["/portal/historico", "Histórico"],
  ["/portal/administracao", "Administração"],
  ["/portal/conta", "Minha conta"],
  ["/portal/login", "Acesso interno"],
  ["/portal", "Painel interno"],
  ["/cliente/solicitacoes", "Minhas solicitações"],
  ["/cliente/nova-solicitacao", "Nova solicitação"],
  ["/cliente/orcamentos", "Propostas"],
  ["/cliente/projetos", "Projetos"],
  ["/cliente/documentos", "Documentos"],
  ["/cliente/conta", "Minha conta"],
  ["/cliente/dashboard", "Área do cliente"],
  ["/cliente", "Área do cliente"],
  ["/sobre", "Sobre o Centro"],
  ["/servicos", "Serviços"],
  ["/equipamentos", "Equipamentos"],
  ["/orcamento", "Solicitar orçamento"],
  ["/configurador", "Configurador"],
];

function titleFor(pathname) {
  if (pathname === "/") return `${SITE} | Centro de Excelência em Metrologia`;
  const match = TITLES.find(([path]) => pathname === path || pathname.startsWith(`${path}/`));
  const page = match ? match[1] : "Página não encontrada";
  // Área pública traduzida; áreas interna e do cliente ficam em português.
  const label = pathname.startsWith("/portal") || pathname.startsWith("/cliente") ? page : translateText(page);
  return `${label} | ${SITE}`;
}

/** Atualiza o título da aba a cada navegação e troca de idioma. */
export function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    let active = true;
    const apply = () => {
      if (!active) return;
      document.title = titleFor(pathname);
      // O dicionário é carregado sob demanda: reaplica quando chegar.
      if (getLanguage() !== "PT") loadDictionary().then(() => { if (active) document.title = titleFor(pathname); });
    };
    apply();
    const unsubscribe = subscribeLanguage(apply);
    return () => { active = false; unsubscribe(); };
  }, [pathname]);

  return null;
}

