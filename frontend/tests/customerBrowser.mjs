// Executed only by the database-guarded CustomerResourceTest.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve, basename } from "node:path";
import { createServer } from "vite";

assert.equal(process.env.LAB_BROWSER_TEST_DATABASE, "lab_platform_test", "Run through the guarded Quarkus test");
const chromePath = process.env.LAB_TEST_CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = await mkdtemp(join(tmpdir(), "lab-customer-browser-"));
const vite = await createServer({ root: process.cwd(), define: { "import.meta.env.VITE_API_URL": JSON.stringify("/api") }, server: { host: "127.0.0.1", port: 5199, strictPort: true, proxy: { "/api": { target: `http://localhost:${process.env.LAB_BROWSER_TEST_PORT}`, changeOrigin: true } } } });
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
  const click = label => evaluate(`(() => { const buttons = [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === ${JSON.stringify(label)} && !b.disabled && b.getClientRects().length); if (!buttons.length) throw Error('Missing button'); buttons.at(-1).click(); return true; })()`);
  const enabled = label => evaluate(`[...document.querySelectorAll('button')].some(b => b.textContent.trim() === ${JSON.stringify(label)} && !b.matches(':disabled') && b.getClientRects().length)`);
  const fill = (selector, value) => evaluate(`(() => { const field = [...document.querySelectorAll(${JSON.stringify(selector)})].find(f => f.getClientRects().length); field.focus(); Object.getOwnPropertyDescriptor(Object.getPrototypeOf(field), 'value').set.call(field, ${JSON.stringify(value)}); field.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const screenshot = async name => { const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true }); await writeFile(`${process.env.LAB_BROWSER_OUTPUT}/${name}.png`, Buffer.from(result.data, "base64")); };
  const responsiveScreenshot = async name => {
    await screenshot(name);
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    if (name === "customer-orcamentos-records") {
      await click("Visualizar proposta V1");
      await until(() => enabled("Aceitar proposta V1"), "mobile proposal opened");
    }
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, `${name}: horizontal overflow`);
    await screenshot(`${name}-mobile`);
    await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  };
  const navigate = async path => {
    console.log('Navigate:', path);
    await send("Page.navigate", { url: `http://127.0.0.1:5199${path}` });
    await until(() => evaluate(`location.pathname === ${JSON.stringify(path)} && document.readyState !== 'loading'`), 'navigation ready');
  };
  const reload = async () => {
    await evaluate('window.__beforeTestReload = true');
    await send('Page.reload');
    await until(() => evaluate("!window.__beforeTestReload && document.readyState !== 'loading'"), 'new document after reload');
  };
  await send("Page.enable");await send("Runtime.enable");await send("Network.enable");await send("Page.bringToFront");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

  await navigate("/cliente");
  await until(async () => (await text()).includes("Acessar área do cliente"), "visual access page");
  assert.equal(await evaluate("location.pathname"), "/cliente");
  assert.equal(await evaluate("document.querySelectorAll('input[type=password],input[type=email]').length"), 0);
  await responsiveScreenshot("customer-access");
  await evaluate("[...document.querySelectorAll('a')].find(a => a.textContent.includes('Acessar área do cliente')).click()");
  await until(async () => (await text()).includes("Nenhum atendimento por enquanto"), "empty dashboard");
  await reload(); await until(async () => (await text()).includes("Nenhum atendimento por enquanto"), "empty F5");
  for (const [path, title] of [["solicitacoes", "Nenhuma solicitação por enquanto."], ["orcamentos", "Nenhum orçamento disponível por enquanto."], ["projetos", "Nenhum projeto em andamento por enquanto."]]) {
    await navigate(`/cliente/${path}`);await until(async () => (await text()).includes(title), `empty ${path}`);
    assert.equal(await evaluate(`document.querySelector('section[aria-label="Listagem"] [role="status"]').textContent.includes(${JSON.stringify(title)})`), true);
    await screenshot(`customer-${path}-empty`);
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
    await screenshot(`customer-${path}-mobile`);
    await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  }
  await navigate("/cliente/nova-solicitacao");
  await until(() => evaluate("!!document.querySelector('select')"), "request form");
  await evaluate("(() => { const f=[...document.querySelectorAll('select')].find(f => f.getClientRects().length); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(f,'training'); f.dispatchEvent(new Event('change',{bubbles:true})); })()");
  await until(() => enabled("Continuar"), "training selected");await click("Continuar");
  await until(() => evaluate("!!document.querySelector('textarea')"), "project step");
  await fill("textarea", "Treinamento criado no navegador pelo cliente");await click("Continuar");
  await until(() => enabled("Enviar solicitação"), "review");await click("Enviar solicitação");
  await until(() => evaluate("/\\/cliente\\/solicitacoes\\/SOL-/.test(location.pathname)"), "created SOL detail");
  const requestId = (await evaluate("location.pathname")).split("/").at(-1);
  await until(async () => (await text()).includes("Jornada do atendimento"), "journey detail");
  await reload();await until(async () => (await text()).includes(requestId), "SOL after F5");
  assert.equal((await api(`/requests/${requestId}`)).origin, "Cliente");
  await navigate("/cliente/solicitacoes");await until(async () => (await text()).includes(requestId), "customer SOL list");
  await reload();await until(async () => (await text()).includes(requestId), "SOL list F5");
  await responsiveScreenshot("customer-solicitacoes-records");
  await api(`/requests/${requestId}/analysis/start`, "POST");
  await api(`/requests/${requestId}/analysis/finish`, "POST", { result: "quote-ready", technicalSummary: "SEGREDO-INTERNO" });
  let quote = await api(`/requests/${requestId}/quote`, "POST", { hourlyRate: 150 });
  assert.equal(quote.machineId, null);
  quote = await api(`/quotes/${quote.id}`, "PUT", { ...quote, scope: "Treinamento", estimateJustification: "SEGREDO-INTERNO", items: quote.items.map(i => ({ ...i, quotedHours: 2, technicalHours: 1 })) });
  quote = await api(`/quotes/${quote.id}/status`, "POST", { revision: quote.revision, status: "Em revisão" });
  quote = await api(`/quotes/${quote.id}/status`, "POST", { revision: quote.revision, status: "Aprovado internamente" });
  const proposal = await api(`/quotes/${quote.id}/proposal`, "POST");
  await navigate("/cliente/orcamentos");await until(async () => (await text()).includes("sendo preparada"), "draft hidden");
  const document = await api(`/quotes/${quote.id}/proposal/document`);
  await api(`/quotes/${quote.id}/proposal/versions`, "POST", { revision: proposal.revision, sourceQuoteRevision: quote.revision, snapshot: document.snapshot, pdfFileName: "test.pdf", pdf: {} });
  await reload();await until(() => enabled("Visualizar proposta V1"), "published proposal F5");
  await click("Visualizar proposta V1");await until(() => enabled("Aceitar proposta V1"), "proposal opened");
  await responsiveScreenshot("customer-orcamentos-records");
  assert.ok(!(await text()).includes("SEGREDO-INTERNO"));
  await click("Aceitar proposta V1");await until(async () => (await text()).includes("Proposta aceita."), "customer acceptance");
  await reload();await until(async () => (await text()).includes("Aceito"), "acceptance F5");
  let project = await api(`/quotes/${quote.id}/project`, "POST");
  const projectId = project.id;
  await navigate("/cliente/projetos");await until(async () => (await text()).includes("Em preparação"), "project visible");
  await reload();await until(async () => (await text()).includes(projectId), "project F5");
  await responsiveScreenshot("customer-projetos-records");
  for (const operation of ["prepare", "start"]) project = await api(`/projects/${projectId}`, "PUT", { revision: project.revision, operation });
  await reload();await until(async () => (await text()).includes("Em execução"), "progress F5");
  for (const task of project.tasks) project = await api(`/projects/${projectId}`, "PUT", { revision: project.revision, operation: "task", taskId: task.id, completed: true });
  for (const operation of ["review", "complete"]) project = await api(`/projects/${projectId}`, "PUT", { revision: project.revision, operation });
  await reload();await until(async () => (await text()).includes("Concluído"), "completion F5");
  await navigate(`/cliente/solicitacoes/${requestId}`);await until(async () => (await text()).includes(projectId), "completed journey");
  await reload();await until(async () => (await text()).includes(projectId), "journey F5");
  await screenshot("customer-journey-complete");
  await navigate("/cliente/conta");await until(async () => (await text()).includes("Dados somente para consulta"), "account read only");
  assert.equal(await enabled("Gerenciar segurança"), false);
  assert.ok(!(await text()).includes("Código por e-mail"));
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/customer/*" }] });
  await navigate("/cliente/dashboard");await until(async () => (await text()).includes("Tentar novamente"), "offline error");
  await send("Fetch.disable");await click("Tentar novamente");await until(async () => (await text()).includes(requestId), "retry restored dashboard");
  assert.deepEqual(exceptions, []);
  assert.equal(await evaluate("localStorage.length + sessionStorage.length"), 0);
  console.log(`Customer browser passed: ${requestId} -> ${quote.id} -> ${projectId}; training without equipment, real create, proposal, acceptance, completion, F5, offline/retry, no browser authentication.`);
} catch (error) {
  console.error(JSON.stringify(await debugPage()));
  throw error;
} finally {
  socket?.close();chrome?.kill();await vite.close();
  await pause(500);
  assert.equal(dirname(resolve(profile)), resolve(tmpdir()));
  assert.ok(basename(profile).startsWith("lab-customer-browser-"));
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
}
