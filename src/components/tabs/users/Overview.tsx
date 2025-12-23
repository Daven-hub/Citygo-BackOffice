import React from "react";
import UserKpis from "./UserKpsi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Badge,
  BookCheck,
  Calendar,
  CheckCircle,
  ChevronRight,
  CircleDot,
  DollarSign,
  Globe,
  LogIn,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Route,
  Smartphone,
  UserIcon,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

function Overview({ user, userLog }) {
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return dateString;
    }
  };

  const actionConfig: Record<
    string,
    { icon: React.ElementType; label: string; color: string }
  > = {
    LOGIN: { icon: LogIn, label: "Connexion", color: "text-blue-500" },
    LOGOUT: {
      icon: LogIn,
      label: "Déconnexion",
      color: "text-muted-foreground",
    },
    BOOKING_CREATED: {
      icon: BookCheck,
      label: "Réservation créée",
      color: "text-primary",
    },
    BOOKING_CONFIRMED: {
      icon: CheckCircle,
      label: "Réservation confirmée",
      color: "text-success",
    },
    BOOKING_CANCELLED: {
      icon: XCircle,
      label: "Réservation annulée",
      color: "text-destructive",
    },
    RIDE_COMPLETED: {
      icon: Route,
      label: "Trajet terminé",
      color: "text-success",
    },
    PROFILE_UPDATE: {
      icon: UserIcon,
      label: "Profil mis à jour",
      color: "text-warning",
    },
    PAYMENT_RECEIVED: {
      icon: DollarSign,
      label: "Paiement reçu",
      color: "text-success",
    },
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent?.includes("Expo") || userAgent?.includes("Darwin")) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };
  return (
    <div className="space-y-4">
      <div className="border rounded-xl bg-white p-4">
        <UserKpis />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Activités récentes
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                Voir tout
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userLog?.slice(0,5).map((activity) => {
                const config = actionConfig[activity.action] || {
                  icon: CircleDot,
                  label: activity.action,
                  color: "text-muted-foreground",
                };
                const IconComponent = config.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center bg-background border border-border",
                        config.color
                      )}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground truncate">
                          {config.label}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.details}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {getDeviceIcon(activity.userAgent)}
                          {activity.ipAddress}
                        </span>
                        {activity.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {activity.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground truncate">
                    {user.email || "Non renseigné"}
                  </p>
                </div>
                {user.email && (
                  <Badge
                    className="bg-success/10 text-success border-success/20 text-xs"
                  >
                    Vérifié
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="font-medium text-foreground">{user.phone}</p>
                </div>
                <Badge
                  className="bg-success/10 text-success border-success/20 text-xs"
                >
                  Vérifié
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Inscription</p>
                  <p className="font-medium text-foreground">{user.joinedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Langue</p>
                  <p className="font-medium text-foreground">
                    {user.profile?.locale || "FR"}
                  </p>
                </div>
              </div>
            </div>

            {user.profile?.bio && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground mb-1">Bio</p>
                <p className="text-sm text-foreground">{user.profile.bio}</p>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Conducteur vérifié
                </p>
                {user.profile?.driverVerified ? (
                  <CheckCircle className="w-6 h-6 text-success mx-auto" />
                ) : (
                  <XCircle className="w-6 h-6 text-muted-foreground mx-auto" />
                )}
              </div>
              <div className="p-3 rounded-xl bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Peut publier
                </p>
                {user.flags?.canPublishRides ? (
                  <CheckCircle className="w-6 h-6 text-success mx-auto" />
                ) : (
                  <XCircle className="w-6 h-6 text-muted-foreground mx-auto" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Overview;
