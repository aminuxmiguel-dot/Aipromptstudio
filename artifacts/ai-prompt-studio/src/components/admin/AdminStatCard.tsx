import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  trend?: { value: number; label: string };
  loading?: boolean;
}

export function AdminStatCard({ icon: Icon, label, value, sub, accent, trend, loading }: Props) {
  if (loading) return <Skeleton className="h-[130px] rounded-2xl" />;

  return (
    <div
      className={`rounded-2xl border p-5 space-y-3 transition-colors ${
        accent
          ? "border-primary/40 bg-primary/5 hover:bg-primary/8"
          : "border-border/50 bg-card hover:border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          <Icon className="w-4 h-4" />
          {label}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.value >= 0
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
