import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

let server, projects, Workflow;
const originalFetch = globalThis.fetch;
const accepted = { id: "ORC-0123", status: "Aceito", proposal: { id: "PROP-0123", acceptedVersion: 2, versions: [{ version: 2, status: "accepted", locked: true }] } };
const project = { id: "PRJ-10000", technicalId: "uuid", quoteId: accepted.id, status: "Planejamento", revision: 0, tasks: [], history: [] };
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom" });
  projects = await server.ssrLoadModule("/src/services/projectService.js");
  ({ QuoteWorkflowActions: Workflow } = await server.ssrLoadModule("/src/pages/internal/QuoteDetailPage.jsx"));
});
after(async () => { globalThis.fetch = originalFetch; await server?.close(); });

test("aceite válido habilita a ação; vínculo existente oferece abrir, sem criar outro", () => {
  const render = quote => renderToString(createElement(Workflow, { quote, linkedProject: quote.projectId ? { id: quote.projectId } : null }));
  assert.match(render(accepted), /Criar projeto/);
  for (const quote of [{ ...accepted, status: "Enviado" }, { ...accepted, proposal: null }, { ...accepted, proposal: { ...accepted.proposal, acceptedVersion: null } }]) {
    assert.equal(projects.canCreateProject(quote), false);
    assert.doesNotMatch(render(quote), /Criar projeto/);
  }
  const linked = { ...accepted, projectId: project.id };
  assert.equal(projects.canCreateProject(linked), false);
  assert.match(render(linked), /Abrir projeto PRJ-10000/);
  assert.doesNotMatch(render(linked), /Criar projeto/);
});
test("criação, lista, detalhe e atualizações usam API e identidade do servidor", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return Response.json(url.endsWith("/projects") ? [project] : project); };
  assert.equal((await projects.createProjectFromQuote(accepted)).id, project.id);
  assert.equal((await projects.getActiveProjects())[0].id, project.id);
  assert.equal((await projects.getRuntimeProjectById(project.id)).id, project.id);
  await projects.saveProjectInternalNotes(project, "Persistir");
  await projects.updateProjectTask(project, "task-id", true);
  assert.deepEqual(calls.map(call => call.url), ["/api/quotes/ORC-0123/project", "/api/projects", "/api/projects/PRJ-10000", "/api/projects/PRJ-10000", "/api/projects/PRJ-10000"]);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.body, undefined);
  assert.deepEqual(JSON.parse(calls[3].options.body), { internalNotes: "Persistir", operation: "notes", revision: 0 });
  assert.equal(JSON.parse(calls[4].options.body).operation, "task");
  calls.length = 0;
  await projects.createProjectFromQuote({ ...accepted, projectId: project.id });
  assert.equal(calls.length, 1);assert.equal(calls[0].options.method, undefined);
  await assert.rejects(projects.createProjectFromQuote({ ...accepted, status: "Enviado" }), /proposta aceita/);
  assert.equal(calls.length, 1);
});
test("falha de API não devolve fixture, não cria localmente e não resolve sucesso antecipado", async () => {
  globalThis.fetch = async () => { throw new Error("offline"); };
  for (const action of [() => projects.createProjectFromQuote(accepted), () => projects.getActiveProjects(), () => projects.getRuntimeProjectById(project.id), () => projects.saveProjectInternalNotes(project, "nota")]) await assert.rejects(action(), /API de projetos/);
  globalThis.fetch = async () => Response.json({ message: "Atualize a página" }, { status: 409 });
  await assert.rejects(projects.startProjectExecution(project), /Atualize a página/);
  let finish, resolved = false;
  globalThis.fetch = () => new Promise(resolve => { finish = resolve; });
  const pending = projects.createProjectFromQuote(accepted).then(value => { resolved = true; return value; });
  await Promise.resolve();assert.equal(resolved, false);
  finish(Response.json(project));assert.equal((await pending).id, project.id);
});
test("páginas reais começam em loading sem fixtures e não possuem geração local de PRJ", async () => {
  for (const name of ["ProjectsPage", "ProjectDetailPage"]) {
    const module = await server.ssrLoadModule(`/src/pages/internal/${name}.jsx`);
    const html = renderToString(createElement(MemoryRouter, null, createElement(module[name])));
    assert.match(html, /Carregando projeto/);assert.doesNotMatch(html, /PRJ-000[1-9]/);
  }
  for (const file of ["services/projectApi.js", "services/projectService.js", "pages/internal/ProjectsPage.jsx", "pages/internal/ProjectDetailPage.jsx"]) {
    const source = await readFile(new URL(`../src/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /demoProjectService|demoQuoteService|generateNextProjectId|padStart\(4|localStorage/, file);
  }
});
