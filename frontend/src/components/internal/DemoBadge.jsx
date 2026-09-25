/** Marca visual de dado de demonstração (SOL/ORC/PRJ, tarefas, registros e lições). Dados reais não têm etiqueta. */
export function DemoBadge({ className = "" }) {
  return (
    <span title="Dado de demonstração: fictício, removível na Administração e sem afetar dados reais."
      className={`inline-flex shrink-0 items-center rounded-full border border-[#d9cdf2] bg-[#f3eefc] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#5b3aa5] ${className}`}>
      Demo
    </span>
  );
}
