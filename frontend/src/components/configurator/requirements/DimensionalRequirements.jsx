import {
  AnimatePresence,
  motion,
} from "motion/react";

/* ============================================================
 * OPÇÕES
 * ============================================================ */

const goals = [
  {
    id: "dimensions",
    title: "Dimensões da peça",
    description:
      "Preciso verificar medidas lineares, diâmetros, distâncias ou outras dimensões.",
  },
  {
    id: "tolerances",
    title: "Tolerâncias",
    description:
      "Quero verificar se características estão dentro dos limites especificados.",
  },
  {
    id: "geometry",
    title: "Geometria e forma",
    description:
      "Preciso analisar forma, posição, orientação ou relações geométricas.",
  },
  {
    id: "comparison",
    title: "Comparação com especificação",
    description:
      "Quero comparar a peça com desenho, modelo ou requisito definido.",
  },
  {
    id: "other",
    title: "Outro objetivo",
    description:
      "Existe outra necessidade relacionada à medição dimensional.",
  },
  {
    id: "unknown",
    title: "Ainda não sei",
    description:
      "Sei que preciso medir a peça, mas ainda não defini exatamente quais características.",
  },
];

const toleranceOptions = [
  {
    value: "exact",
    title: "Conheço o valor",
    description:
      "Tenho disponível a menor tolerância crítica do projeto.",
  },
  {
    value: "high-precision",
    title: "Exige alta precisão",
    description:
      "Não sei o valor exato, mas sei que a aplicação possui requisitos rigorosos.",
  },
  {
    value: "exists-but-unknown",
    title: "Existem tolerâncias, mas não conheço os valores",
    description:
      "O desenho possui tolerâncias que ainda serão consultadas.",
  },
  {
    value: "not-critical",
    title: "Não existem tolerâncias críticas",
    description:
      "A aplicação não possui exigência elevada de precisão conhecida.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "A equipe poderá ajudar a identificar o nível de precisão necessário.",
  },
];

const smallFeatureOptions = [
  {
    value: "yes",
    title: "Sim",
    description:
      "Existem detalhes, furos, canais ou características pequenas importantes.",
  },
  {
    value: "no",
    title: "Não",
    description:
      "As características relevantes não são especialmente pequenas.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "Ainda não consigo avaliar o tamanho das características.",
  },
];

const referenceOptions = [
  {
    value: "yes",
    label: "Sim",
  },
  {
    value: "no",
    label: "Não",
  },
  {
    value: "unknown",
    label: "Não sei",
  },
];

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function DimensionalRequirements({
  value,
  onChange,
  section = "primary",
  detailPage = null,
}) {
  function toggleGoal(goalId) {
    const selected =
      value.goals.includes(goalId);

    onChange({
      ...value,

      goals: selected
        ? value.goals.filter(
            (item) =>
              item !== goalId,
          )
        : [
            ...value.goals,
            goalId,
          ],
    });
  }

  /* ==========================================================
   * ETAPA 05 — CRITÉRIO PRINCIPAL
   * ========================================================== */

  if (
    section === "detail" &&
    detailPage === "core"
  ) {
    return (
      <DimensionalCoreSection
        value={value}
        onChange={onChange}
      />
    );
  }

  /* ==========================================================
   * ETAPA 06 — CONDIÇÕES COMPLEMENTARES
   * ========================================================== */

  if (
    section === "detail" &&
    detailPage === "context"
  ) {
    return (
      <DimensionalContextSection
        value={value}
        onChange={onChange}
      />
    );
  }

  /* ==========================================================
   * ETAPA 04 — OBJETIVOS
   * ========================================================== */

  return (
    <div>
      <IntroBox
        title="Medição dimensional"
        text="Primeiro queremos entender qual é o objetivo principal da medição. Os critérios de precisão e demais condições serão definidos nas próximas etapas."
      />

      <div className="mt-5">
        <QuestionBlock
          number="01"
          title="O que você precisa verificar?"
          help="Você pode selecionar mais de um objetivo."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {goals.map(
              (goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.025,
                  }}
                >
                  <ChoiceCard
                    selected={
                      value.goals.includes(
                        goal.id,
                      )
                    }
                    title={
                      goal.title
                    }
                    description={
                      goal.description
                    }
                    onClick={() =>
                      toggleGoal(
                        goal.id,
                      )
                    }
                  />
                </motion.div>
              ),
            )}
          </div>
        </QuestionBlock>
      </div>
    </div>
  );
}

