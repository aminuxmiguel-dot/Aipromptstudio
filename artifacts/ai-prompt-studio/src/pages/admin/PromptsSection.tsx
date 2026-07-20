import { useListTools } from "@workspace/api-client-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const FRAGMENT_TYPES = ["Introduction", "Styles", "Lighting", "Composition", "Negative Prompts"];

export function PromptsSection() {
  const { data: tools, isLoading, isError } = useListTools();

  return (
    <div className="space-y-8">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary text-sm">
        <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Prompt Fragments Manager</p>
          <p className="text-xs text-primary/70 mt-0.5">
            Manage modular prompt fragments mapped to each generator tool. Full CRUD requires <code className="bg-primary/10 px-1 rounded">DATABASE_URL</code>.
          </p>
        </div>
      </div>

      {/* Fragment types reference */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Fragment Types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FRAGMENT_TYPES.map((type) => (
            <div key={type} className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium">{type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tools list */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Generator Tools</h2>
        {isError && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Could not load tools. Check that the API server is running.</span>
          </div>
        )}
        <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40 overflow-hidden">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4"><Skeleton className="h-4 w-1/2 rounded" /></div>
              ))
            : tools?.length
            ? tools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                  <a className="group flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">/tools/{tool.slug}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                </Link>
              ))
            : (
              <AdminEmptyState icon={Sparkles}
                title="No tools registered"
                description="Tools are registered in the API server configuration." />
            )}
        </div>
      </section>

      <AdminEmptyState icon={Sparkles}
        title="Fragment CRUD editor coming soon"
        description="Add, edit, and map prompt fragments to tools once the database is connected." />
    </div>
  );
}
