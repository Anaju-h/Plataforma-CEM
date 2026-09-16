import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";

let server, requests, quotes, projects, items, history, QuoteDetailPage, RequestDetailPage, OperationalHistoryPage;
let RequestsPage, QuotesPage, ProjectsPage;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  requests = await server.ssrLoadModule("/src/services/requestService.js");
  quotes = await server.ssrLoadModule("/src/services/quoteService.js");
  projects = await server.ssrLoadModule("/src/services/projectService.js");
  items = await server.ssrLoadModule("/src/services/quoteItemService.js");
  history = await server.ssrLoadModule("/src/services/operationalHistoryService.js");
  ({ QuoteDetailPage } = await server.ssrLoadModule("/src/pages/internal/QuoteDetailPage.jsx"));
  ({ RequestDetailPage } = await server.ssrLoadModule("/src/pages/internal/RequestDetailPage.jsx"));
  ({ OperationalHistoryPage } = await server.ssrLoadModule("/src/pages/internal/OperationalHistoryPage.jsx"));
  ({ RequestsPage } = await server.ssrLoadModule("/src/pages/internal/RequestsPage.jsx"));
  ({ QuotesPage } = await server.ssrLoadModule("/src/pages/internal/QuotesPage.jsx"));
  ({ ProjectsPage } = await server.ssrLoadModule("/src/pages/internal/ProjectsPage.jsx"));
});
after(async () => { await server?.close(); });

function render(Page, path, url) {
  return renderToString(createElement(MemoryRouter, { initialEntries: [url] }, createElement(Routes, null,
    createElement(Route, { path, element: createElement(Page) }))));
}
function quoteHTML(id) { return render(QuoteDetailPage, "/portal/orcamentos/:quoteId", `/portal/orcamentos/${id}`); }

test("SOL → ORC → revisão → PRJ preserva vínculos e move registros entre ativo e histórico", () => {
  const created = requests.createRuntimeRequest({ contact: { company: "Teste de fluxo", name: "Responsável" }, pieces: [{ id: "P1", name: "Peça", quantity: 1, services: ["inspection"] }] });
  const request = requests.updateRuntimeRequest(created.id, { status: "Apta para orçamento" });
  assert.ok(request);
  assert.equal(quotes.validateRequestForQuote(request).isValid, true);
  const readySOL = render(RequestDetailPage, "/portal/solicitacoes/:requestId", `/portal/solicitacoes/${request.id}`);
  assert.match(readySOL, /Todos os dados obrigatórios foram preenchidos/);
  assert.match(readySOL, /<button(?![^>]* disabled="")[^>]*>Criar orçamento<\/button>/i);
  const { quote } = quotes.createQuoteFromRequest(request);
  const converted = requests.markRequestAsConverted(request.id, quote.id);
  assert.equal(converted.linkedQuoteId, quote.id);
  assert.equal(requests.getActiveRequests().some(record => record.id === request.id), false);
  assert.ok(requests.getArchivedRequests().some(record => record.id === request.id));
  assert.equal(history.getOperationalHistory({ search: request.id })[0].nextId, quote.id);
  assert.equal(quotes.createQuoteFromRequest(converted).created, false);
  assert.throws(() => quotes.sendQuoteToReview(quote.id));
  let html = quoteHTML(quote.id);
  assert.match(html, /Pendências para revisão/);
  assert.match(html, /<button[^>]*disabled=""[^>]*>Enviar para revisão<\/button>/);
  const saved = quotes.updateRuntimeQuote(quote.id, { scope: "Inspecionar peça", machineId: "prismo", deadlineDays: 10, validityDays: 15,
    estimateJustification: "Preparação e medição", items: [items.createQuoteItem({ name: "Medição", quotedHours: 20, hourlyRate: 180 })] });
  assert.equal(quotes.validateQuoteForReview(saved).isValid, true);
  assert.equal(saved.proposedValue, 3600);
  html = quoteHTML(quote.id);
  assert.match(html, /Todos os dados obrigatórios foram preenchidos/);
  assert.match(html, /<button(?![^>]* disabled="")[^>]*>Enviar para revisão<\/button>/);
  assert.match(html, /internal-workspace-columns/);
  assert.match(html, /<aside class="flex min-w-0 flex-col gap-5">/);
  assert.match(readySOL, /internal-workspace-columns/);
  assert.match(readySOL, /<aside class="flex min-w-0 flex-col gap-5">/);
  assert.match(html, /Informações internas/);
  assert.match(html, /Uso interno • não incluído na proposta comercial/);
  assert.doesNotMatch(html, /Fator de correção|Confiança/);
  assert.equal(quotes.sendQuoteToReview(quote.id).status, "Em revisão");
  assert.throws(() => quotes.sendQuoteToReview(quote.id));
  quotes.approveQuoteInternally(quote.id);
  quotes.markQuoteAsSent(quote.id);
  quotes.acceptRuntimeQuote(quote.id);
  assert.ok(quotes.getActiveQuotes().some(record => record.id === quote.id), "Aceito ainda aguarda criação do projeto");
  const { project } = projects.createProjectFromQuote(quote.id);
  assert.equal(project.quoteId, quote.id);
  assert.equal(project.source, quote.source);
  assert.equal(quotes.getRuntimeQuoteById(quote.id).projectId, project.id);
  assert.equal(quotes.getActiveQuotes().some(record => record.id === quote.id), false);
  assert.ok(quotes.getArchivedQuotes().some(record => record.id === quote.id));
  assert.ok(projects.getActiveProjects().some(record => record.id === project.id));
  projects.updateRuntimeProject(project.id, { status: "Aguardando revisão", tasks: project.tasks.map(task => ({ ...task, completed: true })) });
  projects.completeRuntimeProject(project.id);
  assert.equal(projects.getActiveProjects().some(record => record.id === project.id), false);
  assert.ok(projects.getArchivedProjects().some(record => record.id === project.id));
  assert.ok(projects.getRuntimeProjectById(project.id));
  assert.throws(() => projects.saveProjectInternalNotes(project.id, "Não permitido"));
  const archived = history.getOperationalHistory({ search: project.id });
  assert.equal(archived.length, 2);
  assert.ok(archived.some(entry => entry.nextId === project.id));
  assert.ok(archived.some(entry => entry.record.id === project.id));
  const historyHTML = render(OperationalHistoryPage, "/portal/historico", "/portal/historico");
  assert.match(historyHTML, new RegExp(project.id));
  assert.match(historyHTML, /Demonstração/);
  for (const [Page, route, id] of [[RequestsPage, "solicitacoes", request.id], [QuotesPage, "orcamentos", quote.id], [ProjectsPage, "projetos", project.id]]) {
    const queueHTML = render(Page, `/portal/${route}`, `/portal/${route}`);
    assert.doesNotMatch(queueHTML, new RegExp(id));
    assert.doesNotMatch(queueHTML, /Fila ativa\. Registros encerrados/);
  }
});

