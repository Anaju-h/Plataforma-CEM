import { Link } from "react-router-dom";

import { Container } from "./Container";

const serviceLinks = [
  {
    label: "Inspeção dimensional",
    href: "/servicos#inspecao-dimensional",
  },
  {
    label: "Digitalização 3D",
    href: "/servicos#digitalizacao-3d",
  },
  {
    label: "Engenharia reversa",
    href: "/servicos#engenharia-reversa",
  },
  {
    label: "Análise interna",
    href: "/servicos#analise-interna",
  },
];

const equipmentLinks = [
  {
    label: "ZEISS PRISMO",
    href: "/equipamentos",
  },
  {
    label: "ZEISS O-INSPECT",
    href: "/equipamentos",
  },
  {
    label: "ZEISS DuraMax",
    href: "/equipamentos",
  },
  {
    label: "ZEISS ATOS Q",
    href: "/equipamentos",
  },
  {
    label: "ZEISS T-SCAN",
    href: "/equipamentos",
  },
  {
    label: "Bosello Max",
    href: "/equipamentos",
  },
];

const solutionLinks = [
  {
    label: "Solicitar orçamento",
    href: "/orcamento",
  },
  {
    label: "Configurar minha solução",
    href: "/configurador",
  },
  {
    label: "Área do cliente",
    href: "/cliente",
  },
];

export function Footer() {
  return (
    <footer
      className="
        relative
        isolate
        overflow-hidden
        border-t border-[#9aafbc]/35
        bg-[linear-gradient(105deg,#8199a8_0%,#9eb1bd_10%,#becdd5_23%,#dce6eb_37%,#f4f7f9_50%,#dce6eb_63%,#becdd5_77%,#9eb1bd_90%,#8199a8_100%)]
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0
          -z-10
        "
      >
        <div
          className="
            absolute
            inset-y-0 left-0
            w-[30%]
            bg-[radial-gradient(circle_at_0%_50%,rgba(7,31,45,0.18)_0%,rgba(18,54,78,0.10)_38%,transparent_75%)]
          "
        />

        <div
          className="
            absolute
            inset-y-0 right-0
            w-[30%]
            bg-[radial-gradient(circle_at_100%_50%,rgba(7,31,45,0.18)_0%,rgba(18,54,78,0.10)_38%,transparent_75%)]
          "
        />

        <div
          className="
            absolute
            left-1/2 top-[-150px]
            h-[300px]
            w-[48%]
            -translate-x-1/2
            rounded-full
            bg-white/32
            blur-[90px]
          "
        />

        <div
          className="
            absolute
            left-[8%] right-[8%] top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/70
            to-transparent
          "
        />

        <div
          className="
            absolute inset-0
            bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_32%,rgba(7,31,45,0.025)_100%)]
          "
        />
      </div>

      <Container>
        <div className="py-8 lg:py-9">
          <div
            className="
              grid
              gap-8
              md:grid-cols-2
              lg:grid-cols-[1.2fr_0.78fr_0.9fr_0.78fr_1.32fr]
              lg:items-start
              lg:gap-6
            "
          >
            <div className="min-w-0">
              <p
                className="
                  mb-3
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[#536d7c]
                "
              >
                Centro de Excelência em Metrologia
              </p>

              <div
                className="
                  flex
                  w-[220px]
                  flex-col
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-[64px]
                    w-full
                    items-center
                    justify-center
                  "
                >
                  <img
                    src="/brand/logo-senai.png"
                    alt="SENAI"
                    className="
                      block
                      max-h-[90px]
                      w-[195px]
                      object-contain
                    "
                  />
                </div>

                <div
                  className="
                    h-px
                    w-[175px]
                    bg-[#496778]/20
                  "
                />

                <div
                  className="
                    flex
                    h-[72px]
                    w-full
                    items-center
                    justify-center
                  "
                >
                  <img
                    src="/brand/logo-ZEISS.png"
                    alt="ZEISS"
                    className="
                      block
                      max-h-[120px]
                      w-[250px]
                      object-contain
                    "
                  />
                </div>
              </div>
            </div>

            <FooterColumn
              title="Serviços"
              links={serviceLinks}
            />

            <FooterColumn
              title="Equipamentos"
              links={equipmentLinks}
            />

            <FooterColumn
              title="Soluções"
              links={solutionLinks}
            />

            <FooterContact />
          </div>

          <div
            className="
              mt-7
              flex
              flex-col
              gap-3
              border-t
              border-[#29495d]/18
              pt-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                text-[10px]
                leading-4
                text-[#304e61]
              "
            >
              © 2026 Centro de Excelência em Metrologia SENAI ZEISS. Todos os direitos reservados.
            </p>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2
                text-[10px]
                font-medium
                text-[#17384d]
              "
            >
              <button
                type="button"
                className="
                  transition-colors
                  hover:text-[#071f2d]
                "
              >
                Privacidade
              </button>

              <span
                aria-hidden="true"
                className="
                  h-3
                  w-px
                  bg-[#29495d]/20
                "
              />

              <button
                type="button"
                className="
                  transition-colors
                  hover:text-[#071f2d]
                "
              >
                Termos de uso
              </button>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="min-w-0">
      <p
        className="
          text-[11px]
          font-bold
          uppercase
          tracking-[0.15em]
          text-[#12364e]
        "
      >
        {title}
      </p>

      <div
        className="
          mt-2
          h-[2px]
          w-6
          rounded-full
          bg-[#315b75]
        "
      />

      <nav
        className="
          mt-4
          flex
          flex-col
          gap-2.5
        "
      >
        {links.map((item) => (
          <Link
            key={`${title}-${item.label}`}
            to={item.href}
            className="
              group
              flex
              w-fit
              items-center
              text-[13px]
              font-medium
              leading-5
              text-[#203f52]
              transition-all
              duration-200
              hover:translate-x-[2px]
              hover:text-[#071f2d]
            "
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function FooterContact() {
  return (
    <div className="min-w-0">
      <p
        className="
          text-[11px]
          font-bold
          uppercase
          tracking-[0.15em]
          text-[#12364e]
        "
      >
        Contato
      </p>

      <div
        className="
          mt-2
          h-[2px]
          w-6
          rounded-full
          bg-[#315b75]
        "
      />

      <div className="mt-4">
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.12em]
            text-[#536d7c]
          "
        >
          E-mail
        </p>

        <a
          href="mailto:cem.senaizeiss@fieg.com.br"
          className="
            mt-1
            block
            break-words
            text-[13px]
            font-medium
            leading-5
            text-[#203f52]
            transition-colors
            duration-200
            hover:text-[#071f2d]
          "
        >
          cem.senaizeiss@fieg.com.br
        </a>
      </div>

      <div className="mt-5">
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.12em]
            text-[#536d7c]
          "
        >
          Localização
        </p>

        <p
          className="
            mt-1
            max-w-[260px]
            text-[13px]
            font-medium
            leading-[1.6]
            text-[#203f52]
          "
        >
          R. Armogaste José da Silveira, 612
          <br />
          St. Centro Oeste, Goiânia - GO
          <br />
          74560-550
        </p>

        <a
          href="https://maps.app.goo.gl/VANnfLem1ExzaLdR8"
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-3
            inline-flex
            items-center
            text-[11px]
            font-bold
            uppercase
            tracking-[0.1em]
            text-[#315b75]
            transition-all
            duration-200
            hover:translate-x-[2px]
            hover:text-[#071f2d]
          "
        >
          Como chegar ↗
        </a>
      </div>
    </div>
  );
}