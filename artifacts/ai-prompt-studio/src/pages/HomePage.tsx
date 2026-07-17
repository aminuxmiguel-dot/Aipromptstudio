import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { ToolsSection } from "@/components/home/ToolsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { ExamplesSection } from "@/components/home/ExamplesSection";
import { FaqSection } from "@/components/home/FaqSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function HomePage() {
  useEffect(() => {
    document.title = "AI Prompt Studio | Premium AI Image Prompts";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Header />
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <FeatureCards />
        <ToolsSection />
        <HowItWorks />
        <BenefitsSection />
        <ExamplesSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
