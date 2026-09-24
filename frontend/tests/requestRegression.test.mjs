import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let server, validation, requests;
const originalFetch = globalThis.fetch;
before(async () => {
  server = await createServer({ optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  validation = await server.ssrLoadModule("/src/services/workflowValidation.js");
  requests = await server.ssrLoadModule("/src/services/requestService.js");
});
after(async () => { globalThis.fetch = originalFetch; await server?.close(); });

test("conclusão exige resumo e requisitos condicionais, sem inventar obrigatoriedade de tecnologia/complexidade", () => {
  assert.equal(validation.validateRequestAnalysis({ summary: "   " }).isValid, false);
  const analysis = { summary: "Inspeção viável", complexity: "", technology: "" };
  assert.equal(validation.validateRequestAnalysis(analysis).isValid, true);
  assert.deepEqual(validation.validateRequestAnalysis(analysis, "waiting-information").issues.map(issue => issue.field), ["pendingInformation"]);
  assert.equal(validation.validateRequestAnalysis({ ...analysis, pendingInformation: "Desenho técnico" }, "waiting-information").isValid, true);
  assert.deepEqual(validation.validateRequestAnalysis(analysis, "rejected").issues.map(issue => issue.field), ["decisionReason"]);
  assert.equal(validation.validateRequestAnalysis({ ...analysis, decisionReason: "Fora do escopo" }, "rejected").isValid, true);
});

test("análise inválida e cancelamento vazio nunca enviam mutation", async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error("Não deve acessar a API"); };
  await assert.rejects(requests.finishRequestAnalysis("SOL-1", { result: "quote-ready", summary: "" }), /resumo técnico/);
  await assert.rejects(requests.finishRequestAnalysis("SOL-1", { result: "waiting-information", summary: "Resumo" }), /informações/);
  await assert.rejects(requests.cancelRequest("SOL-1", "  "), /motivo/);
  assert.equal(calls, 0);
});

test("classificação visual vem do ID persistido e permanece após mutations, sem trocar dados da API", async () => {
  const record = { id: "SOL-1234", requestNeedId: "failure-analysis", company: "Empresa persistida", status: "Em análise" };
  globalThis.fetch = async () => new Response(JSON.stringify(record));
  for (const result of [await requests.getRequestById(record.id), await requests.startRequestAnalysis(record.id), await requests.finishRequestAnalysis(record.id, { summary: "Resumo", result: "quote-ready" })]) {
    assert.equal(result.company, record.company);
    assert.equal(result.requestNeed.id, record.requestNeedId);
    assert.equal(result.requestNeed.flow, "direct-request");
  }
});
