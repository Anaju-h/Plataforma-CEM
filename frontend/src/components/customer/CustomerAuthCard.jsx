import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginCustomer, registerCustomer } from "../../services/authApi";
import {
  EMAIL_SUFFIXES,
  applyEmailSuffix,
  canSuggestEmailSuffix,
  formatPhone,
  isValidEmail,
  isValidPhone,
  sanitizeEmail,
} from "../../utils/contactValidation";

const inputBase = "mt-1.5 h-12 w-full rounded-[11px] border bg-white/80 px-4 text-[15px] text-[#071f2d] outline-none transition placeholder:text-[#a2afb7] focus:ring-4";
const inputOk = "border-[#c9d9e2] focus:border-[#568fb8] focus:ring-[#568fb8]/10";
const inputError = "border-[#d9a695] focus:border-[#c2785f] focus:ring-[#c2785f]/10";

function formatCnpj(value) {
  const n = String(value ?? "").replace(/\D/g, "").slice(0, 14);
  return n
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}
const cnpjDigits = value => String(value ?? "").replace(/\D/g, "");

function Input({ label, value, onChange, onBlur, error, type = "text", autoComplete, required = true, minLength, placeholder, inputMode, maxLength, children }) {
  return (
    <label className="block text-[13px] font-medium text-[#415b6c]">
      {label}{!required && <span className="font-normal text-[#8093a0]"> (opcional)</span>}
      <input className={`${inputBase} ${error ? inputError : inputOk}`} type={type} value={value} required={required} minLength={minLength} maxLength={maxLength}
        placeholder={placeholder} inputMode={inputMode} autoComplete={autoComplete} aria-invalid={Boolean(error)}
        onChange={event => onChange(event.target.value)} onBlur={onBlur} />
      {children}
      {error && <span className="mt-1.5 block text-[12.5px] font-normal text-[#a2553f]">{error}</span>}
    </label>
  );
}

// Login e cadastro reais. A sessão volta como cookie HttpOnly; nada é salvo no navegador.
// Quando o visitante chega do formulário público, `claim` vincula a SOL recém-criada à conta.
// Acesso rápido para apresentação: preenche e-mail e senha de contas de cliente existentes.
const QUICK_ACCOUNTS = [
  { name: "Ana Nunes", company: "COCA", email: "ana@gmail.com" },
  { name: "Gabriela Nunes", company: "Nunes Metrologia Industrial", email: "gabriela.nunes@nunesmetrologia.com.br" },
];
const QUICK_PASSWORD = "Cliente@2026";

