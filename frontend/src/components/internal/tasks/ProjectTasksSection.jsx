import { useState } from "react";
import { Link } from "react-router-dom";
import { RequestDetailSection } from "../RequestDetailSection";
import { addTimeEntry, createTask, deleteTask, deleteTimeEntry, updateTask } from "../../../services/taskApi";
import { ConfirmModal, HoursSummary, TaskEditorModal, TaskStatusBadge, TimeEntryModal } from "./TaskUi";
import { ROLE_TITLES, TASK_STATUSES, formatHours, formatIsoDate, isTaskOverdue, linkButton } from "./taskUtils";

/**
 * Tarefas do projeto: o Administrador cria e delega; o responsável muda o status e aponta horas.
 * A soma das horas apontadas alimenta o bloco B (realizado) do Registro de Serviço.
 */
export function ProjectTasksSection({ eyebrow = "02", project, isAdmin, userId, locked, members, onChange, onFeedback }) {
  const [editor, setEditor] = useState(null);
  const [timeTask, setTimeTask] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState("");
  const tasks = project.tasks || [];
  const done = tasks.filter(task => task.status === "DONE").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const mine = task => Boolean(userId) && task.assigneeId === userId;

  async function run(action, message) {
    setError("");
    try { const next = await action(); onChange(next); if (message) onFeedback?.(message); return next; }
    catch (reason) { setError(reason.message); throw reason; }
  }

  return (
    <RequestDetailSection eyebrow={eyebrow} title="Tarefas e horas"
      description={isAdmin ? "Delegue as tarefas para a equipe e acompanhe horas orçadas, planejadas e gastas." : "Suas tarefas neste projeto. Atualize o status e aponte as horas gastas."}
      action={isAdmin && !locked ? <button type="button" className="internal-ctl rounded-[11px] bg-[#096ab2] px-4 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#075b99]" onClick={() => setEditor({ task: null })}>Nova tarefa</button> : null}>
      <HoursSummary budget={project.budgetHours} planned={project.plannedHours} spent={project.spentHours} />

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718895]">Progresso</p>
          <p className="mt-1 text-sm font-semibold text-[#31566d]">{done} de {tasks.length} tarefas concluídas</p>
        </div>
        <p className="text-2xl font-semibold text-[#096ab2]">{progress}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e2e9ed]"><div className="h-full rounded-full bg-[#1684c5] transition-all duration-300" style={{ width: `${progress}%` }} /></div>

      {error && <p role="alert" className="mt-4 rounded-[12px] border border-[#e6c7c0] bg-[#fbefec] px-4 py-3 text-[13px] text-[#8b4a3c]">{error}</p>}

      <div className="mt-5 space-y-3">
        {tasks.length === 0 && <div className="rounded-[15px] border border-dashed border-[#cad9e1] bg-[#f8fafb] px-5 py-8 text-center text-[13px] text-[#7c909b]">Nenhuma tarefa cadastrada.</div>}
        {tasks.map(task => {
          const canWork = !locked && (isAdmin || mine(task));
          const overdue = isTaskOverdue(task);
          const open = expanded[task.id];
          return (
            <article key={task.id} className={`rounded-[16px] border px-4 py-4 transition sm:px-5 ${task.status === "DONE" ? "border-[#bad7c5] bg-[#f3f9f5]" : mine(task) ? "border-[#9fc3d8] bg-[#f4f9fc]" : "border-[#d9e3e8] bg-[#f8fafb]"}`}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-[14px] font-semibold ${task.status === "DONE" ? "text-[#557767]" : "text-[#17394f]"}`}>{task.title}</p>
                    <TaskStatusBadge status={task.status} />
                    {mine(task) && <span className="rounded-full bg-[#dcebf4] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#2d6488]">Minha</span>}
                  </div>
                  {task.description && <p className="mt-1.5 text-[13px] leading-5 text-[#6d8390]">{task.description}</p>}
                  <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-[#607989]">
                    <span><strong className="font-semibold text-[#31566d]">Responsável:</strong> {task.assigneeName ? `${task.assigneeName}${task.assigneeName !== ROLE_TITLES[task.assigneeRole] ? ` · ${ROLE_TITLES[task.assigneeRole]}` : ""}` : "Não delegada"}</span>
                    <span className={overdue ? "font-semibold text-[#a0522d]" : ""}><strong className="font-semibold text-[#31566d]">Prazo:</strong> {formatIsoDate(task.dueDate)}{overdue ? " · atrasada" : ""}</span>
                    <span><strong className="font-semibold text-[#31566d]">Horas:</strong> {formatHours(task.spentHours)} de {formatHours(task.plannedHours)}</span>
                  </div>
                </div>
                {canWork && (
                  <select aria-label="Status da tarefa" value={task.status} className="internal-ctl h-9 rounded-[10px] border border-[#ccdbe3] bg-white px-3 text-[12.5px] font-semibold text-[#294e64]"
                    onChange={event => run(() => updateTask(project.id, task.id, { status: event.target.value }), "Status da tarefa atualizado.").catch(() => {})}>
                    {TASK_STATUSES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#e3eaee] pt-3">
                {canWork && task.assigneeId && <button type="button" className={linkButton} onClick={() => setTimeTask(task)}>Apontar horas</button>}
                {task.entries?.length > 0 && <button type="button" className={linkButton} onClick={() => setExpanded(current => ({ ...current, [task.id]: !open }))}>{open ? "Ocultar" : "Ver"} apontamentos ({task.entries.length})</button>}
                {isAdmin && !locked && <button type="button" className={linkButton} onClick={() => setEditor({ task })}>Editar / delegar</button>}
                {isAdmin && !locked && !task.entries?.length && <button type="button" className="internal-ctl text-[12px] font-semibold uppercase tracking-[0.08em] text-[#a0522d] transition hover:text-[#7a3b1d]" onClick={() => setConfirm(task)}>Remover</button>}
              </div>
              {open && (
                <ul className="mt-3 divide-y divide-[#e3eaee] rounded-[12px] border border-[#e1e9ee] bg-white">
                  {task.entries.map(entry => (
                    <li key={entry.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5 text-[12.5px] text-[#526d7c]">
                      <span className="font-semibold text-[#17394f]">{formatHours(entry.hours)}</span>
                      <span>{formatIsoDate(entry.date)}</span>
                      <span>{entry.userName}</span>
                      {entry.note && <span className="min-w-0 flex-1 text-[#7c909b]">{entry.note}</span>}
                      {!locked && (isAdmin || entry.userId === userId) && (
                        <button type="button" className="internal-ctl ml-auto text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#a0522d]" onClick={() => run(() => deleteTimeEntry(project.id, task.id, entry.id), "Apontamento removido.").catch(() => {})}>Excluir</button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-[14px] border border-[#cbdde6] bg-[#edf6fa] p-4 text-[12.5px] leading-5 text-[#5f7886]">
        As horas apontadas são somadas no <strong className="font-semibold text-[#31566d]">Registro de Serviço</strong> {project.recordCode ? <Link className="font-semibold text-[#096ab2] hover:underline" to={`/portal/conhecimento/registros/${project.recordCode}`}>{project.recordCode}</Link> : "do orçamento"} e preenchem o realizado (bloco B). O projeto só é concluído com todas as tarefas concluídas e o registro fechado.
      </div>

      {editor && (
        <TaskEditorModal task={editor.task} members={members} onClose={() => setEditor(null)}
          onSave={async data => {
            const payload = { title: data.title, description: data.description, assigneeId: data.assigneeId, dueDate: data.dueDate, plannedHours: data.plannedHours };
            if (editor.task) await run(() => updateTask(project.id, editor.task.id, { ...payload, status: data.status }), "Tarefa atualizada.");
            else await run(() => createTask(project.id, payload), "Tarefa delegada.");
            setEditor(null);
          }} />
      )}
      {timeTask && (
        <TimeEntryModal task={timeTask} onClose={() => setTimeTask(null)}
          onSave={async data => { await run(() => addTimeEntry(project.id, timeTask.id, data), "Horas registradas."); setTimeTask(null); }} />
      )}
      {confirm && (
        <ConfirmModal eyebrow="Remover tarefa" title={confirm.title} description="A tarefa ainda não tem horas apontadas e será removida do projeto." confirmLabel="Remover"
          onCancel={() => setConfirm(null)} onConfirm={async () => { await run(() => deleteTask(project.id, confirm.id), "Tarefa removida."); setConfirm(null); }} />
      )}
    </RequestDetailSection>
  );
}
