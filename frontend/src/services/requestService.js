import {
  cancelPersistedRequest,
  createPersistedRequest,
  finishPersistedAnalysis,
  getPersistedRequest,
  listPersistedRequests,
  resumePersistedAnalysis,
  savePersistedAnalysis,
  savePersistedNotes,
  startPersistedAnalysis,
} from "./requestApi";

import { validateRequestAnalysis } from "./workflowValidation";
import { getRequestNeed } from "../data/requestNeeds";

const CLOSED_STATUSES = ["Convertida em orçamento", "Recusada", "Cancelada"];

export function isArchivedRequest(request) {
  return Boolean(request?.linkedQuoteId || CLOSED_STATUSES.includes(request?.status));
}

function presentRequest(request) {
  const need = getRequestNeed(request.requestNeedId);
  return { ...request, requestNeed: need ? { id: need.id, name: need.name, flow: need.flow } : null };
}

export const getRequests = async () => (await listPersistedRequests()).map(presentRequest);
export const getAllRequests = getRequests;
export const getRequestById = async (requestId) => presentRequest(await getPersistedRequest(requestId));
export async function getActiveRequests() {
  return (await getRequests()).filter((request) => !isArchivedRequest(request));
}
export async function getArchivedRequests() {
  return (await getRequests()).filter(isArchivedRequest);
}
export const createRequest = async (form, origin = "Interno") => presentRequest(await createPersistedRequest(form, origin));
export const startRequestAnalysis = async (requestId) => presentRequest(await startPersistedAnalysis(requestId));
export const saveRequestTechnicalAnalysis = async (requestId, analysis) => presentRequest(await savePersistedAnalysis(requestId, analysis));
export const resumeRequestAnalysis = async (requestId) => presentRequest(await resumePersistedAnalysis(requestId));
export async function finishRequestAnalysis(requestId, analysis) {
  const validation = validateRequestAnalysis(analysis, analysis.result);
  if (!validation.isValid) throw new Error(validation.problems.join(" "));
  return presentRequest(await finishPersistedAnalysis(requestId, analysis));
}
export const saveRequestInternalNotes = async (requestId, notes) => presentRequest(await savePersistedNotes(requestId, notes));
export async function cancelRequest(requestId, reason) {
  if (!String(reason ?? "").trim()) throw new Error("Informe o motivo do cancelamento.");
  return presentRequest(await cancelPersistedRequest(requestId, reason));
}
