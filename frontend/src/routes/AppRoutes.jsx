import { CustomerAccessPage } from "../pages/customer/CustomerAccessPage";
import { CustomerRequestDetailPage } from "../pages/customer/CustomerRequestDetailPage";
import { InternalAccountPage } from "../pages/internal/InternalAccountPage";
import { ProposalBuilderPage } from "../pages/internal/ProposalBuilderPage";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { NotFoundPage } from "../pages/NotFoundPage";
import { DocumentTitle } from "./DocumentTitle";
import { OperationalHistoryPage } from "../pages/internal/OperationalHistoryPage";

import {
  ProtectedRoute,
} from "../components/internal/ProtectedRoute";

import {
  ScrollToTop,
} from "../components/layout/ScrollToTop";

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
  SobrePage,
} from "../pages/SobrePage";



import {
  CustomerAccountPage,
} from "../pages/customer/CustomerAccountPage";

import {
  CustomerDashboardPage,
} from "../pages/customer/CustomerDashboardPage";

import {
  CustomerDocumentsPage,
} from "../pages/customer/CustomerDocumentsPage";

import {
  CustomerNewRequestPage,
} from "../pages/customer/CustomerNewRequestPage";

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
  InternalNewRequestPage,
} from "../pages/internal/InternalNewRequestPage";


import { KnowledgeLayout } from "../pages/internal/knowledge/KnowledgeLayout";
import { AssistantPage } from "../pages/internal/knowledge/AssistantPage";
import { RecordsPage } from "../pages/internal/knowledge/RecordsPage";
import { RecordDetailPage } from "../pages/internal/knowledge/RecordDetailPage";
import { LessonsPage } from "../pages/internal/knowledge/LessonsPage";
import { IndicatorsPage } from "../pages/internal/knowledge/IndicatorsPage";
import { NoticesPage } from "../pages/internal/knowledge/NoticesPage";
import { VocabularyPage } from "../pages/internal/knowledge/VocabularyPage";
import { RoleRoute } from "../components/internal/RoleRoute";
import { TaskBoardPage } from "../pages/internal/TaskBoardPage";

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
    <>
      <ScrollToTop />
      <DocumentTitle />

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
            path="/sobre"
            element={<SobrePage />}
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

          <Route path="*" element={<NotFoundPage />} />
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
          <Route path="/cliente/solicitacoes/:requestId" element={<CustomerRequestDetailPage />} />
          <Route
            path="/cliente/dashboard"
            element={<CustomerDashboardPage />}
          />

          <Route
            path="/cliente/nova-solicitacao"
            element={<CustomerNewRequestPage />}
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

          <Route
            path="/cliente/conta"
            element={<CustomerAccountPage />}
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
            <Route path="/portal/conta" element={<InternalAccountPage />} />
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

            {/* =====================
                PROJETOS
            ====================== */}

            <Route
              path="/portal/projetos"
              element={<ProjectsPage />}
            />

            <Route
              path="/portal/projetos/:projectId"
              element={<ProjectDetailPage />}
            />

            {/* =====================
                CONHECIMENTO
            ====================== */}

            <Route path="/portal/conhecimento" element={<KnowledgeLayout />}>
              <Route index element={<Navigate to="assistente" replace />} />
              <Route path="assistente" element={<AssistantPage />} />
              <Route path="registros" element={<RecordsPage />} />
              <Route path="registros/:code" element={<RecordDetailPage />} />
              <Route path="licoes" element={<LessonsPage />} />
              <Route path="indicadores" element={<IndicatorsPage />} />
              <Route path="avisos" element={<NoticesPage />} />
              <Route path="vocabulario" element={<VocabularyPage />} />
              <Route path="administracao" element={<Navigate to="/portal/equipe" replace />} />
            </Route>

            {/* Somente Administrador: operação comercial, histórico, custos, equipe, tarefas e administração. */}
            <Route element={<RoleRoute role="ADMIN" />}>
            <Route path="/portal/orcamentos/:quoteId/proposta" element={<ProposalBuilderPage />} />
            <Route path="/portal/historico" element={<OperationalHistoryPage />} />
            {/* =====================
                SOLICITAÇÕES
            ====================== */}

            <Route
              path="/portal/solicitacoes"
              element={<RequestsPage />}
            />

            <Route
              path="/portal/solicitacoes/nova"
              element={<InternalNewRequestPage />}
            />

            <Route
              path="/portal/solicitacoes/:requestId"
              element={<RequestDetailPage />}
            />

            {/* =====================
                ORÇAMENTOS
            ====================== */}

            <Route
              path="/portal/orcamentos"
              element={<QuotesPage />}
            />

            <Route
              path="/portal/orcamentos/:quoteId"
              element={<QuoteDetailPage />}
            />

            {/* =====================
                GESTÃO
            ====================== */}

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
            <Route path="/portal/tarefas" element={<TaskBoardPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}
