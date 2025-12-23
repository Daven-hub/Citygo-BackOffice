import { Users, UserCheck, UserPlus, Car, Clock, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { useAppDispatch } from "@/store/hook";
import { AnalyticsUser } from "@/store/slices/user.slice";
import { useToast } from "@/hook/use-toast";

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  verifiedDrivers: number;
  pendingDriverApplications: number;
}

interface UserStatsOverviewProps {
  stats: UserStats;
  periode: string;
  setPeriode: (value: string) => void;
}

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "primary" | "success" | "warning" | "info";
  delay: number;
}

function StatItem({ icon: Icon, label, value, color, delay }: StatItemProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-blue-500/10 text-blue-500"
  };

  return (
    <div 
      className="flex items-center gap-4 px-3 py-3 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorClasses[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-secondary">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function UserStatOverview({ stats, periode, setPeriode }: UserStatsOverviewProps) {
    const [loading,setLoading]=useState(false)
    const dispatch=useAppDispatch()
    const {toast}=useToast()
//   const periodLabels: Record<string, string> = {
//     WEEK: "cette semaine",
//     MONTH: "ce mois",
//     QUARTER: "ce trimestre",
//     YEAR: "cette année"
//   };

const handleChangePeriode = async (value: string) => {
  setLoading(true);
  try {
    await dispatch(AnalyticsUser(value)).unwrap();
    setPeriode(value);
  } catch (error) {
    toast({
      title: "error",
      description: error?.toString(),
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div
  className="relative rounded-xl border border-border bg-card p-6 animate-slide-up"
  style={{ animationDelay: "100ms" }}
>
  {/* 🔄 Loader overlay */}
  {loading && (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/20 backdrop-blur-xs">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )}

  {/* Contenu */}
  <div className={loading ? "pointer-events-none opacity-60" : ""}>
    <div className="mb-5 flex justify-between items-center">
      <h3 className="text-xl font-medium text-foreground">
        Aperçu des utilisateurs
      </h3>

      <Select value={periode} onValueChange={handleChangePeriode}>
        <SelectTrigger className="w-full md:w-fit border-border text-foreground">
          <Filter className="h-3 w-3 mr-1.5 text-muted-foreground" />
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent className="border-border">
          <SelectItem value="DAY" className="text-terciary">Jours</SelectItem>
          <SelectItem value="WEEK" className="text-terciary">Weekend</SelectItem>
          <SelectItem value="MONTH" className="text-terciary">Mois</SelectItem>
          <SelectItem value="YEAR" className="text-terciary">Année</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatItem icon={Users} label="Total utilisateurs" value={stats.totalUsers} color="primary" delay={150} />
      <StatItem icon={UserCheck} label="Utilisateurs actifs" value={stats.activeUsers} color="success" delay={200} />
      <StatItem icon={UserPlus} label="Nouvelles inscriptions" value={stats.newRegistrations} color="info" delay={250} />
      <StatItem icon={Car} label="Conducteurs vérifiés" value={stats.verifiedDrivers} color="warning" delay={300} />
      <StatItem icon={Clock} label="Demandes en attente" value={stats.pendingDriverApplications} color="primary" delay={350} />
    </div>
  </div>
</div>
  );
}
