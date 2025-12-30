import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Ride {
  id: string;
  driver: string;
  from: string;
  to: string;
  date: string;
  passengers: number;
  maxPassengers: number;
  status: "active" | "completed" | "cancelled";
  price: number;
}

const recentRides: Ride[] = [
  {
    id: "1",
    driver: "Maxime Tsafack",
    from: "Douala",
    to: "Yaounde",
    date: "02/12/2025",
    passengers: 3,
    maxPassengers: 4,
    status: "active",
    price: 3500,
  },
  {
    id: "2",
    driver: "Lionel Fotso",
    from: "Douala",
    to: "Yaounde",
    date: "02/12/2025",
    passengers: 2,
    maxPassengers: 3,
    status: "completed",
    price: 5000,
  },
  {
    id: "3",
    driver: "Gustave Arow",
    from: "Bafang",
    to: "Douala",
    date: "01/12/2024",
    passengers: 1,
    maxPassengers: 4,
    status: "active",
    price: 4800,
  },
  {
    id: "4",
    driver: "Sophie Menoche",
    from: "Bagangte",
    to: "Yaounde",
    date: "01/12/2024",
    passengers: 4,
    maxPassengers: 4,
    status: "completed",
    price: 7200,
  },
  {
    id: "5",
    driver: "Lucas Moreau",
    from: "Dchang",
    to: "Bamenda",
    date: "30/11/2024",
    passengers: 0,
    maxPassengers: 3,
    status: "cancelled",
    price: 5000,
  },
];

const statusConfig = {
  active: { label: "En cours", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Terminé", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Annulé", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function RecentRidesTable() {
  return (
    <div className="rounded-[6px] border border-border bg-card overflow-hidden animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Trajets récents</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Conducteur</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Trajet</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Passagers</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Prix</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Statut</th>
            </tr>
          </thead>
          <tbody>
            {recentRides.map((ride, index) => (
              <tr 
                key={ride.id} 
                className="border-b text-sm border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
              >
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {ride.driver.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{ride.driver}</span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground">{ride.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground">{ride.to}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-sm text-muted-foreground">{ride.date}</td>
                <td className="py-3 px-6">
                  <span className="text-sm text-foreground">
                    {ride.passengers}/{ride.maxPassengers}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <span className="text-sm font-semibold text-foreground">{ride.price} FCFA</span>
                </td>
                <td className="py-3 px-6">
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium whitespace-nowrap", statusConfig[ride.status].className)}
                  >
                    {statusConfig[ride.status].label}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
