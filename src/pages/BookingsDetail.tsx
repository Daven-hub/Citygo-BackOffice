import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  MapPin,
  CreditCard,
  Star,
  Users,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

const statusConfig = {
  pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  confirmed: { label: "Confirmée", className: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
  completed: { label: "Terminée", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  cancelled: { label: "Annulée", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

// Mock booking data
const mockBookingDetails = {
  BK001: {
    id: "BK001",
    passenger: { name: "Jean Dupont", email: "jean.dupont@email.com", phone: "+33 6 12 34 56 78", rating: 4.5, totalRides: 23 },
    driver: { name: "Marie Martin", email: "marie.martin@email.com", phone: "+33 6 98 76 54 32", rating: 4.8, totalRides: 156, vehicle: "Peugeot 308 Grise" },
    from: { city: "Paris", address: "15 Rue de Rivoli, 75001 Paris" },
    to: { city: "Lyon", address: "Place Bellecour, 69002 Lyon" },
    date: "2024-12-15",
    time: "08:00",
    seats: 2,
    price: 45,
    serviceFee: 4.5,
    totalPrice: 49.5,
    status: "confirmed" as const,
    paymentMethod: "Carte Visa ****4242",
    paymentStatus: "paid",
    distance: 465,
    duration: "4h 30min",
    createdAt: "2024-12-10T14:30:00Z",
    notes: "Bagages volumineux acceptés. Point de rendez-vous devant la gare.",
  }
};

export default function BookingsDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"cancel" | "confirm" | null>(null);

  const booking = mockBookingDetails[bookingId as keyof typeof mockBookingDetails] || mockBookingDetails.BK001;

  if (!booking) {
    return (
      <>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Réservation non trouvée</h2>
            <Button variant="outline" onClick={() => navigate("/reservations")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleAction = (action: "cancel" | "confirm") => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const executeAction = () => {
    toast({
      title: confirmAction === "cancel" ? "Réservation annulée" : "Réservation confirmée",
      description: `La réservation ${booking.id} a été mise à jour.`,
    });
    setConfirmOpen(false);
  };

  const StatusIcon = statusConfig[booking.status].icon;

  return (
    <>
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate("/reservations")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux réservations
        </Button>

        {/* Header Card */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">#{booking.id}</h2>
                  <Badge variant="outline" className={cn("font-medium", statusConfig[booking.status].className)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig[booking.status].label}
                  </Badge>
                </div>
                <p className="text-muted-foreground">Créée le {formatDateTime(booking.createdAt)}</p>
              </div>
                {(booking.status === "pending" || booking.status === "confirmed") && (
                <div className="flex gap-2">
                  {(booking.status as string) === "pending" && (
                    <Button 
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => handleAction("confirm")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirmer
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => handleAction("cancel")}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  Détails du trajet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <div className="w-0.5 h-20 bg-border" />
                    <div className="w-3 h-3 rounded-full bg-accent" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <p className="font-semibold text-foreground text-lg">{booking.from.city}</p>
                      <p className="text-muted-foreground">{booking.from.address}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">{booking.to.city}</p>
                      <p className="text-muted-foreground">{booking.to.address}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{formatDate(booking.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Heure</p>
                      <p className="font-medium text-foreground">{booking.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium text-foreground">{booking.distance} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Durée</p>
                      <p className="font-medium text-foreground">{booking.duration}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger & Driver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Passenger */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <User className="w-5 h-5 text-primary" />
                    Passager
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {booking.passenger.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{booking.passenger.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="text-sm text-muted-foreground">{booking.passenger.rating} • {booking.passenger.totalRides} trajets</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{booking.passenger.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{booking.passenger.phone}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/users/${booking.passenger.name.toLowerCase().replace(" ", "-")}`)}>
                    Voir le profil
                  </Button>
                </CardContent>
              </Card>

              {/* Driver */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Car className="w-5 h-5 text-accent" />
                    Conducteur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                        {booking.driver.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{booking.driver.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="text-sm text-muted-foreground">{booking.driver.rating} • {booking.driver.totalRides} trajets</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{booking.driver.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{booking.driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{booking.driver.vehicle}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/users/${booking.driver.name.toLowerCase().replace(" ", "-")}`)}>
                    Voir le profil
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            {booking.notes && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground bg-muted/30 p-4 rounded-lg">{booking.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Places réservées</span>
                  <span className="font-medium text-foreground">{booking.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix par place</span>
                  <span className="font-medium text-foreground">{booking.price / booking.seats} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium text-foreground">{booking.price} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frais de service</span>
                  <span className="font-medium text-foreground">{booking.serviceFee} €</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary text-xl">{booking.totalPrice} €</span>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Méthode de paiement</p>
                  <p className="font-medium text-foreground">{booking.paymentMethod}</p>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 w-full justify-center py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Payé
                </Badge>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  Récapitulatif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Réservation</span>
                  <span className="font-mono text-foreground">{booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Places</span>
                  <span className="text-foreground">{booking.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="text-foreground">{booking.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durée estimée</span>
                  <span className="text-foreground">{booking.duration}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={executeAction}
        title={confirmAction === "cancel" ? "Annuler la réservation ?" : "Confirmer la réservation ?"}
        description={confirmAction === "cancel" 
          ? "Cette action annulera la réservation. Le passager sera notifié et remboursé si applicable."
          : "Cette action confirmera la réservation. Les deux parties seront notifiées."}
        variant={confirmAction === "cancel" ? "danger" : "success"}
        confirmText={confirmAction === "cancel" ? "Annuler" : "Confirmer"}
      />
    </>
  );
}
