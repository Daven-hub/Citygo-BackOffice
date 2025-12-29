import { useState } from "react";
import { User, Mail, Phone, Car, Shield } from "lucide-react";
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
import { useToast } from "@/hook/use-toast";
import { UserType } from "@/store/slices/user.slice";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?:UserType
  mode: "create" | "edit" | "view";
}

export function UserModal({ open, onOpenChange, user, mode }: UserModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    roles: user?.roles || [],
    status: user?.status || "active",
  });

  const handleSubmit = () => {
    toast({
      title: mode === "create" ? "Utilisateur créé" : "Utilisateur modifié",
      description: `${formData.name} a été ${mode === "create" ? "ajouté" : "modifié"} avec succès.`,
    });
    onOpenChange(false);
  };

  const isViewMode = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            {mode === "create" ? "Nouvel utilisateur" : mode === "edit" ? "Modifier l'utilisateur" : "Détails utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Remplissez les informations pour créer un nouvel utilisateur."
              : mode === "edit"
              ? "Modifiez les informations de l'utilisateur."
              : "Consultez les informations de l'utilisateur."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Nom complet
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isViewMode}
              className="bg-background border-border"
              placeholder="Jean Dupont"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isViewMode}
              className="bg-background border-border"
              placeholder="jean.dupont@email.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Téléphone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isViewMode}
              className="bg-background border-border"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Car className="w-4 h-4 text-muted-foreground" />
                Rôle
              </Label>
              <Select
                value={formData.roles.join('')}

                // onValueChange={(value) => setFormData({ ...formData, role: value })}

                // onValueChange={(value) => setFormData({ ...formData, role: value as any })}

                disabled={isViewMode}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="driver">Conducteur</SelectItem>
                  <SelectItem value="passenger">Passager</SelectItem>
                  <SelectItem value="both">Les deux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                Statut
              </Label>
              <Select
                value={formData.status}

                onValueChange={(value) => setFormData({ ...formData, status: value })}

                // onValueChange={(value) => setFormData({ ...formData, status: value as any })}

                disabled={isViewMode}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
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
