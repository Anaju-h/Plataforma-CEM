// Executed by QuoteResourceTest while Quarkus is serving lab_platform_test on 8081.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve, basename } from "node:path";
import { createServer } from "vite";

assert.equal(process.env.LAB_BROWSER_TEST_DATABASE, "lab_platform_test", "Run through the guarded Quarkus test");
const chromePath = process.env.LAB_TEST_CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const testPort = process.env.LAB_BROWSER_TEST_PORT;
assert.ok(testPort, "Test backend port must be supplied by Quarkus");
const profile = await mkdtemp(join(tmpdir(), "lab-orc-browser-"));
const vite = await createServer({ root: process.cwd(), define: { "import.meta.env.VITE_API_URL": JSON.stringify("/api") }, server: { host: "127.0.0.1", port: 5197, strictPort: true, proxy: { "/api": { target: `http://localhost:${testPort}`, changeOrigin: true } } } });
let chrome, socket;
let debugPage = async () => "Browser not ready";
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(fn, label, timeout = 20000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) { try { if (await fn()) return; } catch { /* Navigation replaces the JS context. */ } await pause(150); }
  throw new Error(`Timeout: ${label}`);
}
async function api(path, method = "GET", data) {
  const response = await fetch(`http://localhost:${testPort}/api${path}`, { method, signal: AbortSignal.timeout(15000), headers: { "Content-Type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
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
    if (message.method === "Fetch.requestPaused") send("Fetch.failRequest", { requestId: message.params.requestId, errorReason: "ConnectionFailed" }).catch(() => {});
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
  const screenshot = async name => { const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true }); await writeFile(`../backend/target/${name}.png`, Buffer.from(result.data, "base64")); };
  const navigate = async path => {
    console.log('Navigate:', path);
    await send("Page.navigate", { url: `http://127.0.0.1:5197${path}` });
    await until(() => evaluate(`location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete'`), 'navigation ready');
  };
  const reload = async () => {
    await evaluate('window.__beforeTestReload = true');
    await send('Page.reload');
    await until(() => evaluate("!window.__beforeTestReload && document.readyState === 'complete'"), 'new document after reload');
  };
  await send("Page.enable");await send("Runtime.enable");await send("Network.enable");await send("Page.bringToFront");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `localStorage.setItem('lab-portal-session', JSON.stringify({authenticated:true,role:'ADMIN'}));` });
  const existingQuote = process.env.LAB_BROWSER_EXISTING_QUOTE;
  if (existingQuote) {
    assert.match(existingQuote, /^ORC-\d{4,}$/);
    await navigate(`/portal/orcamentos/${existingQuote}`);
    await until(() => evaluate("[...document.querySelectorAll('textarea')].some(e => e.value === 'Escopo salvo no navegador')"), "scope after backend/frontend restart");
    await navigate(`/portal/orcamentos/${existingQuote}/proposta`);
    await until(() => evaluate("document.querySelector('#proposal-commercial-note')?.value === 'Nota comercial persistente'"), "Builder after backend/frontend restart");
    assert.deepEqual(exceptions, []);
    console.log(`Restart passed: ${existingQuote}, persisted scope and commercial draft in a new backend, frontend and browser process.`);
  } else {
  const request = await api("/requests", "POST", { contact: { company: "Browser ORC integração", name: "Contato" }, project: { requestNeedId: "inside", objective: "Validar persistência" }, pieces: [{ id: "browser-piece", name: "Eixo de teste", quantity: 2, services: ["internal"] }] });
  await navigate(`/portal/solicitacoes/${request.id}`);
  await until(() => enabled("Iniciar análise"), "SOL loaded");
  await click("Iniciar análise");
  await until(() => evaluate("!!document.querySelector('#analysis-summary') && !document.querySelector('#analysis-summary').disabled"), "analysis started");
  assert.equal(await enabled("Concluir análise"), false, "Empty analysis must be blocked before API");
  assert.ok((await text()).includes("Preencha o resumo técnico"));
  assert.equal(requests.filter(request => request.url.endsWith('/analysis/finish')).length, 0);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('#analysis-summary')).borderTopWidth"), "1px");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.internal-card')).borderTopWidth"), "1px");
  await screenshot("regression-sol-analysis");
  await fill('#analysis-summary', 'Análise técnica persistida pelo navegador');
  await until(() => enabled("Concluir análise"), "valid analysis enabled");
  await click("Concluir análise");
  await evaluate("[...document.querySelectorAll('[role=dialog] button')].find(b => b.textContent.includes('Aguardar informações')).click()");
  await pause(150);
  assert.equal(await enabled("Confirmar resultado"), false);
  await fill('textarea[aria-label="Informações pendentes"]', 'Aguardar desenho técnico');
  await until(() => enabled("Confirmar resultado"), "waiting reason enables confirmation");
  await click("Confirmar resultado");
  await until(() => enabled("Retomar análise"), "waiting persisted");
  await reload();
  await until(() => enabled("Retomar análise"), "waiting after F5");
  await click("Retomar análise");
  await until(() => enabled("Concluir análise"), "resumed");
  await click("Concluir análise"); await click("Confirmar resultado");
  await until(async () => (await text()).includes("Apta para orçamento"), "SOL loaded");
  await reload();
  await until(() => enabled("Criar orçamento"), "ready after F5");
  const analyzed = await api(`/requests/${request.id}`);
  assert.equal(analyzed.analysis.technicalSummary, 'Análise técnica persistida pelo navegador');
  assert.ok(analyzed.history.length >= 5);
  await click("Criar orçamento");await pause(200);await click("Criar orçamento");
  await until(async () => (await text()).includes("Salvar orçamento"), "ORC created via UI");
  const quoteId = await evaluate("location.pathname.split('/').at(-1)");assert.match(quoteId, /^ORC-\d{4,}$/);
  assert.equal((await api(`/requests/${request.id}/quote`, 'POST', {})).id, quoteId, 'Duplicate conversion returns the same persisted ORC');
  await screenshot("regression-orc-detail");
  await click("Salvar orçamento");
  await until(async () => (await text()).includes("Selecione a tecnologia de referência obrigatória."), "required equipment blocks save");
  assert.equal((await api(`/quotes/${quoteId}`)).machineId, null);
  await evaluate(`(() => { const field = [...document.querySelectorAll('select')].find(e => e.closest('label')?.textContent.includes('Tecnologia de referência')); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(field,'bosello-max'); field.dispatchEvent(new Event('change',{bubbles:true})); })()`);
  await evaluate(`(() => { const field = [...document.querySelectorAll('textarea')].find(e => e.closest('label')?.textContent.includes('Escopo técnico')); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(field,'Escopo salvo no navegador'); field.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  await click("Salvar orçamento");await until(async () => (await text()).includes("Alterações salvas"), "save confirmation");
  await reload();
  await until(() => evaluate("[...document.querySelectorAll('textarea')].some(e => e.value === 'Escopo salvo no navegador')"), "scope after F5");
  await navigate(`/portal/solicitacoes/${request.id}`);
  await until(async () => { const body=await text();return body.includes("Convertida em orçamento")&&body.includes(quoteId); }, "SOL reciprocal link after reload");
  await navigate("/portal/orcamentos");await until(async () => (await text()).includes(quoteId), "list from SQL");
  // Complete the estimate through the API, then exercise the existing Builder in the browser.
  let quote = await api(`/quotes/${quoteId}`);
  quote = await api(`/quotes/${quoteId}`, "PUT", { ...quote, machineId: "bosello-max", estimateJustification: "Inspeção", deadlineDays: 5, validityDays: 15, items: quote.items.map(item => ({ ...item, technicalHours: 2, quotedHours: 3 })) });
  quote = await api(`/quotes/${quoteId}/status`, "POST", { revision: quote.revision, status: "Em revisão" });
  await api(`/quotes/${quoteId}/status`, "POST", { revision: quote.revision, status: "Aprovado internamente" });
  await navigate(`/portal/orcamentos/${quoteId}/proposta`);
  await until(() => evaluate("!!document.querySelector('#proposal-commercial-note')"), "Builder draft from SQL");
  await until(() => evaluate("!document.querySelector('#proposal-commercial-note').readOnly"), "Builder editable");
  await evaluate(`(() => { const field=document.querySelector('#proposal-commercial-note'); field.focus(); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(field,'Nota comercial persistente');field.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  await pause(200);
  assert.ok(await evaluate("document.querySelector('.proposal-preview').textContent.includes('Nota comercial persistente')"), "Commercial preview updates while typing");
  console.log('Note focus before blur:', await evaluate("document.activeElement?.id"));
  await evaluate("document.querySelector('#proposal-commercial-note').blur()");
  await until(async () => (await api(`/quotes/${quoteId}/proposal`)).draft.content.notes === "Nota comercial persistente", "Builder draft saved");
  await reload();await until(() => evaluate("document.querySelector('#proposal-commercial-note')?.value === 'Nota comercial persistente'"), "Builder after F5");
  await screenshot("regression-proposal-builder");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/quotes*" }] });
  await navigate("/portal/orcamentos");await until(async () => (await text()).includes("Tentar novamente"), "API error with retry");
  assert.equal((await text()).includes("Browser ORC integração"), false, "API errors must not show cached/demo quotes");
  await send("Fetch.disable");await click("Tentar novamente");await until(async () => (await text()).includes(quoteId), "retry restores persisted list");
  const cancelled = await api('/requests', 'POST', { contact: { company: 'Cancelamento UI TEST', name: 'Contato' }, project: { requestNeedId: 'failure-analysis', objective: 'Validar cancelamento' }, pieces: [] });
  await navigate(`/portal/solicitacoes/${cancelled.id}`);
  await until(() => enabled('Cancelar solicitação'), 'cancel action'); await click('Cancelar solicitação');
  assert.equal(await evaluate("[...document.querySelectorAll('[role=dialog] button')].find(b => b.textContent.trim() === 'Cancelar solicitação').disabled"), true);
  await fill('textarea[aria-label="Motivo do cancelamento"]', 'Cancelamento de validação TEST');
  await pause(150); await click('Cancelar solicitação');
  await until(async () => (await api(`/requests/${cancelled.id}`)).status === 'Cancelada', 'cancellation persisted');
  await reload(); await until(async () => (await text()).includes('Cancelamento de validação TEST'), 'cancellation after F5');
  await navigate('/portal/historico'); await until(async () => (await text()).includes(cancelled.id), 'real history');
  await navigate('/portal/equipe'); await until(async () => (await text()).includes('Usuários ativos'), 'team layout with real data');
  await navigate('/portal/meu-trabalho'); await until(async () => (await text()).includes('Solicitações abertas'), 'work layout with real data');
  await send('Fetch.enable', { patterns: [{ urlPattern: '*/api/requests*' }, { urlPattern: '*/api/quotes*' }] });
  await navigate(`/portal/solicitacoes/${request.id}`); await until(async () => (await text()).includes('Tentar novamente'), 'SOL offline retry');
  assert.equal((await text()).includes('Browser ORC integração'), false, 'No mock SOL while offline');
  await send('Fetch.disable'); await click('Tentar novamente');
  await until(async () => (await text()).includes('Convertida em orçamento'), 'SOL retry restores persisted data');
  assert.deepEqual(exceptions, []);
  console.log(`Browser passed: ${request.id} -> ${quoteId}, required analysis, waiting/resume/F5, duplicate conversion, edit/save/F5, reciprocal link, Builder/live preview/F5, cancellation/history, team/work, SOL and ORC API failure/retry (TEST only).`);
  }
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
