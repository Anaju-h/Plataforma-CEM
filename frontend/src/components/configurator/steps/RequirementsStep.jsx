import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  RequirementProgress,
} from "../components/RequirementProgress";

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

export function RequirementsStep({
  pieces,
  activePieceId,
  onActivePieceChange,
  onPiecesChange,
}) {
  const activePiece =
    pieces.find(
      (piece) =>
        piece.id ===
        activePieceId,
    ) ??
    pieces[0];

  const [
    activeService,
    setActiveService,
  ] = useState(
    activePiece?.services[0] ??
      null,
  );

  useEffect(() => {
    if (!activePiece) {
      return;
    }

    if (
      !activeService ||
      !activePiece.services.includes(
        activeService,
      )
    ) {
      setActiveService(
        activePiece.services[0] ??
          null,
      );
    }
  }, [
    activePiece,
    activeService,
  ]);

  const completedServices =
    useMemo(() => {
      if (!activePiece) {
        return [];
      }

      return activePiece.services.filter(
        (service) =>
          isServiceComplete(
            activePiece,
            service,
          ),
      );
    }, [
      activePiece,
    ]);

  if (!activePiece) {
    return null;
  }

  function updatePiece(
    nextPiece,
  ) {
    onPiecesChange(
      pieces.map(
        (piece) =>
          piece.id ===
          nextPiece.id
            ? nextPiece
            : piece,
      ),
    );
  }

  function updateDimensional(
    requirements,
  ) {
    updatePiece({
      ...activePiece,

      requirements: {
        ...activePiece.requirements,

        dimensional:
          requirements,
      },
    });
  }

  function updateScanning(
    requirements,
  ) {
    updatePiece({
      ...activePiece,

      requirements: {
        ...activePiece.requirements,

        scanning:
          requirements,
      },
    });
  }

  function updateReverseEngineering(
    requirements,
  ) {
    updatePiece({
      ...activePiece,

      requirements: {
        ...activePiece.requirements,

        reverseEngineering:
          requirements,
      },
    });
  }

  function updateCt(
    requirements,
  ) {
    updatePiece({
      ...activePiece,

      requirements: {
        ...activePiece.requirements,

        ct:
          requirements,
      },
    });
  }

  function goToNextService() {
    if (!activeService) {
      return;
    }

    const currentIndex =
      activePiece.services.indexOf(
        activeService,
      );

    const nextService =
      activePiece.services[
        currentIndex + 1
      ];

    if (nextService) {
      setActiveService(
        nextService,
      );
    }
  }

  function goToPreviousService() {
    if (!activeService) {
      return;
    }

    const currentIndex =
      activePiece.services.indexOf(
        activeService,
      );

    const previousService =
      activePiece.services[
        currentIndex - 1
      ];

    if (previousService) {
      setActiveService(
        previousService,
      );
    }
  }

  const serviceIndex =
    activeService
      ? activePiece.services.indexOf(
          activeService,
        )
      : 0;

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[#dbeaf3] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#1476b8]">
          03 / 05
        </span>

        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#78909e]">
          Requisitos
        </span>
      </div>

      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-[2rem]">
        O que essa aplicação exige?
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-[#667d8b] sm:text-base">
        As perguntas mudam de acordo com os serviços escolhidos. Responda o
        que souber; quando necessário, você poderá continuar mesmo sem
        conhecimento técnico.
      </p>

      {pieces.length > 1 && (
        <div className="mt-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718997]">
            Componente
          </p>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {pieces.map(
              (
                piece,
                index,
              ) => {
                const selected =
                  piece.id ===
                  activePiece.id;

                return (
                  <button
                    key={piece.id}
                    type="button"
                    onClick={() => {
                      onActivePieceChange(
                        piece.id,
                      );

                      setActiveService(
                        piece.services[0] ??
                          null,
                      );
                    }}
                    className={`
                      min-w-[145px]
                      shrink-0
                      rounded-[14px]
                      border
                      px-4
                      py-3
                      text-left
                      transition-all

                      ${
                        selected
                          ? "border-[#61a1ca] bg-[#e0eef6]"
                          : "border-[#d0dce3] bg-[#edf3f6] hover:border-[#adc4d1]"
                      }
                    `}
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718897]">
                      Peça{" "}
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-[#17394f]">
                      {piece.name.trim() ||
                        "Sem nome"}
                    </p>

                    <p className="mt-1 text-[10px] text-[#788d99]">
                      {
                        piece.services.length
                      }{" "}
                      {piece.services.length ===
                      1
                        ? "serviço"
                        : "serviços"}
                    </p>
                  </button>
                );
              },
            )}
          </div>
        </div>
      )}

      {activePiece.services.length ===
      0 ? (
        <div className="mt-6 rounded-[18px] border border-[#d4dce1] bg-[#eef2f4] p-5">
          <p className="text-sm font-semibold text-[#526a79]">
            Nenhum serviço foi selecionado para esta peça.
          </p>

          <p className="mt-2 text-xs leading-5 text-[#7a8d98]">
            Volte à etapa anterior e indique o que precisa ser realizado neste
            componente.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <RequirementProgress
              services={
                activePiece.services
              }
              activeService={
                activeService ??
                activePiece.services[0]
              }
              completedServices={
                completedServices
              }
              onServiceChange={
                setActiveService
              }
            />
          </div>

          <div className="mt-5">
            {activeService ===
              "dimensional" && (
              <DimensionalRequirements
                value={
                  activePiece
                    .requirements
                    .dimensional
                }
                onChange={
                  updateDimensional
                }
              />
            )}

            {activeService ===
              "scan" && (
              <ScanningRequirements
                value={
                  activePiece
                    .requirements
                    .scanning
                }
                onChange={
                  updateScanning
                }
              />
            )}

            {activeService ===
              "reverse-engineering" && (
              <ReverseEngineeringRequirements
                value={
                  activePiece
                    .requirements
                    .reverseEngineering
                }
                onChange={
                  updateReverseEngineering
                }
              />
            )}

            {activeService ===
              "internal" && (
              <CtRequirements
                value={
                  activePiece
                    .requirements
                    .ct
                }
                onChange={
                  updateCt
                }
              />
            )}
          </div>

          {activePiece.services.length >
            1 && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-[16px] border border-[#d0dce3] bg-[#edf3f6] p-3">
              <button
                type="button"
                disabled={
                  serviceIndex <=
                  0
                }
                onClick={
                  goToPreviousService
                }
                className="
                  rounded-lg
                  border
                  border-[#cad8e0]
                  bg-white
                  px-3
                  py-2.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]
                  text-[#597486]
                  transition

                  hover:border-[#a9c0cd]

                  disabled:cursor-not-allowed
                  disabled:opacity-30

                  sm:px-4
                  sm:text-[10px]
                "
              >
                ← Anterior
              </button>

              <span className="shrink-0 text-[10px] font-medium text-[#718794]">
                {serviceIndex + 1} /{" "}
                {
                  activePiece.services.length
                }
              </span>

              <button
                type="button"
                disabled={
                  serviceIndex ===
                  activePiece.services.length -
                    1
                }
                onClick={
                  goToNextService
                }
                className="
                  rounded-lg
                  border
                  border-[#9bbdd1]
                  bg-[#dfeef6]
                  px-3
                  py-2.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]
                  text-[#286d98]
                  transition

                  hover:border-[#6fa7c8]

                  disabled:cursor-not-allowed
                  disabled:opacity-30

                  sm:px-4
                  sm:text-[10px]
                "
              >
                Próximo →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function isServiceComplete(
  piece,
  service,
) {
  switch (service) {
    case "dimensional": {
      const requirements =
        piece.requirements.dimensional;

      return (
        requirements.goals.length >
          0 &&
        Boolean(
          requirements.toleranceKnowledge,
        )
      );
    }

    case "scan": {
      const requirements =
        piece.requirements.scanning;

      return (
        requirements.goals.length >
          0 &&
        Boolean(
          requirements.detailLevel,
        )
      );
    }

    case "reverse-engineering": {
      const requirements =
        piece.requirements
          .reverseEngineering;

      return (
        requirements.goals.length >
          0 &&
        Boolean(
          requirements.geometryScope,
        )
      );
    }

    case "internal": {
      const requirements =
        piece.requirements.ct;

      return (
        requirements.goals.length >
          0 &&
        Boolean(
          requirements.region,
        )
      );
    }

    default:
      return false;
  }
}