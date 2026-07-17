import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      q: "Do I need my own Midjourney or DALL·E subscription?",
      a: "Yes. AI Prompt Studio generates the text prompts. You will need your own subscription to an AI image generator (like Midjourney, DALL·E 3, or Stable Diffusion) to render the actual images."
    },
    {
      q: "Are the prompts guaranteed to work?",
      a: "Our prompts use proven, tested syntax structure. While AI image generation always has some randomness, our templates drastically increase the probability of getting exactly what you want on the first try."
    },
    {
      q: "What is the Quality Score?",
      a: "Our system evaluates the generated prompt against industry best practices. It checks for lighting descriptions, camera settings, style modifiers, and checks for conflicting terms to ensure a commercially viable output."
    },
    {
      q: "Can I use this for commercial client work?",
      a: "Absolutely. The prompts generated are 100% yours to use. They are specifically designed to produce commercial-grade results suitable for client presentations, marketing campaigns, and production."
    },
    {
      q: "Do you support aspect ratios and model versions?",
      a: "Yes. Our generators automatically append the correct parameter syntax (like --ar 16:9 or --v 6.0) depending on the configuration options you select."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container max-w-screen-md mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/40">
              <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
