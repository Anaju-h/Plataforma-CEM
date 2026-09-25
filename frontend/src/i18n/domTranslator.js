/*
 * ============================================================
 * TRADUTOR DE INTERFACE (ÁREA PÚBLICA)
 * ============================================================
 *
 * Traduz os textos renderizados dentro de um elemento usando o
 * dicionário português → EN/DE, sem alterar markup, classes ou
 * layout dos componentes. Guarda o texto original de cada nó
 * para voltar ao português e acompanha as atualizações do React
 * (MutationObserver). Textos sem tradução permanecem em português.
 * ============================================================
 */

import { getLanguage, loadDictionary, subscribeLanguage, translateText } from "./languageStore";

const ATTRIBUTES = ["placeholder", "title", "aria-label", "alt"];
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "SVG", "PATH"]);

export function attachTranslator(root) {
  const textSource = new WeakMap(); // nó → texto original (PT)
  const textApplied = new WeakMap(); // nó → último texto aplicado por nós
  const attrSource = new WeakMap(); // elemento → { atributo: original }
  let observer = null;
  let active = true;

  function skipped(node) {
    const parent = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    if (!parent) return true;
    if (SKIP_TAGS.has(parent.tagName)) return true;
    return Boolean(parent.closest("[data-no-translate]"));
  }

  function translateTextNode(node) {
    if (skipped(node)) return;
    const current = node.nodeValue;
    if (!current || !current.trim()) return;
    let source = textSource.get(node);
    if (source === undefined || current !== textApplied.get(node)) {
      // Primeira vez ou o React trocou o texto: o valor atual é a nova fonte em português.
      source = current;
      textSource.set(node, source);
    }
    const next = translateText(source);
    if (next !== current) node.nodeValue = next;
    textApplied.set(node, next);
  }

  function translateAttributes(element) {
    if (skipped(element)) return;
    let sources = attrSource.get(element);
    for (const name of ATTRIBUTES) {
      if (!element.hasAttribute(name)) continue;
      const current = element.getAttribute(name);
      if (!sources) { sources = {}; attrSource.set(element, sources); }
      const known = sources[name];
      if (!known || (current !== known.applied)) sources[name] = { source: current, applied: current };
      const next = translateText(sources[name].source);
      sources[name].applied = next;
      if (next !== current) element.setAttribute(name, next);
    }
  }

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) { translateTextNode(node); return; }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    translateAttributes(node);
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let current = walker.nextNode();
    while (current) {
      if (current.nodeType === Node.TEXT_NODE) translateTextNode(current);
      else translateAttributes(current);
      current = walker.nextNode();
    }
  }

  function run(mutations) {
    observer.disconnect();
    for (const mutation of mutations) {
      if (mutation.type === "characterData") translateTextNode(mutation.target);
      else if (mutation.type === "attributes") translateAttributes(mutation.target);
      else mutation.addedNodes.forEach(walk);
    }
    observe();
  }

  function observe() {
    if (!active) return;
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTES });
  }

  function refresh() {
    if (!active) return;
    const apply = () => {
      if (!active) return;
      observer.disconnect();
      walk(root);
      observe();
    };
    if (getLanguage() === "PT") apply();
    else loadDictionary().then(apply);
  }

  observer = new MutationObserver(run);
  const unsubscribe = subscribeLanguage(refresh);
  refresh();

  return () => {
    active = false;
    unsubscribe();
    observer.disconnect();
  };
}
