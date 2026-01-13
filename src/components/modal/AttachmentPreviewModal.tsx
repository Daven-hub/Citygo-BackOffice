import { useState, useEffect } from "react";
import { Download, FileText, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Attachment } from "@/types/supportTicket";
import supportTicketService from "@/services/supportTicketService";
import { useToast } from "@/hook/use-toast";

interface AttachmentPreviewModalProps {
  readonly attachment: Attachment | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function AttachmentPreviewModal({
  attachment,
  open,
  onOpenChange,
}: AttachmentPreviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && attachment) {
      fetchPreviewUrl();
    } else {
      setPreviewUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, attachment]);

  const fetchPreviewUrl = async () => {
    if (!attachment) return;

    setLoading(true);
    try {
      const response = await supportTicketService.getAttachmentDownloadUrl(attachment.id);
      if (response.success && response.data?.downloadUrl) {
        setPreviewUrl(response.data.downloadUrl);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'aperçu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  // Check using boolean flags OR mimeType as fallback
  const isImage = attachment?.isImage || attachment?.mimeType?.startsWith("image/");
  const isPdf = attachment?.isPdf || attachment?.mimeType === "application/pdf";
  const canPreview = isImage || isPdf;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!previewUrl) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <p className="text-muted-foreground">Impossible de charger l'aperçu</p>
        </div>
      );
    }

    if (canPreview && isImage) {
      return (
        <div className="flex items-center justify-center p-4 h-full">
          <img
            src={previewUrl}
            alt={attachment?.fileName}
            className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
          />
        </div>
      );
    }

    if (canPreview && isPdf) {
      return (
        <iframe
          src={previewUrl}
          className="w-full h-[60vh] border-0"
          title={attachment?.fileName}
        />
      );
    }

    // Non-previewable file
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          {attachment?.mimeType?.includes("word") ||
          attachment?.mimeType?.includes("document") ? (
            <FileText className="w-10 h-10 text-primary" />
          ) : (
            <File className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Aperçu non disponible
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Ce type de fichier ne peut pas être prévisualisé directement.
          Vous pouvez le télécharger pour le consulter.
        </p>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Télécharger le fichier
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col bg-card border-border p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground truncate pr-4">
              {attachment?.fileName}
            </DialogTitle>
          </div>
          {attachment && (
            <p className="text-sm text-muted-foreground mt-1">
              {attachment.formattedSize} • {attachment.mimeType}
            </p>
          )}
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto min-h-[300px] bg-muted/30">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
