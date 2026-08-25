import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "@/components/ui/ArrowIcons";

type Equipment = {
  number: string;
  name: string;
  category: string;
  image: string;
  href: string;
};

const equipment: Equipment[] = [
  {
    number: "01",
    name: "ZEISS PRISMO",
    category: "Medição por coordenadas",
    image: "/images/equipment/zeiss-prismo.jpeg",
    href: "/equipamentos#prismo",
  },
  {
    number: "02",
    name: "ZEISS O-INSPECT",
    category: "Medição multissensor",
    image: "/images/equipment/zeiss-o-inspect.jpeg",
    href: "/equipamentos#o-inspect",
  },
  {
    number: "03",
    name: "ZEISS DuraMax",
    category: "Medição por coordenadas",
    image: "/images/equipment/zeiss-duramax.jpeg",
    href: "/equipamentos#duramax",
  },
  {
    number: "04",
    name: "ZEISS T-SCAN",
    category: "Escaneamento 3D",
    image: "/images/equipment/zeiss-t-scan.jpeg",
    href: "/equipamentos#t-scan",
  },
  {
    number: "05",
    name: "ZEISS ATOS-Q",
    category: "Escaneamento 3D",
    image: "/images/equipment/zeiss-atos-q.jpeg",
    href: "/equipamentos#atos-q",
  },
  {
    number: "06",
    name: "ZEISS BOSELLO MAX",
    category: "Tomografia computadorizada industrial",
    image: "/images/equipment/zeiss-bosello-max.jpeg",
    href: "/equipamentos#bosello-max",
  },
];

export function EquipmentPreview() {
  return (
    <section className="bg-white py-14 sm:py-18 lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
          {/* Conteúdo */}
          <div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#356f9f]">
                Tecnologia
              </p>

              <div className="h-px w-10 bg-[#6fa7d1]" />
            </div>

            <h2 className="mt-4 max-w-xl text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#0b2340] sm:text-5xl">
              Infraestrutura para diferentes desafios de medição.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--color-text-secondary)] sm:mt-6 sm:text-lg sm:leading-8">
              O Centro reúne tecnologias para medição dimensional,
              digitalização 3D e inspeção interna, atendendo a diferentes
              necessidades da indústria.
            </p>

            <Link
              href="/equipamentos"
              className="group mt-7 inline-flex items-center gap-3 text-sm font-medium text-[#356f9f] transition-colors duration-300 hover:text-[#0b2340]"
            >
              Conheça nossos equipamentos

              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Equipamentos */}
          <div className="grid grid-cols-2 items-start gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {equipment.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="
                  group relative
                  flex min-h-[250px] flex-col
                  overflow-hidden rounded-[20px]
                  border border-[#dfe6eb]
                  bg-white
                  p-4
                  transition-all duration-500 ease-out
                  hover:border-[#9bbfd9]
                  sm:min-h-[280px] sm:rounded-[24px] sm:p-5
                  lg:h-[250px] lg:min-h-0
                  lg:hover:h-[330px]
                  lg:hover:-translate-y-1
                  lg:hover:shadow-[0_14px_35px_rgba(8,28,44,0.08)]
                "
              >
                {/* Número + seta */}
                <div className="relative z-20 flex items-center justify-between">
                  <span className="text-[11px] font-medium tracking-[0.14em] text-[#356f9f] sm:text-xs">
                    {item.number}
                  </span>

                  <ArrowUpRightIcon
                    className="
                      h-4 w-4 text-[#657b8d]
                      transition-all duration-300
                      sm:h-[17px] sm:w-[17px]
                      lg:opacity-0
                      lg:group-hover:-translate-y-0.5
                      lg:group-hover:translate-x-0.5
                      lg:group-hover:opacity-100
                    "
                  />
                </div>

                {/* Imagem */}
                <div
                  className="
                    relative mt-1 h-[130px] shrink-0
                    transition-all duration-500
                    sm:h-[160px]
                    lg:h-[185px]
                    lg:group-hover:h-[170px]
                  "
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1280px) 50vw, 22vw"
                    className="object-contain transition-transform duration-500 ease-out lg:group-hover:-translate-y-1"
                  />
                </div>

                {/* Mobile / tablet */}
                <div className="mt-auto lg:hidden">
                  <div className="mb-2.5 h-px w-8 bg-[#6fa7d1] sm:w-10" />

                  <h3 className="text-[13px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0b2340] sm:text-base">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-[8px] font-medium uppercase leading-4 tracking-[0.06em] text-[#356f9f] sm:text-[10px] sm:tracking-[0.08em]">
                    {item.category}
                  </p>
                </div>

                {/* Desktop hover */}
                <div
                  className="
                    hidden overflow-hidden
                    lg:block
                    lg:max-h-0
                    lg:translate-y-2
                    lg:opacity-0
                    lg:transition-all lg:duration-500
                    lg:group-hover:max-h-[125px]
                    lg:group-hover:translate-y-0
                    lg:group-hover:opacity-100
                  "
                >
                  <div className="mb-3 h-px w-10 bg-[#6fa7d1]" />

                  <h3 className="text-base font-semibold leading-tight tracking-[-0.02em] text-[#0b2340]">
                    {item.name}
                  </h3>

                  <p className="mt-1.5 text-[10px] font-medium uppercase leading-4 tracking-[0.07em] text-[#356f9f]">
                    {item.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Link geral mobile */}
        <div className="mt-8 flex justify-end border-t border-[#e1e8ed] pt-6 lg:hidden">
          <Link
            href="/equipamentos"
            className="group inline-flex items-center gap-3 text-sm font-medium text-[#356f9f]"
          >
            Ver todos os equipamentos

            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}