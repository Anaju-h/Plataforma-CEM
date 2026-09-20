import { getRuntimeRequestById } from "./requestService";
import { calculateQuoteItemTotals } from "./quoteItemService";

// Identidade vem exclusivamente da SOL. Quantidade é informativa.
export function captureRequestPieces(request) {
  return Object.freeze((request?.piecesData ?? []).filter(piece => piece.id).map(piece => Object.freeze({
    id: piece.id, name: piece.name || "", code: piece.code || "", quantity: piece.quantity ?? null,
  })));
}
export function getQuotePieces(quote) {
  return quote.requestPieces ?? captureRequestPieces(getRuntimeRequestById(quote.requestId));
}
export function groupQuoteItems(items = [], pieces = []) {
  const groups = pieces.map(piece => ({ piece, items: items.filter(item => item.requestPieceId === piece.id) }));
  const unlinked = items.filter(item => !pieces.some(piece => piece.id === item.requestPieceId));
  if (unlinked.length) groups.push({ piece: null, items: unlinked });
  return groups.map(group => ({ ...group, subtotal: calculateQuoteItemTotals(group.items).proposedValue }));
}
