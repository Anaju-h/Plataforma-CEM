import { useCurrentUser } from "../../hooks/useCurrentUser";
import { hasRole } from "../../services/authApi";
import { DemoBadge } from "../../components/internal/DemoBadge";
import { formatHours } from "../../components/internal/tasks/taskUtils";
import { ApiState } from "../../components/internal/ApiState";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import {
  ProjectStatusBadge,
} from "../../components/internal/ProjectStatusBadge";

import {
  projectStatuses,
} from "../../data/internal/projects";

import {
  getActiveProjects,
  isArchivedProject,
} from "../../services/projectService";

export function ProjectsPage() {
  const navigate =
    useNavigate();
  const isAdmin = hasRole(useCurrentUser(), "ADMIN");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("Todos");

  const [runtimeProjects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    getActiveProjects().then(value => { if (active) setProjects(value); })
      .catch(reason => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);

  const filteredProjects =
    useMemo(() => {
      const normalized =
        search
          .trim()
          .toLowerCase();

      return runtimeProjects.filter(
        (project) => {
          const matchesSearch =
            !normalized ||
            [
              project.id,
              project.quoteId,
              project.company,
              project.service,
              project.machine,
            ].some((value) =>
              String(
                value ?? "",
              )
                .toLowerCase()
                .includes(
                  normalized,
                ),
            );

          const matchesStatus =
            status === "Todos" ||
            project.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      runtimeProjects,
      search,
      status,
    ]);

  if (loading || error) return <ApiState title="Projetos" loading="Carregando projetos..." error={error} onRetry={() => { setLoading(true); setError(""); setRetry(value => value + 1); }} />;
  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Operação"
        title="Projetos"
        description={isAdmin ? "Acompanhe os serviços que avançaram para execução após a aprovação comercial." : "Projetos em que você tem tarefas delegadas."}
      />

      <div className="mt-7 rounded-[20px] border border-[#d1dde4] bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Buscar projeto, cliente, orçamento, serviço ou equipamento..."
            className="internal-field-value 
              h-11
              rounded-[12px]
              border border-[#d7e1e7]
              bg-[#f9fbfc]
              px-4
              
              text-[#17394f]
              outline-none
              transition
              placeholder:text-[#526d7c]
              focus:border-[#76a9c7]
              focus:bg-white
            "
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value,
              )
            }
            className="internal-field-value 
              h-11
              rounded-[12px]
              border border-[#d7e1e7]
              bg-[#f9fbfc]
              px-3
              
              font-medium
              text-[#536f80]
              outline-none
              focus:border-[#76a9c7]
            "
          >
            {projectStatuses.filter(status => !isArchivedProject({ status })).map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {filteredProjects.map(
          (project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() =>
                navigate(
                  `/portal/projetos/${project.id}`,
                )
              }
            />
          ),
        )}
      </div>

      {filteredProjects.length ===
        0 && (
        <div className="mt-5 rounded-[20px] border border-dashed border-[#cbd9e1] bg-[#f8fafb] px-6 py-16 text-center">
          <p className="internal-card-title font-semibold text-[#536f80]">
            Nenhum projeto encontrado.
          </p>

          <p className="internal-help-text mt-2 text-[#526d7c]">
            Projetos são criados a partir de orçamentos aceitos.
          </p>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onClick,
}) {
  const completedTasks =
    project.tasks.filter(
      (task) =>
        task.completed,
    ).length;

  const progress =
    project.tasks.length
      ? Math.round(
          (completedTasks /
            project.tasks.length) *
            100,
        )
      : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        rounded-[20px]
        border border-[#d1dde4]
        bg-white
        p-5
        text-left
        transition
        hover:-translate-y-[2px]
        hover:border-[#a9c6d6]
        hover:shadow-[0_15px_35px_rgba(34,67,90,0.06)]
        sm:p-6
      "
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="internal-eyebrow font-semibold uppercase text-[#5681a0]">
            {project.id}
          </p>

          <p className="internal-help-text mt-1 text-[#526d7c]">
            Origem:{" "}
            {project.quoteId}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">{project.demo && <DemoBadge />}<ProjectStatusBadge status={project.status} /></div>
      </div>

      <h2 className="internal-section-title mt-5 font-semibold text-[#17394f]">
        {project.company}
      </h2>

      <p className="internal-help-text mt-1 text-[#526d7c]">
        {project.service}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Info
          label="Equipamento"
          value={
            project.machine
          }
        />

        <Info
          label="Prazo"
          value={
            project.deadline
          }
        />

        <Info label="Equipe" value={[...new Set(project.tasks.map(task => task.assigneeName).filter(Boolean))].join(", ") || "Sem tarefas delegadas"} />

        <Info label="Horas gastas / orçadas" value={`${formatHours(project.spentHours)} / ${formatHours(project.budgetHours)}`} />
      </div>

      <div className="mt-5 border-t border-[#e4eaee] pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
            Tarefas concluídas
          </p>

          <p className="internal-card-title font-semibold text-[#5681a0]">
            {progress}%
          </p>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e4ebef]">
          <div
            className="h-full rounded-full bg-[#1684c5] transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </button>
  );
}

function Info({
  label,
  value,
}) {
  return (
    <div>
      <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
        {label}
      </p>

      <p className="internal-card-title mt-1 font-semibold text-[#476579]">
        {value ||
          "A definir"}
      </p>
    </div>
  );
}
