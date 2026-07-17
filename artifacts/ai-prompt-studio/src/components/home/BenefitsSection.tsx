import { CheckCircle2 } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    "Save hours of trial and error syntax testing",
    "Stop wasting Midjourney fast hours on bad generations",
    "Achieve consistent art direction across projects",
    "Unlock advanced composition and lighting techniques",
    "No AI jargon required to get professional results",
    "Export negative prompts for pristine outputs",
    "Keep a reliable history of your best configurations",
    "Client-ready results on the first attempt"
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Stop <span className="text-destructive">Guessing.</span><br />
              Start Generating.
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Writing good prompts is a technical skill. AI Prompt Studio translates your natural language ideas into the exact syntax that generative models crave.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 pt-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <div className="rounded-2xl border border-border/50 bg-card p-6 md:p-8 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/20 blur-2xl rounded-full" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-secondary/20 blur-3xl rounded-full" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">prompt_diff.sh</span>
                </div>
                
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                  <div className="text-destructive font-mono font-semibold mb-2">Before:</div>
                  <p className="text-foreground/80 italic">"A cool coffee cup on a table looking nice"</p>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm">
                  <div className="text-primary font-mono font-semibold mb-2">After AI Prompt Studio:</div>
                  <p className="text-foreground/90 font-mono leading-relaxed">
                    Product photography, artisan ceramic coffee cup resting on rough reclaimed wood table, dramatic rim lighting, shallow depth of field, 85mm lens, f/1.8, cinematic studio lighting, volumetric atmosphere, sharp focus on mug texture, hyper-detailed, 8k resolution --ar 16:9 --style raw
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