test("pendências estruturadas refletem a rejeição do domínio e não aceitam números inválidos", () => {
  const request = requests.getActiveRequests().find(record => record.status === "Nova");
  assert.ok(request);
  const validation = quotes.validateRequestForQuote(request);
  assert.equal(validation.isValid, false);
  assert.equal(validation.issues[0].field, "status");
  assert.throws(() => quotes.createQuoteFromRequest(request), { message: validation.problems.join(" ") });
  const html = render(RequestDetailPage, "/portal/solicitacoes/:requestId", `/portal/solicitacoes/${request.id}`);
  assert.match(html, /<button[^>]*disabled=""[^>]*>Criar orçamento<\/button>/i);
  assert.match(html, /Conclua a análise/);
  const { quote } = quotes.createQuoteFromRequest({ id: "SOL-VALIDATION", status: "Apta para orçamento", source: "real", service: "Inspeção dimensional" });
  const draft = { ...quote, scope: "", deadlineDays: Infinity, validityDays: -1, items: [items.createQuoteItem({ name: "Item A", quotedHours: 2 }), items.createQuoteItem({ name: "Item B" })] };
  const result = quotes.validateQuoteForReview(draft);
  assert.equal(result.valid, result.isValid);
  for (const field of ["scope", "deadlineDays", "validityDays", "items.1.quotedHours"]) assert.ok(result.issues.some(issue => issue.field === field), field);
  assert.ok(result.issues.every(issue => issue.code && issue.field && issue.message));
});

test("histórico filtra dados existentes sem inventar datas, horas ou conhecimento", () => {
  const legacy = quotes.getRuntimeQuoteById("ORC-0010");
  assert.equal(legacy.items[0].quotedHours, null);
  assert.equal(legacy.items[0].technicalHours, null);
  assert.equal(legacy.legacyEstimate.proposedValue, 6800);
  assert.equal(legacy.items[0].isDemoCompatibility, true);
  assert.equal(quotes.getQuoteKnowledgeSupport(legacy.id).historyConnected, false);
  const records = history.getOperationalHistory({ search: "Zeta", type: "Orçamento", status: "Recusado", from: "2026-08-01", to: "2026-08-31" });
  assert.deepEqual(records.map(entry => entry.record.id), [legacy.id]);
  assert.equal(history.getOperationalHistory({ search: legacy.id, from: "2027-01-01" }).length, 0);
  assert.equal(history.historyDate(null), null);
  assert.equal(history.historyDate("22/08/2026"), "2026-08-22");
  assert.equal(history.historyDate("2026-08-22T13:00:00Z"), "2026-08-22");
  const project = projects.getRuntimeProjects()[0];
  const original = { ...project };
  try {
    projects.updateRuntimeProject(project.id, { status: "Cancelado" });
    assert.ok(projects.getArchivedProjects().some(record => record.id === project.id));
    assert.equal(projects.getActiveProjects().some(record => record.id === project.id), false);
    assert.throws(() => projects.saveProjectInternalNotes(project.id, "Não permitido"));
  } finally { projects.updateRuntimeProject(project.id, original); }
});
