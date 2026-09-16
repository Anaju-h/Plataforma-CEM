import {
  useMemo,
  useState,
} from "react";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import {
  getAllMachineCostKnowledge,
} from "../../data/internal/pricingKnowledge";

import {
  getCommercialReference,
  getCommercialReferenceHistory,
  updateCommercialReference,
} from "../../services/pricingService";

const tabs = [
  {
    id: "overview",
    label: "Visão geral",
  },

  {
    id: "equipment",
    label: "Equipamentos",
  },

  {
    id: "commercial",
    label:
      "Referência comercial",
  },

  {
    id: "history",
    label: "Histórico",
  },
];

export function EquipmentCostsPage() {
  const machines =
    useMemo(
      () =>
        getAllMachineCostKnowledge(),
      [],
    );

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "overview",
  );

  const [
    commercialReference,
    setCommercialReference,
  ] = useState(
    () =>
      getCommercialReference(),
  );

  const [
    history,
    setHistory,
  ] = useState(
    () =>
      getCommercialReferenceHistory(),
  );

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Conhecimento"
        title="Equipamentos e custos"
        description="Consulte referências econômicas dos equipamentos e gerencie parâmetros comerciais utilizados como apoio aos orçamentos."
      />

      <div className="mt-7 overflow-x-auto">
        <div className="flex min-w-max gap-1 rounded-[16px] border border-[#d1dde4] bg-white p-1.5">
          {tabs.map(
            (tab) => {
              const active =
                activeTab ===
                tab.id;

              return (
                <button
                  key={
                    tab.id
                  }
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab.id,
                    )
                  }
                  className={`internal-eyebrow 
                    rounded-[11px]
                    px-4 py-2.5
                    
                    font-semibold
                    uppercase
                    
                    transition

                    ${
                      active
                        ? "bg-[#0b3550] text-white"
                        : "text-[#526d7c] hover:bg-[#f1f6f8] hover:text-[#17394f]"
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            },
          )}
        </div>
      </div>

      <div className="mt-5">
        {activeTab ===
          "overview" && (
          <OverviewTab
            machines={
              machines
            }
            commercialReference={
              commercialReference
            }
            onOpenEquipment={() =>
              setActiveTab(
                "equipment",
              )
            }
            onOpenCommercial={() =>
              setActiveTab(
                "commercial",
              )
            }
          />
        )}

        {activeTab ===
          "equipment" && (
          <EquipmentTab
            machines={
              machines
            }
          />
        )}

        {activeTab ===
          "commercial" && (
          <CommercialReferenceTab
            reference={
              commercialReference
            }
            onReferenceChange={(
              result,
            ) => {
              setCommercialReference(
                result.reference,
              );

              setHistory(
                getCommercialReferenceHistory(),
              );
            }}
          />
        )}

        {activeTab ===
          "history" && (
          <HistoryTab
            history={
              history
            }
          />
        )}
      </div>
    </div>
  );
}

/*
 * ============================================================
 * VISÃO GERAL
 * ============================================================
 */

function OverviewTab({
  machines,
  commercialReference,
  onOpenEquipment,
  onOpenCommercial,
}) {
  const averageTechnicalCost =
    machines.length
      ? machines.reduce(
          (
            total,
            machine,
          ) =>
            total +
            machine.costWithAdministrative,
          0,
        ) /
        machines.length
      : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          eyebrow="Equipamentos"
          value={`${machines.length}`}
          description="Referências econômicas cadastradas."
        />

        <MetricCard
          eyebrow="Referência comercial"
          value={`${formatCurrency(
            commercialReference.hourlyRate,
          )}/h`}
          description="Valor atualmente utilizado como referência."
        />

        <MetricCard
          eyebrow="Custo técnico médio"
          value={`${formatCurrency(
            averageTechnicalCost,
          )}/h`}
          description="Média apenas para visão geral."
        />

        <MetricCard
          eyebrow="Última atualização"
          value={
            commercialReference.updatedAt ?? "Configuração inicial demo"
          }
          description="Referência comercial vigente."
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 shadow-[0_10px_30px_rgba(34,67,90,0.025)] sm:p-6">
          <p className="internal-eyebrow font-semibold uppercase text-[#5681a0]">
            Como utilizar estas informações
          </p>

          <h2 className="internal-section-title mt-2 font-semibold text-[#17394f]">
            Apoio à decisão, não tabela de preços.
          </h2>

          <p className="internal-card-description mt-3 max-w-2xl text-[#526d7c]">
            Os custos técnicos e a referência comercial existem para oferecer contexto durante a elaboração de um orçamento. O responsável continua livre para definir o valor/hora e as horas cobradas.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <FlowStep
              number="01"
              title="Conhecimento"
              description="Custos e referências disponíveis."
            />

            <FlowStep
              number="02"
              title="Sugestão"
              description="Sistema contextualiza os números."
            />

            <FlowStep
              number="03"
              title="Decisão"
              description="Responsável define a proposta."
            />
          </div>
        </section>

        <section className="rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-5 sm:p-6">
          <p className="internal-eyebrow font-semibold uppercase text-[#5681a0]">
            Referência vigente
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#096ab2]">
            {formatCurrency(
              commercialReference.hourlyRate,
            )}
            <span className="internal-card-title ml-1 font-medium text-[#5c7c8f]">
              /hora
            </span>
          </p>

          <p className="internal-card-description mt-3 text-[#526d7c]">
            Valor atualmente utilizado como ponto de partida em novos orçamentos.
          </p>

          <button
            type="button"
            onClick={
              onOpenCommercial
            }
            className="internal-eyebrow mt-5 rounded-[11px] bg-[#096ab2] px-4 py-3 font-semibold uppercase text-white transition hover:bg-[#075b99]"
          >
            Gerenciar referência
          </button>

          <button
            type="button"
            onClick={
              onOpenEquipment
            }
            className="internal-eyebrow ml-2 mt-5 rounded-[11px] border border-[#a9c6d6] bg-white px-4 py-3 font-semibold uppercase text-[#356f9f]"
          >
            Ver equipamentos
          </button>
        </section>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * EQUIPAMENTOS
 * ============================================================
 */

function EquipmentTab({
  machines,
}) {
  const [
    selectedMachineId,
    setSelectedMachineId,
  ] = useState(
    machines[0]?.id ??
      null,
  );

  const selectedMachine =
    machines.find(
      (machine) =>
        machine.id ===
        selectedMachineId,
    ) ??
    machines[0];

  if (!selectedMachine) {
    return null;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[330px_1fr]">
      <section className="rounded-[22px] border border-[#d1dde4] bg-white p-4">
        <div className="px-2 pb-4">
          <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
            Equipamentos cadastrados
          </p>
        </div>

        <div className="space-y-2">
          {machines.map(
            (machine) => {
              const selected =
                machine.id ===
                selectedMachine.id;

              return (
                <button
                  key={
                    machine.id
                  }
                  type="button"
                  onClick={() =>
                    setSelectedMachineId(
                      machine.id,
                    )
                  }
                  className={`
                    w-full
                    rounded-[14px]
                    border
                    px-4 py-3.5
                    text-left
                    transition

                    ${
                      selected
                        ? "border-[#71a7c5] bg-[#e6f1f6]"
                        : "border-[#dce5e9] bg-[#f9fbfc] hover:border-[#afc8d5]"
                    }
                  `}
                >
                  <p className="internal-card-title font-semibold text-[#31566d]">
                    {machine.name}{!machine.local && " · Outra unidade"}
                  </p>

                  <p className="internal-eyebrow mt-1 uppercase text-[#526d7c]">
                    {
                      machine.spreadsheetName
                    }
                  </p>

                  <p className="internal-card-title mt-2 font-semibold text-[#5681a0]">
                    {formatCurrency(
                      machine.costWithAdministrative,
                    )}
                    /h
                  </p>
                </button>
              );
            },
          )}
        </div>
      </section>

      <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 shadow-[0_10px_30px_rgba(34,67,90,0.025)] sm:p-6">
        <div className="flex flex-col gap-5 border-b border-[#e2e9ed] pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="internal-eyebrow font-semibold uppercase text-[#5681a0]">
              Referência econômica
            </p>

            <h2 className="internal-section-title mt-2 font-semibold text-[#17394f]">
              {selectedMachine.name}
            </h2>

            <p className="internal-help-text mt-2 text-[#526d7c]">
              Origem na planilha:{" "}
              {
                selectedMachine.spreadsheetName
              }
            </p>
          </div>

          <span className="internal-eyebrow w-fit rounded-full border border-[#c4d8e3] bg-[#edf6fa] px-3 py-1.5 font-semibold uppercase text-[#5681a0]">
            Referência interna · Pendente de validação
          </span>
        </div>

        <p className="internal-card-description mt-4 text-[#526d7c]">
          {selectedMachine.local ? "Equipamento local." : "Outra unidade — indisponível localmente."}
          {" "}Vigência: {selectedMachine.effectiveFrom ?? "não informada na fonte"}.
          {" "}Unidade: {selectedMachine.unit ?? "não informada"}.
          {" "}Valores documentais pendentes de validação; não alimentam sugestões de custo.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <CostMetric
            label="Sem mão de obra"
            value={
              selectedMachine.costWithoutLabor
            }
          />

          <CostMetric
            label="Com mão de obra"
            value={
              selectedMachine.costWithLabor
            }
          />

          <CostMetric
            label="Com administrativo"
            value={
              selectedMachine.costWithAdministrative
            }
            highlighted
          />
        </div>

        <div className="mt-6 rounded-[16px] border border-[#d3e1e8] bg-[#f7fafb] p-5">
          <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
            Interpretação
          </p>

          <p className="internal-card-description mt-2 text-[#526d7c]">
            Estes valores representam conhecimento econômico derivado da planilha interna. Eles não constituem tabela de preços e não determinam automaticamente o valor cobrado do cliente.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#e2e9ed] pt-5">
          <div>
            <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
              Fonte
            </p>

            <p className="internal-card-title mt-1 font-semibold text-[#476579]">
              {
                selectedMachine.source
              }
            </p>
          </div>

          <p className="internal-help-text text-[#526d7c]">
            Dados destinados apenas ao uso interno.
          </p>
        </div>
      </section>
    </div>
  );
}

/*
 * ============================================================
 * REFERÊNCIA COMERCIAL
 * ============================================================
 */

function CommercialReferenceTab({
  reference,
  onReferenceChange,
}) {
  const [
    editing,
    setEditing,
  ] = useState(false);

  const [
    hourlyRate,
    setHourlyRate,
  ] = useState(
    String(
      reference.hourlyRate,
    ),
  );

  const [
    reason,
    setReason,
  ] = useState("");

  const [
    feedback,
    setFeedback,
  ] = useState("");

  function cancelEditing() {
    setEditing(false);

    setHourlyRate(
      String(
        reference.hourlyRate,
      ),
    );

    setReason("");
  }

  function saveReference() {
    try {
      const result =
        updateCommercialReference({
          hourlyRate,
          reason,
          changedBy: null,
        });

      onReferenceChange(
        result,
      );

      setHourlyRate(
        String(
          result.reference.hourlyRate,
        ),
      );

      setReason("");

      setEditing(false);

      setFeedback(
        result.historyItem
          ? "Referência comercial atualizada."
          : "Nenhuma alteração necessária.",
      );

      window.setTimeout(
        () =>
          setFeedback(""),
        2600,
      );
    } catch (error) {
      setFeedback(
        error.message,
      );
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5 shadow-[0_10px_30px_rgba(34,67,90,0.025)] sm:p-6">
        <p className="internal-eyebrow font-semibold uppercase text-[#5681a0]">
          Referência comercial vigente
        </p>

        <div className="mt-5 rounded-[20px] border border-[#c6dae5] bg-[#eaf3f8] p-5 sm:p-6">
          <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
            Valor/hora atual
          </p>

          <p className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-[#096ab2]">
            {formatCurrency(
              reference.hourlyRate,
            )}

            <span className="ml-2 text-base font-medium text-[#628092]">
              /h
            </span>
          </p>

          <p className="internal-card-description mt-4 max-w-xl text-[#526d7c]">
            Este valor é utilizado como ponto de partida nos novos orçamentos. O responsável continua podendo definir outro valor em cada proposta.
          </p>
        </div>

        {!editing ? (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <ReferenceInfo
                label="Vigente desde"
                value={
                  reference.effectiveFrom
                }
              />

              <ReferenceInfo
                label="Última atualização"
                value={
                  reference.updatedAt ?? "Sem alteração nesta sessão"
                }
              />

              <ReferenceInfo
                label="Responsável"
                value={
                  reference.changedBy ??
                  "Não informado (demo)"
                }
              />

              <ReferenceInfo
                label="Status"
                value="Ativa"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setEditing(
                  true,
                )
              }
              className="internal-eyebrow mt-7 rounded-[12px] bg-[#096ab2] px-5 py-3 font-semibold uppercase text-white transition hover:bg-[#075b99]"
            >
              Alterar referência
            </button>
          </>
        ) : (
          <div className="mt-6 border-t border-[#e0e7eb] pt-6">
            <p className="internal-card-title font-semibold text-[#31566d]">
              Nova referência comercial
            </p>

            <p className="internal-card-description mt-1 text-[#526d7c]">
              A alteração será aplicada somente aos novos contextos de precificação. Orçamentos existentes mantêm seus próprios valores.
            </p>

            <div className="mt-5 max-w-[300px]">
              <label>
                <span className={labelClasses}>
                  Novo valor/hora
                </span>

                <div className="relative mt-2">
                  <span className="internal-help-text pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#526d7c]">
                    R$
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      hourlyRate
                    }
                    onChange={(event) =>
                      setHourlyRate(
                        event.target.value,
                      )
                    }
                    className={`${inputClasses} pl-10 pr-10`}
                  />

                  <span className="internal-help-text pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#526d7c]">
                    /h
                  </span>
                </div>
              </label>
            </div>

            <label className="mt-5 block">
              <span className={labelClasses}>
                Motivo da alteração
              </span>

              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(
                    event.target.value,
                  )
                }
                rows={4}
                placeholder="Ex.: reajuste anual, revisão da política comercial..."
                className="internal-field-value mt-2 w-full resize-y rounded-[13px] border border-[#d3dfe6] bg-[#f8fafb] px-4 py-3 text-[#294e64] outline-none transition focus:border-[#78a9c4] focus:bg-white"
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  cancelEditing
                }
                className="internal-eyebrow rounded-[11px] border border-[#ccd9e0] bg-white px-5 py-3 font-semibold uppercase text-[#607989]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  saveReference
                }
                className="internal-eyebrow rounded-[11px] bg-[#096ab2] px-5 py-3 font-semibold uppercase text-white"
              >
                Confirmar alteração
              </button>
            </div>
          </div>
        )}

        {feedback && (
          <div className="mt-5 rounded-[13px] border border-[#bdd8c7] bg-[#eaf5ee] px-4 py-3">
            <p className="internal-card-title font-semibold text-[#3b7252]">
              {feedback}
            </p>
          </div>
        )}
      </section>

      <aside className="rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-5">
        <p className="internal-eyebrow font-semibold uppercase text-[#5681a0]">
          Como funciona
        </p>

        <div className="mt-5 space-y-5">
          <ExplanationItem
            number="01"
            title="Novo orçamento"
            text="Recebe a referência vigente como sugestão inicial."
          />

          <ExplanationItem
            number="02"
            title="Decisão individual"
            text="O responsável pode alterar o valor/hora daquele orçamento."
          />

          <ExplanationItem
            number="03"
            title="Reajuste"
            text="Uma nova referência não altera propostas que já foram criadas."
          />

          <ExplanationItem
            number="04"
            title="Histórico"
            text="As alterações permanecem registradas para consulta."
          />
        </div>
      </aside>
    </div>
  );
}

/*
 * ============================================================
 * HISTÓRICO
 * ============================================================
 */

function HistoryTab({
  history,
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[#d1dde4] bg-white shadow-[0_10px_30px_rgba(34,67,90,0.025)]">
      <div className="border-b border-[#e2e9ed] px-5 py-5 sm:px-6">
        <p className="internal-card-title font-semibold text-[#17394f]">
          Histórico de referência comercial
        </p>

        <p className="internal-help-text mt-1 text-[#526d7c]">
          Registro das alterações realizadas na política de referência.
        </p>
      </div>

      {history.length > 0 ? (
        <div className="divide-y divide-[#e5ebef]">
          {history.map(
            (item) => (
              <div
                key={
                  item.id
                }
                className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[150px_1fr_160px]"
              >
                <div>
                  <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
                    Alteração
                  </p>

                  <p className="internal-card-title mt-2 font-semibold text-[#476579]">
                    {
                      item.changedAt
                    }
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="internal-card-title font-semibold text-[#526d7c]">
                      {formatCurrency(
                        item.previousRate,
                      )}
                    </span>

                    <span className="text-[#526d7c]">
                      →
                    </span>

                    <span className="text-lg font-semibold text-[#096ab2]">
                      {formatCurrency(
                        item.newRate,
                      )}
                      /h
                    </span>
                  </div>

                  <p className="internal-card-description mt-2 text-[#526d7c]">
                    {item.reason}
                  </p>
                </div>

                <div>
                  <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
                    Alterado por
                  </p>

                  <p className="internal-card-title mt-2 font-semibold text-[#476579]">
                    {
                      item.changedBy
                    }
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="px-6 py-16 text-center">
          <p className="internal-help-text text-[#526d7c]">
            Nenhuma alteração registrada.
          </p>
        </div>
      )}
    </section>
  );
}

/*
 * ============================================================
 * COMPONENTES AUXILIARES
 * ============================================================
 */

function MetricCard({
  eyebrow,
  value,
  description,
}) {
  return (
    <div className="rounded-[20px] border border-[#d1dde4] bg-white p-5">
      <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
        {eyebrow}
      </p>

      <p className="internal-section-title mt-3 font-semibold text-[#17394f]">
        {value}
      </p>

      <p className="internal-card-description mt-3 text-[#526d7c]">
        {description}
      </p>
    </div>
  );
}

function FlowStep({
  number,
  title,
  description,
}) {
  return (
    <div className="rounded-[15px] border border-[#dce5e9] bg-[#f8fafb] p-4">
      <span className="internal-card-title flex h-7 w-7 items-center justify-center rounded-full border border-[#c5d8e3] bg-white font-semibold text-[#5681a0]">
        {number}
      </span>

      <p className="internal-card-title mt-3 font-semibold text-[#31566d]">
        {title}
      </p>

      <p className="internal-card-description mt-1 text-[#526d7c]">
        {description}
      </p>
    </div>
  );
}

function CostMetric({
  label,
  value,
  highlighted = false,
}) {
  return (
    <div
      className={`
        rounded-[16px]
        border
        p-5

        ${
          highlighted
            ? "border-[#a9ccdd] bg-[#eaf4f9]"
            : "border-[#d9e3e8] bg-[#f8fafb]"
        }
      `}
    >
      <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
        {label}
      </p>

      <p
        className={`internal-section-title 
          mt-3
          
          font-semibold

          ${
            highlighted
              ? "text-[#096ab2]"
              : "text-[#31566d]"
          }
        `}
      >
        {formatCurrency(
          value,
        )}
        <span className="internal-card-title ml-1 font-medium">
          /h
        </span>
      </p>
    </div>
  );
}

function ReferenceInfo({
  label,
  value,
}) {
  return (
    <div>
      <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
        {label}
      </p>

      <p className="internal-card-title mt-1.5 font-semibold text-[#476579]">
        {value}
      </p>
    </div>
  );
}

function ExplanationItem({
  number,
  title,
  text,
}) {
  return (
    <div className="flex gap-3">
      <span className="internal-card-title flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#bdd2dd] bg-white/75 font-semibold text-[#5681a0]">
        {number}
      </span>

      <div>
        <p className="internal-card-title font-semibold text-[#31566d]">
          {title}
        </p>

        <p className="internal-card-description mt-1 text-[#526d7c]">
          {text}
        </p>
      </div>
    </div>
  );
}

function formatCurrency(
  value,
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  ).format(
    value || 0,
  );
}

const labelClasses =
  "internal-field-label  font-semibold uppercase  text-[#607989]";

const inputClasses = `internal-field-value 
  h-12
  w-full
  rounded-[12px]
  border border-[#d3dfe6]
  bg-[#f8fafb]
  px-4
  
  text-[#294e64]
  outline-none
  transition
  focus:border-[#78a9c4]
  focus:bg-white
`;
