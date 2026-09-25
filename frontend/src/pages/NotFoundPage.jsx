import { Link } from "react-router-dom";

import { Container } from "../components/layout/Container";
import { ArrowRightIcon } from "../components/ui/ArrowIcons";

/** Página exibida para qualquer endereço que não existe. */
export function NotFoundPage() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f6fafb_30%,#eaf3f6_70%,#ffffff_100%)] py-24 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[240px] top-[40px] -z-10 h-[520px] w-[520px] rounded-full bg-[#65b8ee]/10 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-[240px] bottom-0 -z-10 h-[460px] w-[460px] rounded-full bg-[#315b75]/7 blur-[140px]" />
      <Container>
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#356f9f]">Erro 404</p>
          <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[#071f2d] sm:text-[3.3rem]">
            Página não encontrada.
          </h1>
          <p className="mx-auto mt-5 max-w-[500px] text-[15px] leading-7 text-[#607583] sm:text-[16px]">
            O endereço pode ter sido digitado errado ou a página mudou de lugar.
            Escolha um caminho abaixo para continuar.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="group inline-flex h-[46px] items-center gap-3 rounded-[12px] bg-[#12364e] px-5 text-[13px] font-semibold text-white shadow-[0_10px_26px_rgba(7,31,45,0.15)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#173f57]"
            >
              Voltar ao início
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/orcamento"
              className="inline-flex h-[46px] items-center gap-3 rounded-[12px] border border-[#12364e]/14 bg-white/70 px-5 text-[13px] font-semibold text-[#12364e] transition-all duration-300 hover:bg-white"
            >
              Solicitar orçamento
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-semibold text-[#356f9f]">
            <Link to="/servicos" className="hover:text-[#12364e]">Serviços</Link>
            <Link to="/equipamentos" className="hover:text-[#12364e]">Equipamentos</Link>
            <Link to="/sobre" className="hover:text-[#12364e]">Sobre</Link>
            <Link to="/configurador" className="hover:text-[#12364e]">Configurador</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
