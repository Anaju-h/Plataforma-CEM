import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";

test("internal notifications follow canonical customer SOLs and accepted ORCs", async () => {
  const server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  const original = globalThis.fetch;
  try {
    const notifications = await server.ssrLoadModule("/src/services/notificationService.js");
    const records = {
      "/api/requests": [{ id: "SOL-9000", status: "Nova", company: "Cliente A", source: "real", origin: "Cliente", responsible: "Administrador", priority: "Urgente", createdAt: "01/09/2026", service: "training" }],
      "/api/quotes": [{ id: "ORC-9000", status: "Aceito", company: "Cliente A", source: "real", responsible: "Administrador", createdAt: "01/09/2026" }],
      "/api/projects": [],
    };
    globalThis.fetch = async url => { assert.ok(Object.hasOwn(records, url));return Response.json(records[url]); };
    const active = await notifications.getNotifications();
    assert.ok(active.some(item => item.referenceId === "SOL-9000"));
    assert.ok(active.some(item => item.referenceId === "ORC-9000"));
    records["/api/quotes"][0].projectId = "PRJ-9000";
    assert.equal((await notifications.getNotifications()).some(item => item.referenceId === "ORC-9000"), false);
  } finally { globalThis.fetch = original;await server.close(); }
});
