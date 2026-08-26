import {
  getService,
} from "../data/serviceCatalog";

export function RequirementProgress({
  services,
  activeService,
  completedServices,
  onServiceChange,
}) {
  return (
    <div className="rounded-[18px] border border-[#c9d9e2] bg-[#e8f1f6] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#66869a]">
            Requisitos do projeto
          </p>

          <p className="mt-1 text-xs text-[#6c8290]">
            Responda somente aos blocos relacionados aos serviços desta peça.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-[#bad0dd] bg-white/70 px-3 py-1 text-[10px] font-semibold text-[#3d708f]">
          {completedServices.length} / {services.length}
        </span>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {services.map(
          (service) => {
            const active =
              service ===
              activeService;

            const completed =
              completedServices.includes(
                service,
              );

            return (
              <button
                key={service}
                type="button"
                onClick={() =>
                  onServiceChange(
                    service,
                  )
                }
                className={`
                  min-w-max
                  rounded-full
                  border
                  px-3.5 py-2
                  text-[10px]
                  font-semibold
                  transition-all

                  ${
                    active
                      ? "border-[#1476b8] bg-[#1476b8] text-white shadow-[0_6px_16px_rgba(20,118,184,0.15)]"
                      : completed
                        ? "border-[#8db6cf] bg-[#d9eaf4] text-[#286d98]"
                        : "border-[#c5d5de] bg-[#f7fafb] text-[#657f8f] hover:border-[#9dbdce]"
                  }
                `}
              >
                {completed
                  ? "✓ "
                  : ""}

                {
                  getService(
                    service,
                  ).shortName
                }
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}