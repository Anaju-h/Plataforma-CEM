import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  useState,
} from "react";

import {
  getService,
  serviceOrder,
} from "../data/serviceCatalog";

import type {
  ServiceId,
} from "../types";

type NeedStepProps = {
  value: ServiceId[];

  onChange: (
    services: ServiceId[],
  ) => void;
};

type GuidedSituation = {
  id: string;

  title: string;

  description: string;

  services: ServiceId[];
};

const guidedSituations: GuidedSituation[] = [
  {
    id: "check-piece",

    title:
      "Tenho uma peça e quero saber se ela está correta",

    description:
      "Por exemplo, conferir medidas, geometria ou se a peça está de acordo com um desenho.",

    services: [
      "dimensional",
    ],
  },

  {
    id: "physical-to-3d",

    title:
      "Tenho uma peça física e preciso transformá-la em um arquivo 3D",

    description:
      "O objetivo é obter uma representação digital da geometria existente.",

    services: [
      "scan",
    ],
  },

  {
    id: "reproduce-piece",

    title:
      "Tenho uma peça, mas não tenho o projeto e preciso reproduzi-la",

    description:
      "O projeto pode envolver captura da geometria e reconstrução de um modelo digital.",

    services: [
      "scan",
      "reverse-engineering",
    ],
  },

  {
    id: "compare-cad",

    title:
      "Tenho um CAD e quero comparar a peça real com ele",

    description:
      "A comparação pode envolver aquisição tridimensional e análise da geometria física.",

    services: [
      "scan",
    ],
  },

  {
    id: "inside",

    title:
      "Preciso entender o que existe ou acontece dentro da peça",

    description:
      "Por exemplo, visualizar regiões internas, defeitos, montagem ou outras características não acessíveis externamente.",

    services: [
      "internal",
    ],
  },

  {
    id: "rebuild-inside",

    title:
      "Preciso reconstruir uma peça que também possui geometria interna importante",

    description:
      "Nesse caso, a aquisição pode envolver informações externas e internas antes da reconstrução digital.",

    services: [
      "reverse-engineering",
      "internal",
    ],
  },
];

