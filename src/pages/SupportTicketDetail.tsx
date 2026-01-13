import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlayCircle,
  MessageSquare,
  FileText,
  ExternalLink,
  Paperclip,
  Download,
  Image,
  File,
  Upload,
  Plus,
  Loader2,
  Pencil,
  X,
  Send,
  History,
  UserPlus,
  UserMinus,
  ArrowUp,
  RotateCcw,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  GetTicketById,
  StartTicketProgress,
  AwaitCustomerResponse,
  CloseTicket,
  AssignTicket,
  AddNote,
  clearSelectedTicket,
} from "@/store/slices/supportTicket.slice";
import { Textarea } from "@/components/ui/textarea";
import LoaderUltra from "@/components/ui/loaderUltra";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/fr";
import { useToast } from "@/hook/use-toast";
import {
  ticketStatusConfig,
  ticketPriorityConfig,
  ticketCategoryConfig,
  ticketSourceConfig,
  resolutionCategoryConfig,
  ticketActionConfig,
  Attachment,
  TicketHistoryEntry,
  TicketAction,
} from "@/types/supportTicket";
import {TicketResolveModal} from "@/components/modal/TicketResolveModal";
import {TicketEscalateModal} from "@/components/modal/TicketEscalateModal";
import {AttachmentPreviewModal} from "@/components/modal/AttachmentPreviewModal";
import userService from "@/services/userService";
import supportTicketService from "@/services/supportTicketService";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("fr");

