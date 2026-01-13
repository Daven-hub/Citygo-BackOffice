export const vehicleStatusConfig = {
  UNSUSPENDED: {
    label: "Réactivé",
    className: "bg-blue-100 text-blue-700 border-blue-200"
  },
  PENDING: {
    label: "En attente",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  DRAFT: {
    label: "Brouillon",
    className: "bg-gray-100 text-gray-700 border-gray-200"
  },
  APPROVED: {
    label: "Approuvé",
    className: "bg-green-100 text-green-700 border-green-200"
  },
  REJECTED: {
    label: "Rejeté",
    className: "bg-red-100 text-red-700 border-red-200"
  },
  SUSPENDED: {
    label: "Suspendu",
    className: "bg-orange-100 text-orange-700 border-orange-200"
  },
  PENDING_REVIEW: {
    label: "Attente de validation",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200"
  }
};

export const comfortLevelConfig = {
  STANDARD: { label: "Standard", className: "bg-muted text-muted-foreground border-border" },
  COMFORT: { label: "Confort", className: "bg-primary/10 text-primary border-primary/20" },
  PREMIUM: { label: "Premium", className: "bg-warning/10 text-warning border-warning/20" },
};