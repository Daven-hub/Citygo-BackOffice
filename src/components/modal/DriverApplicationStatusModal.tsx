import { useState } from "react";
import { Check, Clock, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface DriverApplicationStatusModalProps {
  open: boolean;
  appLoading: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  currentStatus: "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";
  onSubmit: (data: { status: "APPROVED" | "REJECTED" | "UNDER_REVIEW"; reason: string }) => void;
}

export function DriverApplicationStatusModal({
  open,
  onOpenChange,
  applicationId,
  appLoading,
  currentStatus,
  onSubmit,
}: DriverApplicationStatusModalProps) {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED" | "UNDER_REVIEW">("APPROVED");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit({ status, reason });
    setReason("");
  };

  const statusR: Record<string, string> = {
    APPROVED: "Approuver",
    REJECTED: "Rejeter",
    UNDER_REVIEW: "En cour d'examen",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Mettre à jour le statut</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Candidature #{applicationId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <div className="space-y-1">
            <Label className="text-foreground">Nouveau statut</Label>
            <RadioGroup
              value={status}
              onValueChange={(value) => setStatus(value as "APPROVED" | "REJECTED" | "UNDER_REVIEW")}
              className="grid grid-cols-2 gap-4"
            >
              {/* <div>
                <RadioGroupItem value="UNDER_REVIEW" id="under_review" className="peer sr-only" />
                <Label
                  htmlFor="under_review"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card px-4 py-3.5 cursor-pointer transition-all",
                    "peer-checked:border-warning peer-checked:bg-warning/10"
                  )}
                >
                  <Clock className="w-6 h-6 text-warning mb-2" />
                  <span className="font-medium text-foreground">En cour d'examen</span>
                </Label>
              </div> */}
              <div>
                <RadioGroupItem value="APPROVED" id="approved" className="peer sr-only" />
                <Label
                  htmlFor="approved"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card px-4 py-3.5 cursor-pointer transition-all",
                    "peer-checked:border-success peer-checked:bg-success/10"
                  )}
                >
                  <Check className="w-6 h-6 text-success mb-2" />
                  <span className="font-medium text-foreground">Approuver</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="REJECTED" id="rejected" className="peer sr-only" />
                <Label
                  htmlFor="rejected"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card px-4 py-3.5 cursor-pointer transition-all",
                    "peer-checked:border-destructive peer-checked:bg-destructive/10"
                  )}
                >
                  <X className="w-6 h-6 text-destructive mb-2" />
                  <span className="font-medium text-foreground">Rejeter</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <Label htmlFor="reason" className="text-foreground">
              {status === "REJECTED" ? "Raison du rejet *" : "Commentaire (optionnel)"}
            </Label>
            <Textarea
              id="reason"
              placeholder={status === "REJECTED" 
                ? "Expliquez pourquoi la candidature est rejetée..." 
                : "Ajoutez un commentaire..."}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-background border-border min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={status === "REJECTED" && !reason.trim()}
            className={cn(
              status === "APPROVED" || status === "UNDER_REVIEW" 
                ? "bg-success hover:bg-success/90 text-white" 
                : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            )}
          >
            {appLoading?<Loader2 />:statusR[status]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
