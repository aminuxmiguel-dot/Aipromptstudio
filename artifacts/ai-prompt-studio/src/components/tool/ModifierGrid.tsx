import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ModifierGridProps {
  modifiers: string[];
  value: string;
  onChange: (modifier: string) => void;
}

export function ModifierGrid({ modifiers, value, onChange }: ModifierGridProps) {
  if (!modifiers || modifiers.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Style Modifiers</h3>
      <div className="flex flex-wrap gap-2">
        {modifiers.map((modifier) => {
          const isSelected = value === modifier;

          return (
            <button
              key={modifier}
              type="button"
              onClick={() => onChange(isSelected ? "" : modifier)}
              className={cn(
                "group relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-card/50 text-muted-foreground border-border/50 hover:bg-card hover:text-foreground hover:border-border"
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              <span className="capitalize">{modifier.replace(/-/g, " ")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
