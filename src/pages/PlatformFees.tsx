import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Percent,
  Calendar,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Edit2
} from "lucide-react";
import { mockPlatformFees, PlatformFee } from "@/data/mockPlatformFees";
import { useToast } from "@/hook/use-toast";

export default function PlatformFees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fees, setFees] = useState<PlatformFee[]>(mockPlatformFees);
  const [selectedFee, setSelectedFee] = useState<PlatformFee | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PlatformFee>>({});
  const { toast } = useToast();

  const filteredFees = fees.filter(fee =>
    fee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.feeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Indéfini";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleView = (fee: PlatformFee) => {
    setSelectedFee(fee);
    setIsDetailOpen(true);
  };

  const handleEdit = (fee: PlatformFee) => {
    setSelectedFee(fee);
    setEditForm(fee);
    setIsEditOpen(true);
  };

  const handleDelete = (fee: PlatformFee) => {
    setSelectedFee(fee);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFee) {
      setFees(fees.filter(f => f.id !== selectedFee.id));
      toast({
        title: "Frais supprimé",
        description: `Le frais ${selectedFee.id} a été supprimé.`
      });
      setIsDeleteOpen(false);
      setSelectedFee(null);
    }
  };

  const saveEdit = () => {
    if (selectedFee && editForm) {
      setFees(fees.map(f => 
        f.id === selectedFee.id 
          ? { ...f, ...editForm, updatedAt: new Date().toISOString(), updatedBy: "Admin" }
          : f
      ));
      toast({
        title: "Frais mis à jour",
        description: `Le frais ${selectedFee.id} a été mis à jour.`
      });
      setIsEditOpen(false);
      setSelectedFee(null);
      setEditForm({});
    }
  };

  return (
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-[6px] p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Percent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total frais</p>
                <p className="text-2xl font-bold">{fees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-[6px] p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold">{fees.filter(f => f.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-[6px] p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactifs</p>
                <p className="text-2xl font-bold">{fees.filter(f => !f.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-[6px] p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Percent className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">% Moyen</p>
                <p className="text-2xl font-bold">
                  {(fees.reduce((acc, f) => acc + f.percentage, 0) / fees.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                    placeholder="Rechercher un frais..."
                    className="pl-10 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="bg-white" size="icon">
                    <Filter className="w-4 h-4" />
                </Button>
          </div>
          <div className="flex gap-2">
            <Button className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau frais
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                            ID
                                        </th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                            Type
                                        </th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                            Provider
                                        </th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                            Pourcentage
                                        </th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                            Période
                                        </th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                            Statut
                                        </th>
                                        <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFees.map((fee) => {
                                        return (
                                            <tr
                                                key={fee.id}
                                                className="border-b text-sm border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                                            >
                                                <td className="py-3 px-6">{fee.id}</td>
                                                <td className="py-3 px-6"> <Badge variant="outline">{fee.feeType.replace('_', ' ')}</Badge></td>
                                                <td className="py-3 px-6">
                                                    {fee.provider}
                                                </td>
                                                <td className="py-3 px-6">
                                                   <span className="font-semibold text-primary">{fee.percentage}%</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-muted-foreground" />
                                                        {formatDate(fee.effectiveFrom)} → {formatDate(fee.effectiveTo)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6 text-muted-foreground">
                                                    <Badge variant={fee.isActive ? "success" : "error"}>
                                                        {fee.isActive ? "Actif" : "Inactif"}
                                                    </Badge>
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
                                                                    handleView(fee)
                                                                }
                                                                className="text-foreground hover:bg-muted cursor-pointer"
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Voir détails
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="" />
                                                            <DropdownMenuItem
                                                                onClick={() => handleEdit(fee)}
                                                                className="text-secondary hover:!bg-secondary/10 cursor-pointer"
                                                            >
                                                                <Edit2 className="h-4 w-4 mr-2" />
                                                                Modifier
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(fee)}
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
                        {/* <Pagination
                            onPageChange={setPage}
                            page={page}
                            pageSize={pageSize}
                            total={totalAppPages}
                            className=""
                          /> */}
                    </div>

        {/* Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Détail du frais {selectedFee?.id}</DialogTitle>
            </DialogHeader>
            {selectedFee && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedFee.feeType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pourcentage</p>
                    <p className="font-medium text-primary">{selectedFee.percentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium">{selectedFee.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <Badge variant={selectedFee.isActive ? "default" : "secondary"}>
                      {selectedFee.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedFee.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Effectif du</p>
                    <p className="font-medium">{formatDate(selectedFee.effectiveFrom)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Effectif au</p>
                    <p className="font-medium">{formatDate(selectedFee.effectiveTo)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Créé par</p>
                    <p className="font-medium">{selectedFee.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mis à jour par</p>
                    <p className="font-medium">{selectedFee.updatedBy}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Modifier le frais {selectedFee?.id}</DialogTitle>
              <DialogDescription>Modifiez les informations du frais</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pourcentage</Label>
                  <Input
                    type="number"
                    value={editForm.percentage || ''}
                    onChange={(e) => setEditForm({ ...editForm, percentage: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Input
                    value={editForm.provider || ''}
                    onChange={(e) => setEditForm({ ...editForm, provider: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                />
                <Label>Actif</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
              <Button onClick={saveEdit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le frais</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer le frais {selectedFee?.id} ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}
