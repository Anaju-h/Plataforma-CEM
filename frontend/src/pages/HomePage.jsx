import { AboutSection } from "../components/home/AboutSection";
import { EquipmentPreview } from "../components/home/EquipmentPreview";
import { HeroSection } from "../components/home/HeroSection";
import { ServicesPreview } from "../components/home/ServicesPreview";
import { SolutionsPreview } from "../components/home/SolutionsPreview";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesPreview />
      <EquipmentPreview />
      <SolutionsPreview />
    </main>
  );
}