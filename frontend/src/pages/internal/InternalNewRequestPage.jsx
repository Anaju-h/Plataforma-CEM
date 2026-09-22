import {
  useNavigate,
} from "react-router-dom";

import {
  QuoteForm,
} from "../../components/quote/QuoteForm";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import { createRequest } from "../../services/requestService";

export function InternalNewRequestPage() {
  const navigate =
    useNavigate();

  async function handleSubmit(
    formData,
  ) {
    const request =
      await createRequest(
        {
          contact:
            formData.contact,

          pieces:
            formData.pieces,

          project:
            formData.project,

          internal:
            formData.internal,
        },
        "Interno",
      );

    navigate(
      `/portal/solicitacoes/${request.id}`,
    );
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <button
        type="button"
        onClick={() =>
          navigate(
            "/portal/solicitacoes",
          )
        }
        className="
          mb-5
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.08em]
          text-[#477187]
          transition
          hover:text-[#0057b8]
        "
      >
        ← Voltar para solicitações
      </button>

      <InternalPageHeader
        eyebrow="Operação"
        title="Nova solicitação"
        description="Registre uma necessidade recebida diretamente pela equipe do laboratório. A solicitação seguirá o mesmo fluxo operacional das entradas públicas e da área do cliente."
      />

      <div className="mt-7">
        <QuoteForm
          mode="internal"
          onSubmit={
            handleSubmit
          }
        />
      </div>
    </div>
  );
}
