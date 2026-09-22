import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createServer } from "vite";

let server, api;
const originalFetch = globalThis.fetch;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  api = await server.ssrLoadModule("/src/services/requestApi.js");
});
after(async () => { globalThis.fetch = originalFetch; await server?.close(); });

test("lista e detalhe consultam a API", async () => {
  const calls = [];
  globalThis.fetch = async (url) => { calls.push(url); return new Response(JSON.stringify([{ id: "SOL-1000" }]), { status: 200 }); };
  assert.equal((await api.listPersistedRequests())[0].id, "SOL-1000");
  await api.getPersistedRequest("SOL-1000");
  assert.deepEqual(calls, ["/api/requests", "/api/requests/SOL-1000"]);
});

test("erros da API são propagados", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ message: "Estado inválido" }), { status: 409 });
  await assert.rejects(api.startPersistedAnalysis("SOL-1000"), /Estado inválido/);
});

test("API indisponível propaga erro e não retorna fallback", async () => {
  globalThis.fetch = async () => { throw new TypeError("offline"); };
  await assert.rejects(api.listPersistedRequests(), /conectar à API/);
});

test("criação preserva serviço principal e peça complementar; ações aguardam resposta", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({ id: "SOL-1001" }), { status: 200 });
  };
  await api.createPersistedRequest({ contact: { company: "A", name: "B" }, project: { requestNeedId: "failure-analysis" }, pieces: [{ name: "Peça", quantity: 1, services: ["internal"] }] });
  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.project.requestNeedId, "failure-analysis");
  assert.deepEqual(body.pieces[0].services, ["internal"]);
  assert.equal("id" in body, false);
  assert.equal("source" in body, false);
  await api.finishPersistedAnalysis("SOL-1001", { result: "quote-ready", technicalSummary: "Apta" });
  assert.equal(calls[1].url, "/api/requests/SOL-1001/analysis/finish");
});
