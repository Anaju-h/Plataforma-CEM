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
  RequestFilters,
} from "../../components/internal/RequestFilters";

import {
  StatusBadge,
} from "../../components/internal/StatusBadge";

import {
  requests,
} from "../../data/internal/requests";

export function RequestsPage() {
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

  const [
    origin,
    setOrigin,
  ] = useState("Todas");

  const filteredRequests =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return requests.filter(
        (request) => {
          const matchesSearch =
            !normalizedSearch ||
            [
              request.id,
              request.company,
              request.contact,
              request.service,
            ].some((value) =>
              value
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ),
            );

          const matchesStatus =
            status === "Todos" ||
            request.status ===
              status;

          const matchesOrigin =
            origin === "Todas" ||
            request.origin ===
              origin;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesOrigin
          );
        },
      );
    }, [
      search,
      status,
      origin,
    ]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Operação"
        title="Solicitações"
        description="Acompanhe as solicitações recebidas pelo formulário público e pelo configurador."
        action={
          <button
            type="button"
            className="
              w-fit
              rounded-[12px]
              bg-[#096ab2]
              px-5 py-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-white
              transition
              hover:bg-[#075b99]
            "
          >
            + Nova solicitação
          </button>
        }
      />

      <div className="mt-7">
        <RequestFilters
          search={search}
          onSearchChange={
            setSearch
          }
          status={status}
          onStatusChange={
            setStatus
          }
          origin={origin}
          onOriginChange={
            setOrigin
          }
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white shadow-[0_12px_35px_rgba(34,67,90,0.035)]">
        <div className="flex items-center justify-between border-b border-[#e0e7ec] px-5 py-4 sm:px-6">
          <div>
            <p className="text-sm font-semibold text-[#17394f]">
              Solicitações recebidas
            </p>

            <p className="mt-1 text-[11px] text-[#80919b]">
              {
                filteredRequests.length
              }{" "}
              {filteredRequests.length ===
              1
                ? "resultado"
                : "resultados"}
            </p>
          </div>
        </div>

        <div className="hidden grid-cols-[125px_1.35fr_1fr_0.95fr_145px_44px] gap-4 border-b border-[#e5ebef] bg-[#f7fafb] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#708795] lg:grid">
          <span>ID / Data</span>
          <span>Cliente</span>
          <span>Serviço</span>
          <span>Responsável</span>
          <span>Status</span>
          <span />
        </div>

        <div className="divide-y divide-[#e6ecef]">
          {filteredRequests.map(
            (request) => (
              <RequestRow
                key={
                  request.id
                }
                request={
                  request
                }
                onOpen={() =>
                  navigate(
                    `/portal/solicitacoes/${request.id}`,
                  )
                }
              />
            ),
          )}

          {filteredRequests.length ===
            0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-semibold text-[#536f80]">
                Nenhuma solicitação encontrada.
              </p>

              <p className="mt-2 text-xs text-[#82939d]">
                Ajuste os filtros ou tente outra busca.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RequestRow({
  request,
  onOpen,
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="
        grid w-full
        gap-4
        px-5 py-5
        text-left
        transition
        hover:bg-[#f7fafb]

        sm:px-6
        lg:grid-cols-[125px_1.35fr_1fr_0.95fr_145px_44px]
        lg:items-center
      "
    >
      <div>
        <p className="text-[10px] font-semibold tracking-[0.07em] text-[#356f9f]">
          {request.id}
        </p>

        <p className="mt-1 text-[10px] text-[#8999a3]">
          {request.createdAt}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#17394f]">
          {request.company}
        </p>

        <p className="mt-1 truncate text-[11px] text-[#7c8f9a]">
          {request.contact} ·{" "}
          {request.origin}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-[#466478]">
          {request.service}
        </p>

        <p className="mt-1 text-[10px] text-[#85959e]">
          {request.parts}{" "}
          {request.parts === 1
            ? "peça"
            : "peças"}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-[#536f80]">
          {
            request.responsible
          }
        </p>

        <p className="mt-1 text-[10px] text-[#8797a0]">
          {request.priority}
        </p>
      </div>

      <div>
        <StatusBadge
          status={
            request.status
          }
        />
      </div>

      <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#d2e0e7] bg-[#f5f9fb] text-[#56809a] lg:flex">
        →
      </div>
    </button>
  );
}