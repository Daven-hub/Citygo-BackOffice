export interface EmergencyContact {
  name?: string;
  phone?: string;
  relationship?: string;
}

export interface DriverInfo {
  licenseNumber: string;
  licenseExpiryDate: string;
  experience: number;
  motivation: string;
  emergencyContact: EmergencyContact;
  applicationId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface DriverDocument {
  id: string;
  type: "license" | "insurance" | "vehicle_registration" | "identity";
  name: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: string;
  expiresAt?: string;
}

export interface PassengerProfile {
  displayName: string;
  avatarUrl?: string;
  locale: string;
  bio?: string;
  driverVerified: boolean;
}

export interface PassengerFlags {
  canPublishRides: boolean;
  banned: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "driver" | "passenger" | "both";
  status: "active" | "inactive" | "suspended";
  rides: number;
  rating: number;
  joinedAt: string;
  // Passenger-specific
  profile?: PassengerProfile;
  flags?: PassengerFlags;
  createdAt?: string;
  // Driver-specific
  driverInfo?: DriverInfo;
  documents?: DriverDocument[];
}

export const roleConfig = {
  ROLE_DRIVER: {
    label: "Conducteur",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  ROLE_USER: {
    label: "Passager",
    className: "bg-secondary text-secondary-foreground border-border",
  },
  both: {
    label: "Users + Driver",
    className: "bg-green-100 text-green-700 border-grenn-200",
  },
  ROLE_ADMIN: {
    label: "Admin",
    className: "bg-green-100 text-primary-700 border-green-200",
  },
};

export const statusConfig = {
  ACTIVE: {
    label: "Actif",
    className: "bg-success/10 text-success border-success/20",
  },
  PENDING_VERIFICATION: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  INACTIVE: {
    label: "Inactif",
    className: "bg-muted text-muted-foreground border-border",
  },
  SUSPENDED: {
    label: "Suspendu",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export const driverStatusConfig = {
  PENDING: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  APPROVED: { label: "Approuvé", className: "bg-success/10 text-success border-success/20" },
  REJECTED: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const documentStatusConfig = {
  pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Validé", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20" },
};
