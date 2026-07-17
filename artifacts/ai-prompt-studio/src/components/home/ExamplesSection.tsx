import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function ExamplesSection() {
  const examples = [
    {
      tool: "Logo Design",
      score: 98,
      prompt: "Minimalist vector logo, fox silhouette, geometric shapes, negative space, modern tech company, monoline, flat colors, dark purple and cyan, clean white background, scalable, dribbble style --no text, gradients, shadows, complex details --v 6.0",
    },
    {
      tool: "Product Photo",
      score: 95,
      prompt: "Commercial product photography, sleek matte black headphones resting on obsidian slate, subtle neon cyan edge lighting, studio environment, macro lens 100mm, sharp focus, mist rolling across surface, photorealistic, 8k --ar 16:9 --style raw",
    },
    {
      tool: "Portrait",
      score: 92,
      prompt: "Cinematic portrait, cyberpunk hacker, rain-slicked neon street reflections, dramatic side lighting from holographic signs, bokeh background, shot on 35mm f/1.4, highly detailed skin texture, moody atmosphere, cinematic color grading --ar 4:5",
    }
  ];

  return (
    <section className="py-24 bg-muted/20 border-y border-border/40">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Output <span className="text-primary">Quality</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See the exact prompts our templates generate. Ready to copy, paste, and render.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {examples.map((example, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <Badge variant="outline" className="bg-background text-xs font-semibold">
                  {example.tool}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                  Score: {example.score}
                </div>
              </div>
              <p className="text-sm font-mono text-muted-foreground leading-relaxed flex-1">
                {example.prompt}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
