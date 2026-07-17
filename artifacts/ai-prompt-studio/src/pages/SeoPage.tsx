import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Globe, FileText, Search, ExternalLink, Code } from "lucide-react";

interface PageAudit {
  path: string;
  title: string;
  description: string;
  hasCanonical: boolean;
  hasOgTags: boolean;
  hasStructuredData: boolean;
  priority: number;
}

interface SeoChecks {
  robotsTxt: boolean;
  sitemap: boolean;
  canonicalUrls: boolean;
  ogTags: boolean;
  twitterCards: boolean;
  structuredData: boolean;
  httpsEnabled: boolean;
  mobileFriendly: boolean;
  fontPreload: boolean;
  compression: boolean;
}

interface SeoAudit {
  siteUrl: string;
  robotsTxtUrl: string;
  sitemapUrl: string;
  overallScore: number;
  pages: PageAudit[];
  structuredDataExample: Record<string, unknown>;
  checks: SeoChecks;
}

function CheckRow({ label, passing }: { label: string; passing: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
      <span className="text-sm text-foreground">{label}</span>
      {passing ? (
        <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
          <CheckCircle className="w-4 h-4" /> Pass
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-destructive text-xs font-medium">
          <XCircle className="w-4 h-4" /> Fail
        </span>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-destructive";
  return (
    <div className={`text-5xl font-extrabold tracking-tight ${color}`}>
      {score}<span className="text-2xl font-normal text-muted-foreground">/100</span>
    </div>
  );
}

export default function SeoPage() {
  useSEO({
    title: "SEO Center | AI Prompt Studio",
    description:
      "Live SEO audit dashboard for AI Prompt Studio — robots.txt, sitemap, structured data, and meta-tag health checks.",
    ogType: "website",
  });
  usePageAnalytics({ eventType: "page_view" });

  const [audit, setAudit] = useState<SeoAudit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    fetch(`${base}/api/seo/audit`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setAudit(data as SeoAudit); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted/10 border-b border-border/40 pb-8 pt-10">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-3 text-primary text-xs font-semibold uppercase tracking-wider">
              <Search className="w-3.5 h-3.5" />
              SEO Center
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              SEO Health Dashboard
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Live audit of the platform's search engine optimisation — crawlability, metadata completeness, and structured data coverage.
            </p>
          </div>
        </div>

        <div className="container max-w-screen-xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left: Score + Checks */}
            <div className="space-y-6 lg:col-span-1">
              {/* Overall Score */}
              <div className="rounded-2xl border border-border/50 bg-card p-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Overall SEO Score</p>
                {loading ? <Skeleton className="h-14 w-24 mx-auto" /> : <ScoreBadge score={audit?.overallScore ?? 0} />}
                <p className="text-xs text-muted-foreground">Based on technical SEO checklist</p>
              </div>

              {/* Technical Checks */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h2 className="font-semibold text-base mb-3">Technical Checks</h2>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : audit?.checks ? (
                  <>
                    <CheckRow label="robots.txt present" passing={audit.checks.robotsTxt} />
                    <CheckRow label="XML Sitemap" passing={audit.checks.sitemap} />
                    <CheckRow label="Canonical URLs" passing={audit.checks.canonicalUrls} />
                    <CheckRow label="Open Graph tags" passing={audit.checks.ogTags} />
                    <CheckRow label="Twitter Cards" passing={audit.checks.twitterCards} />
                    <CheckRow label="JSON-LD Structured Data" passing={audit.checks.structuredData} />
                    <CheckRow label="HTTPS enabled" passing={audit.checks.httpsEnabled} />
                    <CheckRow label="Mobile-friendly" passing={audit.checks.mobileFriendly} />
                    <CheckRow label="Font preload hints" passing={audit.checks.fontPreload} />
                    <CheckRow label="HTTP compression (gzip)" passing={audit.checks.compression} />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Could not load audit data.</p>
                )}
              </div>

              {/* Quick Links */}
              <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
                <h2 className="font-semibold text-base">Crawl Files</h2>
                {loading ? <Skeleton className="h-20 w-full" /> : (
                  <>
                    <a href={audit?.robotsTxtUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm group">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />robots.txt</span>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                    <a href={audit?.sitemapUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm group">
                      <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" />sitemap.xml</span>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Right: Pages + Structured Data */}
            <div className="space-y-6 lg:col-span-2">
              {/* Page Audit Table */}
              <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40">
                  <h2 className="font-semibold text-base">Page Metadata Coverage</h2>
                </div>
                {loading ? (
                  <div className="p-6 space-y-3">
                    {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/20">
                          <th className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">Path</th>
                          <th className="text-center px-3 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">OG</th>
                          <th className="text-center px-3 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">Schema</th>
                          <th className="text-center px-3 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(audit?.pages ?? []).map((page) => (
                          <tr key={page.path} className="border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] truncate">{page.path}</td>
                            <td className="px-3 py-3 text-center">
                              {page.hasOgTags ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {page.hasStructuredData ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <Badge variant="outline" className="text-xs font-mono">{page.priority}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Structured Data Preview */}
              <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-base">JSON-LD Structured Data (Site)</h2>
                </div>
                {loading ? <Skeleton className="m-6 h-48" /> : (
                  <pre className="p-6 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed">
                    {JSON.stringify(audit?.structuredDataExample, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
