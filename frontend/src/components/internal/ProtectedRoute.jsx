import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getInternalSession } from "../../services/authApi";
import { setSessionUser } from "../../services/currentUserService";
import { hydrateSettings } from "../../services/settingsSync";

// A sessão é validada pelo backend (cookie HttpOnly). O frontend não guarda credenciais.
export function ProtectedRoute() {
  const location = useLocation();
  const [state, setState] = useState({ status: "loading", error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getInternalSession()
      .then(async user => { setSessionUser(user); await hydrateSettings(user); if (active) setState({ status: "ok", error: "" }); })
      .catch(error => { if (active) setState({ status: error.status === 401 ? "anonymous" : "error", error: error.message }); });
    return () => { active = false; };
  }, [attempt]);

  if (state.status === "loading") return <main className="flex min-h-screen items-center justify-center bg-[#eef3f6] text-sm text-[#526d7c]">Verificando sessão…</main>;
  if (state.status === "anonymous") return <Navigate to="/portal/login" replace state={{ from: location.pathname }} />;
  if (state.status === "error") return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#eef3f6] text-sm text-[#526d7c]"><p role="alert">{state.error}</p><button type="button" className="rounded-[10px] bg-[#096ab2] px-5 py-2.5 font-semibold text-white" onClick={() => { setState({ status: "loading", error: "" }); setAttempt(value => value + 1); }}>Tentar novamente</button></main>;
  return <Outlet />;
}
