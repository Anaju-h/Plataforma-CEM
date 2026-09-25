import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatHours } from "../../../components/internal/tasks/taskUtils";
import { getTaskBoard } from "../../../services/taskApi";

/** Resumo da delegação da equipe no Meu trabalho do Administrador. */
export function TeamTasksStrip() {
  const [totals, setTotals] = useState(null);
  useEffect(() => {
    let active = true;
    getTaskBoard().then(board => { if (active) setTotals(board.totals); }).catch(() => {});
    return () => { active = false; };
  }, []);
  if (!totals) return null;
  const items = [
    ["Abertas", totals.open],
    ["Atrasadas", totals.overdue, totals.overdue > 0],
    ["Planejadas", formatHours(totals.plannedHours)],
    ["Gastas", formatHours(totals.spentHours)],
  ];
  return (
    <section className="mt-6 flex flex-wrap items-center gap-4 rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-5 sm:p-6">
      <div className="min-w-[220px] flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">Delegação da equipe</p>
        <p className="mt-1.5 text-[14px] leading-6 text-[#31566d]">Tarefas da equipe e horas apontadas nos projetos.</p>
      </div>
      <div className="grid flex-[2] grid-cols-2 gap-3 md:grid-cols-4">
        {items.map(([label, value, alert]) => (
          <div key={label} className="rounded-[14px] bg-white/80 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#718895]">{label}</p>
            <p className={`mt-1 text-xl font-semibold ${alert ? "text-[#a0522d]" : "text-[#17394f]"}`}>{value}</p>
          </div>
        ))}
      </div>
      <Link to="/portal/tarefas" className="rounded-[12px] bg-[#12364e] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#0b2340]">Quadro de tarefas</Link>
    </section>
  );
}
