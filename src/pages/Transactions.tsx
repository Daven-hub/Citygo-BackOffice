import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  TrendingUp,
  DollarSign,
  Eye,
} from "lucide-react";
// import { AdminLayout } from "@/layouts/AdminLayout";
// import { AdminHeader } from "@/components/admin/AdminHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { TransactionModal } from "@/components/admin/modals/TransactionModal";
import { StatsCard } from "@/components/StatsCard";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "payment" | "refund" | "payout" | "commission";
  amount: number;
  user: string;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  paymentMethod?: string;
  rideId?: string;
}

const transactions: Transaction[] = [
  {
    id: "TX001",
    type: "payment",
    amount: 2500,
    user: "Ngassa Daniel",
    description: "Paiement trajet Douala → Yaoundé",
    date: "15/01/2025",
    status: "completed",
    paymentMethod: "MTN MoMo",
    rideId: "RD001",
  },
  {
    id: "TX002",
    type: "payout",
    amount: 2000,
    user: "Manga Evelyne",
    description: "Versement conducteur hebdomadaire",
    date: "14/01/2025",
    status: "completed",
    paymentMethod: "Orange Money",
  },
  {
    id: "TX003",
    type: "commission",
    amount: 500,
    user: "CovoitCM Admin",
    description: "Commission sur trajet RD001",
    date: "14/01/2025",
    status: "completed",
    rideId: "RD001",
  },
  {
    id: "TX004",
    type: "refund",
    amount: 1500,
    user: "Bikoi Arnaud",
    description: "Remboursement trajet annulé Bafoussam → Douala",
    date: "13/01/2025",
    status: "completed",
    paymentMethod: "Carte Visa",
    rideId: "RD005",
  },
  {
    id: "TX005",
    type: "payment",
    amount: 3000,
    user: "Mbefa Christelle",
    description: "Paiement trajet Yaoundé → Buea",
    date: "13/01/2025",
    status: "pending",
    paymentMethod: "Orange Money",
  },
  {
    id: "TX006",
    type: "payout",
    amount: 8500,
    user: "Tambe Roland",
    description: "Versement conducteur hebdomadaire",
    date: "12/01/2025",
    status: "completed",
    paymentMethod: "Virement bancaire",
  },
  {
    id: "TX007",
    type: "payment",
    amount: 1800,
    user: "Akom Esther",
    description: "Paiement trajet Garoua → Ngaoundéré",
    date: "12/01/2025",
    status: "failed",
    paymentMethod: "MTN MoMo",
  },
  {
    id: "TX008",
    type: "commission",
    amount: 950,
    user: "CovoitCM Admin",
    description: "Commissions sur plusieurs trajets",
    date: "11/01/2025",
    status: "completed",
  },
];

const typeConfig = {
  payment: {
    label: "Paiement",
    icon: ArrowUpRight,
    className: "bg-success/10 text-success",
    iconBg: "bg-success/20",
  },
  refund: {
    label: "Remboursement",
    icon: ArrowDownRight,
    className: "bg-destructive/10 text-destructive",
    iconBg: "bg-destructive/20",
  },
  payout: {
    label: "Versement",
    icon: ArrowDownRight,
    className: "bg-primary/10 text-primary",
    iconBg: "bg-primary/20",
  },
  commission: {
    label: "Commission",
    icon: TrendingUp,
    className: "bg-accent/10 text-accent",
    iconBg: "bg-accent/20",
  },
};

const statusConfig = {
  completed: {
    label: "Complété",
    className: "bg-success/10 text-success border-success/20",
  },
  pending: {
    label: "En attente",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  failed: {
    label: "Échoué",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const totalRevenue = transactions
    .filter((t) => t.type === "payment" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalPayouts = transactions
    .filter((t) => t.type === "payout" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalCommissions = transactions
    .filter((t) => t.type === "commission" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0);
  const pendingAmount = transactions
    .filter((t) => t.status === "pending")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <>
      {/* <AdminHeader
        title="Transactions"
        subtitle="Suivez les paiements et les versements"
      /> */}

      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Revenus totaux"
            value={`${totalRevenue.toFixed(2)} FCFA`}
            icon={DollarSign}
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard
            title="Versements"
            value={`${totalPayouts.toFixed(2)} FCFA`}
            icon={Wallet}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Commissions"
            value={`${totalCommissions.toFixed(2)} FCFA`}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="En attente"
            value={`${pendingAmount.toFixed(2)} FCFA`}
            icon={CreditCard}
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button variant="outline" size="icon" className="border-border">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" className="border-border">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Transactions Table */}
        <div className="rounded-xl border border-border bg-white overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Transaction
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Utilisateur
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Statut
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                    Montant
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => {
                  const TypeIcon = typeConfig[transaction.type].icon;
                  return (
                    <tr
                      key={transaction.id}
                      className="border-b text-sm border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => handleViewTransaction(transaction)}
                    >
                      <td className="py-3 px-6">
                        <span className="font-mono text-sm text-muted-foreground">
                          {transaction.id}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div
                          className={cn(
                            "inline-flex items-center gap-2 px-2.5 py-1 rounded-full",
                            typeConfig[transaction.type].className
                          )}
                        >
                          <TypeIcon className="w-3.5 h-3.5" />
                          <span className="text-[.65rem] font-medium">
                            {typeConfig[transaction.type].label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {transaction.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium whitespace-nowrap text-foreground">
                            {transaction.user}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className="text-muted-foreground line-clamp-1">
                          {transaction.description}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-muted-foreground">
                        {transaction.date}
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-medium text-[.65rem] whitespace-nowrap",
                            statusConfig[transaction.status].className
                          )}
                        >
                          {statusConfig[transaction.status].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <span
                          className={cn(
                            "font-bold whitespace-nowrap",
                            transaction.type === "refund" ||
                              transaction.type === "payout"
                              ? "text-destructive"
                              : "text-success"
                          )}
                        >
                          {transaction.type === "refund" ||
                          transaction.type === "payout"
                            ? "-"
                            : "+"}
                          {transaction.amount.toFixed(2)} FCFA
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTransaction(transaction);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* {selectedTransaction && (
        <TransactionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          transaction={selectedTransaction}
        />
      )} */}
    </>
  );
}
