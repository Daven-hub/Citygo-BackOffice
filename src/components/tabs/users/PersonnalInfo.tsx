import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface UserDetailProps {
  user: {
    id: string;
    email: string | null;
    phone: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
    deviceCount: number;
    sessionCount: number;
    status: string;
    roles: string[];
    driverVerified: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    lastLoginAt: string | null;
  };
}

export function PersonnalInfo({ user }: UserDetailProps) {
  const initials = user.displayName
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const statusColor =
    user.status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-600";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md w-full max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-700 overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{user.displayName}</h2>
          <span className={`inline-block mt-1 px-2 py-0.5 text-sm font-medium rounded-full ${statusColor}`}>
            {user.status}
          </span>
        </div>
      </div>

      {/* Infos principales */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
        <div>
          <span className="font-medium">Email:</span>{" "}
          {user.email ?? "Non renseigné"}
        </div>
        <div>
          <span className="font-medium">Téléphone:</span> {user.phone}
        </div>
        <div>
          <span className="font-medium">Rôle:</span> {user.roles.join(", ")}
        </div>
        <div>
          <span className="font-medium">Vérifié conducteur:</span>{" "}
          {user.driverVerified ? "Oui" : "Non"}
        </div>
        <div>
          <span className="font-medium">Email vérifié:</span>{" "}
          {user.emailVerified ? "Oui" : "Non"}
        </div>
        <div>
          <span className="font-medium">Téléphone vérifié:</span>{" "}
          {user.phoneVerified ? "Oui" : "Non"}
        </div>
        <div>
          <span className="font-medium">Devices:</span> {user.deviceCount}
        </div>
        <div>
          <span className="font-medium">Sessions:</span> {user.sessionCount}
        </div>
        <div className="col-span-2">
          <span className="font-medium">Bio:</span> {user.bio ?? "-"}
        </div>
      </div>

      {/* Dates */}
      <div className="mt-6 text-xs text-gray-500 border-t border-border/30 pt-3">
        <div>
          <span className="font-medium">Créé le:</span>{" "}
          {format(parseISO(user.createdAt), "dd MMM yyyy HH:mm", { locale: fr })}
        </div>
        <div>
          <span className="font-medium">Dernière mise à jour:</span>{" "}
          {format(parseISO(user.updatedAt), "dd MMM yyyy HH:mm", { locale: fr })}
        </div>
        <div>
          <span className="font-medium">Dernière connexion:</span>{" "}
          {user.lastLoginAt
            ? format(parseISO(user.lastLoginAt), "dd MMM yyyy HH:mm", { locale: fr })
            : "-"}
        </div>
      </div>
    </div>
  );
}
