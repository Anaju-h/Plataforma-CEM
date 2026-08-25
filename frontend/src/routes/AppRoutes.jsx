import { Route, Routes } from "react-router-dom";

import { EquipamentosPage } from "../pages/EquipamentosPage";
import { HomePage } from "../pages/HomePage";
import { ServicosPage } from "../pages/ServicosPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/equipamentos" element={<EquipamentosPage />} />
      <Route path="/servicos" element={<ServicosPage />} />
    </Routes>
  );
}