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
          <p className="internal-eyebrow font-semibold uppercase text-[#4f758a]">
            {eyebrow}
          </p>
        )}

        <h1 className="internal-page-title mt-2 font-semibold text-[#071f2d]">
          {title}
        </h1>

        {description && (
          <p className="internal-page-description mt-2 max-w-3xl text-[#526d7c]">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}