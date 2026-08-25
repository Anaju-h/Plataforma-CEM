import { Container } from "../layout/Container";

export function HeroSection() {
  return (
    <section className="bg-white pt-12 sm:pt-16 lg:pt-20">
      <Container>
        <div className="grid items-center gap-10 pb-14 sm:gap-12 sm:pb-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-20">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[var(--color-brand)]">
              Centro de Excelência em Metrologia
            </p>

            <h1 className="mt-4 text-[2.8rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[var(--color-text-primary)] sm:mt-5 sm:text-6xl lg:text-[4rem]">
              Precisão para transformar desafios em soluções.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--color-text-secondary)] sm:mt-7 sm:text-lg sm:leading-8">
              Tecnologia, metrologia e engenharia aplicadas às necessidades da
              indústria.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-technical)]">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11] lg:aspect-[16/10]">
              <img
                src="/images/home/hero-duramax.jpeg"
                alt="DuraMax realizando a medição de uma peça no Centro de Excelência em Metrologia"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071a2b]/85 via-[#071a2b]/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-9">
                <div className="mb-3 h-px w-12 bg-[#5fa9df] sm:mb-4 sm:w-14" />

                <p className="max-w-[90%] text-xl font-medium leading-[1.15] text-white sm:max-w-md sm:text-2xl">
                  Medição. Análise. Transformação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}