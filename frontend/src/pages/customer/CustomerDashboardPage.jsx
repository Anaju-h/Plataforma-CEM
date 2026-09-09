import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  getCustomerProjects,
  getCustomerQuotes,
  getCustomerRequests,
} from "../../services/customer/customerService";

function SummaryCard({ label, value, description, href }) {
  return (
    <Link
      to={href}
      className="
        group rounded-[14px]
        border border-[#dfe6ea]
        bg-white
        p-5
        transition-all duration-200
        hover:-translate-y-[1px]
        hover:border-[#cbd9e1]
        hover:shadow-[0_8px_24px_rgba(7,31,45,0.05)]
      "
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a959d]">
        {label}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-[32px] font-semibold tracking-[-0.04em] text-[#071f2d]">
          {value}
        </p>

        <span className="text-[18px] text-[#b0bac0] transition-colors group-hover:text-[#0057b8]">
          →
        </span>
      </div>

      <p className="mt-2 text-[11px] leading-5 text-[#7b868e]">
        {description}
      </p>
    </Link>
  );
}

function ActivityItem({ code, title, description, status }) {
  return (
    <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[12px] font-semibold text-[#071f2d]">
            {code}
          </p>

          <span className="rounded-full bg-[#eef5fb] px-2.5 py-1 text-[10px] font-semibold text-[#0057b8]">
            {status}
          </span>
        </div>

        <p className="mt-2 text-[12px] font-medium text-[#45525b]">
          {title}
        </p>

        <p className="mt-1 text-[11px] text-[#8b959c]">
          {description}
        </p>
      </div>
    </div>
  );
}

export function CustomerDashboardPage() {
  const { customer } = useOutletContext();

  const [requests, setRequests] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [requestData, quoteData, projectData] = await Promise.all([
          getCustomerRequests(),
          getCustomerQuotes(),
          getCustomerProjects(),
        ]);

        if (active) {
          setRequests(requestData);
          setQuotes(quoteData);
          setProjects(projectData);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const activeRequests = requests.filter(
      (request) => request.status !== "Concluída",
    ).length;

    const pendingQuotes = quotes.filter(
      (quote) => quote.status === "Aguardando resposta",
    ).length;

    const activeProjects = projects.filter(
      (project) => project.status !== "Concluído",
    ).length;

    return {
      activeRequests,
      pendingQuotes,
      activeProjects,
    };
  }, [requests, quotes, projects]);

  const recentActivity = useMemo(() => {
    const items = [];

    if (requests[0]) {
      items.push({
        code: requests[0].id,
        title: requests[0].service,
        description: requests[0].part,
        status: requests[0].status,
      });
    }

    if (quotes[0]) {
      items.push({
        code: quotes[0].id,
        title: quotes[0].service,
        description: `Referente à ${quotes[0].requestId}`,
        status: quotes[0].status,
      });
    }

    if (projects[0]) {
      items.push({
        code: projects[0].id,
        title: projects[0].service,
        description: projects[0].part,
        status: projects[0].status,
      });
    }

    return items;
  }, [requests, quotes, projects]);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0057b8]">
            {customer.company.name}
          </p>

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#071f2d] sm:text-[34px]">
            Olá, {customer.user.name.split(" ")[0]}.
          </h1>

          <p className="mt-2 max-w-[590px] text-[13px] leading-6 text-[#6e7981]">
            Acompanhe suas solicitações, propostas, projetos e documentos em um
            único lugar.
          </p>
        </div>

        <Link
          to="/orcamento"
          className="
            inline-flex h-[44px] items-center justify-center
            rounded-[9px] bg-[#0057b8]
            px-5 text-[12px] font-semibold text-white
            transition-colors hover:bg-[#004a9d]
          "
        >
          Nova solicitação
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 rounded-[14px] border border-[#dfe6ea] bg-white px-6 py-12 text-center text-[13px] text-[#7b868e]">
          Carregando informações...
        </div>
      ) : (
        <>
          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryCard
              label="Solicitações"
              value={summary.activeRequests}
              description="Em avaliação ou processamento."
              href="/cliente/solicitacoes"
            />

            <SummaryCard
              label="Orçamentos"
              value={summary.pendingQuotes}
              description="Aguardando uma resposta da empresa."
              href="/cliente/orcamentos"
            />

            <SummaryCard
              label="Projetos"
              value={summary.activeProjects}
              description="Serviços atualmente em execução."
              href="/cliente/projetos"
            />
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.8fr]">
            <section className="rounded-[14px] border border-[#dfe6ea] bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#071f2d]">
                    Atividade recente
                  </h2>

                  <p className="mt-1 text-[11px] text-[#8a959d]">
                    Últimas movimentações relacionadas à sua empresa.
                  </p>
                </div>
              </div>

              <div className="mt-4 divide-y divide-[#edf1f3]">
                {recentActivity.map((item) => (
                  <ActivityItem
                    key={item.code}
                    code={item.code}
                    title={item.title}
                    description={item.description}
                    status={item.status}
                  />
                ))}
              </div>
            </section>

            <aside className="rounded-[14px] border border-[#dfe6ea] bg-white p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8b969e]">
                Sua empresa
              </p>

              <h2 className="mt-3 text-[16px] font-semibold text-[#071f2d]">
                {customer.company.name}
              </h2>

              <div className="mt-5 space-y-4 border-t border-[#edf1f3] pt-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#9aa3aa]">
                    Usuário
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-[#45525b]">
                    {customer.user.name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#9aa3aa]">
                    E-mail
                  </p>

                  <p className="mt-1 break-all text-[12px] font-medium text-[#45525b]">
                    {customer.user.email}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#9aa3aa]">
                    Localização
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-[#45525b]">
                    {customer.company.city} - {customer.company.state}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}