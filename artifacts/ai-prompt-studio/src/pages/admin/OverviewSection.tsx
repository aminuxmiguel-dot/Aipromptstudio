import { useEffect, useState, useCallback } from "react";
import { useGetStats, useListTools } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Sparkles, BarChart2, TrendingUp, Globe, Wrench,
  Activity, AlertCircle, CheckCircle2,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface AnalyticsSummary {
  pageViews30d: number;
  generations30d: number;
  topTools: { toolSlug: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
}

const TOOL_LABELS: Record<string, string> = {
  "logo-prompt": "Logo",
  "product-photo-prompt": "Product",
  "portrait-prompt": "Portrait",
  "youtube-thumbnail-prompt": "Thumbnail",
  "packaging-prompt": "Packaging",
};

export function OverviewSection() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: toolsList, isLoading: toolsLoading } = useListTools();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "ok" | "down">("checking");

  const fetchData = useCallback(async () => {
    try {
      const [analyticsRes, seoRes] = await Promise.all([
        fetch(`${BASE}/api/analytics/summary`),
        fetch(`${BASE}/api/seo/audit`),
      ]);
      if (analyticsRes.ok) { setAnalytics(await analyticsRes.json()); setApiStatus("ok"); }
      else setApiStatus("down");
      if (seoRes.ok) { const d = await seoRes.json(); setSeoScore(d.score ?? null); }
    } catch {
      setApiStatus("down");
    }
    setAnalyticsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const topToolsData = (analytics?.topTools ?? []).map((t) => ({
    name: TOOL_LABELS[t.toolSlug] ?? t.toolSlug,
    count: t.count,
  }));

  const chartTooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.75rem",
    fontSize: 12,
  };

  return (
    <div className="space-y-8">
      {/* Status banner */}
      {!analyticsLoading && (
        apiStatus === "down" ? (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Database not connected</p>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Set <code className="bg-amber-500/10 px-1 rounded">DATABASE_URL</code> to enable live data. All stats populate automatically once connected.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-semibold">All systems operational</span>
          </div>
        )
      )}

      {/* Stats */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <AdminStatCard icon={Sparkles} label="Total Generations" accent
            value={statsLoading ? "…" : (stats?.totalPromptsGenerated?.toLocaleString() ?? "—")}
            sub="All-time" loading={false} />
          <AdminStatCard icon={BarChart2} label="Page Views (30d)"
            value={analyticsLoading ? "…" : (analytics?.pageViews30d?.toLocaleString() ?? "—")}
            sub="Last 30 days" />
          <AdminStatCard icon={TrendingUp} label="Generations (30d)"
            value={analyticsLoading ? "…" : (analytics?.generations30d?.toLocaleString() ?? "—")}
            sub="Last 30 days" />
          <AdminStatCard icon={Globe} label="SEO Score"
            value={analyticsLoading ? "…" : (seoScore !== null ? `${seoScore}/100` : "—")}
            sub="Technical health" />
        </div>
      </section>

      {/* Trend chart */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Generation Trend — Last 7 Days
        </h2>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          {analyticsLoading ? <Skeleton className="w-full h-[220px] rounded-xl" /> :
            analytics?.dailyTrend?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics.dailyTrend} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip contentStyle={chartTooltipStyle}
                    labelFormatter={(v) => new Date(v).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Generations" />
                </BarChart>
              </ResponsiveContainer>
            ) : <AdminEmptyState icon={Activity}
              title={apiStatus === "down" ? "Connect DATABASE_URL to view trends" : "No generation data yet"}
              description="Generate some prompts to see trends populate here." />
          }
        </div>
      </section>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top tools */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Top Tools by Usage</h2>
          <div className="rounded-2xl border border-border/50 bg-card p-6 min-h-[240px] flex flex-col justify-center">
            {analyticsLoading ? <Skeleton className="w-full h-[200px] rounded-xl" /> :
              topToolsData.length ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topToolsData} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <XAxis type="number" axisLine={false} tickLine={false} allowDecimals={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={72} axisLine={false} tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Uses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : <AdminEmptyState icon={BarChart2}
                title={apiStatus === "down" ? "Usage data requires a database connection" : "No usage data yet"} />
            }
          </div>
        </section>

        {/* Registered tools */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Registered Tools</h2>
          <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40 overflow-hidden">
            {toolsLoading ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4"><Skeleton className="h-4 w-2/3 rounded" /></div>
            )) : toolsList?.length ? toolsList.map((tool) => (
              <div key={tool.slug} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-medium">{tool.name}</span>
                </div>
                <a href={`${BASE}/tools/${tool.slug}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline transition-colors">Open →</a>
              </div>
            )) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {apiStatus === "down" ? "Connect DATABASE_URL to list tools." : "No tools registered."}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
