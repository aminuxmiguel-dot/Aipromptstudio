import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { useGetStats, useListTools } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  LayoutDashboard, Sparkles, BarChart2, Wrench,
  ShieldCheck, TrendingUp, Globe, RefreshCw, AlertCircle,
  Lock, Eye, EyeOff, LogOut, Activity, CheckCircle2,
} from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

// ─── Credentials (change before production) ───────────────────────────────────
const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";
const SESSION_KEY = "admin_session_v1";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isSessionValid(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { expires } = JSON.parse(raw);
    return Date.now() < expires;
  } catch {
    return false;
  }
}

function saveSession() {
  const expires = Date.now() + 4 * 60 * 60 * 1000; // 4 hours
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expires }));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, accent = false, loading = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  loading?: boolean;
}) {
  if (loading) return <Skeleton className="h-[124px] rounded-2xl" />;
  return (
    <div
      className={`rounded-2xl border p-6 space-y-2 transition-colors ${
        accent
          ? "border-primary/40 bg-primary/5 hover:bg-primary/8"
          : "border-border/50 bg-card hover:border-border"
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
      <Activity className="w-8 h-8 opacity-30" />
      <p className="text-sm max-w-xs">{message}</p>
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

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
        saveSession();
        onSuccess();
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">AI Prompt Studio · Platform Control</p>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/60 bg-card p-8 space-y-5 shadow-xl shadow-black/20"
        >
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="admin-user">Username</label>
            <input
              id="admin-user"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="admin-pass">Password</label>
            <div className="relative">
              <input
                id="admin-pass"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 pr-11 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary text-primary-foreground font-semibold py-2.5 text-sm hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {loading ? "Verifying…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground/60">
          Session expires after 4 hours of inactivity.
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: toolsList, isLoading: toolsLoading } = useListTools();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [seoLoading, setSeoLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "ok" | "down">("checking");

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/analytics/summary`);
      if (res.ok) {
        setAnalytics(await res.json());
        setApiStatus("ok");
      } else {
        setApiStatus("down");
      }
    } catch {
      setApiStatus("down");
    }
    setAnalyticsLoading(false);
  }, []);

  const fetchSeo = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/seo/audit`);
      if (res.ok) {
        const data = await res.json();
        setSeoScore(data.score ?? null);
      }
    } catch { /* ignore */ }
    setSeoLoading(false);
  }, []);

  useEffect(() => {
    fetchAnalytics();
    fetchSeo();
  }, [fetchAnalytics, fetchSeo]);

  async function handleRefresh() {
    setRefreshing(true);
    setAnalyticsLoading(true);
    setSeoLoading(true);
    setApiStatus("checking");
    await Promise.all([fetchAnalytics(), fetchSeo()]);
    setRefreshing(false);
  }

  const topToolsData = (analytics?.topTools ?? []).map((t) => ({
    name: TOOL_LABELS[t.toolSlug] ?? t.toolSlug,
    count: t.count,
  }));

  const isDbDown = !statsLoading && !stats && apiStatus === "down";

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Header />
      <main className="flex-1">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8 py-12 space-y-10">

          {/* Page header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-widest mb-3">
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Platform Control</h1>
              <p className="text-muted-foreground mt-2 max-w-xl text-sm">
                Live overview of all AI Prompt Studio activity, tool performance, and platform health.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-medium hover:border-primary/40 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-red-500/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Status banner */}
          {apiStatus === "down" && !refreshing && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-medium">Database not connected</p>
                <p className="text-amber-400/70 text-xs">
                  Configure <code className="bg-amber-500/10 px-1 rounded">DATABASE_URL</code> to enable live data. Stats, charts, and analytics will populate automatically once connected.
                </p>
              </div>
            </div>
          )}
          {apiStatus === "ok" && !refreshing && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="font-medium">All systems operational</span>
            </div>
          )}

          {/* Stats overview */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Sparkles}
                label="Total Generations"
                value={statsLoading ? "…" : (stats?.totalPromptsGenerated?.toLocaleString() ?? "—")}
                sub="All-time"
                accent
                loading={false}
              />
              <StatCard
                icon={BarChart2}
                label="Page Views (30d)"
                value={analyticsLoading ? "…" : (analytics?.pageViews30d?.toLocaleString() ?? "—")}
                sub="Last 30 days"
              />
              <StatCard
                icon={TrendingUp}
                label="Generations (30d)"
                value={analyticsLoading ? "…" : (analytics?.generations30d?.toLocaleString() ?? "—")}
                sub="Last 30 days"
              />
              <StatCard
                icon={Globe}
                label="SEO Score"
                value={seoLoading ? "…" : (seoScore !== null ? `${seoScore}/100` : "—")}
                sub="Technical SEO health"
              />
            </div>
          </section>

          {/* Daily trend */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Generation Trend — Last 7 Days
            </h2>
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              {analyticsLoading ? (
                <Skeleton className="w-full h-[220px] rounded-xl" />
              ) : analytics?.dailyTrend?.length ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.dailyTrend} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      axisLine={false} tickLine={false} allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: 12 }}
                      labelFormatter={(v) => new Date(v).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Generations" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message={isDbDown ? "Connect DATABASE_URL to view generation trends." : "No generation data yet. Generate some prompts to see trends here."} />
              )}
            </div>
          </section>

          {/* Two-column: top tools + tools list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Top tools */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Top Tools by Usage</h2>
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
                  <EmptyState message={isDbDown ? "Usage data will appear once the database is connected." : "No usage data yet."} />
                )}
              </div>
            </section>

            {/* Registered tools */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Registered Tools</h2>
              <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40">
                {toolsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4">
                      <Skeleton className="h-4 w-2/3 rounded" />
                    </div>
                  ))
                ) : toolsList?.length ? (
                  toolsList.map((tool) => (
                    <div key={tool.slug} className="flex items-center justify-between px-5 py-3.5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Wrench className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-medium">{tool.name}</span>
                      </div>
                      <a
                        href={`${BASE_URL}/tools/${tool.slug}`}
                        className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open →
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-muted-foreground text-sm text-center">
                    {isDbDown ? "Connect DATABASE_URL to list registered tools." : "No tools registered."}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Quick links */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Admin Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: `${BASE_URL}/analytics`, icon: BarChart2, label: "Analytics Dashboard", desc: "Platform usage charts and metrics" },
                { href: `${BASE_URL}/seo`, icon: Globe, label: "SEO Center", desc: "Technical SEO audit and scores" },
                { href: `${BASE_URL}/api/seo/audit`, icon: ShieldCheck, label: "Raw SEO Audit", desc: "Machine-readable JSON audit data", external: true },
              ].map(({ href, icon: Icon, label, desc, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group flex items-start gap-4 p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
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

          {/* System info */}
          <section className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">System Status</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Database</p>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${apiStatus === "ok" ? "bg-emerald-400" : apiStatus === "down" ? "bg-red-400" : "bg-amber-400 animate-pulse"}`} />
                  <span className="font-medium capitalize">{apiStatus === "checking" ? "Checking…" : apiStatus === "ok" ? "Connected" : "Not connected"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Authentication</p>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <span className="font-medium">{import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? "Clerk active" : "Dev mode (no Clerk)"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Admin Session</p>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-medium">Active (4h TTL)</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  useSEO({
    title: "Admin Dashboard — AI Prompt Studio",
    description: "Platform control panel for AI Prompt Studio administrators.",
  });

  const [authed, setAuthed] = useState<boolean>(isSessionValid);

  function handleLogout() {
    clearSession();
    setAuthed(false);
  }

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
