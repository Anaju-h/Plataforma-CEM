import {
  motion,
} from "motion/react";

import {
  Link,
} from "react-router-dom";

import {
  directRequestNeeds,
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
          NECESSIDADES QUE VÃO DIRETO PARA SOLICITAÇÃO
      ===================================================== */}

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#628397]">
            Outras soluções do Centro
          </p>

          <div className="h-px flex-1 bg-[#bfd2dc]/72" />
        </div>

        <p className="mt-2 max-w-[640px] text-[12px] leading-5 text-[#80929c]">
          Estas necessidades dependem de uma avaliação mais ampla e seguem
          diretamente para atendimento da equipe do Centro.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {directRequestNeeds.map(
            (
              solution,
              index,
            ) => (
              <motion.div
                key={
                  solution.id
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
                    (index +
                      technicalRequestNeeds.length) *
                    0.025,

                  duration:
                    0.25,
                }}
              >
                <Link
                  to={`/orcamento?origem=configurador&necessidade=${solution.id}`}
                  state={{
                    configuratorNeed: {
                      id:
                        solution.id,

                      name:
                        solution.name,

                      title:
                        solution.title,

                      tag:
                        solution.tag,
                    },
                  }}
                  className="group relative flex h-full min-h-[132px] overflow-hidden rounded-[16px] border border-white/78 bg-white/30 p-4 text-left transition-all duration-300 hover:-translate-y-[2px] hover:border-[#a7c5d4] hover:bg-white/56 hover:shadow-[0_10px_26px_rgba(31,68,92,0.055)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#65b8ee]/55 transition-colors duration-300 group-hover:bg-[#65b8ee]"
                  />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#bfd2dc] bg-white/46 text-[11px] font-semibold text-[#6d8794] transition-colors group-hover:border-[#91b5c7] group-hover:text-[#477b98]">
                        {
                          solution.number
                        }
                      </span>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c5d8e1] bg-white/34 text-[15px] text-[#64889d] transition-all duration-300 group-hover:border-[#12364e] group-hover:bg-[#12364e] group-hover:text-white">
                        ↗
                      </span>
                    </div>

                    <p className="mt-3 text-[14px] font-semibold leading-5 text-[#264e66]">
                      {
                        solution.title
                      }
                    </p>

                    <p className="mt-1.5 text-[12px] leading-5 text-[#7b909c]">
                      {
                        solution.description
                      }
                    </p>

                    <p className="mt-auto pt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#668da3]">
                      {
                        solution.tag
                      }
                    </p>
                  </div>
                </Link>
              </motion.div>
            ),
          )}
        </div>
      </div>

      {/* =====================================================
          SOLICITAÇÃO LIVRE
      ===================================================== */}

      <div className="mt-4 rounded-[16px] border border-[#a9c9d9]/76 bg-[#deedf4]/52 px-4 py-3.5">
        <div className="flex items-start gap-3">
          <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#65b8ee]" />

          <div>
            <p className="text-[13px] font-semibold text-[#315d75]">
              Ainda não encontrou exatamente o que precisa?
            </p>

            <p className="mt-1.5 text-[12px] leading-5 text-[#708894]">
              Você também pode enviar uma solicitação diretamente para a equipe
              e descrever livremente o seu desafio.
            </p>

            <Link
              to="/orcamento"
              className="mt-3 inline-flex items-center gap-2 text-[12px] font-semibold text-[#356f9f] transition-colors hover:text-[#12364e]"
            >
              Solicitar atendimento

              <span>
                →
              </span>
            </Link>
          </div>
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