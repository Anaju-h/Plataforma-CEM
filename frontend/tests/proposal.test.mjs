import { testPdfDestination } from "./proposalTestAssets.mjs";
import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createServer } from "vite";
import { installProposalAssetFetch } from "./proposalTestAssets.mjs";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
let server, quotes, proposals, projects, commercial, pdfService, items, restoreFetch;
before(async () => {
  restoreFetch = installProposalAssetFetch();
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  quotes = await server.ssrLoadModule("/src/services/demoQuoteService.js");
  proposals = await server.ssrLoadModule("/src/services/demoProposalService.js");
  projects = await server.ssrLoadModule("/src/services/demoProjectService.js");
  commercial = await server.ssrLoadModule("/src/services/commercialProposalService.js");
  pdfService = await server.ssrLoadModule("/src/services/proposalPdfService.jsx");
  items = await server.ssrLoadModule("/src/services/quoteItemService.js");
});
after(async () => { restoreFetch?.(); await server?.close(); });
let sequence = 0;
function approved() {
  const { quote } = quotes.createQuoteFromRequest({ id: `SOL-PROP-${++sequence}`, status: "Apta para orçamento", company: "ACME Indústria Ltda.", service: "Inspeção dimensional", source: "real" });
  quotes.updateRuntimeQuote(quote.id, { scope: "Inspeção dimensional da peça", company: "ACME Indústria Ltda.", machineId: "prismo", deadlineDays: 10, validityDays: 15, estimateJustification: "Segredo interno", internalCost: 9876, internalNotes: "Privado", items: [items.createQuoteItem({ name: "Medição", technicalHours: 99, quotedHours: 15, hourlyRate: 150 })] });
  quotes.sendQuoteToReview(quote.id); quotes.approveQuoteInternally(quote.id);
  return quotes.getRuntimeQuoteById(quote.id);
}
const result = type => ({ type, date: "2026-09-16", note: "Nota privada", actor: "Administrador" });

test("Save As cancelado mantém draft, contador e histórico intactos", async () => {
  const { chooseProposalPdfDestination } = await server.ssrLoadModule("/src/services/proposalFileService.js");
  const quote = approved(); const original = proposals.openProposal(quote.id);
  const cancel = filename => chooseProposalPdfDestination(filename, { showSaveFilePicker() { throw new DOMException("Cancelado", "AbortError"); } });
  const emitted = await proposals.generateProposalVersion(quote.id, "Administrador", cancel);
  assert.equal(emitted.cancelled, true);
  assert.equal(proposals.getProposalByQuoteId(quote.id), original);
  assert.equal(quotes.getRuntimeQuoteById(quote.id), quote);
  assert.equal(original.versions.length, 0);
});

