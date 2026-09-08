import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import {
  QuoteFilters,
} from "../../components/internal/QuoteFilters";

import {
  QuoteStatusBadge,
} from "../../components/internal/QuoteStatusBadge";

import {
  getRuntimeQuotes,
} from "../../services/quoteService";

export function QuotesPage() {
  const navigate =
    useNavigate();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("Todos");

  const runtimeQuotes =
    getRuntimeQuotes();

  const filteredQuotes =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return runtimeQuotes.filter(
        (quote) => {
          const matchesSearch =
            !normalizedSearch ||
            [
              quote.id,
              quote.requestId,
              quote.company,
              quote.contact,
              quote.service,
            ].some((value) =>
              value
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ),
            );

          const matchesStatus =
            status === "Todos" ||
            quote.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      runtimeQuotes,
      search,
      status,
    ]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Operação"
        title="Orçamentos"
        description="Acompanhe propostas em elaboração, enviadas e convertidas em serviços."
        action={
          <button
            type="button"
            className="rounded-[12px] bg-[#096ab2] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#075b99]"
          >
            + Novo orçamento
          </button>
        }
      />

      <div className="mt-7">
        <QuoteFilters
          search={search}
          onSearchChange={
            setSearch
          }
          status={status}
          onStatusChange={
            setStatus
          }
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white shadow-[0_12px_35px_rgba(34,67,90,0.035)]">
        <div className="flex items-center justify-between border-b border-[#e0e7ec] px-5 py-4 sm:px-6">
          <div>
            <p className="text-sm font-semibold text-[#17394f]">
              Orçamentos
            </p>

            <p className="mt-1 text-[11px] text-[#80919b]">
              {
                filteredQuotes.length
              }{" "}
              {filteredQuotes.length ===
              1
                ? "resultado"
                : "resultados"}
            </p>
          </div>
        </div>

        <div className="hidden grid-cols-[120px_120px_1.4fr_1fr_145px_120px_44px] gap-4 border-b border-[#e5ebef] bg-[#f7fafb] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#708795] xl:grid">
          <span>Orçamento</span>
          <span>Solicitação</span>
          <span>Cliente</span>
          <span>Serviço</span>
          <span>Status</span>
          <span>Valor</span>
          <span />
        </div>

        <div className="divide-y divide-[#e6ecef]">
          {filteredQuotes.map(
            (quote) => (
              <QuoteRow
                key={quote.id}
                quote={quote}
                onOpen={() =>
                  navigate(
                    `/portal/orcamentos/${quote.id}`,
                  )
                }
              />
            ),
          )}

          {filteredQuotes.length ===
            0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-semibold text-[#536f80]">
                Nenhum orçamento encontrado.
              </p>

              <p className="mt-2 text-xs text-[#82939d]">
                Ajuste a busca ou o filtro de status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuoteRow({
  quote,
  onOpen,
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid w-full gap-4 px-5 py-5 text-left transition hover:bg-[#f7fafb] sm:px-6 xl:grid-cols-[120px_120px_1.4fr_1fr_145px_120px_44px] xl:items-center"
    >
      <div>
        <p className="text-[10px] font-semibold tracking-[0.07em] text-[#356f9f]">
          {quote.id}
        </p>

        <p className="mt-1 text-[9px] text-[#8999a3]">
          {quote.createdAt}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-[#607989]">
          {
            quote.requestId
          }
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#17394f]">
          {quote.company}
        </p>

        <p className="mt-1 truncate text-[11px] text-[#7c8f9a]">
          {quote.contact}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-[#466478]">
          {quote.service}
        </p>

        <p className="mt-1 text-[9px] text-[#8797a0]">
          {
            quote.responsible
          }
        </p>
      </div>

      <QuoteStatusBadge
        status={
          quote.status
        }
      />

      <div>
        <p className="text-xs font-semibold text-[#31566d]">
          {quote.proposedValue >
          0
            ? formatCurrency(
                quote.proposedValue,
              )
            : "A definir"}
        </p>
      </div>

      <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#d2e0e7] bg-[#f5f9fb] text-[#56809a] xl:flex">
        →
      </div>
    </button>
  );
}

function formatCurrency(
  value,
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  ).format(value);
}