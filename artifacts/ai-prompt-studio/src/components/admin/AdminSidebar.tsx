import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Sparkles, Globe, Search, Newspaper,
  Megaphone, ChevronLeft, ChevronRight, Zap,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const NAV = [
  { id: "overview",  label: "Overview",       icon: LayoutDashboard, href: `${BASE}/admin` },
  { id: "prompts",   label: "Prompt Manager",  icon: Sparkles,        href: `${BASE}/admin/prompts` },
  { id: "seo",       label: "SEO Center",      icon: Globe,           href: `${BASE}/admin/seo` },
  { id: "ai-seo",   label: "AI SEO Audit",    icon: Search,          href: `${BASE}/admin/ai-seo` },
  { id: "indexing",  label: "Indexing",        icon: Newspaper,       href: `${BASE}/admin/indexing` },
  { id: "ads",       label: "Ads Center",      icon: Megaphone,       href: `${BASE}/admin/ads` },
];

interface Props { collapsed: boolean; onToggle: () => void; }

export function AdminSidebar({ collapsed, onToggle }: Props) {
  const [location] = useLocation();

  return (
    <aside
      className={`relative flex flex-col bg-card border-r border-border/50 transition-all duration-300 shrink-0 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-border/40 ${collapsed ? "justify-center" : ""}`}>
        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold leading-none truncate">AI Prompt Studio</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon, href }) => {
          const stripped = href.replace(BASE, "") || "/";
          const active =
            id === "overview"
              ? location === "/" || location === "/admin" || location === `${BASE}/admin`
              : location.startsWith(stripped);

          return (
            <Link key={id} href={stripped}>
              <a
                title={collapsed ? label : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-primary" : ""}`} />
                {!collapsed && <span className="truncate">{label}</span>}
                {active && !collapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${collapsed ? "justify-center" : ""}`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>
          )}
        </button>
      </div>
    </aside>
  );
}
