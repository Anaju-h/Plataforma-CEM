import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginInternal, logoutInternal } from "../../services/authApi";

// Login da área interna no padrão visual oficial (mesma linguagem da área do cliente e do portal interno).
// A sessão é um JWT em cookie HttpOnly emitido pelo backend: nada é gravado no navegador.

const ROLE_ACCOUNTS = [
  { label: "Consulta", email: "consulta@lab.local", hint: "Somente leitura" },
  { label: "Técnico", email: "tecnico@lab.local", hint: "Executa tarefas e aponta horas" },
  { label: "Validador", email: "validador@lab.local", hint: "Tarefas e validação de lições" },
  { label: "Administrador", email: "admin@lab.local", hint: "Gestão completa e delegação" },
];

export function LoginPage() {
  const navigate = useNavigate();
  // A tela de login sempre exige credenciais: uma sessão interna anterior é encerrada ao chegar aqui.
  useEffect(() => { logoutInternal().catch(() => null); }, []);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loginInternal(email, password);
      navigate(location.state?.from || "/portal", { replace: true });
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#e5eef3]">
      {/* =====================================================
          FUNDO (mesmo do acesso do cliente + degradê)
      ===================================================== */}

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f3f8fb_0%,#e5eef3_42%,#d6e5ee_72%,#c9dce8_100%)]" />
        <div className="absolute -left-[220px] top-[40px] h-[520px] w-[520px] rounded-full bg-[#65b8ee]/10 blur-[130px]" />
        <div className="absolute -right-[180px] top-[12%] h-[560px] w-[560px] rounded-full bg-[#0057b8]/8 blur-[150px]" />
        <div className="absolute bottom-[-220px] left-[34%] h-[500px] w-[650px] rounded-full bg-white/40 blur-[150px]" />
        <div className="absolute -right-[210px] top-[90px] h-[470px] w-[470px] rounded-full border border-[#0057b8]/7" />
        <div className="absolute -right-[90px] top-[190px] h-[280px] w-[280px] rounded-full border border-[#65b8ee]/10" />
      </div>

      {/* =====================================================
          CONTEÚDO — tela única: coluna institucional à esquerda, acesso à direita
      ===================================================== */}

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1320px] items-center gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-14 lg:px-10 xl:gap-20">
        {/* ===================================================
            LADO ESQUERDO (mesma altura do cartão)
        =================================================== */}

        <div className="flex max-w-[700px] flex-col gap-9 lg:self-stretch lg:justify-start lg:gap-10">
          <div className="flex items-center gap-5">
            <BrandLogo src="/brand/centro-de-excelencia-senai.png" alt="Centro de Excelência em Metrologia · SENAI · ZEISS" width={255} box={[1536, 1024, 55, 365, 1416, 578]} />
            <span aria-hidden="true" className="h-10 w-px bg-[#9fb9c8]/60" />
            <BrandLogo src="/brand/logo-senai.png" alt="SENAI" width={112} box={[676, 369, 1, 67, 673, 238]} />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#0057b8]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#0057b8]">Portal Interno</p>
            </div>

            <h1 className="mt-4 text-[38px] font-semibold leading-[1.03] tracking-[-0.045em] text-[#071f2d] sm:text-[44px] lg:text-[50px] xl:text-[54px]">
              Gestão integrada do laboratório.
            </h1>

            <p className="mt-5 max-w-[590px] text-[14px] leading-7 text-[#607886] sm:text-[15px]">
              Solicitações, orçamentos, propostas, projetos e o conhecimento
              acumulado em cada serviço, em um único ambiente da equipe do
              Centro de Excelência em Metrologia.
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <FeatureItem icon={<FlowIcon />} title="Solicitações e orçamentos" description="Do pedido do cliente à proposta aceita." />
            <FeatureItem icon={<ProposalIcon />} title="Projetos" description="Execução, checklist e conclusão dos serviços." />
            <FeatureItem icon={<KnowledgeIcon />} title="Gestão do Conhecimento" description="Cada serviço melhora o próximo orçamento." />
            <FeatureItem icon={<ShieldIcon />} title="Perfis de acesso" description="Consulta, Técnico, Validador e Administrador." />
          </div>
        </div>

        {/* ===================================================
            CARD DE ACESSO (mesmo card do cliente)
        =================================================== */}

        <div className="relative overflow-hidden rounded-[26px] border border-white/72 bg-white/48 p-6 shadow-[0_28px_76px_rgba(31,68,92,0.10)] backdrop-blur-[26px] sm:p-7 lg:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-[110px] -top-[100px] h-[260px] w-[260px] rounded-full bg-[#65b8ee]/12 blur-[80px]" />
            <div className="absolute -bottom-[130px] -left-[100px] h-[260px] w-[260px] rounded-full bg-[#0057b8]/7 blur-[90px]" />
            <div className="absolute left-[12%] right-[12%] top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.13)_0%,transparent_42%,rgba(7,31,45,0.018)_100%)]" />
          </div>

          <div className="relative z-10">
            <div className="mb-6 flex gap-2" aria-hidden="true"><span className="h-1 flex-1 rounded-full bg-[#0057b8]" /><span className="h-1 flex-1 rounded-full bg-[#c5d7e0]" /></div>

            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#356f9f]">Acesso da equipe</p>
                <h2 className="mt-2 text-[27px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#071f2d]">Entre no portal.</h2>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[#b9d0dc]/54 bg-white/40 text-[#0057b8] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"><ShieldIcon /></span>
            </div>

            <p className="mt-3 text-[14px] leading-6 text-[#5f7886]">Use seu e-mail institucional e senha para acessar a área interna.</p>

            <form className="mt-5 space-y-3.5" onSubmit={handleSubmit}>
              <Field label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="username" placeholder="nome@lab.local" />
              <Field label="Senha" type="password" value={password} onChange={setPassword} autoComplete="current-password" placeholder="••••••••" />

              {error && <p role="alert" className="rounded-[10px] border border-[#e3c5bc] bg-[#faf0ed] px-3.5 py-2.5 text-[13px] text-[#8f5544]">{error}</p>}

              <button type="submit" disabled={busy} className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-3 rounded-[11px] border border-white/24 bg-[linear-gradient(135deg,rgba(29,83,112,0.94)_0%,rgba(16,62,88,0.98)_100%)] px-5 py-3 text-[12px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_10px_24px_rgba(7,31,45,0.14)] transition-colors hover:bg-[#12364e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0057b8] disabled:opacity-60">
                {busy ? "Entrando…" : "Entrar no portal"} <span aria-hidden="true">→</span>
              </button>
            </form>

            {/* ACESSO POR PERFIL */}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#b9ccd6]/48" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#7b909b]">Acesso por perfil</span>
              <div className="h-px flex-1 bg-[#b9ccd6]/48" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {ROLE_ACCOUNTS.map(account => (
                <button key={account.email} type="button" onClick={() => { setEmail(account.email); setPassword("Lab@2026"); setError(""); }}
                  className={`rounded-[13px] border px-3.5 py-3 text-left transition-colors ${email === account.email ? "border-[#0057b8]/35 bg-white/80" : "border-white/56 bg-white/28 hover:bg-white/60"}`}>
                  <span className="block text-[13.5px] font-semibold text-[#244d64]">{account.label}</span>
                  <span className="block truncate text-[12px] leading-5 text-[#66808e]">{account.hint}</span>
                </button>
              ))}
            </div>

            <p className="mt-5 text-center text-[11.5px] leading-5 text-[#7b909b]">Senha inicial dos perfis: Lab@2026. Sessão protegida por cookie HttpOnly assinado.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, type, value, onChange, autoComplete, placeholder }) {
  return (
    <label className="block text-[13px] font-medium text-[#415b6c]">
      {label}
      <input required type={type} value={value} placeholder={placeholder} autoComplete={autoComplete} onChange={event => onChange(event.target.value)}
        className="mt-1.5 h-12 w-full rounded-[11px] border border-[#c9d9e2] bg-white/80 px-4 text-[15px] text-[#071f2d] outline-none transition placeholder:text-[#a2afb7] focus:border-[#568fb8] focus:ring-4 focus:ring-[#568fb8]/10" />
    </label>
  );
}

