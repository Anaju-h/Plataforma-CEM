import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { Container } from "../layout/Container";
import { ArrowRightIcon } from "../ui/ArrowIcons";
import { EQUIPMENT_SPECS_NOTE, getEquipmentSpecs } from "../../data/equipmentSpecs";
import {
  COMPARISON_ROWS,
  equipmentComparison,
  MAX_COMPARED,
  MIN_COMPARED,
} from "../../data/equipmentComparison";
import { COMPARATOR_ID, useComparisonSelection } from "./comparisonSelection";

/**
 * Comparador de equipamentos: 2 ou 3 máquinas lado a lado.
 * Camada 1 — as mesmas perguntas para todas (linhas comparáveis).
 * Camada 2 — ficha do fabricante de cada uma, sem forçar alinhamento entre grandezas diferentes.
 */
export function EquipmentComparator({ equipment }) {
  const [selected, setSelected] = useComparisonSelection();
  const [notice, setNotice] = useState(null);

  const machines = selected.map(id => equipment.find(item => item.id === id)).filter(Boolean);
  const valueOf = (machine, key) => equipmentComparison[machine.id]?.[key] ?? "—";


  function toggle(id) {
    setNotice(null);
    if (selected.includes(id)) {
      if (selected.length <= MIN_COMPARED) { setNotice({ tone: "warn", text: `Mantenha pelo menos ${MIN_COMPARED} equipamentos para comparar.` }); return; }
      setSelected(selected.filter(item => item !== id));
      return;
    }
    if (selected.length >= MAX_COMPARED) { setNotice({ tone: "warn", text: `Compare até ${MAX_COMPARED} equipamentos por vez. Desmarque um para trocar.` }); return; }
    setSelected([...selected, id]);
  }

  const columns = { gridTemplateColumns: `minmax(150px,0.8fr) repeat(${machines.length}, minmax(200px,1fr))` };

  return (
    <section id={COMPARATOR_ID} className="scroll-mt-[110px] pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-14 lg:pt-12">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-12">
          <div>
            <div className="flex items-center gap-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
                Comparador
              </p>
              <div className="h-px w-10 bg-[#65b8ee]" />
            </div>
            <h2 className="mt-4 max-w-[560px] text-[2.3rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[#071f2d] sm:text-[3rem]">
              Compare os equipamentos
              <br />
              <span className="text-[#356f9f]">lado a lado.</span>
            </h2>
          </div>
          <p className="max-w-[560px] text-[15px] leading-6 text-[#607583] sm:text-[16px]">
            Escolha 2 ou 3 máquinas. Cada uma responde às mesmas perguntas;
            os dados técnicos do fabricante ficam logo abaixo.
          </p>
        </div>

        {/* SELEÇÃO */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          {equipment.map(item => {
            const active = selected.includes(item.id);
            const blocked = !active && selected.length >= MAX_COMPARED;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(item.id)}
                className={`internal-ctl inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold ring-1 ring-inset transition-all duration-300 ${
                  active
                    ? "bg-[#12364e] text-white ring-[#12364e] shadow-[0_8px_20px_rgba(18,54,78,0.16)]"
                    : blocked
                      ? "cursor-not-allowed bg-white/40 text-[#9aabb5] ring-[#d6e2e8]"
                      : "bg-white/60 text-[#31566d] ring-[#c9dae3] hover:bg-white hover:ring-[#91b5c7]"
                }`}
              >
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${active ? "bg-white text-[#12364e]" : "ring-1 ring-inset ring-[#b7cbd6]"}`}>
                  {active ? "✓" : ""}
                </span>
                {item.shortName ?? item.name}
              </button>
            );
          })}
        </div>

        <p role="status" className={`mt-3 min-h-[20px] break-all text-[12.5px] ${notice?.tone === "warn" ? "text-[#a4452f]" : "text-[#356f9f]"}`}>
          {notice?.text}
        </p>

        {/* CAMADA 1 — LINHAS COMPARÁVEIS */}
        <motion.div
          key={selected.join(",")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 overflow-x-auto rounded-[24px] border border-white/72 bg-white/52 shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_14px_40px_rgba(7,31,45,0.05)] backdrop-blur-[20px]"
        >
          <div style={{ minWidth: `${150 + machines.length * 210}px` }} role="table" aria-label="Comparação de equipamentos">
            <div role="row" className="grid border-b border-[#dce8ed]" style={columns}>
              <div role="columnheader" className="sticky left-0 z-10 bg-[#f4f8fa]/95 px-5 py-5 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#8ba0ac] backdrop-blur-[12px]">
                Equipamento
              </div>
              {machines.map(machine => (
                <div role="columnheader" key={machine.id} className="flex items-center gap-3 px-5 py-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-[#e7f0f4]">
                    <img src={machine.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-5 text-[#071f2d]">{machine.name}</p>
                    <p className="mt-0.5 text-[12px] text-[#6f8795]">{machine.category}</p>
                  </div>
                </div>
              ))}
            </div>

            {COMPARISON_ROWS.map(row => (
              <div role="row" key={row.key} className="grid border-b border-[#dce8ed]/70" style={columns}>
                <div role="rowheader" className="sticky left-0 z-10 bg-[#f4f8fa]/95 px-5 py-4 text-[12.5px] font-semibold text-[#31566d] backdrop-blur-[12px]">
                  {row.label}
                </div>
                {machines.map(machine => (
                  <div role="cell" key={machine.id} className={`px-5 py-4 text-[14px] leading-6 ${row.key === "bestFor" ? "font-semibold text-[#12364e]" : "text-[#4d6b7c]"}`}>
                    {valueOf(machine, row.key)}
                  </div>
                ))}
              </div>
            ))}

            <div role="row" className="grid" style={columns}>
                <div role="rowheader" className="sticky left-0 z-10 bg-[#f4f8fa]/95 px-5 py-4 text-[12.5px] font-semibold text-[#31566d] backdrop-blur-[12px]">
                  Serviços
                </div>
                {machines.map(machine => (
                  <div role="cell" key={machine.id} className="flex flex-wrap gap-2 px-5 py-4">
                    {(machine.services ?? []).map(service => (
                      <Link
                        key={service.label}
                        to={service.href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f1f6] px-3 py-1.5 text-[12px] font-semibold text-[#356f9f] transition-colors hover:bg-[#d9eaf2]"
                      >
                        {service.label}
                        <ArrowRightIcon className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* CAMADA 2 — FICHA DO FABRICANTE */}
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#8ba0ac]">
            Ficha do fabricante
          </p>
          <div className={`mt-3 grid gap-3 ${machines.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {machines.map(machine => (
              <div key={machine.id} className="rounded-[18px] border border-white/72 bg-white/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-[16px]">
                <p className="text-[14px] font-semibold text-[#12364e]">{machine.name}</p>
                <dl className="mt-3 space-y-2.5">
                  {(getEquipmentSpecs(machine.id)?.specs ?? []).map(spec => (
                    <div key={spec.label}>
                      <dt className="text-[11.5px] font-medium text-[#7f96a3]">{spec.label}</dt>
                      <dd className="text-[13.5px] font-semibold text-[#31566d]">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-5 text-[#8aa0ad]">{EQUIPMENT_SPECS_NOTE}</p>
        </div>

      </Container>
    </section>
  );
}
