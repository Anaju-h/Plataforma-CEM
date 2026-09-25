import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createServer } from "vite";
let server, api;
const originalFetch = globalThis.fetch;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  api = await server.ssrLoadModule("/src/services/customer/customerService.js");
});
after(async () => { globalThis.fetch = originalFetch; await server?.close(); });
test("context, lists and detail use scoped endpoints without browser identity", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return new Response("[]"); };
  await api.getCurrentCustomer(); await api.getCustomerRequests(); await api.getCustomerRequest("SOL-123");
  await api.getCustomerQuotes(); await api.getCustomerProjects();
  assert.deepEqual(calls.map(c => c.url), ["/api/customer/context", "/api/customer/requests", "/api/customer/requests/SOL-123", "/api/customer/quotes", "/api/customer/projects"]);
  calls.forEach(c => assert.deepEqual(c.options.headers, { "Content-Type": "application/json" }));
});
test("creation uses server code and shared payload for equipment-free training", async () => {
  let sent;
  globalThis.fetch = async (url, options) => { sent = { url, data: JSON.parse(options.body) }; return new Response('{"id":"SOL-999"}'); };
  const result = await api.createCustomerRequest({ contact: { company: "A", name: "B" }, project: { requestNeedId: "training" }, pieces: [] });
  assert.equal(sent.url, "/api/customer/requests");assert.equal(result.id, "SOL-999");
  assert.equal(sent.data.id, undefined);assert.equal(sent.data.customerUserId, undefined);
  assert.equal(sent.data.origin, "Cliente");assert.deepEqual(sent.data.pieces, []);
  assert.equal(sent.data.channel, "Área do cliente");
});
test("acceptance targets exact presented version and revision; conflicts propagate", async () => {
  let sent;
  globalThis.fetch = async (url, options) => { sent = { url, data: JSON.parse(options.body) }; return new Response('{"message":"Conflito"}', { status: 409 }); };
  await assert.rejects(api.respondToCustomerProposal({ id: "ORC-42", revision: 8 }, { version: 2 }, "rejected", "Prazo"), /Conflito/);
  assert.equal(sent.url, "/api/customer/quotes/ORC-42/proposal/versions/2/result");
  assert.equal(sent.data.revision, 8);assert.equal(sent.data.note, "Prazo");
});
test("offline cannot return mocks or successful creation", async () => {
  globalThis.fetch = async () => { throw new Error("offline"); };
  for (const load of [api.getCurrentCustomer, api.getCustomerRequests, api.getCustomerQuotes, api.getCustomerProjects]) await assert.rejects(load(), /API/);
});
