import { User } from "@/types/user";

export const mockUsers: User[] = [
  { 
    id: "1", 
    name: "Jean Dupont", 
    email: "jean.dupont@email.com", 
    phone: "+33 6 12 34 56 78", 
    role: "both", 
    status: "active", 
    rides: 45, 
    rating: 4.8, 
    joinedAt: "15/03/2024",
    createdAt: "2024-03-15T10:30:00Z",
    profile: {
      displayName: "Jean D.",
      avatarUrl: undefined,
      locale: "fr-FR",
      bio: "Passionné de voyages et de partage",
      driverVerified: true
    },
    flags: {
      canPublishRides: true,
      banned: false
    },
    driverInfo: {
      licenseNumber: "14AA00001",
      licenseExpiryDate: "2028-05-15",
      experience: 8,
      motivation: "Je souhaite partager mes trajets quotidiens et rencontrer de nouvelles personnes tout en réduisant mon empreinte carbone.",
      emergencyContact: {
        name: "Marie Dupont",
        phone: "+33 6 98 76 54 32",
        relationship: "Épouse"
      },
      applicationId: "97ab27fa-30e2-43e3-92a3-160e80f4c0d5",
      status: "APPROVED",
      submittedAt: "2024-03-10T08:00:00Z",
      reviewedAt: "2024-03-12T14:30:00Z",
      reviewedBy: "Admin System"
    },
    documents: [
      { id: "d1", type: "license", name: "Permis de conduire", status: "approved", uploadedAt: "2024-03-10T08:05:00Z", expiresAt: "2028-05-15" },
      { id: "d2", type: "insurance", name: "Assurance véhicule", status: "approved", uploadedAt: "2024-03-10T08:10:00Z", expiresAt: "2025-03-01" },
      { id: "d3", type: "vehicle_registration", name: "Carte grise", status: "approved", uploadedAt: "2024-03-10T08:15:00Z" },
      { id: "d4", type: "identity", name: "Pièce d'identité", status: "approved", uploadedAt: "2024-03-10T08:20:00Z" }
    ]
  },
  { 
    id: "2", 
    name: "Marie Martin", 
    email: "marie.martin@email.com", 
    phone: "+33 6 23 45 67 89", 
    role: "driver", 
    status: "active", 
    rides: 128, 
    rating: 4.9, 
    joinedAt: "08/01/2024",
    createdAt: "2024-01-08T09:15:00Z",
    profile: {
      displayName: "Marie M.",
      locale: "fr-FR",
      bio: "Conductrice expérimentée, trajets Paris-Lyon réguliers",
      driverVerified: true
    },
    flags: {
      canPublishRides: true,
      banned: false
    },
    driverInfo: {
      licenseNumber: "14BB00002",
      licenseExpiryDate: "2027-11-20",
      experience: 12,
      motivation: "Trajets professionnels réguliers entre Paris et Lyon, je préfère voyager accompagnée.",
      emergencyContact: {
        name: "Pierre Martin",
        phone: "+33 6 11 22 33 44",
        relationship: "Frère"
      },
      applicationId: "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
      status: "APPROVED",
      submittedAt: "2024-01-05T11:00:00Z",
      reviewedAt: "2024-01-06T16:45:00Z",
      reviewedBy: "Admin System"
    },
    documents: [
      { id: "d5", type: "license", name: "Permis de conduire", status: "approved", uploadedAt: "2024-01-05T11:05:00Z", expiresAt: "2027-11-20" },
      { id: "d6", type: "insurance", name: "Assurance véhicule", status: "approved", uploadedAt: "2024-01-05T11:10:00Z", expiresAt: "2025-01-15" },
      { id: "d7", type: "vehicle_registration", name: "Carte grise", status: "approved", uploadedAt: "2024-01-05T11:15:00Z" }
    ]
  },
  { 
    id: "3", 
    name: "Pierre Bernard", 
    email: "pierre.b@email.com", 
    phone: "+33 6 34 56 78 90", 
    role: "passenger", 
    status: "active", 
    rides: 23, 
    rating: 4.6, 
    joinedAt: "22/05/2024",
    createdAt: "2024-05-22T14:20:00Z",
    profile: {
      displayName: "Pierre B.",
      locale: "fr-FR",
      bio: "Étudiant, trajets occasionnels le weekend",
      driverVerified: false
    },
    flags: {
      canPublishRides: false,
      banned: false
    }
  },
  { 
    id: "4", 
    name: "Sophie Leroy", 
    email: "sophie.leroy@email.com", 
    phone: "+33 6 45 67 89 01", 
    role: "both", 
    status: "inactive", 
    rides: 67, 
    rating: 4.7, 
    joinedAt: "12/02/2024",
    createdAt: "2024-02-12T16:45:00Z",
    profile: {
      displayName: "Sophie L.",
      locale: "fr-FR",
      bio: "Voyageuse fréquente",
      driverVerified: true
    },
    flags: {
      canPublishRides: true,
      banned: false
    },
    driverInfo: {
      licenseNumber: "14CC00003",
      licenseExpiryDate: "2026-08-10",
      experience: 5,
      motivation: "Partage de trajets domicile-travail",
      emergencyContact: {
        name: "Paul Leroy",
        phone: "+33 6 55 66 77 88",
        relationship: "Père"
      },
      applicationId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      status: "APPROVED",
      submittedAt: "2024-02-10T09:30:00Z",
      reviewedAt: "2024-02-11T11:00:00Z",
      reviewedBy: "Admin System"
    },
    documents: [
      { id: "d8", type: "license", name: "Permis de conduire", status: "approved", uploadedAt: "2024-02-10T09:35:00Z", expiresAt: "2026-08-10" },
      { id: "d9", type: "insurance", name: "Assurance véhicule", status: "pending", uploadedAt: "2024-02-10T09:40:00Z", expiresAt: "2024-12-01" }
    ]
  },
  { 
    id: "5", 
    name: "Lucas Moreau", 
    email: "lucas.m@email.com", 
    phone: "+33 6 56 78 90 12", 
    role: "driver", 
    status: "suspended", 
    rides: 89, 
    rating: 3.2, 
    joinedAt: "03/04/2024",
    createdAt: "2024-04-03T08:00:00Z",
    profile: {
      displayName: "Lucas M.",
      locale: "fr-FR",
      bio: "",
      driverVerified: false
    },
    flags: {
      canPublishRides: false,
      banned: true
    },
    driverInfo: {
      licenseNumber: "14DD00004",
      licenseExpiryDate: "2025-01-30",
      experience: 3,
      motivation: "Revenus complémentaires",
      emergencyContact: {
        name: "Anne Moreau",
        phone: "+33 6 99 88 77 66",
        relationship: "Mère"
      },
      applicationId: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
      status: "REJECTED",
      submittedAt: "2024-04-01T10:00:00Z",
      reviewedAt: "2024-04-02T14:00:00Z",
      reviewedBy: "Admin System",
      rejectionReason: "Comportement inapproprié signalé par plusieurs passagers"
    },
    documents: [
      { id: "d10", type: "license", name: "Permis de conduire", status: "rejected", uploadedAt: "2024-04-01T10:05:00Z", expiresAt: "2025-01-30" },
      { id: "d11", type: "insurance", name: "Assurance véhicule", status: "rejected", uploadedAt: "2024-04-01T10:10:00Z" }
    ]
  },
  { 
    id: "6", 
    name: "Emma Petit", 
    email: "emma.petit@email.com", 
    phone: "+33 6 67 89 01 23", 
    role: "passenger", 
    status: "active", 
    rides: 12, 
    rating: 5.0, 
    joinedAt: "28/08/2024",
    createdAt: "2024-08-28T12:00:00Z",
    profile: {
      displayName: "Emma P.",
      avatarUrl: "https://example.com/avatar/emma.jpg",
      locale: "fr-FR",
      bio: "Nouvelle sur la plateforme, très contente du service!",
      driverVerified: false
    },
    flags: {
      canPublishRides: false,
      banned: false
    }
  },
  { 
    id: "7", 
    name: "Hugo Robert", 
    email: "hugo.robert@email.com", 
    phone: "+33 6 78 90 12 34", 
    role: "both", 
    status: "active", 
    rides: 156, 
    rating: 4.9, 
    joinedAt: "19/11/2023",
    createdAt: "2023-11-19T07:30:00Z",
    profile: {
      displayName: "Hugo R.",
      locale: "fr-FR",
      bio: "Utilisateur fidèle depuis plus d'un an",
      driverVerified: true
    },
    flags: {
      canPublishRides: true,
      banned: false
    },
    driverInfo: {
      licenseNumber: "14EE00005",
      licenseExpiryDate: "2029-03-25",
      experience: 15,
      motivation: "Passionné d'automobile et de rencontres",
      emergencyContact: {
        name: "Claire Robert",
        phone: "+33 6 12 34 56 78",
        relationship: "Sœur"
      },
      applicationId: "c3d4e5f6-a7b8-9012-cdef-345678901234",
      status: "APPROVED",
      submittedAt: "2023-11-15T14:00:00Z",
      reviewedAt: "2023-11-17T09:00:00Z",
      reviewedBy: "Admin System"
    },
    documents: [
      { id: "d12", type: "license", name: "Permis de conduire", status: "approved", uploadedAt: "2023-11-15T14:05:00Z", expiresAt: "2029-03-25" },
      { id: "d13", type: "insurance", name: "Assurance véhicule", status: "approved", uploadedAt: "2023-11-15T14:10:00Z", expiresAt: "2025-06-01" },
      { id: "d14", type: "vehicle_registration", name: "Carte grise", status: "approved", uploadedAt: "2023-11-15T14:15:00Z" },
      { id: "d15", type: "identity", name: "Pièce d'identité", status: "approved", uploadedAt: "2023-11-15T14:20:00Z" }
    ]
  },
  { 
    id: "8", 
    name: "Léa Durand", 
    email: "lea.durand@email.com", 
    phone: "+33 6 89 01 23 45", 
    role: "driver", 
    status: "active", 
    rides: 234, 
    rating: 4.8, 
    joinedAt: "05/06/2023",
    createdAt: "2023-06-05T11:45:00Z",
    profile: {
      displayName: "Léa D.",
      locale: "fr-FR",
      bio: "Top conductrice de la région Sud",
      driverVerified: true
    },
    flags: {
      canPublishRides: true,
      banned: false
    },
    driverInfo: {
      licenseNumber: "14FF00006",
      licenseExpiryDate: "2030-07-12",
      experience: 10,
      motivation: "Aider les gens à se déplacer tout en préservant l'environnement",
      emergencyContact: {
        name: "Marc Durand",
        phone: "+33 6 00 11 22 33",
        relationship: "Époux"
      },
      applicationId: "d4e5f6a7-b8c9-0123-defa-456789012345",
      status: "APPROVED",
      submittedAt: "2023-06-01T08:30:00Z",
      reviewedAt: "2023-06-02T15:00:00Z",
      reviewedBy: "Admin System"
    },
    documents: [
      { id: "d16", type: "license", name: "Permis de conduire", status: "approved", uploadedAt: "2023-06-01T08:35:00Z", expiresAt: "2030-07-12" },
      { id: "d17", type: "insurance", name: "Assurance véhicule", status: "approved", uploadedAt: "2023-06-01T08:40:00Z", expiresAt: "2025-08-01" },
      { id: "d18", type: "vehicle_registration", name: "Carte grise", status: "approved", uploadedAt: "2023-06-01T08:45:00Z" }
    ]
  },
];
