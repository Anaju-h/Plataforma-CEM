import {
  motion,
} from "motion/react";

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function ConfiguratorProgress({
  currentStep,
  highestStep,
  onStepChange,
  steps = [],
}) {
  const totalSteps =
    steps.length;

  const progress =
    totalSteps > 1
      ? ((currentStep - 1) /
          (totalSteps - 1)) *
        100
      : 0;

  return (
    <div className="w-full">
      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden lg:block">
        <div className="relative py-1">
          {/* LINHA BASE */}

          <div className="absolute left-[6.25%] right-[6.25%] top-[21px] h-px bg-[#afc5d0]/72" />

          {/* LINHA PREENCHIDA */}

          <div className="absolute left-[6.25%] right-[6.25%] top-[21px]">
            <motion.div
              initial={false}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.45,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="h-px bg-[#4f8cac]"
            />
          </div>

          {/* ETAPAS */}

          <div
            className="relative grid w-full"
            style={{
              gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))`,
            }}
          >
            {steps.map(
              (
                step,
                index,
              ) => {
                const stepNumber =
                  index + 1;

                const completed =
                  step.id <
                  currentStep;

                const active =
                  step.id ===
                  currentStep;

                const available =
                  step.id <=
                  highestStep;

                return (
                  <div
                    key={
                      step.id ??
                      stepNumber
                    }
                    className="flex items-center justify-center"
                  >
                    <button
                      type="button"
                      disabled={
                        !available
                      }
                      onClick={() => {
                        if (
                          available
                        ) {
                          onStepChange?.(
                            step.id ??
                              stepNumber,
                          );
                        }
                      }}
                      aria-label={`Etapa ${stepNumber}`}
                      title={
                        step.label
                      }
                      className={`
                        relative
                        z-10
                        flex
                        h-[38px]
                        w-[38px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        text-[11px]
                        font-semibold
                        transition-all
                        duration-300

                        ${
                          active
                            ? "scale-[1.04] border-[#12364e] bg-[#12364e] text-white shadow-[0_7px_18px_rgba(18,54,78,0.18)]"
                            : completed
                              ? "border-[#9abccc] bg-[#dceaf1] text-[#356b86]"
                              : available
                                ? "border-[#b8cbd5] bg-[#edf4f7] text-[#6c8794] hover:border-[#8eafbf] hover:bg-white"
                                : "cursor-default border-[#cfdae0] bg-[#edf2f4] text-[#93a6af]"
                        }
                      `}
                    >
                      {completed ? (
                        <span className="text-[13px]">
                          ✓
                        </span>
                      ) : (
                        String(
                          stepNumber,
                        ).padStart(
                          2,
                          "0",
                        )
                      )}
                    </button>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET
      ===================================================== */}

      <div className="lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#688594]">
            Etapa{" "}
            {String(
              currentStep,
            ).padStart(
              2,
              "0",
            )}{" "}
            de{" "}
            {String(
              totalSteps,
            ).padStart(
              2,
              "0",
            )}
          </p>

          <span className="text-[11px] font-semibold text-[#82959f]">
            {Math.round(
              progress,
            )}
            %
          </span>
        </div>

        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-[#cbd9e0]/74">
          <motion.div
            initial={false}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.45,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="h-full rounded-full bg-[#4f8cac]"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-1.5">
          {steps.map(
            (
              step,
              index,
            ) => {
              const stepNumber =
                index + 1;

              const completed =
                step.id <
                currentStep;

              const active =
                step.id ===
                currentStep;

              const available =
                step.id <=
                highestStep;

              return (
                <button
                  key={
                    step.id ??
                    stepNumber
                  }
                  type="button"
                  disabled={
                    !available
                  }
                  onClick={() => {
                    if (
                      available
                    ) {
                      onStepChange?.(
                        step.id ??
                          stepNumber,
                      );
                    }
                  }}
                  aria-label={`Etapa ${stepNumber}`}
                  title={
                    step.label
                  }
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-[10px]
                    font-semibold
                    transition-all

                    ${
                      active
                        ? "border-[#12364e] bg-[#12364e] text-white"
                        : completed
                          ? "border-[#9bb9c8] bg-[#dceaf1] text-[#456f85]"
                          : available
                            ? "border-white/78 bg-white/42 text-[#738b97]"
                            : "border-[#d3dee3] bg-[#edf2f4] text-[#9bacb4]"
                    }
                  `}
                >
                  {completed
                    ? "✓"
                    : String(
                        stepNumber,
                      ).padStart(
                        2,
                        "0",
                      )}
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}