import { proposalRequest } from "./quoteApi";
import { getQuoteById } from "./quoteService";
import { renderProposalPdf } from "./proposalPdfService";
import { chooseProposalPdfDestination } from "./proposalFileService";
export const getProposalByQuoteId = id => proposalRequest(id);
export const openProposal = id => proposalRequest(id, "", "POST");
export const getDraftDocument = id => proposalRequest(id, "/document");
export const saveProposalDraft = (id, draft, revision) => proposalRequest(id, "", "PUT", { ...draft, revision });
export const createNextProposalDraft = (id, revision) => proposalRequest(id, "/draft", "POST", { revision });
export const registerProposalResult = (id, version, result, revision) => proposalRequest(id, `/versions/${version}/result`, "POST", { ...result, revision });
export function getAcceptedProposalVersion(proposal) {
  return proposal?.versions.find(version => version.version === proposal.acceptedVersion && version.status === "accepted" && version.locked) ?? null;
}
export async function generateProposalVersion(id, displayedProposal, chooseDestination = chooseProposalPdfDestination) {
  const filename = `${displayedProposal.id}_V${displayedProposal.versions.length + 1}.pdf`;
  const destination = await chooseDestination(filename);
  if (!destination) return { cancelled: true };
  const quote = await getQuoteById(id);
  const proposal = quote.proposal;
  if (proposal.revision !== displayedProposal.revision) throw new Error("A proposta mudou. Recarregue antes de gerar o PDF.");
  const document = await getDraftDocument(id);
  const blob = await renderProposalPdf(document);
  const delivery = await destination.write(blob);
  if (!delivery?.saved) return { cancelled: true };
  const saved = await proposalRequest(id, "/versions", "POST", {
    revision: proposal.revision, sourceQuoteRevision: quote.revision, snapshot: document.snapshot,
    pdfFileName: filename, pdf: { pageCount: 1, format: "A4", size: blob.size, delivery },
  }).catch(cause => { throw new Error(`${cause.message} A emissão não foi registrada; descarte o PDF e tente novamente.`); });
  return { proposal: saved, version: saved.versions.at(-1), blob };
}
