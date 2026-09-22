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

const CLOSED_STATUSES = ["Convertida em orçamento", "Recusada", "Cancelada"];

export function isArchivedRequest(request) {
  return Boolean(request?.linkedQuoteId || CLOSED_STATUSES.includes(request?.status));
}

export const getRequests = () => listPersistedRequests();
export const getAllRequests = getRequests;
export const getRequestById = (requestId) => getPersistedRequest(requestId);
export async function getActiveRequests() {
  return (await getRequests()).filter((request) => !isArchivedRequest(request));
}
export async function getArchivedRequests() {
  return (await getRequests()).filter(isArchivedRequest);
}
export const createRequest = (form, origin = "Interno") => createPersistedRequest(form, origin);
export const startRequestAnalysis = (requestId) => startPersistedAnalysis(requestId);
export const saveRequestTechnicalAnalysis = (requestId, analysis) => savePersistedAnalysis(requestId, analysis);
export const resumeRequestAnalysis = (requestId) => resumePersistedAnalysis(requestId);
export const finishRequestAnalysis = (requestId, analysis) => finishPersistedAnalysis(requestId, analysis);
export const saveRequestInternalNotes = (requestId, notes) => savePersistedNotes(requestId, notes);
export const cancelRequest = (requestId, reason) => cancelPersistedRequest(requestId, reason);
