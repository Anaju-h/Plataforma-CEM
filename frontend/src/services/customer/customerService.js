import { requestPayload } from "../requestApi";
const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
async function customerRequest(path, options = {}) {
  let response;
  try { response = await fetch(baseUrl + "/customer" + path, { ...options, headers: { "Content-Type": "application/json" } }); }
  catch { throw new Error("Não foi possível conectar à API. Tente novamente."); }
  const body = await response.json().catch(() => null);
  if (!response.ok) { const error = new Error(body?.message || "Não foi possível concluir a operação."); error.status = response.status; throw error; }
  return body;
}
// Identity comes from the HttpOnly customer session cookie validated by the backend.
export const getCurrentCustomer = () => customerRequest("/context");
export const getCustomerRequests = () => customerRequest("/requests");
export const getCustomerRequest = id => customerRequest("/requests/" + encodeURIComponent(id));
export const getCustomerQuotes = () => customerRequest("/quotes");
export const getCustomerProjects = () => customerRequest("/projects");
export const createCustomerRequest = form => customerRequest("/requests", { method: "POST", body: JSON.stringify(requestPayload(form, "Cliente")) });
export const respondToCustomerProposal = (quote, document, type, note) => customerRequest(
  "/quotes/" + encodeURIComponent(quote.id) + "/proposal/versions/" + document.version + "/result",
  { method: "POST", body: JSON.stringify({ revision: quote.revision, type, note, date: new Date().toISOString().slice(0, 10) }) }); // date is required by the DTO; the server records São Paulo's calendar date
// No document or messaging backend exists yet; no fabricated business records.
export const updateCustomerProfile = data => customerRequest("/profile", { method: "PUT", body: JSON.stringify(data) });
export const updateCustomerCompany = data => customerRequest("/company", { method: "PUT", body: JSON.stringify(data) });
export const changeCustomerPassword = data => customerRequest("/password", { method: "POST", body: JSON.stringify(data) });
export const requestCustomerClosure = reason => customerRequest("/closure-request", { method: "POST", body: JSON.stringify({ reason }) });
export const getCustomerDocuments = async () => [];
export const getCustomerContactChannels = async () => Object.fromEntries(["whatsapp", "email", "phone"].map(key => [key, { enabled: false, label: key, value: "" }]));
export const sendCustomerMessage = async () => ({ success: false, configured: false, message: "Canal de atendimento ainda não configurado." });
