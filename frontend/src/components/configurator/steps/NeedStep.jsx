import {
  motion,
} from "motion/react";

/* ============================================================
 * SITUAÇÕES
 * ============================================================ */

const needSituations = [
  {
    id: "check-piece",

    number: "01",

    title:
      "Quero conferir se uma peça está correta",

    description:
      "Verificar medidas, geometria, tolerâncias ou conformidade com um desenho.",

    tag:
      "Medição dimensional",

    services: [
      "dimensional",
    ],
  },

  {
    id: "physical-to-3d",

    number: "02",

    title:
      "Quero transformar uma peça física em um modelo 3D",

    description:
      "Capturar digitalmente a geometria existente para gerar uma representação tridimensional.",

    tag:
      "Digitalização 3D",

    services: [
      "scan",
    ],
  },

  {
    id: "reproduce-piece",

    number: "03",

    title:
      "Preciso reproduzir uma peça sem ter o projeto original",

    description:
      "Reconstruir digitalmente a geometria da peça para documentação, desenvolvimento ou fabricação.",

    tag:
      "Engenharia reversa",

    services: [
      "reverse-engineering",
    ],
  },

  {
    id: "compare-cad",

    number: "04",

    title:
      "Quero comparar a peça real com um arquivo CAD",

    description:
      "Digitalizar a peça para avaliar diferenças entre a geometria fabricada e o modelo digital.",

    tag:
      "Comparação 3D",

    services: [
      "scan",
    ],
  },

  {
    id: "inside",

    number: "05",

    title:
      "Preciso enxergar ou analisar o interior da peça",

    description:
      "Investigar regiões internas, montagem, defeitos ou características que não podem ser acessadas externamente.",

    tag:
      "CT / análise interna",

    services: [
      "internal",
    ],
  },
];

/* ============================================================
 * COMPONENTE
 * ============================================================ */

export function NeedStep({
  value,
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

    /*
     * projectServices é recalculado a partir das
     * situações efetivamente marcadas.
     *
     * Isso NÃO controla o estado visual dos cards.
     */
    const nextServices =
      Array.from(
        new Set(
          nextSelected.flatMap(
            (situationId) => {
              const selectedSituation =
                needSituations.find(
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
        <span className="rounded-full border border-[#b8d2df]/72 bg-[#dcecf3]/76 px-3 py-1.5 text-[11px] font-semibold tracking-[0.11em] text-[#477b98]">
          01 / 07
        </span>

        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78909d]">
          Necessidade
        </span>
      </div>

      <h2 className="mt-4 max-w-[650px] text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[33px]">
        O que você quer conseguir?
      </h2>

      <p className="mt-3 max-w-[680px] text-[13px] leading-6 text-[#6f8592]">
        Não é necessário saber qual serviço, equipamento ou tecnologia
        utilizar. Escolha apenas as situações que representam o seu objetivo.
      </p>

      {/* =====================================================
          SITUAÇÕES
      ===================================================== */}

      <div className="mt-5 grid gap-3">
        {needSituations.map(
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
                {/* BARRA */}

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

                {/* NÚMERO / CHECK */}

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
                    text-[11px]
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

                {/* TEXTO */}

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-5 text-[#264e66] sm:text-[14px]">
                    {
                      situation.title
                    }
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#7b909c]">
                    {
                      situation.description
                    }
                  </p>

                  <p
                    className={`
                      mt-2
                      text-[10px]
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

                {/* DIREITA */}

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

      {/* =====================================================
          CASO NÃO SE ENQUADRE
      ===================================================== */}

      <div className="mt-3 rounded-[16px] border border-[#a9c9d9]/76 bg-[#deedf4]/52 px-4 py-3.5">
        <div className="flex items-start gap-3">
          <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#65b8ee]" />

          <div>
            <p className="text-[12px] font-semibold text-[#315d75]">
              Nenhuma opção representa exatamente o seu caso?
            </p>

            <p className="mt-1.5 text-[11px] leading-5 text-[#708894]">
              Escolha a situação mais próxima. Nas próximas etapas você poderá
              detalhar a peça e a orientação será refinada sem assumir uma
              solução definitiva.
            </p>
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#8096a1]">
              Orientação inicial
            </p>

            <div className="flex flex-wrap gap-2">
              {value.map(
                (serviceId) => {
                  const service =
                    getServiceSafe(
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
                      className="rounded-full border border-[#b9d0dc]/72 bg-[#e3eff4]/70 px-3 py-1.5 text-[10px] font-semibold text-[#52788e]"
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

          <p className="mt-2.5 text-[11px] leading-5 text-[#7f929c]">
            Essas categorias são usadas apenas para iniciar a análise. Elas não
            significam que um equipamento ou solução já foi definido.
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ============================================================
 * SERVIÇOS
 * ============================================================ */

function getServiceSafe(
  serviceId,
) {
  const services = {
    dimensional: {
      name:
        "Medição dimensional",
    },

    scan: {
      name:
        "Digitalização 3D",
    },

    "reverse-engineering": {
      name:
        "Engenharia reversa",
    },

    internal: {
      name:
        "CT / análise interna",
    },
  };

  return (
    services[serviceId] ??
    null
  );
}