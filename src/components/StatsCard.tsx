import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?:string;
  trend?: { value: number; isPositive: boolean };
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  trend,
  icon: Icon,
  className,
  delay = 0,
}: StatsCardProps) {
  const displayChange = change || (trend ? `${trend.isPositive ? "+" : "-"}${trend.value}%` : undefined);
  const displayChangeType = changeType !== "neutral" ? changeType : (trend ? (trend.isPositive ? "positive" : "negative") : "neutral");
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[6px] border border-border bg-white px-6 py-3.5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg group animate-slide-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-0">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="w-10 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-black/55 text-foreground tracking-tight">{value}</h3>
          {displayChange && (
            <p
              className={cn(
                "text-xs font-medium",
                displayChangeType === "positive" && "text-success",
                displayChangeType === "negative" && "text-destructive",
                displayChangeType === "neutral" && "text-muted-foreground"
              )}
            >
              {displayChange}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
