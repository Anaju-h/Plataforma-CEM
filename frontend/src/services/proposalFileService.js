import { downloadProposalBlob, renderProposalPdf } from "./proposalPdfService";

// Chamado antes de qualquer await para preservar a ativação do clique.
// O seletor não grava o arquivo: a escrita acontece somente após validar o PDF.
export async function chooseProposalPdfDestination(filename, environment = globalThis.window, download = downloadProposalBlob) {
  if (!environment) throw new Error("Salvamento de PDF indisponível neste ambiente.");
  if (typeof environment.showSaveFilePicker !== "function") {
    return { async write(blob) {
      download(blob, filename);
      // Downloads convencionais não oferecem confirmação de gravação em disco.
      return { saved: true, method: "browser-download", fileName: filename, diskConfirmed: false };
    } };
  }
  let handle;
  try {
    handle = await environment.showSaveFilePicker({ suggestedName: filename, types: [{ description: "Proposta comercial PDF", accept: { "application/pdf": [".pdf"] } }], excludeAcceptAllOption: true });
  } catch (error) {
    if (error.name === "AbortError") return null;
    throw error;
  }
  return { async write(blob) {
    let writable;
    try {
      writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return { saved: true, method: "file-picker", fileName: handle.name || filename, diskConfirmed: true };
    } catch (error) {
      try { await writable?.abort(); } catch { /* Preserva o erro original. */ }
      if (error.name === "AbortError") return { saved: false };
      throw error;
    }
  } };
}

export async function saveExistingProposalPdf(document, filename = document.pdfFileName, chooseDestination = chooseProposalPdfDestination) {
  const destination = await chooseDestination(filename);
  if (!destination) return { saved: false };
  const blob = await renderProposalPdf(document);
  return destination.write(blob);
}
