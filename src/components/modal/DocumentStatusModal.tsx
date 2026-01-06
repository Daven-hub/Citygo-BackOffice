import { useEffect, useState } from "react";
import { Filter, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface DocumentStatusProps {
  open: boolean;
  appLoading: boolean;
  currentStatus?: string;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  //   currentStatus: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  onSubmit: (data: { state: string; reviewNote: string }) => void;
}

export function DocumentStatusModal({
  open,
  onOpenChange,
  documentId,
  appLoading,
  currentStatus,
  onSubmit,
}: DocumentStatusProps) {
  const [state, setState] = useState("");
  const [reviewNote, setReviewNote] = useState("");

  const handleSubmit = () => {
    onSubmit({ state, reviewNote });
    setReviewNote("");
    setState("");
  };

  useEffect(() => {
    setState(currentStatus)
  }, [currentStatus])

  const statusR: Record<string, string> = {
    APPROVED: "Approuver",
    REJECTED: "Rejeter",
    EXPIRED: "Expiré",
  };

  const stateStyles = {
    APPROVED: "text-emerald-600",
    REJECTED: "text-red-600",
    EXPIRED: "text-amber-600",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[95%] rounded-[6px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Mettre à jour le statut du document</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Document #{documentId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 py-1">
          <div className="space-y-0.5">
            <Label className="text-foreground">Sélectionner le statut</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger
                className="w-full gap-2 font-semibold rounded-lg border border-border px-3 py-2 text-sm
               hover:bg-muted/50 focus:ring-1 focus:ring-ring"
              >
                <div className="flex items-center gap-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />

                  <SelectValue
                    placeholder="Filtrer par état"
                    className={state ? stateStyles[state] : "text-muted-foreground"}
                  />
                </div>
              </SelectTrigger>

              <SelectContent
                className="rounded-lg border border-border shadow-lg
               scrollbar-thin scrollbar-thumb-muted-foreground/40"
              >
                <SelectItem value="APPROVED" className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600">Approuvé</span>
                </SelectItem>

                <SelectItem value="REJECTED" className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-red-600">Rejeté</span>
                </SelectItem>

                <SelectItem value="EXPIRED" className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-amber-600">Expiré</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="reviewNote" className="text-foreground">
              Notes
            </Label>
            <Textarea
              id="reviewNote"
              placeholder={"Entrez une note..."}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="bg-background border-border min-h-[120px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={state === "REJECTED" && !reviewNote.trim()}
            className={cn(
              state === "APPROVED" || state === "EXPIRED"
                ? "bg-success hover:bg-success/90 text-white"
                : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            )}
          >
            {appLoading ? <Loader2 /> : statusR[state]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
