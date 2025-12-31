import { useState } from "react";
import { Filter, Loader2} from "lucide-react";
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
  onOpenChange: (open: boolean) => void;
  documentId: string;
//   currentStatus: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  onSubmit: (data: { state:string; reviewNote: string }) => void;
}

export function DocumentStatusModal({
  open,
  onOpenChange,
  documentId,
  appLoading,
//   currentStatus,
  onSubmit,
}: DocumentStatusProps) {
  const [state, setState] = useState("APPROVED");
  const [reviewNote, setReviewNote] = useState("");

  const handleSubmit = () => {
    onSubmit({ state, reviewNote });
    setReviewNote("");
    setState("APPROVED");
  };

  const statusR: Record<string, string> = {
    APPROVED: "Approuver",
    REJECTED: "Rejeter",
    EXPIRED: "Expiré",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
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
                  <SelectTrigger className="w-full border-border text-foreground">
                    <Filter className="h-4 w-4 mr-0.5 text-muted-foreground" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    <SelectItem value="APPROVED" className="text-success">Approuvé</SelectItem>
                    <SelectItem value="REJECTED" className="text-destructive">Rejété</SelectItem>
                    <SelectItem value="EXPIRED" className="text-warning">Expiré</SelectItem>
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
            {appLoading?<Loader2 />:statusR[state]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
