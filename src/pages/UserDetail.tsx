import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Car, 
  CreditCard, 
  Star, 
  Activity, 
  TrendingUp, 
  Clock,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User as UserIcon,
  Globe,
  Ban,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockUsers } from "@/data/mockUsers";
import { roleConfig, statusConfig, driverStatusConfig, documentStatusConfig } from "@/types/user";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Mock data for user activities
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

const documentTypeLabels = {
  license: "Permis de conduire",
  insurance: "Assurance",
  vehicle_registration: "Carte grise",
  identity: "Pièce d'identité"
};

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Utilisateur non trouvé</p>
          <Button onClick={() => navigate("/utilisateurs")} className="mt-4">
            Retour à la liste
          </Button>
        </div>
    );
  }

  const isDriver = user.role === "driver" || user.role === "both";
  const isPassengerOnly = user.role === "passenger";

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Back button and header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/utilisateurs")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>

        {/* User Header Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-medium">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-muted-foreground">{user.profile?.displayName || user.name}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge variant="outline" className={cn("font-medium", roleConfig[user.role].className)}>
                      {roleConfig[user.role].label}
                    </Badge>
                    <Badge variant="outline" className={cn("font-medium", statusConfig[user.status].className)}>
                      {statusConfig[user.status].label}
                    </Badge>
                    {user.profile?.driverVerified && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20 font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                    {user.flags?.banned && (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-medium">
                        <Ban className="w-3 h-3 mr-1" />
                        Banni
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-warning">
                  <Star className="w-6 h-6 fill-warning" />
                  <span className="text-3xl font-bold text-foreground">{user.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{user.rides} trajets</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/30">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            {isDriver && <TabsTrigger value="driver">Conducteur</TabsTrigger>}
            {isDriver && <TabsTrigger value="documents">Documents</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    Informations de contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium text-foreground">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date d'inscription</p>
                      <p className="font-medium text-foreground">{user.joinedAt}</p>
                    </div>
                  </div>
                  {user.profile?.locale && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Langue</p>
                        <p className="font-medium text-foreground">{user.profile.locale}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Profile Info for Passengers */}
              {user.profile && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.profile.bio && (
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Bio</p>
                        <p className="text-foreground">{user.profile.bio}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Conducteur vérifié</p>
                        {user.profile.driverVerified ? (
                          <CheckCircle className="w-6 h-6 text-success mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-muted-foreground mx-auto" />
                        )}
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Peut publier</p>
                        {user.flags?.canPublishRides ? (
                          <CheckCircle className="w-6 h-6 text-success mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-muted-foreground mx-auto" />
                        )}
                      </div>
                    </div>
                    {user.createdAt && (
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Créé le</p>
                        <p className="text-foreground">{formatDate(user.createdAt)}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Car className="w-8 h-8 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{user.rides}</p>
                  <span className="text-sm text-muted-foreground">Trajets</span>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <CreditCard className="w-8 h-8 mx-auto text-success mb-2" />
                  <p className="text-2xl font-bold text-foreground">€{(user.rides * 18.5).toFixed(0)}</p>
                  <span className="text-sm text-muted-foreground">Total dépensé</span>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto text-warning mb-2" />
                  <p className="text-2xl font-bold text-foreground">{user.rating}</p>
                  <span className="text-sm text-muted-foreground">Note moyenne</span>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-accent mb-2" />
                  <p className="text-2xl font-bold text-foreground">94%</p>
                  <span className="text-sm text-muted-foreground">Taux complétion</span>
                </CardContent>
              </Card>
            </div>

            {/* Performance */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taux de complétion</span>
                      <span className="font-medium text-foreground">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ponctualité</span>
                      <span className="font-medium text-foreground">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="font-medium text-foreground">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Historique des activités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Réservations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">{booking.id}</span>
                      <Badge variant="outline" className={cn("font-medium", bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].className)}>
                        {bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].label}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Driver Tab */}
          {isDriver && user.driverInfo && (
            <TabsContent value="driver" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Driver Info */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      Informations conducteur
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground">Statut candidature</span>
                      <Badge variant="outline" className={cn("font-medium", driverStatusConfig[user.driverInfo.status].className)}>
                        {driverStatusConfig[user.driverInfo.status].label}
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Numéro de permis</p>
                      <p className="font-medium text-foreground font-mono">{user.driverInfo.licenseNumber}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Date d'expiration du permis</p>
                      <p className="font-medium text-foreground">{formatDate(user.driverInfo.licenseExpiryDate)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Expérience (années)</p>
                      <p className="font-medium text-foreground">{user.driverInfo.experience} ans</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">ID Candidature</p>
                      <p className="font-medium text-foreground font-mono text-xs">{user.driverInfo.applicationId}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      Contact d'urgence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.driverInfo.emergencyContact?.name && (
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Nom</p>
                        <p className="font-medium text-foreground">{user.driverInfo.emergencyContact.name}</p>
                      </div>
                    )}
                    {user.driverInfo.emergencyContact?.phone && (
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Téléphone</p>
                        <p className="font-medium text-foreground">{user.driverInfo.emergencyContact.phone}</p>
                      </div>
                    )}
                    {user.driverInfo.emergencyContact?.relationship && (
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Relation</p>
                        <p className="font-medium text-foreground">{user.driverInfo.emergencyContact.relationship}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Motivation */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Motivation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{user.driverInfo.motivation}</p>
                </CardContent>
              </Card>

              {/* Application Timeline */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Historique de la candidature</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Candidature soumise</p>
                      <p className="text-sm text-muted-foreground">{formatDate(user.driverInfo.submittedAt)}</p>
                    </div>
                  </div>
                  {user.driverInfo.reviewedAt && (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        user.driverInfo.status === "APPROVED" ? "bg-success/10" : "bg-destructive/10"
                      )}>
                        {user.driverInfo.status === "APPROVED" ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Candidature {user.driverInfo.status === "APPROVED" ? "approuvée" : "rejetée"}
                        </p>
                        <p className="text-sm text-muted-foreground">{formatDate(user.driverInfo.reviewedAt)}</p>
                        {user.driverInfo.reviewedBy && (
                          <p className="text-xs text-muted-foreground">Par: {user.driverInfo.reviewedBy}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {user.driverInfo.rejectionReason && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm font-medium text-destructive mb-1">Raison du rejet</p>
                      <p className="text-foreground">{user.driverInfo.rejectionReason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Documents Tab */}
          {isDriver && user.documents && (
            <TabsContent value="documents" className="mt-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Documents envoyés
                  </CardTitle>
                  <CardDescription>Liste des documents fournis par le conducteur</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center",
                            doc.status === "approved" ? "bg-success/10" :
                            doc.status === "rejected" ? "bg-destructive/10" : "bg-warning/10"
                          )}>
                            <FileText className={cn(
                              "w-6 h-6",
                              doc.status === "approved" ? "text-success" :
                              doc.status === "rejected" ? "text-destructive" : "text-warning"
                            )} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {documentTypeLabels[doc.type]}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Envoyé le: {formatDate(doc.uploadedAt)}
                            </p>
                            {doc.expiresAt && (
                              <p className="text-xs text-muted-foreground">
                                Expire le: {formatDate(doc.expiresAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={cn("font-medium", documentStatusConfig[doc.status].className)}>
                            {documentStatusConfig[doc.status].label}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}
