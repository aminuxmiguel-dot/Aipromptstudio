import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, Trash2, Copy, Sparkles, Filter, Loader2, Check } from "lucide-react";
import { 
  useListHistory, 
  useDeleteHistory, 
  useListTools,
  getListHistoryQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <span className="hidden sm:inline-block">Delete</span>
    </Button>
  );
}

export default function HistoryPage() {
  useEffect(() => {
    document.title = "History - AI Prompt Studio";
  }, []);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterSlug, setFilterSlug] = useState<string>("all");
  
  const { data: tools } = useListTools();
  const { data: history, isLoading } = useListHistory(
    filterSlug !== "all" ? { toolSlug: filterSlug } : undefined
  );
  
  const deleteHistory = useDeleteHistory();

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Prompt copied.",
      });
      // We could track copied state per item but toast is sufficient for history list
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteHistory.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListHistoryQueryKey() });
          toast({
            title: "Entry deleted",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to delete",
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Generation History</h1>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              Review and reuse your past creative explorations.
              {history && <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-foreground">{history.length} prompts</span>}
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
            <p>Loading history...</p>
          </div>
        ) : !history || history.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-4 border border-dashed rounded-2xl bg-muted/5">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No history yet</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              {filterSlug === "all" 
                ? "You haven't generated any prompts yet. Head over to the studio to create your first one."
                : `You haven't generated any prompts with the ${formatToolName(filterSlug)} tool yet.`}
            </p>
            <Link href="/tools/logo-prompt">
              <Button className="gap-2">
                <Sparkles className="w-4 h-4" />
                Start Generating
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((entry) => (
              <div 
                key={entry.id} 
                className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-border/50 bg-card hover:border-border transition-all duration-300"
              >
                <div className="flex-1 space-y-4">
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
                    <span className="text-xs text-muted-foreground ml-auto">
                      {format(new Date(entry.createdAt), "MMM d, yyyy • h:mm a")}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <p className="text-sm md:text-base text-foreground/90 leading-relaxed line-clamp-3">
                      {entry.prompt}
                    </p>
                    {/* Faded bottom if prompt is long to indicate truncation */}
                    {entry.prompt.length > 250 && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                    )}
                  </div>
                </div>
                
                <div className="flex md:flex-col items-center justify-end md:justify-start gap-2 pt-2 md:pt-0 md:pl-6 md:border-l border-border/40 shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1.5 w-full md:w-32 justify-center"
                    onClick={() => handleCopy(entry.prompt, entry.id)}
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  
                  <Link href={`/tools/${entry.toolSlug}`}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1.5 w-full md:w-32 justify-center text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Sparkles className="w-4 h-4" />
                      Reuse Tool
                    </Button>
                  </Link>

                  <div className="md:mt-auto pt-2">
                    <InlineConfirmDelete 
                      onConfirm={() => handleDelete(entry.id)} 
                      isDeleting={deleteHistory.isPending} 
                    />
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
