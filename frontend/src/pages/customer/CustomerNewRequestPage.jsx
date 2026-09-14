import {
  useOutletContext,
} from "react-router-dom";

import {
  QuoteForm,
} from "../../components/quote/QuoteForm";

export function CustomerNewRequestPage() {
  const {
    customer,
  } =
    useOutletContext();

  return (
    <div className="mx-auto max-w-[1480px]">
      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-7 bg-[#65b8ee]" />

          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#56809a]">
            Novo atendimento
          </p>
        </div>

        <div className="mt-2 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-[#071f2d] sm:text-[34px]">
              Nova solicitação
            </h1>

            <p className="mt-2 max-w-[680px] text-[12px] leading-6 text-[#6a808d]">
              Os dados da sua conta já estão associados à solicitação. Informe
              somente as características da nova necessidade.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#a9c6d5]/54 bg-[#e2eef4]/62 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#65b8ee]" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#52778a]">
              Cliente identificado
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FORMULÁRIO REUTILIZADO
      ===================================================== */}

      <QuoteForm
        mode="customer"
        customer={
          customer
        }
      />
    </div>
  );
}