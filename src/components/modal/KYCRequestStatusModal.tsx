import { useState } from "react";
import { Check, X, Plus, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface KYCRequestStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  currentStatus: "PENDING" | "APPROVED" | "REJECTED";
  onSubmit: (data: {
    status: "APPROVED" | "REJECTED";
    reasons: string[];
  }) => void;
}

export function KYCRequestStatusModal({
  open,
  onOpenChange,
  requestId,
  currentStatus,
  onSubmit,
}: KYCRequestStatusModalProps) {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reasons, setReasons] = useState<string[]>([]);
  const [newReason, setNewReason] = useState("");

  const addReason = () => {
    const value = newReason.trim();
    if (!value || reasons.includes(value)) return;

    setReasons((prev) => [...prev, value]);
    setNewReason("");
  };

  const removeReason = (index: number) => {
    setReasons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit({
      status,
      reasons,
    });

    setReasons([]);
    setNewReason("");
    onOpenChange(false);
  };

  const isRejectInvalid = status === "REJECTED" && reasons.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Mettre à jour le statut KYC</DialogTitle>
          <DialogDescription>
            Demande #{requestId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* STATUS */}
          <div className="space-y-1">
            <Label>Nouveau statut</Label>

            <RadioGroup
              value={status}
              onValueChange={(value) =>
                setStatus(value as "APPROVED" | "REJECTED")
              }
              className="grid grid-cols-2 gap-4"
            >
              {/* APPROVED */}
              <div>
                <RadioGroupItem
                  value="APPROVED"
                  id="kyc-approved"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="kyc-approved"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                    "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground"
                  )}
                >
                  <Check className="w-6 h-6 mb-1" />
                  <span className="font-medium">Valider</span>
                </Label>
              </div>

              {/* REJECTED */}
              <div>
                <RadioGroupItem
                  value="REJECTED"
                  id="kyc-rejected"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="kyc-rejected"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                    "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground"
                  )}
                >
                  <X className="w-6 h-6 mb-1" />
                  <span className="font-medium">Rejeter</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* REASONS INPUT */}
          {status === "REJECTED" && (
            <div className="space-y-3">
              <Label>
                Raisons du rejet <span className="text-destructive">*</span>
              </Label>

              <div className="flex gap-2">
                <Input
                  placeholder="Entrer une raison"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addReason()}
                />
                <Button type="button" onClick={addReason} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* REASONS LIST */}
              {reasons.length > 0 && (
                <ul className="space-y-2">
                  {reasons.map((reason, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-md border p-3 bg-card"
                    >
                      <span className="text-sm">{reason}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeReason(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isRejectInvalid}
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
