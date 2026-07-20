import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OverviewSection } from "./admin/OverviewSection";
import { PromptsSection } from "./admin/PromptsSection";
import { SeoSection } from "./admin/SeoSection";
import { AiSeoSection } from "./admin/AiSeoSection";
import { IndexingSection } from "./admin/IndexingSection";
import { AdsSection } from "./admin/AdsSection";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

// ─── Auth ─────────────────────────────────────────────────────────────────────
const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";
const SESSION_KEY = "admin_session_v1";

function isSessionValid(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    return Date.now() < JSON.parse(raw).expires;
  } catch { return false; }
}
function saveSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expires: Date.now() + 4 * 60 * 60 * 1000 }));
}
function clearSession() { sessionStorage.removeItem(SESSION_KEY); }

// ─── Section routing ─────────────────────────────────────────────────────────
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const SECTIONS: Record<string, { title: string; subtitle: string; component: React.ComponentType }> = {
  "":         { title: "Overview",        subtitle: "Platform stats, charts, and tool activity.",             component: OverviewSection },
  "prompts":  { title: "Prompt Manager",  subtitle: "Manage modular prompt fragments per generator tool.",    component: PromptsSection },
  "seo":      { title: "SEO Center",      subtitle: "Metadata, Open Graph, and structured data audit.",      component: SeoSection },
  "ai-seo":   { title: "AI SEO Audit",    subtitle: "Live crawl scoring each SEO signal with recommendations.", component: AiSeoSection },
  "indexing": { title: "Indexing",        subtitle: "Robots.txt, sitemap, and search console verification.",  component: IndexingSection },
  "ads":      { title: "Ads Center",      subtitle: "Global ad toggles and per-slot script configurator.",   component: AdsSection },
};

function resolveSection(location: string): string {
  // location is like "/admin/seo" or "/admin" or "/"
  const withoutBase = location.replace(BASE, "");
  const withoutAdmin = withoutBase.replace(/^\/admin\/?/, "");
  return withoutAdmin.replace(/^\//, "").split("/")[0] ?? "";
}

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
        saveSession(); onSuccess();
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">AI Prompt Studio · Platform Control</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}
          className="rounded-2xl border border-border/60 bg-card p-8 space-y-5 shadow-xl shadow-black/20">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="au">Username</label>
            <input id="au" type="text" autoComplete="username" value={username}
              onChange={(e) => setUsername(e.target.value)} placeholder="admin" required
              className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="ap">Password</label>
            <div className="relative">
              <input id="ap" type={showPass ? "text" : "password"} autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 pr-11 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
              <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-primary text-primary-foreground font-semibold py-2.5 text-sm hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading
              ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              : <Lock className="w-4 h-4" />}
            {loading ? "Verifying…" : "Sign In"}
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground/60">Session expires after 4 hours.</p>
      </div>
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  const sectionKey = resolveSection(location);
  const section = SECTIONS[sectionKey] ?? SECTIONS[""];
  const SectionComponent = section.component;

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          title={section.title}
          subtitle={section.subtitle}
          onLogout={() => { clearSession(); onLogout(); }}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-screen-xl mx-auto px-6 py-8">
            <SectionComponent />
          </div>
        </main>
      </div>
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

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}
