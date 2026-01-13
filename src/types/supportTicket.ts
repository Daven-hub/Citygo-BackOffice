import {
  Clock,
  PlayCircle,
  UserCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  CreditCard,
  Car,
  Calendar,
  Shield,
  UserX,
  User,
  Bug,
  HelpCircle,
  RotateCcw,
  Hourglass,
} from "lucide-react";

// =============================================================================
// ENUMS
// =============================================================================

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "AWAITING_CUSTOMER"
  | "AWAITING_THIRD_PARTY"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED"
  | "REOPENED";

export type TicketPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type TicketCategory =
  | "RIDE_ISSUE"
  | "BOOKING_ISSUE"
  | "PAYMENT_ISSUE"
  | "ACCOUNT_ISSUE"
  | "DRIVER_COMPLAINT"
  | "PASSENGER_COMPLAINT"
  | "SAFETY_CONCERN"
  | "APP_BUG"
  | "SUGGESTION"
  | "OTHER";

export type TicketSubcategory =
  | "WRONG_ROUTE"
  | "LATE_ARRIVAL"
  | "VEHICLE_CONDITION"
  | "RIDE_CANCELLATION"
  | "DRIVER_BEHAVIOR"
  | "DOUBLE_CHARGE"
  | "REFUND_NOT_RECEIVED"
  | "WALLET_DISCREPANCY"
  | "PAYMENT_FAILED"
  | "INCORRECT_FARE"
  | "VERIFICATION_PROBLEM"
  | "CANNOT_LOGIN"
  | "PROFILE_UPDATE"
  | "TWO_FACTOR_ISSUE"
  | "CANNOT_BOOK"
  | "SEAT_LOCK_EXPIRED"
  | "NO_CONFIRMATION"
  | "ACCIDENT"
  | "HARASSMENT"
  | "SAFETY_THREAT"
  | "GENERAL_INQUIRY"
  | "FEEDBACK";

export type ResolutionCategory =
  | "RESOLVED_WITH_REFUND"
  | "RESOLVED_WITH_CREDIT"
  | "RESOLVED_WITH_EXPLANATION"
  | "RESOLVED_NO_ACTION_NEEDED"
  | "DUPLICATE"
  | "CANNOT_REPRODUCE"
  | "INVALID_REQUEST"
  | "SPAM";

export type TicketSource = "APP" | "WEB" | "ADMIN";

export type TicketContextType =
  | "RIDE"
  | "BOOKING"
  | "PAYMENT"
  | "USER_REPORT"
  | "NONE";

// =============================================================================
// INTERFACES
// =============================================================================

export interface UserMini {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  rating?: number;
}

export interface Attachment {
  id: string;
  ticketId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  formattedSize: string;
  isImage: boolean;
  isPdf: boolean;
  description?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  reporter: UserMini;
  category: TicketCategory;
  subcategory?: TicketSubcategory;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  urgencyScore?: number;
  impactScore?: number;
  compositeScore?: number;
  contextType?: TicketContextType;
  contextId?: string;
  conversationId?: string;
  assignedTo?: UserMini;
  assignedAt?: string;
  slaPolicy?: string;
  firstResponseDueAt?: string;
  resolutionDueAt?: string;
  firstRespondedAt?: string;
  resolvedAt?: string;
  slaBreached?: boolean;
  firstResponseBreached?: boolean;
  resolutionBreached?: boolean;
  resolution?: string;
  resolutionCategory?: ResolutionCategory;
  customerSatisfaction?: number;
  feedbackComment?: string;
  source?: TicketSource;
  escalationLevel?: number;
  reopenCount?: number;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt?: string;
  version?: number;
  attachments?: Attachment[];
}

export interface SupportTicketStats {
  activeCount: number;
  unassignedCount: number;
  escalatedCount: number;
  slaBreachedCount: number;
}

export interface SupportTicketDetailedStats {
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
  slaBreachedCount: number;
  approachingSlaCount: number;
  slaComplianceRate: number;
  activeCount: number;
  unassignedCount: number;
  escalatedCount: number;
  createdToday: number;
  resolvedToday: number;
  closedToday: number;
  averageFirstResponseHours?: number;
  averageResolutionHours?: number;
  averageCustomerSatisfaction?: number;
}

export interface UpdateTicketRequest {
  category?: TicketCategory;
  subcategory?: TicketSubcategory;
  subject?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  internalNotes?: string;
}

export interface CreateTicketRequest {
  category: TicketCategory;
  subcategory?: TicketSubcategory;
  subject: string;
  description: string;
  source?: TicketSource;
}

export interface ResolveTicketRequest {
  resolutionCategory: ResolutionCategory;
  resolution: string;
}

export interface AddNoteRequest {
  note: string;
}

// =============================================================================
// HISTORY / ACTIVITY TIMELINE TYPES
// =============================================================================

export type TicketAction =
  | "CREATED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "ASSIGNED"
  | "UNASSIGNED"
  | "ESCALATED"
  | "SLA_BREACHED"
  | "RESOLVED"
  | "CLOSED"
  | "REOPENED"
  | "NOTE_ADDED";

