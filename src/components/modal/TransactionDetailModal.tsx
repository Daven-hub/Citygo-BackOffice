import { CreditCard, User, Calendar, ArrowUpRight, ArrowDownRight, Receipt, MapPin, Clock, CheckCircle, AlertCircle, XCircle, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: {
    id: string;
    type: "payment" | "refund" | "payout" | "commission";
    amount: number;
    user: string;
    userEmail?: string;
    description: string;
    date: string;
    status: "completed" | "pending" | "failed";
    paymentMethod?: string;
    rideId?: string;
    rideDetails?: {
      from: string;
      to: string;
      date: string;
    };
    fees?: number;
    netAmount?: number;
    reference?: string;
  };
}

const typeConfig = {
  payment: { label: "Paiement", icon: ArrowUpRight, className: "bg-success/10 text-success", color: "text-success" },
  refund: { label: "Remboursement", icon: ArrowDownRight, className: "bg-destructive/10 text-destructive", color: "text-destructive" },
  payout: { label: "Versement", icon: ArrowDownRight, className: "bg-primary/10 text-primary", color: "text-primary" },
  commission: { label: "Commission", icon: ArrowUpRight, className: "bg-gray-100 text-accent", color: "text-accent" },
};

const statusConfig = {
  completed: { label: "Complété", icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
  pending: { label: "En attente", icon: Clock, className: "bg-warning/10 text-warning border-warning/20" },
  failed: { label: "Échoué", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function TransactionDetailModal({ open, onOpenChange, transaction }: TransactionDetailModalProps) {
  const TypeIcon = typeConfig[transaction.type].icon;
  const StatusIcon = statusConfig[transaction.status].icon;
  const isCredit = transaction.type === "payment" || transaction.type === "commission";
  const fees = transaction.fees ?? transaction.amount * 0.029;
  const netAmount = transaction.netAmount ?? (isCredit ? transaction.amount - fees : transaction.amount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <ScrollArea className="sm:max-w-[550px] max-h-[85vh] ">
        <DialogHeader>
          <DialogTitle className="flex text-xl items-center gap-2 text-foreground">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col gap-0">
              <h1>Détails de la transaction</h1>
              <span className="text-sm text-gray-400 font-normal">Référence: {transaction.reference || transaction.id}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="text-center py-7 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
            <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4", typeConfig[transaction.type].className)}>
              <TypeIcon className="w-4 h-4" />
              <span className="font-medium text-xs">{typeConfig[transaction.type].label}</span>
            </div>
            <p className={cn(
              "text-4xl font-semibold tracking-tight",
              isCredit ? "text-success" : "text-destructive"
            )}>
              {isCredit ? "+" : "-"}{transaction.amount.toFixed(2)} fcfa
            </p>
            <Badge variant="outline" className={cn("font-medium py-0.5 flex items-center w-fit mx-auto justify-center gap-2 mt-3", statusConfig[transaction.status].className)}>
              <StatusIcon className={cn("w-3 h-3", statusConfig[transaction.status].className.split(" ")[1])} />
              <div>
                {statusConfig[transaction.status].label}
              </div>
            </Badge>
          </div>

          <div className="px-4 py-3 rounded-xl bg-muted/30 border border-border/50">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Utilisateur</h4>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {transaction.user.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-md text-foreground">{transaction.user}</p>
                {transaction.userEmail && (
                  <p className="text-sm text-muted-foreground">{transaction.userEmail}</p>
                )}
              </div>
            </div>
          </div>

          {transaction.rideDetails && (
            <div className="px-4 py-3 rounded-xl border border-border/50">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Trajet associé
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <div className="w-0.5 h-4 bg-primary/30" />
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{transaction?.rideDetails.from}</p>
                  <p className="font-medium text-sm text-foreground mt-2">{transaction?.rideDetails.to}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span className="text-sm">{transaction?.rideDetails.date}</span>
                  </div>
                  <span className="text-xs text-primary">#{transaction?.rideId}</span>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 py-3 rounded-xl bg-muted/30 border border-border/50">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Détails financiers
            </h4>
            <div className="space-y-0 text-sm">
              <div className="flex items-center justify-between py-2.5 border-b border-border/50">
                <span className="text-muted-foreground">Montant brut</span>
                <span className="font-medium text-foreground">{transaction.amount.toFixed(2)} fcfa</span>
              </div>
              {isCredit && (
                <div className="flex items-center justify-between py-2.5 border-b border-border/50">
                  <span className="text-muted-foreground">Frais de traitement (2.9%)</span>
                  <span className="font-medium text-destructive">-{fees.toFixed(2)} fcfa</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2.5">
                <span className="font-medium text-foreground">Montant net</span>
                <span className={cn("font-bold text-lg", isCredit ? "text-success" : "text-destructive")}>
                  {isCredit ? "" : "-"}{netAmount.toFixed(2)} fcfa
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="px-4 py-3 rounded-xl bg-muted/30 border border-border/50">
              <span className="text-sm text-muted-foreground">Méthode</span>
              <div className="flex items-center gap-2 mt-1">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm text-foreground">{transaction.paymentMethod || "Carte bancaire"}</span>
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-muted/30 border border-border/50">
              <span className="text-sm text-muted-foreground">Date</span>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm text-foreground">{transaction.date}</span>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 rounded-xl bg-muted/30 border border-border/50">
            <span className="text-sm text-muted-foreground">Description</span>
            <p className="mt-1.5 text-sm text-foreground">{transaction.description}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Fermer
          </Button>
          <Button className="gradient-primary text-white">
            <Receipt className="w-4 h-4 mr-2" />
            Télécharger le reçu
          </Button>
        </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
