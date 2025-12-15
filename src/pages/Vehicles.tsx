import { useState } from "react";
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
  Armchair
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
import { mockVehicles, vehicleStatusConfig, comfortLevelConfig, Vehicle } from "@/data/mockVehicles";
import { VehicleStatusModal } from "@/components/modal/VehicleStatusModal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Vehicles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
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

  const handleStatusUpdate = (vehicleId: string, newStatus: string, note: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.vehicleId === vehicleId
          ? { ...v, status: newStatus as Vehicle["status"], reviewNote: note, reviewedAt: new Date().toISOString() }
          : v
      )
    );
  };

  const openStatusModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setStatusModalOpen(true);
  };

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
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
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
                  <p className="text-2xl font-bold text-success">{stats.approved}</p>
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
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
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
                  <p className="text-2xl font-bold text-destructive">{stats.suspended}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Ban className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Liste des véhicules</CardTitle>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-44 bg-background border-border text-foreground">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all" className="text-foreground">Tous les statuts</SelectItem>
                    <SelectItem value="DRAFT" className="text-foreground">Brouillon</SelectItem>
                    <SelectItem value="PENDING" className="text-foreground">En attente</SelectItem>
                    <SelectItem value="APPROVED" className="text-foreground">Approuvé</SelectItem>
                    <SelectItem value="REJECTED" className="text-foreground">Rejeté</SelectItem>
                    <SelectItem value="SUSPENDED" className="text-foreground">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Véhicule</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Propriétaire</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Plaque</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Confort</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Statut</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.vehicleId} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{vehicle.make} {vehicle.model}</p>
                          <p className="text-sm text-muted-foreground">{vehicle.color}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{vehicle.ownerName}</p>
                          <p className="text-xs text-muted-foreground">{vehicle.ownerPhone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-foreground">{vehicle.plate}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Armchair className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{vehicle.vehicleTypeName}</span>
                        <span className="text-muted-foreground text-sm">({vehicle.seats})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-medium", comfortLevelConfig[vehicle.comfortLevel].className)}
                      >
                        {comfortLevelConfig[vehicle.comfortLevel].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-medium", vehicleStatusConfig[vehicle.status].className)}
                      >
                        {vehicleStatusConfig[vehicle.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(vehicle.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-border w-48">
                          <DropdownMenuItem
                            onClick={() => navigate(`/vehicules/${vehicle.vehicleId}`)}
                            className="text-foreground hover:bg-muted cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="" />
                          {vehicle.status !== "APPROVED" && (
                            <DropdownMenuItem
                              onClick={() => openStatusModal(vehicle)}
                              className="text-success hover:!bg-success/10 cursor-pointer"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                          )}
                          {vehicle.status !== "SUSPENDED" && vehicle.status !== "REJECTED" && (
                            <DropdownMenuItem
                              onClick={() => openStatusModal(vehicle)}
                              className="text-warning hover:!bg-warning/10 cursor-pointer"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspendre
                            </DropdownMenuItem>
                          )}
                          {vehicle.status === "SUSPENDED" && (
                            <DropdownMenuItem
                              onClick={() => openStatusModal(vehicle)}
                              className="text-primary hover:bg-primary/10 cursor-pointer"
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Réactiver
                            </DropdownMenuItem>
                          )}
                          {vehicle.status !== "REJECTED" && (
                            <DropdownMenuItem
                              onClick={() => openStatusModal(vehicle)}
                              className="text-destructive hover:!bg-destructive/10 cursor-pointer"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeter
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun véhicule trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <VehicleStatusModal
        vehicle={selectedVehicle}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}
