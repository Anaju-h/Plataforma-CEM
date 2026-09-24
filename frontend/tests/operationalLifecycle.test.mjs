import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createServer } from "vite";

let server, quotes, projects, requests, history, work, team;
const originalFetch = globalThis.fetch;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  [quotes, projects, requests, history, work, team] = await Promise.all([
    "quoteService", "projectService", "requestService", "operationalHistoryService", "workService", "teamService",
  ].map(name => server.ssrLoadModule(`/src/services/${name}.js`)));
});
after(async () => { globalThis.fetch = originalFetch; await server?.close(); });
const record = (id, status, extra = {}) => ({ id, status, company: "Persistido", source: "real", responsible: "Administrador", createdAt: "23/09/2026", ...extra });
function respond(data) {
  globalThis.fetch = async url => {
    assert.ok(Object.hasOwn(data, url), `Unexpected request: ${url}`);
    return Response.json(data[url]);
  };
}
test("ORC aceito sem PRJ permanece ativo; vínculo persistido encerra a etapa sem mudar Aceito", async () => {
  const accepted = record("ORC-0101", "Aceito");
  const converted = record("ORC-0102", "Aceito", { projectId: "PRJ-0102" });
  const refused = record("ORC-0103", "Recusado");
  const cancelled = record("ORC-0104", "Cancelado");
  respond({ "/api/quotes": [accepted, converted, refused, cancelled], "/api/requests": [], "/api/projects": [] });
  assert.deepEqual((await quotes.getActiveQuotes()).map(q => q.id), [accepted.id]);
  assert.deepEqual((await quotes.getArchivedQuotes()).map(q => q.id), [converted.id, refused.id, cancelled.id]);
  assert.equal(converted.status, "Aceito");
  const userWork = await work.getCurrentUserWork();
  assert.deepEqual(userWork.activeQuotes.map(q => q.id), [accepted.id]);
  assert.equal((await team.getTeamOverview()).activeQuotes, 1);
  const archived = await history.getOperationalHistory({ search: converted.projectId });
  assert.equal(archived.length, 1);assert.equal(archived[0].nextId, converted.projectId);
  assert.equal(archived[0].path, `/portal/orcamentos/${converted.id}`);
  // A fresh response after conversion/F5 controls classification, without local mutations.
  respond({ "/api/quotes": [{ ...accepted, projectId: "PRJ-0101" }] });
  assert.deepEqual(await quotes.getActiveQuotes(), []);
  assert.equal((await quotes.getArchivedQuotes())[0].status, "Aceito");
});
test("Histórico combina somente SOL, ORC e PRJ encerrados retornados pela API", async () => {
  respond({
    "/api/requests": [record("SOL-0100", "Nova"), record("SOL-0101", "Convertida em orçamento", { linkedQuoteId: "ORC-0101" })],
    "/api/quotes": [record("ORC-0100", "Aceito"), record("ORC-0101", "Aceito", { projectId: "PRJ-0101" })],
    "/api/projects": [record("PRJ-0100", "Aguardando execução"), record("PRJ-0101", "Concluído"), record("PRJ-0102", "Cancelado")],
  });
  const archived = await history.getOperationalHistory();
  assert.deepEqual(archived.map(e => e.record.id).sort(), ["ORC-0101", "PRJ-0101", "PRJ-0102", "SOL-0101"]);
  assert.equal((await requests.getActiveRequests()).length, 1);
  assert.deepEqual((await projects.getActiveProjects()).map(p => p.id), ["PRJ-0100"]);
});
test("categorias vazias carregam; API offline rejeita sem fixtures ou sucesso fictício", async () => {
  respond({ "/api/requests": [], "/api/quotes": [], "/api/projects": [] });
  assert.deepEqual(await history.getOperationalHistory(), []);
  const empty = await work.getCurrentUserWork();
  assert.deepEqual(empty.activeQuotes, []);assert.deepEqual(empty.activeProjects, []);
  assert.equal((await team.getTeamOverview()).activeQuotes, 0);
  globalThis.fetch = async () => { throw new Error("offline"); };
  for (const read of [quotes.getActiveQuotes, projects.getActiveProjects, requests.getActiveRequests, history.getOperationalHistory, work.getCurrentUserWork]) {
    await assert.rejects(read(), /API/);
  }
});