test("Save As oficializa somente após close; falha de gravação preserva draft; V2 explícita e re-download não alteram V1", async () => {
  const { chooseProposalPdfDestination, saveExistingProposalPdf } = await server.ssrLoadModule("/src/services/proposalFileService.js");
  const quote = approved(); const original = proposals.openProposal(quote.id);
  let aborts = 0;
  const failed = filename => chooseProposalPdfDestination(filename, { async showSaveFilePicker() { return {
    async createWritable() { return { async write() {}, async close() { throw new Error("Disco cheio"); }, async abort() { aborts++; } }; },
  }; } });
  await assert.rejects(proposals.generateProposalVersion(quote.id, "Administrador", failed), /Disco cheio/);
  assert.equal(aborts, 1);
  assert.equal(proposals.getProposalByQuoteId(quote.id), original);
  let release, reachedClose, written;
  const closed = new Promise(resolve => { release = resolve; });
  const closing = new Promise(resolve => { reachedClose = resolve; });
  let pickerOpened = false;
  const choose = filename => chooseProposalPdfDestination(filename, { showSaveFilePicker(options) {
    pickerOpened = true;
    assert.equal(options.suggestedName, `${original.id}_V1.pdf`);
    return Promise.resolve({ name: "proposta-cliente.pdf", async createWritable() { return {
      async write(blob) { written = blob; }, async close() { reachedClose(); await closed; }, async abort() {},
    }; } });
  } });
  const emission = proposals.generateProposalVersion(quote.id, "Administrador", choose);
  assert.equal(pickerOpened, true, "Seletor chamado sincronicamente no clique");
  await closing;
  assert.equal(proposals.getProposalByQuoteId(quote.id), original, "Ainda não oficializa durante gravação");
  release();
  const v1 = await emission;
  assert.equal(v1.version.version, 1);
  assert.equal(v1.version.locked, true);
  assert.equal(v1.blob, written);
  assert.equal(v1.version.pdf.delivery.fileName, "proposta-cliente.pdf");
  const frozen = JSON.stringify(v1.version);
  const acceptedBefore = proposals.getProposalByQuoteId(quote.id);
  await saveExistingProposalPdf(v1.version, v1.version.pdfFileName, testPdfDestination);
  assert.equal(proposals.getProposalByQuoteId(quote.id), acceptedBefore);
  assert.equal(quotes.getRuntimeQuoteById(quote.id), quote);
  proposals.createNextProposalDraft(quote.id);
  assert.equal(proposals.getProposalByQuoteId(quote.id).versions.length, 1);
  await proposals.generateProposalVersion(quote.id, "Administrador", async () => null);
  assert.equal(proposals.getProposalByQuoteId(quote.id).versions.length, 1);
  const v2 = await proposals.generateProposalVersion(quote.id, "Administrador", testPdfDestination);
  assert.equal(v2.version.version, 2);
  assert.equal(JSON.stringify(v1.version), frozen);
  assert.deepEqual(v2.proposal.versions[0].snapshot, v1.version.snapshot);
});

test("fallback encaminha o PDF ao navegador e identifica ausência de confirmação em disco", async () => {
  const { chooseProposalPdfDestination } = await server.ssrLoadModule("/src/services/proposalFileService.js");
  let received;
  const destination = await chooseProposalPdfDestination("PROP-TEST_V1.pdf", {}, (blob, filename) => { received = { blob, filename }; });
  const blob = new Blob(["%PDF-test"]);
  const delivery = await destination.write(blob);
  assert.equal(received.blob, blob);
  assert.equal(received.filename, "PROP-TEST_V1.pdf");
  assert.equal(delivery.saved, true);
  assert.equal(delivery.diskConfirmed, false);
});

