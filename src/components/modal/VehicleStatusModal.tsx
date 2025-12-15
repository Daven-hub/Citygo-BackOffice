import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hook/use-toast";
import { Vehicle } from "@/data/mockVehicles";
import { CheckCircle, XCircle, Ban, PlayCircle } from "lucide-react";

interface VehicleStatusModalProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate?: (vehicleId: string, status: string, note: string) => void;
}

const statusOptions = [
  { value: "APPROVED", label: "Approuver", icon: CheckCircle, color: "text-success" },
  { value: "REJECTED", label: "Rejeter", icon: XCircle, color: "text-destructive" },
  { value: "SUSPENDED", label: "Suspendre", icon: Ban, color: "text-warning" },
  { value: "PENDING", label: "Réactiver", icon: PlayCircle, color: "text-primary" },
];

export function VehicleStatusModal({
  vehicle,
  open,
  onOpenChange,
  onStatusUpdate,
}: VehicleStatusModalProps) {
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!vehicle || !status) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onStatusUpdate?.(vehicle.vehicleId, status, note);

    toast({
      title: "Statut mis à jour",
      description: `Le véhicule ${vehicle.plate} a été mis à jour avec succès.`,
    });

    setIsSubmitting(false);
    setStatus("");
    setNote("");
    onOpenChange(false);
  };

  const availableStatuses = statusOptions.filter((opt) => {
    if (vehicle?.status === "SUSPENDED") {
      return opt.value === "PENDING" || opt.value === "APPROVED";
    }
    if (vehicle?.status === "APPROVED") {
      return opt.value === "SUSPENDED" || opt.value === "REJECTED";
    }
    if (vehicle?.status === "PENDING") {
      return opt.value === "APPROVED" || opt.value === "REJECTED";
    }
    if (vehicle?.status === "REJECTED") {
      return opt.value === "PENDING" || opt.value === "APPROVED";
    }
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Modifier le statut du véhicule</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {vehicle?.make} {vehicle?.model} - {vehicle?.plate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">Nouveau statut</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-border text-foreground">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent className="border-border">
                {availableStatuses.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-foreground">
                    <div className="flex items-center gap-2">
                      <opt.icon className={`w-4 h-4 ${opt.color}`} />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-foreground">Note (optionnel)</Label>
            <Textarea
              id="note"
              placeholder="Ajouter une note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border text-foreground hover:bg-muted"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!status || isSubmitting}
            className="gradient-primary text-primary-foreground"
          >
            {isSubmitting ? "Mise à jour..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
