import { useEffect, useState } from "react";
export function useCustomerData(load) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    load().then(data => { if (active) setState({ data, loading: false, error: "" }); })
      .catch(error => { if (active) setState({ data: null, loading: false, error: error.message, status: error.status }); });
    return () => { active = false; };
  }, [load, attempt]);
  return { ...state, retry: () => { setState({ data: null, loading: true, error: "" }); setAttempt(value => value + 1); }, update: data => setState(current => ({ ...current, data })) };
}
