import Image from "next/image";
import Link from "next/link";
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

const technologyLinks = [
  {
    label: "Equipamentos",
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
];

export function Footer() {
  return (
    <footer className="bg-[#04131d] text-white">
      <Container>
        {/* PARTE SUPERIOR */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[2.1fr_0.85fr_0.65fr_0.85fr] lg:gap-10">
          {/* Marca */}
          <div className="min-w-0 md:col-span-2 lg:col-span-1">
            <div className="relative h-[150px] w-full max-w-[700px] sm:h-[190px] lg:h-[260px]">
              <Image
                src="/brand/zeiss-senai.png"
                alt="ZEISS Cooperação Tecnológica e SENAI"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 700px"
                className="origin-left scale-[1.12] object-contain object-left sm:scale-[1.18]"
              />
            </div>

            <p className="mt-1 max-w-xl text-sm leading-7 text-[#a9c4d8]">
              Tecnologia, precisão e engenharia aplicadas aos desafios da
              indústria.
            </p>
          </div>

          {/* Serviços */}
          <FooterLinks
            title="Serviços"
            links={serviceLinks}
          />

          {/* Tecnologia */}
          <FooterLinks
            title="Tecnologia"
            links={technologyLinks}
          />

          {/* Soluções */}
          <FooterLinks
            title="Soluções"
            links={solutionLinks}
          />
        </div>

        {/* CONTATOS */}
        <div className="border-t border-white/15 py-8">
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {/* Telefone */}
            <ContactItem
              title="Telefone"
              icon={<PhoneIcon />}
              className="lg:border-r lg:border-white/15 lg:pr-7"
            >
              (00) 00000-0000
            </ContactItem>

            {/* E-mail */}
            <ContactItem
              title="E-mail"
              icon={<MailIcon />}
              className="lg:border-r lg:border-white/15 lg:px-7"
            >
              contato@exemplo.com.br
            </ContactItem>

            {/* Endereço */}
            <ContactItem
              title="Endereço"
              icon={<LocationIcon />}
              className="lg:border-r lg:border-white/15 lg:px-7"
            >
              <>
                Endereço do Centro
                <br />
                Goiânia - GO
              </>
            </ContactItem>

            {/* Horário */}
            <ContactItem
              title="Horário de atendimento"
              icon={<ClockIcon />}
              className="lg:pl-7"
            >
              <>
                Segunda a sexta
                <br />
                Horário a definir
              </>
            </ContactItem>
          </div>
        </div>

        {/* RODAPÉ INFERIOR */}
        <div className="flex flex-col gap-3 border-t border-white/15 py-6 text-[11px] text-[#829aa9] sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <p>
            © 2026 Centro de Excelência em Metrologia. Todos os direitos
            reservados.
          </p>

          <p className="tracking-[0.14em]">
            SENAI · ZEISS
          </p>
        </div>
      </Container>
    </footer>
  );
}

/* =========================================================
   LINKS DO FOOTER
========================================================= */

type FooterLinksProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

function FooterLinks({
  title,
  links,
}: FooterLinksProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#65b8ee]">
        {title}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {links.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-sm leading-6 text-white transition-colors duration-200 hover:text-[#65b8ee]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   CONTATO
========================================================= */

type ContactItemProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function ContactItem({
  title,
  icon,
  children,
  className = "",
}: ContactItemProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#65b8ee]/60 text-[#65b8ee]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#65b8ee]">
            {title}
          </p>

          <div className="mt-2 break-words text-sm leading-6 text-[#c2d0d9]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ÍCONES
========================================================= */

function PhoneIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />

      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />

      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />

      <path d="M12 7v5l3 2" />
    </svg>
  );
}