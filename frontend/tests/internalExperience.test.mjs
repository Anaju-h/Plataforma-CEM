import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

let server, administration, quotes, knowledge, TeamPage, AdministrationPage, KnowledgePage, OperationalHistoryPage;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  administration = await server.ssrLoadModule("/src/services/administrationService.js");
  quotes = await server.ssrLoadModule("/src/services/demoQuoteService.js");
  knowledge = await server.ssrLoadModule("/src/data/internal/knowledge.js");
  ({ TeamPage } = await server.ssrLoadModule("/src/pages/internal/TeamPage.jsx"));
  ({ AdministrationPage } = await server.ssrLoadModule("/src/pages/internal/AdministrationPage.jsx"));
  ({ KnowledgePage } = await server.ssrLoadModule("/src/pages/internal/KnowledgePage.jsx"));
  ({ OperationalHistoryPage } = await server.ssrLoadModule("/src/pages/internal/OperationalHistoryPage.jsx"));
});
after(async () => { await server?.close(); });
const render = Page => renderToString(createElement(MemoryRouter, null, createElement(Page)));

test("Equipe e Administração apresentam somente o perfil e controles existentes", () => {
  const team = render(TeamPage);
  assert.match(team, /Carregando equipe/);
  assert.doesNotMatch(team, /Adicionar membro|Editar|Perfis futuros|Perfis previstos|em validação|A definir/i);
  const admin = render(AdministrationPage);
  assert.match(admin, /Salvar padrões/);
  assert.match(admin, /Salvar referência/);
  assert.doesNotMatch(admin, /Integrações|Microsoft 365|A validar|A definir|Planejado|temporári/i);
  assert.deepEqual(administration.getAuditEvents(), [], "Eventos fictícios não são auditoria desta sessão");
});

test("padrões administrativos valem para novos ORCs sem mudar os existentes nem preencher horas", () => {
  const original = administration.getGeneralSettings();
  const request = id => ({ id, source: "real", status: "Apta para orçamento", service: "Inspeção dimensional" });
  const existing = quotes.createQuoteFromRequest(request("SOL-DEFAULT-OLD")).quote;
  try {
    administration.updateGeneralSettings({ defaultQuoteValidityDays: 30, defaultExecutionDeadlineDays: 8 });
    const created = quotes.createQuoteFromRequest(request("SOL-DEFAULT-NEW")).quote;
    assert.equal(created.validityDays, 30);
    assert.equal(created.deadlineDays, 8);
    assert.equal(created.responsible, "Administrador");
    assert.equal(created.items[0].quotedHours, null);
    assert.equal(created.items[0].technicalHours, null);
    assert.equal(quotes.getRuntimeQuoteById(existing.id).validityDays, original.defaultQuoteValidityDays);
    assert.equal(quotes.getRuntimeQuoteById(existing.id).deadlineDays, original.defaultExecutionDeadlineDays);
    assert.equal(administration.getAuditEvents().length, 1);
    administration.updateGeneralSettings({ defaultQuoteValidityDays: 30 });
    assert.equal(administration.getAuditEvents().length, 1, "Salvar sem mudanças não inventa evento");
    for (const patch of [{ defaultQuoteValidityDays: 0 }, { defaultQuoteValidityDays: NaN }, { defaultExecutionDeadlineDays: -1 }, { defaultExecutionDeadlineDays: 1.5 }]) {
      assert.throws(() => administration.updateGeneralSettings(patch), /dias inteiros válidos/);
    }
    assert.equal(administration.getGeneralSettings().defaultQuoteValidityDays, 30);
  } finally { administration.updateGeneralSettings(original); }
});

test("Conhecimento mantém apenas a referência econômica identificada, sem catálogo ou software", () => {
  assert.deepEqual(knowledge.knowledgeItems.map(item => item.id), ["KNO-0004"]);
  assert.equal(knowledge.getKnowledgeItemById("KNO-0001"), undefined);
  assert.equal(knowledge.getKnowledgeItemById("KNO-0005"), undefined);
  const item = knowledge.knowledgeItems[0];
  assert.equal(item.isDemo, true);
  assert.equal(item.eligibleForRecommendations, false);
  assert.equal(item.reviewedBy, null);
  assert.equal(item.lastReview, null);
  const html = render(KnowledgePage);
  assert.match(html, /Referência de custos por equipamento/);
  assert.doesNotMatch(html, /Referência demo/);
  assert.doesNotMatch(html, /Novo conteúdo|Quando considerar o ZEISS O-INSPECT|software|Diferenças iniciais entre ATOS/);
});

test("Histórico conserva os filtros e acesso aos registros sem o aviso redundante", () => {
  const html = render(OperationalHistoryPage);
  assert.match(html, /BUSCA/);
  assert.match(html, /Tipo de registro/);
  assert.match(html, /Status final/);
  assert.equal((html.match(/type="date"/g) ?? []).length, 2);
  assert.match(html, /Carregando histórico/);
  assert.doesNotMatch(html, /Nenhum registro encontrado/);
  assert.doesNotMatch(html, /Fila ativa/);
});
