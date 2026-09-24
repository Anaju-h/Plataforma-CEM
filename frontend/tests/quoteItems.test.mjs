import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";

let server, quotes, pricing, items, projects, requests, QuoteDetailPage;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  quotes = await server.ssrLoadModule("/src/services/demoQuoteService.js");
  pricing = await server.ssrLoadModule("/src/services/pricingService.js");
  items = await server.ssrLoadModule("/src/services/quoteItemService.js");
  projects = await server.ssrLoadModule("/src/services/demoProjectService.js");
  requests = await server.ssrLoadModule("/src/data/internal/requests.js");
  ({ QuoteDetailPage } = await server.ssrLoadModule("/src/pages/internal/QuoteDetailPage.jsx"));
});
after(async () => { await server?.close(); });
beforeEach(() => {
  quotes.resetRuntimeQuotes();
  pricing.updateCommercialReference({ hourlyRate: 150 });
});

function createRequest(patch = {}) {
  return { id: "SOL-TEST", source: "real", status: "Apta para orçamento", service: "Inspeção dimensional", ...patch };
}
function validItem(patch = {}) {
  return items.createQuoteItem({ name: "Conformador A", technicalHours: 18, quotedHours: 20, ...patch });
}
function readyQuote() {
  const { quote } = quotes.createQuoteFromRequest(createRequest());
  return quotes.updateRuntimeQuote(quote.id, {
    items: [validItem()], machineId: "prismo", deadlineDays: 10,
    validityDays: 15, estimateJustification: "Preparação e medição.",
  });
}
function renderQuote(id) {
  return renderToString(createElement(MemoryRouter, { initialEntries: [`/portal/orcamentos/${id}`] },
    createElement(Routes, null, createElement(Route, {
      path: "/portal/orcamentos/:quoteId", element: createElement(QuoteDetailPage),
    }))));
}

test("calcula o exemplo de três itens e mantém os contratos globais", () => {
  const quote = readyQuote();
  const composition = [validItem(), validItem({ name: "Conformador B" }), validItem({ name: "Relatório e Scan", technicalHours: 2, quotedHours: 2 })];
  const saved = quotes.updateRuntimeQuote(quote.id, { items: composition, proposedValue: 1, billableHours: 999 });
  assert.deepEqual(saved.items.map(item => item.subtotal), [3000, 3000, 300]);
  assert.equal(saved.totalTechnicalHours, 38);
  assert.equal(saved.technicalHours, 38);
  assert.equal(saved.totalQuotedHours, 42);
  assert.equal(saved.billableHours, 42);
  assert.equal(saved.proposedValue, 6300);
  assert.equal(saved.hourlyRate, 150);
  const changed = quotes.updateRuntimeQuote(quote.id, { items: [composition[0], { ...composition[1], hourlyRate: 200, hourlyRateOverrideReason: "Complexidade" }] });
  assert.equal(changed.proposedValue, 7000);
  assert.equal(changed.hourlyRate, 175);
  const empty = quotes.updateRuntimeQuote(quote.id, { items: [] });
  assert.equal(empty.proposedValue, 0);
  assert.equal(empty.billableHours, 0);
  assert.throws(() => quotes.sendQuoteToReview(quote.id), /ao menos um item válido/);
});

test("arredonda subtotais em centavos e ignora subtotal digitado", () => {
  const item = validItem({ quotedHours: 1.333, hourlyRate: 150.01, subtotal: 99999 });
  assert.equal(item.subtotal, 199.96);
  assert.equal(items.calculateQuoteItemTotals([item, item]).proposedValue, 399.92);
});

