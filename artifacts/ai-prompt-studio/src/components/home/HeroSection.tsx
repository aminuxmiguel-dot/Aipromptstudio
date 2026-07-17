import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap } from "lucide-react";
import { useGetStats } from "@workspace/api-client-react";

export function HeroSection() {
  const { data: stats } = useGetStats();

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-40" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none opacity-50 dark:opacity-30" />
      
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+Cjxwb2x5Z29uIHBvaW50cz0iMjQsMCAwLDAgMCwyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] [mask-image:linear-gradient(to_bottom,black_20%,transparent_80%)] pointer-events-none" />

      <div className="container relative max-w-screen-xl mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border/50 text-sm font-medium text-muted-foreground mb-8"
        >
          <Zap className="h-4 w-4 text-primary" />
          <span>v2.0 Model Pipeline Active</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
        >
          Craft <span className="text-gradient">Pixel-Perfect</span><br />
          AI Masterpieces
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The premium creative toolkit for generating professional Midjourney, DALL·E, and Stable Diffusion prompts. No AI API keys required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/tools/logo-prompt">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 shadow-xl transition-all">
              Generate Your First Prompt
            </Button>
          </Link>
          <Link href="#tools" onClick={(e) => {
            e.preventDefault();
            document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-border bg-background/50 backdrop-blur hover:bg-muted transition-all gap-2">
              View All Tools <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto py-8 border-t border-border/40"
          >
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-foreground">{stats.totalPromptsGenerated.toLocaleString()}+</h4>
              <p className="text-sm font-medium text-muted-foreground">Prompts Generated</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-foreground">{stats.totalToolsAvailable}</h4>
              <p className="text-sm font-medium text-muted-foreground">Specialized Tools</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-foreground">{stats.totalFavorites.toLocaleString()}</h4>
              <p className="text-sm font-medium text-muted-foreground">Saved Favorites</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-foreground uppercase">{stats.topToolSlug?.split('-')[0] || 'Logo'}</h4>
              <p className="text-sm font-medium text-muted-foreground">Top Category</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
