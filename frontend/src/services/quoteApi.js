const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
export async function quoteRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  } catch { throw new Error("Não foi possível conectar à API de orçamentos."); }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || "Não foi possível concluir a operação do orçamento.");
  return body;
}
const path = id => `/quotes/${encodeURIComponent(id)}`;
export const listPersistedQuotes = () => quoteRequest("/quotes");
export const getPersistedQuote = id => quoteRequest(path(id));
export const createPersistedQuote = (requestId, data) => quoteRequest(`/requests/${encodeURIComponent(requestId)}/quote`, { method: "POST", body: JSON.stringify(data) });
export const updatePersistedQuote = (id, data) => quoteRequest(path(id), { method: "PUT", body: JSON.stringify(data) });
export const changePersistedQuoteStatus = (id, data) => quoteRequest(`${path(id)}/status`, { method: "POST", body: JSON.stringify(data) });
export const proposalRequest = (id, suffix = "", method = "GET", data) => quoteRequest(`${path(id)}/proposal${suffix}`, { method, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
