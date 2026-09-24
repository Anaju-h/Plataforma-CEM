import {
  useMemo,
  useState,
  useEffect,
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
  requestStatuses,
} from "../../data/internal/requests";

import { getActiveRequests, isArchivedRequest } from "../../services/requestService";

import {
  getServiceLabel as getCatalogServiceLabel,
} from "../../data/serviceCatalog";

const CANONICAL_ORIGINS = [
  "Público",
  "Cliente",
  "Interno",
];

/* ============================================================
 * PÁGINA
 * ============================================================ */

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
  ] = useState(
    "Todos",
  );

  const [
    origin,
    setOrigin,
  ] = useState(
    "Todas",
  );

  /*
   * Nesta fase os dados ficam em memória.
   *
   * A leitura passa pelo service para que a página não conheça
   * diretamente a implementação de persistência.
   *
   * Depois, requestService poderá consumir a API.
   */
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let active = true;
    getActiveRequests().then((items) => {
      if (active) setRequests(items);
    }).catch((error) => {
      if (active) setLoadError(error.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [reloadKey]);

  /* ==========================================================
   * FILTROS
   * ========================================================== */

  const filteredRequests =
    useMemo(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase();

        return requests.filter(
          (
            request,
          ) => {
            const matchesSearch =
              !normalizedSearch ||
              getRequestSearchValues(
                request,
              ).some(
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
              request.status ===
                status;

            const matchesOrigin =
              origin ===
                "Todas" ||
              request.origin ===
                origin;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesOrigin
            );
          },
        );
      },
      [
        requests,
        search,
        status,
        origin,
      ],
    );

  /* ==========================================================
   * RESUMOS
   * ========================================================== */

  const summary =
    useMemo(
      () => ({
        total:
          requests.length,

        new:
          requests.filter(
            (request) =>
              request.status ===
              "Nova",
          ).length,

        analysis:
          requests.filter(
            (request) =>
              request.status ===
              "Em análise",
          ).length,

        waiting:
          requests.filter(
            (request) =>
              request.status ===
              "Aguardando informações",
          ).length,

        ready:
          requests.filter(
            (request) =>
              request.status ===
              "Apta para orçamento",
          ).length,
      }),
      [
        requests,
      ],
    );

  const hasActiveFilters =
    Boolean(
      search.trim(),
    ) ||
    status !== "Todos" ||
    origin !== "Todas";

  /* ==========================================================
   * AÇÕES
   * ========================================================== */

  function handleResetFilters() {
    setSearch(
      "",
    );

    setStatus(
      "Todos",
    );

    setOrigin(
      "Todas",
    );
  }

  function handleNewRequest() {
    navigate(
      "/portal/solicitacoes/nova",
    );
  }

  function handleOpenRequest(
    requestId,
  ) {
    navigate(
      `/portal/solicitacoes/${requestId}`,
    );
  }

  /* ==========================================================
   * RENDER
   * ========================================================== */

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      {loading && <p role="status">Carregando solicitações...</p>}
      {loadError && <div role="alert" className="text-red-700">{loadError} <button type="button" className="underline" onClick={() => { setLoading(true); setLoadError(""); setReloadKey((value) => value + 1); }}>Tentar novamente</button></div>}
      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <InternalPageHeader
        eyebrow="Operação"
        title="Solicitações"
        description="Acompanhe as demandas recebidas pelos canais públicos, pela área do cliente e pelos registros internos da equipe."
        action={
          <button
            type="button"
            onClick={
              handleNewRequest
            }
            className="
              internal-card-title
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
            <span className="text-[18px] font-light leading-none">
              +
            </span>

            Nova solicitação
          </button>
        }
      />

      {/* =====================================================
          INDICADORES
      ===================================================== */}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="Total"
          value={
            summary.total
          }
          description="Solicitações registradas"
        />

        <SummaryCard
          label="Novas"
          value={
            summary.new
          }
          description="Aguardando início"
        />

        <SummaryCard
          label="Em análise"
          value={
            summary.analysis
          }
          description="Avaliação técnica"
        />

        <SummaryCard
          label="Pendências"
          value={
            summary.waiting
          }
          description="Aguardando informações"
        />

        <SummaryCard
          label="Aptas"
          value={
            summary.ready
          }
          description="Prontas para orçamento"
        />
      </div>

      {/* =====================================================
          FILTROS
      ===================================================== */}

      <div className="mt-5">
        <RequestFilters
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
          origin={
            origin
          }
          onOriginChange={
            setOrigin
          }
          statusOptions={requestStatuses.filter(status => !isArchivedRequest({ status }))}
          originOptions={
            getAvailableOrigins(
              requests,
            )
          }
          hasActiveFilters={
            hasActiveFilters
          }
          onReset={
            handleResetFilters
          }
        />
      </div>

      {/* =====================================================
          LISTAGEM
      ===================================================== */}

      <section className="mt-5 overflow-hidden rounded-[22px] border border-[#cadce5] bg-white/72 shadow-[0_12px_34px_rgba(31,68,92,0.055)] backdrop-blur-[18px]">
        {/* TOPO */}

        <div className="flex flex-col gap-3 border-b border-[#dce7ec] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="internal-section-title font-semibold text-[#17394f]">
              Fila de solicitações
            </h2>

            <p className="internal-card-description mt-1 text-[#607987]">
              Priorize a análise técnica e acompanhe a evolução de cada demanda.
            </p>
          </div>

          <div className="rounded-full border border-[#c7dbe5] bg-[#edf5f8] px-3 py-1.5">
            <span className="internal-card-title font-semibold text-[#496f84]">
              {
                filteredRequests.length
              }{" "}
              {filteredRequests.length ===
              1
                ? "resultado"
                : "resultados"}
            </span>
          </div>
        </div>

        {/* DESKTOP */}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f4f8fa]/85">
                <TableHeader>
                  Solicitação
                </TableHeader>

                <TableHeader>
                  Cliente
                </TableHeader>

                <TableHeader>
                  Serviço
                </TableHeader>

                <TableHeader>
                  Origem
                </TableHeader>

                <TableHeader>
                  Responsável
                </TableHeader>

                <TableHeader>
                  Status
                </TableHeader>

                <TableHeader align="right">
                  Ação
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map(
                (
                  request,
                ) => (
                  <tr
                    key={
                      request.id
                    }
                    onClick={() =>
                      handleOpenRequest(
                        request.id,
                      )
                    }
                    className="
                      cursor-pointer
                      border-t
                      border-[#e1eaee]
                      transition-colors
                      duration-150
                      hover:bg-[#f3f8fa]
                    "
                  >
                    <td className="px-5 py-4 align-middle">
                      <p className="internal-card-title font-semibold text-[#17394f]">
                        {
                          request.id
                        }
                      </p>

                      <p className="internal-help-text mt-1 text-[#526d7c]">
                        {
                          request.createdAt
                        }
                      </p>
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <p className="internal-card-title max-w-[220px] truncate font-semibold text-[#294c60]">
                        {
                          request.company
                        }
                      </p>

                      <p className="internal-help-text mt-1 max-w-[220px] truncate text-[#526d7c]">
                        {
                          request.contact
                        }
                      </p>
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <p className="internal-card-title max-w-[220px] font-medium text-[#365a6d]">
                        {getServiceLabel(
                          request,
                        )}
                      </p>

                      <p className="internal-help-text mt-1 text-[#526d7c]">
                        {formatParts(
                          request.parts,
                        )}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <OriginBadge
                        request={
                          request
                        }
                      />
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <p className="internal-card-title max-w-[180px] truncate font-medium text-[#4b6878]">
                        {request.responsible ||
                          "Não atribuído"}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <StatusBadge
                        status={
                          request.status
                        }
                      />
                    </td>

                    <td className="px-5 py-4 text-right align-middle">
                      <button
                        type="button"
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();

                          handleOpenRequest(
                            request.id,
                          );
                        }}
                        className="
                          internal-card-title
                          cursor-pointer
                          rounded-[10px]
                          border
                          border-[#c7dbe5]
                          bg-white
                          px-3
                          py-2
                          font-semibold
                          text-[#3e6d86]
                          transition
                          hover:border-[#9fbfce]
                          hover:bg-[#edf5f8]
                          hover:text-[#174e6d]
                        "
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE / TABLET */}

        <div className="divide-y divide-[#e1eaee] lg:hidden">
          {filteredRequests.map(
            (
              request,
            ) => (
              <button
                key={
                  request.id
                }
                type="button"
                onClick={() =>
                  handleOpenRequest(
                    request.id,
                  )
                }
                className="
                  block
                  w-full
                  cursor-pointer
                  px-5
                  py-5
                  text-left
                  transition
                  hover:bg-[#f3f8fa]
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="internal-card-title font-semibold text-[#17394f]">
                        {
                          request.id
                        }
                      </p>

                      <OriginBadge
                        request={
                          request
                        }
                      />
                    </div>

                    <p className="internal-card-title mt-2 truncate font-semibold text-[#294c60]">
                      {
                        request.company
                      }
                    </p>

                    <p className="internal-help-text mt-1 truncate text-[#526d7c]">
                      {
                        request.contact
                      }
                    </p>
                  </div>

                  <StatusBadge
                    status={
                      request.status
                    }
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 rounded-[14px] bg-[#f3f7f9] p-4">
                  <MobileInfo
                    label="Serviço"
                    value={getServiceLabel(
                      request,
                    )}
                  />

                  <MobileInfo
                    label="Peças"
                    value={formatParts(
                      request.parts,
                    )}
                  />

                  <MobileInfo
                    label="Responsável"
                    value={
                      request.responsible ||
                      "Não atribuído"
                    }
                  />

                  <MobileInfo
                    label="Entrada"
                    value={
                      request.createdAt
                    }
                  />
                </div>
              </button>
            ),
          )}
        </div>

        {/* VAZIO */}

        {!loading && !loadError && filteredRequests.length ===
          0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#edf5f8] text-[20px] text-[#5f879c]">
              ↗
            </div>

            <h3 className="internal-section-title mt-4 font-semibold text-[#294c60]">
              Nenhuma solicitação encontrada
            </h3>

            <p className="internal-card-description mx-auto mt-2 max-w-[420px] text-[#526d7c]">
              Ajuste os filtros utilizados ou registre uma nova solicitação
              recebida pela equipe do laboratório.
            </p>

            <button
              type="button"
              onClick={
                handleNewRequest
              }
              className="
                internal-card-title
                mt-5
                cursor-pointer
                rounded-[11px]
                bg-[#12364e]
                px-4
                py-2.5
                font-semibold
                text-white
                transition
                hover:bg-[#0d2d41]
              "
            >
              Nova solicitação
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/* ============================================================
 * CARD DE RESUMO
 * ============================================================ */

function SummaryCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-[18px] border border-[#cadce5] bg-white/62 px-4 py-3 shadow-[0_8px_24px_rgba(31,68,92,0.04)] backdrop-blur-[16px]">
      <p className="internal-eyebrow font-semibold uppercase text-[#607f90]">
        {label}
      </p>

      <div className="mt-1 flex items-end justify-between gap-3">
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

/* ============================================================
 * CABEÇALHO DA TABELA
 * ============================================================ */

function TableHeader({
  children,
  align = "left",
}) {
  return (
    <th
      className={`internal-eyebrow
        px-5
        py-3.5
        font-semibold
        uppercase
        text-[#526d7c]

        ${
          align ===
          "right"
            ? "text-right"
            : "text-left"
        }
      `}
    >
      {children}
    </th>
  );
}

/* ============================================================
 * ORIGEM
 * ============================================================ */

function OriginBadge({
  request,
}) {
  const origin =
    request.origin ||
    "Não informada";

  const isInternal =
    origin ===
    "Interno";

  const isPublic =
    origin ===
    "Público";

  const isCustomer =
    origin ===
    "Cliente";

  let classes =
    "border-[#c9d9e1] bg-[#f3f7f9] text-[#607987]";

  if (
    isInternal
  ) {
    classes =
      "border-[#a9cadb] bg-[#e5f1f6] text-[#315f79]";
  } else if (
    isPublic
  ) {
    classes =
      "border-[#b8d3e4] bg-[#edf5fa] text-[#356f9f]";
  } else if (
    isCustomer
  ) {
    classes =
      "border-[#bfd7d1] bg-[#edf6f3] text-[#44756a]";
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <span
        className={`internal-card-title
          inline-flex
          rounded-full
          border
          px-2.5
          py-1
          font-semibold
          ${classes}
        `}
      >
        {origin}
      </span>

      {request.channel && (
        <span className="internal-help-text pl-1 text-[#526d7c]">
          {request.channel}
        </span>
      )}
    </div>
  );
}

/* ============================================================
 * MOBILE
 * ============================================================ */

function MobileInfo({
  label,
  value,
}) {
  return (
    <div className="min-w-0">
      <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
        {label}
      </p>

      <p className="internal-card-title mt-1 truncate font-medium text-[#3f6072]">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
 * HELPERS
 * ============================================================ */

function getServiceLabel(
  request,
) {
  if (
    request.service &&
    request.service !==
      "Não definido"
  ) {
    return getCatalogServiceLabel(
      request.service,
    );
  }

  if (
    Array.isArray(
      request.services,
    ) &&
    request.services.length >
      0
  ) {
    if (
      request.services.length ===
      1
    ) {
      return getCatalogServiceLabel(
        request.services[0],
      );
    }

    return `${getCatalogServiceLabel(
      request.services[0],
    )} +${request.services.length - 1}`;
  }

  return "Serviço não definido";
}

function formatParts(
  value,
) {
  const amount =
    Number(
      value ||
      0,
    );

  return `${amount} ${
    amount ===
    1
      ? "unidade"
      : "unidades"
  }`;
}

function getRequestSearchValues(
  request,
) {
  const serviceValues = [
    request.service,

    ...(Array.isArray(
      request.services,
    )
      ? request.services
      : []),
  ].filter(
    Boolean,
  );

  const serviceLabels =
    serviceValues.map(
      (service) =>
        getCatalogServiceLabel(
          service,
        ),
    );

  return [
    request.id,
    request.company,
    request.contact,
    request.email,
    request.phone,
    request.responsible,
    request.origin,
    request.channel,
    request.objective,
    request.requestNeedId,
    request.requestNeed?.name,
    ...serviceValues,
    ...serviceLabels,
  ].filter(
    Boolean,
  );
}

function getAvailableOrigins(
  requests,
) {
  const availableOrigins =
    new Set(
      requests
        .map(
          (request) =>
            request.origin,
        )
        .filter(
          Boolean,
        ),
    );

  const ordered =
    CANONICAL_ORIGINS.filter(
      (origin) =>
        availableOrigins.has(
          origin,
        ),
    );

  const additional =
    Array.from(
      availableOrigins,
    ).filter(
      (origin) =>
        !CANONICAL_ORIGINS.includes(
          origin,
        ),
    );

  return [
    "Todas",
    ...ordered,
    ...additional,
  ];
}
