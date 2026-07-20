import type { LucideIcon } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminEmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      {Icon && (
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground/50">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground/60 max-w-xs">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