export function NeedStep({
  value,
  onChange,
}: NeedStepProps) {
  const [
    guidedOpen,
    setGuidedOpen,
  ] = useState(false);

  function toggleService(
    service:
      ServiceId,
  ) {
    const selected =
      value.includes(
        service,
      );

    if (selected) {
      onChange(
        value.filter(
          (item) =>
            item !==
            service,
        ),
      );

      return;
    }

    onChange([
      ...value,
      service,
    ]);
  }

  function selectSituation(
    situation:
      GuidedSituation,
  ) {
    const merged =
      Array.from(
        new Set([
          ...value,
          ...situation.services,
        ]),
      );

    onChange(
      merged,
    );

    setGuidedOpen(
      false,
    );
  }

  return (
    <div>
      {/* =====================================================
          INTRODUÇÃO
      ===================================================== */}

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[#dbeaf3] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#1476b8]">
          01 / 05
        </span>

        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#78909e]">
          Necessidade
        </span>
      </div>

      <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-[2rem]">
        O que você precisa fazer?
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-[#667d8b] sm:text-base">
        Selecione uma ou mais situações. Você não precisa saber qual
        equipamento ou tecnologia é a mais adequada agora.
      </p>

      {/* =====================================================
          SERVIÇOS / OBJETIVOS
      ===================================================== */}

      <div className="mt-7 grid gap-3">
        {serviceOrder.map(
          (
            service,
            index,
          ) => {
            const item =
              getService(
                service,
              );

            const selected =
              value.includes(
                service,
              );

            return (
              <motion.button
                key={
                  service
                }
                type="button"
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index *
                    0.045,
                }}
                onClick={() =>
                  toggleService(
                    service,
                  )
                }
                className={`
                  group
                  relative
                  flex w-full
                  items-start
                  gap-4
                  overflow-hidden
                  rounded-[18px]
                  border
                  px-4 py-4
                  text-left
                  transition-all
                  duration-300

                  sm:px-5
                  sm:py-5

                  ${
                    selected
                      ? "border-[#63a3cb] bg-[#e0eef6] shadow-[0_12px_30px_rgba(53,111,159,0.08)]"
                      : "border-[#d0dce3] bg-[#edf3f6] hover:border-[#adc4d1] hover:bg-[#e8f0f4]"
                  }
                `}
              >
                {/* Linha lateral */}
                <AnimatePresence>
                  {selected && (
                    <motion.span
                      initial={{
                        scaleY: 0,
                      }}
                      animate={{
                        scaleY: 1,
                      }}
                      exit={{
                        scaleY: 0,
                      }}
                      className="absolute inset-y-0 left-0 w-[4px] origin-center bg-[#1476b8]"
                    />
                  )}
                </AnimatePresence>

                {/* Número */}
                <div
                  className={`
                    flex h-11 w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-[11px]
                    font-semibold
                    transition-all

                    ${
                      selected
                        ? "border-[#7baed0] bg-white text-[#1476b8]"
                        : "border-[#cad8e0] bg-[#f8fbfc] text-[#758894]"
                    }
                  `}
                >
                  {selected
                    ? "✓"
                    : String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-5 text-[#17394f] sm:text-[15px]">
                    {
                      item.userFacingTitle
                    }
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-[#708592]">
                    {
                      item.explanation
                    }
                  </p>

                  <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#5681a0]">
                    {
                      item.name
                    }
                  </p>
                </div>

                <span
                  className={`
                    mt-2
                    text-lg
                    transition-all
                    duration-300

                    ${
                      selected
                        ? "rotate-0 text-[#1476b8]"
                        : "text-[#9baeb9] group-hover:text-[#5e8da9]"
                    }
                  `}
                >
                  {selected
                    ? "✓"
                    : "+"}
                </span>
              </motion.button>
            );
          },
        )}
      </div>

      {/* =====================================================
          CAMINHO PARA QUEM NÃO SABE
      ===================================================== */}

      <div className="mt-5 overflow-hidden rounded-[20px] border border-[#bdd1dc] bg-[#e5eff5]">
        <button
          type="button"
          onClick={() =>
            setGuidedOpen(
              (current) =>
                !current,
            )
          }
          className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
        >
          <div>
            <p className="text-sm font-semibold text-[#214f6b]">
              Não sei qual dessas opções representa meu problema
            </p>

            <p className="mt-1 text-xs leading-5 text-[#658091]">
              Podemos começar pelo que você quer conseguir, sem usar termos
              técnicos.
            </p>
          </div>

          <span
            className={`
              flex h-9 w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#b4cbd8]
              bg-white/60
              text-[#47738d]
              transition-transform
              duration-300

              ${
                guidedOpen
                  ? "rotate-45"
                  : ""
              }
            `}
          >
            +
          </span>
        </button>

        <AnimatePresence initial={false}>
          {guidedOpen && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height:
                  "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration:
                  0.28,
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#c7d8e1] p-4 sm:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
                  Qual situação parece mais próxima?
                </p>

                <div className="mt-3 grid gap-2.5">
                  {guidedSituations.map(
                    (
                      situation,
                    ) => (
                      <button
                        key={
                          situation.id
                        }
                        type="button"
                        onClick={() =>
                          selectSituation(
                            situation,
                          )
                        }
                        className="group flex w-full items-start gap-3 rounded-[14px] border border-[#c8d8e0] bg-[#f7fafb] px-4 py-3.5 text-left transition hover:border-[#86b0c8] hover:bg-white"
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c5d7e0] bg-white text-xs text-[#5d8198] transition group-hover:border-[#79accb] group-hover:text-[#1476b8]">
                          →
                        </div>

                        <div>
                          <p className="text-xs font-semibold leading-5 text-[#294e64]">
                            {
                              situation.title
                            }
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-[#758b98]">
                            {
                              situation.description
                            }
                          </p>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =====================================================
          SELEÇÃO ATUAL
      ===================================================== */}

      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 4,
            }}
            className="mt-5 rounded-[18px] border border-[#c8d9e2] bg-[#f3f7f9] p-4"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718997]">
              Seu projeto pode envolver
            </p>

            <div className="mt-2.5 flex flex-wrap gap-2">
              {value.map(
                (service) => (
                  <span
                    key={
                      service
                    }
                    className="rounded-full border border-[#b8cedb] bg-[#e2eef5] px-3 py-1.5 text-[10px] font-medium text-[#416b84]"
                  >
                    {
                      getService(
                        service,
                      ).name
                    }
                  </span>
                ),
              )}
            </div>

            <p className="mt-3 text-[11px] leading-5 text-[#758b98]">
              Essas são apenas possibilidades iniciais. As próximas etapas
              irão entender a peça e os requisitos antes de priorizar uma
              tecnologia.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}