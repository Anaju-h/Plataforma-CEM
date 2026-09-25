import { RequestDetailSection } from "./RequestDetailSection";

/** Configuração técnica enviada pelo Configurador on-line: peças, requisitos por serviço e tecnologia recomendada. */
export function ConfiguratorConfigSection({ configuration }) {
  if (!configuration) return null;
  const machines = configuration.recommendedMachines || [];
  return (
    <RequestDetailSection eyebrow="Configurador" title="Configuração técnica"
      description="Montada pelo cliente no Configurador on-line. Use como ponto de partida da análise: a definição final é da equipe técnica.">
      {configuration.summary && <p className="text-[14px] leading-6 text-[#31566d]">{configuration.summary}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {(configuration.projectServices || []).map(service => (
          <span key={service.id} className="rounded-full border border-[#cdbfe6] bg-[#f3effb] px-3 py-1 text-[12px] font-semibold text-[#5b4a8b]">{service.label}</span>
        ))}
        {configuration.definitionScore != null && <span className="rounded-full border border-[#d3e1e8] bg-[#f5f9fb] px-3 py-1 text-[12px] font-semibold text-[#31566d]">Definição do projeto: {configuration.definitionScore}%</span>}
      </div>

      {machines.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718895]">Tecnologia recomendada pelo configurador</p>
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            {machines.map((machine, index) => (
              <div key={machine.id} className={`rounded-[14px] border p-4 ${index === 0 ? "border-[#9fc3d8] bg-[#eef6fb]" : "border-[#dce5eb] bg-[#f8fafb]"}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[14px] font-semibold text-[#17394f]">{machine.name}</p>
                  <span className="text-[13px] font-semibold text-[#096ab2]">{machine.score}%</span>
                </div>
                <p className="mt-0.5 text-[12px] text-[#607989]">{machine.level}{index === 0 ? " · principal" : ""}</p>
                {machine.reasons?.length > 0 && <ul className="mt-2 space-y-1 text-[12.5px] leading-5 text-[#526d7c]">{machine.reasons.slice(0, 3).map(reason => <li key={reason}>• {reason}</li>)}</ul>}
                {machine.warnings?.length > 0 && <ul className="mt-2 space-y-1 text-[12.5px] leading-5 text-[#8b733b]">{machine.warnings.slice(0, 2).map(warning => <li key={warning}>! {warning}</li>)}</ul>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {(configuration.pieces || []).map(piece => (
          <article key={piece.id} className="rounded-[16px] border border-[#d9e3e8] bg-white">
            <div className="border-b border-[#e3eaee] bg-[#f5f9fb] px-4 py-3">
              <p className="text-[14px] font-semibold text-[#17394f]">{piece.name}</p>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[#607989]">
                {piece.details.map(detail => <span key={detail.label}><strong className="font-semibold text-[#31566d]">{detail.label}:</strong> {detail.value}</span>)}
              </div>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-2">
              {piece.services.map(service => (
                <div key={service.id} className="rounded-[12px] border border-[#e1e9ee] bg-[#fbfcfd] p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13.5px] font-semibold text-[#17394f]">{service.label}</p>
                    {service.machine && <span className="rounded-full bg-[#e5f1f6] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#315f79]">{service.machine.name}{service.adherence ? ` · ${service.adherence.score}%` : ""}</span>}
                  </div>
                  {service.requirements.length > 0 ? (
                    <dl className="mt-2 space-y-1.5 text-[12.5px] leading-5">
                      {service.requirements.map(item => <div key={item.label} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-2"><dt className="text-[#718895]">{item.label}</dt><dd className="font-medium text-[#31566d]">{item.value}</dd></div>)}
                    </dl>
                  ) : <p className="mt-2 text-[12.5px] text-[#8b969e]">Sem requisitos detalhados.</p>}
                </div>
              ))}
            </div>
            {piece.missingInformation?.length > 0 && (
              <div className="border-t border-[#e3eaee] px-4 py-3 text-[12.5px] leading-5 text-[#8b733b]">
                <strong className="font-semibold">A confirmar na análise:</strong> {piece.missingInformation.slice(0, 4).join(" · ")}
              </div>
            )}
          </article>
        ))}
      </div>

      {configuration.insights?.length > 0 && (
        <div className="mt-5 rounded-[14px] border border-[#cbdde6] bg-[#edf6fa] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5681a0]">Leituras do configurador</p>
          <ul className="mt-2 space-y-1 text-[13px] leading-5 text-[#34505f]">{configuration.insights.slice(0, 5).map(item => <li key={item}>• {item}</li>)}</ul>
        </div>
      )}
    </RequestDetailSection>
  );
}
