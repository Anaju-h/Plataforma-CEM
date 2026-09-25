import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { hasRole } from "../../services/authApi";

/** Rotas restritas por perfil. O backend também bloqueia; aqui só evitamos telas que o perfil não pode usar. */
export function RoleRoute({ role = "ADMIN", redirectTo = "/portal/meu-trabalho" }) {
  const user = useCurrentUser();
  if (!hasRole(user, role)) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
}
