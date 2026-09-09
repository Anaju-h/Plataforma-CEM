import { Link } from "react-router-dom";

export function CustomerAccessPage() {
  return (
    <section className="relative min-h-[calc(100vh-78px)] overflow-hidden">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          inset-x-0 top-0
          h-[360px]
          bg-[linear-gradient(180deg,#eaf3f8_0%,rgba(234,243,248,0)_100%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          right-[-180px] top-[100px]
          h-[420px] w-[420px]
          rounded-full
          border border-[#0057b8]/[0.06]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          right-[-80px] top-[200px]
          h-[260px] w-[260px]
          rounded-full
          border border-[#0057b8]/[0.08]
        "
      />

      <div
        className="
          relative z-10
          mx-auto grid min-h-[calc(100vh-78px)]
          max-w-[1180px]
          items-center gap-14
          px-5 py-14
          sm:px-7
          lg:grid-cols-[1fr_480px]
          lg:px-9 lg:py-20
        "
      >
        <div className="max-w-[620px]">
          <div
            className="
              mb-6 inline-flex items-center gap-2
              text-[12px] font-semibold uppercase
              tracking-[0.16em]
              text-[#0057b8]
            "
          >
            <span className="h-px w-8 bg-[#0057b8]" />
            Portal exclusivo
          </div>

          <h1
            className="
              max-w-[580px]
              text-[38px] font-semibold
              leading-[1.08]
              tracking-[-0.035em]
              text-[#071f2d]
              sm:text-[46px]
              lg:text-[54px]
            "
          >
            Acompanhe tudo em um só lugar.
          </h1>

          <p
            className="
              mt-6 max-w-[560px]
              text-[16px]
              leading-7
              text-[#5b6570]
              sm:text-[17px]
            "
          >
            Consulte solicitações, acompanhe orçamentos e projetos e acesse
            documentos relacionados aos serviços realizados pelo laboratório.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <div>
              <div
                className="
                  mb-3 flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  bg-[#eaf3fb]
                  text-[#0057b8]
                "
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 3.5H16V16.5H4V3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M7 7H13M7 10H13M7 13H10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="text-[14px] font-semibold text-[#071f2d]">
                Solicitações
              </p>

              <p className="mt-1 text-[13px] leading-5 text-[#6b7480]">
                Consulte o andamento das análises enviadas.
              </p>
            </div>

            <div>
              <div
                className="
                  mb-3 flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  bg-[#eaf3fb]
                  text-[#0057b8]
                "
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 5.5H16.5V14.5H3.5V5.5Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M6.5 9H13.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.5 11.5H10.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="text-[14px] font-semibold text-[#071f2d]">
                Orçamentos
              </p>

              <p className="mt-1 text-[13px] leading-5 text-[#6b7480]">
                Visualize e responda propostas recebidas.
              </p>
            </div>

            <div>
              <div
                className="
                  mb-3 flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  bg-[#eaf3fb]
                  text-[#0057b8]
                "
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 15.5V5.5L10 3L16 5.5V15.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 16V11H13V16"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </div>

              <p className="text-[14px] font-semibold text-[#071f2d]">
                Projetos
              </p>

              <p className="mt-1 text-[13px] leading-5 text-[#6b7480]">
                Acompanhe serviços já aprovados.
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            rounded-[22px]
            border border-[#dce4e9]
            bg-white
            p-6
            shadow-[0_24px_70px_rgba(7,31,45,0.08)]
            sm:p-8
          "
        >
          <div className="mb-8">
            <p
              className="
                text-[12px] font-semibold uppercase
                tracking-[0.14em]
                text-[#0057b8]
              "
            >
              Área do cliente
            </p>

            <h2
              className="
                mt-3 text-[26px] font-semibold
                tracking-[-0.025em]
                text-[#071f2d]
              "
            >
              Acesse sua empresa
            </h2>

            <p className="mt-3 text-[14px] leading-6 text-[#68737d]">
              Informe seu e-mail corporativo para continuar.
            </p>
          </div>

          <div>
            <label
              htmlFor="customer-email"
              className="
                mb-2 block
                text-[13px] font-semibold
                text-[#24333d]
              "
            >
              E-mail corporativo
            </label>

            <input
              id="customer-email"
              type="email"
              placeholder="nome@empresa.com.br"
              autoComplete="email"
              className="
                h-[52px] w-full
                rounded-[10px]
                border border-[#ccd6dc]
                bg-white
                px-4
                text-[14px]
                text-[#17232b]
                outline-none
                transition-all duration-200
                placeholder:text-[#9aa5ad]
                focus:border-[#0057b8]
                focus:ring-4
                focus:ring-[#0057b8]/[0.08]
              "
            />
          </div>

          <Link
            to="/cliente/dashboard"
            className="
              mt-5 flex h-[52px] w-full
              items-center justify-center gap-2
              rounded-[10px]
              bg-[#0057b8]
              text-[14px] font-semibold
              text-white
              transition-all duration-200
              hover:bg-[#004a9d]
            "
          >
            Continuar

            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M9.5 4.5L13 8L9.5 11.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e1e7eb]" />

            <span
              className="
                text-[11px] font-medium uppercase
                tracking-[0.12em]
                text-[#99a2aa]
              "
            >
              ou
            </span>

            <div className="h-px flex-1 bg-[#e1e7eb]" />
          </div>

          <div className="text-center">
            <p className="text-[13px] text-[#6b7480]">
              Ainda não possui solicitações conosco?
            </p>

            <Link
              to="/orcamento"
              className="
                mt-2 inline-flex
                text-[13px] font-semibold
                text-[#0057b8]
                transition-colors duration-200
                hover:text-[#003a70]
              "
            >
              Solicitar uma análise
            </Link>
          </div>

          <div
            className="
              mt-7 rounded-[10px]
              border border-[#dfe7ec]
              bg-[#f7f9fa]
              px-4 py-3
            "
          >
            <p className="text-[11px] leading-5 text-[#7a858d]">
              Ambiente demonstrativo. A autenticação segura será integrada em
              uma etapa posterior do desenvolvimento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}