import {
  NotificationBell,
} from "./NotificationBell";

export function InternalHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d5e0e6] bg-[#edf2f5]/95 backdrop-blur-xl">
      <div className="flex h-[70px] items-center justify-between px-5 sm:px-7 lg:px-9">
        {/* ===================================================
            IDENTIFICAÇÃO
        =================================================== */}

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#6e8795]">
            Centro de Excelência em Metrologia
          </p>

          <p className="mt-1 text-sm font-semibold text-[#17394f]">
            Gestão interna
          </p>
        </div>

        {/* ===================================================
            AÇÕES
        =================================================== */}

        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="hidden h-7 w-px bg-[#d3dfe5] sm:block" />

          {/* =================================================
              USUÁRIO
          ================================================= */}

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b2340] text-[10px] font-semibold text-white">
              AD
            </div>

            <div>
              <p className="text-xs font-semibold text-[#17394f]">
                Administrador
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.08em] text-[#82949e]">
                Gerente do laboratório
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}