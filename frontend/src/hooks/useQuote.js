import { useEffect, useState } from "react";
import { getQuoteById } from "../services/quoteService";
export function useQuote(id) {
  const [state, setState] = useState({ quote: null, loading: true, error: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    getQuoteById(id).then(quote => {
      if (active) setState({ quote, id, loading: false, error: "" });
    }).catch(error => {
      if (active) setState({ quote: null, id, loading: false, error: error.message });
    });
    return () => { active = false; };
  }, [id, attempt]);
  return { ...state, loading: state.loading || state.id !== id, retry: () => { setState({ quote: null, loading: true, error: "" }); setAttempt(value => value + 1); } };
}
