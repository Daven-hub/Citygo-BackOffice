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
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileImage
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
import { kycStatusConfig,documentCategoryConfig } from "@/data/mockKYC";
import { Document } from "@/store/slices/document.slice";

interface KYCDocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onStatusChange?: (documentId: string, status: "APPROVED" | "REJECTED", reason?: string) => void;
  onNavigate?: (direction: "prev" | "next") => void;
  currentIndex?: number;
  totalDocuments?: number;
  readonly?: boolean;
}

export function KYCDocumentPreviewModal({
  open,
  onOpenChange,
  document,
  onStatusChange,
  onNavigate,
  currentIndex = 0,
  totalDocuments = 1,
  readonly = false
}: KYCDocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!document) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd MMMM yyyy 'à' HH:mm", { locale: fr });
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

  const isImage = document.mimeType?.startsWith("image/");
  const isPdf = document.mimeType === "application/pdf";
  const StateIcon = document.state === "APPROVED" ? CheckCircle : 
                    document.state === "REJECTED" ? XCircle : Clock;

  const categoryConfig = documentCategoryConfig[document.category] || { label: document.category, className: "bg-muted" };
  const stateConfig = kycStatusConfig[document.state];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0 bg-card border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileImage className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-md font-semibold text-foreground">{document.fileName}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", categoryConfig.className)}>
                  {categoryConfig.label}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", stateConfig.className)}>
                  <StateIcon className="w-3 h-3 mr-1" />
                  {stateConfig.label}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", stateConfig.className)}>
                  <StateIcon className="w-3 h-3 mr-1" />
                  {document.type}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Navigation */}
            {totalDocuments > 1 && (
              <div className="flex items-center gap-0 mr-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onNavigate?.("prev")}
                  disabled={currentIndex === 0}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                  {currentIndex + 1} / {totalDocuments}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onNavigate?.("next")}
                  disabled={currentIndex >= totalDocuments - 1}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-0 bg-muted rounded-lg p-1">
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
            {/* <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Télécharger
            </Button> */}
            <Button variant="outline" size="sm" className="gap-2 mr-4" asChild>
              <a href={document.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Ouvrir
              </a>
            </Button>
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
                    alt={document.fileName}
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
                  title={document.fileName}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <File className="w-24 h-24 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">{document.fileName}</p>
                  <p className="text-muted-foreground mb-4">Aperçu non disponible pour ce type de fichier</p>
                  {/* <Button variant="outline" className="gap-2" asChild>
                    <a href={document.url} download>
                      <Download className="w-4 h-4" />
                      Télécharger pour visualiser
                    </a>
                  </Button> */}
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
            <div className="p-4 space-y-1.5">
              <h3 className="font-semibold text-foreground">Informations du document</h3>
              
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Catégorie</p>
                  <Badge variant="outline" className={cn("mt-1", categoryConfig.className)}>
                    {categoryConfig.label}
                  </Badge>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Nom du fichier</p>
                  <p className="font-medium text-foreground text-xs">{document.fileName}</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Type MIME</p>
                  <p className="font-medium text-foreground text-sm font-mono">{document.mimeType}</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Propriétaire</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground text-sm">{document.owner.displayName}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <h3 className="font-semibold text-terciary/80">Suivi de révision</h3>

              <div className="space-y-2">
                {document.reviewedAt ? (
                  <>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Date de révision</p>
                      <p className="font-medium text-foreground text-sm">{formatDate(document.reviewedAt)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Révisé par</p>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                        <span className="font-medium text-foreground text-sm">{document.reviewedBy || "—"}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-warning" />
                      <p className="text-sm text-warning font-medium">En attente de révision</p>
                    </div>
                  </div>
                )}
              </div>

              {/* {document.state === "REJECTED" && document.rejectionReasons && (
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

              {/* {document.note && (
                <>
                  <Separator />
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Note</p>
                    <p className="text-sm text-foreground">{document.note}</p>
                  </div>
                </>
              )} */}

              {/* Actions */}
              {/* {!readonly && document.state === "PENDING" && onStatusChange && ( */}
                <>
                  <Separator />
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-foreground">Actions</h3>
                    
                    {showRejectForm ? (
                      <div className="space-y-2">
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
                          className="flex-1 py-4 border-destructive text-destructive hover:bg-destructive/10"
                          onClick={handleReject}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeter
                        </Button>
                        <Button 
                          size="sm"
                          className="flex-1 py-4 bg-success hover:bg-success/90 text-white"
                          onClick={handleApprove}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approuver
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              {/* )} */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
