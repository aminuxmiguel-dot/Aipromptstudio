import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { useGetStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TrendingUp, Sparkles, Heart, Wrench, BarChart2 } from "lucide-react";

interface AnalyticsSummary {
  pageViews30d: number;
  generations30d: number;
  topTools: { toolSlug: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
}

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="w-full h-[260px] rounded-xl" />;
}

const TOOL_LABELS: Record<string, string> = {
  "logo-prompt": "Logo",
  "product-photo-prompt": "Product",
  "portrait-prompt": "Portrait",
  "youtube-thumbnail-prompt": "Thumbnail",
  "packaging-prompt": "Packaging",
};

export default function AnalyticsPage() {
  useSEO({
    title: "Platform Analytics | AI Prompt Studio",
    description:
      "Real-time platform analytics for AI Prompt Studio — page views, prompt generation trends, and top tool usage.",
    ogType: "website",
  });
  usePageAnalytics({ eventType: "page_view" });

  const { data: stats, isLoading: statsLoading } = useGetStats();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    fetch(`${base}/api/analytics/summary`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setSummary(data as AnalyticsSummary);
      })
      .catch(() => {})
      .finally(() => setSummaryLoading(false));
  }, []);

  const topToolsData = (summary?.topTools ?? []).map((t) => ({
    name: TOOL_LABELS[t.toolSlug] ?? t.toolSlug,
    count: t.count,
  }));

  const trendData = (summary?.dailyTrend ?? []).map((d) => ({
    date: d.date.slice(5), // MM-DD
    count: d.count,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-muted/10 border-b border-border/40 pb-8 pt-10">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-3 text-primary text-xs font-semibold uppercase tracking-wider">
              <BarChart2 className="w-3.5 h-3.5" />
              Platform Analytics
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Usage Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Live insights into AI Prompt Studio platform activity — transparent by design.
            </p>
          </div>
        </div>

        <div className="container max-w-screen-xl mx-auto px-4 py-10 space-y-10">

          {/* Stat Cards */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Platform Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[120px] rounded-2xl" />
                ))
              ) : (
                <>
                  <StatCard icon={Sparkles} label="Prompts Generated" value={(stats?.totalPromptsGenerated ?? 0).toLocaleString()} sub="All time" />
                  <StatCard icon={Heart} label="Favorites Saved" value={(stats?.totalFavorites ?? 0).toLocaleString()} sub="All time" />
                  <StatCard icon={Wrench} label="Tools Available" value={stats?.totalToolsAvailable ?? 5} sub="Specialized generators" />
                  <StatCard icon={TrendingUp} label="Page Views" value={(summary?.pageViews30d ?? 0).toLocaleString()} sub="Last 30 days" />
                </>
              )}
            </div>
          </section>

          {/* Daily Trend */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Generation Trend — Last 7 Days</h2>
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              {summaryLoading ? <ChartSkeleton /> : trendData.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                  No generation data yet. Generate some prompts to see trends here.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 13 }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      itemStyle={{ color: "hsl(var(--primary))" }}
                    />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} name="Generations" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* Top Tools */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Top Tools by Usage</h2>
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              {summaryLoading ? <ChartSkeleton /> : topToolsData.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                  No tool usage data yet. Generate some prompts to see rankings here.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topToolsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 13 }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      itemStyle={{ color: "hsl(var(--primary))" }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Prompts" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* 30d Generations */}
          <section>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Prompt Generations — Last 30 Days</p>
                {summaryLoading ? <Skeleton className="h-9 w-28" /> : (
                  <p className="text-4xl font-bold text-primary">
                    {(summary?.generations30d ?? 0).toLocaleString()}
                  </p>
                )}
              </div>
              <Sparkles className="w-12 h-12 text-primary/30 flex-shrink-0" />
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
