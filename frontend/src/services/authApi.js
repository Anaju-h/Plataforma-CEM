// Sessões são cookies HttpOnly emitidos pelo backend (JWT). Nada de token em localStorage/sessionStorage.
const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

async function call(path, options = {}) {
  let response;
  try {
    response = await fetch(baseUrl + path, { credentials: "same-origin", ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor. Tente novamente.", 0);
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(body?.message || (response.status === 401 ? "Sessão expirada. Entre novamente." : response.status === 403 ? "Seu perfil não permite esta ação." : "Não foi possível concluir a operação."), response.status);
  return body;
}

const post = (path, data) => call(path, { method: "POST", body: JSON.stringify(data ?? {}) });

export const ROLE_LABELS = { CONSULTA: "Consulta", TECNICO: "Técnico", VALIDADOR: "Validador", ADMIN: "Administrador" };
const ROLE_ORDER = ["CONSULTA", "TECNICO", "VALIDADOR", "ADMIN"];
export const hasRole = (user, role) => Boolean(user) && ROLE_ORDER.indexOf(user.role) >= ROLE_ORDER.indexOf(role);

export const loginInternal = (email, password) => post("/auth/login", { email, password });
export const logoutInternal = () => post("/auth/logout");
export const getInternalSession = () => call("/auth/me");

export const loginCustomer = (email, password, claim) => post("/auth/customer/login", { email, password, ...(claim || {}) });
export const registerCustomer = (data, claim) => post("/auth/customer/register", { ...data, ...(claim || {}) });
export const logoutCustomer = () => post("/auth/customer/logout");
export const updateInternalAccount = data => call("/auth/me", { method: "PUT", body: JSON.stringify(data) });
