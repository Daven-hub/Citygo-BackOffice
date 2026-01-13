import { useState } from "react";
import { CheckCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/store/hook";
import { ResolveTicket } from "@/store/slices/supportTicket.slice";
import { useToast } from "@/hook/use-toast";
import {
  SupportTicket,
  ResolutionCategory,
  resolutionCategoryConfig,
} from "@/types/supportTicket";

interface TicketResolveModalProps {
  readonly ticket: SupportTicket | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function TicketResolveModal({
  ticket,
  open,
  onOpenChange,
}: TicketResolveModalProps) {
  const [resolutionCategory, setResolutionCategory] = useState<ResolutionCategory | "">("");
  const [resolution, setResolution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleClose = () => {
    setResolutionCategory("");
    setResolution("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!ticket || !resolutionCategory || resolution.length < 10) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        ResolveTicket({
          ticketId: ticket.id,
          data: {
            resolutionCategory: resolutionCategory as ResolutionCategory,
            resolution,
          },
        })
      ).unwrap();

      toast({
        title: "Ticket résolu",
        description: `Le ticket ${ticket.ticketNumber} a été marqué comme résolu.`,
      });
      handleClose();
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

  const isValid = resolutionCategory && resolution.length >= 10;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <DialogTitle className="text-foreground">
                Résoudre le ticket
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {ticket?.ticketNumber} - {ticket?.subject}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Catégorie de résolution
            </Label>
            <Select
              value={resolutionCategory}
              onValueChange={(v) => setResolutionCategory(v as ResolutionCategory)}
            >
              <SelectTrigger className="border-border text-foreground">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent className="border-border">
                {Object.entries(resolutionCategoryConfig).map(([key, config]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="text-foreground"
                  >
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolution" className="text-foreground">
              Description de la résolution
            </Label>
            <Textarea
              id="resolution"
              placeholder="Décrivez comment le problème a été résolu (min. 10 caractères)..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="bg-background border-border text-foreground resize-none min-h-[120px]"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              {resolution.length}/10 caractères minimum
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="bg-success hover:bg-success/90"
          >
            {isSubmitting ? "Résolution..." : "Résoudre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
