const urgencyOptions = [
  {
    value: "normal",
    title: "Normal",
    description:
      "O projeto pode seguir o prazo habitual de avaliação.",
  },
  {
    value: "priority",
    title: "Prioritário",
    description:
      "Existe preferência por uma avaliação mais rápida.",
  },
  {
    value: "urgent",
    title: "Urgente",
    description:
      "Há necessidade de atendimento em prazo reduzido.",
  },
];

const deadlineOptions = [
  {
    value: "noUrgency",
    title: "Sem prazo definido",
    description:
      "O prazo poderá ser alinhado com a equipe.",
  },
  {
    value: "15days",
    title: "Até 15 dias",
    description:
      "Preferência por conclusão em até 15 dias.",
  },
  {
    value: "30days",
    title: "Até 30 dias",
    description:
      "Preferência por conclusão em até 30 dias.",
  },
  {
    value: "specificDate",
    title: "Data específica",
    description:
      "Existe uma data necessária para o projeto.",
  },
];

export function ProjectStep({
  data,
  onChange,
}) {
  function handleFiles(event) {
    const files = Array.from(
      event.target.files ?? [],
    );

    if (files.length === 0) {
      return;
    }

    onChange("generalFiles", [
      ...(data.generalFiles ?? []),
      ...files,
    ]);

    event.target.value = "";
  }

  function removeFile(index) {
    onChange(
      "generalFiles",
      (
        data.generalFiles ??
        []
      ).filter(
        (_, currentIndex) =>
          currentIndex !== index,
      ),
    );
  }

  return (
    <div>
      <div className="border-b border-[#e0e7ec] pb-7">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-[0.12em] text-[#356f9f]">
            03
          </span>

          <div className="h-px w-8 bg-[#6fa7d1]" />
        </div>

        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-4xl">
          Informações do projeto
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667887] sm:text-base">
          Informe os dados que se aplicam ao projeto como um todo. Os detalhes
          específicos de cada peça permanecem associados aos itens cadastrados
          na etapa anterior.
        </p>
      </div>

      <FormSection
        title="Objetivo geral"
        description="Descreva brevemente o que você pretende alcançar com este projeto."
      >
        <textarea
          value={
            data.objective ??
            ""
          }
          onChange={(event) =>
            onChange(
              "objective",
              event.target.value,
            )
          }
          placeholder="Ex.: validar dimensionalmente um novo lote antes da liberação para produção..."
          rows={5}
          className={textareaClasses}
        />
      </FormSection>

      <FormSection
        title="Prioridade"
        description="Indique o nível de prioridade comercial ou operacional do projeto."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {urgencyOptions.map(
            (option) => {
              const active =
                data.urgency ===
                option.value;

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    onChange(
                      "urgency",
                      option.value,
                    )
                  }
                  className={`
                    cursor-pointer rounded-[16px]
                    border p-4 text-left
                    transition-all duration-200
                    ${
                      active
                        ? "border-[#77aacf] bg-[#edf6fb]"
                        : "border-[#dbe4e9] bg-white hover:border-[#adc5d3] hover:bg-[#fafcfd]"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`
                        mt-0.5 flex h-5 w-5 shrink-0
                        items-center justify-center
                        rounded-full border
                        ${
                          active
                            ? "border-[#356f9f] bg-[#356f9f]"
                            : "border-[#bdcbd4] bg-white"
                        }
                      `}
                    >
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-[#0b2340]">
                        {option.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#71838f]">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            },
          )}
        </div>
      </FormSection>

      <FormSection
        title="Prazo desejado"
        description="Indique a expectativa de prazo para execução ou retorno."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {deadlineOptions.map(
            (option) => {
              const active =
                data.deadlineType ===
                option.value;

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    onChange(
                      "deadlineType",
                      option.value,
                    )
                  }
                  className={`
                    cursor-pointer rounded-[16px]
                    border p-4 text-left
                    transition-all duration-200
                    ${
                      active
                        ? "border-[#77aacf] bg-[#edf6fb]"
                        : "border-[#dbe4e9] bg-white hover:border-[#adc5d3] hover:bg-[#fafcfd]"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`
                        mt-0.5 flex h-5 w-5 shrink-0
                        items-center justify-center
                        rounded-full border
                        ${
                          active
                            ? "border-[#356f9f] bg-[#356f9f]"
                            : "border-[#bdcbd4] bg-white"
                        }
                      `}
                    >
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-[#0b2340]">
                        {option.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#71838f]">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            },
          )}
        </div>

        {data.deadlineType ===
          "specificDate" && (
          <div className="mt-5 max-w-sm">
            <Field label="Data necessária">
              <input
                type="date"
                value={
                  data.specificDate ??
                  ""
                }
                onChange={(event) =>
                  onChange(
                    "specificDate",
                    event.target.value,
                  )
                }
                className={inputClasses}
              />
            </Field>
          </div>
        )}
      </FormSection>

      <FormSection
        title="Observações gerais"
        description="Inclua informações adicionais que ajudem nossa equipe a compreender o contexto do projeto."
      >
        <textarea
          value={
            data.observations ??
            ""
          }
          onChange={(event) =>
            onChange(
              "observations",
              event.target.value,
            )
          }
          placeholder="Ex.: projeto em fase de desenvolvimento, necessidade de relatório específico, condição especial de acesso..."
          rows={5}
          className={textareaClasses}
        />
      </FormSection>

      <FormSection
        title="Arquivos gerais do projeto"
        description="Utilize esta área para documentos que se aplicam ao projeto inteiro. Arquivos específicos de cada peça permanecem associados ao respectivo item."
      >
        <label
          className="
            block cursor-pointer
            rounded-[18px]
            border border-dashed border-[#b9ccd7]
            bg-[#f8fafb]
            px-5 py-7
            text-center
            transition-all duration-200
            hover:border-[#7faaca]
            hover:bg-[#f2f7fa]
          "
        >
          <input
            type="file"
            multiple
            className="hidden"
            onChange={
              handleFiles
            }
            accept=".pdf,.stl,.step,.stp,.iges,.igs,.dwg,.jpg,.jpeg,.png,.webp"
          />

          <p className="text-sm font-semibold text-[#356f9f]">
            + Adicionar arquivos gerais
          </p>

          <p className="mt-2 text-xs text-[#7b8c97]">
            Imagens, PDF, STL, STEP, IGES ou DWG
          </p>
        </label>

        {(data.generalFiles ?? [])
          .length > 0 && (
          <div className="mt-4 space-y-2">
            {(
              data.generalFiles ??
              []
            ).map(
              (
                file,
                index,
              ) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-[12px] border border-[#dce5ea] bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0b2340]">
                      {file.name}
                    </p>

                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.06em] text-[#84949e]">
                      {formatFileSize(
                        file.size,
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeFile(
                        index,
                      )
                    }
                    className="cursor-pointer text-xs font-medium text-[#8a5555] transition-colors hover:text-[#6d3030]"
                  >
                    Remover
                  </button>
                </div>
              ),
            )}
          </div>
        )}
      </FormSection>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}) {
  return (
    <section className="border-b border-[#e3e9ed] py-7 last:border-0 last:pb-0">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#0b2340]">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-[#788993]">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-xs font-medium uppercase tracking-[0.08em] text-[#415b6c]">
        {label}
      </span>

      {children}
    </label>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

const inputClasses = `
  h-12 w-full
  rounded-[12px]
  border border-[#d6e0e6]
  bg-white
  px-4
  text-sm text-[#0b2340]
  outline-none
  transition-all duration-200
  placeholder:text-[#9aa8b2]
  hover:border-[#b8cbd7]
  focus:border-[#568fb8]
  focus:ring-4
  focus:ring-[#568fb8]/10
`;

const textareaClasses = `
  w-full resize-y
  rounded-[12px]
  border border-[#d6e0e6]
  bg-white
  px-4 py-3
  text-sm leading-6 text-[#0b2340]
  outline-none
  transition-all duration-200
  placeholder:text-[#9aa8b2]
  hover:border-[#b8cbd7]
  focus:border-[#568fb8]
  focus:ring-4
  focus:ring-[#568fb8]/10
`;