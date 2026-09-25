import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Container } from "./Container";
import { LANGUAGES, setLanguage } from "../../i18n/languageStore";
import { useLanguage } from "../../i18n/useLanguage";

const navigation = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Serviços", href: "/servicos" },
  { label: "Equipamentos", href: "/equipamentos" },
  { label: "Orçamento", href: "/#solucoes" },
];

// Idiomas reais da área pública (ver src/i18n).
const languages = LANGUAGES;

function isActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href.includes("#")) {
    return false;
  }

  return pathname.startsWith(href);
}

export function Header() {
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const language = useLanguage();

  const languageRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 28);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLanguageOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target)
      ) {
        setLanguageOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function selectLanguage(code) {
    setLanguage(code);
    setLanguageOpen(false);
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100]">
        <Container>
          <div
            className={`
              pointer-events-auto
              transition-all duration-500 ease-out
              ${scrolled ? "pt-2" : "pt-3 lg:pt-4"}
            `}
          >
            <div
              className={`
                relative
                isolate
                flex
                items-center
                justify-between
                overflow-visible
                rounded-[20px]
                border
                px-5
                transition-all
                duration-500
                ease-out
                sm:px-6
                lg:px-7
                ${
                  scrolled
                    ? `
                      h-[70px]
                      border-white/55
                      bg-[linear-gradient(105deg,rgba(129,153,168,0.66)_0%,rgba(158,177,189,0.54)_10%,rgba(190,205,213,0.46)_23%,rgba(220,230,235,0.52)_37%,rgba(244,247,249,0.66)_50%,rgba(220,230,235,0.52)_63%,rgba(190,205,213,0.46)_77%,rgba(158,177,189,0.54)_90%,rgba(129,153,168,0.66)_100%)]
                      shadow-[0_14px_42px_rgba(7,31,45,0.12)]
                      backdrop-blur-[30px]
                      backdrop-saturate-[150%]
                    `
                    : `
                      h-[82px]
                      border-white/45
                      bg-[linear-gradient(105deg,rgba(129,153,168,0.54)_0%,rgba(158,177,189,0.42)_10%,rgba(190,205,213,0.36)_23%,rgba(220,230,235,0.40)_37%,rgba(244,247,249,0.54)_50%,rgba(220,230,235,0.40)_63%,rgba(190,205,213,0.36)_77%,rgba(158,177,189,0.42)_90%,rgba(129,153,168,0.54)_100%)]
                      shadow-[0_10px_34px_rgba(7,31,45,0.08)]
                      backdrop-blur-[24px]
                      backdrop-saturate-[145%]
                    `
                }
              `}
            >
              {/* CAMADAS DE GLASS */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  -z-10
                  overflow-hidden
                  rounded-[inherit]
                "
              >
                {/* PROFUNDIDADE ESQUERDA */}
                <div
                  className="
                    absolute
                    inset-y-0
                    left-0
                    w-[30%]
                    bg-[radial-gradient(circle_at_0%_50%,rgba(7,31,45,0.16)_0%,rgba(18,54,78,0.08)_38%,transparent_75%)]
                  "
                />

                {/* PROFUNDIDADE DIREITA */}
                <div
                  className="
                    absolute
                    inset-y-0
                    right-0
                    w-[30%]
                    bg-[radial-gradient(circle_at_100%_50%,rgba(7,31,45,0.16)_0%,rgba(18,54,78,0.08)_38%,transparent_75%)]
                  "
                />

                {/* REFLEXO CENTRAL */}
                <div
                  className="
                    absolute
                    left-1/2
                    top-[-80px]
                    h-[170px]
                    w-[48%]
                    -translate-x-1/2
                    rounded-full
                    bg-white/26
                    blur-[70px]
                  "
                />

                {/* REFLEXO SUPERIOR */}
                <div
                  className="
                    absolute
                    left-[8%]
                    right-[8%]
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-white/80
                    to-transparent
                  "
                />

                {/* BRILHO INTERNO */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_35%,rgba(7,31,45,0.025)_100%)]
                  "
                />
              </div>

              {/* LOGOS */}
              <Link
                to="/"
                className="
                  flex
                  min-w-0
                  shrink-0
                  items-center
                  gap-3
                  sm:gap-4
                  lg:gap-5
                "
                aria-label="Centro de Excelência em Metrologia - Página inicial"
              >
                <img
                  src="/brand/centro-de-excelencia-senai.png"
                  alt="Centro de Excelência em Metrologia"
                  className={`
                    h-auto
                    object-contain
                    transition-all
                    duration-500
                    ${
                      scrolled
                        ? "w-[230px] sm:w-[225px] lg:w-[265px]"
                        : "w-[210px] sm:w-[240px] lg:w-[265px]"
                    }
                  `}
                />

                <img
                  src="/brand/logo-senai.png"
                  alt="SENAI"
                  className={`
                    hidden
                    h-auto
                    object-contain
                    transition-all
                    duration-500
                    sm:block
                    ${
                      scrolled
                        ? "w-[100px] lg:w-[110px]"
                        : "w-[98px] lg:w-[110px]"
                    }
                  `}
                />
              </Link>

              {/* DESKTOP */}
              <div
                className="
                  hidden
                  flex-1
                  items-center
                  justify-end
                  gap-3
                  xl:flex
                "
              >
                <nav
                  className="flex items-center"
                  aria-label="Navegação principal"
                >
                  {navigation.map((item) => {
                    const active = isActive(
                      location.pathname,
                      item.href,
                    );

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`
                          group
                          relative
                          px-3
                          py-3
                          text-[13px]
                          font-medium
                          transition-colors
                          duration-200
                          2xl:px-3.5
                          ${
                            active
                              ? "font-semibold text-[#12364e]"
                              : "text-[#29495d] hover:text-[#12364e]"
                          }
                        `}
                      >
                        {item.label}

                        <span
                          className={`
                            absolute
                            bottom-[5px]
                            left-3
                            right-3
                            h-[2px]
                            rounded-full
                            bg-[#12364e]
                            transition-transform
                            duration-300
                            ${
                              active
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100"
                            }
                          `}
                        />
                      </Link>
                    );
                  })}
                </nav>

                {/* IDIOMA */}
                <div
                  ref={languageRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setLanguageOpen((value) => !value)
                    }
                    className="
                      flex
                      h-[42px]
                      items-center
                      gap-2
                      rounded-[11px]
                      border
                      border-white/55
                      bg-white/24
                      px-3.5
                      text-[12px]
                      font-semibold
                      text-[#12364e]
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_5px_16px_rgba(7,31,45,0.05)]
                      backdrop-blur-[18px]
                      transition-all
                      duration-200
                      hover:bg-white/42
                    "
                    aria-label="Selecionar idioma"
                    aria-expanded={languageOpen}
                  >
                    {language}

                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      className={`
                        transition-transform
                        duration-200
                        ${languageOpen ? "rotate-180" : ""}
                      `}
                      aria-hidden="true"
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {languageOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        top-[51px]
                        w-[210px]
                        overflow-hidden
                        rounded-[16px]
                        border
                        border-white/75
                        bg-white/76
                        p-2
                        shadow-[0_24px_64px_rgba(7,31,45,0.16)]
                        backdrop-blur-[30px]
                        backdrop-saturate-[150%]
                      "
                    >
                      {languages.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() =>
                            selectLanguage(item.code)
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-[10px]
                            px-3
                            py-2.5
                            text-left
                            transition-colors
                            ${
                              language === item.code
                                ? "bg-[#dfe9ef]/72"
                                : "hover:bg-white/60"
                            }
                          `}
                        >
                          <span className="text-[15px]">
                            {item.flag}
                          </span>

                          <span className="flex-1 text-[13px] font-medium text-[#173044]">
                            {item.label}
                          </span>

                          <span className="text-[11px] font-semibold text-[#7890a0]">
                            {item.code}
                          </span>

                          {language === item.code && (
                            <span className="text-[14px] font-bold text-[#17384d]">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ÁREA DO CLIENTE */}
                <Link
                  to="/cliente"
                  className="
                    inline-flex
                    h-[44px]
                    items-center
                    gap-2
                    rounded-[11px]
                    border
                    border-white/32
                    bg-[linear-gradient(135deg,rgba(29,83,112,0.68)_0%,rgba(16,62,88,0.74)_100%)]
                    px-[18px]
                    text-[12px]
                    font-semibold
                    text-white
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_22px_rgba(7,31,45,0.13)]
                    backdrop-blur-[22px]
                    backdrop-saturate-[138%]
                    transition-all
                    duration-300
                    hover:-translate-y-[1px]
                    hover:border-white/42
                    hover:bg-[linear-gradient(135deg,rgba(34,94,126,0.76)_0%,rgba(19,72,101,0.80)_100%)]
                    hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_12px_28px_rgba(7,31,45,0.18)]
                  "
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="9"
                      cy="6"
                      r="2.7"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />

                    <path
                      d="M4.5 14.2C5.25 11.95 6.75 10.8 9 10.8C11.25 10.8 12.75 11.95 13.5 14.2"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>

                  Área do cliente
                </Link>
              </div>

              {/* MOBILE */}
              <div className="flex items-center gap-2 xl:hidden">
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex =
                      languages.findIndex(
                        (item) => item.code === language,
                      );

                    const next =
                      languages[
                        (currentIndex + 1) %
                          languages.length
                      ];

                    setLanguage(next.code);
                  }}
                  className="
                    flex
                    h-10
                    min-w-[50px]
                    items-center
                    justify-center
                    rounded-[10px]
                    border
                    border-white/55
                    bg-white/24
                    px-2.5
                    text-[11px]
                    font-semibold
                    text-[#12364e]
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.70)]
                    backdrop-blur-[18px]
                  "
                >
                  {language}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMobileOpen((value) => !value)
                  }
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-[#12364e]/76
                    text-white
                    shadow-[0_7px_20px_rgba(7,31,45,0.16)]
                    backdrop-blur-[18px]
                  "
                  aria-label={
                    mobileOpen
                      ? "Fechar menu"
                      : "Abrir menu"
                  }
                >
                  <span className="flex flex-col gap-[4px]">
                    <span
                      className={`
                        h-[1.5px]
                        w-[17px]
                        bg-current
                        transition-all
                        duration-300
                        ${
                          mobileOpen
                            ? "translate-y-[5.5px] rotate-45"
                            : ""
                        }
                      `}
                    />

                    <span
                      className={`
                        h-[1.5px]
                        w-[17px]
                        bg-current
                        transition-all
                        duration-300
                        ${mobileOpen ? "opacity-0" : ""}
                      `}
                    />

                    <span
                      className={`
                        h-[1.5px]
                        w-[17px]
                        bg-current
                        transition-all
                        duration-300
                        ${
                          mobileOpen
                            ? "-translate-y-[5.5px] -rotate-45"
                            : ""
                        }
                      `}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* OVERLAY MOBILE */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`
          fixed
          inset-0
          z-[90]
          bg-[#071f2d]/28
          backdrop-blur-[6px]
          transition-opacity
          duration-300
          xl:hidden
          ${
            mobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* MENU MOBILE */}
      <div
        className={`
          fixed
          left-4
          right-4
          top-[96px]
          z-[110]
          isolate
          overflow-hidden
          rounded-[20px]
          border
          border-white/60
          bg-[linear-gradient(105deg,rgba(129,153,168,0.54)_0%,rgba(190,205,213,0.46)_25%,rgba(244,247,249,0.68)_50%,rgba(190,205,213,0.46)_75%,rgba(129,153,168,0.54)_100%)]
          p-3
          shadow-[0_28px_75px_rgba(7,31,45,0.18)]
          backdrop-blur-[30px]
          backdrop-saturate-[150%]
          transition-all
          duration-300
          xl:hidden
          ${
            mobileOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          }
        `}
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            -z-10
            bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,transparent_42%,rgba(7,31,45,0.035)_100%)]
          "
        />

        <nav>
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="
                flex
                items-center
                justify-between
                rounded-[10px]
                px-4
                py-3
                text-[14px]
                font-medium
                text-[#203b4d]
                transition-colors
                hover:bg-white/45
                hover:text-[#17384d]
              "
            >
              {item.label}

              <span>→</span>
            </Link>
          ))}
        </nav>

        <div className="my-3 h-px bg-[#29495d]/12" />

        <div className="grid grid-cols-3 gap-2">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() =>
                selectLanguage(item.code)
              }
              className={`
                rounded-[9px]
                border
                py-2.5
                text-[11px]
                font-semibold
                ${
                  language === item.code
                    ? "border-[#12364e] bg-[#12364e] text-white"
                    : "border-white/60 bg-white/28 text-[#526d7f]"
                }
              `}
            >
              {item.code}
            </button>
          ))}
        </div>

        {/* ÁREA DO CLIENTE MOBILE */}
        <Link
          to="/cliente"
          className="
            mt-3
            flex
            h-[46px]
            items-center
            justify-center
            rounded-[10px]
            border
            border-white/32
            bg-[linear-gradient(135deg,rgba(29,83,112,0.68)_0%,rgba(16,62,88,0.74)_100%)]
            text-[13px]
            font-semibold
            text-white
            shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_22px_rgba(7,31,45,0.13)]
            backdrop-blur-[22px]
            backdrop-saturate-[138%]
          "
        >
          Área do cliente
        </Link>
      </div>
    </>
  );
}