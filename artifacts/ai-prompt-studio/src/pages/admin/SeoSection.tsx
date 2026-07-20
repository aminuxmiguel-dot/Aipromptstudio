import { useEffect, useState } from "react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface AuditResult {
  score: number;
  checks: { id: string; label: string; passed: boolean; detail?: string }[];
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    : score >= 50 ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
    : "text-red-400 bg-red-500/10 border-red-500/30";
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${color}`}>
      <Globe className="w-4 h-4" />
      SEO Score: {score}/100
    </div>
  );
}

export function SeoSection() {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/seo/audit`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setAudit)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const passed = audit?.checks.filter((c) => c.passed).length ?? 0;
  const failed = audit?.checks.filter((c) => !c.passed).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Score + summary */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : error ? (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">SEO audit unavailable</p>
            <p className="text-xs text-amber-400/70 mt-0.5">
              The API server needs <code className="bg-amber-500/10 px-1 rounded">DATABASE_URL</code> to run audits.
            </p>
          </div>
        </div>
      ) : audit && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <ScoreBadge score={audit.score} />
            <a href={`${BASE}/api/seo/audit`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
              <ExternalLink className="w-3.5 h-3.5" /> Raw JSON
            </a>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Score", value: `${audit.score}/100`, color: "text-primary" },
              { label: "Passed checks", value: passed, color: "text-emerald-400" },
              { label: "Failed checks", value: failed, color: "text-red-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl border border-border/50 bg-card p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
                <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Check list */}
          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Audit Checks</h2>
            <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40 overflow-hidden">
              {audit.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-4 px-5 py-4">
                  {check.passed
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{check.label}</p>
                    {check.detail && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{check.detail}</p>
                    )}
                  </div>
                  <span className={`ml-auto text-xs font-semibold shrink-0 ${check.passed ? "text-emerald-400" : "text-red-400"}`}>
                    {check.passed ? "PASS" : "FAIL"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {!loading && !error && !audit && (
        <AdminEmptyState icon={Globe} title="No SEO audit data" description="Run the API server to generate an audit." />
      )}
    </div>
  );
}
