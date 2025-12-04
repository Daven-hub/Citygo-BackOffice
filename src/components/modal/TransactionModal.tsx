import { CreditCard, User, Calendar, ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: {
    id: string;
    type: "payment" | "refund" | "payout" | "commission";
    amount: number;
    user: string;
    description: string;
    date: string;
    status: "completed" | "pending" | "failed";
    paymentMethod?: string;
    rideId?: string;
  };
}

const typeConfig = {
  payment: { label: "Paiement", icon: ArrowUpRight, className: "bg-success/10 text-success" },
  refund: { label: "Remboursement", icon: ArrowDownRight, className: "bg-destructive/10 text-destructive" },
  payout: { label: "Versement", icon: ArrowDownRight, className: "bg-primary/10 text-primary" },
  commission: { label: "Commission", icon: ArrowUpRight, className: "bg-accent/10 text-accent" },
};

const statusConfig = {
  completed: { label: "Complété", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  failed: { label: "Échoué", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function TransactionModal({ open, onOpenChange, transaction }: TransactionModalProps) {
  const TypeIcon = typeConfig[transaction.type].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary-foreground" />
            </div>
            Détails de la transaction
          </DialogTitle>
          <DialogDescription>
            Transaction #{transaction.id}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Amount Display */}
          <div className="text-center py-6 rounded-xl bg-muted/30 border border-border/50">
            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3", typeConfig[transaction.type].className)}>
              <TypeIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{typeConfig[transaction.type].label}</span>
            </div>
            <p className={cn(
              "text-4xl font-bold",
              transaction.type === "refund" || transaction.type === "payout" ? "text-destructive" : "text-success"
            )}>
              {transaction.type === "refund" || transaction.type === "payout" ? "-" : "+"}
              {transaction.amount.toFixed(2)} €
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Utilisateur</span>
              </div>
              <span className="font-medium text-foreground">{transaction.user}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <span className="font-medium text-foreground">{transaction.date}</span>
            </div>

            {transaction.paymentMethod && (
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span>Méthode</span>
                </div>
                <span className="font-medium text-foreground">{transaction.paymentMethod}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-muted-foreground">Statut</span>
              <Badge variant="outline" className={cn("font-medium", statusConfig[transaction.status].className)}>
                {statusConfig[transaction.status].label}
              </Badge>
            </div>

            {transaction.rideId && (
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Trajet associé</span>
                <span className="font-medium text-primary">#{transaction.rideId}</span>
              </div>
            )}

            <div className="pt-3">
              <span className="text-sm text-muted-foreground">Description</span>
              <p className="mt-1 text-foreground">{transaction.description}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Fermer
          </Button>
          <Button className="gradient-primary text-primary-foreground">
            Télécharger le reçu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
