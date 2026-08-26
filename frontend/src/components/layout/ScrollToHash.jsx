import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const elementId = decodeURIComponent(
      location.hash.replace("#", ""),
    );

    const timer = window.setTimeout(() => {
      const element =
        document.getElementById(elementId);

      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    location.pathname,
    location.hash,
  ]);

  return null;
}