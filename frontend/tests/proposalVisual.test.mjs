import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

let server, Preview, Panel, quotes, proposals, commercial, layout;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  ({ ProposalPreview: Preview } = await server.ssrLoadModule("/src/components/internal/proposal/ProposalPreview.jsx"));
  ({ ProposalConfigPanel: Panel } = await server.ssrLoadModule("/src/components/internal/proposal/ProposalConfigPanel.jsx"));
  layout = await server.ssrLoadModule("/src/components/internal/proposal/proposalDocumentLayout.js");
  quotes = await server.ssrLoadModule("/src/services/quoteService.js");
  proposals = await server.ssrLoadModule("/src/services/proposalService.js");
  commercial = await server.ssrLoadModule("/src/services/commercialProposalService.js");
});
after(async () => { await server?.close(); });
function document() {
  return { proposalId: "PROP-TEST", quoteId: "ORC-TEST", version: 1, createdAt: "2026-09-17T12:00:00Z",
    snapshot: commercial.buildCommercialProposalSnapshot({ company: "Cliente de teste", scope: "Escopo visível imediatamente", deadlineDays: 7, validityDays: 15, proposedValue: 2250, items: [{ name: "Medição", subtotal: 2250, quotedHours: 15, technicalHours: 999, hourlyRate: 150 }] }) };
}
test("preview renderiza documento HTML completo sem buscar ou gerar PDF", () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error("Preview não pode buscar PDF"); };
  try {
    const html = renderToStaticMarkup(createElement(Preview, { document: document() }));
    assert.match(html, /<article[^>]*aria-label="Proposta comercial A4"/);
    assert.match(html, /Escopo visível imediatamente/);
    assert.match(html, /INVESTIMENTO TOTAL/);
    assert.match(html, /centro-de-excelencia-senai.png/);
    assert.match(html, /logo-senai.png/);
    assert.doesNotMatch(html, /<iframe|<object|<embed|application\/pdf|Preparando preview|technicalHours|999/);
  } finally { globalThis.fetch = original; }
});
test("seção selecionada altera o draft persistido e o HTML, sem formulário duplicado do ORC", () => {
  const { quote } = quotes.createQuoteFromRequest({ id: "SOL-VISUAL", status: "Apta para orçamento", service: "Inspeção dimensional" });
  quotes.updateRuntimeQuote(quote.id, { status: "Aprovado internamente", scope: "Escopo exclusivo de teste" });
  const proposal = proposals.openProposal(quote.id);
  const updated = proposals.saveProposalDraft(quote.id, { ...proposal.draft, sections: { ...proposal.draft.sections, scope: false } });
  assert.equal(proposals.openProposal(quote.id).draft.sections.scope, false);
  const preview = renderToStaticMarkup(createElement(Preview, { document: proposals.getDraftDocument(quote.id) }));
  assert.doesNotMatch(preview, /Escopo exclusivo de teste/);
  const panel = renderToStaticMarkup(createElement(Panel, { configuration: updated.draft, media: [], onSave() {} }));
  assert.match(panel, /role="checkbox" aria-checked="false"/);
  assert.match(panel, /role="radiogroup"/);
  assert.equal([...panel.matchAll(/<textarea/g)].length, 1, "Somente observação comercial abre edição");
  assert.doesNotMatch(panel, /type="checkbox"|type="radio"/);
});
test("limite visual usa dimensões do documento sem depender da escala de apresentação", () => {
  const page = { clientHeight: 1000 };
  assert.equal(layout.documentOverflows(page, { offsetTop: 40, offsetHeight: 300, scrollHeight: 300 }), false);
  assert.equal(layout.documentOverflows(page, { offsetTop: 40, offsetHeight: 1000, scrollHeight: 1000 }), true);
  assert.equal(layout.documentOverflows(page, { offsetTop: 40, offsetHeight: 300, scrollHeight: 1000 }), true);
});
test("overflow mantém HTML e avisa no painel; versão somente leitura desabilita controles", () => {
  const doc = document();
  const configuration = { ...doc.snapshot, selectedMedia: [] };
  const panel = renderToStaticMarkup(createElement(Panel, { configuration, media: [], disabled: true, readOnly: true, overflow: true }));
  assert.match(panel, /role="alert"/);
  assert.match(panel, /excede o limite/);
  assert.match(panel, /Documento bloqueado/);
  assert.equal([...panel.matchAll(/<button/g)].length, [...panel.matchAll(/disabled=""/g)].length);
  assert.match(renderToStaticMarkup(createElement(Preview, { document: doc })), /Cliente de teste/);
});

