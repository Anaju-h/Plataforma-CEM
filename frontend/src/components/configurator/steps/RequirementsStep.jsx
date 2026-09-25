import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getService,
  serviceOrder,
} from "../data/serviceCatalog";

import {
  CtRequirements,
} from "../requirements/CtRequirements";

import {
  DimensionalRequirements,
} from "../requirements/DimensionalRequirements";

import {
  ReverseEngineeringRequirements,
} from "../requirements/ReverseEngineeringRequirements";

import {
  ScanningRequirements,
} from "../requirements/ScanningRequirements";

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function RequirementsStep({
  pieces,
  activePieceId,
  onActivePieceChange,
  onPiecesChange,
  section = "primary",
  detailPage = null,
}) {
  const activePiece =
    pieces.find(
      (piece) =>
        piece.id === activePieceId,
    ) ??
    pieces[0];

  const availableServices =
    useMemo(
      () =>
        serviceOrder.filter(
          (serviceId) =>
            activePiece?.services?.includes(
              serviceId,
            ),
        ),
      [
        activePiece,
      ],
    );

  const [
    activeService,
    setActiveService,
  ] = useState(
    availableServices[0] ??
      null,
  );

  const serviceKey =
    availableServices.join(
      "|",
    );

  useEffect(() => {
    if (
      availableServices.length ===
      0
    ) {
      setActiveService(
        null,
      );

      return;
    }

    if (
      !availableServices.includes(
        activeService,
      )
    ) {
      setActiveService(
        availableServices[0],
      );
    }
  }, [
    serviceKey,
    activeService,
    availableServices,
  ]);

  if (!activePiece) {
    return null;
  }

  function patchPiece(
    patch,
  ) {
    onPiecesChange(
      pieces.map(
        (piece) =>
          piece.id ===
          activePiece.id
            ? {
                ...piece,
                ...patch,
              }
            : piece,
      ),
    );
  }

  function patchRequirements(
    key,
    nextValue,
  ) {
    patchPiece({
      requirements: {
        ...activePiece.requirements,

        [key]:
          nextValue,
      },
    });
  }

  const currentService =
    activeService
      ? getService(
          activeService,
        )
      : null;

  return (
    <div>
      {/* =====================================================
          PEÇAS
      ===================================================== */}

      {pieces.length >
        1 && (
        <PieceSelector
          pieces={
            pieces
          }
          activePieceId={
            activePiece.id
          }
          onChange={
            onActivePieceChange
          }
        />
      )}

      {/* =====================================================
          INTRODUÇÃO
      ===================================================== */}

      <StepIntroduction
        section={
          section
        }
        detailPage={
          detailPage
        }
      />

      {/* =====================================================
          SELETOR DE SERVIÇO
      ===================================================== */}

      {availableServices.length >
      1 ? (
        <ServiceSelector
          services={
            availableServices
          }
          activeService={
            activeService
          }
          onChange={
            setActiveService
          }
        />
      ) : (
        currentService && (
          <SingleServiceHeader
            service={
              currentService
            }
          />
        )
      )}

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <div className="mt-4">
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          <motion.div
            key={`${activePiece.id}-${activeService}-${section}-${detailPage ?? "primary"}`}
            initial={{
              opacity: 0,
              x: 10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -8,
            }}
            transition={{
              duration: 0.24,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            {activeService ===
              "dimensional" && (
              <DimensionalRequirements
                value={
                  activePiece.requirements
                    .dimensional
                }
                onChange={(
                  nextValue,
                ) =>
                  patchRequirements(
                    "dimensional",
                    nextValue,
                  )
                }
                section={
                  section
                }
                detailPage={
                  detailPage
                }
              />
            )}

            {activeService ===
              "scan" && (
              <ScanningRequirements
                value={
                  activePiece.requirements
                    .scanning
                }
                onChange={(
                  nextValue,
                ) =>
                  patchRequirements(
                    "scanning",
                    nextValue,
                  )
                }
                section={
                  section
                }
                detailPage={
                  detailPage
                }
              />
            )}

            {activeService ===
              "reverse-engineering" && (
              <ReverseEngineeringRequirements
                value={
                  activePiece.requirements
                    .reverseEngineering
                }
                onChange={(
                  nextValue,
                ) =>
                  patchRequirements(
                    "reverseEngineering",
                    nextValue,
                  )
                }
                section={
                  section
                }
                detailPage={
                  detailPage
                }
              />
            )}

            {activeService ===
              "internal" && (
              <CtRequirements
                value={
                  activePiece.requirements
                    .ct
                }
                onChange={(
                  nextValue,
                ) =>
                  patchRequirements(
                    "ct",
                    nextValue,
                  )
                }
                section={
                  section
                }
                detailPage={
                  detailPage
                }
              />
            )}

            {!activeService && (
              <EmptyRequirements />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =====================================================
          NAVEGAÇÃO ENTRE SERVIÇOS
      ===================================================== */}

      {availableServices.length >
        1 && (
        <ServiceProgress
          services={
            availableServices
          }
          activeService={
            activeService
          }
          activePiece={
            activePiece
          }
          section={
            section
          }
          detailPage={
            detailPage
          }
          onSelect={
            setActiveService
          }
        />
      )}
    </div>
  );
}

/* ============================================================
 * INTRODUÇÃO
 * ============================================================ */

function StepIntroduction({
  section,
  detailPage,
}) {
  if (
    section ===
      "detail" &&
    detailPage ===
      "core"
  ) {
    return (
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6d8795]">
          Critérios técnicos
        </p>

        <h2 className="mt-2.5 max-w-[660px] text-[29px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[32px]">
          Vamos definir o que mais influencia a tecnologia.
        </h2>

        <p className="mt-2.5 max-w-[680px] text-[14px] leading-6 text-[#6f8592]">
          Nesta etapa mostramos apenas o critério técnico de maior impacto para
          cada frente selecionada.
        </p>
      </div>
    );
  }

  if (
    section ===
      "detail" &&
    detailPage ===
      "context"
  ) {
    return (
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6d8795]">
          Condições complementares
        </p>

        <h2 className="mt-2.5 max-w-[660px] text-[29px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[32px]">
          Agora completamos o contexto da análise.
        </h2>

        <p className="mt-2.5 max-w-[680px] text-[14px] leading-6 text-[#6f8592]">
          Aqui entram características adicionais que ajudam a refinar a
          orientação sem concentrar perguntas demais em uma única tela.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6d8795]">
        Requisitos técnicos
      </p>

      <h2 className="mt-2.5 max-w-[660px] text-[29px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[32px]">
        O que realmente importa nesta análise?
      </h2>

      <p className="mt-2.5 max-w-[680px] text-[14px] leading-6 text-[#6f8592]">
        Primeiro definimos o objetivo principal de cada frente. Os critérios
        técnicos serão aprofundados nas próximas etapas.
      </p>
    </div>
  );
}

/* ============================================================
 * SELETOR DE SERVIÇO
 * ============================================================ */

function ServiceSelector({
  services,
  activeService,
  onChange,
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#718a98]">
          Frente em análise
        </p>

        <p className="text-[12px] text-[#8799a2]">
          {services.length}{" "}
          {services.length ===
          1
            ? "frente"
            : "frentes"}
        </p>
      </div>

      <div className="mt-2.5 flex gap-2.5 overflow-x-auto pb-1">
        {services.map(
          (
            serviceId,
            index,
          ) => {
            const service =
              getService(
                serviceId,
              );

            if (!service) {
              return null;
            }

            const selected =
              serviceId ===
              activeService;

            return (
              <button
                key={
                  serviceId
                }
                type="button"
                onClick={() =>
                  onChange(
                    serviceId,
                  )
                }
                className={`
                  flex
                  min-w-[170px]
                  flex-1
                  items-center
                  gap-3
                  rounded-[13px]
                  border
                  px-3
                  py-2.5
                  text-left
                  transition-all
                  duration-300

                  ${
                    selected
                      ? "border-[#8eb6ca]/78 bg-[#e1eef4]/84"
                      : "border-white/76 bg-white/34 hover:border-[#b8ced9] hover:bg-white/56"
                  }
                `}
              >
                <span
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-[11px]
                    font-semibold

                    ${
                      selected
                        ? "border-[#9ebfd0] bg-white/66 text-[#356f9f]"
                        : "border-[#cedce3] bg-white/36 text-[#8a9ca5]"
                    }
                  `}
                >
                  {String(
                    index + 1,
                  ).padStart(
                    2,
                    "0",
                  )}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#31566d]">
                    {service.shortName ??
                      service.name}
                  </p>

                  <p
                    className={`
                      mt-0.5
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.07em]

                      ${
                        selected
                          ? "text-[#58819a]"
                          : "text-[#91a1aa]"
                      }
                    `}
                  >
                    {selected
                      ? "Em análise"
                      : "Selecionar"}
                  </p>
                </div>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * APENAS UM SERVIÇO
 * ============================================================ */

function SingleServiceHeader({
  service,
}) {
  return (
    <div className="mt-5 flex items-center justify-between gap-4 rounded-[14px] border border-[#bed3de]/62 bg-[#e5f0f5]/48 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-[#65b8ee]" />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#72909f]">
            Frente em análise
          </p>

          <p className="mt-0.5 text-[14px] font-semibold text-[#31566d]">
            {service.name}
          </p>
        </div>
      </div>

      <span className="rounded-full border border-white/76 bg-white/42 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#648294]">
        Selecionada
      </span>
    </div>
  );
}

/* ============================================================
 * SELETOR DE PEÇAS
 * ============================================================ */

function PieceSelector({
  pieces,
  activePieceId,
  onChange,
}) {
  return (
    <div className="mb-4 rounded-[15px] border border-white/76 bg-white/28 p-2">
      <div className="flex gap-2 overflow-x-auto">
        {pieces.map(
          (
            piece,
            index,
          ) => {
            const active =
              piece.id ===
              activePieceId;

            return (
              <button
                key={
                  piece.id
                }
                type="button"
                onClick={() =>
                  onChange(
                    piece.id,
                  )
                }
                className={`
                  min-w-[130px]
                  rounded-[10px]
                  border
                  px-3
                  py-2
                  text-left
                  transition-all

                  ${
                    active
                      ? "border-[#91b7ca] bg-[#e1eef4]/82"
                      : "border-transparent bg-white/20 hover:border-[#bed0da] hover:bg-white/46"
                  }
                `}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#83969f]">
                  Peça{" "}
                  {String(
                    index + 1,
                  ).padStart(
                    2,
                    "0",
                  )}
                </p>

                <p className="mt-0.5 truncate text-[13px] font-semibold text-[#31566d]">
                  {piece.name ||
                    "Sem nome"}
                </p>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * PROGRESSO ENTRE SERVIÇOS
 * ============================================================ */

function ServiceProgress({
  services,
  activeService,
  activePiece,
  section,
  detailPage,
  onSelect,
}) {
  return (
    <div className="mt-4 rounded-[14px] border border-white/72 bg-white/27 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#80939e]">
            Outras frentes desta peça
          </p>

          <p className="mt-1 text-[12px] leading-5 text-[#91a0a8]">
            Revise cada frente antes de continuar.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {services.map(
            (
              serviceId,
            ) => {
              const service =
                getService(
                  serviceId,
                );

              if (!service) {
                return null;
              }

              const current =
                serviceId ===
                activeService;

              const complete =
                getServiceCompletion(
                  activePiece,
                  serviceId,
                  section,
                  detailPage,
                );

              return (
                <button
                  key={
                    serviceId
                  }
                  type="button"
                  onClick={() =>
                    onSelect(
                      serviceId,
                    )
                  }
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-2
                    text-[11px]
                    font-semibold
                    transition-all

                    ${
                      current
                        ? "border-[#8fb5c8] bg-[#e0edf4] text-[#416f88]"
                        : "border-[#cbd9e0]/72 bg-white/36 text-[#7c919c] hover:bg-white/58"
                    }
                  `}
                >
                  <span
                    className={`
                      h-2
                      w-2
                      rounded-full

                      ${
                        complete
                          ? "bg-[#6a9e80]"
                          : current
                            ? "bg-[#65b8ee]"
                            : "bg-[#b7c5cc]"
                      }
                    `}
                  />

                  {service.shortName ??
                    service.name}
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * COMPLETUDE
 * ============================================================ */

function getServiceCompletion(
  piece,
  service,
  section,
  detailPage,
) {
  if (
    section ===
    "primary"
  ) {
    return hasGoals(
      piece,
      service,
    );
  }

  if (
    detailPage ===
    "core"
  ) {
    return hasCoreRequirement(
      piece,
      service,
    );
  }

  if (
    detailPage ===
    "context"
  ) {
    return hasContextRequirement(
      piece,
      service,
    );
  }

  return false;
}

/* ============================================================
 * OBJETIVOS
 * ============================================================ */

function hasGoals(
  piece,
  service,
) {
  if (
    service ===
    "dimensional"
  ) {
    return (
      piece.requirements
        .dimensional.goals
        .length >
      0
    );
  }

  if (
    service ===
    "scan"
  ) {
    return (
      piece.requirements
        .scanning.goals
        .length >
      0
    );
  }

  if (
    service ===
    "reverse-engineering"
  ) {
    return (
      piece.requirements
        .reverseEngineering
        .goals.length >
      0
    );
  }

  if (
    service ===
    "internal"
  ) {
    return (
      piece.requirements
        .ct.goals.length >
      0
    );
  }

  return false;
}

/* ============================================================
 * CRITÉRIO PRINCIPAL
 * ============================================================ */

function hasCoreRequirement(
  piece,
  service,
) {
  if (
    service ===
    "dimensional"
  ) {
    return Boolean(
      piece.requirements
        .dimensional
        .toleranceKnowledge,
    );
  }

  if (
    service ===
    "scan"
  ) {
    return Boolean(
      piece.requirements
        .scanning
        .detailLevel,
    );
  }

  if (
    service ===
    "reverse-engineering"
  ) {
    return Boolean(
      piece.requirements
        .reverseEngineering
        .geometryScope,
    );
  }

  if (
    service ===
    "internal"
  ) {
    return Boolean(
      piece.requirements
        .ct.region,
    );
  }

  return false;
}

/* ============================================================
 * CONTEXTO COMPLEMENTAR
 * ============================================================ */

function hasContextRequirement(
  piece,
  service,
) {
  if (
    service ===
    "dimensional"
  ) {
    const dimensional =
      piece.requirements
        .dimensional;

    return Boolean(
      dimensional.nonContactNeeded ||
        dimensional.smallFeatures ||
        dimensional.technicalDrawing ||
        dimensional.cadModel,
    );
  }

  if (
    service ===
    "scan"
  ) {
    const scanning =
      piece.requirements
        .scanning;

    return Boolean(
      scanning.surface ||
        scanning.access,
    );
  }

  if (
    service ===
    "reverse-engineering"
  ) {
    const reverse =
      piece.requirements
        .reverseEngineering;

    return Boolean(
      reverse.existingModel ||
        reverse.needsModification,
    );
  }

  if (
    service ===
    "internal"
  ) {
    const ct =
      piece.requirements
        .ct;

    return Boolean(
      ct.canBeDisassembled ||
        ct.mustRemainIntact,
    );
  }

  return false;
}

/* ============================================================
 * ESTADO VAZIO
 * ============================================================ */

function EmptyRequirements() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-[18px] border border-dashed border-[#b8ced8]/70 bg-white/24 p-6 text-center">
      <div>
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#c3d5de] bg-white/48 text-[18px] font-light text-[#71909f]">
          +
        </div>

        <p className="mt-3 text-[14px] font-semibold text-[#45697d]">
          Nenhuma frente selecionada
        </p>

        <p className="mx-auto mt-1.5 max-w-[360px] text-[12px] leading-5 text-[#8799a2]">
          Volte às etapas anteriores e selecione pelo menos uma frente de
          análise para esta peça.
        </p>
      </div>
    </div>
  );
}