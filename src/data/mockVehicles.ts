export interface Vehicle {
  vehicleId: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  make: string;
  model: string;
  color: string;
  plate: string;
  vehicleTypeId: string;
  vehicleTypeName: string;
  seats: number;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  comfortLevel: "STANDARD" | "COMFORT" | "PREMIUM";
  createdAt: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  documentCount: number;
}

export const vehicleStatusConfig = {
  DRAFT: { label: "Brouillon", className: "bg-muted text-muted-foreground border-border" },
  PENDING: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  APPROVED: { label: "Approuvé", className: "bg-success/10 text-success border-success/20" },
  REJECTED: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20" },
  SUSPENDED: { label: "Suspendu", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const comfortLevelConfig = {
  STANDARD: { label: "Standard", className: "bg-muted text-muted-foreground border-border" },
  COMFORT: { label: "Confort", className: "bg-primary/10 text-primary border-primary/20" },
  PREMIUM: { label: "Premium", className: "bg-warning/10 text-warning border-warning/20" },
};

export const mockVehicles: Vehicle[] = [
  {
    vehicleId: "v-001",
    ownerId: "1",
    ownerName: "Jean Dupont",
    ownerPhone: "+237 6 12 34 56 78",
    make: "Peugeot",
    model: "308",
    color: "Gris",
    plate: "AB-123-CD",
    vehicleTypeId: "type-1",
    vehicleTypeName: "Berline",
    seats: 4,
    status: "APPROVED",
    comfortLevel: "STANDARD",
    createdAt: "2024-01-15T10:30:00Z",
    submittedAt: "2024-01-16T09:00:00Z",
    reviewedAt: "2024-01-18T14:30:00Z",
    reviewedBy: "Admin System",
    reviewNote: "Tous les documents sont conformes.",
    documentCount: 3,
  },
  {
    vehicleId: "v-002",
    ownerId: "2",
    ownerName: "Marie Martin",
    ownerPhone: "+237 6 98 76 54 32",
    make: "Renault",
    model: "Clio",
    color: "Blanc",
    plate: "EF-456-GH",
    vehicleTypeId: "type-1",
    vehicleTypeName: "Citadine",
    seats: 4,
    status: "PENDING",
    comfortLevel: "STANDARD",
    createdAt: "2024-02-10T08:15:00Z",
    submittedAt: "2024-02-11T11:00:00Z",
    documentCount: 2,
  },
  {
    vehicleId: "v-003",
    ownerId: "3",
    ownerName: "Pierre Leroy",
    ownerPhone: "+237 6 55 44 33 22",
    make: "BMW",
    model: "Série 5",
    color: "Noir",
    plate: "IJ-789-KL",
    vehicleTypeId: "type-2",
    vehicleTypeName: "Berline luxe",
    seats: 4,
    status: "APPROVED",
    comfortLevel: "PREMIUM",
    createdAt: "2024-01-20T14:00:00Z",
    submittedAt: "2024-01-21T08:30:00Z",
    reviewedAt: "2024-01-23T16:00:00Z",
    reviewedBy: "Admin System",
    reviewNote: "Véhicule premium validé.",
    documentCount: 4,
  },
  {
    vehicleId: "v-004",
    ownerId: "4",
    ownerName: "Sophie Bernard",
    ownerPhone: "+237 6 11 22 33 44",
    make: "Volkswagen",
    model: "Golf",
    color: "Bleu",
    plate: "MN-012-OP",
    vehicleTypeId: "type-1",
    vehicleTypeName: "Berline",
    seats: 4,
    status: "SUSPENDED",
    comfortLevel: "COMFORT",
    createdAt: "2024-02-01T09:00:00Z",
    submittedAt: "2024-02-02T10:00:00Z",
    reviewedAt: "2024-02-05T11:30:00Z",
    reviewedBy: "Admin System",
    reviewNote: "Assurance expirée.",
    documentCount: 2,
  },
  {
    vehicleId: "v-005",
    ownerId: "5",
    ownerName: "Thomas Petit",
    ownerPhone: "+237 6 77 88 99 00",
    make: "Tesla",
    model: "Model 3",
    color: "Rouge",
    plate: "QR-345-ST",
    vehicleTypeId: "type-3",
    vehicleTypeName: "Électrique",
    seats: 5,
    status: "REJECTED",
    comfortLevel: "PREMIUM",
    createdAt: "2024-02-08T16:00:00Z",
    submittedAt: "2024-02-09T09:00:00Z",
    reviewedAt: "2024-02-12T14:00:00Z",
    reviewedBy: "Admin System",
    reviewNote: "Documents incomplets.",
    documentCount: 1,
  },
  {
    vehicleId: "v-006",
    ownerId: "6",
    ownerName: "Lucas Moreau",
    ownerPhone: "+237 6 44 55 66 77",
    make: "Mercedes",
    model: "Classe C",
    color: "Argent",
    plate: "UV-678-WX",
    vehicleTypeId: "type-2",
    vehicleTypeName: "Berline luxe",
    seats: 4,
    status: "DRAFT",
    comfortLevel: "PREMIUM",
    createdAt: "2024-02-14T11:00:00Z",
    submittedAt: "2024-02-14T11:00:00Z",
    documentCount: 0,
  },
];
