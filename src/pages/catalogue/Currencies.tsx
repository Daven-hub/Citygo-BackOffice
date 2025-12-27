import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Switch } from "@/components/ui/switch";
import { CurrencieType, deleteCurrencie, getAllCurrencie } from "@/store/slices/catalogue/currencie.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import CurrenciesModal from "@/components/modal/catalogue/CurrenciesModal";
import { useToast } from "@/hook/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Currencies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const dispatch=useAppDispatch()
  const { currencies } = useAppSelector((state) => state.currencie);
  const pageSize = 6;
  const [selectedCurrencie, setSelectedCurrentie] =
    useState<CurrencieType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          const start = performance.now();
          await dispatch(getAllCurrencie());
          const end = performance.now();
          const elapsed = end - start;
          setDuration(elapsed);
          setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
        };
        fetchData();
      }, [dispatch]);

  const filteredTransactions = currencies.filter(
    (transaction) =>{
      const matchSearch = transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
      statusFilter === "all" || transaction.active.toString() === statusFilter;
       return matchSearch && matchesStatus;
  });

  const totalAppPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransaction = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

 const handleOpen = () => {
       setSelectedCurrentie(null);
       setModalOpen(true);
     };
   
     const handleViewDetail = (data: CurrencieType) => {
       setSelectedCurrentie(data);
       setModalOpen(true);
     };
   
     const handleView = (data: CurrencieType) => {
       setSelectedCurrentie(data);
       setModalOpen(true);
     };
   
     const handleOpenDelete = (data: CurrencieType) => {
       setSelectedCurrentie(data);
       setDeleteOpen(true);
     };
   
     const handleDelete = async () => {
       setLoading(true);
       try {
         await dispatch(deleteCurrencie(selectedCurrencie?.id)).unwrap();
         toast({
           title: "Mise à jour du statut",
           description:
             "Le Statut de la langue avec le code " +
             selectedCurrencie.code +
             " a été mis à jour avec success!",
         });
         setDeleteOpen(false);
         setSelectedCurrentie(null);
         dispatch(getAllCurrencie()).unwrap();
       } catch (error) {
         toast({
           description: error?.toString(),
           variant: "destructive",
         });
       } finally {
         setLoading(false);
       }
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44 border-border text-foreground">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Tous les statut" />
              </SelectTrigger>
              <SelectContent className="border-border">
                <SelectItem value="all" className="text-foreground">
                  Tous les statuts
                </SelectItem>
                <SelectItem value={"true"} className="text-success">
                  ACTIVE
                </SelectItem>
                <SelectItem value={"false"} className="text-destructive">
                  INACTIVE
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={() => handleOpen()} variant="outline" className="border-border bg-primary text-white">
            <Plus className="w-4 h-4 mr-0.5" />
            Nouvelle monnaie
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
                    Symbole
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    name
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
                        {transaction?.symbol}
                      </td>
                      <td className="py-3 px-6">
                        {transaction?.name}
                      </td>
                      <td className="py-4 px-6">
                        {transaction?.active}
                        <Switch
                          checked={transaction?.active}
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border-border w-48"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewDetail(transaction)
                              }
                              className="text-foreground hover:bg-muted cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="" />
                            <DropdownMenuItem
                              onClick={() => handleView(transaction)}
                              className="text-secondary hover:!bg-secondary/10 cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDelete(transaction)}
                              className="text-destructive hover:!bg-destructive/10 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

      <CurrenciesModal
              open={modalOpen}
              setOpen={setModalOpen}
              dispatch={dispatch}
              selected={selectedCurrencie}
              setSelected={setSelectedCurrentie}
            />
      
            <ConfirmModal
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              title={"Suppression d'une Monnaie"}
              description={
                "Voulez vous supprimé la Monnaie avec pour code: " +
                selectedCurrencie?.code +
                " et pour nom: " +
                selectedCurrencie?.name +
                " ?"
              }
              onConfirm={handleDelete}
              variant="danger"
              loading={loading}
            />
    </>
  );
}
