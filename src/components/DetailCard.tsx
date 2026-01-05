import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DetailCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "warning" | "danger";
}

const variantStyles = {
  default: "bg-card border-border",
  highlight: "bg-primary/5 border-primary/20",
  warning: "bg-warning/5 border-warning/20",
  danger: "bg-destructive/5 border-destructive/20",
};

export function DetailCard({ title, icon, children, className, variant = "default" }: DetailCardProps) {
  return (
    <Card className={cn("border", variantStyles[variant], className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface InfoRowProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function InfoRow({ label, value, icon, className }: InfoRowProps) {
  return (
    <div className={cn("p-3 rounded-lg bg-muted/30 border border-border/50", className)}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="font-medium text-foreground flex items-center gap-2">
        {icon}
        {value}
      </div>
    </div>
  );
}

interface StatBoxProps {
  label: string;
  value: string | number;
  variant?: "primary" | "success" | "warning" | "danger" | "muted";
}

const statVariantStyles = {
  primary: "bg-primary/5 border-primary/10 text-primary",
  success: "bg-success/5 border-success/10 text-success",
  warning: "bg-warning/5 border-warning/10 text-warning",
  danger: "bg-destructive/5 border-destructive/10 text-destructive",
  muted: "bg-muted/30 border-border text-foreground",
};

export function StatBox({ label, value, variant = "muted" }: StatBoxProps) {
  return (
    <div className={cn("p-3 rounded-xl border text-center", statVariantStyles[variant])}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
