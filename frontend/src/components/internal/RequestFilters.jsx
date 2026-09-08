import {
  requestOrigins,
  requestStatuses,
} from "../../data/internal/requests";

export function RequestFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  origin,
  onOriginChange,
}) {
  return (
    <div className="rounded-[20px] border border-[#d1dde4] bg-white p-4 shadow-[0_10px_30px_rgba(34,67,90,0.025)]">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px_190px]">
        <label className="relative block">
          <span className="sr-only">
            Pesquisar solicitações
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Buscar por ID, empresa, contato ou serviço..."
            className="
              h-11 w-full
              rounded-[12px]
              border border-[#d7e1e7]
              bg-[#f9fbfc]
              px-4
              text-sm text-[#17394f]
              outline-none
              transition
              placeholder:text-[#98a8b2]
              focus:border-[#76a9c7]
              focus:bg-white
            "
          />
        </label>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value,
            )
          }
          className="
            h-11
            rounded-[12px]
            border border-[#d7e1e7]
            bg-[#f9fbfc]
            px-3
            text-xs font-medium text-[#536f80]
            outline-none
            transition
            focus:border-[#76a9c7]
            focus:bg-white
          "
        >
          {requestStatuses.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ),
          )}
        </select>

        <select
          value={origin}
          onChange={(event) =>
            onOriginChange(
              event.target.value,
            )
          }
          className="
            h-11
            rounded-[12px]
            border border-[#d7e1e7]
            bg-[#f9fbfc]
            px-3
            text-xs font-medium text-[#536f80]
            outline-none
            transition
            focus:border-[#76a9c7]
            focus:bg-white
          "
        >
          {requestOrigins.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ),
          )}
        </select>
      </div>
    </div>
  );
}