// As PNGs têm muita margem transparente; o recorte mostra só a área útil da marca.
// box = [larguraImagem, alturaImagem, x0, y0, x1, y1] da área visível.
function BrandLogo({ src, alt, width, box }) {
  const [imageWidth, , x0, y0, x1, y1] = box;
  const contentWidth = x1 - x0;
  const contentHeight = y1 - y0;
  return (
    <span className="relative block shrink-0 overflow-hidden" style={{ width, aspectRatio: `${contentWidth} / ${contentHeight}` }}>
      <img src={src} alt={alt} className="absolute max-w-none" style={{ width: `${(imageWidth / contentWidth) * 100}%`, left: `${(-x0 / contentWidth) * 100}%`, top: `${(-y0 / contentHeight) * 100}%` }} />
    </span>
  );
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 rounded-[18px] border border-white/60 bg-white/32 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_26px_rgba(31,68,92,0.05)] backdrop-blur-[14px]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#b9d0dc]/60 bg-white/50 text-[#0057b8]">{icon}</span>
      <div>
        <p className="text-[14px] font-semibold text-[#17394f]">{title}</p>
        <p className="mt-1 text-[12.5px] leading-5 text-[#5f7886]">{description}</p>
      </div>
    </div>
  );
}

function Icon({ children }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
function FlowIcon() { return <Icon><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="12" r="2.5" /><path d="M7.5 12h9M13 8l3.5 4-3.5 4" /></Icon>; }
function ProposalIcon() { return <Icon><path d="M7 3h7l4 4v14H6V3h1Z" /><path d="M14 3v5h4M9 13h6M9 17h4" /></Icon>; }
function KnowledgeIcon() { return <Icon><path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3Z" /><path d="M9.5 21h5" /></Icon>; }
function ShieldIcon() { return <Icon><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9.5 12 2 2 3.5-4" /></Icon>; }
