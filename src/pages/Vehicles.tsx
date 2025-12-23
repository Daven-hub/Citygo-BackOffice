import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  PlayCircle,
  User,
  Phone,
  FileText,
  Armchair,
  CircleCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  mockVehicles,
  vehicleStatusConfig,
  comfortLevelConfig,
  Vehicle,
} from "@/data/mockVehicles";
import { VehicleStatusModal } from "@/components/modal/VehicleStatusModal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getAllVehicles, updateVehicleStatus } from "@/store/slices/vehicles.slice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import LoaderUltra from "@/components/ui/loaderUltra";
import { toast } from "@/hook/use-toast";

export default function Vehicles() {
  const navigate = useNavigate();
  const dispatch=useAppDispatch();
  const [duration,setDuration]=useState(0)
  const [isLoading,setIsLoading]=useState(true)
  const {vehicles} = useAppSelector((state) => state.vehicle);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [loading,setLoading]=useState(false)
  const [variable, setVariable] = useState("");
  const [statusModal, setStatusModal] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
          const start = performance.now();
          await dispatch(getAllVehicles());
          const end = performance.now();
          const elapsed = end - start;
          setDuration(elapsed);
          setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
        };
        fetchData();
  }, [dispatch])

  // console.log('vehicles',vehicles)

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    approved: vehicles.filter((v) => v.status === "APPROVED").length,
    pending: vehicles.filter((v) => v.status === "PENDING").length,
    suspended: vehicles.filter((v) => v.status === "SUSPENDED").length,
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const handleStatusUpdate = async(
    vehicleId: string,
    confortLevel: string,
    note: string
  ) => {
    setLoading(true);
        try {
          const datas={
            id:vehicleId,
            status:variable,
            datas:{
              confortLevel:confortLevel,
              note:note
            }
          }
          await dispatch(updateVehicleStatus(datas)).unwrap();
          toast({
            title: "Statut mis à jour",
            description: `Le véhicule ${selectedVehicle.plate} a été mis à jour avec succès.`,
          });
          setStatusModalOpen(false)
        } catch (error) {
          toast({
            title: "Echec",
            description: `La mise à jour du statut du véhicule ${selectedVehicle.plate} a échoué.`,
          });
        } finally {
          setLoading(false);
        }
  };

  const openStatusModal = (vehicle: Vehicle,status:string,url:string) => {
    setSelectedVehicle(vehicle);
    setVariable(url);
    setStatusModal(status);
    setStatusModalOpen(true);
  };

  if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;

  return (
    <>
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Car className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approuvés</p>
                  <p className="text-2xl font-bold text-success">
                    {stats.approved}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-warning">
                    {stats.pending}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Suspendus</p>
                  <p className="text-2xl font-bold text-destructive">
                    {stats.suspended}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Ban className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44 border-border text-foreground">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="border-border">
                <SelectItem value="all" className="text-foreground">
                  Tous les statuts
                </SelectItem>
                <SelectItem value="PENDING" className="text-foreground">
                  En attente
                </SelectItem>
                <SelectItem value="APPROVED" className="text-foreground">
                  Approuvé
                </SelectItem>
                <SelectItem value="REJECTED" className="text-foreground">
                  Rejeté
                </SelectItem>
                <SelectItem value="SUSPENDED" className="text-foreground">
                  Suspendu
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Véhicule
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Propriétaire
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Plaque
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Confort
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Statut
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.vehicleId}
                    className="border-b text-[.8rem] border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.color}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            {vehicle.ownerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.ownerPhone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="font-mono text-sm text-foreground">
                        {vehicle.plate}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <Armchair className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {vehicle.vehicleTypeName}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({vehicle.seats})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-muted-foreground">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          comfortLevelConfig[vehicle.comfortLevel].className
                        )}
                      >
                        {comfortLevelConfig[vehicle.comfortLevel].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-6">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          vehicleStatusConfig[vehicle.status].className
                        )}
                      >
                        {vehicleStatusConfig[vehicle.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-6">
                      {formatDate(vehicle.createdAt.toString())}
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
                              navigate(`/vehicules/${vehicle.vehicleId}`)
                            }
                            className="text-foreground hover:bg-muted cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="" />
                          {vehicle.status !== "APPROVED" && vehicle.status !== "SUSPENDED" && (
                            <DropdownMenuItem
                              onClick={() => openStatusModal(vehicle,'APPROVED','approve')}
                              className="text-success hover:!bg-success/10 cursor-pointer"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                          )}
                          {vehicle.status !== "SUSPENDED" && (
                              <DropdownMenuItem
                                onClick={() => openStatusModal(vehicle,'SUSPENDED','suspend')}
                                className="text-warning hover:!bg-warning/10 cursor-pointer"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Suspendre
                              </DropdownMenuItem>
                            )}

                            {vehicle.status === "SUSPENDED" && (
                              <DropdownMenuItem
                                onClick={() => openStatusModal(vehicle,'UNSUSPENDED','unsuspend')}
                                className="text-secondary hover:!bg-secondary/10 cursor-pointer"
                              >
                                <CircleCheck className="h-4 w-4 mr-2" />
                                Reactiver
                              </DropdownMenuItem>
                            )}
                          {vehicle.status !== "REJECTED" && vehicle.status !== "SUSPENDED" && (
                            <DropdownMenuItem
                              onClick={() => openStatusModal(vehicle,'REJECTED','reject')}
                              className="text-destructive hover:!bg-destructive/10 cursor-pointer"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeter
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <VehicleStatusModal
        vehicle={selectedVehicle}
        open={statusModalOpen}
        defaultStatus={statusModal}
        onOpenChange={setStatusModalOpen}
        onStatusUpdate={handleStatusUpdate}
        isSubmitting={loading}
      />
    </>
  );
}

// {filteredVehicles.length === 0 && (
//               <div className="text-center py-12">
//                 <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                 <p className="text-muted-foreground">Aucun véhicule trouvé</p>
//               </div>
//             )}
