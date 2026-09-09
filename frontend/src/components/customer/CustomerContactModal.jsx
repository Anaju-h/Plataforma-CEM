import { useEffect, useMemo, useState } from "react";

import {
  getCustomerContactChannels,
  getCustomerProjects,
  getCustomerQuotes,
  getCustomerRequests,
  sendCustomerMessage,
} from "../../services/customer/customerService";

const subjectOptions = [
  {
    value: "request",
    label: "Solicitação",
  },
  {
    value: "quote",
    label: "Orçamento",
  },
  {
    value: "project",
    label: "Projeto",
  },
  {
    value: "document",
    label: "Documento",
  },
  {
    value: "general",
    label: "Dúvida geral",
  },
  {
    value: "other",
    label: "Outro",
  },
];

function ContactChannel({ type, label, enabled, value }) {
  function getChannelHref() {
    if (!enabled || !value) {
      return null;
    }

    if (type === "whatsapp") {
      return `https://wa.me/${value}`;
    }

    if (type === "email") {
      return `mailto:${value}`;
    }

    if (type === "phone") {
      return `tel:${value}`;
    }

    return null;
  }

  const href = getChannelHref();

  const content = (
    <>
      <div>
        <p className="text-[12px] font-semibold text-[#071f2d]">
          {label}
        </p>

        <p className="mt-1 text-[10px] text-[#8b959c]">
          {enabled && value ? value : "Canal em definição"}
        </p>
      </div>

      <span
        className={`
          text-[17px]
          ${enabled && value ? "text-[#0057b8]" : "text-[#c2c9cd]"}
        `}
      >
        →
      </span>
    </>
  );

  if (!href) {
    return (
      <div
        className="
          flex min-h-[64px]
          items-center justify-between gap-4
          rounded-[10px]
          border border-[#e2e8eb]
          bg-[#f8fafb]
          px-4 py-3
        "
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={type === "whatsapp" ? "_blank" : undefined}
      rel={type === "whatsapp" ? "noreferrer" : undefined}
      className="
        flex min-h-[64px]
        items-center justify-between gap-4
        rounded-[10px]
        border border-[#dce5e9]
        bg-white
        px-4 py-3
        transition-all duration-200
        hover:border-[#9cc9e8]
        hover:bg-[#f8fbfd]
      "
    >
      {content}
    </a>
  );
}

export function CustomerContactModal({ open, onClose }) {
  const [channels, setChannels] = useState(null);
  const [requests, setRequests] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);

  const [subject, setSubject] = useState("request");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    async function loadContactData() {
      const [
        contactChannels,
        customerRequests,
        customerQuotes,
        customerProjects,
      ] = await Promise.all([
        getCustomerContactChannels(),
        getCustomerRequests(),
        getCustomerQuotes(),
        getCustomerProjects(),
      ]);

      if (!active) {
        return;
      }

      setChannels(contactChannels);
      setRequests(customerRequests);
      setQuotes(customerQuotes);
      setProjects(customerProjects);
    }

    loadContactData();

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    setReference("");
    setFeedback("");
  }, [subject]);

  useEffect(() => {
    if (!open) {
      setSubject("request");
      setReference("");
      setMessage("");
      setFeedback("");
      setSending(false);
    }
  }, [open]);

  const references = useMemo(() => {
    if (subject === "request") {
      return requests.map((item) => ({
        value: item.id,
        label: `${item.id} · ${item.service}`,
      }));
    }

    if (subject === "quote") {
      return quotes.map((item) => ({
        value: item.id,
        label: `${item.id} · ${item.service}`,
      }));
    }

    if (subject === "project") {
      return projects.map((item) => ({
        value: item.id,
        label: `${item.id} · ${item.service}`,
      }));
    }

    return [];
  }, [subject, requests, quotes, projects]);

  const showReference =
    subject === "request" ||
    subject === "quote" ||
    subject === "project";

  async function handleSubmit(event) {
    event.preventDefault();

    if (!message.trim()) {
      setFeedback("Escreva uma mensagem antes de continuar.");
      return;
    }

    setSending(true);
    setFeedback("");

    try {
      const result = await sendCustomerMessage({
        subject,
        reference: reference || null,
        message: message.trim(),
      });

      setFeedback(result.message);
    } catch {
      setFeedback(
        "Não foi possível processar a mensagem neste momento.",
      );
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-[#04131d]/65
        px-4 py-6
        backdrop-blur-[2px]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-contact-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          max-h-[90vh]
          w-full max-w-[720px]
          overflow-y-auto
          rounded-[18px]
          border border-white/10
          bg-white
          shadow-[0_24px_80px_rgba(3,21,31,0.28)]
        "
      >
        <div className="flex items-start justify-between gap-6 border-b border-[#e6ebee] px-6 py-5 sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0057b8]">
              Atendimento
            </p>

            <h2
              id="customer-contact-title"
              className="mt-2 text-[22px] font-semibold tracking-[-0.025em] text-[#071f2d]"
            >
              Falar com o laboratório
            </h2>

            <p className="mt-2 max-w-[520px] text-[12px] leading-5 text-[#76818a]">
              Utilize um canal oficial disponível ou envie uma mensagem
              relacionada ao seu atendimento.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-full
              border border-[#dfe6ea]
              text-[19px] font-light
              text-[#68747c]
              transition-colors
              hover:bg-[#f4f7f9]
              hover:text-[#071f2d]
            "
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6 sm:px-7">
          <section>
            <h3 className="text-[12px] font-semibold text-[#071f2d]">
              Canais de atendimento
            </h3>

            <p className="mt-1 text-[11px] text-[#8a959d]">
              Os canais oficiais serão disponibilizados após validação pelo
              laboratório.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ContactChannel
                type="whatsapp"
                label={channels?.whatsapp?.label || "WhatsApp"}
                enabled={channels?.whatsapp?.enabled}
                value={channels?.whatsapp?.value}
              />

              <ContactChannel
                type="email"
                label={channels?.email?.label || "E-mail"}
                enabled={channels?.email?.enabled}
                value={channels?.email?.value}
              />

              <ContactChannel
                type="phone"
                label={channels?.phone?.label || "Telefone"}
                enabled={channels?.phone?.enabled}
                value={channels?.phone?.value}
              />
            </div>
          </section>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e6ebee]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a1abb1]">
              Mensagem
            </span>

            <div className="h-px flex-1 bg-[#e6ebee]" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-[11px] font-semibold text-[#4d5a63]">
                  Assunto
                </span>

                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="
                    mt-2 h-[44px] w-full
                    rounded-[9px]
                    border border-[#d8e0e4]
                    bg-white
                    px-3
                    text-[12px] text-[#34424b]
                    outline-none
                    transition-colors
                    focus:border-[#65b8ee]
                  "
                >
                  {subjectOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {showReference ? (
                <label>
                  <span className="text-[11px] font-semibold text-[#4d5a63]">
                    Referência
                    <span className="ml-1 font-normal text-[#9aa3aa]">
                      (opcional)
                    </span>
                  </span>

                  <select
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    className="
                      mt-2 h-[44px] w-full
                      rounded-[9px]
                      border border-[#d8e0e4]
                      bg-white
                      px-3
                      text-[12px] text-[#34424b]
                      outline-none
                      transition-colors
                      focus:border-[#65b8ee]
                    "
                  >
                    <option value="">
                      Nenhuma referência
                    </option>

                    {references.map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <div />
              )}
            </div>

            <label className="mt-5 block">
              <span className="text-[11px] font-semibold text-[#4d5a63]">
                Mensagem
              </span>

              <textarea
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setFeedback("");
                }}
                rows={5}
                placeholder="Descreva como podemos ajudar..."
                className="
                  mt-2 w-full resize-none
                  rounded-[10px]
                  border border-[#d8e0e4]
                  bg-white
                  px-4 py-3
                  text-[12px] leading-5
                  text-[#34424b]
                  outline-none
                  transition-colors
                  placeholder:text-[#a7b0b6]
                  focus:border-[#65b8ee]
                "
              />
            </label>

            {feedback && (
              <div className="mt-4 rounded-[9px] border border-[#dce5e9] bg-[#f6f9fa] px-4 py-3">
                <p className="text-[11px] leading-5 text-[#65717a]">
                  {feedback}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#edf1f3] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="
                  h-[42px]
                  rounded-[9px]
                  border border-[#d8e0e4]
                  px-5
                  text-[12px] font-semibold
                  text-[#56636c]
                  transition-colors
                  hover:bg-[#f5f7f8]
                "
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={sending}
                className="
                  h-[42px]
                  rounded-[9px]
                  bg-[#0057b8]
                  px-5
                  text-[12px] font-semibold
                  text-white
                  transition-colors
                  hover:bg-[#004a9d]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {sending ? "Processando..." : "Enviar mensagem"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}