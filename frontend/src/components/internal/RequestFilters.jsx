export function RequestFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  origin,
  onOriginChange,
  statusOptions = [
    "Todos",
  ],
  originOptions = [
    "Todas",
  ],
  hasActiveFilters = false,
  onReset,
}) {
  return (
    <div
      className="
        rounded-[20px]
        border
        border-[#cddbe3]
        bg-white
        p-4
        shadow-[0_10px_30px_rgba(7,31,45,0.03)]
      "
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_220px_195px_auto]">
        {/* ===================================================
            BUSCA
        =================================================== */}

        <label className="relative block">
          <span className="sr-only">
            Pesquisar solicitações
          </span>

          <span
            className="
              pointer-events-none
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              text-[#6b8593]
            "
          >
            <SearchIcon />
          </span>

          <input
            type="search"
            value={
              search
            }
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Buscar por ID, empresa, contato, serviço ou responsável..."
            className="
              h-11
              w-full
              rounded-[12px]
              border
              border-[#cedce3]
              bg-[#f8fafb]
              pl-10
              pr-4
              text-[13px]
              text-[#17384d]
              outline-none
              transition
              placeholder:text-[#82949e]
              hover:border-[#b6cbd6]
              focus:border-[#6b9fb9]
              focus:bg-white
            "
          />
        </label>

        {/* ===================================================
            STATUS
        =================================================== */}

        <label className="relative">
          <span className="sr-only">
            Filtrar por status
          </span>

          <select
            value={
              status
            }
            onChange={(event) =>
              onStatusChange(
                event.target.value,
              )
            }
            className="
              h-11
              w-full
              cursor-pointer
              appearance-none
              rounded-[12px]
              border
              border-[#cedce3]
              bg-[#f8fafb]
              px-3
              pr-9
              text-[12px]
              font-medium
              text-[#405f70]
              outline-none
              transition
              hover:border-[#b6cbd6]
              focus:border-[#6b9fb9]
              focus:bg-white
            "
          >
            {statusOptions.map(
              (item) => (
                <option
                  key={
                    item
                  }
                  value={
                    item
                  }
                >
                  {item}
                </option>
              ),
            )}
          </select>

          <SelectArrow />
        </label>

        {/* ===================================================
            ORIGEM
        =================================================== */}

        <label className="relative">
          <span className="sr-only">
            Filtrar por origem
          </span>

          <select
            value={
              origin
            }
            onChange={(event) =>
              onOriginChange(
                event.target.value,
              )
            }
            className="
              h-11
              w-full
              cursor-pointer
              appearance-none
              rounded-[12px]
              border
              border-[#cedce3]
              bg-[#f8fafb]
              px-3
              pr-9
              text-[12px]
              font-medium
              text-[#405f70]
              outline-none
              transition
              hover:border-[#b6cbd6]
              focus:border-[#6b9fb9]
              focus:bg-white
            "
          >
            {originOptions.map(
              (item) => (
                <option
                  key={
                    item
                  }
                  value={
                    item
                  }
                >
                  {item}
                </option>
              ),
            )}
          </select>

          <SelectArrow />
        </label>

        {/* ===================================================
            LIMPAR
        =================================================== */}

        <button
          type="button"
          onClick={
            onReset
          }
          disabled={
            !hasActiveFilters
          }
          className={`
            h-11
            rounded-[12px]
            border
            px-4
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.07em]
            transition

            ${
              hasActiveFilters
                ? "border-[#bfd1db] bg-[#f5f9fb] text-[#476b7e] hover:border-[#8eafc0] hover:bg-white hover:text-[#0057b8]"
                : "cursor-default border-[#e0e7eb] bg-[#f8fafb] text-[#9aabb4]"
            }
          `}
        >
          Limpar
        </button>
      </div>
    </div>
  );
}

function SelectArrow() {
  return (
    <span
      className="
        pointer-events-none
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-[11px]
        text-[#607c8c]
      "
    >
      ▾
    </span>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-3.4-3.4" />
    </svg>
  );
}