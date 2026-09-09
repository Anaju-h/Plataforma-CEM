import { AboutSection } from "../components/home/AboutSection";
import { EquipmentPreview } from "../components/home/EquipmentPreview";
import { HeroSection } from "../components/home/HeroSection";
import { ServicesPreview } from "../components/home/ServicesPreview";
import { SolutionsPreview } from "../components/home/SolutionsPreview";

export function HomePage() {
  return (
    <main>
      {/* 
        HERO + ABOUT COMPARTILHAM O MESMO FUNDO.
        Não existem dois degradês encostando um no outro.
      */}
      <div
        className="
          relative
          isolate
          overflow-hidden
          bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_10%,#f7fafb_23%,#eaf2f6_38%,#dfeaf0_47%,#dfeaf0_60%,#e8f0f4_72%,#f5f9fb_88%,#ffffff_100%)]
        "
      >
        {/* PROFUNDIDADE GLOBAL */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            -z-10
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              -left-[340px]
              top-[24%]
              h-[720px]
              w-[720px]
              rounded-full
              bg-[#315b75]/6
              blur-[170px]
            "
          />

          <div
            className="
              absolute
              -right-[360px]
              top-[34%]
              h-[760px]
              w-[760px]
              rounded-full
              bg-[#0057b8]/4
              blur-[175px]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-[43%]
              h-[440px]
              w-[55%]
              -translate-x-1/2
              rounded-full
              bg-[#9eb1bd]/8
              blur-[140px]
            "
          />
        </div>

        <HeroSection />
        <AboutSection />
      </div>

      <ServicesPreview />
      <EquipmentPreview />
      <SolutionsPreview />
    </main>
  );
}