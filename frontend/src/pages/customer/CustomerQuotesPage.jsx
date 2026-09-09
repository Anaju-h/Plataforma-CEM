import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getCustomerQuotes } from "../../services/customer/customerService";

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function CustomerQuotesPage() {
  const { customer } = useOutletContext();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadQuotes() {
      try {
        const data = await getCustomerQuotes();

        if (active) {
          setQuotes(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadQuotes();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0057b8]">
          {customer.company.name}
        </p>

        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#071f2d]">
          Orçamentos
        </h1>

        <p className="mt-2 text-[13px] text-[#6e7981]">
          Consulte as propostas emitidas pelo laboratório.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="rounded-[14px] border border-[#dfe6ea] bg-white px-6 py-10 text-center text-[13px] text-[#7b868e]">
            Carregando orçamentos...
          </div>
        ) : (
          quotes.map((quote) => (
            <article
              key={quote.id}
              className="
                rounded-[14px]
                border border-[#dfe6ea]
                bg-white
                p-6
              "
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-[15px] font-semibold text-[#071f2d]">
                      {quote.id}
                    </h2>

                    <span
                      className={`
                        rounded-full px-3 py-1
                        text-[10px] font-semibold
                        ${
                          quote.status === "Aceito"
                            ? "bg-[#edf8f2] text-[#16704a]"
                            : "bg-[#fff5df] text-[#946300]"
                        }
                      `}
                    >
                      {quote.status}
                    </span>
                  </div>

                  <p className="mt-3 text-[13px] font-medium text-[#45525b]">
                    {quote.service}
                  </p>

                  <p className="mt-1 text-[11px] text-[#8b959c]">
                    Referente à {quote.requestId}
                  </p>
                </div>

                <div className="md:text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9aa3aa]">
                    Valor da proposta
                  </p>

                  <p className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-[#071f2d]">
                    {formatCurrency(quote.value)}
                  </p>

                  <p className="mt-1 text-[11px] text-[#8c969d]">
                    Válido até {quote.validUntil}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#edf1f3] pt-4">
                <p className="text-[11px] text-[#8b959c]">
                  Emitido em {quote.createdAt}
                </p>

                <button
                  type="button"
                  className="text-[12px] font-semibold text-[#0057b8] hover:text-[#003f82]"
                >
                  Visualizar orçamento
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}