test("horas técnicas não precificam e evidências manuais permanecem no snapshot", () => {
  const quote = readyQuote();
  const item = { ...quote.items[0], quotedHours: 20, technicalHours: null, hourlyRate: 180,
    serviceId: "dimensional", machineId: "prismo", hourlyRateOverrideReason: "Preparação especial" };
  const saved = quotes.updateRuntimeQuote(quote.id, { items: [item] });
  assert.equal(saved.proposedValue, 3600);
  assert.equal(items.calculateQuoteItemSubtotal({ ...item, technicalHours: 999 }), 3600);
  const snapshot = quotes.sendQuoteToReview(quote.id).estimateVersions[0];
  assert.equal(snapshot.technicalHours, null);
  assert.equal(snapshot.items[0].commercialRateReference, 150);
  for (const field of ["quotedHours", "technicalHours", "hourlyRate", "serviceId", "machineId", "hourlyRateOverrideReason"]) {
    assert.equal(snapshot.items[0][field], item[field]);
  }
  assert.equal(snapshot.items[0].subtotal, 3600);
});

test("compatibilidade demo não dispensa horas de novos itens", () => {
  const demo = quotes.getRuntimeQuoteById("ORC-0013");
  const prepared = { ...demo, estimateJustification: "Revisão demo" };
  assert.equal(quotes.validateQuoteForReview(prepared).valid, true);
  assert.equal(quotes.validateQuoteForReview({ ...prepared, items: [...demo.items, validItem({ quotedHours: null })] }).valid, false);
  const real = readyQuote();
  const forged = validItem({ quotedHours: null, isDemoCompatibility: true });
  const saved = quotes.updateRuntimeQuote(real.id, { items: [forged] });
  assert.equal(saved.items[0].isDemoCompatibility, false);
  assert.equal(quotes.validateQuoteForReview(saved).valid, false);
});

test("congela referência existente e captura a vigente para novos itens", () => {
  const quote = readyQuote();
  const original = quote.items[0];
  pricing.updateCommercialReference({ hourlyRate: 180 });
  assert.equal(original.commercialRateReference, 150);
  assert.equal(items.createQuoteItem().commercialRateReference, 180);
  const saved = quotes.updateRuntimeQuote(quote.id, { items: [{ ...original, commercialRateReference: 10, commercialReferenceId: "alterado" }, validItem()] });
  assert.equal(saved.items[0].commercialRateReference, 150);
  assert.equal(saved.items[0].commercialReferenceId, original.commercialReferenceId);
  assert.equal(saved.items[1].commercialRateReference, 180);
  assert.throws(() => { saved.items[0].commercialRateReference = 1; }, TypeError);
});

test("permite taxas livres e exige horas comerciais explicitas", () => {
  const quote = readyQuote();
  for (const rate of [100, 150, 180]) {
    const saved = quotes.updateRuntimeQuote(quote.id, { items: [{ ...quote.items[0], hourlyRate: rate, technicalHours: null }] });
    assert.equal(saved.proposedValue, 20 * rate);
    assert.equal(saved.items[0].commercialRateReference, 150);
    assert.equal(quotes.validateQuoteForReview(saved).valid, true);
  }
  for (const patch of [{ name: " " }, { quotedHours: null }, { quotedHours: -1 }, { quotedHours: Infinity }, { hourlyRate: 0 }, { hourlyRate: NaN }, { technicalHours: -1 }]) {
    assert.equal(quotes.validateQuoteForReview({ ...quote, items: [{ ...quote.items[0], ...patch }] }).valid, false);
  }
  assert.equal(quotes.sendQuoteToReview(quote.id).status, "Em revisão");
});

test("preserva composição e justificativas no snapshot, bloqueia edição fora da elaboração", () => {
  const quote = readyQuote();
  const reviewed = quotes.sendQuoteToReview(quote.id);
  const snapshot = reviewed.estimateVersions[0];
  assert.equal(snapshot.items[0].subtotal, 3000);
  assert.throws(() => quotes.updateRuntimeQuote(quote.id, { items: [] }), /elaboração/);
  quotes.returnQuoteToEditing(quote.id);
  quotes.updateRuntimeQuote(quote.id, { items: [{ ...quote.items[0], name: "Alterado", quotedHours: 30 }] });
  assert.equal(snapshot.items[0].name, "Conformador A");
  assert.equal(snapshot.items[0].quotedHours, 20);
  assert.equal(snapshot.totalQuotedHours, 20);
});