test("AbortError durante a escrita é cancelamento normal", async () => {
  const { chooseProposalPdfDestination } = await server.ssrLoadModule("/src/services/proposalFileService.js");
  const quote = approved(); const original = proposals.openProposal(quote.id);
  const choose = filename => chooseProposalPdfDestination(filename, { async showSaveFilePicker() { return {
    async createWritable() { throw new DOMException("Cancelado", "AbortError"); },
  }; } });
  assert.equal((await proposals.generateProposalVersion(quote.id, "Administrador", choose)).cancelled, true);
  assert.equal(proposals.getProposalByQuoteId(quote.id), original);
});
test("bloqueia projeto sem aceite, incluindo ORC legado com status Aceito", () => {
  const quote = approved();
  assert.throws(() => projects.createProjectFromQuote(quote.id), /versão.*aceita/);
  assert.throws(() => projects.createProjectFromQuote("ORC-0012"), /versão.*aceita/);
  assert.throws(() => quotes.acceptRuntimeQuote(quote.id), /Proposal Builder/);
  proposals.openProposal(quote.id);
  assert.throws(() => proposals.registerProposalResult(quote.id, 1, result("accepted")), /versão gerada/);
});
test("snapshot usa allowlist; horas cotadas somente no modo horas", () => {
  const quote = approved(); const draft = commercial.createCommercialDraft(quote);
  const json = JSON.stringify(commercial.buildCommercialProposalSnapshot(quote, draft));
  for (const forbidden of ["technicalHours", "internalCost", "internalNotes", "estimateJustification", "commercialRateReference", "hourlyRate", "Segredo", "Privado"]) assert.ok(!json.includes(forbidden), forbidden);
  const detailed = commercial.buildCommercialProposalSnapshot(quote, { ...draft, investmentDisplay: "hours" });
  assert.equal(detailed.items[0].quotedHours, 15); assert.equal(detailed.items[0].hourlyRate, undefined);
  assert.equal(Object.isFrozen(detailed.items[0]), true);
});
test("draft persiste; PDF real congela V1; revisão e V2 preservam V1; aceite exato libera projeto", async () => {
  const quote = approved(); const initial = proposals.openProposal(quote.id);
  const saved = proposals.saveProposalDraft(quote.id, { ...initial.draft, content: { ...initial.draft.content, terms: "Pagamento em 30 dias" } });
  assert.deepEqual(proposals.openProposal(quote.id).draft, saved.draft);
  const generated = await proposals.generateProposalVersion(quote.id, "Administrador", testPdfDestination);
  assert.equal((await generated.blob.text()).slice(0, 5), "%PDF-");
  const pdfText = await generated.blob.text();
  assert.equal([...pdfText.matchAll(/\/Type \/Page\b/g)].length, 1);
  assert.match(pdfText, /\/MediaBox \[0 0 595\.28\d* 841\.89\d*\]/);
  assert.deepEqual(new Uint8Array(await (await pdfService.renderProposalPdf(generated.version)).arrayBuffer()), new Uint8Array(await generated.blob.arrayBuffer()));
  assert.equal(generated.version.pdf.pageCount, 1); assert.equal(generated.version.locked, true);
  assert.ok(Object.isFrozen(generated.version.snapshot));
  const v1 = JSON.stringify(generated.version.snapshot);
  assert.throws(() => proposals.saveProposalDraft(quote.id, saved.draft), /nova versão/);
  assert.deepEqual(proposals.getCustomerAcceptedProposals(quote.company), []);
  proposals.registerProposalResult(quote.id, 1, result("revision"));
  assert.throws(() => projects.createProjectFromQuote(quote.id), /versão.*aceita/);
  assert.equal(proposals.getProposalByQuoteId(quote.id).draft, null);
  quotes.updateRuntimeQuote(quote.id, { scope: "Novo escopo comercial" });
  quotes.sendQuoteToReview(quote.id); quotes.approveQuoteInternally(quote.id);
  assert.equal(JSON.stringify(proposals.getProposalByQuoteId(quote.id).versions[0].snapshot), v1);
  proposals.createNextProposalDraft(quote.id);
  const v2 = await proposals.generateProposalVersion(quote.id, "Administrador", testPdfDestination);
  assert.equal(v2.version.version, 2); assert.equal(v2.version.snapshot.content.scope, "Novo escopo comercial");
  assert.equal(v2.proposal.versions.length, 2); assert.equal(JSON.stringify(v2.proposal.versions[0].snapshot), v1);
  const accepted = proposals.registerProposalResult(quote.id, 2, result("accepted"));
  assert.equal(accepted.acceptedVersion, 2); assert.equal(accepted.versions[1].result.actor, "Administrador");
  assert.throws(() => quotes.updateRuntimeQuote(quote.id, { scope: "Alteração silenciosa" }), /bloqueado/);
  assert.throws(() => quotes.updateRuntimeQuoteStatus(quote.id, "Em elaboração"), /bloqueado/);
  assert.throws(() => proposals.createNextProposalDraft(quote.id), /encerrada/);
  const { project } = projects.createProjectFromQuote(quote.id);
  assert.equal(project.acceptedProposalId, accepted.id); assert.equal(project.acceptedProposalVersion, 2); assert.equal(project.quoteId, quote.id);
  const customer = proposals.getCustomerAcceptedProposals(quote.company).find(item => item.id === quote.id);
  assert.equal(customer.document.version, 2); assert.equal(customer.projectId, project.id);
  assert.ok(!JSON.stringify(customer).includes("Nota privada")); assert.ok(!JSON.stringify(customer).includes("technicalHours"));
  assert.deepEqual(proposals.getCustomerAcceptedProposals("Outra empresa"), []);
});
test("recusa preserva versão e encerra ORC sem projeto ou exposição ao cliente", async () => {
  const quote = approved(); proposals.openProposal(quote.id); await proposals.generateProposalVersion(quote.id, "Administrador", testPdfDestination);
  proposals.registerProposalResult(quote.id, 1, result("rejected"));
  assert.equal(quotes.getRuntimeQuoteById(quote.id).status, "Recusado");
  assert.throws(() => projects.createProjectFromQuote(quote.id), /versão.*aceita/);
  assert.ok(!proposals.getCustomerAcceptedProposals(quote.company).some(item => item.id === quote.id));
});
test("conteúdo excessivo bloqueia geração sem consumir número ou apagar draft", async () => {
  const quote = approved(); const proposal = proposals.openProposal(quote.id);
  proposals.saveProposalDraft(quote.id, { ...proposal.draft, content: { ...proposal.draft.content, scope: "Linha de escopo técnico.\n".repeat(130) } });
  await assert.rejects(proposals.generateProposalVersion(quote.id, "Administrador", testPdfDestination), /excede.*uma página/);
  assert.equal(proposals.getProposalByQuoteId(quote.id).versions.length, 0); assert.ok(proposals.getProposalByQuoteId(quote.id).draft);
  assert.throws(() => pdfService.validateOnePageLayout({ children: [] }), /validar/);
});

