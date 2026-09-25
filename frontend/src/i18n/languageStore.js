/*
 * ============================================================
 * IDIOMA DA ÁREA PÚBLICA
 * ============================================================
 *
 * Português é a fonte. Inglês, alemão, espanhol, francês e italiano usam o dicionário
 * `translations.js`, carregado sob demanda (fora do bundle inicial).
 * A preferência fica só no navegador do visitante (não é dado sensível).
 * ============================================================
 */

export const LANGUAGES = [
  { code: "PT", label: "Português", flag: "🇧🇷", html: "pt-BR" },
  { code: "EN", label: "English", flag: "🇺🇸", html: "en" },
  { code: "DE", label: "Deutsch", flag: "🇩🇪", html: "de" },
  { code: "ES", label: "Español", flag: "🇪🇸", html: "es" },
  { code: "FR", label: "Français", flag: "🇫🇷", html: "fr" },
  { code: "IT", label: "Italiano", flag: "🇮🇹", html: "it" },
];

// Posição de cada idioma no dicionário: "pt": [EN, DE, ES, FR, IT].
const DICTIONARY_INDEX = { EN: 0, DE: 1, ES: 2, FR: 3, IT: 4 };

const STORAGE_KEY = "lab-language";
const listeners = new Set();

function readStored() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.some(item => item.code === value) ? value : "PT";
  } catch {
    return "PT";
  }
}

let language = typeof window === "undefined" ? "PT" : readStored();
let dictionary = null;
let loading = null;

function applyHtmlLang() {
  if (typeof document === "undefined") return;
  document.documentElement.lang = LANGUAGES.find(item => item.code === language)?.html || "pt-BR";
}
applyHtmlLang();

export function getLanguage() {
  return language;
}

export function subscribeLanguage(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLanguage(code) {
  if (!LANGUAGES.some(item => item.code === code) || code === language) return;
  language = code;
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Preferência apenas de conveniência; sem armazenamento, o idioma vale para a sessão.
  }
  applyHtmlLang();
  listeners.forEach(listener => listener());
}

/** Carrega o dicionário uma única vez (import dinâmico). */
export function loadDictionary() {
  if (dictionary) return Promise.resolve(dictionary);
  if (!loading) {
    loading = import("./translations.js").then(module => {
      dictionary = new Map();
      Object.entries(module.translations).forEach(([source, values]) => {
        dictionary.set(normalize(source), values);
      });
      return dictionary;
    });
  }
  return loading;
}

export function normalize(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

/** Tradução síncrona (retorna o texto original quando não há tradução ou o dicionário ainda não carregou). */
export function translateText(text, code = language) {
  if (code === "PT" || !dictionary) return text;
  const index = DICTIONARY_INDEX[code] ?? 0;
  const key = normalize(text);
  const values = dictionary.get(key);
  if (!values || !values[index]) return text;
  const leading = text.match(/^\s*/)[0];
  const trailing = text.match(/\s*$/)[0];
  return leading + values[index] + trailing;
}
