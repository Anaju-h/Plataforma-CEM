import {
  Navigate,
  Outlet,
} from "react-router-dom";

export function ProtectedRoute() {
  const rawSession =
    localStorage.getItem(
      "lab-portal-session",
    );

  if (!rawSession) {
    return (
      <Navigate
        to="/portal/login"
        replace
      />
    );
  }

  try {
    const session =
      JSON.parse(rawSession);

    if (
      !session.authenticated ||
      session.role !== "ADMIN"
    ) {
      throw new Error(
        "Invalid session",
      );
    }

    return <Outlet />;
  } catch {
    localStorage.removeItem(
      "lab-portal-session",
    );

    return (
      <Navigate
        to="/portal/login"
        replace
      />
    );
  }
}