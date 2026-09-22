import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const productionFiles = [
  "src/services/requestService.js",
  "src/pages/internal/RequestsPage.jsx",
  "src/pages/internal/RequestDetailPage.jsx",
  "src/pages/internal/InternalNewRequestPage.jsx",
  "src/pages/OrcamentoPage.jsx",
];

test("fluxo real de solicitações não contém repositório runtime ou fallback demo", async () => {
  const contents = await Promise.all(productionFiles.map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")));
  const forbidden = ["runtimeRequests", "getRuntimeRequests", "getRuntimeRequestById", "createRuntimeRequest", "updateRuntimeRequest", "cancelRuntimeRequest", "resetRuntimeRequests", "requestRuntimeService", "baseRequests"];
  for (const token of forbidden) assert.equal(contents.some((content) => content.includes(token)), false, `${token} não pode integrar o fluxo real`);
});

test("listagem, detalhe e criação passam pela fachada assíncrona", async () => {
  const [list, detail, create] = await Promise.all([
    readFile(new URL("../src/pages/internal/RequestsPage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/internal/RequestDetailPage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/internal/InternalNewRequestPage.jsx", import.meta.url), "utf8"),
  ]);
  assert.match(list, /getActiveRequests\(\)\.then/);
  assert.match(list, /Tentar novamente/);
  assert.match(detail, /getRequestById\(requestId\)\.then/);
  assert.match(create, /await createRequest\(/);
});
