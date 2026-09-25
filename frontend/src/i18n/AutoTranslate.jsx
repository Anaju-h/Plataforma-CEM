import { useEffect, useRef } from "react";
import { attachTranslator } from "./domTranslator";

/**
 * Aplica o idioma escolhido aos textos da área pública sem mudar o layout
 * (o wrapper usa `display: contents`, então não cria caixa nova).
 */
export function AutoTranslate({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    return attachTranslator(ref.current);
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