export default function SupportTicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; displayName: string }>>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [assigningTicket, setAssigningTicket] = useState(false);
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [ticketHistory, setTicketHistory] = useState<TicketHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ticketId) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10 MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const response = await supportTicketService.addAttachment(ticketId, file);
      if (response.success) {
        toast({
          title: "Fichier ajouté",
          description: "La pièce jointe a été ajoutée avec succès",
        });
        // Refresh ticket data
        dispatch(GetTicketById(ticketId));
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la pièce jointe",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const { selectedTicket: ticket } = useAppSelector(
    (state) => state.supportTicket
  );

  // Filter history into notes and activities
  const notes = ticketHistory.filter((entry) => entry.action === "NOTE_ADDED");
  const activities = ticketHistory.filter((entry) => entry.action !== "NOTE_ADDED");

  // Fetch admin users for assignment dropdown
  const fetchAdminUsers = async () => {
    setLoadingAdmins(true);
    try {
      const response = await userService.getAdminUsers(0, 100);
      if (response.success && response.data?.content) {
        setAdminUsers(response.data.content.map((u: { id: string; displayName: string }) => ({
          id: u.id,
          displayName: u.displayName || "Admin"
        })));
      }
    } catch {
      // Silently fail - admins list is optional
    } finally {
      setLoadingAdmins(false);
    }
  };

  // Handle ticket assignment
  const handleAssignTicket = async (adminId: string) => {
    if (!ticketId || assigningTicket) return;
    setAssigningTicket(true);
    try {
      await dispatch(AssignTicket({ ticketId, assignedTo: adminId })).unwrap();
      const adminName = adminUsers.find(a => a.id === adminId)?.displayName || "l'administrateur";
      toast({
        title: "Ticket assigné",
        description: `Le ticket a été assigné à ${adminName}.`,
      });
      setEditingAssignee(false);
      // Refresh history to show new assignment
      fetchTicketHistory();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error?.toString() || "Impossible d'assigner le ticket",
        variant: "destructive",
      });
    } finally {
      setAssigningTicket(false);
    }
  };

  // Handle adding note
  const handleAddNote = async () => {
    if (!ticketId || !noteText.trim() || addingNote) return;
    setAddingNote(true);
    try {
      await dispatch(AddNote({ ticketId, note: noteText.trim() })).unwrap();
      toast({
        title: "Note ajoutée",
        description: "La note a été ajoutée avec succès.",
      });
      setNoteText("");
      // Refresh history to show new note
      fetchTicketHistory();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error?.toString() || "Impossible d'ajouter la note",
        variant: "destructive",
      });
    } finally {
      setAddingNote(false);
    }
  };

  // Fetch ticket history (activity timeline) from real API
  const fetchTicketHistory = async () => {
    if (!ticketId) return;
    setLoadingHistory(true);

    try {
      const response = await supportTicketService.getTicketHistory(ticketId);
      if (response.success && response.data?.content) {
        // Build a map of known users for name resolution
        const userMap: Record<string, string> = {};

        // Add admin users
        adminUsers.forEach((admin) => {
          userMap[admin.id] = admin.displayName;
        });

        // Add reporter and assignee from ticket
        if (ticket?.reporter) {
          userMap[ticket.reporter.userId] = ticket.reporter.displayName;
        }
        if (ticket?.assignedTo) {
          userMap[ticket.assignedTo.userId] = ticket.assignedTo.displayName;
        }

        // System actor ID
        const SYSTEM_ACTOR_ID = "00000000-0000-0000-0000-000000000000";
        userMap[SYSTEM_ACTOR_ID] = "Système";

        // Map API response to our TicketHistoryEntry type
        const history: TicketHistoryEntry[] = response.data.content.map(
          (entry: {
            id: string;
            ticketId: string;
            actorId: string;
            action: TicketAction;
            previousValue?: string;
            newValue?: string;
            comment?: string;
            occurredAt: string;
          }) => ({
            id: entry.id,
            ticketId: entry.ticketId,
            actorId: entry.actorId,
            actorName: userMap[entry.actorId] || "Utilisateur",
            action: entry.action,
            previousValue: entry.previousValue,
            newValue: entry.newValue,
            comment: entry.comment,
            occurredAt: entry.occurredAt,
          })
        );

        setTicketHistory(history);
      }
    } catch (error) {
      console.error("Failed to fetch ticket history:", error);
      // Set empty history on error
      setTicketHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Get icon for history action
  const getActionIcon = (action: TicketAction) => {
    switch (action) {
      case "CREATED":
        return <Plus className="w-4 h-4" />;
      case "STATUS_CHANGED":
        return <Clock className="w-4 h-4" />;
      case "PRIORITY_CHANGED":
        return <ArrowUp className="w-4 h-4" />;
      case "ASSIGNED":
        return <UserPlus className="w-4 h-4" />;
      case "UNASSIGNED":
        return <UserMinus className="w-4 h-4" />;
      case "ESCALATED":
        return <AlertTriangle className="w-4 h-4" />;
      case "SLA_BREACHED":
        return <AlertTriangle className="w-4 h-4" />;
      case "RESOLVED":
        return <CheckCircle className="w-4 h-4" />;
      case "CLOSED":
        return <XCircle className="w-4 h-4" />;
      case "REOPENED":
        return <RotateCcw className="w-4 h-4" />;
      case "NOTE_ADDED":
        return <StickyNote className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!ticketId) return;
      const start = performance.now();
      await Promise.all([
        dispatch(GetTicketById(ticketId)),
        fetchAdminUsers()
      ]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();

    return () => {
      dispatch(clearSelectedTicket());
    };
  }, [dispatch, ticketId]);

  // Fetch history when ticket is loaded
  useEffect(() => {
    if (ticket) {
      fetchTicketHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, ticket?.id, adminUsers.length]);

  // Action handlers
  const handleStartProgress = async () => {
    if (!ticket) return;
    setLoading(true);
    try {
      await dispatch(StartTicketProgress(ticket.id)).unwrap();
      toast({
        title: "Ticket pris en charge",
        description: `Le ticket ${ticket.ticketNumber} vous a été assigné.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error?.toString(),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAwaitCustomer = async () => {
    if (!ticket) return;
    setLoading(true);
    try {
      await dispatch(AwaitCustomerResponse(ticket.id)).unwrap();
      toast({
        title: "En attente du client",
        description: `Le ticket ${ticket.ticketNumber} est en attente de réponse client.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error?.toString(),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (!ticket) return;
    setLoading(true);
    try {
      await dispatch(CloseTicket(ticket.id)).unwrap();
      toast({
        title: "Ticket fermé",
        description: `Le ticket ${ticket.ticketNumber} a été fermé.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error?.toString(),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoaderUltra loading={isLoading} duration={duration}/>;
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Ticket non trouvé</p>
        <Button onClick={() => navigate("/support")}>Retour à la liste</Button>
      </div>
    );
  }

  const statusConf = ticketStatusConfig[ticket.status];
  const priorityConf = ticketPriorityConfig[ticket.priority];
  const categoryConf = ticketCategoryConfig[ticket.category];
  const sourceConf = ticketSourceConfig[ticket.source || "APP"];
  const CategoryIcon = categoryConf?.icon || FileText;
  const StatusIcon = statusConf?.icon || Clock;

  // Calculate SLA remaining time
  const slaRemaining = ticket.resolutionDueAt
    ? dayjs.utc(ticket.resolutionDueAt).local().diff(dayjs(), "hour")
    : null;
  const slaIsNear = slaRemaining !== null && slaRemaining > 0 && slaRemaining < 4;

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={() => navigate("/support")}
        className="flex text-sm items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux tickets
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">
              {ticket.ticketNumber}
            </h1>
            <Badge
              variant="outline"
              className={cn("font-medium", priorityConf?.className)}
            >
              {priorityConf?.label}
            </Badge>
            <Badge
              variant="outline"
              className={cn("font-medium", statusConf?.className)}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConf?.label}
            </Badge>
          </div>
          <h2 className="text-lg text-foreground">{ticket.subject}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CategoryIcon className="w-4 h-4" />
              {categoryConf?.label}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {dayjs.utc(ticket.createdAt).local().format("DD MMM YYYY à HH:mm")}
            </span>
            {ticket.source && (
              <span className="flex items-center gap-1">
                Source: {sourceConf?.label}
              </span>
            )}
          </div>
        </div>

        {/* SLA indicator */}
        {slaRemaining !== null && !ticket.slaBreached && ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg",
              slaIsNear
                ? "bg-warning/10 text-warning"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              SLA: {slaRemaining}h restantes
            </span>
          </div>
        )}
        {ticket.slaBreached && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">SLA dépassé</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {ticket.status === "OPEN" && (
          <Button
            onClick={handleStartProgress}
            disabled={loading}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Prendre en charge
          </Button>
        )}
        {ticket.status === "IN_PROGRESS" && (
          <>
            <Button
              onClick={handleAwaitCustomer}
              disabled={loading}
              variant="outline"
            >
              <User className="w-4 h-4 mr-2" />
              Attendre client
            </Button>
            <Button
              onClick={() => setEscalateModalOpen(true)}
              disabled={loading}
              variant="outline"
              className="border-warning text-warning hover:bg-warning/10"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Escalader
            </Button>
            <Button
              onClick={() => setResolveModalOpen(true)}
              disabled={loading}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Résoudre
            </Button>
          </>
        )}
        {(ticket.status === "RESOLVED" ||
          ticket.status === "AWAITING_CUSTOMER") && (
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outline"
            className="border-muted-foreground"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Fermer le ticket
          </Button>
        )}
      </div>

      <Separator />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Pièces jointes
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {ticket.attachments.length}
                    </Badge>
                  )}
                </CardTitle>
                {ticket.status !== "CLOSED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {uploading ? "Envoi..." : "Ajouter"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              {ticket.attachments && ticket.attachments.length > 0 ? (
                <div className="space-y-2">
                  {ticket.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      role="button"
                      tabIndex={0}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedAttachment(attachment);
                        setPreviewModalOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedAttachment(attachment);
                          setPreviewModalOpen(true);
                        }
                      }}
                    >
                      {attachment.isImage ? (
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <Image className="w-5 h-5 text-primary" />
                        </div>
                      ) : attachment.isPdf ? (
                        <div className="w-10 h-10 rounded bg-destructive/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-destructive" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <File className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {attachment.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.formattedSize} • {dayjs.utc(attachment.uploadedAt).local().fromNow()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const response = await supportTicketService.getAttachmentDownloadUrl(attachment.id);
                            if (response.success && response.data?.downloadUrl) {
                              window.open(response.data.downloadUrl, "_blank");
                            }
                          } catch (error) {
                            toast({
                              title: "Erreur",
                              description: "Impossible de télécharger le fichier",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  role={ticket.status !== "CLOSED" ? "button" : undefined}
                  tabIndex={ticket.status !== "CLOSED" ? 0 : undefined}
                  className={cn(
                    "border-2 border-dashed border-border rounded-lg p-6 text-center",
                    ticket.status !== "CLOSED" && "cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  )}
                  onClick={() => ticket.status !== "CLOSED" && fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (ticket.status !== "CLOSED" && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {ticket.status === "CLOSED"
                      ? "Aucune pièce jointe"
                      : "Cliquez pour ajouter des fichiers"}
                  </p>
                  {ticket.status !== "CLOSED" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 10 MB par fichier
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resolution (if resolved) */}
          {ticket.resolution && (
            <Card className="border-success/30 bg-success/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-success">
                  <CheckCircle className="w-4 h-4" />
                  Résolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ticket.resolutionCategory && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      resolutionCategoryConfig[ticket.resolutionCategory]
                        ?.isPositive
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {resolutionCategoryConfig[ticket.resolutionCategory]?.label}
                  </Badge>
                )}
                <p className="text-foreground whitespace-pre-wrap">
                  {ticket.resolution}
                </p>
                {ticket.resolvedAt && (
                  <p className="text-sm text-muted-foreground">
                    Résolu le {dayjs.utc(ticket.resolvedAt).local().format("DD MMM YYYY à HH:mm")}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Customer satisfaction */}
          {ticket.customerSatisfaction && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Satisfaction client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={cn(
                        "text-xl",
                        star <= (ticket.customerSatisfaction ?? 0)
                          ? "text-warning"
                          : "text-muted"
                      )}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-foreground font-medium ml-2">
                    {ticket.customerSatisfaction}/5
                  </span>
                </div>
                {ticket.feedbackComment && (
                  <p className="mt-3 text-muted-foreground italic">
                    "{ticket.feedbackComment}"
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes Panel */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                Notes internes
                {notes.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {notes.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Note Form */}
              {ticket.status !== "CLOSED" && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Écrivez une note interne pour le suivi du ticket..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="min-h-[80px] resize-none border-border"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddNote}
                      disabled={addingNote || !noteText.trim()}
                      size="sm"
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      {addingNote ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {addingNote ? "Envoi..." : "Ajouter"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Notes List */}
              {ticket.status !== "CLOSED" && notes.length > 0 && (
                <Separator />
              )}

              {loadingHistory ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-muted/50 rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {note.actorName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">
                            {note.actorName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {dayjs.utc(note.occurredAt).local().fromNow()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {note.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Aucune note pour ce ticket
                </p>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <History className="w-4 h-4" />
                Historique d'activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : activities.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-4">
                    {activities.map((entry) => {
                      const actionConf = ticketActionConfig[entry.action];
                      return (
                        <div
                          key={entry.id}
                          className="relative flex gap-4 pl-0"
                        >
                          {/* Timeline dot */}
                          <div
                            className={cn(
                              "relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2",
                              entry.action === "SLA_BREACHED" ? "border-destructive" :
                              entry.action === "ESCALATED" ? "border-warning" :
                              entry.action === "RESOLVED" ? "border-success" :
                              entry.action === "CREATED" ? "border-primary" :
                              "border-border"
                            )}
                          >
                            <span className={cn(
                              entry.action === "SLA_BREACHED" ? "text-destructive" :
                              entry.action === "ESCALATED" ? "text-warning" :
                              entry.action === "RESOLVED" ? "text-success" :
                              entry.action === "CREATED" ? "text-primary" :
                              "text-muted-foreground"
                            )}>
                              {getActionIcon(entry.action)}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className={cn("font-medium text-sm", actionConf?.color || "text-foreground")}>
                                  {actionConf?.label || entry.action}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  par {entry.actorName || "Inconnu"}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {dayjs.utc(entry.occurredAt).local().fromNow()}
                              </span>
                            </div>
                            {entry.comment && (
                              <p className="mt-2 text-sm text-foreground bg-muted/50 rounded-lg p-3">
                                {entry.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">
                  Aucune activité enregistrée
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter info */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Reporter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={ticket.reporter?.avatarUrl}
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {ticket.reporter?.displayName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {ticket.reporter?.displayName}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  navigate(`/utilisateurs/${ticket.reporter?.userId}`)
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Voir le profil
              </Button>
            </CardContent>
          </Card>

          {/* Assigned to */}
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">Assigné à</CardTitle>
              {ticket.status !== "CLOSED" && ticket.status !== "RESOLVED" && !editingAssignee && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setEditingAssignee(true)}
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
              {editingAssignee && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setEditingAssignee(false)}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {editingAssignee && ticket.status !== "CLOSED" && ticket.status !== "RESOLVED" ? (
                <Select
                  value={ticket.assignedTo?.userId || ""}
                  onValueChange={handleAssignTicket}
                  disabled={loadingAdmins || assigningTicket}
                >
                  <SelectTrigger className="border-border text-foreground">
                    <SelectValue placeholder={loadingAdmins ? "Chargement..." : "Sélectionner un admin"} />
                  </SelectTrigger>
                  <SelectContent className="border-border max-h-[300px]">
                    {adminUsers.map((admin) => (
                      <SelectItem
                        key={admin.id}
                        value={admin.id}
                        className="text-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-secondary/10 text-secondary text-xs font-medium">
                              {admin.displayName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{admin.displayName}</span>
                          {ticket.assignedTo?.userId === admin.id && (
                            <span className="text-xs text-muted-foreground">(actuel)</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : ticket.assignedTo ? (
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-secondary/10 text-secondary font-medium">
                      {ticket.assignedTo.displayName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {ticket.assignedTo.displayName}
                    </p>
                    {ticket.assignedAt && (
                      <p className="text-xs text-muted-foreground">
                        Depuis {dayjs.utc(ticket.assignedAt).local().fromNow()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground italic">Non assigné</p>
              )}
            </CardContent>
          </Card>

          {/* Ticket details */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID</span>
                <span className="text-foreground font-mono text-xs">
                  {ticket.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Créé</span>
                <span className="text-foreground">
                  {dayjs.utc(ticket.createdAt).local().format("DD/MM/YY HH:mm")}
                </span>
              </div>
              {ticket.lastActivityAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dernière activité</span>
                  <span className="text-foreground">
                    {dayjs.utc(ticket.lastActivityAt).local().fromNow()}
                  </span>
                </div>
              )}
              {ticket.escalationLevel !== undefined && ticket.escalationLevel > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Niveau escalade</span>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive">
                    Niveau {ticket.escalationLevel}
                  </Badge>
                </div>
              )}
              {ticket.reopenCount !== undefined && ticket.reopenCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Réouvertures</span>
                  <span className="text-foreground">{ticket.reopenCount}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Context link */}
          {ticket.contextType && ticket.contextType !== "NONE" && ticket.contextId && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Contexte</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Navigate based on context type
                    if (ticket.contextType === "RIDE") {
                      navigate(`/trajets/${ticket.contextId}`);
                    } else if (ticket.contextType === "BOOKING") {
                      navigate(`/reservations/${ticket.contextId}`);
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Voir {ticket.contextType === "RIDE" ? "le trajet" : "la réservation"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <TicketResolveModal
        ticket={ticket}
        open={resolveModalOpen}
        onOpenChange={setResolveModalOpen}
      />
      <TicketEscalateModal
        ticket={ticket}
        open={escalateModalOpen}
        onOpenChange={setEscalateModalOpen}
      />

      <AttachmentPreviewModal
        attachment={selectedAttachment}
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
      />
    </div>
  );
}
