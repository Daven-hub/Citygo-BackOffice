import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity, BookCheck, Car, CheckCircle, Eye, User2 } from "lucide-react";
import { roleConfig, statusConfig } from "@/types/user";
import { cn } from "@/lib/utils";
import UserAdminActions from "./UserAdminAction";
import { UnderlineTabs, UnderlineTabsContent, UnderlineTabsList, UnderlineTabsTrigger } from "@/components/ui/underline-tabs";

export default function UserHeader({ user }) {
  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("");
    

  return (
    <div className="bg-white/95 backdrop-blur border overflow-hidden rounded-xl">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-xl font-semibold">{user.displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email?user.email:user.phone}</p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {user.roles
                .filter((r) => r !== "ROLE_ADMIN")
                .map((role) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className={cn("text-xs", roleConfig[role]?.className)}
                  >
                    {roleConfig[role]?.label}
                  </Badge>
                ))}

              <Badge
                variant="outline"
                className={statusConfig[user.status]?.className}
              >
                {statusConfig[user.status]?.label}
              </Badge>

              {user.driverVerified && (
                <Badge className="bg-success/10 text-success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>
          </div>
        </div>

        <UserAdminActions user={user} />
      </div>
      <UnderlineTabsList>
        <UnderlineTabsTrigger className="flex items-center gap-1.5" value="apercu">
          <Eye size={18}/> Aperçu
        </UnderlineTabsTrigger>
        <UnderlineTabsTrigger className="flex items-center gap-1.5" value="info">
          <User2 size={18}/> Information personnelle
        </UnderlineTabsTrigger>
        <UnderlineTabsTrigger className="flex items-center gap-1.5" value="activites">
          <Activity size={18}/> Activités
        </UnderlineTabsTrigger>
        <UnderlineTabsTrigger className="flex items-center gap-1.5" value="reservations">
          <BookCheck size={18} /> Réservations
        </UnderlineTabsTrigger>
        <UnderlineTabsTrigger className="flex items-center gap-1.5" value="trajets">
          <Car size={18}/> Trajets
        </UnderlineTabsTrigger>
      </UnderlineTabsList>
    </div>
  );
}