test("zoom manual respeita limites e passos; Página considera largura e altura", async () => {
  const { stepPreviewZoom, fitPreviewZoom, fitWidthPreviewZoom } = await server.ssrLoadModule("/src/components/internal/proposal/proposalPreviewZoom.js");
  assert.equal(stepPreviewZoom(0.5, -1), 0.5);
  assert.equal(stepPreviewZoom(1.2, 1), 1.2);
  assert.equal(stepPreviewZoom(0.8, 1), 0.9);
  assert.equal(stepPreviewZoom(0.8, -1), 0.7);
  assert.equal(stepPreviewZoom(0.63, 1), 0.7);
  assert.equal(stepPreviewZoom(0.63, -1), 0.6);
  const width = layout.A4.width * 4 / 3, height = layout.A4.height * 4 / 3;
  assert.equal(fitWidthPreviewZoom(width), 1);
  assert.equal(fitWidthPreviewZoom(width / 2), 0.5);
  assert.ok(fitWidthPreviewZoom(width) > fitPreviewZoom(width, height / 2));
  assert.equal(fitPreviewZoom(width, height), 1);
  assert.equal(fitPreviewZoom(width / 2, height), 0.5);
  assert.equal(fitPreviewZoom(width, height / 2), 0.5);
  assert.ok(fitPreviewZoom(300, 600) < 0.5, "Fit em mobile exibe a folha inteira");
});

test("zoom é opcional e não modifica o snapshot nem usa viewer PDF", () => {
  const doc = document();
  const original = JSON.stringify(doc);
  const html = renderToStaticMarkup(createElement(Preview, { document: doc, enableZoom: true }));
  assert.match(html, /aria-label="Diminuir zoom" disabled=""/);
  assert.match(html, /aria-label="Aumentar zoom"/);
  assert.match(html, /aria-label="Página inteira" aria-pressed="true"/);
  assert.match(html, /proposal-preview-scroll/);
  assert.doesNotMatch(html, /<iframe|<object|<embed/);
  assert.equal(JSON.stringify(doc), original);
  assert.doesNotMatch(renderToStaticMarkup(createElement(Preview, { document: doc })), /Zoom da folha A4/);
});

test("expansão é exclusiva de observação e mídias habilitadas existentes", () => {
  const doc = document();
  const base = { ...doc.snapshot, sections: { ...doc.snapshot.sections, notes: false, photos: false, files: false }, selectedMedia: [] };
  const media = [{ id: "photo", type: "photo", name: "peca-frente.jpg" }, { id: "file", type: "file", name: "referencia.pdf" }];
  const render = configuration => renderToStaticMarkup(createElement(Panel, { configuration, media, onSave() {} }));
  assert.doesNotMatch(render(base), /<textarea|peca-frente.jpg|referencia.pdf|Usa o escopo/);
  const expanded = render({ ...base, sections: { ...base.sections, photos: true, notes: true } });
  assert.match(expanded, /peca-frente.jpg/);
  assert.match(expanded, /<textarea/);
  assert.doesNotMatch(expanded, /referencia.pdf/);
  assert.match(render({ ...base, sections: { ...base.sections, files: true } }), /referencia.pdf/);
});
