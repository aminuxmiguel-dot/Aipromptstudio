import { useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  useEffect(() => {
    document.title = "History - AI Prompt Studio";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center text-center space-y-8">
        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Clock className="h-10 w-10 text-primary" />
        </div>
        
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Generation History
          </h1>
          <p className="text-xl text-muted-foreground">
            Your recent creative explorations.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Phase 1 stub: The history interface will display all your generated prompts, quality scores, and negative prompts in a beautiful timeline.
          </p>
        </div>

        <div className="pt-8">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
