import { A4 } from "./proposalDocumentLayout";

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 1.2;
export function stepPreviewZoom(scale, direction) {
  const step = direction > 0 ? Math.floor(scale * 10 + 0.001) + 1 : Math.ceil(scale * 10 - 0.001) - 1;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, step / 10));
}
export function fitPreviewZoom(width, height) {
  // Página pode ficar abaixo de 50% em telas pequenas para mostrar todo o A4.
  return Math.max(0.1, Math.min(1, width / (A4.width * 4 / 3), height / (A4.height * 4 / 3)));
}

export function fitWidthPreviewZoom(width) {
  return Math.max(0.1, width / (A4.width * 4 / 3));
}
