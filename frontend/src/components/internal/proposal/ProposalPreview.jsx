import { useLayoutEffect, useRef, useState } from "react";
import { ProposalDocument } from "./ProposalDocument";
import { A4, documentOverflows } from "./proposalDocumentLayout";
import { fitPreviewZoom, fitWidthPreviewZoom, stepPreviewZoom, MIN_ZOOM, MAX_ZOOM } from "./proposalPreviewZoom";

export function ProposalPreview({ document, onOverflowChange, enableZoom = false }) {
  const hostRef = useRef(null);
  const pageRef = useRef(null);
  const bodyRef = useRef(null);
  const scrollRef = useRef(null);
  const measureRef = useRef(null);
  const [mode, setMode] = useState("page");
  const [manualZoom, setManualZoom] = useState(null);
  const [fit, setFit] = useState({ scale: 0.5, widthScale: 0.5, overflow: false, height: 600 });
  useLayoutEffect(() => {
    const host = hostRef.current;
    let active = true;
    const measure = () => {
      if (!active) return;
      const top = host.getBoundingClientRect().top;
      const visibleTop = top < window.innerHeight / 2 ? Math.max(18, top) : 18;
      const availableHeight = Math.min(window.innerHeight * 0.78, Math.max(240, window.innerHeight - visibleTop - 90));
      const scale = fitPreviewZoom(host.clientWidth - 58, availableHeight);
      const widthScale = fitWidthPreviewZoom(host.clientWidth - 58);
      const overflow = documentOverflows(pageRef.current, bodyRef.current);
      setFit(previous => previous.scale === scale && previous.widthScale === widthScale && previous.overflow === overflow && previous.height === availableHeight ? previous : { scale, widthScale, overflow, height: availableHeight });
      onOverflowChange?.({ document, overflow });
    };
    const observer = new ResizeObserver(measure);
    measureRef.current = measure;
    observer.observe(host); observer.observe(bodyRef.current);
    window.addEventListener("resize", measure);
    host.addEventListener("load", measure, true);
    window.document.fonts?.ready.then(measure);
    measure();
    return () => { active = false; measureRef.current = null; observer.disconnect(); window.removeEventListener("resize", measure); host.removeEventListener("load", measure, true); };
  }, [document, onOverflowChange]);
  const scale = enableZoom ? mode === "manual" ? manualZoom : mode === "width" ? fit.widthScale : fit.scale : fit.scale;
  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    if (scroll) scroll.scrollTo({ left: mode === "manual" ? Math.max(0, (scroll.scrollWidth - scroll.clientWidth) / 2) : 0, behavior: "instant" });
  }, [scale, mode]);
  function zoom(direction) { setManualZoom(stepPreviewZoom(scale, direction)); setMode("manual"); }
  function fitMode(next) { setMode(next); measureRef.current?.(); scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" }); }
  const paper = <div className="proposal-paper-space" style={{ width: A4.width * 4 / 3 * scale, height: A4.height * 4 / 3 * scale }}>
      <div className="proposal-paper-scale" style={{ transform: "scale(" + scale + ")" }}>
        <ProposalDocument document={document} pageRef={pageRef} bodyRef={bodyRef} />
      </div>
    </div>;
  return <section ref={hostRef} className={"proposal-preview" + (enableZoom ? " proposal-preview-zoomable" : "") + (fit.overflow ? " is-overflow" : "")} aria-label="Preview da proposta">
    <div className="proposal-preview-heading"><span>PREVIEW{fit.overflow && <small> · Limite excedido</small>}</span>{enableZoom ? <div className="proposal-zoom-controls" role="group" aria-label="Zoom da folha A4">
      <button type="button" aria-label="Diminuir zoom" disabled={scale <= MIN_ZOOM} onClick={() => zoom(-1)}>−</button>
      <output aria-live="polite" aria-label="Zoom atual">{Math.round(scale * 100)}%</output>
      <button type="button" aria-label="Aumentar zoom" disabled={scale >= MAX_ZOOM} onClick={() => zoom(1)}>+</button>
      <div className="proposal-fit-modes">
        <button type="button" aria-label="Página inteira" aria-pressed={mode === "page"} onClick={() => fitMode("page")}>Página</button>
        <button type="button" aria-label="Ajustar à largura" aria-pressed={mode === "width"} onClick={() => fitMode("width")}>Largura</button>
      </div>
    </div> : <span>A4 · Uma página</span>}</div>
    {enableZoom ? <div ref={scrollRef} className="proposal-preview-scroll" style={{ maxHeight: fit.height + 24, overflowX: mode === "manual" ? "auto" : "hidden" }} tabIndex={0} role="region" aria-label="Folha A4 — área de leitura com rolagem"><div className="proposal-preview-canvas">{paper}</div></div> : paper}
  </section>;
}
