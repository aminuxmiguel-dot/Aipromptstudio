import { MousePointerClick, Settings2, CopyCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <MousePointerClick className="h-8 w-8" />,
      title: "Select a Tool",
      description: "Pick from our suite of 5 specialized generators based on what you need to create."
    },
    {
      icon: <Settings2 className="h-8 w-8" />,
      title: "Configure Options",
      description: "Fill out the simple form. Set your style, colors, lighting, and prompt mode."
    },
    {
      icon: <CopyCheck className="h-8 w-8" />,
      title: "Copy & Create",
      description: "Get a production-ready prompt with quality scores. Copy and paste it into your favorite AI."
    }
  ];

  return (
    <section className="py-24 bg-card border-y border-border/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            From Idea to Image in <span className="text-primary">Seconds</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No more prompt guessing or spending hours tweaking syntax.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-border z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-background border-4 border-card shadow-xl flex items-center justify-center text-foreground mb-6 ring-1 ring-border">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
