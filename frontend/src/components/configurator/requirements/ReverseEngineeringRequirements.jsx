import {
  motion,
} from "motion/react";

/* ============================================================
 * OPÇÕES
 * ============================================================ */

const goals = [
  {
    id: "cad-model",
    title: "Gerar um modelo CAD",
    description:
      "Quero transformar a geometria da peça física em um modelo digital utilizável.",
  },
  {
    id: "full-reconstruction",
    title: "Reconstrução completa",
    description:
      "Preciso reconstruir integralmente a geometria da peça para documentação, desenvolvimento ou fabricação.",
  },
  {
    id: "partial-reconstruction",
    title: "Reconstrução parcial",
    description:
      "Preciso reconstruir apenas determinadas regiões ou características da peça.",
  },
  {
    id: "editable-model",
    title: "Criar um modelo editável",
    description:
      "O resultado precisa permitir futuras alterações e desenvolvimento no CAD.",
  },
  {
    id: "manufacturing-file",
    title: "Gerar arquivo para fabricação",
    description:
      "Preciso de uma representação digital que possa apoiar a reprodução da peça.",
  },
  {
    id: "update-existing-project",
    title: "Atualizar um projeto existente",
    description:
      "Existe um projeto ou modelo anterior, mas ele precisa ser atualizado conforme a peça física.",
  },
  {
    id: "other",
    title: "Outro objetivo",
    description:
      "Existe outra necessidade relacionada à reconstrução digital da peça.",
  },
  {
    id: "unknown",
    title: "Ainda não sei",
    description:
      "Preciso reconstruir a peça, mas ainda não defini exatamente qual deve ser o resultado final.",
  },
];

const existingModelOptions = [
  {
    value: "yes",
    title: "Sim, existe um modelo",
    description:
      "Existe um CAD ou projeto digital que pode ser usado como referência.",
  },
  {
    value: "no",
    title: "Não existe",
    description:
      "A peça física é atualmente a principal referência disponível.",
  },
  {
    value: "outdated",
    title: "Existe, mas está desatualizado",
    description:
      "Há um modelo anterior, porém ele não representa completamente a peça atual.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "Ainda preciso verificar se existe algum arquivo ou projeto anterior.",
  },
];

const geometryScopeOptions = [
  {
    value: "external",
    title: "Somente geometria externa",
    description:
      "A reconstrução depende principalmente das superfícies visíveis externamente.",
  },
  {
    value: "internal",
    title: "Geometrias internas",
    description:
      "A reconstrução precisa considerar regiões internas ou não acessíveis externamente.",
  },
  {
    value: "both",
    title: "Geometrias externas e internas",
    description:
      "O resultado precisa representar tanto superfícies externas quanto características internas.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "Ainda não consigo determinar quais regiões precisam ser reconstruídas.",
  },
];

const modificationOptions = [
  {
    value: "yes",
    title: "Sim",
    description:
      "O modelo precisa ser ajustado, corrigido ou modificado em relação à peça física.",
  },
  {
    value: "no",
    title: "Não",
    description:
      "O objetivo principal é reproduzir digitalmente a geometria existente.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "A necessidade de alteração ainda será avaliada.",
  },
];

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function ReverseEngineeringRequirements({
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
      <ReverseEngineeringCoreSection
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
      <ReverseEngineeringContextSection
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
        title="Engenharia reversa"
        text="Primeiro precisamos entender qual resultado você espera obter a partir da peça física. O escopo da geometria e as condições do modelo existente entram nas próximas etapas."
      />

      <div className="mt-5">
        <QuestionBlock
          number="01"
          title="O que você precisa obter com a engenharia reversa?"
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

function ReverseEngineeringCoreSection({
  value,
  onChange,
}) {
  return (
    <div>
      <IntroBox
        title="Escopo da geometria"
        text="O principal critério para esta análise é entender se a reconstrução depende de superfícies externas, geometrias internas ou da combinação das duas."
      />

      <div className="mt-5">
        <QuestionBlock
          number="01"
          title="Quais regiões precisam ser reconstruídas?"
          help="Essa informação influencia diretamente quais tecnologias podem participar da solução."
          important
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {geometryScopeOptions.map(
              (
                option,
              ) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    value.geometryScope ===
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

                      geometryScope:
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

function ReverseEngineeringContextSection({
  value,
  onChange,
}) {
  return (
    <div>
      <IntroBox
        title="Condições da reconstrução"
        text="Agora verificamos se já existe uma referência digital e se o modelo final deve reproduzir a peça ou receber alterações."
      />

      <div className="mt-5 space-y-4">
        <QuestionBlock
          number="01"
          title="Já existe algum modelo ou projeto digital da peça?"
          help="Um CAD existente pode ser útil mesmo quando está incompleto ou desatualizado."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {existingModelOptions.map(
              (
                option,
              ) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    value.existingModel ===
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

                      existingModel:
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
          title="O modelo precisa receber alterações em relação à peça física?"
          help="Por exemplo: corrigir uma geometria, remover defeitos, adaptar dimensões ou criar uma nova versão do componente."
        >
          <div className="grid gap-2.5 sm:grid-cols-3">
            {modificationOptions.map(
              (
                option,
              ) => (
                <ChoiceCard
                  key={
                    option.value
                  }
                  selected={
                    value.needsModification ===
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

                      needsModification:
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