import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ApiState } from "../../components/internal/ApiState";
import { DemoBadge } from "../../components/internal/DemoBadge";
import { InternalPageHeader } from "../../components/internal/InternalPageHeader";
import { TaskEditorModal, TimeEntryModal } from "../../components/internal/tasks/TaskUi";
import { ROLE_TITLES, TASK_STATUSES, formatHours, formatIsoDate, linkButton } from "../../components/internal/tasks/taskUtils";
import { getActiveProjects } from "../../services/projectService";
import { addTimeEntry, createTask, getTaskBoard, updateTask } from "../../services/taskApi";

const COLUMN_STYLES = {
  TODO: "border-[#c8d7e3] bg-[#edf3f8] text-[#526f86]",
  DOING: "border-[#bcd6e5] bg-[#eaf4fa] text-[#34749b]",
  DONE: "border-[#b7d8c4] bg-[#e8f5ed] text-[#397250]",
};
const selectClass = "internal-field-value mt-2 h-11 w-full rounded-[12px] border border-[#ccdbe3] bg-[#f8fafb] px-3 text-[#294e64]";

/** Quadro de tarefas do Administrador: delega, acompanha prazos e compara horas planejadas × gastas por pessoa. */
export function TaskBoardPage() {
  const [board, setBoard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [filters, setFilters] = useState({ search: "", member: "all", project: "all", closed: false });
  const [editor, setEditor] = useState(null);
  const [timeRow, setTimeRow] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getTaskBoard(), getActiveProjects()])
      .then(([boardData, projectList]) => { if (active) { setBoard(boardData); setProjects(projectList); setError(""); } })
      .catch(reason => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [retry]);

  const rows = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return (board?.tasks || []).filter(row => {
      if (!filters.closed && row.project.closed) return false;
      if (filters.project !== "all" && row.project.id !== filters.project) return false;
      if (filters.member === "none" && row.task.assigneeId) return false;
      if (!["all", "none"].includes(filters.member) && row.task.assigneeId !== filters.member) return false;
      if (!search) return true;
      return [row.task.title, row.task.assigneeName, row.project.id, row.project.company, row.project.service].some(value => String(value || "").toLowerCase().includes(search));
    });
  }, [board, filters]);

  const workload = useMemo(() => (board?.members || []).filter(member => member.assignable).map(member => {
    const mine = (board?.tasks || []).filter(row => row.task.assigneeId === member.id && !row.project.closed);
    return {
      ...member,
      open: mine.filter(row => row.task.status !== "DONE").length,
      overdue: mine.filter(row => row.overdue).length,
      planned: mine.reduce((sum, row) => sum + Number(row.task.plannedHours || 0), 0),
      spent: mine.reduce((sum, row) => sum + Number(row.task.spentHours || 0), 0),
    };
  }), [board]);

  if (error || !board) return <ApiState eyebrow="Gestão" title="Quadro de tarefas" description="Delegação das tarefas dos projetos para a equipe." loading="Carregando quadro..." error={error} onRetry={() => { setError(""); setRetry(value => value + 1); }} />;

  const reload = message => { setFeedback(message); setRetry(value => value + 1); };
  const totals = board.totals;
  const set = key => event => setFilters(current => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const projectOptions = [...new Map((board.tasks || []).map(row => [row.project.id, row.project])).values()];

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader eyebrow="Gestão" title="Quadro de tarefas"
        description="Delegue as tarefas dos projetos para a equipe, acompanhe prazos e compare horas planejadas × gastas. Cada pessoa vê as próprias tarefas em Meu trabalho."
        action={<button type="button" disabled={!projects.length} className="internal-ctl rounded-[12px] bg-[#096ab2] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#075b99] disabled:opacity-60" onClick={() => setEditor({ task: null })}>Nova tarefa</button>} />

      {feedback && <div className="mt-5 rounded-[14px] border border-[#bcd8c7] bg-[#ebf5ee] px-4 py-3 text-[13px] font-semibold text-[#3d7453]">{feedback}</div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Tarefas abertas", totals.open], ["Atrasadas", totals.overdue, totals.overdue > 0], ["Horas planejadas", formatHours(totals.plannedHours)], ["Horas gastas", formatHours(totals.spentHours)]].map(([label, value, alert]) => (
          <section key={label} className="rounded-[18px] border border-[#cbdde6] bg-white/75 p-5">
            <p className="internal-field-label text-[#607989]">{label}</p>
            <p className={`mt-2 text-3xl font-semibold ${alert ? "text-[#a0522d]" : "text-[#17394f]"}`}>{value}</p>
          </section>
        ))}
      </div>

      <section className="mt-5 grid gap-4 rounded-[20px] border border-[#d1dde4] bg-white p-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_auto] xl:items-end">
        <label className="block"><span className="internal-field-label text-[#607989]">Buscar</span><input className={selectClass} value={filters.search} onChange={set("search")} placeholder="Tarefa, pessoa, projeto ou cliente" /></label>
        <label className="block"><span className="internal-field-label text-[#607989]">Responsável</span>
          <select className={selectClass} value={filters.member} onChange={set("member")}>
            <option value="all">Todos</option><option value="none">Sem responsável</option>
            {(board.members || []).filter(member => member.assignable).map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </label>
        <label className="block"><span className="internal-field-label text-[#607989]">Projeto</span>
          <select className={selectClass} value={filters.project} onChange={set("project")}>
            <option value="all">Todos</option>
            {projectOptions.map(project => <option key={project.id} value={project.id}>{project.id} · {project.company}</option>)}
          </select>
        </label>
        <label className="flex h-11 items-center gap-2 text-[13px] font-semibold text-[#526d7c]"><input type="checkbox" checked={filters.closed} onChange={set("closed")} className="h-4 w-4" /> Incluir encerrados</label>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {TASK_STATUSES.map(column => {
          const items = rows.filter(row => row.task.status === column.value);
          return (
            <section key={column.value} className="flex min-h-[240px] flex-col rounded-[22px] border border-[#cddbe3] bg-white/70 p-4">
              <div className="flex items-center justify-between px-1 pb-3">
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${COLUMN_STYLES[column.value]}`}>{column.label}</span>
                <span className="text-[13px] font-semibold text-[#607989]">{items.length}</span>
              </div>
              <div className="-mr-2 max-h-[780px] space-y-3 overflow-y-auto pr-2">
                {items.length === 0 && <p className="rounded-[14px] border border-dashed border-[#cbd9e1] bg-[#f8fafb] px-4 py-8 text-center text-[13px] text-[#7c909b]">Nenhuma tarefa.</p>}
                {items.map(row => <BoardCard key={row.task.id} row={row} onEdit={() => setEditor({ task: row.task, projectId: row.project.id })} onTime={() => setTimeRow(row)}
                  onStatus={status => updateTask(row.project.id, row.task.id, { status }).then(() => reload("Status atualizado.")).catch(reason => setFeedback(reason.message))} />)}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-5 overflow-hidden rounded-[22px] border border-[#cddbe3] bg-white shadow-[0_10px_30px_rgba(7,31,45,0.035)]">
        <div className="border-b border-[#dce5eb] px-5 py-4 sm:px-6">
          <h2 className="internal-section-title font-semibold text-[#17394f]">Carga por pessoa</h2>
          <p className="internal-help-text mt-1 text-[#607989]">Projetos em aberto. O perfil Consulta é somente leitura e não recebe tarefas.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="text-[11px] uppercase tracking-[0.08em] text-[#5f7c8c]"><tr className="border-b border-[#e3eaee]"><th className="px-6 py-3">Perfil</th><th className="px-3">Abertas</th><th className="px-3">Atrasadas</th><th className="px-3">Planejadas</th><th className="px-3">Gastas</th><th className="px-6">Consumo</th></tr></thead>
            <tbody className="divide-y divide-[#e3eaee]">
              {workload.map(member => {
                const percent = member.planned > 0 ? Math.round((member.spent / member.planned) * 100) : 0;
                return (
                  <tr key={member.id}>
                    <td className="px-6 py-3"><p className="font-semibold text-[#17394f]">{member.name}</p>{member.name !== ROLE_TITLES[member.role] && <p className="text-[12px] text-[#7c909b]">{ROLE_TITLES[member.role]}</p>}</td>
                    <td className="px-3 text-[#31566d]">{member.open}</td>
                    <td className={`px-3 ${member.overdue ? "font-semibold text-[#a0522d]" : "text-[#31566d]"}`}>{member.overdue}</td>
                    <td className="px-3 text-[#31566d]">{formatHours(member.planned)}</td>
                    <td className="px-3 text-[#31566d]">{formatHours(member.spent)}</td>
                    <td className="px-6"><div className="flex items-center gap-3"><div className="h-2 w-28 overflow-hidden rounded-full bg-[#e2e9ed]"><div className={`h-full rounded-full ${percent > 100 ? "bg-[#c9772f]" : "bg-[#1684c5]"}`} style={{ width: `${Math.min(percent, 100)}%` }} /></div><span className="text-[12px] font-semibold text-[#607989]">{percent}%</span></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {editor && (
        <TaskEditorModal task={editor.task} members={board.members} projects={editor.task ? null : projects} defaultProjectId={editor.projectId}
          onClose={() => setEditor(null)}
          onSave={async data => {
            const payload = { title: data.title, description: data.description, assigneeId: data.assigneeId, dueDate: data.dueDate, plannedHours: data.plannedHours };
            if (editor.task) await updateTask(editor.projectId, editor.task.id, { ...payload, status: data.status });
            else await createTask(data.projectId, payload);
            setEditor(null); reload(editor.task ? "Tarefa atualizada." : "Tarefa delegada.");
          }} />
      )}
      {timeRow && (
        <TimeEntryModal task={timeRow.task} onClose={() => setTimeRow(null)}
          onSave={async payload => { await addTimeEntry(timeRow.project.id, timeRow.task.id, payload); setTimeRow(null); reload("Horas registradas."); }} />
      )}
    </div>
  );
}

function BoardCard({ row, onEdit, onTime, onStatus }) {
  const { task, project, overdue, dueSoon } = row;
  return (
    <article className={`rounded-[16px] border bg-white p-4 shadow-[0_6px_18px_rgba(7,31,45,0.04)] ${overdue ? "border-[#e6c7b6]" : "border-[#d9e3e8]"}`}>
      <div className="flex items-center gap-2">
        <Link to={`/portal/projetos/${project.id}`} className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5681a0] hover:text-[#0b2340]">{project.id} · {project.company}</Link>
        {project.demo && <DemoBadge className="ml-auto" />}
      </div>
      <p className="mt-2 text-[14px] font-semibold leading-5 text-[#17394f]">{task.title}</p>
      <div className="mt-2.5 space-y-1 text-[12.5px] text-[#607989]">
        <p><strong className="font-semibold text-[#31566d]">Responsável:</strong> {task.assigneeName || "Não delegada"}</p>
        <p className={overdue ? "font-semibold text-[#a0522d]" : dueSoon ? "font-semibold text-[#8b733b]" : ""}><strong className="font-semibold text-[#31566d]">Prazo:</strong> {formatIsoDate(task.dueDate)}{overdue ? " · atrasada" : ""}</p>
        <p><strong className="font-semibold text-[#31566d]">Horas:</strong> {formatHours(task.spentHours)} de {formatHours(task.plannedHours)}</p>
      </div>
      {!project.closed && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#e3eaee] pt-3">
          <select aria-label="Status" value={task.status} onChange={event => onStatus(event.target.value)} className="internal-ctl h-8 rounded-[9px] border border-[#ccdbe3] bg-[#f8fafb] px-2 text-[12px] font-semibold text-[#294e64]">
            {TASK_STATUSES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <button type="button" className={`${linkButton} ml-auto`} onClick={onEdit}>Editar</button>
          {task.assigneeId && <button type="button" className={`${linkButton}`} onClick={onTime}>Horas</button>}
        </div>
      )}
    </article>
  );
}
