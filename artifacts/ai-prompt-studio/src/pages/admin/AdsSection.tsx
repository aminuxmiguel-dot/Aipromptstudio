import { useState } from "react";
import { Megaphone, ToggleLeft, ToggleRight, Info } from "lucide-react";

const AD_SLOTS = [
  { id: "header",  label: "Header Banner",   desc: "Leaderboard ad above the navigation bar" },
  { id: "sidebar", label: "Sidebar Rectangle", desc: "300×250 ad in the tool page sidebar" },
  { id: "content", label: "In-Content Ad",    desc: "728×90 ad after the hero section" },
  { id: "footer",  label: "Footer Banner",    desc: "Full-width ad above the footer" },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="transition-colors">
      {enabled
        ? <ToggleRight className="w-7 h-7 text-primary" />
        : <ToggleLeft className="w-7 h-7 text-muted-foreground/50" />}
    </button>
  );
}

export function AdsSection() {
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const [slots, setSlots] = useState<Record<string, boolean>>(
    Object.fromEntries(AD_SLOTS.map((s) => [s.id, false]))
  );
  const [scripts, setScripts] = useState<Record<string, string>>(
    Object.fromEntries(AD_SLOTS.map((s) => [s.id, ""]))
  );

  function toggleSlot(id: string) {
    setSlots((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-8">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary text-sm">
        <Megaphone className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Ads Center</p>
          <p className="text-xs text-primary/70 mt-0.5">
            Toggle and configure ad slots per placement. Set your AdSense publisher ID via{" "}
            <code className="bg-primary/10 px-1 rounded">VITE_ADSENSE_PUBLISHER_ID</code> environment variable.
          </p>
        </div>
      </div>

      {/* Global toggle */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Global Control</h2>
        <div className="flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-card">
          <div>
            <p className="font-semibold text-sm">Enable Ads Globally</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Master switch — disabling this hides all ad slots site-wide regardless of per-slot settings.
            </p>
          </div>
          <Toggle enabled={globalEnabled} onToggle={() => setGlobalEnabled(!globalEnabled)} />
        </div>
      </section>

      {/* Per-slot config */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Ad Slot Configurator</h2>
        <div className="space-y-4">
          {AD_SLOTS.map(({ id, label, desc }) => (
            <div
              key={id}
              className={`rounded-2xl border bg-card p-5 space-y-4 transition-colors ${
                slots[id] && globalEnabled ? "border-primary/40" : "border-border/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <Toggle
                  enabled={slots[id]}
                  onToggle={() => toggleSlot(id)}
                />
              </div>

              {slots[id] && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> Ad script / HTML
                  </label>
                  <textarea
                    rows={3}
                    value={scripts[id]}
                    onChange={(e) => setScripts((prev) => ({ ...prev, [id]: e.target.value }))}
                    placeholder={`<!-- Paste your ${label} ad code here -->`}
                    className="w-full rounded-xl border border-border/60 bg-background px-3 py-2.5 text-xs font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 pl-1">
          ⚠ Slot configuration persistence requires <code className="bg-muted px-1 rounded">DATABASE_URL</code>. Changes here are in-memory only.
        </p>
      </section>
    </div>
  );
}
