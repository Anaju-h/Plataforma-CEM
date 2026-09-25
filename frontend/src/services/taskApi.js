// Tarefas delegadas por projeto, apontamento de horas, Meu trabalho e quadro da equipe.
const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, { credentials: "include", ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.message || "Não foi possível concluir a operação.");
    error.status = response.status;
    throw error;
  }
  return body;
}

const project = id => `/projects/${encodeURIComponent(id)}/tasks`;

export const getMyWork = () => request("/work/mine");
export const getTaskBoard = () => request("/work/board");
export const createTask = (projectId, data) => request(project(projectId), { method: "POST", body: JSON.stringify(data) });
export const updateTask = (projectId, taskId, data) => request(`${project(projectId)}/${taskId}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTask = (projectId, taskId) => request(`${project(projectId)}/${taskId}`, { method: "DELETE" });
export const addTimeEntry = (projectId, taskId, data) => request(`${project(projectId)}/${taskId}/time`, { method: "POST", body: JSON.stringify(data) });
export const deleteTimeEntry = (projectId, taskId, entryId) => request(`${project(projectId)}/${taskId}/time/${entryId}`, { method: "DELETE" });

export const getDemoDataStatus = () => request("/admin/demo-data");
export const removeDemoData = () => request("/admin/demo-data", { method: "DELETE" });
export const listInternalUsers = () => request("/admin/users");
export const createInternalUser = data => request("/admin/users", { method: "POST", body: JSON.stringify(data) });
export const updateInternalUser = (id, data) => request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
