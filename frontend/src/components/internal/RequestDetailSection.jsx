export function RequestDetailSection({
  eyebrow,
  title,
  description,
  action,
  children,
}) {
  return (
    <section
      className="
        rounded-[22px]
        border
        border-[#cddbe3]
        bg-white
        p-5
        shadow-[0_10px_30px_rgba(7,31,45,0.03)]
        sm:p-6
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-[#dfe7eb]
          pb-5
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div>
          {eyebrow && (
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.13em]
                text-[#4d7489]
              "
            >
              {eyebrow}
            </p>
          )}

          <h2
            className="
              mt-1.5
              text-[18px]
              font-semibold
              tracking-[-0.025em]
              text-[#17384d]
            "
          >
            {title}
          </h2>

          {description && (
            <p
              className="
                mt-1.5
                max-w-3xl
                text-[12px]
                leading-5
                text-[#5b7584]
              "
            >
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
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
  highlight = false,
}) {
  return (
    <div>
      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.09em]
          text-[#5c7888]
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1.5
          whitespace-pre-line
          text-[13px]
          font-medium
          leading-6

          ${
            highlight
              ? "text-[#0057b8]"
              : "text-[#294e64]"
          }
        `}
      >
        {formatValue(
          value,
        )}
      </p>
    </div>
  );
}

function formatValue(
  value,
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Não informado";
  }

  return value;
}