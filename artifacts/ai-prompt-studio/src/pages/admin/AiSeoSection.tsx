import { useState } from "react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Search, Play, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface AuditResult {
  score: number;
  checks: { id: string; label: string; passed: boolean; detail?: string }[];
}

const PRIORITY_CHECKS = [
  "Meta title present and under 60 chars",
  "Meta description present (120–160 chars)",
  "H1 tag present and unique",
  "All images have alt text",
  "Canonical URL configured",
  "Open Graph tags complete",
  "Structured data (JSON-LD) present",
  "robots.txt accessible",
];

export function AiSeoSection() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState(false);

  async function runAudit() {
    setRunning(true);
    setError(false);
    setResult(null);
    try {
      const res = await fetch(`${BASE}/api/seo/audit`);
      if (res.ok) setResult(await res.json());
      else setError(true);
    } catch {
      setError(true);
    }
    setRunning(false);
  }

  const score = result?.score ?? 0;
  const scoreColor = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const scoreRing = score >= 80 ? "stroke-emerald-400" : score >= 50 ? "stroke-amber-400" : "stroke-red-400";
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-base">AI SEO Audit</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live crawl of your platform's SEO health with actionable recommendations.
            </p>
          </div>
        </div>
        <button
          onClick={runAudit}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
        >
          {running
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Play className="w-4 h-4" />}
          {running ? "Auditing…" : "Run Audit"}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Audit failed</p>
            <p className="text-xs text-amber-400/70 mt-0.5">
              Check that the API server is running and <code className="bg-amber-500/10 px-1 rounded">DATABASE_URL</code> is configured.
            </p>
          </div>
        </div>
      )}

      {/* Score visualisation */}
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Gauge */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card p-6 gap-3">
            <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8"
                className={scoreRing}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease" }} />
            </svg>
            <div className="text-center -mt-2">
              <p className={`text-3xl font-bold tabular-nums ${scoreColor}`}>{score}</p>
              <p className="text-xs text-muted-foreground">out of 100</p>
            </div>
          </div>

          {/* Pass / Fail summary */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            {[
              { label: "Passed", value: result.checks.filter((c) => c.passed).length, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
              { label: "Failed", value: result.checks.filter((c) => !c.passed).length, color: "text-red-400 bg-red-500/10 border-red-500/30" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-2xl border p-5 ${color}`}>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
                <p className="text-4xl font-bold mt-1 tabular-nums">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Check list */}
      {result && (
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Check Results</h2>
          <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40 overflow-hidden">
            {result.checks.map((check) => (
              <div key={check.id} className="flex items-start gap-4 px-5 py-4">
                {check.passed
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{check.label}</p>
                  {check.detail && <p className="text-xs text-muted-foreground mt-0.5">{check.detail}</p>}
                </div>
                <span className={`text-xs font-semibold shrink-0 ${check.passed ? "text-emerald-400" : "text-red-400"}`}>
                  {check.passed ? "PASS" : "FAIL"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Checklist preview when idle */}
      {!result && !running && !error && (
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Checks Performed</h2>
          <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40 overflow-hidden">
            {PRIORITY_CHECKS.map((check) => (
              <div key={check} className="flex items-center gap-4 px-5 py-3.5 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded border border-border shrink-0" />
                {check}
              </div>
            ))}
          </div>
          <AdminEmptyState icon={Search} title="Click &quot;Run Audit&quot; to start" description="The auditor crawls your live pages and scores each SEO signal." />
        </section>
      )}
    </div>
  );
}
