import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

let server, users, team;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  users = await server.ssrLoadModule("/src/services/currentUserService.js");
  team = await server.ssrLoadModule("/src/services/teamService.js");
});
after(async () => { await server?.close(); });

test("editar conta notifica consumidores sem alterar perfil ou atribuições", async () => {
  const original = users.getCurrentUser();
  const workload = team.getTeamOverview().members[0].workload;
  let updates = 0;
  const unsubscribe = users.subscribeCurrentUser(() => updates++);
  try {
    assert.throws(() => users.updateCurrentUser({ name: " ", email: "" }));
    assert.throws(() => users.updateCurrentUser({ name: "Nome", email: "invalido" }));
    assert.equal(users.getCurrentUser(), original);
    const saved = users.updateCurrentUser({ name: " Ana Teste ", email: " ana@example.com ", accessProfile: "Outro", id: "outro" });
    assert.equal(saved.name, "Ana Teste");
    assert.equal(saved.email, "ana@example.com");
    assert.equal(saved.initials, "AT");
    assert.equal(saved.id, original.id);
    assert.equal(saved.accessProfile, original.accessProfile);
    assert.deepEqual(saved.permissions, original.permissions);
    assert.equal(updates, 1);
    assert.equal(users.updateCurrentUser(saved), saved);
    assert.equal(updates, 1);
    assert.deepEqual(team.getTeamOverview().members[0].workload, workload);
    assert.equal(users.getCurrentTeamMembers()[0], saved);
    for (const [path, exported] of [
      ["components/internal/InternalHeader", "InternalHeader"],
      ["components/internal/InternalSidebar", "InternalSidebar"],
      ["pages/internal/TeamPage", "TeamPage"],
      ["pages/internal/InternalAccountPage", "InternalAccountPage"],
    ]) {
      const module = await server.ssrLoadModule(`/src/${path}.jsx`);
      const html = renderToString(createElement(MemoryRouter, null, createElement(module[exported])));
      assert.match(html, /Ana Teste/, path);
      if (exported === "InternalSidebar") assert.match(html, /aria-label="Minha Conta"/);
      else if (exported !== "InternalAccountPage") assert.match(html, /href="\/portal\/conta"/);
      else {
        assert.match(html, /ana@example.com/);
        assert.match(html, /somente leitura/);
        assert.doesNotMatch(html, /type="password"|2FA/);
      }
    }
  } finally {
    unsubscribe();
    users.updateCurrentUser(original);
  }
  assert.equal(updates, 1);
});