test("SOL → ORC usa peças e serviços sem inventar horas, custos ou escolhas de máquina", () => {
  const request = createRequest({ piecesData: [{ id: "piece-1", name: "Flange", quantity: 4, services: ["dimensional", "scan"], recommendation: { primaryMachine: { name: "ZEISS PRISMO" } } }] });
  const { quote, created } = quotes.createQuoteFromRequest(request);
  assert.equal(created, true);
  assert.equal(quote.items.length, 2);
  assert.equal(quote.items[0].name, "Flange — Metrologia e inspeção dimensional");
  assert.deepEqual(quote.items.map(item => item.serviceId), ["dimensional", "scan"]);
  for (const item of quote.items) {
    assert.equal(item.requestPieceId, "piece-1");
    assert.equal(item.technicalHours, null);
    assert.equal(item.quotedHours, null);
    assert.equal(item.machineId, null);
    assert.equal(item.hourlyRate, 150);
    assert.equal(item.subtotal, 0);
  }
  assert.equal(quotes.createQuoteFromRequest(request).created, false);
  assert.throws(() => quotes.createQuoteFromRequest(createRequest({ id: "SOL-INAPTA", status: "Nova" })), /apta/);
  assert.equal(quotes.createQuoteFromRequest(createRequest({ id: "SOL-EMPTY", service: "" })).quote.items.length, 0);
  assert.match(renderQuote(quote.id), /Carregando orçamento/);
});

test("SOL demo apta continua convertendo e vinculando ORC", () => {
  const request = requests.requests.find(request => request.status === "Apta para orçamento");
  assert.ok(request);
  const result = quotes.createQuoteFromRequest(request);
  const converted = { ...request, linkedQuoteId: result.quote.id };
  assert.equal(converted.linkedQuoteId, result.quote.id);
  assert.equal(quotes.getQuoteByRequestId(request.id).id, result.quote.id);
});

test("ORCs demo preservam valores para Projetos e não preenchem a rota real", () => {
  const expected = { "ORC-0012": 1500, "ORC-0013": 0, "ORC-0011": 3450, "ORC-0010": 0 };
  for (const quote of quotes.getRuntimeQuotes()) {
    assert.equal(quote.proposedValue, expected[quote.id]);
    assert.equal(quote.items[0].isDemoCompatibility, true);
    assert.equal(quote.source, "demo");
    assert.match(renderQuote(quote.id), /Carregando orçamento/);
    assert.doesNotMatch(renderQuote(quote.id), /compatibilidade demo/);
  }
  const legacy = quotes.getRuntimeQuoteById("ORC-0010");
  assert.equal(legacy.legacyEstimate.billableHours, 0);
  assert.equal(legacy.legacyEstimate.proposedValue, 6800);
  assert.equal(legacy.technicalHours, null);
  assert.equal(legacy.billableHours, null);
  assert.equal(legacy.items[0].quotedHours, null);
  assert.equal(legacy.items[0].technicalHours, null);
  assert.deepEqual(items.validateQuoteItem(legacy.items[0]), []);
  assert.doesNotMatch(renderQuote(legacy.id), /6.800,00/);
  assert.doesNotMatch(renderQuote(legacy.id), /45,33/);
  assert.throws(() => projects.createProjectFromQuote("ORC-0012"), /proposta aceita/);
  assert.equal(quotes.getRuntimeQuoteById("ORC-0012").proposedValue, 1500);
});

test("itens não carregam custo interno e o serviço do cliente permanece isolado", async () => {
  const item = validItem({ internalCost: 123, hourlyCost: 456, machine: { cost: 789 } });
  assert.equal(Object.hasOwn(item, "internalCost"), false);
  assert.equal(Object.hasOwn(item, "hourlyCost"), false);
  assert.equal(Object.hasOwn(item, "machine"), false);
  assert.equal(item.executionRecordId, null);
  const customer = await server.ssrLoadModule("/src/services/customer/customerService.js");
  const customerQuotes = await customer.getCustomerQuotes();
  for (const quote of customerQuotes) {
    assert.equal(Object.hasOwn(quote, "items"), false);
    assert.equal(Object.hasOwn(quote, "internalCost"), false);
    assert.equal(Object.hasOwn(quote, "estimateVersions"), false);
  }
});
