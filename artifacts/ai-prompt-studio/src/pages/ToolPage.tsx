import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug || "unknown-tool";

  useEffect(() => {
    document.title = `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - AI Prompt Studio`;
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Header />
      
      <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center text-center space-y-8">
        <div className="h-20 w-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
          <Construction className="h-10 w-10 text-secondary" />
        </div>
        
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="capitalize">{slug.split('-').join(' ')}</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            This tool is currently under construction in the studio.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We're calibrating the generation models and polishing the UI. Check back soon for the most powerful {slug.split('-').join(' ')} generation experience.
          </p>
        </div>

        <div className="pt-8">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Studio
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
