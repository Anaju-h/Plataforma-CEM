import {
  useEffect,
  useRef,
} from "react";

import {
  PieceCard,
} from "./PieceCard";

import {
  getRequestNeed,
} from "../../data/requestNeeds";

import {
  RequestNeedSelector,
} from "./RequestNeedSelector";

export function PiecesStep({
  pieces,
  onChange,
  onAdd,
  onDelete,
  requestNeedId,
  onRequestNeedChange,
  includePiecesForDirectRequest,
  onIncludePiecesForDirectRequestChange,
  stepNumber = "02",
}) {
  const queryNeedApplied =
    useRef(false);

  /*
   * ==========================================================
   * NECESSIDADE RECEBIDA PELA URL
   *
   * Exemplo:
   * /orcamento?origem=configurador&necessidade=training
   *
   * O valor é aplicado apenas uma vez, para não impedir o
   * usuário de trocar manualmente a necessidade depois.
   * ==========================================================
   */

  useEffect(() => {
    if (
      queryNeedApplied.current
    ) {
      return;
    }

    queryNeedApplied.current =
      true;

    if (
      requestNeedId
    ) {
      return;
    }

    const searchParams =
      new URLSearchParams(
        window.location.search,
      );

    const requestedNeedId =
      searchParams.get(
        "necessidade",
      );

    if (
      !requestedNeedId
    ) {
      return;
    }

    const requestedNeed =
      getRequestNeed(
        requestedNeedId,
      );

    if (
      !requestedNeed
    ) {
      return;
    }

    onRequestNeedChange(
      requestedNeed.id,
    );
  }, [
    requestNeedId,
    onRequestNeedChange,
  ]);

  const selectedNeed =
    getRequestNeed(
      requestNeedId,
    );

  const isDirectRequest =
    selectedNeed?.flow ===
    "direct-request";

  const showPieces =
    Boolean(
      selectedNeed,
    ) &&
    (!isDirectRequest ||
      includePiecesForDirectRequest);

  return (
    <div>
      <div className="border-b border-[#e0e7ec] pb-7">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-[0.12em] text-[#356f9f]">
            {stepNumber}
          </span>

          <div className="h-px w-8 bg-[#6fa7d1]" />
        </div>

        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-4xl">
          Necessidade e peças
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667887] sm:text-base">
          Comece informando o objetivo principal. Quando a solicitação envolver
          uma peça, você poderá detalhar serviços, requisitos e logística.
        </p>
      </div>

      <RequestNeedSelector
        value={
          requestNeedId
        }
        onChange={
          onRequestNeedChange
        }
      />

      {!selectedNeed && (
        <div className="mt-7 rounded-[18px] border border-dashed border-[#b8ccd7] bg-[#f7fafb] px-5 py-6 text-center">
          <p className="text-sm font-semibold text-[#31566d]">
            Selecione a necessidade principal para continuar.
          </p>

          <p className="mt-2 text-xs leading-5 text-[#718895]">
            O cadastro de peças será exibido somente quando fizer sentido para
            o tipo de atendimento escolhido.
          </p>
        </div>
      )}

      {isDirectRequest &&
        !includePiecesForDirectRequest && (
          <div className="mt-7 rounded-[18px] border border-[#c8dce6] bg-[#f2f8fb] p-5 sm:p-6">
            <p className="text-sm font-semibold text-[#264e66]">
              Esta solicitação pode seguir sem uma peça cadastrada.
            </p>

            <p className="mt-2 text-xs leading-5 text-[#708894]">
              Na próxima etapa, informe o objetivo, o contexto, o prazo e os
              arquivos gerais. Se uma peça ajudar a explicar a demanda, você
              pode adicioná-la de forma opcional.
            </p>

            <button
              type="button"
              onClick={() =>
                onIncludePiecesForDirectRequestChange(
                  true,
                )
              }
              className="mt-4 cursor-pointer rounded-[11px] border border-[#9ebccc] bg-white px-4 py-2.5 text-xs font-semibold text-[#356f9f] transition hover:border-[#6f9fbe] hover:bg-[#eef6fa]"
            >
              + Adicionar peça opcional
            </button>
          </div>
        )}

      {showPieces && (
        <>
          {isDirectRequest && (
            <div className="mt-7 flex flex-col gap-3 rounded-[16px] border border-[#d7e3e9] bg-[#f8fafb] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#31566d]">
                  Peças relacionadas — opcional
                </p>

                <p className="mt-1 text-xs text-[#718895]">
                  Estes dados complementam a demanda, mas não são obrigatórios.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onIncludePiecesForDirectRequestChange(
                    false,
                  )
                }
                className="cursor-pointer text-xs font-semibold text-[#6b7f8b] underline"
              >
                Seguir sem peças
              </button>
            </div>
          )}

          <div className="mt-7 space-y-5">
            {pieces.map(
              (
                piece,
                index,
              ) => (
                <PieceCard
                  key={
                    piece.id
                  }
                  piece={
                    piece
                  }
                  index={
                    index
                  }
                  canDelete={
                    pieces.length >
                    1
                  }
                  onChange={
                    onChange
                  }
                  onDelete={
                    onDelete
                  }
                />
              ),
            )}
          </div>

          <button
            type="button"
            onClick={
              onAdd
            }
            className="
              group mt-5 w-full cursor-pointer
              rounded-[18px]
              border border-dashed border-[#9ebccc]
              bg-[#f5f9fb]
              px-5 py-5
              text-sm font-semibold text-[#356f9f]
              transition-all duration-200
              hover:border-[#6f9fbe]
              hover:bg-[#eef6fa]
            "
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-lg font-normal leading-none">
                +
              </span>

              Adicionar outra peça
            </span>
          </button>

          <p className="mt-3 text-center text-[11px] leading-5 text-[#83939d]">
            Cada nova peça será cadastrada com campos independentes.
          </p>
        </>
      )}
    </div>
  );
}