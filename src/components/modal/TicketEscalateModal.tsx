import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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
import { useAppDispatch } from "@/store/hook";
import { EscalateTicket } from "@/store/slices/supportTicket.slice";
import { useToast } from "@/hook/use-toast";
import { SupportTicket } from "@/types/supportTicket";

interface TicketEscalateModalProps {
  readonly ticket: SupportTicket | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function TicketEscalateModal({
  ticket,
  open,
  onOpenChange,
}: TicketEscalateModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleClose = () => {
    setReason("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!ticket) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        EscalateTicket({
          ticketId: ticket.id,
          reason: reason || undefined,
        })
      ).unwrap();

      toast({
        title: "Ticket escaladé",
        description: `Le ticket ${ticket.ticketNumber} a été escaladé.`,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-warning/10">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <DialogTitle className="text-foreground">
                Escalader le ticket
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {ticket?.ticketNumber} - {ticket?.subject}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-xs text-warning">
            L'escalade transférera ce ticket à un niveau supérieur de support.
          </p>
        </div>

        <div className="space-y-2 py-2">
          <Label htmlFor="reason" className="text-foreground">
            Raison de l'escalade (optionnel)
          </Label>
          <Textarea
            id="reason"
            placeholder="Expliquez pourquoi ce ticket doit être escaladé..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="bg-background border-border text-foreground resize-none"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-warning hover:bg-warning/90 text-white"
          >
            {isSubmitting ? "Escalade..." : "Escalader"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
