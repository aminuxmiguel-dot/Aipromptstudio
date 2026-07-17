import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 bg-card relative overflow-hidden border-t border-border/40">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5" />
      <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/20 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 bg-secondary/20 blur-[100px] rounded-full" />
      
      <div className="container relative z-10 max-w-screen-md mx-auto px-4 md:px-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-background border border-border/50 shadow-xl mb-8">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Ready to elevate your AI art?
        </h2>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
          Join the studio today. Generate your first professional prompt in seconds and see the difference in your image outputs.
        </p>
        
        <Link href="/tools/logo-prompt">
          <Button size="lg" className="h-14 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all">
            Start Generating Now
          </Button>
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">No account required to try.</p>
      </div>
    </section>
  );
}
