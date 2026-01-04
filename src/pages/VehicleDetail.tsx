import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Car, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Ban, 
  PlayCircle,
  Armchair,
  Palette,
  Hash,
  Clock,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { mockVehicles, vehicleStatusConfig, comfortLevelConfig } from "@/data/mockVehicles";
import { VehicleStatusModal } from "@/components/modal/VehicleStatusModal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getvehicleById } from "@/store/slices/vehicles.slice";
import LoaderUltra from "@/components/ui/loaderUltra";

export default function VehicleDetail() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const dispatch=useAppDispatch();
  const [duration,setDuration]=useState(0)
  const [isLoading,setIsLoading]=useState(true)
  const {vehiclesId} = useAppSelector((state) => state.vehicle);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
            const start = performance.now();
            await dispatch(getvehicleById(vehicleId));
            const end = performance.now();
            const elapsed = end - start;
            setDuration(elapsed);
            setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
          };
          fetchData();
    }, [dispatch,vehicleId])

     const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        try {
          return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr });
        } catch {
          return dateString;
        }
      };

  const getStatusActions = () => {
    const actions = [];
    if (vehicle.status !== "APPROVED") {
      actions.push({ label: "Approuver", icon: CheckCircle, color: "text-success", status: "APPROVED" });
    }
    if (vehicle.status !== "SUSPENDED" && vehicle.status !== "REJECTED") {
      actions.push({ label: "Suspendre", icon: Ban, color: "text-warning", status: "SUSPENDED" });
    }
    if (vehicle.status === "SUSPENDED") {
      actions.push({ label: "Réactiver", icon: PlayCircle, color: "text-primary", status: "PENDING" });
    }
    if (vehicle.status !== "REJECTED") {
      actions.push({ label: "Rejeter", icon: XCircle, color: "text-destructive", status: "REJECTED" });
    }
    return actions;
  };
  

  const vehicle = vehiclesId;

  if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;

  if (!vehicle) {
    return (
      <>
        <div className="text-center">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Véhicule non trouvé</p>
          <Button onClick={() => navigate("/vehicules")} className="mt-4">
            Retour à la liste
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate("/vehicules")} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        {/* Header Card */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <div className="gradient-primary h-2" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                  <Car className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{vehicle.make} {vehicle.model}</h2>
                  <p className="text-muted-foreground font-mono text-lg">{vehicle.plate}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge
                      variant="outline"
                      className={cn("font-medium", vehicleStatusConfig[vehicle.status]?.className)}
                    >
                      {vehicleStatusConfig[vehicle.status]?.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn("font-medium", comfortLevelConfig[vehicle.comfortLevel]?.className)}
                    >
                      {comfortLevelConfig[vehicle.comfortLevel]?.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {getStatusActions().map((action) => (
                  <Button
                    key={action.status}
                    variant="outline"
                    size="sm"
                    onClick={() => setStatusModalOpen(true)}
                    className={cn("gap-2 border-border", action.color)}
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle Info */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Car className="w-5 h-5 text-primary" />
                Informations du véhicule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">Marque</span>
                  </div>
                  <p className="font-semibold text-foreground">{vehicle.make}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Car className="w-4 h-4" />
                    <span className="text-sm">Modèle</span>
                  </div>
                  <p className="font-semibold text-foreground">{vehicle.model}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Palette className="w-4 h-4" />
                    <span className="text-sm">Couleur</span>
                  </div>
                  <p className="font-semibold text-foreground">{vehicle.color}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Armchair className="w-4 h-4" />
                    <span className="text-sm">Places</span>
                  </div>
                  <p className="font-semibold text-foreground">{vehicle.seats} sièges</p>
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Type de véhicule</span>
                </div>
                <p className="font-semibold text-foreground">{vehicle.vehicleTypeName}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Documents soumis</span>
                </div>
                <p className="font-semibold text-foreground">{vehicle.documentCount} document(s)</p>
              </div>
            </CardContent>
          </Card>

          {/* Owner Info */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-primary" />
                Propriétaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground">{vehicle.ownerName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {vehicle.ownerPhone}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-border text-foreground hover:bg-muted"
                onClick={() => navigate(`/utilisateurs/${vehicle.ownerId}`)}
              >
                Voir le profil du propriétaire
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-primary" />
              Historique
            </CardTitle>
            <CardDescription className="text-muted-foreground">Chronologie du véhicule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Véhicule créé</p>
                  <p className="text-sm text-muted-foreground">{formatDate(vehicle.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Soumis pour vérification</p>
                  <p className="text-sm text-muted-foreground">{formatDate(vehicle.submittedAt)}</p>
                </div>
              </div>

              {vehicle.reviewedAt && (
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    vehicle.status === "APPROVED" ? "bg-success/10" : 
                    vehicle.status === "REJECTED" ? "bg-destructive/10" :
                    vehicle.status === "SUSPENDED" ? "bg-warning/10" : "bg-muted"
                  )}>
                    {vehicle.status === "APPROVED" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : vehicle.status === "REJECTED" ? (
                      <XCircle className="w-5 h-5 text-destructive" />
                    ) : vehicle.status === "SUSPENDED" ? (
                      <Ban className="w-5 h-5 text-warning" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {vehicle.status === "APPROVED" ? "Approuvé" :
                       vehicle.status === "REJECTED" ? "Rejeté" :
                       vehicle.status === "SUSPENDED" ? "Suspendu" : "Examiné"}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatDate(vehicle.reviewedAt)}</p>
                    {vehicle.reviewedBy && (
                      <p className="text-xs text-muted-foreground">Par: {vehicle.reviewedBy}</p>
                    )}
                  </div>
                </div>
              )}

              {vehicle.reviewNote && (
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="text-sm font-medium text-foreground mb-1">Note de révision</p>
                    <p className="text-muted-foreground">{vehicle.reviewNote}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <VehicleStatusModal
        vehicle={vehicle}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
      />
    </>
  );
}
