import type {
  ConfiguratorStep,
} from "./types";

type ConfiguratorProgressProps = {
  currentStep: ConfiguratorStep;

  highestStep: ConfiguratorStep;

  onStepChange: (
    step: ConfiguratorStep,
  ) => void;
};

const steps: {
  number: ConfiguratorStep;
  label: string;
  shortLabel: string;
}[] = [
  {
    number: 1,
    label: "Necessidade",
    shortLabel: "Necessidade",
  },

  {
    number: 2,
    label: "Peça",
    shortLabel: "Peça",
  },

  {
    number: 3,
    label: "Requisitos",
    shortLabel: "Requisitos",
  },

  {
    number: 4,
    label: "Refinamento",
    shortLabel: "Refinar",
  },

  {
    number: 5,
    label: "Solicitação",
    shortLabel: "Solicitação",
  },
];

export function ConfiguratorProgress({
  currentStep,
  highestStep,
  onStepChange,
}: ConfiguratorProgressProps) {
  return (
    <div className="w-full">
      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="lg:hidden">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#708796]">
              Etapa
            </p>

            <p className="mt-1 text-sm font-semibold text-[#0b2340]">
              {String(
                currentStep,
              ).padStart(
                2,
                "0",
              )}{" "}
              / 05
            </p>
          </div>

          <p className="text-sm font-medium text-[#35566d]">
            {
              steps[
                currentStep - 1
              ].label
            }
          </p>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {steps.map(
            ({
              number,
              label,
            }) => {
              const active =
                number ===
                currentStep;

              const available =
                number <=
                highestStep;

              const completed =
                number <
                currentStep;

              return (
                <button
                  key={
                    number
                  }
                  type="button"
                  disabled={
                    !available
                  }
                  onClick={() =>
                    onStepChange(
                      number,
                    )
                  }
                  aria-label={`Ir para a etapa ${label}`}
                  className={`
                    relative
                    h-2
                    overflow-hidden
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      !available
                        ? "cursor-not-allowed bg-[#ccd8df]"
                        : active
                          ? "cursor-pointer bg-[#1476b8]"
                          : completed
                            ? "cursor-pointer bg-[#7daecb] hover:bg-[#5d98bb]"
                            : "cursor-pointer bg-[#9ebdce] hover:bg-[#7ca8c1]"
                    }
                  `}
                />
              );
            },
          )}
        </div>
      </div>

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden lg:flex">
        {steps.map(
          (
            {
              number,
              label,
              shortLabel,
            },
            index,
          ) => {
            const active =
              number ===
              currentStep;

            const available =
              number <=
              highestStep;

            const completed =
              number <
              currentStep;

            return (
              <div
                key={
                  number
                }
                className="flex min-w-0 flex-1"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center">
                    <button
                      type="button"
                      disabled={
                        !available
                      }
                      onClick={() =>
                        onStepChange(
                          number,
                        )
                      }
                      aria-label={`Ir para a etapa ${label}`}
                      className={`
                        relative
                        flex h-9 w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        text-[10px]
                        font-semibold
                        transition-all
                        duration-300

                        ${
                          active
                            ? "border-[#1476b8] bg-[#1476b8] text-white shadow-[0_8px_22px_rgba(20,118,184,0.20)]"
                            : completed
                              ? "cursor-pointer border-[#73a8ca] bg-[#dcebf4] text-[#266c98] hover:border-[#1476b8] hover:bg-[#d3e7f2]"
                              : available
                                ? "cursor-pointer border-[#a8c4d5] bg-[#e7f0f5] text-[#527b94]"
                                : "cursor-not-allowed border-[#ccd9e0] bg-[#f4f7f9] text-[#94a4ad]"
                        }
                      `}
                    >
                      {completed
                        ? "✓"
                        : String(
                            number,
                          ).padStart(
                            2,
                            "0",
                          )}

                      {active && (
                        <span className="pointer-events-none absolute -inset-[5px] rounded-full border border-[#1476b8]/15" />
                      )}
                    </button>

                    {index <
                      steps.length -
                        1 && (
                      <div className="mx-2.5 h-px min-w-4 flex-1 overflow-hidden bg-[#d0dce3]">
                        <div
                          className={`
                            h-full
                            transition-all
                            duration-500

                            ${
                              number <
                              highestStep
                                ? "w-full bg-[#72a9ca]"
                                : "w-0"
                            }
                          `}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={
                      !available
                    }
                    onClick={() =>
                      onStepChange(
                        number,
                      )
                    }
                    className={`
                      mt-2
                      w-fit
                      max-w-full
                      truncate
                      text-[10px]
                      font-medium
                      transition-colors

                      ${
                        active
                          ? "text-[#0b639e]"
                          : available
                            ? "cursor-pointer text-[#647f8f] hover:text-[#1476b8]"
                            : "cursor-not-allowed text-[#94a3ac]"
                      }
                    `}
                  >
                    {shortLabel}
                  </button>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}