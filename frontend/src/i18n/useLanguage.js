import { useSyncExternalStore } from "react";
import { getLanguage, subscribeLanguage } from "./languageStore";

export function useLanguage() {
  return useSyncExternalStore(subscribeLanguage, getLanguage, getLanguage);
}
