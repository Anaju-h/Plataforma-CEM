import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getCustomerDocuments } from "../../services/customer/customerService";

export function CustomerDocumentsPage() {
  const { customer } = useOutletContext();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDocuments() {
      try {
        const data = await getCustomerDocuments();

        if (active) {
          setDocuments(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDocuments();

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
          Documentos
        </h1>

        <p className="mt-2 text-[13px] text-[#6e7981]">
          Acesse os documentos disponibilizados pelo laboratório para sua empresa.
        </p>
      </div>

      <section className="mt-8 overflow-hidden rounded-[14px] border border-[#dfe6ea] bg-white">
        <div className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr] border-b border-[#e5eaed] bg-[#f8fafb] px-6 py-3 max-md:hidden">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b969e]">
            Documento
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b969e]">
            Projeto
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b969e]">
            Publicado
          </span>

          <span className="text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b969e]">
            Arquivo
          </span>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-[13px] text-[#7b868e]">
            Carregando documentos...
          </div>
        ) : (
          documents.map((document, index) => (
            <article
              key={document.id}
              className={`
                grid gap-4 px-6 py-5
                md:grid-cols-[1.5fr_1fr_0.7fr_0.7fr]
                md:items-center
                ${
                  index !== documents.length - 1
                    ? "border-b border-[#edf1f3]"
                    : ""
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-[#eef5fb]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 2.8H12.5L16 6.3V17.2H5V2.8Z"
                      stroke="#0057b8"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.5 2.8V6.3H16"
                      stroke="#0057b8"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-[#071f2d]">
                    {document.name}
                  </p>

                  <p className="mt-1 text-[11px] text-[#929ca3]">
                    {document.type} · {document.size}
                  </p>
                </div>
              </div>

              <p className="text-[12px] font-medium text-[#45525b]">
                {document.projectId}
              </p>

              <p className="text-[11px] text-[#7d888f]">
                {document.publishedAt}
              </p>

              <div className="md:text-right">
                <button
                  type="button"
                  className="text-[12px] font-semibold text-[#0057b8] hover:text-[#003f82]"
                >
                  Visualizar
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}