/* ============================================================
 * ETAPA 05 — CRITÉRIO PRINCIPAL
 * ============================================================ */

function DimensionalCoreSection({
  value,
  onChange,
}) {
  return (
    <div>
      <IntroBox
        title="Precisão dimensional"
        text="A tolerância é o principal critério para diferenciar as tecnologias de medição dimensional."
      />

      <div className="mt-5">
        <QuestionBlock
          number="01"
          title="O que você sabe sobre as tolerâncias?"
          help="Se souber a menor tolerância crítica, informe o valor. Caso contrário, selecione a opção mais próxima da sua realidade."
          important
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {toleranceOptions.map(
              (option) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    value.toleranceKnowledge ===
                    option.value
                  }
                  title={
                    option.title
                  }
                  description={
                    option.description
                  }
                  onClick={() =>
                    onChange({
                      ...value,

                      toleranceKnowledge:
                        option.value,

                      criticalToleranceMm:
                        option.value ===
                        "exact"
                          ? value.criticalToleranceMm
                          : "",
                    })
                  }
                />
              ),
            )}
          </div>

          <AnimatePresence>
            {value.toleranceKnowledge ===
              "exact" && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -4,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -4,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-[14px] border border-[#bed4df]/62 bg-[#e5f0f5]/52 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#648294]">
                    Menor tolerância relevante
                  </p>

                  <div className="relative mt-2.5 max-w-[240px]">
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      value={
                        value.criticalToleranceMm
                      }
                      onChange={(
                        event,
                      ) =>
                        onChange({
                          ...value,

                          criticalToleranceMm:
                            event.target.value,
                        })
                      }
                      placeholder="0,010"
                      className="h-11 w-full rounded-[12px] border border-white/82 bg-white/48 px-3 pr-11 text-[13px] font-semibold text-[#294f65] outline-none transition-all placeholder:font-normal placeholder:text-[#a3b0b7] focus:border-[#91b6c8] focus:bg-white/74 focus:ring-2 focus:ring-[#65b8ee]/10"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#879aa4]">
                      mm
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </QuestionBlock>
      </div>
    </div>
  );
}

/* ============================================================
 * ETAPA 06 — CONDIÇÕES COMPLEMENTARES
 * ============================================================ */

function DimensionalContextSection({
  value,
  onChange,
}) {
  return (
    <div>
      <IntroBox
        title="Condições da medição"
        text="Agora avaliamos características que podem influenciar o sensor, a estratégia de medição e a preparação do projeto."
      />

      <div className="mt-5 space-y-4">
        <QuestionBlock
          number="01"
          title="A peça possui regiões que não podem ser tocadas?"
          help="Isso pode aumentar a relevância de tecnologias ópticas ou sem contato."
        >
          <YesNoUnknownChoice
            value={
              value.nonContactNeeded
            }
            onChange={(
              answer,
            ) =>
              onChange({
                ...value,

                nonContactNeeded:
                  answer,
              })
            }
          />
        </QuestionBlock>

        <QuestionBlock
          number="02"
          title="Existem pequenas características importantes?"
          help="Detalhes reduzidos podem influenciar o sensor e a estratégia de medição."
        >
          <div className="grid gap-2.5 sm:grid-cols-3">
            {smallFeatureOptions.map(
              (option) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    value.smallFeatures ===
                    option.value
                  }
                  title={
                    option.title
                  }
                  description={
                    option.description
                  }
                  onClick={() =>
                    onChange({
                      ...value,

                      smallFeatures:
                        option.value,
                    })
                  }
                />
              ),
            )}
          </div>
        </QuestionBlock>

        <QuestionBlock
          number="03"
          title="Quais referências técnicas estão disponíveis?"
          help="Esses arquivos podem ajudar na preparação e validação do projeto."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <ReferenceChoice
              title="Desenho técnico"
              description="Existe desenho com medidas, tolerâncias ou especificações."
              value={
                value.technicalDrawing
              }
              onChange={(
                answer,
              ) =>
                onChange({
                  ...value,

                  technicalDrawing:
                    answer,
                })
              }
            />

            <ReferenceChoice
              title="Modelo CAD"
              description="Existe um modelo digital disponível para comparação ou referência."
              value={
                value.cadModel
              }
              onChange={(
                answer,
              ) =>
                onChange({
                  ...value,

                  cadModel:
                    answer,
                })
              }
            />
          </div>
        </QuestionBlock>
      </div>
    </div>
  );
}

