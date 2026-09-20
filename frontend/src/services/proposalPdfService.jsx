export const ONE_PAGE_MESSAGE = "O conteúdo excede o limite da proposta de uma página. Reduza textos ou elementos opcionais antes de gerar a versão.";
let assetsPromise;
async function imageData(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Não foi possível carregar a identidade institucional.");
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  return `data:image/png;base64,${btoa(binary)}`;
}
export function getProposalAssets() {
  if (!assetsPromise) assetsPromise = Promise.all([imageData("/brand/centro-de-excelencia-senai.png"), imageData("/brand/logo-senai.png")])
    .then(([center, senai]) => ({ center, senai })).catch(error => { assetsPromise = null; throw error; });
  return assetsPromise;
}

export function validateOnePageLayout(layout) {
  const pages = layout?.children ?? [];
  const page = pages[0];
  const body = page?.children?.[0];
  if (pages.length !== 1 || !body?.box || !Number.isFinite(body.box.height)) throw new Error("Não foi possível validar o tamanho da proposta.");
  if (Math.abs(page.box.height - 841.89) > 0.2 || Math.abs(page.box.width - 595.28) > 0.2) throw new Error(ONE_PAGE_MESSAGE);
  const bottom = 841.89 - 52;
  function exceeds(node, offset = 0) {
    if (!node.box) return false;
    const top = offset + node.box.top;
    return top + node.box.height > bottom + 0.1 || (node.children ?? []).some(child => exceeds(child, top));
  }
  if (exceeds(body)) throw new Error(ONE_PAGE_MESSAGE);
  return true;
}

// Fila evita renderizações concorrentes no reconciliador compartilhado do react-pdf.
let renderQueue = Promise.resolve();
export function renderProposalPdf(document, suppliedAssets) {
  const task = renderQueue.then(async () => {
    const renderer = await import("@react-pdf/renderer");
    const assets = suppliedAssets ?? await getProposalAssets();
    let layout;
    const blob = await renderer.pdf(<ProposalDocument document={document} renderer={renderer} assets={assets} onRender={data => { layout = data._INTERNAL__LAYOUT__DATA_; }} />).toBlob();
    validateOnePageLayout(layout);
    return blob;
  });
  renderQueue = task.catch(() => {});
  return task;
}
export function downloadProposalBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
import { ProposalDocument } from "../components/internal/proposal/ProposalDocument";
