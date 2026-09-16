import {
  quoteStatuses,
} from "../../data/internal/quotes";

export function QuoteFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions = quoteStatuses,
}) {
  return (
    <div className="rounded-[20px] border border-[#d1dde4] bg-white p-4 shadow-[0_10px_30px_rgba(34,67,90,0.025)]">
      <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
        <input
          type="search"
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value,
            )
          }
          placeholder="Buscar por orçamento, solicitação, cliente ou serviço..."
          className="internal-field-value 
            h-11
            w-full
            rounded-[12px]
            border border-[#d7e1e7]
            bg-[#f9fbfc]
            px-4
            
            text-[#17394f]
            outline-none
            transition
            placeholder:text-[#526d7c]
            focus:border-[#76a9c7]
            focus:bg-white
          "
        />

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value,
            )
          }
          className="internal-field-value 
            h-11
            rounded-[12px]
            border border-[#d7e1e7]
            bg-[#f9fbfc]
            px-3
            
            font-medium
            text-[#536f80]
            outline-none
            transition
            focus:border-[#76a9c7]
            focus:bg-white
          "
        >
          {statusOptions.map(
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
