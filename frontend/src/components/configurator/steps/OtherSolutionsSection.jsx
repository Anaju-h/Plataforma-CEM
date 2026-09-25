import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { directRequestNeeds } from "../../../data/requestNeeds";

/*
 * Etapa 1 do Configurador — soluções que não passam pelas etapas técnicas.
 * Cada card leva direto ao formulário de solicitação com a necessidade já identificada.
 * Fica fora do card da etapa, em largura total, para o botão Continuar ficar logo abaixo das opções guiadas.
 */
export function OtherSolutionsSection() {
  return (
    <section className="mt-10 sm:mt-12" aria-labelledby="other-solutions-title">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#356f9f]">
              Outras soluções do Centro
            </p>
            <div className="h-px w-8 bg-[#79acd0]" />
          </div>
          <h2
            id="other-solutions-title"
            className="mt-2.5 text-[28px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#071f2d] sm:text-[32px]"
          >
            Precisa de outro tipo de apoio?
          </h2>
        </div>
        <p className="max-w-[560px] text-[14px] leading-6 text-[#617887]">
          Estas soluções dependem de uma avaliação mais ampla e seguem direto
          para a solicitação, sem passar pelas etapas do configurador.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {directRequestNeeds.map((solution, index) => (
          <motion.div
            key={solution.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
          >
            <Link
              to={`/orcamento?origem=configurador&necessidade=${solution.id}`}
              state={{
                configuratorNeed: {
                  id: solution.id,
                  name: solution.name,
                  title: solution.title,
                  tag: solution.tag,
                },
              }}
              className="group relative flex h-full min-h-[168px] overflow-hidden rounded-[18px] border border-white/78 bg-white/38 p-5 text-left shadow-[0_14px_40px_rgba(31,68,92,0.05)] backdrop-blur-[14px] transition-all duration-300 hover:-translate-y-[2px] hover:border-[#a7c5d4] hover:bg-white/60 hover:shadow-[0_18px_44px_rgba(31,68,92,0.08)]"
            >
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#65b8ee]/55 transition-colors duration-300 group-hover:bg-[#65b8ee]"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#bfd2dc] bg-white/46 text-[11px] font-semibold text-[#6d8794] transition-colors group-hover:border-[#91b5c7] group-hover:text-[#477b98]">
                    {solution.number}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c5d8e1] bg-white/34 text-[15px] text-[#64889d] transition-all duration-300 group-hover:border-[#12364e] group-hover:bg-[#12364e] group-hover:text-white">
                    ↗
                  </span>
                </div>
                <p className="mt-4 text-[15px] font-semibold leading-5 text-[#264e66]">
                  {solution.title}
                </p>
                <p className="mt-2 text-[13px] leading-5 text-[#7b909c]">
                  {solution.description}
                </p>
                <p className="mt-auto pt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#668da3]">
                  {solution.tag}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: directRequestNeeds.length * 0.04, duration: 0.3 }}
        >
          <Link
            to="/orcamento"
            className="group relative flex h-full min-h-[168px] flex-col overflow-hidden rounded-[18px] border border-[#a9c9d9]/76 bg-[#deedf4]/62 p-5 text-left shadow-[0_14px_40px_rgba(31,68,92,0.05)] backdrop-blur-[14px] transition-all duration-300 hover:-translate-y-[2px] hover:border-[#8fb8cc] hover:bg-[#e4f1f7]/80"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="mt-[9px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#65b8ee] shadow-[0_0_0_5px_rgba(101,184,238,0.14)]" />
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#9fc2d4] bg-white/50 text-[15px] text-[#356f9f] transition-all duration-300 group-hover:border-[#12364e] group-hover:bg-[#12364e] group-hover:text-white">
                →
              </span>
            </div>
            <p className="mt-4 text-[15px] font-semibold leading-5 text-[#264e66]">
              Ainda não encontrou exatamente o que precisa?
            </p>
            <p className="mt-2 text-[13px] leading-5 text-[#708894]">
              Você também pode enviar uma solicitação diretamente para a equipe
              e descrever livremente o seu desafio.
            </p>
            <p className="mt-auto pt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#356f9f]">
              Solicitar atendimento
            </p>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
