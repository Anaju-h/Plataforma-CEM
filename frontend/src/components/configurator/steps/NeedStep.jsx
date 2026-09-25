import {
  motion,
} from "motion/react";


import {
  technicalRequestNeeds,
} from "../../../data/requestNeeds";

import {
  getService,
} from "../data/serviceCatalog";


export function NeedStep({
  value = [],
  onChange,

  selectedSituations = [],
  onSelectedSituationsChange,
}) {
  function toggleSituation(
    situation,
  ) {
    const isSelected =
      selectedSituations.includes(
        situation.id,
      );

    const nextSelected =
      isSelected
        ? selectedSituations.filter(
            (id) =>
              id !==
              situation.id,
          )
        : [
            ...selectedSituations,
            situation.id,
          ];

    onSelectedSituationsChange?.(
      nextSelected,
    );

    const nextServices =
      Array.from(
        new Set(
          nextSelected.flatMap(
            (situationId) => {
              const selectedSituation =
                technicalRequestNeeds.find(
                  (item) =>
                    item.id ===
                    situationId,
                );

              return (
                selectedSituation
                  ?.services ??
                []
              );
            },
          ),
        ),
      );

    onChange(
      nextServices,
    );
  }

  const hasSelection =
    selectedSituations.length >
    0;

  return (
    <div>
      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[#b8d2df]/72 bg-[#dcecf3]/76 px-3 py-1.5 text-[12px] font-semibold tracking-[0.11em] text-[#477b98]">
          01 / 07
        </span>

        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#78909d]">
          Necessidade
        </span>
      </div>

      <h2 className="mt-4 max-w-[650px] text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[33px]">
        O que você quer conseguir?
      </h2>

      <p className="mt-3 max-w-[680px] text-[14px] leading-6 text-[#6f8592]">
        Não é necessário saber qual serviço, equipamento ou tecnologia
        utilizar. Escolha a situação que melhor representa a sua necessidade.
      </p>

      {/* =====================================================
          NECESSIDADES COM CONFIGURAÇÃO TÉCNICA
      ===================================================== */}

      <div className="mt-5">
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#628397]">
            Análise técnica guiada
          </p>

          <div className="h-px flex-1 bg-[#bfd2dc]/72" />
        </div>

        <p className="mt-2 max-w-[640px] text-[12px] leading-5 text-[#80929c]">
          Estas necessidades podem ser refinadas pelo configurador até uma
          orientação inicial de tecnologia e equipamento.
        </p>

        <div className="mt-4 grid gap-3">
          {technicalRequestNeeds.map(
            (
              situation,
              index,
            ) => {
              const selected =
                selectedSituations.includes(
                  situation.id,
                );

              return (
                <motion.button
                  key={
                    situation.id
                  }
                  type="button"
                  aria-pressed={
                    selected
                  }
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index *
                      0.025,

                    duration:
                      0.25,
                  }}
                  onClick={() =>
                    toggleSituation(
                      situation,
                    )
                  }
                  className={`
                    group
                    relative
                    flex
                    min-h-[88px]
                    w-full
                    items-center
                    gap-4
                    overflow-hidden
                    rounded-[16px]
                    border
                    px-4
                    py-3.5
                    text-left
                    transition-all
                    duration-300

                    ${
                      selected
                        ? "border-[#82b3ce]/84 bg-[#dfeef5]/82 shadow-[0_8px_22px_rgba(53,111,159,0.055)]"
                        : "border-white/78 bg-white/34 hover:-translate-y-[1px] hover:border-[#b5ccd8] hover:bg-white/57"
                    }
                  `}
                >
                  <span
                    aria-hidden="true"
                    className={`
                      absolute
                      bottom-0
                      left-0
                      top-0
                      w-[3px]
                      transition-all
                      duration-300

                      ${
                        selected
                          ? "bg-[#65b8ee] opacity-100"
                          : "bg-transparent opacity-0"
                      }
                    `}
                  />

                  <span
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      text-[12px]
                      font-semibold
                      transition-all
                      duration-300

                      ${
                        selected
                          ? "border-[#12364e] bg-[#12364e] text-white"
                          : "border-[#bfd2dc] bg-white/48 text-[#6d8794] group-hover:border-[#91b5c7]"
                      }
                    `}
                  >
                    {selected
                      ? "✓"
                      : situation.number}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold leading-5 text-[#264e66] sm:text-[15px]">
                      {
                        situation.title
                      }
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-[#7b909c]">
                      {
                        situation.description
                      }
                    </p>

                    <p
                      className={`
                        mt-2
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        transition-colors

                        ${
                          selected
                            ? "text-[#477f9f]"
                            : "text-[#8aa0ab]"
                        }
                      `}
                    >
                      {
                        situation.tag
                      }
                    </p>
                  </div>

                  <span
                    className={`
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      text-[15px]
                      font-light
                      transition-all
                      duration-300

                      ${
                        selected
                          ? "border-[#8fb8cc] bg-white/52 text-[#356f9f]"
                          : "border-[#c6d7df] bg-white/28 text-[#8197a2] group-hover:border-[#9bbdcd] group-hover:text-[#477b98]"
                      }
                    `}
                  >
                    {selected
                      ? "−"
                      : "+"}
                  </span>
                </motion.button>
              );
            },
          )}
        </div>
      </div>

      {/* =====================================================
          ORIENTAÇÃO INICIAL
      ===================================================== */}

      {hasSelection && (
        <motion.div
          initial={{
            opacity: 0,
            y: 6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-4 rounded-[16px] border border-white/74 bg-white/30 px-4 py-3.5"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#8096a1]">
              Orientação inicial
            </p>

            <div className="flex flex-wrap gap-2">
              {value.map(
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

                  return (
                    <span
                      key={
                        serviceId
                      }
                      className="rounded-full border border-[#b9d0dc]/72 bg-[#e3eff4]/70 px-3 py-1.5 text-[11px] font-semibold text-[#52788e]"
                    >
                      {
                        service.name
                      }
                    </span>
                  );
                },
              )}
            </div>
          </div>

          <p className="mt-2.5 text-[12px] leading-5 text-[#7f929c]">
            Essas categorias são utilizadas apenas para iniciar a análise.
            O configurador ainda irá comparar características da peça,
            requisitos técnicos e condições de atendimento antes de indicar
            tecnologias com maior aderência.
          </p>
        </motion.div>
      )}
    </div>
  );
}