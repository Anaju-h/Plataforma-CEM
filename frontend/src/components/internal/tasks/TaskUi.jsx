import { useState } from "react";
import { ROLE_TITLES, TASK_STATUSES, TASK_STATUS_LABELS, TASK_STATUS_STYLES, formatHours, inputClass, labelClass, primaryButton, secondaryButton, todayIso } from "./taskUtils";

export function TaskStatusBadge({ status }) {
  return (
    <span className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${TASK_STATUS_STYLES[status] ?? TASK_STATUS_STYLES.TODO}`}>
      {TASK_STATUS_LABELS[status] ?? status}
    </span>
  );
}

/** Orçado (ORC) × planejado (tarefas) × gasto (apontamentos). */
export function HoursSummary({ budget, planned, spent, compact = false }) {
  const reference = Number(budget) > 0 ? Number(budget) : Number(planned) || 0;
  const used = Number(spent) || 0;
  const percent = reference > 0 ? Math.round((used / reference) * 100) : 0;
  const over = reference > 0 && used > reference;
  const tiles = [
    budget !== undefined && ["Horas orçadas", formatHours(budget), "Composição do orçamento (ORC)."],
    ["Horas planejadas", formatHours(planned), "Soma das horas das tarefas."],
    ["Horas gastas", formatHours(spent), "Soma dos apontamentos da equipe."],
  ].filter(Boolean);
  return (
    <div>
      <div className={`grid gap-3 ${compact ? (tiles.length === 3 ? "grid-cols-3" : "grid-cols-2") : tiles.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {tiles.map(([label, value, hint]) => (
          <div key={label} className="rounded-[14px] bg-[#edf5f9] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718895]">{label}</p>
            <p className={`mt-1.5 text-xl font-semibold ${label === "Horas gastas" && over ? "text-[#a0522d]" : "text-[#17394f]"}`}>{value}</p>
            {!compact && <p className="mt-1 text-[12px] leading-5 text-[#7c909b]">{hint}</p>}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[12px] font-semibold text-[#607989]">
          <span>Consumo das horas {Number(budget) > 0 ? "orçadas" : "planejadas"}</span>
          <span className={over ? "text-[#a0522d]" : "text-[#096ab2]"}>{percent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e2e9ed]">
          <div className={`h-full rounded-full transition-all duration-300 ${over ? "bg-[#c9772f]" : "bg-[#1684c5]"}`} style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
        {over && <p className="mt-2 text-[12px] leading-5 text-[#a0522d]">As horas gastas já passaram do orçado. Registre a causa do desvio no fechamento do Registro de Serviço.</p>}
      </div>
    </div>
  );
}

function ModalFrame({ eyebrow, title, description, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-[#071a2b]/50 px-4 py-8 backdrop-blur-[3px]" role="dialog" aria-modal="true">
      <div className="w-full max-w-[560px] rounded-[24px] border border-white/30 bg-white p-6 shadow-[0_35px_100px_rgba(7,26,43,0.25)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">{eyebrow}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#17394f]">{title}</h2>
            {description && <p className="mt-2 text-sm leading-6 text-[#708795]">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="internal-ctl flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-[#d0dce3] text-[#607989] transition hover:ring-[#aec8d5]">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Criação/edição de tarefa (Administrador). Com `projects`, permite escolher o projeto (Quadro de tarefas). */
export function TaskEditorModal({ task, members, projects, defaultProjectId, onClose, onSave }) {
  const [form, setForm] = useState({
    projectId: defaultProjectId || projects?.[0]?.id || "",
    title: task?.title || "",
    description: task?.description || "",
    assigneeId: task?.assigneeId || "",
    dueDate: task?.dueDate || "",
    plannedHours: task?.plannedHours ?? "",
    status: task?.status || "TODO",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = key => event => setForm(current => ({ ...current, [key]: event.target.value }));
  const assignable = (members || []).filter(member => member.role !== "CONSULTA");

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) { setError("Informe o título da tarefa."); return; }
    if (projects && !form.projectId) { setError("Selecione o projeto."); return; }
    setBusy(true); setError("");
    try {
      await onSave({
        projectId: form.projectId,
        title: form.title.trim(), description: form.description.trim(), assigneeId: form.assigneeId || null,
        dueDate: form.dueDate || null, plannedHours: form.plannedHours === "" ? null : Number(form.plannedHours), status: form.status,
      });
    } catch (reason) { setError(reason.message); setBusy(false); }
  }

  return (
    <ModalFrame eyebrow={task ? "Editar tarefa" : "Nova tarefa"} title={task ? task.title : "Delegar tarefa"} description="Defina o responsável, o prazo e as horas planejadas. O responsável acompanha em Meu trabalho." onClose={onClose}>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        {projects && !task && (
          <label className="block"><span className={labelClass}>Projeto</span>
            <select className={inputClass} value={form.projectId} onChange={set("projectId")} required>
              {projects.map(project => <option key={project.id} value={project.id}>{project.id} · {project.company}{project.demo ? " (demo)" : ""}</option>)}
            </select>
          </label>
        )}
        <label className="block"><span className={labelClass}>Tarefa</span>
          <input className={inputClass} value={form.title} onChange={set("title")} maxLength={250} placeholder="Ex.: Programar medição no CALYPSO" required />
        </label>
        <label className="block"><span className={labelClass}>Descrição</span>
          <textarea className={`${inputClass} h-auto py-3 leading-6`} rows={3} value={form.description} onChange={set("description")} maxLength={4000} placeholder="Orientações, entregáveis ou critérios de conclusão." />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={labelClass}>Responsável</span>
            <select className={inputClass} value={form.assigneeId} onChange={set("assigneeId")}>
              <option value="">Sem responsável</option>
              {assignable.map(member => <option key={member.id} value={member.id}>{member.name}{member.name !== ROLE_TITLES[member.role] ? ` · ${ROLE_TITLES[member.role]}` : ""}</option>)}
            </select>
          </label>
          <label className="block"><span className={labelClass}>Prazo</span>
            <input type="date" className={inputClass} value={form.dueDate} onChange={set("dueDate")} />
          </label>
          <label className="block"><span className={labelClass}>Horas planejadas</span>
            <input type="number" min="0" step="0.25" className={inputClass} value={form.plannedHours} onChange={set("plannedHours")} placeholder="0" />
          </label>
          {task && (
            <label className="block"><span className={labelClass}>Status</span>
              <select className={inputClass} value={form.status} onChange={set("status")}>
                {TASK_STATUSES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
          )}
        </div>
        {error && <p role="alert" className="rounded-[12px] border border-[#e6c7c0] bg-[#fbefec] px-4 py-3 text-[13px] text-[#8b4a3c]">{error}</p>}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={secondaryButton}>Cancelar</button>
          <button type="submit" disabled={busy} className={primaryButton}>{busy ? "Salvando..." : task ? "Salvar tarefa" : "Delegar tarefa"}</button>
        </div>
      </form>
    </ModalFrame>
  );
}

/** Apontamento de horas gastas numa tarefa. */
export function TimeEntryModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({ date: todayIso(), hours: "", note: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = key => event => setForm(current => ({ ...current, [key]: event.target.value }));
  async function submit(event) {
    event.preventDefault();
    const hours = Number(form.hours);
    if (!(hours > 0 && hours <= 24)) { setError("Informe entre 0,25 e 24 horas."); return; }
    setBusy(true); setError("");
    try { await onSave({ date: form.date, hours, note: form.note.trim() || null }); }
    catch (reason) { setError(reason.message); setBusy(false); }
  }
  return (
    <ModalFrame eyebrow="Apontar horas" title={task.title} description={`Planejado: ${formatHours(task.plannedHours)} · já apontado: ${formatHours(task.spentHours)}. As horas somadas viram o realizado do Registro de Serviço.`} onClose={onClose}>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={labelClass}>Data</span>
            <input type="date" className={inputClass} value={form.date} max={todayIso()} onChange={set("date")} required />
          </label>
          <label className="block"><span className={labelClass}>Horas gastas</span>
            <input type="number" min="0.25" max="24" step="0.25" className={inputClass} value={form.hours} onChange={set("hours")} placeholder="Ex.: 2,5" required autoFocus />
          </label>
        </div>
        <label className="block"><span className={labelClass}>O que foi feito</span>
          <input className={inputClass} value={form.note} onChange={set("note")} maxLength={500} placeholder="Ex.: Alinhamento e medição das 4 peças" />
        </label>
        {error && <p role="alert" className="rounded-[12px] border border-[#e6c7c0] bg-[#fbefec] px-4 py-3 text-[13px] text-[#8b4a3c]">{error}</p>}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={secondaryButton}>Cancelar</button>
          <button type="submit" disabled={busy} className={primaryButton}>{busy ? "Salvando..." : "Registrar horas"}</button>
        </div>
      </form>
    </ModalFrame>
  );
}

export function ConfirmModal({ eyebrow, title, description, confirmLabel, onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <ModalFrame eyebrow={eyebrow} title={title} description={description} onClose={onCancel}>
      {error && <p role="alert" className="mt-4 rounded-[12px] border border-[#e6c7c0] bg-[#fbefec] px-4 py-3 text-[13px] text-[#8b4a3c]">{error}</p>}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={secondaryButton}>Voltar</button>
        <button type="button" disabled={busy} className={primaryButton} onClick={async () => { setBusy(true); setError(""); try { await onConfirm(); } catch (reason) { setError(reason.message); setBusy(false); } }}>{busy ? "Aguarde..." : confirmLabel}</button>
      </div>
    </ModalFrame>
  );
}
