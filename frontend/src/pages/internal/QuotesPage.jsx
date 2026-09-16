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

const CLOSED_STATUSES = [
  "Aceito",
  "Recusado",
  "Cancelado",
];

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
  ] = useState(
    "Todos",
  );

  const runtimeQuotes =
    getRuntimeQuotes();

  const filteredQuotes =
    useMemo(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase();

        return runtimeQuotes.filter(
          (
            quote,
          ) => {
            const searchableValues = [
              quote.id,
              quote.requestId,
              quote.company,
              quote.contact,
              quote.service,
              quote.responsible,
            ];

            const matchesSearch =
              !normalizedSearch ||
              searchableValues
                .filter(
                  Boolean,
                )
                .some(
                  (value) =>
                    String(
                      value,
                    )
                      .toLowerCase()
                      .includes(
                        normalizedSearch,
                      ),
                );

            const matchesStatus =
              status ===
                "Todos" ||
              quote.status ===
                status;

            return (
              matchesSearch &&
              matchesStatus
            );
          },
        );
      },
      [
        runtimeQuotes,
        search,
        status,
      ],
    );

  const summary =
    useMemo(
      () => {
        const active =
          runtimeQuotes.filter(
            (quote) =>
              !CLOSED_STATUSES.includes(
                quote.status,
              ),
          );

        return {
          active:
            active.length,

          editing:
            active.filter(
              (quote) =>
                [
                  "Rascunho",
                  "Em elaboração",
                ].includes(
                  quote.status,
                ),
            ).length,

          review:
            active.filter(
              (quote) =>
                quote.status ===
                "Em revisão",
            ).length,

          customer:
            active.filter(
              (quote) =>
                quote.status ===
                "Enviado",
            ).length,

          accepted:
            runtimeQuotes.filter(
              (quote) =>
                quote.status ===
                "Aceito",
            ).length,
        };
      },
      [
        runtimeQuotes,
      ],
    );

  function handleOpenRequestQueue() {
    navigate(
      "/portal/solicitacoes",
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Operação"
        title="Orçamentos"
        description="Elabore, revise e acompanhe propostas geradas a partir de solicitações tecnicamente aprovadas."
        action={
          <button
            type="button"
            onClick={
              handleOpenRequestQueue
            }
            className="internal-card-title 
              inline-flex
              min-h-[44px]
              cursor-pointer
              items-center
              justify-center
              gap-2
              rounded-[13px]
              bg-[#12364e]
              px-5
              
              font-semibold
              text-white
              shadow-[0_8px_20px_rgba(18,54,78,0.13)]
              transition-all
              duration-200
              hover:-translate-y-[1px]
              hover:bg-[#0d2d41]
              hover:shadow-[0_12px_26px_rgba(18,54,78,0.18)]
            "
          >
            Criar a partir de solicitação
          </button>
        }
      />

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="Em andamento"
          value={
            summary.active
          }
          description="Fluxo comercial ativo"
        />

        <SummaryCard
          label="Elaboração"
          value={
            summary.editing
          }
          description="Definição da proposta"
        />

        <SummaryCard
          label="Em revisão"
          value={
            summary.review
          }
          description="Aguardando validação"
        />

        <SummaryCard
          label="Com cliente"
          value={
            summary.customer
          }
          description="Aguardando retorno"
        />

        <SummaryCard
          label="Aceitos"
          value={
            summary.accepted
          }
          description="Podem virar projeto"
        />
      </div>

      <div className="mt-5">
        <QuoteFilters
          search={
            search
          }
          onSearchChange={
            setSearch
          }
          status={
            status
          }
          onStatusChange={
            setStatus
          }
        />
      </div>

      <section className="mt-5 overflow-hidden rounded-[22px] border border-[#cadce5] bg-white/72 shadow-[0_12px_34px_rgba(31,68,92,0.055)] backdrop-blur-[18px]">
        <div className="flex flex-col gap-3 border-b border-[#dce7ec] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="internal-section-title font-semibold text-[#17394f]">
              Fluxo comercial
            </h2>

            <p className="internal-card-description mt-1 text-[#607987]">
              Cada orçamento mantém vínculo com a solicitação que originou a proposta.
            </p>
          </div>

          <div className="rounded-full border border-[#c7dbe5] bg-[#edf5f8] px-3 py-1.5">
            <span className="internal-card-title font-semibold text-[#496f84]">
              {
                filteredQuotes.length
              }{" "}
              {filteredQuotes.length ===
              1
                ? "resultado"
                : "resultados"}
            </span>
          </div>
        </div>

        <div className="internal-eyebrow hidden grid-cols-[125px_125px_1.4fr_1fr_155px_125px_44px] gap-4 border-b border-[#e5ebef] bg-[#f4f8fa]/85 px-6 py-3 font-semibold uppercase text-[#526d7c] xl:grid">
          <span>
            Orçamento
          </span>

          <span>
            Solicitação
          </span>

          <span>
            Cliente
          </span>

          <span>
            Serviço
          </span>

          <span>
            Status
          </span>

          <span>
            Valor
          </span>

          <span />
        </div>

        <div className="divide-y divide-[#e1eaee]">
          {filteredQuotes.map(
            (quote) => (
              <QuoteRow
                key={
                  quote.id
                }
                quote={
                  quote
                }
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
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#edf5f8] text-[20px] text-[#5f879c]">
                $
              </div>

              <h3 className="internal-section-title mt-4 font-semibold text-[#294c60]">
                Nenhum orçamento encontrado
              </h3>

              <p className="internal-card-description mx-auto mt-2 max-w-[440px] text-[#526d7c]">
                Ajuste os filtros ou consulte as solicitações aptas para gerar uma nova proposta.
              </p>

              <button
                type="button"
                onClick={
                  handleOpenRequestQueue
                }
                className="internal-card-title mt-5 cursor-pointer rounded-[11px] bg-[#12364e] px-4 py-2.5 font-semibold text-white transition hover:bg-[#0d2d41]"
              >
                Ver solicitações
              </button>
            </div>
          )}
        </div>
      </section>
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
      onClick={
        onOpen
      }
      className="
        grid
        w-full
        cursor-pointer
        gap-4
        px-5
        py-5
        text-left
        transition
        hover:bg-[#f3f8fa]
        sm:px-6
        xl:grid-cols-[125px_125px_1.4fr_1fr_155px_125px_44px]
        xl:items-center
      "
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="internal-card-title font-semibold tracking-[0.04em] text-[#356f9f]">
            {
              quote.id
            }
          </p>

          <SourceBadge
            source={
              quote.source
            }
          />
        </div>

        <p className="internal-help-text mt-1 text-[#526d7c]">
          {
            quote.createdAt
          }
        </p>
      </div>

      <div>
        <p className="internal-card-title font-semibold text-[#607989]">
          {
            quote.requestId
          }
        </p>
      </div>

      <div className="min-w-0">
        <p className="internal-card-title truncate font-semibold text-[#17394f]">
          {
            quote.company
          }
        </p>

        <p className="internal-help-text mt-1 truncate text-[#526d7c]">
          {
            quote.contact
          }
        </p>
      </div>

      <div>
        <p className="internal-card-title font-medium text-[#466478]">
          {quote.service ||
            "Não definido"}
        </p>

        <p className="internal-help-text mt-1 text-[#526d7c]">
          {quote.responsible ||
            "Não atribuído"}
        </p>
      </div>

      <QuoteStatusBadge
        status={
          quote.status
        }
      />

      <div>
        <p className="internal-card-title font-semibold text-[#31566d]">
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

function SummaryCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-[18px] border border-[#cadce5] bg-white/62 px-5 py-4 shadow-[0_8px_24px_rgba(31,68,92,0.04)] backdrop-blur-[16px]">
      <p className="internal-eyebrow font-semibold uppercase text-[#607f90]">
        {label}
      </p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-[28px] font-semibold tracking-[-0.04em] text-[#17394f]">
          {value}
        </p>

        <span className="mb-1 h-2 w-2 rounded-full bg-[#65b8ee]" />
      </div>

      <p className="internal-card-description mt-1 text-[#526d7c]">
        {description}
      </p>
    </div>
  );
}

function SourceBadge({
  source,
}) {
  const isReal =
    source ===
    "real";

  return (
    <span
      className={`internal-eyebrow 
        rounded-full
        border
        px-2
        py-0.5
        
        font-semibold
        uppercase
        

        ${
          isReal
            ? "border-[#bdd8c7] bg-[#edf7f1] text-[#4c7b5e]"
            : "border-[#d7caa9] bg-[#f8f2e5] text-[#876e36]"
        }
      `}
    >
      {isReal
        ? "Real"
        : "Demo"}
    </span>
  );
}

function formatCurrency(
  value,
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style:
        "currency",

      currency:
        "BRL",
    },
  ).format(
    value ||
      0,
  );
}