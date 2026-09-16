import { getArchivedRequests } from "./requestService";
import { getArchivedQuotes } from "./quoteService";
import { getArchivedProjects } from "./projectService";

// Adaptadores de consulta: os registros continuam nos repositórios de origem.
// Novos tipos (propostas e registros de serviço) poderão adicionar adaptadores.
const sources = [
  { type: "Solicitação", read: getArchivedRequests, route: "solicitacoes", next: record => record.linkedQuoteId },
  { type: "Orçamento", read: getArchivedQuotes, route: "orcamentos", next: record => record.projectId },
  { type: "Projeto", read: getArchivedProjects, route: "projetos", next: () => null },
];

export function historyDate(value) {
  if (!value) return null;
  const date = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return date.slice(0, 10);
  const match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

export function getOperationalHistory({ search = "", type = "", status = "", from = "", to = "" } = {}) {
  const query = search.trim().toLocaleLowerCase("pt-BR");
  return sources.flatMap(source => source.read().map(record => ({
    record, type: source.type, path: `/portal/${source.route}/${record.id}`,
    nextId: source.next(record), date: historyDate(record.updatedAt ?? record.createdAt),
  }))).filter(entry => {
    const record = entry.record;
    return (!type || entry.type === type) && (!status || record.status === status)
      && (!from || (entry.date && entry.date >= from)) && (!to || (entry.date && entry.date <= to))
      && (!query || [record.id, record.company, record.service, record.quoteId, record.requestId, entry.nextId].some(value => String(value ?? "").toLocaleLowerCase("pt-BR").includes(query)));
  }).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || b.record.id.localeCompare(a.record.id));
}
