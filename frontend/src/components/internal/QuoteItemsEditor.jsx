import { RequestDetailSection } from "./RequestDetailSection";
import { FieldIssue } from "./ValidationFeedback";
import { calculateQuoteItemSubtotal, calculateQuoteItemTotals, createQuoteItem, quoteItemServices, getQuoteItemValidation } from "../../services/quoteItemService";

const currency = value => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const hours = value => value == null ? "Não informadas" : new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 }).format(value) + " h";
const inputClass = "internal-field-value mt-1 w-full rounded-[10px] border border-[#d3dfe6] bg-[#f8fafb] px-3 py-2 text-[#294e64] disabled:bg-[#eef2f4] disabled:text-[#748995]";

export function QuoteItemsEditor({ items, onChange, isEditable, machines, legacyEstimate }) {
  const totals = calculateQuoteItemTotals(items);
  function change(id, field, value) { onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item)); }
  return <RequestDetailSection eyebrow="Elaboração comercial" title="Composição do orçamento" description="* Obrigatório para revisão. Horas cotadas e valor/hora são informados pelo responsável."
    action={isEditable && <button type="button" className="internal-help-text rounded-[12px] bg-[#12364e] px-4 py-2 font-semibold text-white" onClick={() => onChange([...items, createQuoteItem()])}>Adicionar item</button>}>
    <div className="space-y-4">
      {legacyEstimate?.proposedValue != null && <p className="internal-help-text text-[#806b3d]">Valor histórico original: {currency(legacyEstimate.proposedValue)}. Preservado separadamente da soma dos subtotais.</p>}
      {!items.length && <p className="internal-help-text text-[#9a5947]">Adicione ao menos um item válido.</p>}
      {items.map((item, index) => {
        const { issues } = getQuoteItemValidation(item);
        const invalid = field => isEditable && issues.some(issue => issue.field === field);
        const error = field => isEditable && <FieldIssue issues={issues} field={field} />;
        return <fieldset key={item.id} disabled={!isEditable} className="min-w-0 rounded-[18px] border border-[#b9d0df] bg-white p-4 sm:p-5">
          <legend className="internal-card-title px-2 font-semibold text-[#31566d]">Item {index + 1}</legend>
          {item.isDemoCompatibility && <p className="internal-help-text mb-3 text-[#806b3d]">Compatibilidade demo: horas desconhecidas permanecem não informadas. Dados demo não alimentam recomendações reais.</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="internal-field-label text-[#607989] sm:col-span-2">Nome do item *<input className={inputClass + " font-semibold"} value={item.name} aria-invalid={invalid("name")} onChange={event => change(item.id, "name", event.target.value)} />{error("name")}</label>
            <label className="internal-field-label text-[#607989]">Serviço<select className={inputClass} value={item.serviceId ?? ""} onChange={event => change(item.id, "serviceId", event.target.value || null)}><option value="">Não definido / não se aplica</option>{quoteItemServices.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
            <label className="internal-field-label text-[#607989]">Equipamento / recurso<select className={inputClass} value={item.machineId ?? ""} onChange={event => change(item.id, "machineId", event.target.value || null)}><option value="">Não definido / não se aplica</option>{machines.map(machine => <option key={machine.id} value={machine.id}>{machine.name}{machine.local ? "" : " · Outra unidade"}</option>)}</select></label>
          </div>
          <div className="internal-item-calculation mt-4 grid items-start gap-4 rounded-[14px] border border-[#c1d9e7] bg-[#e5f0f6] p-4 sm:grid-cols-3">
            <label className="internal-field-label font-semibold text-[#31566d]">Horas cotadas{item.isDemoCompatibility ? "" : " *"}<input type="number" min="0" step="any" className={inputClass} value={item.quotedHours ?? ""} placeholder="Não informadas" aria-invalid={invalid("quotedHours")} onChange={event => change(item.id, "quotedHours", event.target.value)} />{error("quotedHours")}</label>
            <label className="internal-field-label font-semibold text-[#31566d]">× Valor/hora (R$) *<input type="number" min="0" step="0.01" className={inputClass} value={item.hourlyRate ?? ""} aria-invalid={invalid("hourlyRate")} onChange={event => change(item.id, "hourlyRate", event.target.value)} />{error("hourlyRate")}</label>
            <div className="text-[#31566d]" aria-live="polite"><p className="internal-field-label font-semibold">= Subtotal</p><output className="mt-3 block text-xl font-semibold text-[#096ab2]">{currency(calculateQuoteItemSubtotal(item))}</output>{error("subtotal")}</div>
          </div>
          <details className="internal-help-text mt-4 border-t border-[#e1e8ec] pt-3 text-[#607989]">
            <summary className="cursor-pointer font-semibold">Informações internas{invalid("technicalHours") || invalid("commercialRateReference") ? " · Verifique as pendências" : ""}</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="internal-field-label sm:col-span-2">Descrição opcional<textarea rows={2} className={inputClass} value={item.description} onChange={event => change(item.id, "description", event.target.value)} /></label>
              <label className="internal-field-label">Horas técnicas estimadas<span className="internal-help-text mt-1 block">Uso interno • não incluído na proposta comercial</span><input type="number" min="0" step="any" className={inputClass} value={item.technicalHours ?? ""} placeholder="Não informadas" aria-invalid={invalid("technicalHours")} onChange={event => change(item.id, "technicalHours", event.target.value)} />{error("technicalHours")}</label>
              <div><p className="internal-field-label">Referência comercial capturada</p><p className="mt-2 font-semibold">{item.commercialRateReference == null ? "Não informada" : currency(item.commercialRateReference) + "/h"}</p><p className="mt-1">Contexto; o valor/hora adotado pode ser diferente.</p>{error("commercialRateReference")}</div>
              <label className="internal-field-label sm:col-span-2">Justificativa do valor/hora (opcional)<textarea rows={2} className={inputClass} value={item.hourlyRateOverrideReason} onChange={event => change(item.id, "hourlyRateOverrideReason", event.target.value)} /></label>
            </div>
          </details>
          {isEditable && <button type="button" className="internal-help-text mt-3 text-[#607989] underline" aria-label={"Remover item " + (index + 1)} onClick={() => onChange(items.filter(existing => existing.id !== item.id))}>Remover item</button>}
        </fieldset>;
      })}
      <div className="internal-help-text flex flex-wrap gap-4 text-[#31566d]" aria-live="polite"><p>Horas cotadas: <strong>{hours(totals.totalQuotedHours)}</strong></p><p>Horas técnicas (internas): <strong>{hours(totals.totalTechnicalHours)}</strong></p><p>Total: <strong>{currency(totals.proposedValue)}</strong></p></div>
    </div>
  </RequestDetailSection>;
}
