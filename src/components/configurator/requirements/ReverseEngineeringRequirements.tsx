import type {
  ExistingModelStatus,
  GeometryScope,
  ReverseEngineeringGoal,
  ReverseEngineeringRequirements as ReverseData,
  YesNoUnknown,
} from "../types";

type Props = {
  value: ReverseData;

  onChange: (
    value: ReverseData,
  ) => void;
};

const goals: {
  id:
    ReverseEngineeringGoal;
  title: string;
  description: string;
}[] = [
  {
    id: "cad-model",

    title:
      "Criar um modelo CAD",

    description:
      "Preciso transformar a peça física em um modelo digital.",
  },

  {
    id:
      "full-reconstruction",

    title:
      "Reconstruir toda a peça",

    description:
      "O objetivo é reconstruir digitalmente o componente completo.",
  },

  {
    id:
      "partial-reconstruction",

    title:
      "Reconstruir apenas uma região",

    description:
      "Somente uma parte ou característica precisa ser reconstruída.",
  },

  {
    id:
      "editable-model",

    title:
      "Criar um modelo que possa ser modificado",

    description:
      "Quero usar o resultado como base para alterar ou desenvolver o projeto.",
  },

  {
    id:
      "manufacturing-file",

    title:
      "Obter arquivo para fabricação",

    description:
      "O modelo será utilizado posteriormente em um processo de fabricação.",
  },

  {
    id:
      "update-existing-project",

    title:
      "Atualizar um projeto existente",

    description:
      "Já existe informação digital, mas ela precisa ser revisada ou atualizada.",
  },

  {
    id: "other",

    title:
      "Outro objetivo",

    description:
      "Existe outra necessidade relacionada à reconstrução da peça.",
  },

  {
    id: "unknown",

    title:
      "Ainda não sei",

    description:
      "Você sabe que precisa reconstruir a peça, mas ainda não definiu o formato do resultado.",
  },
];

const modelOptions: {
  value:
    ExistingModelStatus;
  title: string;
  description: string;
}[] = [
  {
    value: "yes",

    title:
      "Sim, existe um modelo",

    description:
      "Há um CAD ou referência digital disponível.",
  },

  {
    value: "no",

    title:
      "Não existe",

    description:
      "A peça física é a principal referência disponível.",
  },

  {
    value: "outdated",

    title:
      "Existe, mas está desatualizado",

    description:
      "O modelo atual não representa completamente a peça existente.",
  },

  {
    value: "unknown",

    title:
      "Não sei",

    description:
      "Não tenho certeza se existe uma referência digital utilizável.",
  },
];

const scopeOptions: {
  value:
    GeometryScope;
  title: string;
  description: string;
}[] = [
  {
    value: "external",

    title:
      "Somente geometria externa",

    description:
      "A reconstrução depende principalmente das superfícies acessíveis externamente.",
  },

  {
    value: "internal",

    title:
      "Geometria interna",

    description:
      "Existem características internas importantes para o modelo.",
  },

  {
    value: "both",

    title:
      "Geometria externa e interna",

    description:
      "O resultado precisa considerar os dois tipos de informação.",
  },

  {
    value: "unknown",

    title:
      "Não sei",

    description:
      "A equipe poderá ajudar a definir qual aquisição é necessária.",
  },
];

export function ReverseEngineeringRequirements({
  value,
  onChange,
}: Props) {
  function toggleGoal(
    goal:
      ReverseEngineeringGoal,
  ) {
    const selected =
      value.goals.includes(
        goal,
      );

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
        title="Engenharia reversa"
        text="Aqui queremos entender qual resultado digital você precisa obter. A tecnologia de aquisição será definida conforme a geometria e as características do projeto."
      />

      <QuestionBlock
        title="O que você precisa obter?"
        help="Você pode selecionar mais de um resultado."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {goals.map(
            (goal) => (
              <ChoiceCard
                key={
                  goal.id
                }
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
            ),
          )}
        </div>
      </QuestionBlock>

      <QuestionBlock
        title="Existe algum modelo CAD ou referência digital anterior?"
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {modelOptions.map(
            (option) => (
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
        title="Que parte da geometria precisa ser reconstruída?"
        help="Essa resposta ajuda a definir se a aquisição pode ser feita externamente ou se informações internas também serão necessárias."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {scopeOptions.map(
            (option) => (
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

      <QuestionBlock
        title="O modelo final precisa permitir alterações de projeto?"
        help="Isso ajuda a entender se o resultado será apenas uma representação ou uma base para desenvolvimento."
      >
        <YesNoUnknownChoice
          value={
            value.needsModification
          }
          onChange={(
            answer,
          ) =>
            onChange({
              ...value,
              needsModification:
                answer,
            })
          }
        />
      </QuestionBlock>
    </div>
  );
}

/* ============================================================
 * AUXILIARES
 * ============================================================ */

function IntroBox({
  title,
  text,
}: {
  title: string;
  text: string;
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
}: {
  title: string;
  help?: string;
  children:
    React.ReactNode;
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
}: {
  selected: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
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
        {selected
          ? "✓ "
          : ""}
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
}: {
  value:
    YesNoUnknown | null;

  onChange: (
    value:
      YesNoUnknown,
  ) => void;
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
          value ===
          "unknown"
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