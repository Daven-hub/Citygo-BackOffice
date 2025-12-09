import { useState } from "react";
import { Search, Filter, MoreHorizontal, ArrowRight, Calendar, Clock, Users as UsersIcon, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Ride {
  id: string;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  maxPassengers: number;
  status: "pending" | "active" | "completed" | "cancelled";
  price: number;
  distance: number;
}

const rides: Ride[] = [
  { id: "1", driver: "Lionel Fotso", from: "Douala", to: "Yaoundé", date: "02/12/2024", time: "08:00", passengers: 3, maxPassengers: 4, status: "active", price: 5500, distance: 265 },
  { id: "2", driver: "Calvin Doga", from: "Yaoundé", to: "Garoua", date: "02/12/2024", time: "10:30", passengers: 2, maxPassengers: 3, status: "active", price: 2550, distance: 200 },
  { id: "3", driver: "Maxime Tsafack", from: "Douala", to: "Kribi", date: "03/12/2024", time: "14:00", passengers: 1, maxPassengers: 4, status: "pending", price: 7280, distance: 45 },
  { id: "4", driver: "Sophie Leroy", from: "Douala", to: "Limbe", date: "01/12/2024", time: "07:00", passengers: 4, maxPassengers: 4, status: "completed", price: 3250, distance: 25 },
  { id: "5", driver: "Lucas Moreau", from: "Bamenda", to: "Douala", date: "30/11/2024", time: "16:00", passengers: 0, maxPassengers: 3, status: "cancelled", price: 7180, distance: 10 }
];

const statusConfig = {
  pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  active: { label: "En cours", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Terminé", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Annulé", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Rides() {
  const navigate=useNavigate()
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRides = rides.filter(
    (ride) =>
      ride.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCard=[
    {
      libele:'En attente',
      valeur:10,
      textColor:'text-warning'
    },
    {
      libele:'En cours',
      valeur:15,
      textColor:'text-primary'
    },
    {
      libele:'Terminés (mois)',
      valeur:15,
      textColor:'text-success'
    },
    {
      libele:'Annulés (mois)',
      valeur:89,
      textColor:'text-destructive'
    }
  ]

  return (
    <>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCard?.map((x,index)=>
            <div key={index} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{x.libele}</p>
              <p className={`text-3xl font-semibold ${x.textColor} mt-1.5`}>24</p>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un trajet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button variant="outline" size="icon" className="border-border">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rides Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Conducteur</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Trajet</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date & Heure</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Passagers</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Distance</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Prix</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRides.map((ride) => (
                  <tr
                    key={ride.id}
                    className="border-b text-[.8rem] border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {ride.driver.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{ride.driver}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{ride.from}</span>
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{ride.to}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {ride.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {ride.time}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {ride.passengers}/{ride.maxPassengers}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-muted-foreground">{ride.distance} km</td>
                    <td className="py-3 px-6">
                      <span className="font-semibold text-foreground">{ride.price} FCFA</span>
                    </td>
                    <td className="py-3 px-6">
                      <Badge variant="outline" className={cn("font-medium whitespace-nowrap", statusConfig[ride.status].className)}>
                        {statusConfig[ride.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem onClick={() => navigate(`/trajets/${ride.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
