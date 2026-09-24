import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

let server, quotes, api, proposals;
const originalFetch = globalThis.fetch;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  quotes = await server.ssrLoadModule("/src/services/quoteService.js");
  api = await server.ssrLoadModule("/src/services/quoteApi.js");
  proposals = await server.ssrLoadModule("/src/services/proposalService.js");
});
after(async () => { globalThis.fetch = originalFetch; await server?.close(); });
test("lista, detalhe, conversão e atualização usam API e identidade retornada pelo backend", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json(url.endsWith("/quotes") ? [{ id: "ORC-10000", status: "Em elaboração" }] : { id: "ORC-10000", revision: 2 });
  };
  assert.equal((await quotes.getActiveQuotes())[0].id, "ORC-10000");
  assert.equal((await quotes.getQuoteById("ORC-10000")).id, "ORC-10000");
  assert.equal((await quotes.createQuoteFromRequest({ id: "SOL-0001" })).id, "ORC-10000");
  await quotes.updateQuote({ id: "ORC-10000", revision: 1 }, { scope: "Persistir", items: [] });
  assert.deepEqual(calls.map(call => call.url), ["/api/quotes", "/api/quotes/ORC-10000", "/api/requests/SOL-0001/quote", "/api/quotes/ORC-10000"]);
  assert.equal(calls[2].options.method, "POST");
  assert.equal("id" in JSON.parse(calls[2].options.body), false);
  assert.equal(calls[3].options.method, "PUT");
  assert.equal(JSON.parse(calls[3].options.body).revision, 1);
});
test("ações só resolvem após a resposta da API", async () => {
  let finish;
  globalThis.fetch = () => new Promise(resolve => { finish = resolve; });
  let completed = false;
  const pending = quotes.createQuoteFromRequest({ id: "SOL-0001" }).then(value => { completed = true; return value; });
  await Promise.resolve();
  assert.equal(completed, false);
  finish(Response.json({ id: "ORC-4321" }));
  assert.equal((await pending).id, "ORC-4321");
});
test("falhas de rede e conflito não geram ORC local nem devolvem mocks", async () => {
  globalThis.fetch = async () => { throw new TypeError("offline"); };
  for (const action of [() => quotes.getActiveQuotes(), () => quotes.getQuoteById("ORC-0001"), () => quotes.createQuoteFromRequest({ id: "SOL-0001" }), () => quotes.updateQuote({ id: "ORC-0001", revision: 0 }, {})]) {
    await assert.rejects(action(), /conectar à API/);
  }
  globalThis.fetch = async () => Response.json({ message: "Estado incompatível" }, { status: 409 });
  await assert.rejects(quotes.createQuoteFromRequest({ id: "SOL-0001" }), /Estado incompatível/);
  await assert.rejects(quotes.sendQuoteToReview({ id: "ORC-0001", revision: 0 }), /Estado incompatível/);
});
test("Proposal Builder persiste rascunho, nova versão e resultado pela API", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return Response.json({ revision: 4 }); };
  await proposals.getProposalByQuoteId("ORC-0001");
  await proposals.openProposal("ORC-0001");
  await proposals.saveProposalDraft("ORC-0001", { content: { notes: "Persistir" } }, 2);
  await proposals.getDraftDocument("ORC-0001");
  await proposals.createNextProposalDraft("ORC-0001", 3);
  await proposals.registerProposalResult("ORC-0001", 1, { type: "accepted" }, 4);
  assert.deepEqual(calls.map(call => call.options.method), ["GET", "POST", "PUT", "GET", "POST", "POST"]);
  assert.equal(JSON.parse(calls[2].options.body).revision, 2);
  assert.equal(calls.at(-1).url, "/api/quotes/ORC-0001/proposal/versions/1/result");
  globalThis.fetch = async () => { throw new Error("offline"); };
  await assert.rejects(proposals.openProposal("ORC-0001"), /conectar à API/);
});
test("rotas reais começam em loading, sem renderizar dados demo", async () => {
  for (const [path, name] of [["QuotesPage", "QuotesPage"], ["QuoteDetailPage", "QuoteDetailPage"], ["ProposalBuilderPage", "ProposalBuilderPage"]]) {
    const module = await server.ssrLoadModule(`/src/pages/internal/${path}.jsx`);
    const html = renderToString(createElement(MemoryRouter, null, createElement(module[name])));
    assert.match(html, /Carregando/);
    assert.doesNotMatch(html, /Componentes Ômega|ORC-0012/);
  }
});
test("rotas reais não importam repositórios de demonstração nem geram códigos", async () => {
  const files = ["services/quoteService.js", "services/quoteApi.js", "services/quotePieceService.js", "services/proposalService.js", "hooks/useQuote.js", "pages/internal/QuotesPage.jsx", "pages/internal/QuoteDetailPage.jsx", "pages/internal/RequestDetailPage.jsx", "pages/internal/ProposalBuilderPage.jsx", "components/internal/QuoteFilters.jsx"];
  for (const file of files) {
    const source = await readFile(new URL(`../src/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /runtimeQuotes|demoQuoteService|demoProposalService|data\/internal\/quotes|data\/internal\/requests|localStorage|generateNextQuoteId|padStart\(4/, file);
  }
  assert.equal("getRuntimeQuoteById" in quotes, false);
  assert.equal("resetRuntimeQuotes" in quotes, false);
  assert.equal("createPersistedQuote" in api, true);
});
