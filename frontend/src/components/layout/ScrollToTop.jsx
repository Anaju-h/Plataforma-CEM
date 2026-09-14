import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const elementId = hash.replace("#", "");

      const scrollToElement = () => {
        const element = document.getElementById(elementId);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          return true;
        }

        return false;
      };

      if (!scrollToElement()) {
        const timeout = window.setTimeout(() => {
          scrollToElement();
        }, 100);

        return () => {
          window.clearTimeout(timeout);
        };
      }

      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, hash]);

  return null;
}