// Executed only by the database-guarded ProjectResourceTest.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve, basename } from "node:path";
import { createServer } from "vite";

assert.equal(process.env.LAB_BROWSER_TEST_DATABASE, "lab_platform_test", "Run through the guarded Quarkus test");
const chromePath = process.env.LAB_TEST_CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = await mkdtemp(join(tmpdir(), "lab-orc-browser-"));
const vite = await createServer({ root: process.cwd(), define: { "import.meta.env.VITE_API_URL": JSON.stringify("/api") }, server: { host: "127.0.0.1", port: 5198, strictPort: true, proxy: { "/api": { target: `http://localhost:${process.env.LAB_BROWSER_TEST_PORT}`, changeOrigin: true } } } });
let chrome, socket;
let debugPage = async () => "Browser not ready";
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(fn, label, timeout = 60000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) { try { if (await fn()) return; } catch { /* Navigation replaces the JS context. */ } await pause(150); }
  throw new Error(`Timeout: ${label}`);
}
async function api(path, method = "GET", data) {
  const response = await fetch(`http://localhost:${process.env.LAB_BROWSER_TEST_PORT}/api${path}`, { method, signal: AbortSignal.timeout(15000), headers: { "Content-Type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
  const result = await response.json();assert.equal(response.ok, true, `${path}: ${JSON.stringify(result)}`);return result;
}
try {
  await vite.listen();
  chrome = spawn(chromePath, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-background-networking", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { windowsHide: true, stdio: "ignore" });
  let port;
  await until(async () => { port = (await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]; return !!port; }, "Chrome startup");
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(pages.find(page => page.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let sequence = 0;const pending = new Map();const exceptions = [];const requests = [];
  let emptyCollections = false;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(id, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {const waiter = pending.get(message.id);pending.delete(message.id);message.error ? waiter?.reject(new Error(message.error.message)) : waiter?.resolve(message.result);}
    if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails.text);
    if (message.method === "Network.requestWillBeSent" && message.params.request.url.includes('/api/')) requests.push({ method: message.params.request.method, url: message.params.request.url, body: message.params.request.postData });
    if (message.method === "Fetch.requestPaused") {
      const requestId = message.params.requestId;
      (emptyCollections
        ? send("Fetch.fulfillRequest", { requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: "application/json" }], body: "W10=" })
        : send("Fetch.failRequest", { requestId, errorReason: "ConnectionFailed" })).catch(() => {});
    }
  };
  const evaluate = async expression => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const text = () => evaluate("document.body.textContent");
  debugPage = async () => ({ text: await text(), exceptions, requests: requests.filter(request => request.method !== "GET"), path: await evaluate("location.pathname"), note: await evaluate("(() => { const f=document.querySelector('#proposal-commercial-note'); return f && {value:f.value,readOnly:f.readOnly,focused:document.activeElement===f}; })()") });
  const click = label => evaluate(`(() => { const buttons = [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === ${JSON.stringify(label)} && !b.disabled); if (!buttons.length) throw Error('Missing button'); buttons.at(-1).click(); return true; })()`);
  const enabled = label => evaluate(`[...document.querySelectorAll('button')].some(b => b.textContent.trim() === ${JSON.stringify(label)} && !b.disabled)`);
  const fill = (selector, value) => evaluate(`(() => { const field = document.querySelector(${JSON.stringify(selector)}); field.focus(); Object.getOwnPropertyDescriptor(Object.getPrototypeOf(field), 'value').set.call(field, ${JSON.stringify(value)}); field.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const screenshot = async name => { const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true }); await writeFile(`${process.env.LAB_BROWSER_OUTPUT}/${name}.png`, Buffer.from(result.data, "base64")); };
  const navigate = async path => {
    console.log('Navigate:', path);
    await send("Page.navigate", { url: `http://127.0.0.1:5198${path}` });
    await until(() => evaluate(`location.pathname === ${JSON.stringify(path)} && document.readyState !== 'loading'`), 'navigation ready');
  };
  const reload = async () => {
    await evaluate('window.__beforeTestReload = true');
    await send('Page.reload');
    await until(() => evaluate("!window.__beforeTestReload && document.readyState !== 'loading'"), 'new document after reload');
  };
  await send("Page.enable");await send("Runtime.enable");await send("Network.enable");await send("Page.bringToFront");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `localStorage.setItem('lab-portal-session', JSON.stringify({authenticated:true,role:'ADMIN'}));` });

  const request = await api("/requests", "POST", {
    contact: { company: "Regressão operacional TEST", name: "Contato" },
    project: { requestNeedId: "training", objective: "Validar SOL ORC PRJ e Histórico" }, pieces: [],
  });
  await api(`/requests/${request.id}/analysis/start`, "POST");
  await api(`/requests/${request.id}/analysis/finish`, "POST", { result: "quote-ready", technicalSummary: "Análise para regressão do fluxo" });
  let quote = await api(`/requests/${request.id}/quote`, "POST", { hourlyRate: 150 });
  const quoteId = quote.id;
  assert.equal(quote.machineId, null);
  assert.equal(quote.serviceId, "training");
  await navigate("/portal/historico");
  await until(async () => (await text()).includes(request.id), "converted SOL in history");
  await reload();await until(async () => (await text()).includes(request.id), "SOL history after F5");
  assert.equal(await evaluate(`[...document.querySelectorAll('a')].some(a => a.getAttribute('href') === '/portal/orcamentos/${quoteId}')`), true);
  quote = await api(`/quotes/${quoteId}`, "PUT", { ...quote, scope: "Escopo de regressão", machineId: null, estimateJustification: "Inspeção",
    items: quote.items.map(item => ({ ...item, technicalHours: 2, quotedHours: 3 })) });
  await navigate(`/portal/orcamentos/${quoteId}`);
  await until(() => enabled("Salvar orçamento"), "optional quote editing");
  assert.ok((await text()).includes("Sem equipamento específico / Não se aplica"));
  await click("Salvar orçamento");
  await until(async () => (await text()).includes("Alterações salvas."), "optional quote saved without equipment");
  await reload();
  await until(() => enabled("Salvar orçamento"), "optional quote after F5");
  quote = await api(`/quotes/${quoteId}`);
  assert.equal(quote.machineId, null);
  quote = await api(`/quotes/${quoteId}/status`, "POST", { revision: quote.revision, status: "Em revisão" });
  quote = await api(`/quotes/${quoteId}/status`, "POST", { revision: quote.revision, status: "Aprovado internamente" });
  let proposal = await api(`/quotes/${quoteId}/proposal`, "POST");
  const document = await api(`/quotes/${quoteId}/proposal/document`);
  proposal = await api(`/quotes/${quoteId}/proposal/versions`, "POST", { revision: proposal.revision, sourceQuoteRevision: quote.revision,
    snapshot: document.snapshot, pdfFileName: "regression.pdf", pdf: { pageCount: 1 } });
  await api(`/quotes/${quoteId}/proposal/versions/1/result`, "POST", { revision: proposal.revision, type: "accepted", date: "2026-09-23", note: "Aceite de regressão TEST" });
  await navigate("/portal/orcamentos");
  await until(async () => (await text()).includes(quoteId), "accepted quote without project stays active");
  await navigate(`/portal/orcamentos/${process.env.LAB_BROWSER_DRAFT_QUOTE}`);
  await until(async () => (await text()).includes("Salvar orçamento"), "draft quote");
  assert.equal(await enabled("Criar projeto"), false);
  await navigate(`/portal/orcamentos/${quoteId}/proposta`);
  await until(async () => (await text()).includes("V1"), "accepted proposal in Builder");
  await navigate(`/portal/orcamentos/${quoteId}`);
  await until(() => enabled("Criar projeto"), "accepted quote action");
  assert.doesNotMatch(await text(), /Base real|BASE REAL|Demonstração/);
  await screenshot("prj-accepted-quote");
  await click("Criar projeto");
  await until(() => enabled("Concluir planejamento"), "persisted project detail");
  const projectId = await evaluate("location.pathname.split('/').at(-1)");
  assert.equal((await api(`/projects/${projectId}`)).machineId, null);
  assert.equal((await api(`/projects/${projectId}`)).serviceId, "training");
  assert.ok((await text()).includes("Sem equipamento específico"));
  assert.match(projectId, /^PRJ-\d{4,}$/);
  await fill("textarea", "Observações PRJ salvas no navegador");
  await click("Salvar observações");
  await until(async () => (await text()).includes("Observações internas salvas."), "notes saved");
  await click("Conferir informações do serviço");
  await until(async () => (await api(`/projects/${projectId}`)).tasks[0].completed, "task persisted");
  await reload();
  await until(() => evaluate("document.querySelector('textarea')?.value === 'Observações PRJ salvas no navegador'"), "notes after F5");
  assert.equal(await evaluate("[...document.querySelectorAll('button')].some(b => b.textContent.includes('Conferir informações do serviço') && b.textContent.includes('✓'))"), true);
  await screenshot("prj-detail");
  await click("Concluir planejamento");
  await until(() => enabled("Iniciar execução"), "planning persisted");
  await reload();await until(() => enabled("Iniciar execução"), "status after F5");
  await navigate("/portal/projetos");
  await until(async () => (await text()).includes(projectId), "persisted project list");
  await screenshot("prj-list");
  await navigate(`/portal/orcamentos/${quoteId}`);
  await until(() => enabled(`Abrir projeto ${projectId}`), "reciprocal quote link");
  assert.equal(await enabled("Criar projeto"), false);
  await click(`Abrir projeto ${projectId}`);
  await until(() => enabled("Iniciar execução"), "open existing project");
  assert.equal(requests.filter(r=>r.method==="POST"&&r.url.endsWith(`/quotes/${quoteId}/project`)).length,1);
  assert.equal((await api(`/quotes/${quoteId}/project`, "POST")).id, projectId, "duplicate conversion returns existing project");
  const linkedQuote = await api(`/quotes/${quoteId}`);
  assert.equal(linkedQuote.status, "Aceito");
  assert.equal(linkedQuote.history.filter(event => event.action === "Projeto criado").length, 1);
  await navigate("/portal/orcamentos");
  await until(() => evaluate("!!document.querySelector('input[type=search]')"), "active quotes loaded");
  assert.equal((await text()).includes(quoteId), false, "linked quote is not active");
  await reload();await until(() => evaluate("!!document.querySelector('input[type=search]')"), "active quotes after F5");
  assert.equal((await text()).includes(quoteId), false);
  await navigate("/portal/historico");
  await until(async () => (await text()).includes(quoteId), "linked quote in history");
  assert.equal(await evaluate(`[...document.querySelectorAll('a')].some(a => a.getAttribute('href') === '/portal/projetos/${projectId}')`), true);
  await navigate(`/portal/projetos/${projectId}`);
  await until(() => enabled("Iniciar execução"), "project from history");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/projects*" }] });
  await navigate("/portal/projetos");
  await until(async () => (await text()).includes("Tentar novamente"), "list offline");
  assert.equal((await text()).includes(projectId), false);
  await navigate(`/portal/projetos/${projectId}`);
  await until(async () => (await text()).includes("Tentar novamente"), "detail offline");
  assert.equal(await enabled("Salvar observações"), false);
  await send("Fetch.disable");await click("Tentar novamente");
  await until(() => enabled("Iniciar execução"), "retry restores project");
  await click("Iniciar execução");await until(() => enabled("Enviar para revisão"), "execution started");
  for (const task of (await api(`/projects/${projectId}`)).tasks.filter(task => !task.completed)) {
    await click(task.title);
    await until(async () => (await api(`/projects/${projectId}`)).tasks.find(item => item.id === task.id).completed, "checklist update");
  }
  await click("Enviar para revisão");await until(() => enabled("Concluir projeto"), "review");
  await click("Concluir projeto");await until(async () => (await text()).includes("Todas as etapas estão concluídas"), "completion confirmation");
  await click("Concluir projeto");await until(() => enabled("Reabrir projeto"), "completed");
  await reload();await until(() => enabled("Reabrir projeto"), "completion after F5");
  assert.equal((await api(`/projects/${projectId}`)).status, "Concluído");
  assert.doesNotMatch(await text(), /Ã[§£­]|Â·/);
  await navigate("/portal/projetos");
  await until(() => evaluate("!!document.querySelector('input[type=search]')"), "project list loaded");
  assert.equal((await text()).includes(projectId), false, "completed project is not active");
  await navigate("/portal/historico");
  await until(async () => (await text()).includes(projectId), "completed project history");
  await reload();
  await until(() => evaluate(`[...document.querySelectorAll('article')].some(a => a.textContent.includes('${projectId} · Projeto'))`), "project history after F5");
  for (const id of [request.id, quoteId, projectId]) assert.ok((await text()).includes(id));
  await screenshot("operational-history-complete");
  await navigate("/portal/meu-trabalho");
  await until(async () => (await text()).includes("Solicitações abertas"), "real work dashboard");
  emptyCollections = true;
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/*" }] });
  for (const path of ["solicitacoes", "orcamentos", "projetos", "historico", "meu-trabalho"]) {
    await navigate(`/portal/${path}`);
    await until(async () => { const body = await text(); return !body.includes("Carregando") && (body.includes("Nenhum") || body.includes("Solicitações abertas")); }, `empty ${path}`);
    assert.equal((await text()).includes("Tentar novamente"), false);
    assert.equal((await text()).includes("Regressão operacional TEST"), false);
  }
  emptyCollections = false;
  await navigate("/portal/historico");
  await until(async () => (await text()).includes("Tentar novamente"), "history offline");
  assert.equal((await text()).includes(projectId), false);
  await send("Fetch.disable");
  assert.deepEqual(exceptions, []);
  console.log(`Lifecycle browser passed: ${request.id} -> ${quoteId} -> ${projectId} -> Concluído; active/history classification, links, full checklist, F5, duplicate prevention, offline/retry, empty pages and work dashboard.`);
} catch (error) {
  console.error(JSON.stringify(await debugPage()));
  throw error;
} finally {
  socket?.close();chrome?.kill();await vite.close();
  await pause(500);
  assert.equal(dirname(resolve(profile)), resolve(tmpdir()));
  assert.ok(basename(profile).startsWith("lab-orc-browser-"));
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
}
