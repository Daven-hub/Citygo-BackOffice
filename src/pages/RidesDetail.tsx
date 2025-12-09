import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  MapPin,
  Star,
  Users,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  Fuel,
  Navigation,
  Euro
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

const statusConfig = {
  pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  active: { label: "En cours", className: "bg-primary/10 text-primary border-primary/20", icon: Navigation },
  completed: { label: "Terminé", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  cancelled: { label: "Annulé", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

// Mock ride data
const mockRideDetails = {
  "1": {
    id: "1",
    driver: { 
      id: "drv-001",
      name: "Jean Dupont", 
      email: "jean.dupont@email.com", 
      phone: "+33 6 12 34 56 78", 
      rating: 4.8, 
      totalRides: 156,
      verified: true
    },
    vehicle: {
      brand: "Peugeot",
      model: "308",
      color: "Gris",
      plate: "AB-123-CD",
      year: 2021
    },
    from: { city: "Paris", address: "15 Rue de Rivoli, 75001 Paris" },
    to: { city: "Lyon", address: "Place Bellecour, 69002 Lyon" },
    date: "2024-12-02",
    time: "08:00",
    passengers: [
      { id: "pax-001", name: "Marie Martin", seats: 2, status: "confirmed" },
      { id: "pax-002", name: "Pierre Bernard", seats: 1, status: "confirmed" },
    ],
    maxPassengers: 4,
    status: "active" as const,
    price: 35,
    distance: 465,
    duration: "4h 30min",
    createdAt: "2024-11-28T10:00:00Z",
    departureTime: "2024-12-02T08:00:00Z",
    estimatedArrival: "2024-12-02T12:30:00Z",
    features: ["Bagages acceptés", "Animaux acceptés", "Non-fumeur"],
    description: "Trajet régulier Paris-Lyon. Départ de la gare de Lyon, arrivée au centre-ville. Je fais ce trajet chaque semaine.",
  }
};

export default function RidesDetail() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Get ride data
  const ride = mockRideDetails[rideId as keyof typeof mockRideDetails] || mockRideDetails["1"];

  if (!ride) {
    return (
      <>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Trajet non trouvé</h2>
            <Button variant="outline" onClick={() => navigate("/trajets")}>
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

  const handleCancelRide = () => {
    setConfirmOpen(true);
  };

  const executeCancel = () => {
    toast({
      title: "Trajet annulé",
      description: `Le trajet #${ride.id} a été annulé. Tous les passagers seront notifiés.`,
    });
    setConfirmOpen(false);
  };

  const occupiedSeats = ride.passengers.reduce((acc, p) => acc + p.seats, 0);
  const occupancyPercent = (occupiedSeats / ride.maxPassengers) * 100;
  const StatusIcon = statusConfig[ride.status].icon;

  return (
    <>
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate("/trajets")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux trajets
        </Button>

        {/* Header Card */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {ride.from.city} → {ride.to.city}
                  </h2>
                  <Badge variant="outline" className={cn("font-medium", statusConfig[ride.status].className)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig[ride.status].label}
                  </Badge>
                </div>
                <p className="text-muted-foreground">Créé le {formatDateTime(ride.createdAt)}</p>
              </div>
              {((ride.status as string) === "pending" || ride.status === "active") && (
                <Button 
                  variant="outline" 
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={handleCancelRide}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Annuler le trajet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Route */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  Itinéraire
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
                      <p className="font-semibold text-foreground text-lg">{ride.from.city}</p>
                      <p className="text-muted-foreground">{ride.from.address}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-primary">
                        <Clock className="w-4 h-4" />
                        Départ: {ride.time}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">{ride.to.city}</p>
                      <p className="text-muted-foreground">{ride.to.address}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-accent">
                        <Clock className="w-4 h-4" />
                        Arrivée estimée: {formatDateTime(ride.estimatedArrival).split(" ").slice(-1)[0]}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{formatDate(ride.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium text-foreground">{ride.distance} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Durée</p>
                      <p className="font-medium text-foreground">{ride.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Prix/place</p>
                      <p className="font-medium text-primary">{ride.price} €</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passengers */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-foreground">
                    <Users className="w-5 h-5 text-primary" />
                    Passagers ({occupiedSeats}/{ride.maxPassengers})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taux d'occupation</span>
                    <span className="text-foreground">{occupancyPercent.toFixed(0)}%</span>
                  </div>
                  <Progress value={occupancyPercent} className="h-2" />
                </div>

                <Separator />

                <div className="space-y-3">
                  {ride.passengers.map((passenger) => (
                    <div key={passenger.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {passenger.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{passenger.name}</p>
                          <p className="text-sm text-muted-foreground">{passenger.seats} place(s)</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Confirmé
                      </Badge>
                    </div>
                  ))}
                  {ride.maxPassengers - occupiedSeats > 0 && (
                    <div className="p-3 rounded-lg border-2 border-dashed border-border text-center">
                      <p className="text-muted-foreground">
                        {ride.maxPassengers - occupiedSeats} place(s) disponible(s)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {ride.description && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Description du trajet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{ride.description}</p>
                  {ride.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {ride.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="bg-muted/50">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Driver */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <User className="w-5 h-5 text-primary" />
                  Conducteur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {ride.driver.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{ride.driver.name}</p>
                      {ride.driver.verified && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="text-sm text-muted-foreground">{ride.driver.rating} • {ride.driver.totalRides} trajets</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{ride.driver.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{ride.driver.phone}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/users/${ride.driver.id}`)}>
                  Voir le profil
                </Button>
              </CardContent>
            </Card>

            {/* Vehicle */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Car className="w-5 h-5 text-primary" />
                  Véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marque</span>
                  <span className="font-medium text-foreground">{ride.vehicle.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modèle</span>
                  <span className="font-medium text-foreground">{ride.vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Couleur</span>
                  <span className="font-medium text-foreground">{ride.vehicle.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Immatriculation</span>
                  <span className="font-mono text-foreground">{ride.vehicle.plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Année</span>
                  <span className="font-medium text-foreground">{ride.vehicle.year}</span>
                </div>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Euro className="w-5 h-5 text-primary" />
                  Revenus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Places vendues</span>
                  <span className="text-foreground">{occupiedSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix par place</span>
                  <span className="text-foreground">{ride.price} €</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary text-xl">{ride.price * occupiedSeats} €</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={executeCancel}
        title="Annuler ce trajet ?"
        description="Cette action annulera le trajet. Tous les passagers seront notifiés et remboursés si applicable. Cette action est irréversible."
        variant="danger"
        confirmText="Annuler le trajet"
      />
    </>
  );
}
