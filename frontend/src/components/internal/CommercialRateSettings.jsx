import { useState } from "react";
import {
  getCommercialReference,
  getCommercialRateReferences,
  updateCommercialReference,
} from "../../services/pricingService";

const currency = value => new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "BRL",
}).format(value);
const date = value => value ? new Date(value).toLocaleString("pt-BR") : "Em aberto";

export function CommercialRateSettings({ onSaved } = {}) {
  const [reference, setReference] = useState(getCommercialReference);
  const [history, setHistory] = useState(getCommercialRateReferences);
  const [rate, setRate] = useState(String(reference.hourlyRate));
  const [feedback, setFeedback] = useState("");

  function save(event) {
    event.preventDefault();
    try {
      const result = updateCommercialReference({ hourlyRate: rate });
      setReference(result.reference);
      setRate(String(result.reference.hourlyRate));
      setHistory(getCommercialRateReferences());
      onSaved?.(result);
      setFeedback(result.historyItem ? "Referência atualizada para novos itens de orçamento." : "Nenhuma alteração necessária.");
    } catch (error) {
      setFeedback(error.message);
    }
  }

  return (
    <section className="mb-5 rounded-[22px] border border-[#d1dde4] bg-white p-6">
      <h2 className="internal-section-title font-semibold text-[#17394f]">Valor/hora comercial padrão</h2>
      <p className="internal-section-description mt-2 text-[#607989]">
        Vigente: {currency(reference.hourlyRate)}/h. Referência para novos itens, inclusive em ORCs em elaboração.
        Itens existentes mantêm a referência capturada. O responsável pode escolher valores acima ou abaixo dela, com justificativa opcional.
      </p>
      <p className="internal-help-text mt-2 text-[#607989]">
        Alterações e histórico ficam em memória e são reiniciados ao recarregar a página.
      </p>
      <form onSubmit={save} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="internal-field-label text-[#31566d]">
          Valor/hora (R$)
          <input className="internal-field-value ml-3 rounded-lg border border-[#d1dde4] p-2" type="number"
            min="0.01" step="0.01" required value={rate}
            onChange={event => setRate(event.target.value)} />
        </label>
        <button className="internal-help-text rounded-lg bg-[#096ab2] px-4 py-2 text-white" type="submit">Salvar referência</button>
      </form>
      <p role="status" className="internal-help-text mt-3 text-[#31566d]">{feedback}</p>
      <details className="internal-help-text mt-4 text-[#607989]">
        <summary>Histórico de vigências</summary>
        <ul className="mt-3 space-y-2">
          {history.map(item => <li key={item.id}>
            {currency(item.hourlyRate)}/h · {date(item.effectiveFrom)} até {date(item.effectiveTo)}
            {" · "}{item.source}
          </li>)}
        </ul>
      </details>
    </section>
  );
}
