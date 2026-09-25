import { useEffect, useState } from "react";

// Utilitários (não-componentes) do módulo de Gestão do Conhecimento.

// Carrega dados da API; recarrega quando `deps` (valores simples) mudam ou quando reload() é chamado.
export function useLoad(loader, deps = []) {
  const key = JSON.stringify(deps);
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    loader().then(data => { if (active) setState({ data, loading: false, error: "" }); })
      .catch(error => { if (active) setState(current => ({ data: current.data, loading: false, error: error.message })); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);
  return { ...state, reload: () => setAttempt(value => value + 1), setData: data => setState(current => ({ ...current, data })) };
}

export const fmt = {
  hours: value => value === null || value === undefined ? "—" : `${Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} h`,
  pct: (value, digits = 0) => value === null || value === undefined ? "—" : `${(Number(value) * 100).toLocaleString("pt-BR", { maximumFractionDigits: digits, minimumFractionDigits: digits })}%`,
  signedPct: value => value === null || value === undefined ? "—" : `${value > 0 ? "+" : ""}${(Number(value) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%`,
  money: value => value === null || value === undefined ? "—" : Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  date: value => {
    if (!value) return "—";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value.split("-").reverse().join("/");
    const date = new Date(/[Z+-]\d*:?\d*$/.test(String(value).slice(10)) ? value : `${String(value).slice(0, 19)}Z`);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  },
};

export const LESSON_TONES = { DRAFT: "gray", IN_VALIDATION: "amber", FORMALIZED: "green", SUPERSEDED: "red" };
export const CONFIDENCE_TONES = { NONE: "gray", LOW: "amber", MEDIUM: "blue", HIGH: "green" };

export function btn(kind = "primary") {
  const base = "inline-flex items-center justify-center gap-2 rounded-[11px] px-4 py-2.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55";
  if (kind === "secondary") return `${base} border border-[#cbd9e1] bg-white text-[#17394f] hover:border-[#8fb3c8]`;
  if (kind === "danger") return `${base} bg-[#9a3b2b] text-white hover:bg-[#82301f]`;
  if (kind === "success") return `${base} bg-[#17704a] text-white hover:bg-[#115c3c]`;
  return `${base} bg-[#096ab2] text-white hover:bg-[#075b99]`;
}
export const inputClass = "mt-1.5 h-10 w-full rounded-[10px] border border-[#d7e1e7] bg-[#f9fbfc] px-3 text-[14px] text-[#17394f] outline-none transition focus:border-[#76a9c7] focus:bg-white";
export const areaClass = "mt-1.5 min-h-[90px] w-full rounded-[10px] border border-[#d7e1e7] bg-[#f9fbfc] px-3 py-2 text-[14px] leading-6 text-[#17394f] outline-none transition focus:border-[#76a9c7] focus:bg-white";

export function termsOf(vocabulary, classCode, { includeInactive = false } = {}) {
  const found = vocabulary?.classes?.find(item => item.code === classCode);
  return (found?.terms || []).filter(term => includeInactive || term.active);
}
export function classLabel(vocabulary, classCode) {
  return vocabulary?.classes?.find(item => item.code === classCode)?.label || classCode;
}

