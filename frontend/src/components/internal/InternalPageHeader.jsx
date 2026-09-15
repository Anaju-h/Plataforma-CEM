export function InternalPageHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4f758a]">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-[#071f2d] sm:text-[34px]">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-3xl text-[13px] leading-6 text-[#526d7c] sm:text-[14px]">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}