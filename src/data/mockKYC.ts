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

export const mockDriverApplications: DriverApplication[] = [
  {
    id: "DA001",
    userId: "usr-001",
    userName: "Jean Dupont",
    userEmail: "jean.dupont@email.com",
    licenseNumber: "CM-123456789",
    licenseExpiryDate: "2027-08-24",
    experience: 5,
    motivation: "Je souhaite partager mes trajets quotidiens pour réduire mon empreinte carbone et rencontrer de nouvelles personnes.",
    emergencyContact: {
      name: "Marie Dupont",
      phone: "+33 6 12 34 56 78",
      relationship: "Épouse"
    },
    applicationId: "97ab27fa-30e2-43e3-92a3-160e80f4c0d5",
    status: "PENDING",
    submittedAt: "2024-12-01T14:15:22Z"
  },
  {
    id: "DA002",
    userId: "usr-002",
    userName: "Pierre Martin",
    userEmail: "pierre.martin@email.com",
    licenseNumber: "CM-987654321",
    licenseExpiryDate: "2025-03-15",
    experience: 10,
    motivation: "Conducteur expérimenté, je veux offrir des trajets confortables et sécurisés.",
    emergencyContact: {
      name: "Sophie Martin",
      phone: "+33 6 98 76 54 32",
      relationship: "Sœur"
    },
    applicationId: "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
    status: "APPROVED",
    submittedAt: "2024-11-15T09:30:00Z",
    reviewedAt: "2024-11-16T10:00:00Z",
    reviewedBy: "Admin Paul"
  },
  {
    id: "DA003",
    userId: "usr-003",
    userName: "Sophie Leroy",
    userEmail: "sophie.leroy@email.com",
    licenseNumber: "CM-456789123",
    licenseExpiryDate: "2024-01-10",
    experience: 2,
    motivation: "Nouvelle dans le covoiturage, je veux commencer à proposer des trajets.",
    emergencyContact: {
      name: "Lucas Leroy",
      phone: "+33 6 55 44 33 22",
      relationship: "Frère"
    },
    applicationId: "c7fc0faacffa-4e73-4d65-b54c-849e71dc",
    status: "REJECTED",
    submittedAt: "2024-11-20T16:45:00Z",
    reviewedAt: "2024-11-21T11:30:00Z",
    reviewedBy: "Admin Marie",
    rejectionReason: "Permis de conduire expiré. Veuillez renouveler votre permis et soumettre à nouveau."
  },
  {
    id: "DA004",
    userId: "usr-004",
    userName: "Lucas Moreau",
    userEmail: "lucas.moreau@email.com",
    licenseNumber: "CM-321654987",
    licenseExpiryDate: "2028-06-30",
    experience: 7,
    motivation: "Trajets réguliers Paris-Lyon, je cherche des passagers pour partager les frais.",
    emergencyContact: {
      name: "Emma Moreau",
      phone: "+33 6 11 22 33 44",
      relationship: "Mère"
    },
    applicationId: "160e80f4c0d5-30e2-43e3-92a3-97ab27fa",
    status: "PENDING",
    submittedAt: "2024-12-03T08:00:00Z"
  },
  {
    id: "DA005",
    userId: "usr-005",
    userName: "Emma Petit",
    userEmail: "emma.petit@email.com",
    licenseNumber: "CM-654321789",
    licenseExpiryDate: "2026-11-20",
    experience: 3,
    motivation: "Étudiante, je fais souvent le trajet université-maison.",
    emergencyContact: {
      name: "Thomas Petit",
      phone: "+33 6 77 88 99 00",
      relationship: "Père"
    },
    applicationId: "43e3-92a3-160e80f4c0d5-30e2-97ab27fa",
    status: "PENDING",
    submittedAt: "2024-12-04T10:30:00Z"
  }
];

export const mockKYCRequests: KYCRequest[] = [
  {
    id: "KYC001",
    userId: "usr-001",
    userName: "Jean Dupont",
    userEmail: "jean.dupont@email.com",
    documentType: "identity",
    documentNumber: "123456789012",
    status: "APPROVED",
    submittedAt: "2024-11-28T14:00:00Z",
    reviewedAt: "2024-11-29T09:00:00Z",
    reviewedBy: "Admin Paul"
  },
  {
    id: "KYC002",
    userId: "usr-002",
    userName: "Pierre Martin",
    userEmail: "pierre.martin@email.com",
    documentType: "driver_license",
    documentNumber: "CM-987654321",
    status: "PENDING",
    submittedAt: "2024-12-02T11:30:00Z"
  },
  {
    id: "KYC003",
    userId: "usr-003",
    userName: "Sophie Leroy",
    userEmail: "sophie.leroy@email.com",
    documentType: "address",
    documentNumber: "PROOF-2024-001",
    status: "REJECTED",
    submittedAt: "2024-11-25T16:00:00Z",
    reviewedAt: "2024-11-26T10:30:00Z",
    reviewedBy: "Admin Marie",
    rejectionReason: "Document illisible. Veuillez soumettre une copie plus claire."
  },
  {
    id: "KYC004",
    userId: "usr-004",
    userName: "Lucas Moreau",
    userEmail: "lucas.moreau@email.com",
    documentType: "identity",
    documentNumber: "987654321098",
    status: "PENDING",
    submittedAt: "2024-12-03T14:45:00Z"
  },
  {
    id: "KYC005",
    userId: "usr-005",
    userName: "Emma Petit",
    userEmail: "emma.petit@email.com",
    documentType: "driver_license",
    documentNumber: "CM-654321789",
    status: "PENDING",
    submittedAt: "2024-12-04T09:15:00Z"
  }
];

export const documentTypeConfig = {
  identity: { label: "Pièce d'identité", className: "bg-primary/10 text-primary border-primary/20" },
  address: { label: "Justificatif de domicile", className: "bg-accent/10 text-accent border-accent/20" },
  driver_license: { label: "Permis de conduire", className: "bg-warning/10 text-warning border-warning/20" }
};

export const kycStatusConfig = {
  PENDING: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  APPROVED: { label: "Approuvé", className: "bg-success/10 text-success border-success/20" },
  REJECTED: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20" }
};
