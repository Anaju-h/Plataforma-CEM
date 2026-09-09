import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import { getCustomerRequests } from "../../services/customer/customerService";

export function CustomerRequestsPage() {
  const { customer } = useOutletContext();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      try {
        const data = await getCustomerRequests();

        if (active) {
          setRequests(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0057b8]">
            {customer.company.name}
          </p>

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#071f2d]">
            Solicitações
          </h1>

          <p className="mt-2 text-[13px] text-[#6e7981]">
            Acompanhe as solicitações enviadas ao laboratório.
          </p>
        </div>

        <Link
          to="/orcamento"
          className="
            inline-flex h-[44px] items-center justify-center
            rounded-[9px] bg-[#0057b8]
            px-5 text-[12px] font-semibold text-white
            transition-colors hover:bg-[#004a9d]
          "
        >
          Nova solicitação
        </Link>
      </div>

      <section className="mt-8 overflow-hidden rounded-[14px] border border-[#dfe6ea] bg-white">
        <div className="grid grid-cols-[1.1fr_1.4fr_1fr] border-b border-[#e5eaed] bg-[#f8fafb] px-6 py-3 max-md:hidden">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b969e]">
            Solicitação
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b969e]">
            Serviço / peça
          </span>

          <span className="text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b969e]">
            Status
          </span>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-[13px] text-[#7b868e]">
            Carregando solicitações...
          </div>
        ) : (
          requests.map((request, index) => (
            <article
              key={request.id}
              className={`
                grid gap-4 px-6 py-5
                md:grid-cols-[1.1fr_1.4fr_1fr]
                md:items-center
                ${
                  index !== requests.length - 1
                    ? "border-b border-[#edf1f3]"
                    : ""
                }
              `}
            >
              <div>
                <p className="text-[13px] font-semibold text-[#071f2d]">
                  {request.id}
                </p>

                <p className="mt-1 text-[11px] text-[#929ca3]">
                  Enviada em {request.createdAt}
                </p>
              </div>

              <div>
                <p className="text-[13px] font-medium text-[#34424b]">
                  {request.service}
                </p>

                <p className="mt-1 text-[11px] text-[#89939a]">
                  {request.part}
                </p>
              </div>

              <div className="md:text-right">
                <span className="inline-flex rounded-full bg-[#eef5fb] px-3 py-1.5 text-[11px] font-semibold text-[#0057b8]">
                  {request.status}
                </span>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}