import {
  useState,
} from "react";

import {
  applyEmailSuffix,
  canSuggestEmailSuffix,
  EMAIL_SUFFIXES,
  formatPhone,
  sanitizeEmail,
  validateContactData,
} from "../../utils/contactValidation";

export function ContactStep({
  data,
  onChange,
  mode = "public",
  showValidation = false,
}) {
  const [
    touched,
    setTouched,
  ] = useState({
    name:
      false,

    email:
      false,

    phone:
      false,
  });

  const validation =
    validateContactData(
      data,
    );

  const internalMode =
    mode ===
    "internal";

  const showNameError =
    Boolean(
      validation.errors.name,
    ) &&
    (
      touched.name ||
      showValidation
    );

  const showEmailError =
    Boolean(
      validation.errors.email,
    ) &&
    (
      touched.email ||
      showValidation
    );

  const showPhoneError =
    Boolean(
      validation.errors.phone,
    ) &&
    (
      touched.phone ||
      showValidation
    );

  const showEmailSuggestions =
    canSuggestEmailSuffix(
      data.email,
    );

  function markTouched(
    field,
  ) {
    setTouched(
      (
        current,
      ) => ({
        ...current,

        [field]:
          true,
      }),
    );
  }

  function handleEmailChange(
    value,
  ) {
    onChange(
      "email",
      sanitizeEmail(
        value,
      ),
    );
  }

  function handleEmailSuggestion(
    suffix,
  ) {
    const nextEmail =
      applyEmailSuffix(
        data.email,
        suffix,
      );

    onChange(
      "email",
      nextEmail,
    );

    markTouched(
      "email",
    );
  }

  return (
    <div>
      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="border-b border-[#e0e7ec] pb-7">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium tracking-[0.12em] text-[#356f9f]">
            01
          </span>

          <div className="h-px w-8 bg-[#6fa7d1]" />
        </div>

        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-4xl">
          {internalMode
            ? "Dados de contato do solicitante"
            : "Seus dados de contato"}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667887] sm:text-base">
          {internalMode
            ? "Informe os dados da pessoa responsável pela demanda para manter a identificação e a rastreabilidade da solicitação."
            : "Essas informações serão utilizadas para identificar a solicitação e permitir que nossa equipe entre em contato sobre o projeto."}
        </p>
      </div>

      {/* =====================================================
          CAMPOS
      ===================================================== */}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* ===================================================
            NOME
        =================================================== */}

        <Field
          label="Nome"
          required
          error={
            showNameError
              ? validation
                  .errors
                  .name
              : ""
          }
        >
          <input
            type="text"
            value={
              data.name
            }
            onChange={(event) =>
              onChange(
                "name",
                event.target.value,
              )
            }
            onBlur={() =>
              markTouched(
                "name",
              )
            }
            placeholder={
              internalMode
                ? "Nome do contato"
                : "Seu nome"
            }
            autoComplete="name"
            className={getInputClasses(
              showNameError,
            )}
          />
        </Field>

        {/* ===================================================
            EMPRESA
        =================================================== */}

        <Field label="Empresa">
          <input
            type="text"
            value={
              data.company
            }
            onChange={(event) =>
              onChange(
                "company",
                event.target.value,
              )
            }
            placeholder="Nome da empresa"
            autoComplete="organization"
            className={getInputClasses(
              false,
            )}
          />
        </Field>

        {/* ===================================================
            E-MAIL
        =================================================== */}

        <Field
          label="E-mail"
          required
          error={
            showEmailError
              ? validation
                  .errors
                  .email
              : ""
          }
        >
          <input
            type="email"
            value={
              data.email
            }
            onChange={(event) =>
              handleEmailChange(
                event.target.value,
              )
            }
            onBlur={() =>
              markTouched(
                "email",
              )
            }
            placeholder="nome@empresa.com.br"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            spellCheck={false}
            className={getInputClasses(
              showEmailError,
            )}
          />

          {/* ===============================================
              SUGESTÕES DE DOMÍNIO
          =============================================== */}

          {showEmailSuggestions && (
            <div className="mt-2.5">
              <p className="text-[11px] font-medium text-[#718895]">
                Completar domínio:
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {EMAIL_SUFFIXES.map(
                  (
                    suffix,
                  ) => (
                    <button
                      key={
                        suffix
                      }
                      type="button"
                      onMouseDown={(
                        event,
                      ) =>
                        event.preventDefault()
                      }
                      onClick={() =>
                        handleEmailSuggestion(
                          suffix,
                        )
                      }
                      className="
                        rounded-full
                        border
                        border-[#c8dbe5]
                        bg-[#f1f7fa]
                        px-3
                        py-1.5
                        text-[11px]
                        font-semibold
                        text-[#477187]
                        transition
                        hover:border-[#8eb6ca]
                        hover:bg-white
                        hover:text-[#0057b8]
                      "
                    >
                      {suffix}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </Field>

        {/* ===================================================
            TELEFONE
        =================================================== */}

        <Field
          label="Telefone"
          required
          error={
            showPhoneError
              ? validation
                  .errors
                  .phone
              : ""
          }
        >
          <input
            type="tel"
            value={
              data.phone
            }
            onChange={(event) =>
              onChange(
                "phone",
                formatPhone(
                  event.target.value,
                ),
              )
            }
            onBlur={() =>
              markTouched(
                "phone",
              )
            }
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            inputMode="numeric"
            maxLength={15}
            className={getInputClasses(
              showPhoneError,
            )}
          />
        </Field>
      </div>

      {/* =====================================================
          ORIENTAÇÃO
      ===================================================== */}

      <div className="mt-8 rounded-[18px] border border-[#d9e6ed] bg-[#f3f8fb] px-5 py-4">
        <p className="text-[13px] leading-5 text-[#607786]">
          <span className="font-semibold text-[#356f9f]">
            Sobre os próximos passos:
          </span>{" "}
          na próxima etapa será possível cadastrar uma ou mais peças e informar
          individualmente os serviços necessários para cada uma.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 * FIELD
 * ============================================================ */

function Field({
  label,
  required = false,
  error = "",
  children,
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#415b6c]">
        {label}

        {required && (
          <span className="ml-1 text-[#356f9f]">
            *
          </span>
        )}
      </span>

      {children}

      {error && (
        <span className="mt-2 block text-[12px] font-medium leading-4 text-[#a25443]">
          {error}
        </span>
      )}
    </label>
  );
}

/* ============================================================
 * INPUT
 * ============================================================ */

function getInputClasses(
  error,
) {
  return `
    h-12
    w-full
    rounded-[12px]
    border
    bg-white
    px-4
    text-sm
    text-[#0b2340]
    outline-none
    transition-all
    duration-200
    placeholder:text-[#9aa8b2]

    ${
      error
        ? `
          border-[#cf8e7e]
          focus:border-[#bd6f5c]
          focus:ring-4
          focus:ring-[#bd6f5c]/10
        `
        : `
          border-[#d6e0e6]
          hover:border-[#b8cbd7]
          focus:border-[#568fb8]
          focus:ring-4
          focus:ring-[#568fb8]/10
        `
    }
  `;
}