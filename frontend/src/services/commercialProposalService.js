import { getEquipmentLabel, getEquipmentRequirement } from "../data/serviceCatalog";
import { getQuotePieces, groupQuoteItems } from "./quotePieceService";
import { getQuoteItemService } from "./quoteItemService";
import { getMachineCostKnowledge } from "../data/internal/pricingKnowledge";
const text = value => typeof value === "string" ? value : "";
const equipmentName = machineId => getMachineCostKnowledge(machineId)?.name || machineId;
function commercialServiceName(item, piece) {
  const service = getQuoteItemService(item.serviceId);
  // Retira somente o prefixo gerado pelo fluxo antigo; nomes manuais são preservados.
  if (piece && service && item.name === piece.name + " — " + service.name) return service.name;
  return text(item.name) || text(service?.name);
}
export const proposalSections = {
  scope: "Escopo", items: "Itens/serviços", photos: "Fotos", technology: "Equipamento / tecnologia",
  deadline: "Prazo", validity: "Validade", terms: "Condições comerciais", notes: "Observações comerciais", files: "Arquivos/referências permitidos",
};
export const investmentModes = { "total-only": "Somente total", items: "Itens + subtotal + total", hours: "Peças + serviços + horas cotadas + valor + total" };
export function freezeCommercial(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freezeCommercial);
    Object.freeze(value);
  }
  return value;
}

// Fail closed: anexos operacionais não são automaticamente materiais comerciais.
export function getPermittedProposalMedia(quote) {
  return (quote.commercialMedia ?? []).filter(media => media.clientVisible === true &&
    ((media.type === "photo" && /^data:image\/(png|jpeg);base64,/.test(media.dataUrl ?? "")) ||
      (media.type === "file" && /^data:application\/pdf;base64,/.test(media.dataUrl ?? ""))))
    .map(media => ({ id: text(media.id), name: text(media.name), type: media.type, dataUrl: media.dataUrl }));
}

export function createCommercialDraft(quote, previous) {
  return {
    sections: Object.fromEntries(Object.keys(proposalSections).map(key => [key, previous?.sections?.[key] ?? !["photos", "files", "technology"].includes(key)])),
    investmentDisplay: previous?.investmentDisplay ?? "hours",
    selectedMedia: previous?.selectedMedia ?? [],
    content: { scope: text(quote.scope), technology: text(quote.commercialTechnology) || getEquipmentLabel(quote.serviceId, equipmentName(quote.machineId)), deadline: `${quote.deadlineDays ?? "—"} dias`, validity: `${quote.validityDays ?? "—"} dias`, terms: text(quote.commercialTerms), notes: text(quote.commercialNotes) },
    updatedAt: new Date().toISOString(),
  };
}

// Allowlist explícita: nenhum objeto interno é espalhado para o documento.
export function buildCommercialProposalSnapshot(quote, draft = createCommercialDraft(quote)) {
  if (!investmentModes[draft.investmentDisplay]) throw new Error("Modo de investimento inválido.");
  const detailed = draft.investmentDisplay === "hours";
  const visibleComposition = draft.investmentDisplay !== "total-only" && draft.sections.items;
  const groups = visibleComposition ? groupQuoteItems(quote.items, getQuotePieces(quote)).filter(group => group.items.length).map(group => ({
    piece: group.piece ? { id: group.piece.id, name: text(group.piece.name), code: text(group.piece.code), quantity: group.piece.quantity } : null,
    items: group.items.map(item => ({
      name: commercialServiceName(item, group.piece),
      subtotal: Number(item.subtotal) || 0,
      ...(detailed ? { quotedHours: item.quotedHours } : {}),
      ...(draft.sections.technology ? { equipment: getEquipmentLabel(item.serviceId, equipmentName(item.machineId || (getEquipmentRequirement(item.serviceId) === "REQUIRED" ? quote.machineId : null))) } : {}),
    })),
    subtotal: group.subtotal,
  })) : [];
  const snapshot = {
    client: { company: text(quote.company), contact: text(quote.contact) },
    sections: Object.fromEntries(Object.keys(proposalSections).map(key => [key, draft.sections[key] === true])),
    content: Object.fromEntries(["scope", "technology", "deadline", "validity", "terms", "notes"].map(key => [key, text(draft.content[key])])),
    investmentDisplay: draft.investmentDisplay,
    groups,
    // Compatibilidade com consumidores comerciais existentes; mesma allowlist.
    items: groups.flatMap(group => group.items),
    total: Number(quote.proposedValue) || 0,
    media: getPermittedProposalMedia(quote).filter(media => draft.selectedMedia.includes(media.id) && draft.sections[media.type === "photo" ? "photos" : "files"]),
  };
  return freezeCommercial(snapshot);
}
