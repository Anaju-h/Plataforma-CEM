import { getRuntimeQuoteById, updateRuntimeQuote } from "./quoteService";
import { buildCommercialProposalSnapshot, createCommercialDraft, freezeCommercial, proposalSections, investmentModes } from "./commercialProposalService";
import { validationResult } from "./workflowValidation";
import { renderProposalPdf } from "./proposalPdfService";
import { chooseProposalPdfDestination } from "./proposalFileService";

// Mesmo ciclo de vida dos ORCs: runtime em memória, preservado entre rotas.
const proposals = new Map();
const pending = new Set();
const clone = value => structuredClone(value);
export const getProposalByQuoteId = id => proposals.get(id) ?? null;
export function getAcceptedProposalVersion(id) {
  const proposal = getProposalByQuoteId(id);
  return proposal?.versions.find(version => version.version === proposal.acceptedVersion && version.status === "accepted" && version.locked && version.result?.type === "accepted") ?? null;
}
export function validateProposalForProject(id) {
  return validationResult(getAcceptedProposalVersion(id) ? [] : [{ code: "proposal.acceptance_required", field: "acceptedVersion", message: "A criação de projeto exige uma versão da proposta aceita pelo Administrador." }]);
}
function requireQuote(id) {
  const quote = getRuntimeQuoteById(id);
  if (!quote) throw new Error("Orçamento não encontrado.");
  return quote;
}
function editable(id) {
  const quote = requireQuote(id);
  if (getAcceptedProposalVersion(id) || ["Aceito", "Recusado", "Cancelado"].includes(quote.status)) throw new Error("Proposta encerrada; alterações não permitidas.");
  if (quote.status !== "Aprovado internamente") throw new Error("Aprove o orçamento internamente antes de montar a proposta.");
  if (pending.has(id)) throw new Error("Aguarde a geração do PDF.");
  return quote;
}
function store(proposal) {
  const frozen = freezeCommercial(clone(proposal));
  proposals.set(proposal.quoteId, frozen);
  return frozen;
}
export function openProposal(id) {
  if (proposals.has(id)) return proposals.get(id);
  const quote = editable(id);
  return store({ id: id.replace(/^ORC-/, "PROP-"), quoteId: id, source: quote.source, draft: createCommercialDraft(quote), acceptedVersion: null, versions: [] });
}
export function saveProposalDraft(id, draft) {
  editable(id);
  const proposal = openProposal(id);
  if (!proposal.draft) throw new Error("Marque Criar nova versão para editar.");
  if (!investmentModes[draft.investmentDisplay]) throw new Error("Modo de investimento inválido.");
  const clean = { sections: Object.fromEntries(Object.keys(proposalSections).map(key => [key, draft.sections[key] === true])), investmentDisplay: draft.investmentDisplay,
    selectedMedia: draft.selectedMedia.filter(value => typeof value === "string"),
    content: Object.fromEntries(["scope", "technology", "deadline", "validity", "terms", "notes"].map(key => [key, String(draft.content[key] ?? "")])), updatedAt: new Date().toISOString() };
  return store({ ...proposal, draft: clean });
}
export function createNextProposalDraft(id) {
  const quote = editable(id);
  const proposal = openProposal(id);
  if (proposal.draft) return proposal;
  const last = proposal.versions.at(-1);
  return store({ ...proposal, draft: createCommercialDraft(quote, last) });
}
export function getDraftDocument(id) {
  const proposal = getProposalByQuoteId(id);
  if (!proposal?.draft) throw new Error("Rascunho não encontrado.");
  return freezeCommercial({ proposalId: proposal.id, quoteId: id, version: proposal.versions.length + 1, createdAt: proposal.draft.updatedAt,
    snapshot: buildCommercialProposalSnapshot(requireQuote(id), proposal.draft) });
}
export async function generateProposalVersion(id, actor = "Administrador", chooseDestination = chooseProposalPdfDestination) {
  const quote = editable(id);
  const proposal = openProposal(id);
  const document = { ...getDraftDocument(id), createdAt: new Date().toISOString() };
  pending.add(id);
  try {
    const filename = `${proposal.id}_V${document.version}.pdf`;
    const destination = await chooseDestination(filename);
    if (!destination) return { cancelled: true };
    const blob = await renderProposalPdf(document);
    if (getRuntimeQuoteById(id) !== quote || getProposalByQuoteId(id) !== proposal) throw new Error("O orçamento mudou durante a geração. Gere novamente.");
    const delivery = await destination.write(blob);
    if (!delivery?.saved) return { cancelled: true };
    if (getRuntimeQuoteById(id) !== quote || getProposalByQuoteId(id) !== proposal) throw new Error("O orçamento mudou durante o salvamento. A versão não foi registrada; descarte o arquivo salvo e emita novamente.");
    const version = { ...document, status: "generated", locked: true, createdBy: actor, sourceQuoteUpdatedAt: quote.modifiedAt ?? quote.updatedAt,
      sourceQuoteRevision: quote.revision ?? 0, sections: proposal.draft.sections, selectedMedia: proposal.draft.selectedMedia,
      investmentDisplay: proposal.draft.investmentDisplay, pdfFileName: filename, pdf: { pageCount: 1, format: "A4", size: blob.size, delivery }, result: null };
    const saved = store({ ...proposal, draft: null, versions: [...proposal.versions.map(old => ({ ...old, status: old.status === "generated" ? "superseded" : old.status })), version] });
    return { proposal: saved, version: saved.versions.at(-1), blob };
  } finally { pending.delete(id); }
}
export function registerProposalResult(id, versionNumber, { type, date, note = "", actor = "Administrador" }) {
  editable(id);
  const proposal = getProposalByQuoteId(id);
  const version = proposal?.versions.find(item => item.version === versionNumber);
  if (!version || version.status !== "generated" || !version.locked || proposal.draft) throw new Error("Selecione a versão gerada vigente, sem novo rascunho aberto.");
  if (type === "accepted" && version.sourceQuoteRevision !== (requireQuote(id).revision ?? 0)) throw new Error("O orçamento mudou. Crie uma nova versão antes de registrar o aceite.");
  if (!["accepted", "revision", "rejected"].includes(type) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error("Informe resultado e data válidos.");
  if (!actor.trim()) throw new Error("Informe o Administrador responsável.");
  const result = { type, date, note: String(note), actor, registeredAt: new Date().toISOString() };
  updateRuntimeQuote(id, { status: type === "accepted" ? "Aceito" : type === "rejected" ? "Recusado" : "Em elaboração",
    ...(type === "accepted" ? { acceptedAt: date, acceptedRegisteredBy: actor } : {}),
    history: [...(requireQuote(id).history ?? []), { id: `proposal-result-${Date.now()}`, date, actor, action: `Resultado ${proposal.id} V${versionNumber}: ${type}`, description: note }] });
  return store({ ...proposal, acceptedVersion: type === "accepted" ? versionNumber : null,
    versions: proposal.versions.map(item => item.version === versionNumber ? { ...item, status: type === "revision" ? "superseded" : type, result } : item) });
}

// Contrato do Customer Portal: somente versão aceita, sem resultado/observação interna.
export function getCustomerAcceptedProposals(company) {
  return [...proposals.values()].flatMap(proposal => {
    const version = getAcceptedProposalVersion(proposal.quoteId);
    if (!version || version.snapshot.client.company !== company) return [];
    const quote = requireQuote(proposal.quoteId);
    return [freezeCommercial({ id: proposal.quoteId, proposalId: proposal.id, status: "Aceito", source: proposal.source,
      acceptedAt: version.result.date, projectId: quote.projectId ?? null, value: version.snapshot.total,
      document: { proposalId: proposal.id, quoteId: proposal.quoteId, version: version.version, createdAt: version.createdAt, snapshot: version.snapshot }, pdfFileName: version.pdfFileName })];
  });
}
