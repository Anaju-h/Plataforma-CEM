import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getCustomerProjects } from "../../services/customer/customerService";

export function CustomerProjectsPage() {
  const { customer } = useOutletContext();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const data = await getCustomerProjects();

        if (active) {
          setProjects(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0057b8]">
          {customer.company.name}
        </p>

        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#071f2d]">
          Projetos
        </h1>

        <p className="mt-2 text-[13px] text-[#6e7981]">
          Acompanhe os serviços aprovados e em execução no laboratório.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="rounded-[14px] border border-[#dfe6ea] bg-white px-6 py-10 text-center text-[13px] text-[#7b868e]">
            Carregando projetos...
          </div>
        ) : (
          projects.map((project) => (
            <article
              key={project.id}
              className="rounded-[14px] border border-[#dfe6ea] bg-white p-6"
            >
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-[15px] font-semibold text-[#071f2d]">
                      {project.id}
                    </h2>

                    <span
                      className={`
                        rounded-full px-3 py-1 text-[10px] font-semibold
                        ${
                          project.status === "Concluído"
                            ? "bg-[#edf8f2] text-[#16704a]"
                            : "bg-[#eaf3fb] text-[#0057b8]"
                        }
                      `}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="mt-3 text-[13px] font-medium text-[#45525b]">
                    {project.service}
                  </p>

                  <p className="mt-1 text-[11px] text-[#8b959c]">
                    Peça: {project.part}
                  </p>

                  {project.quoteId && (
                    <p className="mt-1 text-[11px] text-[#8b959c]">
                      Origem: {project.quoteId}
                    </p>
                  )}
                </div>

                <div className="min-w-[220px]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9aa3aa]">
                      Progresso
                    </span>

                    <span className="text-[12px] font-semibold text-[#071f2d]">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf1f3]">
                    <div
                      className="h-full rounded-full bg-[#0057b8]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 border-t border-[#edf1f3] pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9aa3aa]">
                    Início
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-[#45525b]">
                    {project.startedAt}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9aa3aa]">
                    Previsão de entrega
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-[#45525b]">
                    {project.estimatedDelivery}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}