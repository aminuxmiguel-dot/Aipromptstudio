import { motion } from "framer-motion";
import { Copy, Star, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAddFavorite } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListFavoritesQueryKey } from "@workspace/api-client-react";

interface GeneratedPromptCardProps {
  prompt: string;
  negativePrompt: string | null;
  toolSlug: string;
  mode: string;
  qualityScore: number;
  sessionId: string;
  onFavoriteSaved?: () => void;
}

export function GeneratedPromptCard({ 
  prompt, 
  negativePrompt, 
  toolSlug, 
  mode, 
  qualityScore, 
  sessionId,
  onFavoriteSaved 
}: GeneratedPromptCardProps) {
  const { toast } = useToast();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const queryClient = useQueryClient();
  const addFavorite = useAddFavorite();

  const handleCopy = async (text: string, isNegative: boolean = false) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isNegative) {
        setCopiedNegative(true);
        setTimeout(() => setCopiedNegative(false), 2000);
      } else {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      }
      toast({
        title: "Copied to clipboard",
        description: isNegative ? "Negative prompt copied." : "Prompt copied.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again or select text manually.",
      });
    }
  };

  const handleSaveFavorite = () => {
    addFavorite.mutate(
      { 
        data: { 
          toolSlug, 
          mode, 
          prompt, 
          negativePrompt, 
          qualityScore, 
          sessionId 
        } 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() });
          toast({
            title: "Saved to favorites",
            description: "You can find this prompt in your Favorites page.",
          });
          onFavoriteSaved?.();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to save",
            description: "There was an error saving your favorite. Please try again.",
          });
        }
      }
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/20">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border text-xs font-medium text-foreground">
              <Sparkles className="w-3 h-3 text-primary" />
              {toolSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-xs font-medium text-secondary capitalize">
              {mode} Mode
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1.5 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
              onClick={handleSaveFavorite}
              disabled={addFavorite.isPending}
            >
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline-block">Save</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="h-8 gap-1.5"
              onClick={() => handleCopy(prompt)}
            >
              {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPrompt ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <p className="text-lg md:text-xl font-medium leading-relaxed tracking-tight text-foreground select-all">
            {prompt}
          </p>
        </div>
      </div>

      {negativePrompt && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border border-destructive/20 bg-destructive/5 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-destructive/10">
            <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
              Negative Prompt
              <span className="text-xs font-normal opacity-80">(Exclude these elements)</span>
            </h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-destructive hover:bg-destructive/20 hover:text-destructive"
              onClick={() => handleCopy(negativePrompt, true)}
              title="Copy Negative Prompt"
            >
              {copiedNegative ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
          <div className="p-4">
            <p className="text-sm text-destructive/90 select-all leading-relaxed">
              {negativePrompt}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
