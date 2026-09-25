import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentCustomer } from "../../services/customer/customerService";
import { CustomerAuthCard } from "../../components/customer/CustomerAuthCard";

export function CustomerAccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Sessão já ativa (cookie HttpOnly) segue direto ao painel, exceto quando há uma SOL a vincular.
  useEffect(() => {
    if (location.state?.claim) return undefined;
    let active = true;
    getCurrentCustomer().then(() => { if (active) navigate("/cliente/dashboard", { replace: true }); }).catch(() => null);
    return () => { active = false; };
  }, [location.state, navigate]);

  return (
    <section className="relative min-h-[calc(100vh-92px)] overflow-hidden bg-[#e5eef3]">
      {/* =====================================================
          FUNDO
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f3f8fb_0%,#e5eef3_42%,#d6e5ee_72%,#c9dce8_100%)]" />

        <div className="absolute -left-[220px] top-[40px] h-[520px] w-[520px] rounded-full bg-[#65b8ee]/10 blur-[130px]" />

        <div className="absolute -right-[180px] top-[12%] h-[560px] w-[560px] rounded-full bg-[#0057b8]/8 blur-[150px]" />

        <div className="absolute bottom-[-220px] left-[34%] h-[500px] w-[650px] rounded-full bg-white/40 blur-[150px]" />

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

            <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#0057b8]">
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
              text-[15px]
              leading-7
              text-[#607886]
              sm:text-[15px]
            "
          >
            Acompanhe solicitações, consulte orçamentos, visualize seus projetos
            e acesse documentos relacionados aos serviços realizados pelo
            Centro de Excelência em Metrologia.
          </p>

          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:mt-10">
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

          <CustomerAuthCard />
        </div>
      </div>
    </section>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-4 rounded-[18px] border border-white/60 bg-white/32 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_26px_rgba(31,68,92,0.05)] backdrop-blur-[14px]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#b9d0dc]/60 bg-white/50 text-[#0057b8]">
        {icon}
      </span>

      <div>
        <p className="text-[15px] font-semibold text-[#17394f]">
          {title}
        </p>

        <p className="mt-1 text-[14px] leading-5 text-[#5f7886]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 * VALIDAÇÃO LOCAL
 * ============================================================ */

function RequestIcon() {
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
      width="19"
      height="19"
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
      width="19"
      height="19"
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
      width="19"
      height="19"
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