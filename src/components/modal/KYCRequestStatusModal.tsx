import { useState } from "react";
import { Check, X } from "lucide-react";
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

interface KYCRequestStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  currentStatus: "PENDING" | "APPROVED" | "REJECTED";
  onSubmit: (data: { status: "APPROVED" | "REJECTED"; reason: string }) => void;
}

export function KYCRequestStatusModal({
  open,
  onOpenChange,
  requestId,
  currentStatus,
  onSubmit,
}: KYCRequestStatusModalProps) {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit({ status, reason });
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Mettre à jour le statut KYC</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Demande #{requestId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <div className="space-y-1">
            <Label className="text-foreground">Nouveau statut</Label>
            <RadioGroup
              value={status}
              onValueChange={(value) => setStatus(value as "APPROVED" | "REJECTED")}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="APPROVED" id="kyc-approved" className="peer sr-only" />
                <Label
                  htmlFor="kyc-approved"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card p-4 cursor-pointer transition-all",
                    "peer-checked:border-success peer-checked:bg-success/10"
                  )}
                >
                  <Check className="w-6 h-6 text-success mb-1" />
                  <span className="font-medium text-foreground">Valider</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="REJECTED" id="kyc-rejected" className="peer sr-only" />
                <Label
                  htmlFor="kyc-rejected"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card p-4 cursor-pointer transition-all",
                    "peer-checked:border-destructive peer-checked:bg-destructive/10"
                  )}
                >
                  <X className="w-6 h-6 text-destructive mb-1" />
                  <span className="font-medium text-foreground">Rejeter</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <Label htmlFor="kyc-reason" className="text-foreground">
              {status === "REJECTED" ? "Raison du rejet *" : "Commentaire (optionnel)"}
            </Label>
            <Textarea
              id="kyc-reason"
              placeholder={status === "REJECTED" 
                ? "Expliquez pourquoi la demande est rejetée..." 
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
              status === "APPROVED" 
                ? "bg-success hover:bg-success/90 text-white" 
                : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            )}
          >
            {status === "APPROVED" ? "Valider" : "Rejeter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
