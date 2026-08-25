type ContactData = {
  name: string;
  company: string;
  email: string;
  phone: string;
};

type ContactStepProps = {
  data: ContactData;
  onChange: (
    field: keyof ContactData,
    value: string,
  ) => void;
};

export function ContactStep({
  data,
  onChange,
}: ContactStepProps) {
  function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) {
      return numbers
        ? `(${numbers}`
        : "";
    }

    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(
        2,
        6,
      )}-${numbers.slice(6)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(
      2,
      7,
    )}-${numbers.slice(7)}`;
  }

  return (
    <div>
      <div className="border-b border-[#e0e7ec] pb-7">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-[0.12em] text-[#356f9f]">
            01
          </span>

          <div className="h-px w-8 bg-[#6fa7d1]" />
        </div>

        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-4xl">
          Seus dados de contato
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667887] sm:text-base">
          Essas informações serão utilizadas para identificar a solicitação e
          permitir que nossa equipe entre em contato sobre o projeto.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label="Nome" required>
          <input
            type="text"
            value={data.name}
            onChange={(event) =>
              onChange("name", event.target.value)
            }
            placeholder="Seu nome"
            autoComplete="name"
            className={inputClasses}
          />
        </Field>

        <Field label="Empresa">
          <input
            type="text"
            value={data.company}
            onChange={(event) =>
              onChange("company", event.target.value)
            }
            placeholder="Nome da empresa"
            autoComplete="organization"
            className={inputClasses}
          />
        </Field>

        <Field label="E-mail" required>
          <input
            type="email"
            value={data.email}
            onChange={(event) =>
              onChange("email", event.target.value)
            }
            placeholder="nome@empresa.com.br"
            autoComplete="email"
            className={inputClasses}
          />
        </Field>

        <Field label="Telefone" required>
          <input
            type="tel"
            value={data.phone}
            onChange={(event) =>
              onChange(
                "phone",
                formatPhone(event.target.value),
              )
            }
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            inputMode="numeric"
            className={inputClasses}
          />
        </Field>
      </div>

      <div className="mt-8 rounded-[18px] border border-[#d9e6ed] bg-[#f3f8fb] px-5 py-4">
        <p className="text-xs leading-5 text-[#607786]">
          <span className="font-semibold text-[#356f9f]">
            Sobre os próximos passos:
          </span>{" "}
          na próxima etapa você poderá cadastrar uma ou mais peças e informar
          individualmente os serviços necessários para cada uma.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-xs font-medium uppercase tracking-[0.08em] text-[#415b6c]">
        {label}

        {required && (
          <span className="ml-1 text-[#356f9f]">*</span>
        )}
      </span>

      {children}
    </label>
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