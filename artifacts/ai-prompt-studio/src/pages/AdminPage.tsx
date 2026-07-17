import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { useGetStats, useListTools } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  LayoutDashboard, Sparkles, Heart, BarChart2, Wrench,
  ShieldCheck, TrendingUp, Globe, RefreshCw, AlertCircle,
} from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

function StatCard({ icon: Icon, label, value, sub, accent = false }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 space-y-3 ${accent ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card"}`}>
      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

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

export default function AdminPage() {
  useSEO({ title: "Admin Dashboard — AI Prompt Studio", description: "Platform control panel for AI Prompt Studio administrators." });

  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: toolsList, isLoading: toolsLoading } = useListTools();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchAnalytics() {
    try {
      const res = await fetch(`${BASE_URL}/api/analytics/summary`);
      if (res.ok) setAnalytics(await res.json());
    } catch { /* api not configured */ }
    setAnalyticsLoading(false);
  }

  async function fetchSeo() {
    try {
      const res = await fetch(`${BASE_URL}/api/seo/audit`);
      if (res.ok) {
        const data = await res.json();
        setSeoScore(data.score ?? null);
      }
    } catch { /* api not configured */ }
  }

  useEffect(() => {
    fetchAnalytics();
    fetchSeo();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    setAnalyticsLoading(true);
    await fetchAnalytics();
    await fetchSeo();
    setRefreshing(false);
  }

  const topToolsData = (analytics?.topTools ?? []).map((t) => ({
    name: TOOL_LABELS[t.toolSlug] ?? t.toolSlug,
    count: t.count,
  }));

  const isApiDown = !analyticsLoading && analytics === null && !stats;

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Header />
      <main className="flex-1">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8 py-12 space-y-10">

          {/* Page header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest mb-3">
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Platform Control</h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Live overview of all AI Prompt Studio activity, tool performance, and platform health.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-medium hover:border-primary/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* API warning */}
          {isApiDown && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>
                API server is not responding. Configure <code className="bg-amber-500/10 px-1 rounded">DATABASE_URL</code> and{" "}
                <code className="bg-amber-500/10 px-1 rounded">CLERK_SECRET_KEY</code> environment secrets to see live data.
              </span>
            </div>
          )}

          {/* Stats overview */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[120px] rounded-2xl" />
                ))
              ) : (
                <>
                  <StatCard
                    icon={Sparkles}
                    label="Total Generations"
                    value={stats?.totalPromptsGenerated?.toLocaleString() ?? "—"}
                    sub="All-time"
                    accent
                  />
                  <StatCard
                    icon={BarChart2}
                    label="Page Views (30d)"
                    value={analytics?.pageViews30d?.toLocaleString() ?? (analyticsLoading ? "…" : "—")}
                    sub="Last 30 days"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Generations (30d)"
                    value={analytics?.generations30d?.toLocaleString() ?? (analyticsLoading ? "…" : "—")}
                    sub="Last 30 days"
                  />
                  <StatCard
                    icon={Globe}
                    label="SEO Score"
                    value={seoScore !== null ? `${seoScore}/100` : "—"}
                    sub="Technical SEO health"
                  />
                </>
              )}
            </div>
          </section>

          {/* Daily trend chart */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Generation Trend — Last 7 Days</h2>
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              {analyticsLoading ? (
                <Skeleton className="w-full h-[220px] rounded-xl" />
              ) : analytics?.dailyTrend?.length ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.dailyTrend} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: 12 }}
                      labelFormatter={(v) => new Date(v).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Generations" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                  No generation data yet. Generate some prompts to see trends here.
                </div>
              )}
            </div>
          </section>

          {/* Two-column: top tools + tools list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Top tools bar chart */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Top Tools by Usage</h2>
              <div className="rounded-2xl border border-border/50 bg-card p-6 h-full">
                {analyticsLoading ? (
                  <Skeleton className="w-full h-[200px] rounded-xl" />
                ) : topToolsData.length ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topToolsData} layout="vertical" margin={{ left: 8, right: 8 }}>
                      <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={72} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: 12 }}
                      />
                      <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Uses" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                    No usage data yet.
                  </div>
                )}
              </div>
            </section>

            {/* Registered tools */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Registered Tools</h2>
              <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40">
                {toolsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4">
                      <Skeleton className="h-4 w-2/3 rounded" />
                    </div>
                  ))
                ) : toolsList?.length ? (
                  toolsList.map((tool) => (
                    <div key={tool.slug} className="flex items-center justify-between px-5 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Wrench className="w-4 h-4 text-primary/70" />
                        <span className="font-medium">{tool.name}</span>
                      </div>
                      <a
                        href={`${BASE_URL}/tools/${tool.slug}`}
                        className="text-primary hover:underline text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View →
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-muted-foreground text-sm text-center">
                    No tools registered.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Quick links */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Admin Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: `${BASE_URL}/analytics`, icon: BarChart2, label: "Analytics Dashboard", desc: "Platform usage charts" },
                { href: `${BASE_URL}/seo`, icon: Globe, label: "SEO Center", desc: "Technical SEO audit" },
                { href: `${BASE_URL}/api/seo/audit`, icon: ShieldCheck, label: "Raw SEO Audit JSON", desc: "Machine-readable audit data", external: true },
              ].map(({ href, icon: Icon, label, desc, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Auth status */}
          <section className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Authentication Status</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Admin authentication via Clerk is enabled when <code className="bg-muted px-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> and{" "}
              <code className="bg-muted px-1 rounded">CLERK_SECRET_KEY</code> are configured.
              In the current environment, Clerk is{" "}
              <span className={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? "text-emerald-400" : "text-amber-400"}>
                {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? "active" : "not configured (dev mode)"}
              </span>.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
