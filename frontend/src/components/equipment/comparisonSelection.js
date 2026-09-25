import { useSearchParams } from "react-router-dom";

import { parseComparison } from "../../data/equipmentComparison";

export const COMPARATOR_ID = "comparador";

/** Seleção do comparador guardada na URL (?comparar=a,b,c): pode ser compartilhada. */
export function useComparisonSelection() {
  const [params, setParams] = useSearchParams();
  const selected = parseComparison(params.get("comparar"));
  const setSelected = ids => {
    setParams(current => {
      const next = new URLSearchParams(current);
      next.set("comparar", ids.join(","));
      return next;
    }, { replace: true, preventScrollReset: true });
  };
  return [selected, setSelected];
}

/** Seleciona máquinas e rola até o comparador (usado pelo guia por necessidade). */
export function compareAndScroll(setSelected, ids) {
  setSelected(ids);
  window.setTimeout(() => {
    document.getElementById(COMPARATOR_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
}
