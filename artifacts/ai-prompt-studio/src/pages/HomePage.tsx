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
import { useSEO } from "@/hooks/useSEO";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";

export default function HomePage() {
  useSEO({
    title: "AI Prompt Studio — Free AI Prompt Generator for Midjourney & DALL·E",
    description: "Generate professional AI image prompts instantly with our Smart Modular Prompt Engine. No AI API key required. 5 specialized tools, 4 quality modes, 100% free.",
    ogType: "website",
    twitterCard: "summary_large_image",
  });
  usePageAnalytics({ eventType: "page_view" });

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
