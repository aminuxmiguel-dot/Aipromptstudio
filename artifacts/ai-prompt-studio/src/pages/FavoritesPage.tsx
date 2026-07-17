import { useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft } from "lucide-react";

export default function FavoritesPage() {
  useEffect(() => {
    document.title = "Favorites - AI Prompt Studio";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center text-center space-y-8">
        <div className="h-20 w-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
          <Star className="h-10 w-10 text-amber-500" />
        </div>
        
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Saved Favorites
          </h1>
          <p className="text-xl text-muted-foreground">
            Your most successful prompts, ready to reuse.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Phase 1 stub: The favorites interface will let you organize, tag, and quickly copy your best prompts for Midjourney and DALL·E.
          </p>
        </div>

        <div className="pt-8">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
