import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Copy, Sparkles, Filter, Loader2, ArrowLeft } from "lucide-react";
import { 
  useListFavorites, 
  useDeleteFavorite, 
  useListTools,
  getListFavoritesQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSEO } from "@/hooks/useSEO";

function InlineConfirmDelete({ onConfirm, isDeleting }: { onConfirm: () => void, isDeleting: boolean }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => setConfirming(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          className="h-8 gap-1"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Sure?
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      onClick={() => setConfirming(true)}
    >
      <Trash2 className="w-4 h-4" />
      <span className="hidden sm:inline-block">Remove</span>
    </Button>
  );
}

export default function FavoritesPage() {
  useSEO({ title: "Saved Favorites — AI Prompt Studio", description: "Your best AI image prompts, saved and ready to reuse in Midjourney, DALL·E, and Stable Diffusion." });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterSlug, setFilterSlug] = useState<string>("all");
  
  const { data: tools } = useListTools();
  const { data: favorites, isLoading } = useListFavorites(
    filterSlug !== "all" ? { toolSlug: filterSlug } : undefined
  );
  
  const deleteFavorite = useDeleteFavorite();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Prompt copied.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteFavorite.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() });
          toast({
            title: "Removed from favorites",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to remove",
          });
        }
      }
    );
  };

  const getColorClass = (score?: number | null) => {
    if (!score) return "text-muted-foreground border-border bg-muted/10";
    if (score >= 80) return "text-green-500 border-green-500/30 bg-green-500/10";
    if (score >= 60) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-destructive border-destructive/30 bg-destructive/10";
  };

  const formatToolName = (slug: string) => {
    const tool = tools?.find(t => t.slug === slug);
    if (tool) return tool.name;
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500/20" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Saved Favorites</h1>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              Your most successful prompts, ready to reuse.
              {favorites && <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-foreground">{favorites.length} saved</span>}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filter:</span>
            </div>
            <Select value={filterSlug} onValueChange={setFilterSlug}>
              <SelectTrigger className="w-[200px] bg-card/50">
                <SelectValue placeholder="All Tools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                {tools?.map(tool => (
                  <SelectItem key={tool.slug} value={tool.slug}>{tool.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Loading favorites...</p>
          </div>
        ) : !favorites || favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-4 border border-dashed rounded-2xl bg-muted/5">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              {filterSlug === "all" 
                ? "You haven't saved any prompts to your favorites. Click the star icon on any generated prompt to save it here."
                : `You haven't saved any favorites from the ${formatToolName(filterSlug)} tool.`}
            </p>
            <Link href="/">
              <Button className="gap-2" variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Return to Studio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {favorites.map((entry) => (
              <div 
                key={entry.id} 
                className="group relative flex flex-col gap-5 p-6 rounded-2xl border border-amber-500/20 bg-card hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.05)] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border text-xs font-medium text-foreground">
                      {formatToolName(entry.toolSlug)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-xs font-medium text-secondary capitalize">
                      {entry.mode}
                    </span>
                    {entry.qualityScore && (
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold",
                        getColorClass(entry.qualityScore)
                      )}>
                        Score: {entry.qualityScore}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <InlineConfirmDelete 
                      onConfirm={() => handleDelete(entry.id)} 
                      isDeleting={deleteFavorite.isPending} 
                    />
                  </div>
                </div>
                
                <div className="flex-1 bg-muted/30 rounded-xl p-4 border border-border/40">
                  <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                    {entry.prompt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">
                    Saved {format(new Date(entry.createdAt), "MMM d, yyyy")}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-8 gap-1.5"
                      onClick={() => handleCopy(entry.prompt)}
                    >
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
