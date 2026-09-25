import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
let server, Access, Header, Panel;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  Access = (await server.ssrLoadModule("/src/pages/customer/CustomerAccessPage.jsx")).CustomerAccessPage;
  Header = (await server.ssrLoadModule("/src/components/layout/Header.jsx")).Header;
  Panel = (await server.ssrLoadModule("/src/components/customer/CustomerListLayout.jsx")).CustomerListPanel;
});
after(async () => { await server?.close(); });
test("public entry links point to /cliente; access page offers navigation without credentials", () => {
  const access = renderToStaticMarkup(h(MemoryRouter, null, h(Access)));
  assert.match(access, /href="\/cliente\/dashboard"/);
  assert.match(access, /Acessar área do cliente/);
  assert.doesNotMatch(access, /<input|<form/);
  const header = renderToStaticMarkup(h(MemoryRouter, null, h(Header)));
  assert.equal([...header.matchAll(/href="\/cliente"/g)].length, 2);
  assert.doesNotMatch(header, /href="\/cliente\/dashboard"/);
});
test("shared list panel keeps empty, loading and retry inside the same list card", () => {
  const base = { columns: ["Código", "Serviço", "Data", "Status"], emptyTitle: "Nenhum registro", emptyDescription: "Acompanhe aqui.", state: { data: [], loading: false, error: "" } };
  const empty = renderToStaticMarkup(h(Panel, base));
  assert.match(empty, /<section[^>]+aria-label="Listagem"/);
  assert.match(empty, /role="status"/);assert.match(empty, /Nenhum registro/);
  const error = renderToStaticMarkup(h(Panel, { ...base, state: { error: "API offline", retry() {} } }));
  assert.match(error, /role="alert"/);assert.match(error, /Tentar novamente/);
  assert.doesNotMatch(error, /Nenhum registro/);
  const loading = renderToStaticMarkup(h(Panel, { ...base, state: { loading: true } }));
  assert.match(loading, /Carregando/);assert.doesNotMatch(loading, /Nenhum registro/);
});
