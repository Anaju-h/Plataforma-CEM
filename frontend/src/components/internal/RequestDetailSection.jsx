export function RequestDetailSection({
  eyebrow,
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 shadow-[0_10px_30px_rgba(34,67,90,0.025)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-[#e3e9ed] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow && (
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-[#17394f]">
            {title}
          </h2>

          {description && (
            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#7b8e99]">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      <div className="pt-5">
        {children}
      </div>
    </section>
  );
}

export function RequestInfoItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7c909b]">
        {label}
      </p>

      <p className="mt-1.5 whitespace-pre-line text-sm font-medium leading-6 text-[#294e64]">
        {value || "Não informado"}
      </p>
    </div>
  );
}