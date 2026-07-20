import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Newspaper, Copy, ExternalLink, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const VERIFICATION_SERVICES = [
  { name: "Google Search Console", placeholder: "google-site-verification content value", docs: "https://search.google.com/search-console" },
  { name: "Bing Webmaster", placeholder: "msvalidate.01 content value", docs: "https://www.bing.com/webmasters" },
  { name: "Google Analytics ID", placeholder: "G-XXXXXXXXXX", docs: "https://analytics.google.com" },
  { name: "Microsoft Clarity", placeholder: "Clarity project ID", docs: "https://clarity.microsoft.com" },
  { name: "Google AdSense", placeholder: "ca-pub-XXXXXXXXXXXXXXXX", docs: "https://www.google.com/adsense" },
];

const QUICK_LINKS = [
  { label: "robots.txt", href: `${BASE}/api/robots.txt`, desc: "Auto-generated robots file" },
  { label: "sitemap.xml", href: `${BASE}/sitemap.xml`, desc: "Sitemap (not yet implemented)" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
    >
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function IndexingSection() {
  return (
    <div className="space-y-8">
      {/* Status notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary text-sm">
        <Newspaper className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Indexing Center</p>
          <p className="text-xs text-primary/70 mt-0.5">
            Configure your robots.txt, sitemap, and search engine verification codes. Full config persistence requires <code className="bg-primary/10 px-1 rounded">DATABASE_URL</code>.
          </p>
        </div>
      </div>

      {/* Quick access */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Generated Files</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map(({ label, href, desc }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all">
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </section>

      {/* Verification codes */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Verification Codes
        </h2>
        <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40 overflow-hidden">
          {VERIFICATION_SERVICES.map(({ name, placeholder, docs }) => (
            <div key={name} className="px-5 py-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{name}</p>
                <a href={docs} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                  <ExternalLink className="w-3 h-3" /> Docs
                </a>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={placeholder}
                  className="flex-1 rounded-xl border border-border/60 bg-background px-3 py-2 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
                <CopyButton text="" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 pl-1">
          ⚠ Saving verification codes to the database requires <code className="bg-muted px-1 rounded">DATABASE_URL</code> to be configured.
        </p>
      </section>

      <AdminEmptyState icon={Newspaper}
        title="Robots.txt & Sitemap auto-generation"
        description="Toggle-based auto-generation for robots.txt and sitemap.xml will be configurable here once the database is connected." />
    </div>
  );
}