/* ============================================================
 * COMPONENTES VISUAIS
 * ============================================================ */

function IntroBox({
  title,
  text,
}) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-[#bdd4df]/64 bg-[#e4f0f5]/50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-14 h-28 w-28 rounded-full bg-white/24 blur-[35px]"
      />

      <div className="relative z-10 flex items-start gap-3">
        <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#65b8ee]" />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5d8094]">
            {title}
          </p>

          <p className="mt-2 text-[12px] leading-5 text-[#6f8592]">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuestionBlock({
  number,
  title,
  help,
  children,
  important = false,
}) {
  return (
    <section
      className={`
        rounded-[17px]
        border
        p-4
        shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]
        backdrop-blur-[14px]

        ${
          important
            ? "border-[#b7d0dc]/72 bg-[#e9f3f7]/54"
            : "border-white/76 bg-white/30"
        }
      `}
    >
      <div className="flex items-start gap-3">
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
            text-[10px]
            font-semibold

            ${
              important
                ? "border-[#9fc1d2]/76 bg-[#dcebf2]/72 text-[#4d7890]"
                : "border-[#cad9e1]/78 bg-white/44 text-[#688697]"
            }
          `}
        >
          {number}
        </span>

        <div>
          <p className="text-[14px] font-semibold leading-5 text-[#31566d]">
            {title}
          </p>

          {help && (
            <p className="mt-1 text-[11px] leading-5 text-[#82949e]">
              {help}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3.5">
        {children}
      </div>
    </section>
  );
}

function ChoiceCard({
  selected,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        w-full
        overflow-hidden
        rounded-[13px]
        border
        px-4
        py-3
        text-left
        transition-all
        duration-300

        ${
          selected
            ? "border-[#83b2cd]/82 bg-[#e3f0f5]/86"
            : "border-white/74 bg-white/38 hover:-translate-y-[1px] hover:border-[#bfd3de] hover:bg-white/62"
        }
      `}
    >
      <div
        aria-hidden="true"
        className={`
          absolute
          bottom-0
          left-0
          top-0
          w-[3px]
          transition-opacity

          ${
            selected
              ? "bg-[#65b8ee] opacity-100"
              : "opacity-0"
          }
        `}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold leading-5 text-[#31566d]">
            {title}
          </p>

          {description && (
            <p className="mt-1 text-[11px] leading-5 text-[#7c909b]">
              {description}
            </p>
          )}
        </div>

        <span
          className={`
            mt-0.5
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            text-[10px]
            font-semibold

            ${
              selected
                ? "border-[#12364e] bg-[#12364e] text-white"
                : "border-[#cddce3] bg-white/54 text-transparent"
            }
          `}
        >
          ✓
        </span>
      </div>
    </button>
  );
}

function YesNoUnknownChoice({
  value,
  onChange,
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {referenceOptions.map(
        (option) => (
          <CompactChoice
            key={
              option.value
            }
            selected={
              value ===
              option.value
            }
            label={
              option.label
            }
            onClick={() =>
              onChange(
                option.value,
              )
            }
          />
        ),
      )}
    </div>
  );
}

function ReferenceChoice({
  title,
  description,
  value,
  onChange,
}) {
  return (
    <div className="rounded-[14px] border border-white/76 bg-white/34 p-4">
      <p className="text-[13px] font-semibold text-[#31566d]">
        {title}
      </p>

      <p className="mt-1.5 min-h-[40px] text-[11px] leading-5 text-[#81949e]">
        {description}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {referenceOptions.map(
          (option) => (
            <CompactChoice
              key={
                option.value
              }
              selected={
                value ===
                option.value
              }
              label={
                option.label
              }
              onClick={() =>
                onChange(
                  option.value,
                )
              }
            />
          ),
        )}
      </div>
    </div>
  );
}

function CompactChoice({
  selected,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-h-[42px]
        items-center
        justify-center
        rounded-[11px]
        border
        px-2.5
        py-2
        text-center
        text-[11px]
        font-semibold
        transition-all
        duration-300

        ${
          selected
            ? "border-[#12364e] bg-[#12364e] text-white"
            : "border-white/78 bg-white/42 text-[#667f8d] hover:border-[#aac4d0] hover:bg-white/66 hover:text-[#356f9f]"
        }
      `}
    >
      {label}
    </button>
  );
}