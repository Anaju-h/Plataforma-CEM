import { btn, classLabel, inputClass, termsOf } from "./kmUtils";

// Componentes visuais compartilhados do módulo de Gestão do Conhecimento.

export function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`rounded-[18px] border border-[#d1dde4] bg-white p-5 shadow-[0_10px_30px_rgba(34,67,90,0.025)] ${className}`}>
      {(title || action) && <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>{title && <h2 className="text-[15px] font-semibold text-[#071f2d]">{title}</h2>}{subtitle && <p className="mt-1 text-[13px] leading-5 text-[#526d7c]">{subtitle}</p>}</div>
        {action}
      </div>}
      {children}
    </section>
  );
}

const PILL = {
  blue: "bg-[#eaf3fb] text-[#0b5ea8]", green: "bg-[#e8f6ee] text-[#17704a]", amber: "bg-[#fff3dc] text-[#8a5a00]",
  red: "bg-[#fbecea] text-[#9a3b2b]", gray: "bg-[#eef2f4] text-[#526d7c]", purple: "bg-[#f1ecfb] text-[#5b3aa5]",
};
export function Pill({ tone = "gray", children, title }) {
  return <span title={title} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${PILL[tone] || PILL.gray}`}>{children}</span>;
}
export function RestrictedTag({ value }) {
  return value === "RESTRICTED" ? <Pill tone="red" title="Visível apenas para Validador e Administrador">RESTRITO</Pill> : null;
}
export function ErrorBox({ children }) {
  if (!children) return null;
  return <p role="alert" className="rounded-[12px] border border-[#e3c5bc] bg-[#faf0ed] px-4 py-3 text-[13px] text-[#8f5544]">{children}</p>;
}
export function SuccessBox({ children }) {
  if (!children) return null;
  return <p role="status" className="rounded-[12px] bg-[#e8f6ee] px-4 py-3 text-[13px] text-[#17704a]">{children}</p>;
}
export function Loading({ state, children }) {
  if (state.loading && !state.data) return <p className="py-10 text-center text-[14px] text-[#526d7c]">Carregando…</p>;
  if (state.error && !state.data) return <div className="space-y-3 py-6"><ErrorBox>{state.error}</ErrorBox><button type="button" className={btn("secondary")} onClick={state.reload}>Tentar novamente</button></div>;
  return children;
}

export function Label({ label, hint, children, required }) {
  return (
    <label className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#4f6b7b]">
      {label}{required && <span className="text-[#9a3b2b]"> *</span>}
      {children}
      {hint && <span className="mt-1 block text-[12px] font-normal normal-case tracking-normal text-[#7b8f9a]">{hint}</span>}
    </label>
  );
}

export function TermSelect({ vocabulary, classCode, value, onChange, required, placeholder = "Selecione" }) {
  return (
    <Label label={classLabel(vocabulary, classCode)} required={required}>
      <select className={inputClass} value={value || ""} required={required} onChange={event => onChange(event.target.value || null)}>
        <option value="">{required ? placeholder : "Não se aplica / não informado"}</option>
        {termsOf(vocabulary, classCode).map(term => <option key={term.id} value={term.id}>{term.label}</option>)}
      </select>
    </Label>
  );
}

export function TermChips({ vocabulary, classCode, values, onChange, label, required }) {
  const selected = new Set(values || []);
  const toggle = id => { const next = new Set(selected); if (next.has(id)) next.delete(id); else next.add(id); onChange([...next]); };
  return (
    <fieldset>
      <legend className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#4f6b7b]">{label || classLabel(vocabulary, classCode)}{required && <span className="text-[#9a3b2b]"> *</span>}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {termsOf(vocabulary, classCode).map(term => (
          <button key={term.id} type="button" aria-pressed={selected.has(term.id)} onClick={() => toggle(term.id)} title={term.description || undefined}
            className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${selected.has(term.id) ? "border-[#096ab2] bg-[#096ab2] text-white" : "border-[#d7e1e7] bg-white text-[#34505f] hover:border-[#8fb3c8]"}`}>
            {term.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Stat({ label, value, hint, tone }) {
  return (
    <div className={`rounded-[14px] border p-4 ${tone === "accent" ? "border-[#b9d6ec] bg-[#f1f7fc]" : "border-[#e2e9ee] bg-[#fafcfd]"}`}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5f7c8c]">{label}</p>
      <p className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#071f2d]">{value}</p>
      {hint && <p className="mt-1 text-[13px] leading-5 text-[#6a808d]">{hint}</p>}
    </div>
  );
}
