import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransactionDetailModal } from "@/components/modal/TransactionDetailModal";
import Pagination from "@/components/Pagination";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getAllVehicleType } from "@/store/slices/catalogue/vehicleType.slice";
import { Switch } from "@/components/ui/switch";
import { getAllLuggage } from "@/store/slices/catalogue/luggageType.slice";
import { getAllLanguage } from "@/store/slices/catalogue/language.slice";
import LoaderUltra from "@/components/ui/loaderUltra";

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

export default function Languages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [page, setPage] = useState(1);
  const dispatch=useAppDispatch()
  const { languages } = useAppSelector((state) => state.language);
  const pageSize = 6;
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          const start = performance.now();
          await dispatch(getAllLanguage());
          const end = performance.now();
          const elapsed = end - start;
          setDuration(elapsed);
          setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
        };
        fetchData();
      }, [dispatch]);

      // console.log('languages',languages)

  const filteredTransactions = languages.filter(
    (transaction) =>
      transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.code
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAppPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransaction = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;
  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button variant="outline" size="icon" className="border-border">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" className="border-border bg-primary text-white">
            <Plus className="w-4 h-4 mr-0.5" />
            Nouveau Type
          </Button>
        </div>

        {/*Table */}
        <div className="rounded-xl border border-border bg-white overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Code
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Native Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    active
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    sort
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransaction.map((transaction) => {
                  return (
                    <tr
                      key={transaction.id}
                      className="border-b text-sm border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-6">
                        {transaction?.code}
                      </td>
                      <td className="py-3 px-6">
                        {transaction?.name}
                      </td>
                      <td className="py-3 px-6">
                        {transaction?.nativeName}
                      </td>
                      <td className="py-4 px-6">
                        {transaction?.active}
                        <Switch
                          checked={transaction?.active}
                        //   onCheckedChange={(checked) => handleUpdateStatus(species?.id,checked ? 1 : 0)}
                          className={`
                            transition duration-300
                            ${transaction?.active
                              ? "data-[state=checked]:bg-green-500" 
                              : "data-[state=unchecked]:bg-red-500"}
                          `}
                        />
                      </td>
                      <td className="py-3 px-6 text-muted-foreground">
                        {transaction.sortOrder}
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
          <Pagination
            onPageChange={setPage}
            page={page}
            pageSize={pageSize}
            total={totalAppPages}
            className=""
          />
        </div>
      </div>

      {selectedTransaction && (
        <TransactionDetailModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          transaction={{
            ...selectedTransaction,
            userEmail: "lionelfotso@gmail.com",
            rideDetails: selectedTransaction.rideId
              ? {
                  from: "Douala",
                  to: "Yaounde",
                  date: selectedTransaction.date,
                }
              : undefined,
          }}
        />
      )}
    </>
  );
}
