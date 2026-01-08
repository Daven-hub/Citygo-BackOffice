export interface DriverApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  experience: number;
  motivation: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  applicationId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface KYCRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  documentType: "identity" | "address" | "driver_license";
  documentNumber: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  documentUrl?: string;
}

export const documentCategoryConfig: Record<string, { label: string; className: string }> = {
  IDENTITY: { label: "Pièce d'identité", className: "bg-primary/10 text-primary border-primary/20" },
  CNI_FRONT: { label: "CNI Recto", className: "bg-primary/10 text-primary border-primary/20" },
  CNI_BACK: { label: "CNI Verso", className: "bg-primary/10 text-primary border-primary/20" },
  SELFIE: { label: "Selfie", className: "bg-accent/10 text-accent border-accent/20" },
  DRIVER_LICENSE: { label: "Permis de conduire", className: "bg-warning/10 text-warning border-warning/20" },
  ADDRESS_PROOF: { label: "Justificatif de domicile", className: "bg-success/10 text-success border-success/20" },
  OTHER: { label: "Autre", className: "bg-muted text-muted-foreground border-muted" }
};
export const documentTypeConfig = {
  identity: { label: "Pièce d'identité", className: "bg-primary/10 text-primary border-primary/20" },
  address: { label: "Justificatif de domicile", className: "bg-accent/10 text-accent border-accent/20" },
  driver_license: { label: "Permis de conduire", className: "bg-warning/10 text-warning border-warning/20" },
  VEHICLE_PHOTO_INTERIOR:{ label: "Photo Intérieur du véhicule", className: "bg-warning/10 text-warning border-warning/20" }
};

export const kycStatusConfig = {
  PENDING: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  APPROVED: { label: "Approuvé", className: "bg-success/10 text-success border-success/20" },
  REJECTED: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20" }
};