test("a rota real aguarda API e não utiliza propostas de demonstração", async () => {
  const { QuoteDetailPage } = await server.ssrLoadModule("/src/pages/internal/QuoteDetailPage.jsx");
  const render = id => renderToString(createElement(MemoryRouter, { initialEntries: [`/portal/orcamentos/${id}`] }, createElement(Routes, null,
    createElement(Route, { path: "/portal/orcamentos/:quoteId", element: createElement(QuoteDetailPage) }))));
  const { quote } = quotes.createQuoteFromRequest({ id: `SOL-UI-${++sequence}`, status: "Apta para orçamento", service: "Inspeção dimensional" });
  assert.doesNotMatch(render(quote.id), /MONTAR PROPOSTA|ABRIR PROPOSTA|>Criar projeto</);
  const ready = approved();
  assert.match(render(ready.id), /Carregando orçamento/);
  proposals.openProposal(ready.id);
  assert.doesNotMatch(render(ready.id), /ABRIR PROPOSTA/);
  assert.doesNotMatch(render(ready.id), />Criar projeto</);
  await proposals.generateProposalVersion(ready.id, "Administrador", testPdfDestination);
  proposals.registerProposalResult(ready.id, 1, result("accepted"));
  assert.doesNotMatch(render(ready.id), />Criar projeto</);
});

test("snapshot seleciona somente mídia autorizada e congela o conteúdo", () => {
  const quote = approved();
  const photo = { id: "PHOTO-1", type: "photo", name: "Peça", clientVisible: true, dataUrl: "data:image/png;base64,YQ==", internalNotes: "privado" };
  const withMedia = { ...quote, commercialMedia: [photo, { ...photo, id: "PRIVATE", clientVisible: false }], attachments: [photo] };
  const draft = commercial.createCommercialDraft(withMedia);
  const snapshot = commercial.buildCommercialProposalSnapshot(withMedia, { ...draft, sections: { ...draft.sections, photos: true }, selectedMedia: ["PHOTO-1", "PRIVATE"] });
  assert.equal(snapshot.media.length, 1);
  photo.name = "Mudou";
  assert.equal(snapshot.media[0].name, "Peça");
  assert.equal(Object.hasOwn(snapshot.media[0], "internalNotes"), false);
});

