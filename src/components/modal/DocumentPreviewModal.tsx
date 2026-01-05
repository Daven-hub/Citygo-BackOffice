import { useState } from "react";
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  CheckCircle, 
  XCircle,
  FileText,
  Image,
  File,
  ExternalLink,
  Calendar,
  User,
  Shield,
  ClipboardCheck,
  AlertTriangle,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Document } from "@/store/slices/document.slice";

interface DocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onStatusChange?: (documentId: string, status: "APPROVED" | "REJECTED", reason?: string) => void;
  readonly?: boolean;
}

const statusConfig = {
  PENDING: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  APPROVED: { label: "Approuvé", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  REJECTED: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle }
};

const documentTypeIcons: Record<string, typeof FileText> = {
  INSURANCE: Shield,
  REGISTRATION: FileText,
  INSPECTION: ClipboardCheck,
  identity: FileText,
  address: FileText,
  driver_license: FileText,
  license: FileText,
  OTHER: File,
};

export function DocumentPreviewModal({
  open,
  onOpenChange,
  document,
  onStatusChange,
  readonly = false
}: DocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!document) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleApprove = () => {
    onStatusChange?.(document.documentId, "APPROVED");
    onOpenChange(false);
  };

  const handleReject = () => {
    if (showRejectForm && rejectionReason.trim()) {
      onStatusChange?.(document.documentId, "REJECTED", rejectionReason);
      setRejectionReason("");
      setShowRejectForm(false);
      onOpenChange(false);
    } else {
      setShowRejectForm(true);
    }
  };

  const isImage = document.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = document.url?.match(/\.pdf$/i);
  const StatusIcon = statusConfig[document.state]?.icon || Clock;
  const DocIcon = documentTypeIcons[document.type] || File;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 bg-card border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <DocIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground">{document.owner.displayName}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", statusConfig[document.state]?.className)}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig[document.state]?.label}
                </Badge>
                {document.expiryDate && (
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    new Date(document.expiryDate) < new Date() 
                      ? "bg-destructive/10 text-destructive border-destructive/20" 
                      : "bg-muted text-muted-foreground border-border"
                  )}>
                    <Calendar className="w-3 h-3 mr-1" />
                    Expire le {formatDate(document.expiryDate)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-2 min-w-[50px] text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button variant="ghost" size="icon" onClick={handleRotate} className="h-8 w-8">
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Télécharger
            </Button>
            {/* <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Ouvrir
            </Button> */}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Preview Area */}
          <div className="flex-1 bg-muted/20 overflow-auto flex items-center justify-center p-6">
            {document.url ? (
              isImage ? (
                <div className="relative">
                  <img 
                    src={document.url} 
                    alt={document.owner.displayName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-200"
                    style={{ 
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    }}
                  />
                </div>
              ) : isPdf ? (
                <iframe 
                  src={document.url}
                  className="w-full h-full rounded-lg border border-border"
                  title={document.owner.displayName}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <File className="w-24 h-24 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">{document.owner.displayName}</p>
                  <p className="text-muted-foreground mb-4">Aperçu non disponible pour ce type de fichier</p>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Télécharger pour visualiser
                  </Button>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <Image className="w-24 h-24 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">Document non disponible</p>
                <p className="text-sm text-muted-foreground">L'aperçu du document n'est pas encore disponible</p>
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="w-80 border-l border-border bg-card overflow-y-auto">
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Informations</h3>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Type de document</p>
                  <p className="font-medium text-foreground text-sm capitalize">{document.type.replace(/_/g, ' ')}</p>
                </div>
                
                {document.createdAt && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Date d'upload</p>
                    <p className="font-medium text-foreground text-sm">{formatDate(document.createdAt)}</p>
                  </div>
                )}
                
                {document.expiryDate && (
                  <div className={cn(
                    "p-3 rounded-lg border",
                    new Date(document.expiryDate) < new Date() 
                      ? "bg-destructive/5 border-destructive/20" 
                      : "bg-muted/50 border-border"
                  )}>
                    <p className="text-xs text-muted-foreground mb-1">Date d'expiration</p>
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "font-medium text-sm",
                        new Date(document.expiryDate) < new Date() ? "text-destructive" : "text-foreground"
                      )}>
                        {formatDate(document.expiryDate)}
                      </p>
                      {new Date(document.expiryDate) < new Date() && (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                )}

                {document.reviewedAt && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Date de révision</p>
                    <p className="font-medium text-foreground text-sm">{formatDate(document.reviewedAt)}</p>
                    {document.reviewedBy && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {document.reviewedBy}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* {document.state === "REJECTED" && document.rejectionReason && (
                <>
                  <Separator />
                  <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <p className="text-xs text-destructive mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Raison du rejet
                    </p>
                    <p className="text-sm text-foreground">{document.rejectionReason}</p>
                  </div>
                </>
              )} */}

              {/* Actions */}
              {!readonly && document.state === "PENDING" && onStatusChange && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Actions</h3>
                    
                    {showRejectForm ? (
                      <div className="space-y-3">
                        <Label className="text-sm text-muted-foreground">Raison du rejet</Label>
                        <Textarea 
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Expliquez pourquoi le document est rejeté..."
                          className="min-h-[100px] bg-background"
                        />
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => setShowRejectForm(false)}
                          >
                            Annuler
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="flex-1"
                            onClick={handleReject}
                            disabled={!rejectionReason.trim()}
                          >
                            Confirmer
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                          onClick={handleReject}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeter
                        </Button>
                        <Button 
                          size="sm"
                          className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                          onClick={handleApprove}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approuver
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}