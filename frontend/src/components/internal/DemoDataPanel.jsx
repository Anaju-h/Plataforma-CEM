import { useEffect, useState } from "react";
import { DemoBadge } from "./DemoBadge";
import { ConfirmModal } from "./tasks/TaskUi";
import { primaryButton, secondaryButton } from "./tasks/taskUtils";
import { loadDemoData } from "../../services/demoDataLoader";
import { getDemoDataStatus, removeDemoData } from "../../services/taskApi";

const panelClass = "rounded-[22px] border border-[#cbdbe5] bg-white/85 p-6 shadow-[0_12px_32px_rgba(7,31,45,0.04)]";

/** Carrega e remove os dados de demonstração. A remoção mostra a contagem real antes e depois (prova de integridade). */
export function DemoDataPanel() {
  const [status, setStatus] = useState(null);
  const [retry, setRetry] = useState(0);
  const [progress, setProgress] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [proof, setProof] = useState(null);

  useEffect(() => {
    let active = true;
    getDemoDataStatus().then(value => { if (active) setStatus(value); }).catch(reason => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [retry]);

  const hasDemo = status && (status.demoRequests > 0 || status.demoRecords > 0);
  const tiles = status ? [
    ["SOL/ORC/PRJ demo", `${status.demoRequests} / ${status.demoProjects} PRJ`],
    ["Tarefas demo", status.demoTasks],
    ["Registros e lições demo", `${status.demoRecords} / ${status.demoLessons}`],
    ["Dados reais preservados", `${status.realRequests} SOL · ${status.realProjects} PRJ · ${status.realRecords} REG`],
  ] : [];

  async function load() {
    setBusy(true); setError(""); setProof(null);
    try { await loadDemoData(setProgress); setRetry(value => value + 1); }
    catch (reason) { setError(reason.message); setRetry(value => value + 1); }
    finally { setBusy(false); }
  }

  return (
    <section className={panelClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[760px]">
          <div className="flex items-center gap-2"><h2 className="internal-section-title font-semibold text-[#17394f]">Dados de demonstração</h2><DemoBadge /></div>
          <p className="internal-body mt-2 text-[#526d7c]">
            Projetos fictícios com tarefas delegadas ao Técnico e ao Validador, horas apontadas, registros fechados e lições formalizadas.
            Mostram o ciclo completo (tarefas → horas → Registro de Serviço → lição → Assistente) sem misturar com os serviços reais: tudo aparece com a etiqueta DEMO e é removido em uma ação.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={primaryButton} disabled={busy || !status || hasDemo} onClick={load}>{busy ? "Carregando..." : "Carregar demonstração"}</button>
          <button type="button" className={secondaryButton} disabled={busy || !hasDemo} onClick={() => setConfirm(true)}>Remover demonstração</button>
        </div>
      </div>

      {status && <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(([label, value]) => <div key={label} className="rounded-[14px] bg-[#edf5f9] p-4"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718895]">{label}</p><p className="mt-1.5 text-lg font-semibold text-[#17394f]">{value}</p></div>)}
      </div>}

      {busy && progress && <p role="status" className="mt-4 rounded-[12px] border border-[#cbdde6] bg-[#edf6fa] px-4 py-3 text-[13px] text-[#34505f]">{progress}</p>}
      {error && <p role="alert" className="mt-4 rounded-[12px] border border-[#e6c7c0] bg-[#fbefec] px-4 py-3 text-[13px] text-[#8b4a3c]">{error}</p>}
      {proof && (
        <div className="mt-4 rounded-[14px] border border-[#bad7c5] bg-[#eef7f1] px-4 py-3 text-[13px] leading-6 text-[#315f45]">
          <p className="font-semibold">Demonstração removida. Prova de integridade:</p>
          <p>Antes: {proof.before.realRequests} SOL · {proof.before.realProjects} PRJ · {proof.before.realRecords} registros reais.</p>
          <p>Depois: {proof.after.realRequests} SOL · {proof.after.realProjects} PRJ · {proof.after.realRecords} registros reais.</p>
        </div>
      )}

      {confirm && (
        <ConfirmModal eyebrow="Dados de demonstração" title="Remover toda a demonstração?"
          description="Apaga somente o que tem a etiqueta DEMO (SOL, ORC, PRJ, tarefas, horas, registros e lições). Os serviços reais não são alterados."
          confirmLabel="Remover" onCancel={() => setConfirm(false)}
          onConfirm={async () => { const result = await removeDemoData(); setProof(result); setConfirm(false); setRetry(value => value + 1); }} />
      )}
    </section>
  );
}
