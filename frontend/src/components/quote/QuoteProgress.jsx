const steps = [
  {
    number: 1,
    label: "Contato",
  },
  {
    number: 2,
    label: "Necessidade",
  },
  {
    number: 3,
    label: "Projeto",
  },
  {
    number: 4,
    label: "Revisão",
  },
];

export function QuoteProgress({
  currentStep,
  maxStepReached,
  onStepChange,
}) {
  return (
    <div>
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-3">
          {steps.map((step) => {
            const active = step.number === currentStep;
            const visited = step.number <= maxStepReached;
            const completed = step.number < currentStep;

            return (
              <button
                key={step.number}
                type="button"
                disabled={!visited}
                onClick={() => {
                  if (visited) {
                    onStepChange(step.number);
                  }
                }}
                className={`
                  relative rounded-[16px]
                  px-4 py-3.5
                  text-left
                  transition-all duration-200
                  ${
                    visited
                      ? "cursor-pointer"
                      : "cursor-default"
                  }
                  ${
                    active
                      ? "bg-[#edf5fa]"
                      : visited
                        ? "hover:bg-[#f6f9fb]"
                        : ""
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-full border
                      text-[12px] font-semibold
                      transition-all duration-200
                      ${
                        active
                          ? "border-[#356f9f] bg-[#356f9f] text-white"
                          : completed
                            ? "border-[#85b3d0] bg-[#e9f3f9] text-[#356f9f]"
                            : visited
                              ? "border-[#9bbfd6] bg-white text-[#356f9f]"
                              : "border-[#d8e2e8] bg-white text-[#97a5ae]"
                      }
                    `}
                  >
                    {String(step.number).padStart(2, "0")}
                  </div>

                  <div>
                    <p
                      className={`
                        text-[11px] font-medium
                        uppercase tracking-[0.11em]
                        ${
                          active
                            ? "text-[#5687ad]"
                            : visited
                              ? "text-[#7a8e9b]"
                              : "text-[#a3afb7]"
                        }
                      `}
                    >
                      Etapa
                    </p>

                    <p
                      className={`
                        mt-0.5 text-sm font-semibold
                        transition-colors duration-200
                        ${
                          active
                            ? "text-[#0b2340]"
                            : visited
                              ? "text-[#526b7a]"
                              : "text-[#9aa8b1]"
                        }
                      `}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>

                {active && (
                  <div className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-[#5fa9df]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 h-[3px] overflow-hidden rounded-full bg-[#e1e8ec]">
          <div
            className="h-full rounded-full bg-[#4b8fbd] transition-all duration-500"
            style={{
              width: `${(currentStep / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#5687ad]">
              Etapa {String(currentStep).padStart(2, "0")} de 04
            </p>

            <p className="mt-1 text-sm font-semibold text-[#0b2340]">
              {steps[currentStep - 1].label}
            </p>
          </div>

          <span className="text-[13px] font-medium text-[#5687ad]">
            {currentStep}/4
          </span>
        </div>

        <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-[#dce5ea]">
          <div
            className="h-full rounded-full bg-[#356f9f] transition-all duration-500"
            style={{
              width: `${(currentStep / steps.length) * 100}%`,
            }}
          />
        </div>

        {maxStepReached > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {steps
              .filter((step) => step.number <= maxStepReached)
              .map((step) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => onStepChange(step.number)}
                  className={`
                    cursor-pointer
                    rounded-full
                    border
                    px-3 py-1.5
                    text-[11px] font-medium
                    uppercase tracking-[0.08em]
                    transition-all duration-200
                    ${
                      currentStep === step.number
                        ? "border-[#7eabcd] bg-[#edf5fa] text-[#356f9f]"
                        : "border-[#d6e1e7] bg-white text-[#697d89]"
                    }
                  `}
                >
                  {String(step.number).padStart(2, "0")}{" "}
                  {step.label}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}