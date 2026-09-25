export const TASK_STATUSES = [
  { value: "TODO", label: "A fazer" },
  { value: "DOING", label: "Em andamento" },
  { value: "DONE", label: "Concluída" },
];
export const TASK_STATUS_LABELS = Object.fromEntries(TASK_STATUSES.map(item => [item.value, item.label]));
export const TASK_STATUS_STYLES = {
  TODO: "border-[#c8d7e3] bg-[#edf3f8] text-[#526f86]",
  DOING: "border-[#bcd6e5] bg-[#eaf4fa] text-[#34749b]",
  DONE: "border-[#b7d8c4] bg-[#e8f5ed] text-[#397250]",
};
export const ROLE_TITLES = { CONSULTA: "Consulta", TECNICO: "Técnico", VALIDADOR: "Validador", ADMIN: "Administrador" };

export function formatHours(value) {
  if (value === null || value === undefined || value === "") return "—";
  return `${Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} h`;
}
export function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function formatIsoDate(value, empty = "Sem prazo") {
  if (!value) return empty;
  const [year, month, day] = String(value).slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}
export const isTaskOverdue = task => task.status !== "DONE" && Boolean(task.dueDate) && task.dueDate < todayIso();
export const inputClass = "internal-field-value mt-2 h-11 w-full rounded-[12px] border border-[#ccdbe3] bg-[#f8fafb] px-3 text-[#294e64] outline-none transition focus:border-[#78a9c4] focus:bg-white";
export const labelClass = "internal-field-label block text-[#607989]";
export const primaryButton = "internal-ctl rounded-[11px] bg-[#096ab2] px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#075b99] disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryButton = "internal-ctl rounded-[11px] ring-1 ring-inset ring-[#d0dce3] bg-white px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#607989] transition hover:ring-[#aec8d5] disabled:cursor-not-allowed disabled:opacity-60";
export const linkButton = "internal-ctl text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#096ab2] transition hover:text-[#0b2340] disabled:cursor-not-allowed disabled:opacity-50";
