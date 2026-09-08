import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    localStorage.setItem(
      "lab-portal-session",
      JSON.stringify({
        authenticated: true,
        role: "ADMIN",
        name: "Administrador",
      }),
    );

    navigate("/portal");
  }

  return (
    <main className="min-h-screen bg-[#071f2d]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <div
            aria-hidden="true"
            className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full border border-white/[0.05]"
          />

          <div
            aria-hidden="true"
            className="absolute left-20 top-10 h-[360px] w-[360px] rounded-full border border-[#65b8ee]/[0.07]"
          />

          <div className="relative z-10 flex h-full flex-col justify-between px-14 py-12 xl:px-20">
            <img
              src="/brand/zeiss-senai-branco.png"
              alt="Centro de Excelência em Metrologia"
              className="w-[260px]"
            />

            <div className="max-w-xl pb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#65b8ee]">
                Portal interno
              </p>

              <h1 className="mt-5 text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-white">
                Gestão integrada do laboratório.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-[#b9cbd5]">
                Solicitações, orçamentos, projetos, conhecimento técnico e
                informações operacionais em um único ambiente.
              </p>
            </div>

            <p className="text-xs text-white/40">
              Centro de Excelência em Metrologia · SENAI · ZEISS
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#eef3f6] px-5 py-10 sm:px-8">
          <div className="w-full max-w-[460px]">
            <div className="mb-8 lg:hidden">
              <img
                src="/brand/zeiss-senai.png"
                alt="Centro de Excelência em Metrologia"
                className="w-[220px]"
              />
            </div>

            <div className="rounded-[28px] border border-[#cbd9e1] bg-white p-7 shadow-[0_25px_70px_rgba(25,61,83,0.08)] sm:p-9">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#356f9f]">
                  Acesso administrativo
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340]">
                  Bem-vindo.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#667d8b]">
                  Entre para acessar a área interna de gestão do laboratório.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <Field
                  label="E-mail"
                  type="email"
                  placeholder="nome@empresa.com"
                />

                <Field
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                />

                <button
                  type="submit"
                  className="
                    mt-2 flex h-[52px] w-full cursor-pointer
                    items-center justify-center gap-3
                    rounded-[13px]
                    bg-[#096ab2]
                    px-5
                    text-[11px] font-semibold
                    uppercase tracking-[0.12em]
                    text-white
                    transition-all duration-300
                    hover:bg-[#075b99]
                    hover:shadow-[0_12px_26px_rgba(9,106,178,0.20)]
                  "
                >
                  Entrar no portal
                  <span>→</span>
                </button>
              </form>

              <div className="mt-6 border-t border-[#e0e7ec] pt-5">
                <p className="text-[10px] leading-5 text-[#83939d]">
                  A autenticação desta versão é demonstrativa. A integração
                  corporativa será definida na etapa de implantação.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  type,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-xs font-medium uppercase tracking-[0.08em] text-[#415b6c]">
        {label}
      </span>

      <input
        required
        type={type}
        placeholder={placeholder}
        className="
          h-12 w-full
          rounded-[12px]
          border border-[#d6e0e6]
          bg-white
          px-4
          text-sm text-[#0b2340]
          outline-none
          transition-all duration-200
          placeholder:text-[#a2afb7]
          hover:border-[#b8cbd7]
          focus:border-[#568fb8]
          focus:ring-4
          focus:ring-[#568fb8]/10
        "
      />
    </label>
  );
}