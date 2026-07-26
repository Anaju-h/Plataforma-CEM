import { AboutSection } from "@/components/home/AboutSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesPreview />
    </main>
  );
}