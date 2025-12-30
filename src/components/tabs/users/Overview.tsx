import React from "react";
import UserKpis from "./UserKpsi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

  console.log('user',user)
  return (
    <div className="rounded-[6px] space-y-5 bg-white p-6">
      <UserKpis />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[1.3rem] flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Activités récentes
              </CardTitle>
              <Button size="sm" className="text-primary bg-transparent">
                Voir tout
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userLog?.slice(0, 5).map((activity) => {
                const config = actionConfig[activity.action] || {
                  icon: CircleDot,
                  label: activity.action,
                  color: "text-muted-foreground",
                };
                const IconComponent = config.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 px-1.5 py-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-[6px] flex items-center justify-center bg-background border border-border",
                        config.color
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
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

        <Card className="border-border shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-[1.3rem] flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-primary" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-2.5 px-4">
            <div className="space-y-2 pb-2 border-b border-gray-300/30">
              <div className="flex items-center gap-3 px-3 py-1 rounded-xl bg-muted/30">
                <Mail className="w-6 h-6 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground truncate">
                    {user.email || "Non renseigné"}
                  </p>
                </div>
                  <Badge className={`${user.emailVerified?'bg-success/10 text-success border-success/20':'bg-error/10 text-error border-error/20'} text-[0.6rem]`}>
                    {user.emailVerified?'Vérifié':'Non verifié'}
                  </Badge>
              </div>
              <div className="flex items-center gap-3 px-3 py-1 rounded-xl bg-muted/30">
                <Phone className="w-6 h-6 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="font-medium text-foreground">{user.phone}</p>
                </div>
                <Badge className={`${user.phoneVerified?'bg-success/10 text-success border-success/20':'bg-error/10 text-error border-error/20'} text-[0.6rem]`}>
                  {user.phoneVerified?'Vérifié':'Non verifié'}
                </Badge>
              </div>
              <div className="flex items-center gap-3 px-3 py-1 rounded-xl bg-muted/30">
                <Calendar className="w-6 h-6 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Inscription</p>
                  <p className="font-medium text-foreground">{formatRelativeTime(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-1 rounded-xl bg-muted/30">
                <Globe className="w-6 h-6 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Langue</p>
                  <p className="font-medium text-foreground">
                    {user.profile?.locale || "FR"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-0">
              <div className={`p-3 rounded-xl border ${user.driverVerified?'bg-success/5 border-success':'bg-destructive/5 border-destructive'} text-center`}>
                <p className="text-sm text-muted-foreground mb-1">
                  Conducteur vérifié
                </p>
                {user.driverVerified ? (
                  <CheckCircle className="w-6 h-6 text-success mx-auto" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive mx-auto" />
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
