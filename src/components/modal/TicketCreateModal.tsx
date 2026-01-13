import { useState, useRef } from "react";
import { Beaker, Upload, X, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/store/hook";
import { CreateTicket } from "@/store/slices/supportTicket.slice";
import { useToast } from "@/hook/use-toast";
import {
  TicketCategory,
  ticketCategoryConfig,
} from "@/types/supportTicket";

interface TicketCreateModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess?: () => void;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function TicketCreateModal({
  open,
  onOpenChange,
  onSuccess,
}: TicketCreateModalProps) {
  const [category, setCategory] = useState<TicketCategory | "">("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleClose = () => {
    setCategory("");
    setSubject("");
    setDescription("");
    setFiles([]);
    onOpenChange(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Filter valid files
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 10 MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    // Check max files limit
    const newFiles = [...files, ...validFiles].slice(0, MAX_FILES);
    if (files.length + validFiles.length > MAX_FILES) {
      toast({
        title: "Limite atteinte",
        description: `Maximum ${MAX_FILES} fichiers autorisés`,
        variant: "destructive",
      });
    }

    setFiles(newFiles);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImageFile = (file: File) => file.type.startsWith("image/");

  const handleSubmit = async () => {
    if (!category || subject.length < 5 || description.length < 20) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        CreateTicket({
          data: {
            category: category as TicketCategory,
            subject,
            description,
            source: "ADMIN",
          },
          files: files.length > 0 ? files : undefined,
        })
      ).unwrap();

      toast({
        title: "Ticket créé",
        description: files.length > 0
          ? `Le ticket de test a été créé avec ${files.length} fichier(s).`
          : "Le ticket de test a été créé avec succès.",
      });
      handleClose();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error?.toString(),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = category && subject.length >= 5 && description.length >= 20;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-warning/10">
              <Beaker className="w-5 h-5 text-warning" />
            </div>
            <div>
              <DialogTitle className="text-foreground flex items-center gap-2">
                Créer un ticket de test
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">
                  DEV
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Ce ticket sera créé pour tester les fonctionnalités de support.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Catégorie *
            </Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as TicketCategory)}
            >
              <SelectTrigger className="border-border text-foreground">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent className="border-border">
                {Object.entries(ticketCategoryConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key} className="text-foreground">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-foreground">
              Sujet *
            </Label>
            <Input
              id="subject"
              placeholder="Ex: Problème de paiement sur ma réservation"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              {subject.length}/5 caractères minimum
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème en détail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-border text-foreground resize-none min-h-[100px]"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/20 caractères minimum
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">
              Pièces jointes
              <span className="text-muted-foreground font-normal ml-1">(optionnel)</span>
            </Label>

            {/* Upload area */}
            <div
              role="button"
              tabIndex={0}
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour ajouter des fichiers
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max {MAX_FILES} fichiers, 10 MB chacun
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                {files.map((file, index) => (
                  <div
                    key={"file-" + index}
                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-md"
                  >
                    {isImageFile(file) ? (
                      <Image className="w-4 h-4 text-primary" />
                    ) : (
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="bg-warning hover:bg-warning/90 text-white"
          >
            {isSubmitting ? "Création..." : "Créer le ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
