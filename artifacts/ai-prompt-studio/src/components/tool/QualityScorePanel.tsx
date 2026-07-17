import { motion } from "framer-motion";
import { ChevronDown, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface QualityScoreProps {
  qualityScore: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    commercialReadiness: string;
  };
}

export function QualityScorePanel({ qualityScore }: QualityScoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Reset when a new score comes in
    setAnimatedScore(0);
    
    // Animate up to the actual score
    const duration = 1500; // ms
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    const increment = qualityScore.score / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= qualityScore.score) {
        setAnimatedScore(qualityScore.score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [qualityScore.score]);

  const getColorClass = (score: number) => {
    if (score >= 80) return "text-green-500 border-green-500/30 bg-green-500/10";
    if (score >= 60) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-destructive border-destructive/30 bg-destructive/10";
  };

  const getTextColorClass = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-destructive";
  };

  const getReadinessColor = (readiness: string) => {
    const r = readiness.toLowerCase();
    if (r.includes('high')) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (r.includes('medium')) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={cn(
                "relative flex items-center justify-center w-14 h-14 rounded-full border-2",
                getColorClass(qualityScore.score)
              )}>
                <span className="text-xl font-bold tracking-tighter">
                  {animatedScore}
                </span>
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="46"
                    fill="transparent"
                  />
                  <motion.circle
                    className={cn("stroke-current", getTextColorClass(qualityScore.score))}
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="46"
                    fill="transparent"
                    initial={{ strokeDasharray: "289 289", strokeDashoffset: 289 }}
                    animate={{ strokeDashoffset: 289 - (289 * qualityScore.score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-lg leading-none">Prompt Quality Score</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Commercial Readiness:</span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider",
                    getReadinessColor(qualityScore.commercialReadiness)
                  )}>
                    {qualityScore.commercialReadiness}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted">
              <ChevronDown className={cn("w-5 h-5 transition-transform duration-200 text-muted-foreground", isOpen && "rotate-180")} />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-5 pb-5 pt-2 grid gap-6 border-t border-border/40">
            {qualityScore.strengths.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {qualityScore.strengths.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {qualityScore.weaknesses.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="w-4 h-4" />
                  Areas to Improve
                </h4>
                <ul className="space-y-2">
                  {qualityScore.weaknesses.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {qualityScore.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <Info className="w-4 h-4" />
                  Suggestions for Next Time
                </h4>
                <ul className="space-y-2">
                  {qualityScore.suggestions.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