export interface TicketHistoryEntry {
  id: string;
  ticketId: string;
  actorId: string;
  actorName?: string;
  action: TicketAction;
  previousValue?: string;
  newValue?: string;
  comment?: string;
  occurredAt: string;
}

// =============================================================================
// STATUS CONFIG
// =============================================================================

export const ticketStatusConfig: Record<
  TicketStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  OPEN: {
    label: "Ouvert",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: PlayCircle,
  },
  AWAITING_CUSTOMER: {
    label: "Attente client",
    className: "bg-muted text-muted-foreground border-border",
    icon: UserCircle,
  },
  AWAITING_THIRD_PARTY: {
    label: "Attente tiers",
    className: "bg-muted text-muted-foreground border-border",
    icon: Hourglass,
  },
  ESCALATED: {
    label: "Escaladé",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: AlertTriangle,
  },
  RESOLVED: {
    label: "Résolu",
    className: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
  CLOSED: {
    label: "Fermé",
    className: "bg-muted text-muted-foreground border-border",
    icon: XCircle,
  },
  REOPENED: {
    label: "Réouvert",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: RotateCcw,
  },
};

// =============================================================================
// PRIORITY CONFIG
// =============================================================================

export const ticketPriorityConfig: Record<
  TicketPriority,
  { label: string; className: string; sla: string }
> = {
  CRITICAL: {
    label: "Critique",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    sla: "4h",
  },
  HIGH: {
    label: "Haute",
    className: "bg-warning/10 text-warning border-warning/20",
    sla: "8h",
  },
  MEDIUM: {
    label: "Moyenne",
    className: "bg-primary/10 text-primary border-primary/20",
    sla: "48h",
  },
  LOW: {
    label: "Basse",
    className: "bg-muted text-muted-foreground border-border",
    sla: "7j",
  },
};

// =============================================================================
// CATEGORY CONFIG
// =============================================================================

export const ticketCategoryConfig: Record<
  TicketCategory,
  { label: string; icon: typeof Clock }
> = {
  PAYMENT_ISSUE: { label: "Paiement", icon: CreditCard },
  RIDE_ISSUE: { label: "Trajet", icon: Car },
  BOOKING_ISSUE: { label: "Réservation", icon: Calendar },
  SAFETY_CONCERN: { label: "Sécurité", icon: Shield },
  DRIVER_COMPLAINT: { label: "Plainte chauffeur", icon: UserX },
  PASSENGER_COMPLAINT: { label: "Plainte passager", icon: UserX },
  ACCOUNT_ISSUE: { label: "Compte", icon: User },
  APP_BUG: { label: "Bug", icon: Bug },
  SUGGESTION: { label: "Suggestion", icon: HelpCircle },
  OTHER: { label: "Autre", icon: HelpCircle },
};

// =============================================================================
// RESOLUTION CATEGORY CONFIG
// =============================================================================

export const resolutionCategoryConfig: Record<
  ResolutionCategory,
  { label: string; isPositive: boolean }
> = {
  RESOLVED_WITH_REFUND: { label: "Résolu avec remboursement", isPositive: true },
  RESOLVED_WITH_CREDIT: { label: "Résolu avec crédit", isPositive: true },
  RESOLVED_WITH_EXPLANATION: { label: "Résolu avec explication", isPositive: true },
  RESOLVED_NO_ACTION_NEEDED: { label: "Aucune action requise", isPositive: true },
  DUPLICATE: { label: "Doublon", isPositive: false },
  CANNOT_REPRODUCE: { label: "Non reproductible", isPositive: false },
  INVALID_REQUEST: { label: "Demande invalide", isPositive: false },
  SPAM: { label: "Spam", isPositive: false },
};

// =============================================================================
// SOURCE CONFIG
// =============================================================================

export const ticketSourceConfig: Record<TicketSource, { label: string }> = {
  APP: { label: "Application" },
  WEB: { label: "Web" },
  ADMIN: { label: "Admin" },
};

// =============================================================================
// TICKET ACTION CONFIG (for activity timeline)
// =============================================================================

export const ticketActionConfig: Record<
  TicketAction,
  { label: string; color: string }
> = {
  CREATED: { label: "Ticket créé", color: "text-primary" },
  STATUS_CHANGED: { label: "Statut modifié", color: "text-muted-foreground" },
  PRIORITY_CHANGED: { label: "Priorité modifiée", color: "text-warning" },
  ASSIGNED: { label: "Assigné", color: "text-success" },
  UNASSIGNED: { label: "Désassigné", color: "text-muted-foreground" },
  ESCALATED: { label: "Escaladé", color: "text-destructive" },
  SLA_BREACHED: { label: "SLA dépassé", color: "text-destructive" },
  RESOLVED: { label: "Résolu", color: "text-success" },
  CLOSED: { label: "Fermé", color: "text-muted-foreground" },
  REOPENED: { label: "Réouvert", color: "text-warning" },
  NOTE_ADDED: { label: "Note ajoutée", color: "text-primary" },
};
