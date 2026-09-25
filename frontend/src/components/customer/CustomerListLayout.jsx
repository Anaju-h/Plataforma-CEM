import { CustomerApiState } from "./CustomerApiState";

const grid = "grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1fr)]";

export function CustomerListLayout({ company, title, description, action, children }) {
  return <div className="mx-auto w-full min-w-0 max-w-[1180px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10">
    <header className="flex min-h-[104px] flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <p className="break-words text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0057b8]">{company}</p>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#071f2d]">{title}</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#6e7981]">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
    {children}
  </div>;
}

export function CustomerListPanel({ columns, state, emptyTitle, emptyDescription, children }) {
  return <section aria-label="Listagem" className="mt-8 min-h-[300px] overflow-hidden rounded-[14px] border border-[#dfe6ea] bg-white shadow-[0_8px_24px_rgba(7,31,45,0.03)]">
    <div className={`${grid} border-b border-[#e5eaed] bg-[#f8fafb] px-6 py-3`} aria-hidden="true">
      {columns.map((column, index) => <span key={column} className={`text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8b969e] ${index ? "hidden md:block" : ""}`}>{column}</span>)}
    </div>
    {state.loading || state.error ? <div className="flex min-h-[248px] items-center justify-center p-6 text-center text-[14px] text-[#6e7981]"><CustomerApiState {...state} /></div>
      : !state.data?.length ? <CustomerEmptyState title={emptyTitle} description={emptyDescription} />
      : <div className="divide-y divide-[#edf1f3]">{children}</div>}
  </section>;
}

function CustomerEmptyState({ title, description }) {
  return <div className="flex min-h-[248px] flex-col items-center justify-center px-6 py-10 text-center" role="status">
    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#eef5fb] text-[#7e9eb3]">
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l4 4v14H5V3h2Z" /><path d="M14 3v5h4M8 12h7M8 16h5" /></svg>
    </span>
    <h2 className="text-[15px] font-semibold text-[#344e60]">{title}</h2>
    <p className="mt-2 max-w-[360px] text-[13px] leading-6 text-[#7b8d99]">{description}</p>
  </div>;
}

export function CustomerListRow({ children, details }) {
  return <article className="min-w-0 px-6 py-5">
    <div className={`${grid} items-start [&>div]:min-w-0 [&>div]:break-words`}>{children}</div>
    {details}
  </article>;
}

// tone vem do backend: action (requer o cliente), progress, done, closed.
const TONES = {
  action: "bg-[#fff4e0] text-[#8a5a00]",
  progress: "bg-[#eef5fb] text-[#0057b8]",
  done: "bg-[#edf8f2] text-[#16704a]",
  closed: "bg-[#f1f3f5] text-[#5f6b73]",
};
export function CustomerStatus({ children, tone = "progress" }) {
  return <span className={`inline-flex max-w-full rounded-full px-3 py-1.5 text-[12px] font-semibold ${TONES[tone] || TONES.progress}`}>{children}</span>;
}
