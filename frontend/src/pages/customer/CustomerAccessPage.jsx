import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function CustomerAccessPage() {
  const navigate =
    useNavigate();

  const [step, setStep] =
    useState("email");

  const [email, setEmail] =
    useState("");

  const [code, setCode] =
    useState([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const [error, setError] =
    useState("");

  function handleEmailSubmit(
    event,
  ) {
    event.preventDefault();

    const normalizedEmail =
      email.trim();

    if (
      !normalizedEmail
    ) {
      setError(
        "Informe seu e-mail corporativo.",
      );

      return;
    }

    if (
      !isValidEmail(
        normalizedEmail,
      )
    ) {
      setError(
        "Informe um e-mail válido.",
      );

      return;
    }

    setError("");

    /*
     * FUTURO:
     * chamar backend para solicitar código temporário.
     *
     * Exemplo conceitual:
     * POST /auth/customer/request-code
     */

    setStep(
      "code",
    );
  }

  function handleCodeChange(
    index,
    value,
  ) {
    const sanitized =
      value
        .replace(
          /\D/g,
          "",
        )
        .slice(
          0,
          1,
        );

    setCode(
      (
        current,
      ) => {
        const next = [
          ...current,
        ];

        next[index] =
          sanitized;

        return next;
      },
    );

    setError("");

    if (
      sanitized &&
      index < 5
    ) {
      const nextInput =
        document.getElementById(
          `access-code-${index + 1}`,
        );

      nextInput?.focus();
    }
  }

  function handleCodeKeyDown(
    event,
    index,
  ) {
    if (
      event.key ===
        "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      const previousInput =
        document.getElementById(
          `access-code-${index - 1}`,
        );

      previousInput?.focus();
    }
  }

  function handleCodePaste(
    event,
  ) {
    const pasted =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!pasted) {
      return;
    }

    event.preventDefault();

    const next = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pasted
      .split("")
      .forEach(
        (
          character,
          index,
        ) => {
          next[index] =
            character;
        },
      );

    setCode(
      next,
    );

    const targetIndex =
      Math.min(
        pasted.length,
        6,
      ) - 1;

    document
      .getElementById(
        `access-code-${targetIndex}`,
      )
      ?.focus();
  }

  function handleCodeSubmit(
    event,
  ) {
    event.preventDefault();

    const completeCode =
      code.join("");

    if (
      completeCode.length !==
      6
    ) {
      setError(
        "Digite os 6 dígitos do código recebido.",
      );

      return;
    }

    setError("");

    /*
     * FUTURO:
     * validar o código no backend.
     *
     * Exemplo conceitual:
     * POST /auth/customer/verify-code
     *
     * O backend será responsável por autenticação,
     * autorização e sessão segura.
     */

    navigate(
      "/cliente/dashboard",
    );
  }

  function changeEmail() {
    setStep(
      "email",
    );

    setCode([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    setError("");
  }

  return (
    <section className="relative min-h-[calc(100vh-92px)] overflow-hidden bg-[#e5eef3]">
      {/* =====================================================
          FUNDO
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#e5eef3]" />

        <div className="absolute -left-[220px] top-[40px] h-[520px] w-[520px] rounded-full bg-[#65b8ee]/8 blur-[130px]" />

        <div className="absolute -right-[180px] top-[12%] h-[560px] w-[560px] rounded-full bg-[#0057b8]/5 blur-[150px]" />

        <div className="absolute bottom-[-220px] left-[34%] h-[500px] w-[650px] rounded-full bg-white/30 blur-[150px]" />

        <div className="absolute -right-[210px] top-[90px] h-[470px] w-[470px] rounded-full border border-[#0057b8]/7" />

        <div className="absolute -right-[90px] top-[190px] h-[280px] w-[280px] rounded-full border border-[#65b8ee]/10" />
      </div>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          min-h-[calc(100vh-92px)]
          max-w-[1320px]
          items-center
          gap-10
          px-5
          py-8
          sm:px-8
          sm:py-10
          lg:grid-cols-[minmax(0,1fr)_470px]
          lg:gap-14
          lg:px-10
          lg:py-12
          xl:gap-20
        "
      >
        {/* ===================================================
            LADO ESQUERDO
        =================================================== */}

        <div className="max-w-[680px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#0057b8]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#0057b8]">
              Área do Cliente
            </p>
          </div>

          <h1
            className="
              mt-5
              max-w-[650px]
              text-[38px]
              font-semibold
              leading-[1.03]
              tracking-[-0.045em]
              text-[#071f2d]
              sm:text-[44px]
              lg:text-[50px]
              xl:text-[54px]
            "
          >
            Sua relação com o Centro, em um só lugar.
          </h1>

          <p
            className="
              mt-5
              max-w-[590px]
              text-[14px]
              leading-7
              text-[#607886]
              sm:text-[15px]
            "
          >
            Acompanhe solicitações, consulte orçamentos, visualize seus projetos
            e acesse documentos relacionados aos serviços realizados pelo
            Centro de Excelência em Metrologia.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <FeatureItem
              icon={
                <RequestIcon />
              }
              title="Solicitações"
              description="Acompanhe análises enviadas ao Centro."
            />

            <FeatureItem
              icon={
                <QuoteIcon />
              }
              title="Orçamentos"
              description="Consulte propostas vinculadas à sua empresa."
            />

            <FeatureItem
              icon={
                <ProjectIcon />
              }
              title="Projetos"
              description="Acompanhe serviços que já estão em execução."
            />

            <FeatureItem
              icon={
                <DocumentIcon />
              }
              title="Documentos"
              description="Centralize arquivos relacionados aos seus projetos."
            />
          </div>
        </div>

        {/* ===================================================
            CARD DE ACESSO
        =================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[26px]
            border
            border-white/72
            bg-white/48
            p-6
            shadow-[0_28px_76px_rgba(31,68,92,0.10)]
            backdrop-blur-[26px]
            sm:p-7
            lg:p-8
          "
        >
          {/* GLASS */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -right-[110px] -top-[100px] h-[260px] w-[260px] rounded-full bg-[#65b8ee]/12 blur-[80px]" />

            <div className="absolute -bottom-[130px] -left-[100px] h-[260px] w-[260px] rounded-full bg-[#0057b8]/7 blur-[90px]" />

            <div className="absolute left-[12%] right-[12%] top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.13)_0%,transparent_42%,rgba(7,31,45,0.018)_100%)]" />
          </div>

          <div className="relative z-10">
            {/* ===============================================
                INDICADOR DO FLUXO
            =============================================== */}

            <div className="mb-6 flex items-center gap-2">
              <span
                className={`
                  h-[4px]
                  flex-1
                  rounded-full
                  transition-colors
                  duration-300

                  ${
                    step ===
                    "email"
                      ? "bg-[#0057b8]"
                      : "bg-[#8bc5e8]"
                  }
                `}
              />

              <span
                className={`
                  h-[4px]
                  flex-1
                  rounded-full
                  transition-colors
                  duration-300

                  ${
                    step ===
                    "code"
                      ? "bg-[#0057b8]"
                      : "bg-[#c5d7e0]"
                  }
                `}
              />
            </div>

            {step ===
              "email" && (
              <EmailAccessStep
                email={
                  email
                }
                error={
                  error
                }
                onEmailChange={(
                  value,
                ) => {
                  setEmail(
                    value,
                  );

                  setError(
                    "",
                  );
                }}
                onSubmit={
                  handleEmailSubmit
                }
              />
            )}

            {step ===
              "code" && (
              <CodeAccessStep
                email={
                  email
                }
                code={
                  code
                }
                error={
                  error
                }
                onCodeChange={
                  handleCodeChange
                }
                onCodeKeyDown={
                  handleCodeKeyDown
                }
                onCodePaste={
                  handleCodePaste
                }
                onSubmit={
                  handleCodeSubmit
                }
                onChangeEmail={
                  changeEmail
                }
              />
            )}

            {/* ===============================================
                CADASTRO
            =============================================== */}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#b9ccd6]/48" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8a9da7]">
                Primeiro acesso
              </span>

              <div className="h-px flex-1 bg-[#b9ccd6]/48" />
            </div>

            <div
              className="
                rounded-[15px]
                border
                border-[#b8ced9]/58
                bg-[#e7f1f5]/46
                px-4
                py-4
              "
            >
              <div className="flex items-start gap-3">
                <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-[#65b8ee]" />

                <div>
                  <p className="text-[11px] font-semibold text-[#315d75]">
                    Ainda não possui acesso?
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#748a95]">
                    Se sua empresa já possui relacionamento com o Centro, você
                    poderá criar seu acesso utilizando seu e-mail corporativo.
                  </p>

                  <button
                    type="button"
                    className="
                      mt-2.5
                      inline-flex
                      items-center
                      gap-2
                      text-[10px]
                      font-semibold
                      text-[#0057b8]
                      transition-colors
                      hover:text-[#003e82]
                    "
                  >
                    Criar meu acesso
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[9px] leading-4 text-[#8b9ca5]">
              Ambiente demonstrativo. O envio e a validação real do código serão
              integrados ao serviço de autenticação posteriormente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * ETAPA — E-MAIL
 * ============================================================ */

function EmailAccessStep({
  email,
  error,
  onEmailChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={
        onSubmit
      }
    >
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#356f9f]">
            Acesso
          </p>

          <h2
            className="
              mt-2
              text-[27px]
              font-semibold
              leading-[1.08]
              tracking-[-0.035em]
              text-[#071f2d]
            "
          >
            Entre na sua área.
          </h2>
        </div>

        <AccessIcon>
          <UserIcon />
        </AccessIcon>
      </div>

      <p className="mt-3 text-[12px] leading-6 text-[#6d828e]">
        Informe seu e-mail corporativo. Enviaremos um código temporário para
        confirmar seu acesso.
      </p>

      <div className="mt-7">
        <label
          htmlFor="customer-email"
          className="mb-2 block text-[11px] font-semibold text-[#31566d]"
        >
          E-mail corporativo
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#7693a2]">
            <MailIcon />
          </div>

          <input
            id="customer-email"
            type="email"
            value={
              email
            }
            onChange={(
              event,
            ) =>
              onEmailChange(
                event.target
                  .value,
              )
            }
            placeholder="nome@empresa.com.br"
            autoComplete="email"
            className={`
              h-[52px]
              w-full
              rounded-[12px]
              border
              bg-white/42
              pl-11
              pr-4
              text-[13px]
              text-[#173044]
              outline-none
              backdrop-blur-[14px]
              transition-all
              duration-200
              placeholder:text-[#93a5ae]
              focus:bg-white/64
              focus:ring-4

              ${
                error
                  ? "border-[#b66a6a] focus:border-[#b66a6a] focus:ring-[#b66a6a]/8"
                  : "border-[#bfcfd7]/76 focus:border-[#6da4c1] focus:ring-[#65b8ee]/10"
              }
            `}
          />
        </div>

        {error && (
          <p className="mt-2 text-[10px] font-medium text-[#9a5454]">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="
          group
          mt-4
          flex
          h-[50px]
          w-full
          items-center
          justify-center
          gap-3
          rounded-[11px]
          border
          border-white/24
          bg-[linear-gradient(135deg,rgba(29,83,112,0.94)_0%,rgba(16,62,88,0.98)_100%)]
          px-5
          text-[12px]
          font-semibold
          text-white
          shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_10px_24px_rgba(7,31,45,0.14)]
          transition-all
          duration-300
          hover:-translate-y-[1px]
          hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_14px_30px_rgba(7,31,45,0.18)]
        "
      >
        Enviar código de acesso

        <span className="text-[15px] font-light transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}

/* ============================================================
 * ETAPA — CÓDIGO
 * ============================================================ */

function CodeAccessStep({
  email,
  code,
  error,
  onCodeChange,
  onCodeKeyDown,
  onCodePaste,
  onSubmit,
  onChangeEmail,
}) {
  return (
    <form
      onSubmit={
        onSubmit
      }
    >
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#356f9f]">
            Verificação
          </p>

          <h2
            className="
              mt-2
              text-[27px]
              font-semibold
              leading-[1.08]
              tracking-[-0.035em]
              text-[#071f2d]
            "
          >
            Confirme seu acesso.
          </h2>
        </div>

        <AccessIcon>
          <ShieldIcon />
        </AccessIcon>
      </div>

      <p className="mt-3 text-[12px] leading-6 text-[#6d828e]">
        Digite o código de 6 dígitos enviado para
        <span className="font-semibold text-[#31566d]">
          {" "}
          {email}
        </span>
        .
      </p>

      <button
        type="button"
        onClick={
          onChangeEmail
        }
        className="mt-1 text-[10px] font-semibold text-[#0057b8] transition-colors hover:text-[#003e82]"
      >
        Alterar e-mail
      </button>

      <div className="mt-7">
        <p className="mb-2 text-[11px] font-semibold text-[#31566d]">
          Código de acesso
        </p>

        <div
          className="grid grid-cols-6 gap-2"
          onPaste={
            onCodePaste
          }
        >
          {code.map(
            (
              digit,
              index,
            ) => (
              <input
                key={
                  index
                }
                id={`access-code-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete={
                  index === 0
                    ? "one-time-code"
                    : "off"
                }
                maxLength={1}
                value={
                  digit
                }
                onChange={(
                  event,
                ) =>
                  onCodeChange(
                    index,
                    event
                      .target
                      .value,
                  )
                }
                onKeyDown={(
                  event,
                ) =>
                  onCodeKeyDown(
                    event,
                    index,
                  )
                }
                aria-label={`Dígito ${index + 1} do código`}
                className={`
                  h-[54px]
                  min-w-0
                  rounded-[11px]
                  border
                  bg-white/42
                  text-center
                  text-[18px]
                  font-semibold
                  text-[#12364e]
                  outline-none
                  backdrop-blur-[14px]
                  transition-all
                  duration-200
                  focus:bg-white/68
                  focus:ring-4

                  ${
                    error
                      ? "border-[#b66a6a]/70 focus:border-[#b66a6a] focus:ring-[#b66a6a]/8"
                      : "border-[#bfcfd7]/76 focus:border-[#6da4c1] focus:ring-[#65b8ee]/10"
                  }
                `}
              />
            ),
          )}
        </div>

        {error && (
          <p className="mt-2 text-[10px] font-medium text-[#9a5454]">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="
          group
          mt-4
          flex
          h-[50px]
          w-full
          items-center
          justify-center
          gap-3
          rounded-[11px]
          border
          border-white/24
          bg-[linear-gradient(135deg,rgba(29,83,112,0.94)_0%,rgba(16,62,88,0.98)_100%)]
          px-5
          text-[12px]
          font-semibold
          text-white
          shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_10px_24px_rgba(7,31,45,0.14)]
          transition-all
          duration-300
          hover:-translate-y-[1px]
          hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_14px_30px_rgba(7,31,45,0.18)]
        "
      >
        Confirmar e acessar

        <span className="text-[15px] font-light transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>

      <button
        type="button"
        className="
          mt-3
          flex
          w-full
          items-center
          justify-center
          text-[10px]
          font-semibold
          text-[#688695]
          transition-colors
          hover:text-[#0057b8]
        "
      >
        Reenviar código
      </button>
    </form>
  );
}

/* ============================================================
 * COMPONENTES VISUAIS
 * ============================================================ */

function AccessIcon({
  children,
}) {
  return (
    <div
      className="
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-[13px]
        border
        border-white/68
        bg-white/34
        text-[#356f9f]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]
      "
    >
      {children}
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-[15px]
        border
        border-white/56
        bg-white/24
        px-4
        py-3.5
        shadow-[inset_0_1px_0_rgba(255,255,255,0.66)]
        backdrop-blur-[14px]
      "
    >
      <span
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-[10px]
          border
          border-[#b9d0dc]/54
          bg-white/36
          text-[#0057b8]
        "
      >
        {icon}
      </span>

      <div>
        <p className="text-[11px] font-semibold text-[#244d64]">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] leading-4 text-[#748995]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 * VALIDAÇÃO LOCAL
 * ============================================================ */

function isValidEmail(
  value,
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  );
}

/* ============================================================
 * ÍCONES
 * ============================================================ */

function UserIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4.5 21c.8-4.1 3.3-6.2 7.5-6.2s6.7 2.1 7.5 6.2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 19 6v5c0 4.6-2.7 8.1-7 10-4.3-1.9-7-5.4-7-10V6l7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function RequestIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16v12H4z" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 7V5a2 2 0 0 1 2-2h5l2 2h4" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h9l3 3v15H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h4" />
      <path d="M8 13h6" />
      <path d="M8 17h6" />
    </svg>
  );
}