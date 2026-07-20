import { RefreshCw, LogOut, Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";

interface Props {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  onLogout: () => void;
}

export function AdminHeader({ title, subtitle, onRefresh, refreshing, onLogout }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-6 py-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Notification stub */}
        <button className="relative h-9 w-9 rounded-xl border border-border/50 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-xl border border-border/50 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border/50 bg-card text-sm font-medium text-muted-foreground hover:text-foreground transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}

        {/* Sign out */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border/50 bg-card text-sm font-medium text-muted-foreground hover:text-red-400 hover:border-red-500/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