export function CustomerAuthCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const claim = location.state?.claim || null;
  const [mode, setMode] = useState(claim ? "register" : "login");
  const [form, setForm] = useState({
    company: claim?.company || "", document: "", name: claim?.contact || "", email: sanitizeEmail(claim?.email || ""),
    phone: formatPhone(claim?.phone || ""), password: "", confirm: "",
  });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = key => value => setForm(current => ({ ...current, [key]: value }));
  const touch = key => () => setTouched(current => ({ ...current, [key]: true }));
  const claimPayload = claim ? { requestId: claim.requestId, claimToken: claim.claimToken } : null;
  const register = mode === "register";

  const errors = {
    email: !form.email ? "Informe seu e-mail." : !isValidEmail(form.email) ? "Informe um e-mail válido, como nome@empresa.com.br." : "",
    phone: register && form.phone && !isValidPhone(form.phone) ? "Informe DDD + número, com 10 ou 11 dígitos." : "",
    document: register && form.document && cnpjDigits(form.document).length !== 14 ? "O CNPJ deve ter 14 dígitos." : "",
    company: register && !form.company.trim() ? "Informe a empresa." : "",
    name: register && !form.name.trim() ? "Informe seu nome." : "",
    password: !form.password ? "Informe a senha." : register && form.password.length < 8 ? "A senha deve ter pelo menos 8 caracteres." : "",
    confirm: register && form.confirm !== form.password ? "As senhas não coincidem." : "",
  };
  const visible = key => (touched[key] || touched.submit) ? errors[key] : "";

  async function submit(event) {
    event.preventDefault();
    setError("");
    setTouched(current => ({ ...current, submit: true }));
    const keys = register ? ["company", "document", "phone", "name", "email", "password", "confirm"] : ["email", "password"];
    if (keys.some(key => errors[key])) return;
    setBusy(true);
    try {
      const email = sanitizeEmail(form.email).toLowerCase();
      if (!register) await loginCustomer(email, form.password, claimPayload);
      else await registerCustomer({ company: form.company.trim(), document: form.document || null, name: form.name.trim(), email, phone: form.phone || null, password: form.password }, claimPayload);
      navigate(claim ? `/cliente/solicitacoes/${claim.requestId}` : "/cliente/dashboard", { replace: true, state: claim ? { linked: true } : undefined });
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  const switchMode = next => { setMode(next); setError(""); setTouched({}); };
  const tab = active => `flex-1 rounded-[9px] px-3 py-2.5 text-[14px] font-semibold transition-colors ${active ? "bg-white text-[#071f2d] shadow-sm" : "text-[#5d7888] hover:text-[#12364e]"}`;

  return (
    <div className="relative z-10">
      <div className="mb-6 flex gap-1 rounded-[12px] bg-[#dbe7ed]/70 p-1" role="tablist">
        <button type="button" role="tab" aria-selected={!register} className={tab(!register)} onClick={() => switchMode("login")}>Entrar</button>
        <button type="button" role="tab" aria-selected={register} className={tab(register)} onClick={() => switchMode("register")}>Criar conta</button>
      </div>

      <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#356f9f]">{register ? "Primeiro acesso" : "Acesso"}</p>
      <h2 className="mt-2 text-[27px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#071f2d]">{register ? "Crie sua conta." : "Entre na sua área."}</h2>
      {claim
        ? <p className="mt-3 rounded-[11px] border border-[#b8ced9]/70 bg-[#e7f1f5]/70 px-4 py-3 text-[13.5px] leading-6 text-[#315d75]">A solicitação <strong>{claim.requestId}</strong> será vinculada à sua conta para você acompanhar orçamento, proposta e projeto.</p>
        : <p className="mt-3 text-[14px] leading-6 text-[#5f7886]">Acompanhe solicitações, propostas e projetos da sua empresa.</p>}

      <form className="mt-5 space-y-4" onSubmit={submit} noValidate>
        {register && <>
          <Input label="Empresa" value={form.company} onChange={set("company")} onBlur={touch("company")} error={visible("company")} autoComplete="organization" placeholder="Razão social ou nome fantasia" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="CNPJ" required={false} value={form.document} onChange={value => set("document")(formatCnpj(value))} onBlur={touch("document")} error={visible("document")} inputMode="numeric" placeholder="00.000.000/0000-00" />
            <Input label="Telefone" required={false} type="tel" value={form.phone} onChange={value => set("phone")(formatPhone(value))} onBlur={touch("phone")} error={visible("phone")} autoComplete="tel" inputMode="tel" placeholder="(62) 90000-0000" />
          </div>
          <Input label="Seu nome" value={form.name} onChange={set("name")} onBlur={touch("name")} error={visible("name")} autoComplete="name" placeholder="Nome e sobrenome" />
        </>}

        <Input label="E-mail" type="email" value={form.email} onChange={value => set("email")(sanitizeEmail(value))} onBlur={touch("email")} error={visible("email")} autoComplete="username" inputMode="email" placeholder="nome@empresa.com.br">
          {canSuggestEmailSuffix(form.email) && <span className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] font-normal text-[#6a808d]">
            Completar com:
            {EMAIL_SUFFIXES.map(suffix => <button key={suffix} type="button" onClick={() => set("email")(applyEmailSuffix(form.email, suffix))}
              className="rounded-full border border-[#c9d9e2] bg-white/80 px-2.5 py-1 text-[12px] font-semibold text-[#0057b8] hover:border-[#0057b8]/50">{suffix}</button>)}
          </span>}
        </Input>

        <Input label="Senha" type="password" value={form.password} onChange={set("password")} onBlur={touch("password")} error={visible("password")} autoComplete={register ? "new-password" : "current-password"} placeholder={register ? "Mínimo de 8 caracteres" : "••••••••"} />
        {register && <Input label="Confirmar senha" type="password" value={form.confirm} onChange={set("confirm")} onBlur={touch("confirm")} error={visible("confirm")} autoComplete="new-password" placeholder="Repita a senha" />}

        {error && <p role="alert" className="rounded-[10px] border border-[#e3c5bc] bg-[#faf0ed] px-4 py-3 text-[13px] text-[#8f5544]">{error}</p>}

        <button type="submit" disabled={busy} className="mt-2 flex min-h-[50px] w-full items-center justify-center gap-3 rounded-[11px] border border-white/24 bg-[linear-gradient(135deg,rgba(29,83,112,0.94)_0%,rgba(16,62,88,0.98)_100%)] px-5 py-3 text-[14px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_10px_24px_rgba(7,31,45,0.14)] transition-colors hover:bg-[#12364e] disabled:opacity-60">
          {busy ? "Aguarde…" : register ? "Criar conta e acessar" : "Entrar"} <span aria-hidden="true">→</span>
        </button>
      </form>

      {!register && !claim && <>
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#b9ccd6]/48" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#7b909b]">Acesso rápido</span>
          <div className="h-px flex-1 bg-[#b9ccd6]/48" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ACCOUNTS.map(account => (
            <button key={account.email} type="button" onClick={() => { setForm(current => ({ ...current, email: account.email, password: QUICK_PASSWORD })); setTouched({}); setError(""); }}
              className={`rounded-[13px] border px-3.5 py-3 text-left transition-colors ${form.email === account.email ? "border-[#0057b8]/35 bg-white/80" : "border-white/56 bg-white/28 hover:bg-white/60"}`}>
              <span className="block text-[13.5px] font-semibold text-[#244d64]">{account.name}</span>
              <span className="block truncate text-[12px] leading-5 text-[#66808e]">{account.company}</span>
            </button>
          ))}
        </div>
      </>}

      <p className="mt-5 text-center text-[11.5px] leading-5 text-[#7b909b]">Sessão protegida por cookie HttpOnly assinado. Senhas armazenadas com PBKDF2.</p>
    </div>
  );
}