test("mudança do ORC exige nova versão antes do aceite; somente versão vigente é elegível", async () => {
  const quote = approved(); proposals.openProposal(quote.id);
  await proposals.generateProposalVersion(quote.id, "Administrador", testPdfDestination);
  quotes.updateRuntimeQuote(quote.id, { commercialNotes: "Condição atualizada" });
  assert.throws(() => proposals.registerProposalResult(quote.id, 1, result("accepted")), /nova versão/);
  proposals.createNextProposalDraft(quote.id);
  await proposals.generateProposalVersion(quote.id, "Administrador", testPdfDestination);
  assert.throws(() => proposals.registerProposalResult(quote.id, 1, result("accepted")), /vigente/);
});

test("Customer Portal usa o DTO aceito e inclui apenas o projeto vinculado", async () => {
  const customer = await server.ssrLoadModule("/src/services/customer/customerService.js");
  const accepted = await customer.getCustomerQuotes();
  assert.ok(accepted.length);
  for (const quote of accepted) {
    assert.equal(quote.status, "Aceito");
    assert.equal(quote.document.snapshot.client.company, "ACME Indústria Ltda.");
    assert.equal(Object.hasOwn(quote, "draft"), false);
    assert.equal(Object.hasOwn(quote, "versions"), false);
    assert.ok(!JSON.stringify(quote).includes("Nota privada"));
  }
  const linked = accepted.find(quote => quote.projectId);
  assert.ok(linked);
  const project = (await customer.getCustomerProjects()).find(item => item.id === linked.projectId);
  assert.equal(project.quoteId, linked.id);
  assert.equal(Object.hasOwn(project, "internalNotes"), false);
});

