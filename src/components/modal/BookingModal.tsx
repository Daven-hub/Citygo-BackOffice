import { useState } from "react";
import { Calendar, MapPin, User, CreditCard, Clock, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: {
    id: string;
    passenger: string;
    driver: string;
    from: string;
    to: string;
    date: string;
    time: string;
    seats: number;
    price: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
  };
  mode: "create" | "edit" | "view";
}

const statusConfig = {
  pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  confirmed: { label: "Confirmée", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Terminée", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Annulée", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function BookingModal({ open, onOpenChange, booking, mode }: BookingModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    passenger: booking?.passenger || "",
    driver: booking?.driver || "",
    from: booking?.from || "",
    to: booking?.to || "",
    date: booking?.date || "",
    time: booking?.time || "",
    seats: booking?.seats || 1,
    price: booking?.price || 0,
    status: booking?.status || "pending",
  });

  const handleSubmit = () => {
    toast({
      title: mode === "create" ? "Réservation créée" : "Réservation modifiée",
      description: "La réservation a été mise à jour avec succès.",
    });
    onOpenChange(false);
  };

  const isViewMode = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              {mode === "create" ? "Nouvelle réservation" : mode === "edit" ? "Modifier la réservation" : "Détails réservation"}
            </DialogTitle>
            {booking && (
              <Badge variant="outline" className={cn("font-medium", statusConfig[formData.status].className)}>
                {statusConfig[formData.status].label}
              </Badge>
            )}
          </div>
          <DialogDescription>
            {mode === "view" ? `Réservation #${booking?.id}` : "Gérez les détails de la réservation."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Passager
              </Label>
              <Input
                value={formData.passenger}
                onChange={(e) => setFormData({ ...formData, passenger: e.target.value })}
                disabled={isViewMode}
                className="bg-background border-border"
                placeholder="Nom du passager"
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Conducteur
              </Label>
              <Input
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                disabled={isViewMode}
                className="bg-background border-border"
                placeholder="Nom du conducteur"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="w-0.5 h-8 bg-border" />
                <div className="w-3 h-3 rounded-full bg-accent" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <Label className="text-xs text-muted-foreground">Départ</Label>
                  <Input
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    disabled={isViewMode}
                    className="bg-background border-border"
                    placeholder="Ville de départ"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs text-muted-foreground">Arrivée</Label>
                  <Input
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    disabled={isViewMode}
                    className="bg-background border-border"
                    placeholder="Ville d'arrivée"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Date
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={isViewMode}
                className="bg-background border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Heure
              </Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                disabled={isViewMode}
                className="bg-background border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Places
              </Label>
              <Input
                type="number"
                min={1}
                max={4}
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                disabled={isViewMode}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                Prix (€)
              </Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                disabled={isViewMode}
                className="bg-background border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Statut</Label>
              <Select
                value={formData.status}
                // onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={isViewMode}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            {isViewMode ? "Fermer" : "Annuler"}
          </Button>
          {!isViewMode && (
            <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground">
              {mode === "create" ? "Créer" : "Sauvegarder"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
