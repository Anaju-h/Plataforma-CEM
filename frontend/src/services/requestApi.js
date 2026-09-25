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

export function requestPayload(form, origin = "Interno") {
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
  return {
    contact: { company: form.contact?.company, name: form.contact?.name, email: form.contact?.email, phone: form.contact?.phone },
    project: { ...form.project, generalFiles: (form.project?.generalFiles || []).map((file, index) => ({ id: `att-${index + 1}`, name: file.name || `Arquivo ${index + 1}`, type: file.type || "Arquivo", size: file.size || 0 })) },
    internal: form.internal || null, pieces, origin,
    channel: origin === "Interno" ? form.internal?.channel : origin === "Cliente" ? "Área do cliente" : "Formulário público",
  };
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Lê os arquivos escolhidos (File) e os envia junto com a SOL em base64; o backend grava o conteúdo. */
export async function attachFileData(payload, files) {
  const list = (files || []).filter(file => typeof Blob !== "undefined" && file instanceof Blob);
  if (!list.length) return payload;
  const tooBig = list.find(file => file.size > MAX_FILE_BYTES);
  if (tooBig) throw new Error(`O arquivo ${tooBig.name} passa de 10 MB.`);
  const current = payload.project?.generalFiles || [];
  const encoded = await Promise.all(list.map((file, index) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: `att-${index + 1}`, name: file.name, type: current[index]?.type || file.type || "Arquivo", size: file.size, contentType: file.type || "application/octet-stream", dataBase64: String(reader.result) });
    reader.onerror = () => reject(new Error(`Não foi possível ler o arquivo ${file.name}.`));
    reader.readAsDataURL(file);
  })));
  return { ...payload, project: { ...payload.project, generalFiles: encoded } };
}

export async function createPersistedRequest(form, origin = "Interno") {
  const payload = await attachFileData(requestPayload(form, origin), form.project?.generalFiles);
  return request("", { method: "POST", body: JSON.stringify(payload) });
}

// Formulário público do site: rota anônima que devolve apenas o código da SOL e um token único para vincular a uma conta.
export async function createPublicRequest(form) {
  let response;
  try {
    const payload = await attachFileData(requestPayload(form, "Público"), form.project?.generalFiles);
    response = await fetch(`${baseUrl}/public/requests`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || "Não foi possível enviar a solicitação.");
  return body;
}

// Configurador on-line: cliente logado envia pela própria conta; visitante envia pela rota pública (com oferta de conta).
export async function submitConfiguratorRequest(payload) {
  const post = path => fetch(`${baseUrl}${path}`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  let response;
  try {
    response = await post("/customer/requests");
    if (response.status === 401) response = await post("/public/configurator");
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || "Não foi possível enviar a configuração.");
  return body?.claimToken ? { ...body, kind: "public" } : { id: body?.id, kind: "customer" };
}
