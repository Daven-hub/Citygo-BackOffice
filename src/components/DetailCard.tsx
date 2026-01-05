import { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { documentTypeConfig } from "@/data/mockKYC";
import { Button } from "./ui/button";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Document } from "@/store/slices/document.slice";

interface DetailCardProps {
  title: string;
  icon?: ReactNode;
  docs?:Document;
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

export function DetailCard({ title,docs, icon, children, className, variant = "default" }: DetailCardProps) {
  const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);
  return (
    <Card className={cn("border", variantStyles[variant], className)}>
      <CardHeader className="flex max-md:px-2.5 max-md:pt-3 pb-0 justify-between">
        <CardTitle className="justify-between flex gap-3 max-md:flex-col">
          <div className="text-xl font-semibold flex items-center gap-2 text-foreground">
          {icon}
          {title}
          </div>
          {/* <div className="flex items-center">
                      <p className="text-sm text-muted-foreground">{documentTypeConfig[docs?.type]?.label}</p>
                      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        <Button variant="ghost" size="icon" onClick={() => setZoom(prev => Math.max(prev - 25, 50))} className="h-8 w-8">
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-medium px-2 min-w-[40px] text-center">{zoom}%</span>
                        <Button variant="ghost" size="icon" onClick={() => setZoom(prev => Math.min(prev + 25, 200))} className="h-8 w-8">
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setRotation(prev => (prev + 90) % 360)} className="h-8 w-8">
                          <RotateCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div> */}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-md:pt-2.5">{children}</CardContent>
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
    <div className={cn("px-3 py-2 rounded-lg bg-muted/30 border border-border/50", className)}>
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
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
