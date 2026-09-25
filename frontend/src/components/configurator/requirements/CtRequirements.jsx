import {
  motion,
} from "motion/react";

/* ============================================================
 * OPÇÕES
 * ============================================================ */

const goals = [
  {
    id: "internal-geometry",
    title: "Visualizar geometrias internas",
    description:
      "Preciso enxergar cavidades, canais ou regiões que não são acessíveis externamente.",
  },
  {
    id: "defects",
    title: "Identificar defeitos internos",
    description:
      "Quero investigar trincas, vazios, inclusões ou outras descontinuidades internas.",
  },
  {
    id: "porosity",
    title: "Analisar porosidade",
    description:
      "Preciso verificar a presença, distribuição ou dimensão de poros dentro do material.",
  },
  {
    id: "assembly",
    title: "Avaliar um conjunto montado",
    description:
      "Quero observar como componentes internos estão posicionados sem desmontar o conjunto.",
  },
  {
    id: "internal-position",
    title: "Verificar posição interna",
    description:
      "Preciso avaliar o posicionamento de componentes ou características internas.",
  },
  {
    id: "internal-dimensions",
    title: "Medir características internas",
    description:
      "Preciso obter informações dimensionais de regiões que não podem ser acessadas externamente.",
  },
  {
    id: "internal-reconstruction",
    title: "Reconstruir a geometria interna",
    description:
      "Quero obter uma representação tridimensional das regiões internas da peça.",
  },
  {
    id: "other",
    title: "Outro objetivo",
    description:
      "Existe outra necessidade relacionada à análise interna da peça.",
  },
  {
    id: "unknown",
    title: "Ainda não sei",
    description:
      "Sei que preciso investigar o interior da peça, mas ainda não defini exatamente o resultado esperado.",
  },
];

const regionOptions = [
  {
    value: "whole-piece",
    title: "Peça completa",
    description:
      "A análise precisa abranger todo o volume da peça.",
  },
  {
    value: "specific-region",
    title: "Região específica",
    description:
      "Existe uma área de interesse definida dentro da peça.",
  },
  {
    value: "assembled-set",
    title: "Conjunto montado",
    description:
      "O interesse está na relação entre componentes dentro de um conjunto.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "A região de interesse ainda precisa ser identificada.",
  },
];

const disassemblyOptions = [
  {
    value: "yes",
    title: "Sim",
    description:
      "A peça ou conjunto pode ser desmontado sem comprometer a análise.",
  },
  {
    value: "no",
    title: "Não",
    description:
      "A análise precisa ocorrer com a peça ou conjunto nas condições atuais.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "Ainda preciso verificar se a desmontagem é possível.",
  },
];

const intactOptions = [
  {
    value: "yes",
    title: "Sim",
    description:
      "A peça precisa permanecer íntegra durante todo o processo.",
  },
  {
    value: "no",
    title: "Não necessariamente",
    description:
      "A integridade completa da peça não é uma exigência do projeto.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "Essa condição ainda precisa ser definida.",
  },
];

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function CtRequirements({
  value,
  onChange,
  section = "primary",
  detailPage = null,
}) {
  function toggleGoal(
    goalId,
  ) {
    const selected =
      value.goals.includes(
        goalId,
      );

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
      <CtCoreSection
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
      <CtContextSection
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
        title="Tomografia industrial"
        text="Primeiro queremos entender o que precisa ser observado dentro da peça. A região de interesse e as condições de inspeção serão definidas nas próximas etapas."
      />

      <div className="mt-5">
        <QuestionBlock
          number="01"
          title="O que você precisa analisar internamente?"
          help="Você pode selecionar mais de um objetivo."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {goals.map(
              (
                goal,
                index,
              ) => (
                <motion.div
                  key={
                    goal.id
                  }
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
                      index *
                      0.02,
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

function CtCoreSection({
  value,
  onChange,
}) {
  return (
    <div>
      <IntroBox
        title="Região de interesse"
        text="O principal critério nesta etapa é entender qual volume realmente precisa ser analisado."
      />

      <div className="mt-5">
        <QuestionBlock
          number="01"
          title="Qual região precisa ser analisada?"
          help="Essa informação ajuda a entender se o interesse está no volume completo, em uma região específica ou em um conjunto montado."
          important
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {regionOptions.map(
              (
                option,
              ) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    value.region ===
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

                      region:
                        option.value,
                    })
                  }
                />
              ),
            )}
          </div>
        </QuestionBlock>
      </div>
    </div>
  );
}

/* ============================================================
 * ETAPA 06 — CONDIÇÕES COMPLEMENTARES
 * ============================================================ */

function CtContextSection({
  value,
  onChange,
}) {
  return (
    <div>
      <IntroBox
        title="Condições da inspeção"
        text="Agora verificamos se a peça pode ser desmontada e se precisa permanecer íntegra durante a análise."
      />

      <div className="mt-5 space-y-4">
        <QuestionBlock
          number="01"
          title="A peça ou conjunto pode ser desmontado?"
          help="A possibilidade de desmontagem pode mudar a estratégia de inspeção."
        >
          <div className="grid gap-2.5 sm:grid-cols-3">
            {disassemblyOptions.map(
              (
                option,
              ) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    value.canBeDisassembled ===
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

                      canBeDisassembled:
                        option.value,
                    })
                  }
                />
              ),
            )}
          </div>
        </QuestionBlock>

        <QuestionBlock
          number="02"
          title="A peça precisa permanecer intacta?"
          help="Essa condição é especialmente importante quando a análise precisa ocorrer sem corte ou destruição da peça."
        >
          <div className="grid gap-2.5 sm:grid-cols-3">
            {intactOptions.map(
              (
                option,
              ) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    value.mustRemainIntact ===
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

                      mustRemainIntact:
                        option.value,
                    })
                  }
                />
              ),
            )}
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
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#5d8094]">
            {title}
          </p>

          <p className="mt-2 text-[13px] leading-5 text-[#6f8592]">
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
            text-[11px]
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
          <p className="text-[15px] font-semibold leading-5 text-[#31566d]">
            {title}
          </p>

          {help && (
            <p className="mt-1 text-[12px] leading-5 text-[#82949e]">
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
      onClick={
        onClick
      }
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
          <p className="text-[14px] font-semibold leading-5 text-[#31566d]">
            {title}
          </p>

          {description && (
            <p className="mt-1 text-[12px] leading-5 text-[#7c909b]">
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
            text-[11px]
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