test("peças reais agrupam serviços; snapshot seguro; V1 imutável, V2 atual e aceite bloqueia ORC", async () => {
  const pieces = [{ id: "flange", name: "Flange dianteiro", code: "FL-204", quantity: 3, services: ["inspection", "scanning"] }, { id: "suporte", name: "Suporte lateral", quantity: 1, services: ["inspection"] }];
  const { quote } = quotes.createQuoteFromRequest({ id: "SOL-GROUP-" + ++sequence, status: "Apta para orçamento", company: "Teste de peças", service: "Inspeção dimensional", source: "real", piecesData: pieces });
  const composition = quote.items.map((item, index) => ({ ...item, quotedHours: [2, 5, 4][index], hourlyRate: 150, technicalHours: 99 }));
  const saved = quotes.updateRuntimeQuote(quote.id, { scope: "Medição", estimateJustification: "Preparação e medição", machineId: "prismo", deadlineDays: 10, validityDays: 15, items: composition });
  const { getQuotePieces, groupQuoteItems } = await server.ssrLoadModule("/src/services/quotePieceService.js");
  const groups = groupQuoteItems(saved.items, getQuotePieces(saved));
  assert.equal(groups.length, 2);
  assert.deepEqual(groups.map(group => group.items.length), [2, 1]);
  assert.deepEqual(saved.items.map(item => item.subtotal), [300, 750, 600]);
  assert.deepEqual(groups.map(group => group.subtotal), [1050, 600]);
  assert.equal(saved.proposedValue, 1650, "Quantidade da peça não multiplica preços");
  assert.throws(() => quotes.updateRuntimeQuote(quote.id, { items: [...saved.items, items.createQuoteItem({ name: "Novo", quotedHours: 1 })] }), /Vincule/);
  assert.throws(() => quotes.updateRuntimeQuote(quote.id, { items: [{ ...saved.items[0], requestPieceId: "ficticia" }] }), /existente/);
  const legacy = groupQuoteItems([items.createQuoteItem({ name: "Legado", quotedHours: 1 })], pieces);
  assert.equal(legacy.at(-1).piece, null);
  assert.equal(items.normalizeQuoteItem({ ...saved.items[0], requestPieceId: "suporte" }, saved.items[0]).requestPieceId, "suporte");
  const customName = commercial.buildCommercialProposalSnapshot({ ...saved, items: saved.items.map((item, index) => index ? item : { ...item, name: "Inspeção com relatório específico" }) });
  assert.equal(customName.groups[0].items[0].name, "Inspeção com relatório específico");
  const draft = commercial.createCommercialDraft(saved);
  assert.equal(draft.investmentDisplay, "hours");
  const snap = commercial.buildCommercialProposalSnapshot(saved, draft);
  assert.equal(snap.groups[0].piece.id, "flange");
  assert.equal(snap.groups[0].piece.code, "FL-204");
  assert.equal(snap.groups[0].items[0].quotedHours, 2);
  assert.equal(snap.groups[0].items[0].subtotal, 300);
  for (const key of ["hourlyRate", "technicalHours", "commercialRateReference", "hourlyRateOverrideReason"]) assert.ok(!JSON.stringify(snap).includes(key));
  const { ProposalDocument } = await server.ssrLoadModule("/src/components/internal/proposal/ProposalDocument.jsx");
  const render = snapshot => renderToString(createElement(ProposalDocument, { document: { proposalId: "PROP-TEST", quoteId: quote.id, version: 1, createdAt: new Date().toISOString(), snapshot } }));
  assert.match(render(snap), /FL-204/);
  assert.match(render(snap), /2 h/);
  assert.doesNotMatch(render(snap), /VALOR.H|Valor.hora|99 h/);
  const total = commercial.buildCommercialProposalSnapshot(saved, { ...draft, investmentDisplay: "total-only" });
  assert.equal(total.groups.length, 0);
  assert.equal(total.items.length, 0);
  assert.doesNotMatch(render(total), /Flange|Inspeção dimensional|2 h/);
  const simple = commercial.buildCommercialProposalSnapshot(saved, { ...draft, investmentDisplay: "items" });
  assert.match(render(simple), /Flange/);
  assert.doesNotMatch(render(simple), /2 h|HORAS/);
  assert.ok(!JSON.stringify(simple).includes("quotedHours"));
  const old = { ...snap, groups: undefined, items: [{ name: "Serviço antigo", quotedHours: 2, hourlyRate: 98765, subtotal: 300 }] };
  const oldJSON = JSON.stringify(old);
  assert.match(render(old), /Serviço antigo/);
  assert.doesNotMatch(render(old), /98765|VALOR.H/);
  assert.equal(JSON.stringify(old), oldJSON);
  quotes.sendQuoteToReview(quote.id); quotes.approveQuoteInternally(quote.id);
  proposals.openProposal(quote.id);
  const v1 = await proposals.generateProposalVersion(quote.id, "Administrador", testPdfDestination);
  const original = JSON.stringify(v1.version.snapshot);
  const editing = quotes.returnQuoteToEditing(quote.id);
  assert.equal(quotes.isQuoteEditable(editing), true);
  quotes.updateRuntimeQuote(quote.id, { items: editing.items.map((item, index) => index ? item : { ...item, quotedHours: 3 }) });
  assert.equal(JSON.stringify(proposals.getProposalByQuoteId(quote.id).versions[0].snapshot), original);
  assert.equal(proposals.getProposalByQuoteId(quote.id).draft, null);
  quotes.sendQuoteToReview(quote.id); quotes.approveQuoteInternally(quote.id);
  proposals.createNextProposalDraft(quote.id);
  assert.equal(proposals.getDraftDocument(quote.id).snapshot.total, 1800);
  assert.equal(proposals.getDraftDocument(quote.id).snapshot.groups[0].items[0].quotedHours, 3);
  const v2 = await proposals.generateProposalVersion(quote.id, "Administrador", testPdfDestination);
  assert.equal(v2.version.pdf.pageCount, 1);
  assert.equal(JSON.stringify(v2.proposal.versions[0].snapshot), original);
  proposals.registerProposalResult(quote.id, 2, result("accepted"));
  assert.throws(() => quotes.updateRuntimeQuote(quote.id, { items: composition }), /bloqueado/);
  assert.throws(() => quotes.returnQuoteToEditing(quote.id));
});
