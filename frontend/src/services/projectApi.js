const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
async function projectRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  } catch { throw new Error("Não foi possível conectar à API de projetos."); }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || "Não foi possível concluir a operação do projeto.");
  return body;
}
export const listPersistedProjects = () => projectRequest("/projects");
export const getPersistedProject = id => projectRequest(`/projects/${encodeURIComponent(id)}`);
export const createPersistedProject = quoteId => projectRequest(`/quotes/${encodeURIComponent(quoteId)}/project`, { method: "POST" });
export const updatePersistedProject = (id, data) => projectRequest(`/projects/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) });
