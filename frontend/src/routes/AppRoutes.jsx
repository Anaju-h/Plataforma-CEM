import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  ProtectedRoute,
} from "../components/internal/ProtectedRoute";

import {
  CustomerLayout,
} from "../layouts/CustomerLayout";

import {
  CustomerPortalLayout,
} from "../layouts/CustomerPortalLayout";

import {
  InternalLayout,
} from "../layouts/InternalLayout";

import {
  PublicLayout,
} from "../layouts/PublicLayout";

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

import {
  CustomerAccessPage,
} from "../pages/customer/CustomerAccessPage";

import {
  CustomerDashboardPage,
} from "../pages/customer/CustomerDashboardPage";

import {
  CustomerDocumentsPage,
} from "../pages/customer/CustomerDocumentsPage";

import {
  CustomerProjectsPage,
} from "../pages/customer/CustomerProjectsPage";

import {
  CustomerQuotesPage,
} from "../pages/customer/CustomerQuotesPage";

import {
  CustomerRequestsPage,
} from "../pages/customer/CustomerRequestsPage";

import {
  AdministrationPage,
} from "../pages/internal/AdministrationPage";

import {
  DashboardPage,
} from "../pages/internal/DashboardPage";

import {
  EquipmentCostsPage,
} from "../pages/internal/EquipmentCostsPage";

import {
  KnowledgeDetailPage,
} from "../pages/internal/KnowledgeDetailPage";

import {
  KnowledgePage,
} from "../pages/internal/KnowledgePage";

import {
  LoginPage,
} from "../pages/internal/LoginPage";

import {
  MyWorkPage,
} from "../pages/internal/MyWorkPage";

import {
  ProjectDetailPage,
} from "../pages/internal/ProjectDetailPage";

import {
  ProjectsPage,
} from "../pages/internal/ProjectsPage";

import {
  QuoteDetailPage,
} from "../pages/internal/QuoteDetailPage";

import {
  QuotesPage,
} from "../pages/internal/QuotesPage";

import {
  RequestDetailPage,
} from "../pages/internal/RequestDetailPage";

import {
  RequestsPage,
} from "../pages/internal/RequestsPage";

import {
  TeamPage,
} from "../pages/internal/TeamPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          ÁREA PÚBLICA
      ========================== */}

      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/equipamentos"
          element={<EquipamentosPage />}
        />

        <Route
          path="/servicos"
          element={<ServicosPage />}
        />

        <Route
          path="/orcamento"
          element={<OrcamentoPage />}
        />

        <Route
          path="/configurador"
          element={<ConfiguradorPage />}
        />
      </Route>

      {/* =========================
          ACESSO DO CLIENTE
      ========================== */}

      <Route element={<CustomerLayout />}>
        <Route
          path="/cliente"
          element={<CustomerAccessPage />}
        />
      </Route>

      {/* =========================
          PORTAL DO CLIENTE
      ========================== */}

      <Route element={<CustomerPortalLayout />}>
        <Route
          path="/cliente/dashboard"
          element={<CustomerDashboardPage />}
        />

        <Route
          path="/cliente/solicitacoes"
          element={<CustomerRequestsPage />}
        />

        <Route
          path="/cliente/orcamentos"
          element={<CustomerQuotesPage />}
        />

        <Route
          path="/cliente/projetos"
          element={<CustomerProjectsPage />}
        />

        <Route
          path="/cliente/documentos"
          element={<CustomerDocumentsPage />}
        />
      </Route>

      {/* =========================
          ÁREA INTERNA
      ========================== */}

      <Route
        path="/portal/login"
        element={<LoginPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<InternalLayout />}>
          <Route
            path="/portal"
            element={<DashboardPage />}
          />

          <Route
            path="/portal/dashboard"
            element={
              <Navigate
                to="/portal"
                replace
              />
            }
          />

          <Route
            path="/portal/meu-trabalho"
            element={<MyWorkPage />}
          />

          <Route
            path="/portal/solicitacoes"
            element={<RequestsPage />}
          />

          <Route
            path="/portal/solicitacoes/:requestId"
            element={<RequestDetailPage />}
          />

          <Route
            path="/portal/orcamentos"
            element={<QuotesPage />}
          />

          <Route
            path="/portal/orcamentos/:quoteId"
            element={<QuoteDetailPage />}
          />

          <Route
            path="/portal/projetos"
            element={<ProjectsPage />}
          />

          <Route
            path="/portal/projetos/:projectId"
            element={<ProjectDetailPage />}
          />

          <Route
            path="/portal/conhecimento"
            element={<KnowledgePage />}
          />

          <Route
            path="/portal/conhecimento/:knowledgeId"
            element={<KnowledgeDetailPage />}
          />

          <Route
            path="/portal/equipamentos-custos"
            element={<EquipmentCostsPage />}
          />

          <Route
            path="/portal/equipe"
            element={<TeamPage />}
          />

          <Route
            path="/portal/administracao"
            element={<AdministrationPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}