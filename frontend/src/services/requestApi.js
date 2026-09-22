import { getRequestNeedServices } from "../data/requestNeeds";
import { normalizeServiceId } from "../data/serviceCatalog";

const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}/requests${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error("Não foi possível conectar à API de solicitações.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || "Não foi possível concluir a operação.");
  return body;
}

const action = (id, path, method = "POST", data) => request(`/${encodeURIComponent(id)}${path}`, { method, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });

export const listPersistedRequests = () => request("");
export const getPersistedRequest = (id) => request(`/${encodeURIComponent(id)}`);
export const startPersistedAnalysis = (id) => action(id, "/analysis/start");
export const resumePersistedAnalysis = (id) => action(id, "/analysis/resume");
export const savePersistedAnalysis = (id, data) => action(id, "/analysis", "PUT", data);
export const finishPersistedAnalysis = (id, data) => action(id, "/analysis/finish", "POST", data);
export const savePersistedNotes = (id, notes) => action(id, "/internal-notes", "PUT", { notes });
export const cancelPersistedRequest = (id, reason) => action(id, "/cancel", "POST", { reason });

export function createPersistedRequest(form, origin = "Interno") {
  const pieces = (form.pieces || []).map((piece) => ({
    id: piece.id,
    name: piece.name || "Peça",
    quantity: Math.max(1, Number(piece.quantity) || 1),
    material: piece.material || "",
    dimensions: [piece.length, piece.width, piece.height].some(Boolean)
      ? `${piece.length || "?"} × ${piece.width || "?"} × ${piece.height || "?"} ${piece.unit || "mm"}` : "Não informadas",
    location: piece.externalService ? [piece.locationCity, piece.locationState].filter(Boolean).join(" - ") : "Pode ser levada ao Centro",
    services: [...new Set((piece.services || []).map(normalizeServiceId).filter(Boolean))],
    requirements: {
      inspectionOptions: piece.inspectionOptions || [], scanningOptions: piece.scanningOptions || [],
      reverseOptions: piece.reverseOptions || [], internalOptions: piece.internalOptions || [],
      movable: piece.movable || "", surroundingAccess: piece.surroundingAccess || "", locationNotes: piece.locationNotes || "",
    },
    recommendation: piece.recommendation || null,
  }));
  const primary = getRequestNeedServices(form.project?.requestNeedId)[0];
  if (!primary) throw new Error("Selecione uma necessidade válida.");
  return request("", { method: "POST", body: JSON.stringify({
    contact: { company: form.contact?.company, name: form.contact?.name, email: form.contact?.email, phone: form.contact?.phone },
    project: { ...form.project, generalFiles: (form.project?.generalFiles || []).map((file, index) => ({ id: `att-${index + 1}`, name: file.name || `Arquivo ${index + 1}`, type: file.type || "Arquivo", size: file.size || 0 })) },
    internal: form.internal || null, pieces, origin,
    channel: origin === "Interno" ? form.internal?.channel : "Formulário público",
  }) });
}
