import { motion, type Variants } from "framer-motion";
import { KeyRound, Wand2, Sliders, Target, History, Heart } from "lucide-react";

const features = [
  {
    icon: <KeyRound className="h-6 w-6" />,
    title: "No AI API Needed",
    description: "Generate world-class prompts instantly without connecting external AI accounts or managing API keys."
  },
  {
    icon: <Wand2 className="h-6 w-6" />,
    title: "5 Specialized Tools",
    description: "Purpose-built generators for logos, product photos, portraits, thumbnails, and packaging."
  },
  {
    icon: <Sliders className="h-6 w-6" />,
    title: "4 Prompt Modes",
    description: "Switch between minimal, premium, creative, and luxury styles to match your exact vision."
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Quality Score System",
    description: "Every generated prompt receives a commercial readiness score with suggestions for improvement."
  },
  {
    icon: <History className="h-6 w-6" />,
    title: "Prompt History",
    description: "Never lose a great idea. We automatically save your generation history for easy reference."
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Favorites System",
    description: "Curate your own private library of perfect prompts by saving your absolute best results."
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function FeatureCards() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border/40">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Engineered for <span className="text-primary">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We've abstracted away the complexity of prompt engineering. You just focus on the creative direction.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
