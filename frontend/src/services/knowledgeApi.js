// Módulo de Gestão do Conhecimento — cliente da API /api/knowledge (sessão via cookie HttpOnly).
import { ApiError } from "./authApi";

const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function call(path, options = {}) {
  let response;
  try {
    response = await fetch(baseUrl + path, { credentials: "same-origin", ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor.", 0);
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(body?.message || (response.status === 403 ? "Seu perfil não permite esta ação." : response.status === 401 ? "Sessão expirada. Entre novamente." : "Não foi possível concluir a operação."), response.status);
  return body;
}
const send = (method, path, data) => call(path, { method, body: data === undefined ? undefined : JSON.stringify(data) });
const qs = params => {
  const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
  const text = search.toString();
  return text ? `?${text}` : "";
};

export const knowledgeApi = {
  vocabulary: () => call("/knowledge/vocabulary"),
  createTerm: data => send("POST", "/knowledge/vocabulary/terms", data),
  updateTerm: (id, data) => send("PUT", `/knowledge/vocabulary/terms/${id}`, data),
  setTolerance: value => send("PUT", "/knowledge/settings/tolerance", { value }),

  recommend: query => send("POST", "/knowledge/assistant", query),

  records: params => call("/knowledge/records" + qs(params || {})),
  record: code => call(`/knowledge/records/${encodeURIComponent(code)}`),
  createRecord: data => send("POST", "/knowledge/records", data),
  closeRecord: (code, data) => send("POST", `/knowledge/records/${encodeURIComponent(code)}/close`, data),

  lessons: params => call("/knowledge/lessons" + qs(params || {})),
  submitLesson: code => send("POST", `/knowledge/lessons/${encodeURIComponent(code)}/submit`, {}),
  decideLesson: (code, decision, note) => send("POST", `/knowledge/lessons/${encodeURIComponent(code)}/decision`, { decision, note }),
  supersedeLesson: (code, note) => send("POST", `/knowledge/lessons/${encodeURIComponent(code)}/supersede`, { decision: "SUPERSEDE", note }),

  notices: () => call("/knowledge/notices"),
  readNotice: id => send("POST", `/knowledge/notices/${id}/read`, {}),
  readAllNotices: () => send("POST", "/knowledge/notices/read-all", {}),
  subscriptions: () => call("/knowledge/subscriptions"),
  setSubscriptions: termIds => send("PUT", "/knowledge/subscriptions", { termIds }),

  indicators: () => call("/knowledge/indicators"),

  users: () => call("/admin/users"),
  createUser: data => send("POST", "/admin/users", data),
  updateUser: (id, data) => send("PUT", `/admin/users/${id}`, data),
};
