// Configurações do laboratório e trilha administrativa persistidas no backend (somente Administrador).
const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { credentials: "include", ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || "Não foi possível salvar a configuração.");
  return body;
}

export const getSettings = () => request("/admin/settings");
export const saveSetting = (key, value) => request(`/admin/settings/${encodeURIComponent(key)}`, { method: "PUT", body: JSON.stringify(value) });
export const getAuditTrail = (limit = 100) => request(`/admin/audit?limit=${limit}`);
export const postAuditEvent = event => request("/admin/audit", { method: "POST", body: JSON.stringify(event) });

/** Grava sem bloquear a tela; falhas aparecem no console para não interromper a operação. */
export function persistSetting(key, value) {
  saveSetting(key, value).catch(error => console.error(`[configurações] ${key}:`, error.message));
}
