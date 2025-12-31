import { useEffect, useState } from "react";
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
import { Document } from "@/store/slices/document.slice";

export interface KYCType {
    documentId: string;
    state: string;
    reviewNote: string;
  }
interface KYCRequestStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  loading: boolean;
  doc: Document[];
  userId:string;
  currentStatus: "PENDING" | "APPROVED" | "REJECTED";
  onSubmit: (data: {
    status: "APPROVED" | "REJECTED";
    rejectionReasons: string[];
    documentUpdates:KYCType[]
  }) => void;
}

export function KYCRequestStatusModal({
  open,
  loading,
  onOpenChange,
  requestId,
  doc,
  userId,
  currentStatus,
  onSubmit,
}: KYCRequestStatusModalProps) {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [rejectionReasons, setReason] = useState<string[]>([]);
  const [newReason, setNewReason] = useState("");
  const [documentUpdates, setDocumentUpdates] = useState<KYCType[]>([]);

  const addReason = () => {
    const value = newReason.trim();
    if (!value || rejectionReasons.includes(value)) return;

    setReason((prev) => [...prev, value]);
    setNewReason("");
  };
  useEffect(() => {
    const updates = doc
        .filter((x) => x?.ownerId === userId)
        .map((y) => ({
          documentId: y.documentId,
          state: y.state,
          reviewNote: y.reviewNote,
        }));
    setDocumentUpdates(updates);
  }, [doc, userId]);

  const removeReason = (index: number) => {
    setReason((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit({
      status,
      rejectionReasons,
      documentUpdates
    });

    // setReason([]);
    // setNewReason("");
    // onOpenChange(false);
  };

  const isRejectInvalid = status === "REJECTED" && rejectionReasons.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Mettre à jour le statut KYC</DialogTitle>
          <DialogDescription>
            Demande #{requestId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
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
            <div className="space-y-2.5">
              <div className="space-y-0.5">
              <Label>
                Raisons du rejet <span className="text-destructive">*</span>
              </Label>

              <div className="flex gap-2">
                <Input
                  placeholder="Entrer une raison"
                  className="py-2 h-8"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addReason()}
                />
                <Button type="button" className="h-8 text-white" onClick={addReason} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              </div>

              {/* REASONS LIST */}
              {rejectionReasons.length > 0 && (
                <ul className="space-y-0.5">
                  {rejectionReasons.map((reason, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-md border p-1.5 bg-card"
                    >
                      <span className="text-sm">{reason}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 !px-1"
                        onClick={() => removeReason(index)}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
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
            {loading?'Traitement...':status === "APPROVED" ? "Valider" : "Rejeter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
