import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Calendar, Car, MapPin, CreditCard, Star, Activity, TrendingUp, Clock, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { UserType } from "@/store/slices/user.slice";
import dayjs from "dayjs";

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType;
}

const roleConfig = {
  driver: { label: "Conducteur", className: "bg-primary/10 text-primary border-primary/20" },
  passenger: { label: "Passager", className: "bg-secondary text-secondary-foreground border-border" },
  both: { label: "Les deux", className: "bg-accent/10 text-accent border-accent/20" },
};

const statusConfig = {
  active: { label: "Actif", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactif", className: "bg-muted text-muted-foreground border-border" },
  suspended: { label: "Suspendu", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const userActivities = [
  { id: "1", type: "ride", description: "Trajet Paris → Lyon complété", date: "02/12/2024", amount: "+25.00 €" },
  { id: "2", type: "booking", description: "Réservation confirmée Marseille → Nice", date: "01/12/2024", amount: "-18.50 €" },
  { id: "3", type: "review", description: "Note reçue: ★★★★★", date: "30/11/2024", amount: null },
  { id: "4", type: "ride", description: "Trajet Bordeaux → Toulouse annulé", date: "28/11/2024", amount: "Remboursé" },
  { id: "5", type: "payment", description: "Paiement reçu", date: "25/11/2024", amount: "+45.00 €" },
];

const userTransactions = [
  { id: "T001", type: "payment", amount: 25.00, date: "02/12/2024", status: "completed" },
  { id: "T002", type: "refund", amount: -18.50, date: "01/12/2024", status: "completed" },
  { id: "T003", type: "payout", amount: 120.00, date: "28/11/2024", status: "pending" },
  { id: "T004", type: "commission", amount: -5.00, date: "25/11/2024", status: "completed" },
];

const userBookings = [
  { id: "B001", from: "Paris", to: "Lyon", date: "05/12/2024", status: "confirmed", seats: 2 },
  { id: "B002", from: "Marseille", to: "Nice", date: "10/12/2024", status: "pending", seats: 1 },
  { id: "B003", from: "Bordeaux", to: "Toulouse", date: "28/11/2024", status: "cancelled", seats: 3 },
];

const bookingStatusConfig = {
  confirmed: { label: "Confirmée", className: "bg-primary/10 text-primary border-primary/20" },
  pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  cancelled: { label: "Annulée", className: "bg-destructive/10 text-destructive border-destructive/20" },
  completed: { label: "Terminée", className: "bg-success/10 text-success border-success/20" },
};

export function UserDetailModal({ open, onOpenChange, user }: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleViewFullDetail = () => {
    onOpenChange(false);
    navigate(`/users/${user.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                {user.displayName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl text-foreground">{user.displayName}</DialogTitle>
              <DialogDescription className="flex items-center gap-3 mt-1">
                <Badge variant="outline" className={cn("font-medium", roleConfig[user.roles?.join('')].className)}>
                  {roleConfig[user.roles?.join('')].label}
                </Badge>
                <Badge variant="outline" className={cn("font-medium", statusConfig[user.status].className)}>
                  {statusConfig[user.status].label}
                </Badge>
              </DialogDescription>
            </div>
            <div className="text-right mr-5">
              <div className="flex items-center gap-1 text-warning">
                <Star className="w-5 h-5 fill-warning" />
                <span className="text-xl font-bold text-foreground">4.5</span>
              </div>
              <span className="text-xs text-muted-foreground">10 trajets</span>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full border grid-cols-4 bg-muted/30">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[400px] mt-4 pr-2">
            <TabsContent value="overview" className="space-y-4 mt-0">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Téléphone</span>
                  </div>
                  <p className="font-medium text-foreground">{user.phone}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <Car className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xl font-bold text-foreground">10</p>
                  <span className="text-xs text-muted-foreground">Trajets</span>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <CreditCard className="w-6 h-6 mx-auto text-success mb-2" />
                  <p className="text-xl font-bold text-foreground">{(10 * 18.5).toFixed(0)} FCFA</p>
                  <span className="text-xs text-muted-foreground">Total dépensé</span>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <Calendar className="w-6 h-6 mx-auto text-accent mb-2" />
                  <p className="text-xl font-bold text-foreground">{dayjs(user.createdAt).format('YYYY-MM-DD')}</p>
                  <span className="text-xs text-muted-foreground">Inscrit le</span>
                </div>
              </div>

              {/* Performance */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Performance
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Taux de complétion</span>
                      <span className="text-foreground font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Ponctualité</span>
                      <span className="text-foreground font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="text-foreground font-medium">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activities" className="space-y-3 mt-0">
              {userActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{activity.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {activity.date}
                      </div>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className={cn(
                      "font-medium",
                      activity.amount.startsWith("+") ? "text-success" : 
                      activity.amount.startsWith("-") ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {activity.amount}
                    </span>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="transactions" className="space-y-3 mt-0">
              {userTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      tx.type === "payment" ? "bg-success/10" : 
                      tx.type === "refund" ? "bg-destructive/10" : "bg-primary/10"
                    )}>
                      <CreditCard className={cn(
                        "w-5 h-5",
                        tx.type === "payment" ? "text-success" : 
                        tx.type === "refund" ? "text-destructive" : "text-primary"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">{tx.type}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{tx.id}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "font-bold",
                      tx.amount > 0 ? "text-success" : "text-destructive"
                    )}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)} €
                    </span>
                    <Badge variant="outline" className={cn(
                      "ml-2 text-xs",
                      tx.status === "completed" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                    )}>
                      {tx.status === "completed" ? "Complété" : "En attente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="bookings" className="space-y-3 mt-0">
              {userBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{booking.id}</span>
                    <Badge variant="outline" className={cn("font-medium", bookingStatusConfig[booking.status].className)}>
                      {bookingStatusConfig[booking.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="w-0.5 h-6 bg-border" />
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{booking.from}</p>
                      <p className="font-medium text-foreground mt-2">{booking.to}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-sm">{booking.date}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{booking.seats} place(s)</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleViewFullDetail} className="border-border gap-2">
            <ExternalLink className="w-4 h-4" />
            Voir détails complets
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Fermer
            </Button>
            <Button className="gradient-primary text-primary-foreground">
              Modifier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
