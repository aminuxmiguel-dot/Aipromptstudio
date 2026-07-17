import { motion } from "framer-motion";
import { ChevronDown, Puzzle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PromptFragmentsProps {
  fragments?: {
    introduction?: string | null;
    style?: string | null;
    composition?: string | null;
    lighting?: string | null;
    boosters?: string | null;
    negativePrompt?: string | null;
  };
}

export function PromptFragmentsView({ fragments }: PromptFragmentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!fragments) return null;

  // Filter out empty fragments
  const activeFragments = Object.entries(fragments).filter(([_, value]) => value && value.trim() !== "");
  
  if (activeFragments.length === 0) return null;

  const getFragmentLabel = (key: string) => {
    switch (key) {
      case 'negativePrompt': return 'Negative Elements';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10">
                <Puzzle className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="font-semibold text-sm">Anatomy of this Prompt</h3>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted">
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 text-muted-foreground", isOpen && "rotate-180")} />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 grid gap-3 border-t border-border/40 pt-4">
            {activeFragments.map(([key, value]) => (
              <div key={key} className="bg-background rounded-lg border p-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-32 shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {getFragmentLabel(key)}
                  </span>
                </div>
                <div className="text-sm font-medium text-foreground/90">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
