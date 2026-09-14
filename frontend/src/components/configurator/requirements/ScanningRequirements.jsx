import {
  motion,
} from "motion/react";

/* ============================================================
 * OPÇÕES
 * ============================================================ */

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
    title:
      "Fosca / opaca",
    description:
      "A peça possui acabamento opaco ou condições visuais favoráveis.",
  },
  {
    value:
      "reflective",
    title:
      "Brilhante / polida",
    description:
      "A superfície possui brilho ou reflexão e pode exigir preparação específica.",
  },
  {
    value: "dark",
    title:
      "Muito escura",
    description:
      "A superfície apresenta baixa reflexão de luz.",
  },
  {
    value:
      "transparent",
    title:
      "Transparente",
    description:
      "A peça possui regiões transparentes ou translúcidas.",
  },
  {
    value: "mixed",
    title:
      "Diferentes acabamentos",
    description:
      "A peça combina materiais, cores ou condições superficiais diferentes.",
  },
  {
    value: "unknown",
    title: "Não sei",
    description:
      "A condição da superfície ainda precisa ser avaliada.",
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

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function ScanningRequirements({
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
              item !==
              goalId,
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
      <ScanningCoreSection
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
      <ScanningContextSection
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
        title="Digitalização 3D"
        text="Primeiro precisamos entender qual resultado você espera obter com a digitalização. O nível de detalhe e as condições da peça entram nas próximas etapas."
      />

      <div className="mt-5">
        <QuestionBlock
          number="01"
          title="Para que você precisa da digitalização?"
          help="Você pode selecionar mais de uma finalidade."
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

function ScanningCoreSection({
  value,
  onChange,
}) {
  return (
    <div>
      <IntroBox
        title="Nível de detalhe"
        text="O nível de detalhe necessário é um dos principais fatores para diferenciar as tecnologias de digitalização disponíveis."
      />

      <div className="mt-5">
        <QuestionBlock
          number="01"
          title="Quanto detalhe precisa aparecer no resultado?"
          help="Não é necessário conhecer uma resolução técnica. Escolha a opção que mais se aproxima do resultado esperado."
          important
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {detailOptions.map(
              (
                option,
              ) => (
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
      </div>
    </div>
  );
}

/* ============================================================
 * ETAPA 06 — CONDIÇÕES COMPLEMENTARES
 * ============================================================ */

function ScanningContextSection({
  value,
  onChange,
}) {
  return (
    <div>
      <IntroBox
        title="Condições de digitalização"
        text="Agora avaliamos superfície e acesso. Essas condições podem influenciar a preparação da peça e a estratégia de aquisição."
      />

      <div className="mt-5 space-y-4">
        <QuestionBlock
          number="01"
          title="Como é a superfície predominante da peça?"
          help="Brilho, transparência e acabamento podem influenciar a aquisição óptica."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {surfaceOptions.map(
              (
                option,
              ) => (
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
                  description={
                    option.description
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
          number="02"
          title="Como é o acesso à geometria?"
          help="Regiões pouco acessíveis podem exigir outros posicionamentos ou influenciar a tecnologia utilizada."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {accessOptions.map(
              (
                option,
              ) => (
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