const services = [
  {
    value: "inspection",
    label: "Inspeção dimensional",
    description:
      "Dimensões, geometrias, tolerâncias e conformidade.",
  },
  {
    value: "scanning",
    label: "Digitalização 3D",
    description:
      "Captura tridimensional da geometria da peça.",
  },
  {
    value: "reverse",
    label: "Engenharia reversa",
    description:
      "Reconstrução e desenvolvimento de modelos digitais.",
  },
  {
    value: "internal",
    label: "Análise interna",
    description:
      "Investigação de características internas.",
  },
];

export function PieceCard({
  piece,
  index,
  canDelete,
  onChange,
  onDelete,
}) {
  function toggleService(service) {
    const exists = piece.services.includes(service);

    onChange(piece.id, {
      services: exists
        ? piece.services.filter((item) => item !== service)
        : [...piece.services, service],
    });
  }

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#dce5ea] bg-white">
      <div className="flex flex-col gap-4 border-b border-[#e1e8ec] bg-[#f5f8fa] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#5687ad]">
            Item do projeto
          </p>

          <h3 className="mt-1 text-lg font-semibold text-[#0b2340]">
            Peça {String(index + 1).padStart(2, "0")}
          </h3>
        </div>

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(piece.id)}
            className="
              cursor-pointer
              self-start
              rounded-[10px]
              border border-[#e2d7d7]
              bg-white
              px-3 py-2
              text-xs font-medium text-[#8a4545]
              transition-all duration-200
              hover:border-[#cdaaaa]
              hover:bg-[#fffafa]
              sm:self-auto
            "
          >
            Remover
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <FormSection
          title="Identificação da peça"
          description="Informe os dados básicos deste modelo ou componente."
        >
          <div className="grid gap-5 sm:grid-cols-[1.4fr_0.6fr]">
            <Field label="Nome ou referência">
              <input
                type="text"
                value={piece.name}
                onChange={(event) =>
                  onChange(piece.id, {
                    name: event.target.value,
                  })
                }
                placeholder="Ex.: Suporte A, carcaça 03..."
                className={inputClasses}
              />
            </Field>

            <Field label="Quantidade">
              <input
                type="number"
                min={1}
                value={piece.quantity}
                onChange={(event) =>
                  onChange(piece.id, {
                    quantity: Math.max(
                      1,
                      Number(event.target.value) || 1,
                    ),
                  })
                }
                className={inputClasses}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Material">
              <input
                type="text"
                value={piece.material}
                onChange={(event) =>
                  onChange(piece.id, {
                    material: event.target.value,
                  })
                }
                placeholder="Ex.: alumínio, aço, polímero..."
                className={inputClasses}
              />
            </Field>
          </div>

          <div className="mt-5">
            <p className="mb-2.5 text-xs font-medium uppercase tracking-[0.08em] text-[#415b6c]">
              Dimensões aproximadas
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <DimensionInput
                label="Comprimento"
                value={piece.length}
                onChange={(value) =>
                  onChange(piece.id, {
                    length: value,
                  })
                }
              />

              <DimensionInput
                label="Largura"
                value={piece.width}
                onChange={(value) =>
                  onChange(piece.id, {
                    width: value,
                  })
                }
              />

              <DimensionInput
                label="Altura"
                value={piece.height}
                onChange={(value) =>
                  onChange(piece.id, {
                    height: value,
                  })
                }
              />

              <label>
                <span className="mb-2 block text-[10px] uppercase tracking-[0.07em] text-[#71838e]">
                  Unidade
                </span>

                <select
                  value={piece.unit}
                  onChange={(event) =>
                    onChange(piece.id, {
                      unit: event.target.value,
                    })
                  }
                  className={inputClasses}
                >
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
              </label>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Serviços necessários"
          description="Selecione todos os serviços relacionados a esta peça."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => {
              const active = piece.services.includes(service.value);

              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => toggleService(service.value)}
                  className={`
                    cursor-pointer
                    rounded-[16px]
                    border
                    p-4
                    text-left
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
                        rounded-[6px] border
                        ${
                          active
                            ? "border-[#356f9f] bg-[#356f9f]"
                            : "border-[#bdcbd4] bg-white"
                        }
                      `}
                    >
                      {active && <CheckIcon />}
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-[#0b2340]">
                        {service.label}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#71838f]">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </FormSection>

        {piece.services.length > 0 && (
          <FormSection
            title="Detalhes dos serviços"
            description="As perguntas abaixo são exibidas de acordo com os serviços selecionados."
          >
            <div className="space-y-4">
              {piece.services.includes("inspection") && (
                <OptionPanel title="Inspeção dimensional">
                  <CheckboxGroup
                    label="O que precisa ser avaliado?"
                    options={[
                      ["dimensions", "Dimensões"],
                      ["geometry", "Geometria"],
                      ["tolerances", "Tolerâncias"],
                      ["drawing", "Comparação com desenho"],
                      ["cad", "Comparação com CAD"],
                      ["other", "Outro"],
                    ]}
                    selected={piece.inspectionOptions}
                    onChange={(values) =>
                      onChange(piece.id, {
                        inspectionOptions: values,
                      })
                    }
                  />
                </OptionPanel>
              )}

              {piece.services.includes("scanning") && (
                <OptionPanel title="Digitalização 3D">
                  <CheckboxGroup
                    label="Qual é o objetivo da digitalização?"
                    options={[
                      ["model", "Modelo 3D"],
                      ["cadComparison", "Comparação com CAD"],
                      ["documentation", "Documentação da geometria"],
                      ["reverseBase", "Base para engenharia reversa"],
                      ["other", "Outro"],
                    ]}
                    selected={piece.scanningOptions}
                    onChange={(values) =>
                      onChange(piece.id, {
                        scanningOptions: values,
                      })
                    }
                  />
                </OptionPanel>
              )}

              {piece.services.includes("reverse") && (
                <OptionPanel title="Engenharia reversa">
                  <CheckboxGroup
                    label="Qual resultado você espera obter?"
                    options={[
                      ["cad", "Modelo CAD"],
                      ["surfaces", "Superfícies"],
                      ["reconstruction", "Reconstrução geométrica"],
                      ["modification", "Modificação do projeto"],
                      ["unknown", "Ainda não sei"],
                    ]}
                    selected={piece.reverseOptions}
                    onChange={(values) =>
                      onChange(piece.id, {
                        reverseOptions: values,
                      })
                    }
                  />
                </OptionPanel>
              )}

              {piece.services.includes("internal") && (
                <OptionPanel title="Análise interna">
                  <CheckboxGroup
                    label="O que precisa ser investigado?"
                    options={[
                      ["structure", "Estrutura interna"],
                      ["defects", "Defeitos internos"],
                      ["cavities", "Cavidades"],
                      ["assembly", "Montagem"],
                      ["discontinuities", "Descontinuidades"],
                      ["other", "Outro"],
                    ]}
                    selected={piece.internalOptions}
                    onChange={(values) =>
                      onChange(piece.id, {
                        internalOptions: values,
                      })
                    }
                  />
                </OptionPanel>
              )}
            </div>
          </FormSection>
        )}

        <FormSection
          title="Logística"
          description="Informe se a peça poderá ser transportada até o Centro."
        >
          <p className="text-sm font-medium text-[#0b2340]">
            A peça pode ser levada ao Centro de Excelência?
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <ChoiceButton
              active={piece.transportStatus === "yes"}
              label="Sim"
              onClick={() =>
                onChange(piece.id, {
                  transportStatus: "yes",
                  externalService: false,
                })
              }
            />

            <ChoiceButton
              active={piece.transportStatus === "no"}
              label="Não"
              onClick={() =>
                onChange(piece.id, {
                  transportStatus: "no",
                  externalService: true,
                })
              }
            />

            <ChoiceButton
              active={piece.transportStatus === "unknown"}
              label="Ainda não sei"
              onClick={() =>
                onChange(piece.id, {
                  transportStatus: "unknown",
                  externalService: false,
                })
              }
            />
          </div>

          {piece.transportStatus === "no" && (
            <div className="mt-5 rounded-[18px] border border-[#cfe0e9] bg-[#f1f7fa] p-5">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#356f9f]">
                Atendimento in loco
              </p>

              <p className="mt-2 text-sm leading-6 text-[#617786]">
                Como esta peça não poderá ser transportada, informe alguns
                dados do local onde o atendimento poderá ser necessário.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_140px]">
                <Field label="Cidade">
                  <input
                    type="text"
                    value={piece.locationCity}
                    onChange={(event) =>
                      onChange(piece.id, {
                        locationCity: event.target.value,
                      })
                    }
                    placeholder="Cidade"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Estado">
                  <input
                    type="text"
                    maxLength={2}
                    value={piece.locationState}
                    onChange={(event) =>
                      onChange(piece.id, {
                        locationState:
                          event.target.value.toUpperCase(),
                      })
                    }
                    placeholder="GO"
                    className={inputClasses}
                  />
                </Field>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="A peça pode ser movimentada?"
                  value={piece.movable}
                  onChange={(value) =>
                    onChange(piece.id, {
                      movable: value,
                    })
                  }
                  options={[
                    ["", "Selecione"],
                    ["yes", "Sim"],
                    ["no", "Não"],
                    ["partial", "Parcialmente"],
                  ]}
                />

                <SelectField
                  label="Existe acesso ao redor da peça?"
                  value={piece.surroundingAccess}
                  onChange={(value) =>
                    onChange(piece.id, {
                      surroundingAccess: value,
                    })
                  }
                  options={[
                    ["", "Selecione"],
                    ["yes", "Sim"],
                    ["partial", "Parcial"],
                    ["unknown", "Não sei"],
                  ]}
                />
              </div>

              <div className="mt-5">
                <Field label="Observações sobre o local">
                  <textarea
                    value={piece.locationNotes}
                    onChange={(event) =>
                      onChange(piece.id, {
                        locationNotes: event.target.value,
                      })
                    }
                    placeholder="Ex.: acesso limitado, peça instalada, área externa..."
                    rows={4}
                    className={textareaClasses}
                  />
                </Field>
              </div>
            </div>
          )}
        </FormSection>

        <FormSection
          title="Arquivos desta peça"
          description="Fotos, desenhos, arquivos CAD ou outros documentos técnicos poderão ser associados diretamente a esta peça."
        >
          <button
            type="button"
            className="
              w-full cursor-pointer
              rounded-[16px]
              border border-dashed border-[#b9ccd7]
              bg-[#f8fafb]
              px-5 py-7
              text-center
              transition-all duration-200
              hover:border-[#7faaca]
              hover:bg-[#f2f7fa]
            "
          >
            <p className="text-sm font-semibold text-[#356f9f]">
              + Adicionar arquivos
            </p>

            <p className="mt-2 text-xs text-[#7b8c97]">
              Imagens, PDF, STL, STEP, IGES ou DWG
            </p>
          </button>
        </FormSection>
      </div>
    </article>
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
        <h4 className="text-sm font-semibold text-[#0b2340]">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-[#788993]">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function OptionPanel({
  title,
  children,
}) {
  return (
    <div className="rounded-[18px] border border-[#d8e4ea] bg-[#f6f9fb] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#356f9f]">
        {title}
      </p>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}) {
  function toggle(value) {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-[#0b2340]">
        {label}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map(([value, text]) => {
          const active = selected.includes(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={`
                cursor-pointer
                rounded-[12px]
                border
                px-4 py-3
                text-left text-sm
                transition-all duration-200
                ${
                  active
                    ? "border-[#8eb7d1] bg-[#eaf4fa] text-[#0b2340]"
                    : "border-[#d9e3e8] bg-white text-[#647984] hover:border-[#adc4d1]"
                }
              `}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceButton({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        cursor-pointer
        rounded-[13px]
        border
        px-4 py-3
        text-sm font-medium
        transition-all duration-200
        ${
          active
            ? "border-[#6f9fc0] bg-[#eaf4fa] text-[#0b2340]"
            : "border-[#d7e1e7] bg-white text-[#627784] hover:border-[#abc2d0]"
        }
      `}
    >
      {label}
    </button>
  );
}

function DimensionInput({
  label,
  value,
  onChange,
}) {
  return (
    <label>
      <span className="mb-2 block text-[10px] uppercase tracking-[0.07em] text-[#71838e]">
        {label}
      </span>

      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClasses}
      />
    </label>
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

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClasses}
      >
        {options.map(([valueOption, labelOption]) => (
          <option
            key={valueOption}
            value={valueOption}
          >
            {labelOption}
          </option>
        ))}
      </select>
    </Field>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 6.1L4.8 8.3L9.5 3.7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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