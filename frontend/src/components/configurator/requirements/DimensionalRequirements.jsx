const goals = [
  {
    id: "general-dimensions",
    label: "Medidas gerais",
    description:
      "Comprimentos, diâmetros, alturas e outras dimensões.",
  },
  {
    id: "geometry",
    label: "Forma e geometria",
    description:
      "Planicidade, circularidade, perfil e outras características geométricas.",
  },
  {
    id: "position",
    label: "Posição de características",
    description:
      "Verificar relação e posicionamento entre elementos da peça.",
  },
  {
    id: "tolerances",
    label: "Tolerâncias",
    description:
      "Avaliar se características estão dentro dos limites especificados.",
  },
  {
    id: "drawing-conformity",
    label: "Conformidade com desenho",
    description:
      "Comparar a peça com requisitos definidos em documentação técnica.",
  },
  {
    id: "quality-control",
    label: "Controle de qualidade",
    description:
      "Realizar uma avaliação dimensional para controle ou validação.",
  },
  {
    id: "other",
    label: "Outro objetivo",
    description:
      "Existe outra necessidade dimensional não representada acima.",
  },
  {
    id: "unknown",
    label: "Ainda não sei",
    description:
      "Você pode continuar e deixar a equipe técnica avaliar depois.",
  },
];

export function DimensionalRequirements({
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

  function setToleranceKnowledge(
    knowledge,
  ) {
    onChange({
      ...value,

      toleranceKnowledge:
        knowledge,

      criticalToleranceMm:
        knowledge === "exact"
          ? value.criticalToleranceMm
          : "",
    });
  }

  return (
    <div className="space-y-5">
      <IntroBox
        title="Inspeção dimensional"
        text="Vamos entender o nível de precisão e o tipo de característica que precisa ser avaliado. Você não precisa conhecer todos os termos técnicos."
      />

      <QuestionBlock
        title="O que você precisa verificar?"
        help="Você pode selecionar mais de uma opção."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {goals.map(
            (goal) => (
              <ChoiceCard
                key={goal.id}
                selected={value.goals.includes(
                  goal.id,
                )}
                title={goal.label}
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
        title="Você conhece a menor tolerância relevante da peça?"
        help="Tolerância é o quanto uma medida ou característica pode variar em relação ao valor esperado. Essa informação ajuda a entender o nível de precisão necessário."
      >
        <div className="grid gap-2">
          <ChoiceCard
            selected={
              value.toleranceKnowledge ===
              "exact"
            }
            onClick={() =>
              setToleranceKnowledge(
                "exact",
              )
            }
            title="Sim, sei o valor"
            description="Você poderá informar a menor tolerância em milímetros."
          />

          <ChoiceCard
            selected={
              value.toleranceKnowledge ===
              "high-precision"
            }
            onClick={() =>
              setToleranceKnowledge(
                "high-precision",
              )
            }
            title="Não sei o valor, mas sei que exige alta precisão"
            description="Útil quando você conhece a criticidade da peça, mas não possui a especificação em mãos."
          />

          <ChoiceCard
            selected={
              value.toleranceKnowledge ===
              "exists-but-unknown"
            }
            onClick={() =>
              setToleranceKnowledge(
                "exists-but-unknown",
              )
            }
            title="Existem tolerâncias, mas não conheço os valores"
          />

          <ChoiceCard
            selected={
              value.toleranceKnowledge ===
              "not-critical"
            }
            onClick={() =>
              setToleranceKnowledge(
                "not-critical",
              )
            }
            title="Não é uma aplicação de alta precisão"
            description="A necessidade é principalmente conferir medidas ou características gerais."
          />

          <ChoiceCard
            selected={
              value.toleranceKnowledge ===
              "unknown"
            }
            onClick={() =>
              setToleranceKnowledge(
                "unknown",
              )
            }
            title="Não sei informar"
          />
        </div>
      </QuestionBlock>

      {value.toleranceKnowledge ===
        "exact" && (
        <QuestionBlock
          title="Qual é a menor tolerância relevante?"
          help="Informe o valor aproximado em milímetros. A avaliação final será feita pela equipe técnica."
        >
          <div className="relative max-w-[240px]">
            <input
              type="number"
              min="0"
              step="0.001"
              value={
                value.criticalToleranceMm
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  criticalToleranceMm:
                    event.target.value,
                })
              }
              placeholder="0,010"
              className="h-[50px] w-full rounded-xl border border-[#cad8e0] bg-white px-4 pr-14 text-sm text-[#17394f] outline-none transition focus:border-[#61a1ca]"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8396a2]">
              mm
            </span>
          </div>
        </QuestionBlock>
      )}

      <QuestionBlock
        title="Existem características que precisam ser avaliadas sem tocar na peça?"
        help="Algumas características pequenas, delicadas ou de difícil contato podem tornar uma estratégia óptica mais interessante."
      >
        <FourWayChoice
          value={
            value.nonContactNeeded
          }
          onChange={(answer) =>
            onChange({
              ...value,
              nonContactNeeded:
                answer,
            })
          }
        />
      </QuestionBlock>

      <QuestionBlock
        title="A peça possui furos, detalhes ou características muito pequenas?"
      >
        <YesNoUnknownChoice
          value={
            value.smallFeatures
          }
          onChange={(answer) =>
            onChange({
              ...value,
              smallFeatures:
                answer,
            })
          }
        />
      </QuestionBlock>

      <QuestionBlock
        title="Você possui desenho técnico da peça?"
        help="Caso exista, ele poderá ser anexado no final da configuração."
      >
        <YesNoUnknownChoice
          value={
            value.technicalDrawing
          }
          onChange={(answer) =>
            onChange({
              ...value,
              technicalDrawing:
                answer,
            })
          }
        />
      </QuestionBlock>

      {value.technicalDrawing ===
        "yes" && (
        <QuestionBlock
          title="Existe também um modelo CAD de referência?"
        >
          <YesNoUnknownChoice
            value={value.cadModel}
            onChange={(answer) =>
              onChange({
                ...value,
                cadModel:
                  answer,
              })
            }
          />
        </QuestionBlock>
      )}
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
          text-xs
          font-semibold

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

function FourWayChoice({
  value,
  onChange,
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
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
          value === "maybe"
        }
        title="Talvez / depende"
        onClick={() =>
          onChange(
            "maybe",
          )
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