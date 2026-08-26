import {
  Route,
  Routes,
} from "react-router-dom";

import {
  ConfiguradorPage,
} from "../pages/ConfiguradorPage";

import {
  EquipamentosPage,
} from "../pages/EquipamentosPage";

import {
  HomePage,
} from "../pages/HomePage";

import {
  OrcamentoPage,
} from "../pages/OrcamentoPage";

import {
  ServicosPage,
} from "../pages/ServicosPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/equipamentos"
        element={
          <EquipamentosPage />
        }
      />

      <Route
        path="/servicos"
        element={
          <ServicosPage />
        }
      />

      <Route
        path="/orcamento"
        element={
          <OrcamentoPage />
        }
      />

      <Route
        path="/configurador"
        element={
          <ConfiguradorPage />
        }
      />
    </Routes>
  );
}