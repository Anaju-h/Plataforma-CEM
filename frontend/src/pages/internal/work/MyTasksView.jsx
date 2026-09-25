import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ApiState } from "../../../components/internal/ApiState";
import { DemoBadge } from "../../../components/internal/DemoBadge";
import { InternalPageHeader } from "../../../components/internal/InternalPageHeader";
import { ProjectStatusBadge } from "../../../components/internal/ProjectStatusBadge";
import { HoursSummary, TaskStatusBadge, TimeEntryModal } from "../../../components/internal/tasks/TaskUi";
import { ROLE_TITLES, TASK_STATUSES, formatHours, formatIsoDate, linkButton } from "../../../components/internal/tasks/taskUtils";
import { addTimeEntry, getMyWork, updateTask } from "../../../services/taskApi";

const FILTERS = [["open", "Abertas"], ["done", "Concluídas"], ["all", "Todas"]];

/** Meu trabalho dos perfis operacionais: tarefas delegadas pelo Administrador, prazos e horas. */
export function MyTasksView({ user }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [filter, setFilter] = useState("open");
  const [timeRow, setTimeRow] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;
    getMyWork().then(value => { if (active) { setData(value); setError(""); } }).catch(reason => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [retry]);

  const groups = useMemo(() => {
    const rows = (data?.tasks || []).filter(row => filter === "all" || (filter === "done" ? row.task.status === "DONE" : row.task.status !== "DONE"));
    const byProject = new Map();
    rows.forEach(row => {
      if (!byProject.has(row.project.id)) byProject.set(row.project.id, { project: row.project, rows: [] });
      byProject.get(row.project.id).rows.push(row);
    });
    return [...byProject.values()];
  }, [data, filter]);

  if (error || !data) return <ApiState eyebrow="Visão geral" title="Meu trabalho" description="Tarefas delegadas a você, prazos e horas." loading="Carregando suas tarefas..." error={error} onRetry={() => { setError(""); setRetry(value => value + 1); }} />;

  const totals = data.totals;
  const reload = message => { setFeedback(message); setRetry(value => value + 1); };
  const metrics = [
    ["Tarefas abertas", totals.open, "A fazer e em andamento."],
    ["Atrasadas", totals.overdue, "Prazo vencido e ainda não concluídas.", totals.overdue > 0],
    ["Prazo em até 3 dias", totals.dueSoon, "Priorize estas entregas."],
    ["Horas nesta semana", formatHours(totals.weekHours), "Seus apontamentos desde segunda-feira."],
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader eyebrow="Visão geral" title="Meu trabalho"
        description="Tarefas que o Administrador delegou a você. Atualize o status e aponte as horas: elas alimentam o Registro de Serviço na Gestão do Conhecimento."
        action={<span className="rounded-full border border-[#c7d9e3] bg-white/80 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2d6488]">Perfil: {ROLE_TITLES[user.role] || user.accessProfile}</span>} />

      {feedback && <div className="mt-5 rounded-[14px] border border-[#bcd8c7] bg-[#ebf5ee] px-4 py-3 text-[13px] font-semibold text-[#3d7453]">{feedback}</div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, hint, alert]) => (
          <section key={label} className="rounded-[18px] border border-[#cbdde6] bg-white/75 p-5">
            <p className="internal-field-label text-[#607989]">{label}</p>
            <p className={`mt-2 text-3xl font-semibold ${alert ? "text-[#a0522d]" : "text-[#17394f]"}`}>{value}</p>
            <p className="internal-help-text mt-1 text-[#7c909b]">{hint}</p>
          </section>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_340px]">
        <section className="rounded-[22px] border border-[#cddbe3] bg-white/85 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce5eb] pb-5">
            <div>
              <h2 className="internal-section-title font-semibold text-[#17394f]">Minhas tarefas</h2>
              <p className="internal-body mt-1 text-[#526d7c]">Agrupadas por projeto, com prazo e horas.</p>
            </div>
            <div className="flex gap-1 rounded-[12px] border border-[#d7e1e7] bg-[#f5f9fb] p-1">
              {FILTERS.map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`internal-ctl rounded-[10px] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition ${filter === value ? "bg-[#12364e] text-white" : "text-[#526d7c] hover:bg-white"}`}>{label}</button>)}
            </div>
          </div>

          {groups.length === 0 ? (
            <div className="mt-5 rounded-[20px] border border-dashed border-[#cbd9e1] bg-[#f8fafb] px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-[#17394f]">{filter === "done" ? "Nenhuma tarefa concluída ainda." : "Nenhuma tarefa aberta delegada a você."}</p>
              <p className="internal-help-text mt-2 text-[#7c909b]">{user.role === "CONSULTA" ? "O perfil Consulta é somente leitura: acompanhe a Gestão do Conhecimento e os projetos em que for incluído." : "Quando o Administrador delegar uma tarefa, ela aparece aqui e no sino de avisos."}</p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {groups.map(({ project, rows }) => (
                <article key={project.id} className="overflow-hidden rounded-[18px] border border-[#d9e3e8] bg-[#fbfcfd]">
                  <div className="flex flex-wrap items-center gap-3 border-b border-[#e3eaee] bg-[#f3f8fb] px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5681a0]">{project.id} · {project.service}</p>
                      <p className="mt-0.5 truncate text-[15px] font-semibold text-[#17394f]">{project.company}</p>
                    </div>
                    {project.demo && <DemoBadge />}
                    <ProjectStatusBadge status={project.status} />
                    <Link to={`/portal/projetos/${project.id}`} className={linkButton}>Abrir projeto</Link>
                  </div>
                  <ul className="divide-y divide-[#e3eaee]">
                    {rows.map(({ task, overdue, dueSoon }) => (
                      <li key={task.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className={`text-[14px] font-semibold ${task.status === "DONE" ? "text-[#557767]" : "text-[#17394f]"}`}>{task.title}</p>
                            <TaskStatusBadge status={task.status} />
                          </div>
                          {task.description && <p className="mt-1 text-[13px] leading-5 text-[#6d8390]">{task.description}</p>}
                          <p className="mt-1.5 text-[12.5px] text-[#607989]">
                            <span className={overdue ? "font-semibold text-[#a0522d]" : dueSoon ? "font-semibold text-[#8b733b]" : ""}>Prazo: {formatIsoDate(task.dueDate)}{overdue ? " · atrasada" : dueSoon ? " · em breve" : ""}</span>
                            <span className="mx-2 text-[#b5c4cc]">•</span>
                            Horas: {formatHours(task.spentHours)} de {formatHours(task.plannedHours)}
                          </p>
                        </div>
                        {!project.closed && (
                          <div className="flex flex-wrap items-center gap-3">
                            <select aria-label="Status da tarefa" value={task.status} className="internal-ctl h-9 rounded-[10px] border border-[#ccdbe3] bg-white px-3 text-[12.5px] font-semibold text-[#294e64]"
                              onChange={event => updateTask(project.id, task.id, { status: event.target.value }).then(() => reload("Status da tarefa atualizado.")).catch(reason => setFeedback(reason.message))}>
                              {TASK_STATUSES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </select>
                            <button type="button" className="internal-ctl rounded-[10px] bg-[#096ab2] px-4 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#075b99]" onClick={() => setTimeRow({ project, task })}>Apontar horas</button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">Minhas horas</p>
            <div className="mt-4"><HoursSummary planned={totals.plannedHours} spent={totals.spentHours} compact /></div>
          </section>
          <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#718895]">Gestão do Conhecimento</p>
            <p className="mt-3 text-[13px] leading-5 text-[#607989]">Ao terminar um serviço, feche o Registro de Serviço com o realizado e a lição aprendida. Suas horas apontadas já aparecem lá.</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <Link to="/portal/conhecimento/registros" className={linkButton}>Registros</Link>
              <Link to="/portal/conhecimento/assistente" className={linkButton}>Assistente</Link>
              <Link to="/portal/conhecimento/avisos" className={linkButton}>Avisos</Link>
            </div>
          </section>
        </aside>
      </div>

      {timeRow && (
        <TimeEntryModal task={timeRow.task} onClose={() => setTimeRow(null)}
          onSave={async payload => { await addTimeEntry(timeRow.project.id, timeRow.task.id, payload); setTimeRow(null); reload("Horas registradas."); }} />
      )}
    </div>
  );
}
