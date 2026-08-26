const goals = [
  {
    id:
      "internal-geometry",
    title:
      "Visualizar geometria interna",
    description:
      "Preciso observar características que não são acessíveis pela superfície externa.",
  },
  {
    id: "defects",
    title:
      "Investigar falhas ou defeitos",
    description:
      "Quero procurar descontinuidades ou problemas no interior da peça.",
  },
  {
    id: "porosity",
    title:
      "Avaliar porosidade",
    description:
      "Existe interesse em identificar ou analisar regiões porosas.",
  },
  {
    id: "assembly",
    title:
      "Analisar um conjunto montado",
    description:
      "Preciso observar a relação entre componentes sem necessariamente desmontá-los.",
  },
  {
    id:
      "internal-position",
    title:
      "Verificar posicionamento interno",
    description:
      "Quero avaliar posição ou montagem de características internas.",
  },
  {
    id:
      "internal-dimensions",
    title:
      "Avaliar dimensões internas",
    description:
      "Existem medidas internas importantes que precisam ser investigadas.",
  },
  {
    id:
      "internal-reconstruction",
    title:
      "Reconstruir geometria interna",
    description:
      "As informações internas serão usadas para reconstrução digital.",
  },
  {
    id: "other",
    title:
      "Outro objetivo",
    description:
      "Existe outra necessidade relacionada ao interior da peça.",
  },
  {
    id: "unknown",
    title:
      "Ainda não sei",
    description:
      "A equipe poderá orientar qual análise é adequada ao problema.",
  },
];

const regionOptions = [
  {
    value:
      "whole-piece",
    title:
      "Peça inteira",
    description:
      "A análise precisa considerar o componente como um todo.",
  },
  {
    value:
      "specific-region",
    title:
      "Região específica",
    description:
      "Existe uma área interna específica de interesse.",
  },
  {
    value:
      "assembled-set",
    title:
      "Conjunto montado",
    description:
      "O interesse está na interação ou posicionamento entre diferentes componentes.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "Ainda não está claro qual região precisa ser priorizada.",
  },
];

export function CtRequirements({
  value,
  onChange,
}) {
  function toggleGoal(goal) {
    const selected =
      value.goals.includes(goal);

    onChange({
      ...value,

      goals: selected
        ? value.goals.filter(
            (item) =>
              item !== goal,
          )
        : [
            ...value.goals,
            goal,
          ],
    });
  }

  return (
    <div className="space-y-5">
      <IntroBox
        title="CT / análise interna"
        text="Vamos entender o que precisa ser observado internamente. Essa etapa também pode alimentar projetos de engenharia reversa quando existem características que não podem ser capturadas externamente."
      />

      <QuestionBlock
        title="O que você precisa investigar?"
        help="Você pode selecionar mais de uma opção."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {goals.map(
            (goal) => (
              <ChoiceCard
                key={goal.id}
                selected={
                  value.goals.includes(
                    goal.id,
                  )
                }
                title={goal.title}
                description={
                  goal.description
                }
                onClick={() =>
                  toggleGoal(
                    goal.id,
                  )
                }
              />
            ),
          )}
        </div>
      </QuestionBlock>

      <QuestionBlock
        title="A peça pode ser desmontada?"
        help="Essa informação ajuda a entender se a avaliação precisa ocorrer no conjunto existente."
      >
        <YesNoUnknownChoice
          value={
            value.canBeDisassembled
          }
          onChange={(answer) =>
            onChange({
              ...value,
              canBeDisassembled:
                answer,
            })
          }
        />
      </QuestionBlock>

      <QuestionBlock
        title="A peça precisa permanecer intacta durante a análise?"
        help="Quando é importante preservar o componente, uma estratégia não destrutiva pode ser especialmente relevante."
      >
        <YesNoUnknownChoice
          value={
            value.mustRemainIntact
          }
          onChange={(answer) =>
            onChange({
              ...value,
              mustRemainIntact:
                answer,
            })
          }
        />
      </QuestionBlock>

      <QuestionBlock
        title="Qual região precisa ser investigada?"
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {regionOptions.map(
            (option) => (
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
  );
}

function IntroBox({
  title,
  text,
}) {
  return (
    <div className="rounded-[18px] border border-[#bfd4df] bg-[#e4eff5] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#47738f]">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#647f8f]">
        {text}
      </p>
    </div>
  );
}

function QuestionBlock({
  title,
  help,
  children,
}) {
  return (
    <section className="rounded-[18px] border border-[#d0dce3] bg-[#edf3f6] p-4 sm:p-5">
      <p className="text-sm font-semibold text-[#17394f]">
        {title}
      </p>

      {help && (
        <p className="mt-1.5 text-xs leading-5 text-[#738996]">
          {help}
        </p>
      )}

      <div className="mt-4">
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
        rounded-xl
        border
        px-4 py-3.5
        text-left
        transition-all

        ${
          selected
            ? "border-[#61a1ca] bg-[#dcecf5]"
            : "border-[#ccd9e1] bg-white hover:border-[#a9c0cd]"
        }
      `}
    >
      <p
        className={`
          text-xs font-semibold

          ${
            selected
              ? "text-[#0b639e]"
              : "text-[#526e7f]"
          }
        `}
      >
        {selected ? "✓ " : ""}
        {title}
      </p>

      {description && (
        <p className="mt-1 text-[10px] leading-4 text-[#7a8e99]">
          {description}
        </p>
      )}
    </button>
  );
}

function YesNoUnknownChoice({
  value,
  onChange,
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <ChoiceCard
        selected={
          value === "yes"
        }
        title="Sim"
        onClick={() =>
          onChange("yes")
        }
      />

      <ChoiceCard
        selected={
          value === "no"
        }
        title="Não"
        onClick={() =>
          onChange("no")
        }
      />

      <ChoiceCard
        selected={
          value === "unknown"
        }
        title="Não sei"
        onClick={() =>
          onChange(
            "unknown",
          )
        }
      />
    </div>
  );
}