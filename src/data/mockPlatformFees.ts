export interface PlatformFee {
  id: string;
  feeType: string;
  percentage: number;
  provider: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PlatformFeeType {
  id: string;
  feeType: string;
  percentage: number;
  provider: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export const mockPlatformFees: PlatformFee[] = [
  {
    id: "PF-001",
    feeType: "RIDE_SETTLEMENT",
    percentage: 15,
    provider: "ORANGE_MONEY",
    effectiveFrom: "2024-01-01T00:00:00Z",
    effectiveTo: null,
    description: "Frais de règlement pour les trajets via Orange Money",
    isActive: true,
    createdAt: "2023-12-15T10:00:00Z",
    updatedAt: "2023-12-15T10:00:00Z",
    createdBy: "Admin System",
    updatedBy: "Admin System"
  },
  {
    id: "PF-002",
    feeType: "RIDE_SETTLEMENT",
    percentage: 12,
    provider: "WAVE",
    effectiveFrom: "2024-01-01T00:00:00Z",
    effectiveTo: null,
    description: "Frais de règlement pour les trajets via Wave",
    isActive: true,
    createdAt: "2023-12-15T10:30:00Z",
    updatedAt: "2023-12-15T10:30:00Z",
    createdBy: "Admin System",
    updatedBy: "Admin System"
  },
  {
    id: "PF-003",
    feeType: "BOOKING_FEE",
    percentage: 5,
    provider: "ALL",
    effectiveFrom: "2024-01-01T00:00:00Z",
    effectiveTo: null,
    description: "Frais de réservation appliqués à toutes les transactions",
    isActive: true,
    createdAt: "2023-12-16T09:00:00Z",
    updatedAt: "2024-01-05T14:00:00Z",
    createdBy: "Admin System",
    updatedBy: "Jean Dupont"
  },
  {
    id: "PF-004",
    feeType: "CANCELLATION_FEE",
    percentage: 10,
    provider: "ALL",
    effectiveFrom: "2024-01-01T00:00:00Z",
    effectiveTo: "2024-06-30T23:59:59Z",
    description: "Frais d'annulation pour les réservations annulées",
    isActive: true,
    createdAt: "2023-12-17T11:00:00Z",
    updatedAt: "2023-12-17T11:00:00Z",
    createdBy: "Admin System",
    updatedBy: "Admin System"
  },
  {
    id: "PF-005",
    feeType: "RIDE_SETTLEMENT",
    percentage: 14,
    provider: "FREE_MONEY",
    effectiveFrom: "2024-02-01T00:00:00Z",
    effectiveTo: null,
    description: "Frais de règlement pour les trajets via Free Money",
    isActive: false,
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-25T16:00:00Z",
    createdBy: "Marie Martin",
    updatedBy: "Jean Dupont"
  }
];

export const mockPlatformFeeTypes: PlatformFeeType[] = [
  {
    id: "PFT-001",
    feeType: "RIDE_SETTLEMENT",
    percentage: 15,
    provider: "DEFAULT",
    effectiveFrom: "2024-01-01T00:00:00Z",
    effectiveTo: null,
    description: "Type de frais pour le règlement des trajets",
    isActive: true,
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2023-12-01T10:00:00Z",
    createdBy: "Admin System",
    updatedBy: "Admin System"
  },
  {
    id: "PFT-002",
    feeType: "BOOKING_FEE",
    percentage: 5,
    provider: "DEFAULT",
    effectiveFrom: "2024-01-01T00:00:00Z",
    effectiveTo: null,
    description: "Type de frais pour les réservations",
    isActive: true,
    createdAt: "2023-12-01T10:30:00Z",
    updatedAt: "2023-12-01T10:30:00Z",
    createdBy: "Admin System",
    updatedBy: "Admin System"
  },
  {
    id: "PFT-003",
    feeType: "CANCELLATION_FEE",
    percentage: 10,
    provider: "DEFAULT",
    effectiveFrom: "2024-01-01T00:00:00Z",
    effectiveTo: null,
    description: "Type de frais pour les annulations",
    isActive: true,
    createdAt: "2023-12-01T11:00:00Z",
    updatedAt: "2023-12-01T11:00:00Z",
    createdBy: "Admin System",
    updatedBy: "Admin System"
  },
  {
    id: "PFT-004",
    feeType: "REFUND_FEE",
    percentage: 2,
    provider: "DEFAULT",
    effectiveFrom: "2024-01-01T00:00:00Z",
    effectiveTo: null,
    description: "Type de frais pour les remboursements",
    isActive: false,
    createdAt: "2023-12-02T09:00:00Z",
    updatedAt: "2024-01-10T14:00:00Z",
    createdBy: "Admin System",
    updatedBy: "Jean Dupont"
  }
];
