const goals = [
  {
    id: "capture-geometry",
    title:
      "Capturar a geometria da peça",
    description:
      "Quero obter a forma tridimensional do componente.",
  },
  {
    id: "cad-comparison",
    title:
      "Comparar a peça com um modelo CAD",
    description:
      "Quero analisar diferenças entre a peça física e uma referência digital.",
  },
  {
    id: "surface-analysis",
    title:
      "Analisar forma ou superfície",
    description:
      "Quero usar a geometria adquirida para avaliação tridimensional.",
  },
  {
    id: "digital-model",
    title:
      "Criar um modelo digital 3D",
    description:
      "Preciso registrar digitalmente a geometria da peça.",
  },
  {
    id: "reverse-engineering",
    title:
      "Usar a digitalização em engenharia reversa",
    description:
      "A geometria adquirida será usada como base para reconstrução digital.",
  },
  {
    id: "3d-print",
    title:
      "Usar em impressão 3D",
    description:
      "Preciso de dados tridimensionais para reprodução ou prototipagem.",
  },
  {
    id: "other",
    title:
      "Outro objetivo",
    description:
      "Existe outra finalidade para a digitalização.",
  },
  {
    id: "unknown",
    title:
      "Ainda não sei",
    description:
      "A equipe poderá ajudar a definir a aplicação adequada.",
  },
];

const detailOptions = [
  {
    value: "general",
    title:
      "Forma geral da peça",
    description:
      "O mais importante é registrar a geometria geral.",
  },
  {
    value:
      "visible-details",
    title:
      "Detalhes visíveis",
    description:
      "Preciso preservar características percebidas visualmente na peça.",
  },
  {
    value:
      "fine-details",
    title:
      "Pequenos furos, ranhuras ou detalhes",
    description:
      "Existem pequenas características importantes para o resultado.",
  },
  {
    value:
      "maximum-fidelity",
    title:
      "Maior fidelidade possível",
    description:
      "A qualidade e o nível de detalhe da aquisição são muito importantes.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "Não tenho certeza sobre o nível de detalhe necessário.",
  },
];

const surfaceOptions = [
  {
    value: "opaque",
    title: "Fosca / opaca",
  },
  {
    value:
      "reflective",
    title:
      "Brilhante / polida",
  },
  {
    value: "dark",
    title:
      "Muito escura",
  },
  {
    value:
      "transparent",
    title:
      "Transparente",
  },
  {
    value: "mixed",
    title:
      "Possui diferentes acabamentos",
  },
  {
    value: "unknown",
    title: "Não sei",
  },
];

const accessOptions = [
  {
    value: "full",
    title:
      "Acesso completo",
    description:
      "É possível acessar a peça por diferentes lados.",
  },
  {
    value: "partial",
    title:
      "Acesso parcial",
    description:
      "Algumas regiões são mais difíceis de alcançar.",
  },
  {
    value: "difficult",
    title:
      "Acesso difícil ou limitado",
    description:
      "A posição ou montagem da peça restringe bastante o acesso.",
  },
  {
    value: "unknown",
    title:
      "Não sei",
    description:
      "Ainda não tenho certeza sobre as condições de acesso.",
  },
];

export function ScanningRequirements({
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
        title="Digitalização 3D"
        text="Agora vamos entender o que precisa ser capturado e em quais condições. Isso ajuda principalmente a diferenciar uma aquisição mais controlada de uma solução que exige mobilidade."
      />

      <QuestionBlock
        title="Para que você precisa da digitalização?"
        help="Você pode selecionar mais de uma finalidade."
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
        title="Quanto detalhe precisa aparecer no resultado?"
        help="Não precisa saber uma resolução técnica. Escolha a opção que melhor representa o objetivo."
      >
        <div className="grid gap-2">
          {detailOptions.map(
            (option) => (
              <ChoiceCard
                key={
                  option.value
                }
                selected={
                  value.detailLevel ===
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
                    detailLevel:
                      option.value,
                  })
                }
              />
            ),
          )}
        </div>
      </QuestionBlock>

      <QuestionBlock
        title="Como é a superfície predominante da peça?"
        help="A aparência da superfície pode influenciar a estratégia de aquisição óptica."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {surfaceOptions.map(
            (option) => (
              <ChoiceCard
                key={
                  option.value
                }
                selected={
                  value.surface ===
                  option.value
                }
                title={
                  option.title
                }
                onClick={() =>
                  onChange({
                    ...value,
                    surface:
                      option.value,
                  })
                }
              />
            ),
          )}
        </div>
      </QuestionBlock>

      <QuestionBlock
        title="É possível acessar a peça por diferentes lados?"
        help="O acesso pode influenciar a estratégia de captura, principalmente em componentes instalados ou estruturas."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {accessOptions.map(
            (option) => (
              <ChoiceCard
                key={
                  option.value
                }
                selected={
                  value.access ===
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
                    access:
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