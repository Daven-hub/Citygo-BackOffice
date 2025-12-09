import { useState } from "react";
import { Search, MapPin, TrendingUp, TrendingDown, Users } from "lucide-react";
// import { AdminLayout } from "@/layouts/AdminLayout";
// import { AdminHeader } from "@/components/admin/AdminHeader";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Destination {
  id: string;
  city: string;
  region: string;
  totalRides: number;
  activeRides: number;
  users: number;
  trend: "up" | "down" | "stable";
  trendValue: string;
}

const destinations: Destination[] = [
  { id: "1", city: "Paris", region: "Île-de-France", totalRides: 28400, activeRides: 342, users: 8540, trend: "up", trendValue: "+12%" },
  { id: "2", city: "Lyon", region: "Auvergne-Rhône-Alpes", totalRides: 19200, activeRides: 186, users: 4820, trend: "up", trendValue: "+8%" },
  { id: "3", city: "Marseille", region: "Provence-Alpes-Côte d'Azur", totalRides: 16500, activeRides: 158, users: 3920, trend: "up", trendValue: "+5%" },
  { id: "4", city: "Bordeaux", region: "Nouvelle-Aquitaine", totalRides: 14200, activeRides: 134, users: 3210, trend: "stable", trendValue: "+1%" },
  { id: "5", city: "Toulouse", region: "Occitanie", totalRides: 11800, activeRides: 112, users: 2890, trend: "up", trendValue: "+7%" },
  { id: "6", city: "Lille", region: "Hauts-de-France", totalRides: 10400, activeRides: 98, users: 2540, trend: "down", trendValue: "-3%" },
  { id: "7", city: "Nice", region: "Provence-Alpes-Côte d'Azur", totalRides: 9800, activeRides: 87, users: 2180, trend: "up", trendValue: "+4%" },
  { id: "8", city: "Nantes", region: "Pays de la Loire", totalRides: 8600, activeRides: 76, users: 1920, trend: "up", trendValue: "+6%" },
  { id: "9", city: "Strasbourg", region: "Grand Est", totalRides: 7400, activeRides: 64, users: 1680, trend: "stable", trendValue: "0%" },
  { id: "10", city: "Montpellier", region: "Occitanie", totalRides: 6800, activeRides: 58, users: 1540, trend: "up", trendValue: "+9%" },
  { id: "11", city: "Rennes", region: "Bretagne", totalRides: 5900, activeRides: 48, users: 1320, trend: "up", trendValue: "+11%" },
  { id: "12", city: "Grenoble", region: "Auvergne-Rhône-Alpes", totalRides: 5200, activeRides: 42, users: 1180, trend: "down", trendValue: "-2%" },
];

export default function Destinations() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* <AdminHeader
        title="Destinations"
        subtitle="Visualisez les destinations les plus populaires"
      /> */}

      <div className="space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDestinations.map((dest, index) => (
            <div
              key={dest.id}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{dest.city}</h3>
                    <p className="text-sm text-muted-foreground">{dest.region}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    dest.trend === "up" && "bg-success/10 text-success",
                    dest.trend === "down" && "bg-destructive/10 text-destructive",
                    dest.trend === "stable" && "bg-muted text-muted-foreground"
                  )}
                >
                  {dest.trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {dest.trend === "down" && <TrendingDown className="w-3 h-3" />}
                  {dest.trendValue}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total trajets</p>
                  <p className="text-lg font-bold text-foreground">{dest.totalRides.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Actifs</p>
                  <p className="text-lg font-bold text-primary">{dest.activeRides}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Utilisateurs</p>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-lg font-bold text-foreground">{dest.users.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
