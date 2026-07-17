import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  value: string;
  onChange: (mode: string) => void;
  modes: string[];
}

const MODE_DESCRIPTIONS: Record<string, string> = {
  minimal: "Clean & focused",
  premium: "Professional grade",
  creative: "Bold & distinctive",
  luxury: "Maximum quality",
};

export function ModeSelector({ value, onChange, modes }: ModeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Generation Mode</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {modes.map((mode) => {
          const isSelected = value === mode;
          const description = MODE_DESCRIPTIONS[mode] || "Standard generation";

          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(mode)}
              className={cn(
                "relative group flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300",
                isSelected
                  ? "border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                  : "border-border/50 bg-card/30 text-muted-foreground hover:bg-card hover:border-border hover:text-foreground"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="mode-selector-bg"
                  className="absolute inset-0 rounded-xl bg-primary/5 pointer-events-none"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 font-semibold capitalize text-base tracking-tight mb-1">
                {mode}
              </span>
              <span className={cn(
                "relative z-10 text-[11px] font-medium transition-colors",
                isSelected ? "text-primary/80" : "text-muted-foreground/60 group-hover:text-muted-foreground/80"
              )}>
                {description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
