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
    Layers,
    Calendar,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Edit2
} from "lucide-react";
import { mockPlatformFeeTypes, PlatformFeeType } from "@/data/mockPlatformFees";
import { useToast } from "@/hook/use-toast";

export default function PlatformFeeByType() {
    const [searchQuery, setSearchQuery] = useState("");
    const [feeTypes, setFeeTypes] = useState<PlatformFeeType[]>(mockPlatformFeeTypes);
    const [selectedFeeType, setSelectedFeeType] = useState<PlatformFeeType | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<PlatformFeeType>>({});
    const { toast } = useToast();

    const filteredFeeTypes = feeTypes.filter(feeType =>
        feeType.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feeType.feeType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Indéfini";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleView = (feeType: PlatformFeeType) => {
        setSelectedFeeType(feeType);
        setIsDetailOpen(true);
    };

    const handleEdit = (feeType: PlatformFeeType) => {
        setSelectedFeeType(feeType);
        setEditForm(feeType);
        setIsEditOpen(true);
    };

    const handleDelete = (feeType: PlatformFeeType) => {
        setSelectedFeeType(feeType);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedFeeType) {
            setFeeTypes(feeTypes.filter(f => f.id !== selectedFeeType.id));
            toast({
                title: "Type de frais supprimé",
                description: `Le type ${selectedFeeType.id} a été supprimé.`
            });
            setIsDeleteOpen(false);
            setSelectedFeeType(null);
        }
    };

    const saveEdit = () => {
        if (selectedFeeType && editForm) {
            setFeeTypes(feeTypes.map(f =>
                f.id === selectedFeeType.id
                    ? { ...f, ...editForm, updatedAt: new Date().toISOString(), updatedBy: "Admin" }
                    : f
            ));
            toast({
                title: "Type de frais mis à jour",
                description: `Le type ${selectedFeeType.id} a été mis à jour.`
            });
            setIsEditOpen(false);
            setSelectedFeeType(null);
            setEditForm({});
        }
    };

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-[6px] p-4 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Layers className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total types</p>
                            <p className="text-2xl font-bold">{feeTypes.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-[6px] p-4 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Types actifs</p>
                            <p className="text-2xl font-bold">{feeTypes.filter(f => f.isActive).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-[6px] p-4 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10">
                            <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Types inactifs</p>
                            <p className="text-2xl font-bold">{feeTypes.filter(f => !f.isActive).length}</p>
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
                            placeholder="Rechercher un type de frais..."
                            className="pl-10 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="bg-white" size="icon">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
                {/* <div className="flex gap-2">
                    <Button className="text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau type
                    </Button>
                </div> */}
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border bg-white overflow-hidden animate-fade-in">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                    ID
                                </th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                    Type de frais
                                </th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                    Pourcentage
                                </th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                                    Provider
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
                            {filteredFeeTypes.map((feeType) => {
                                return (
                                    <tr
                                        key={feeType.id}
                                        className="border-b text-sm border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                                    >
                                        <td className="py-3 px-6">{feeType.id}</td>
                                        <td className="py-3 px-6"><Badge variant="outline">{feeType.feeType.replace('_', ' ')}</Badge></td>
                                        <td className="py-3 px-6">
                                            {feeType.percentage}%
                                        </td>
                                        <td className="py-3 px-6">
                                            {feeType.provider}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                                {formatDate(feeType.effectiveFrom)}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-muted-foreground">
                                            <Badge className="" variant={feeType.isActive ? "success" : "error"}>
                                                {feeType.isActive ? "Actif" : "Inactif"}
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
                                                            handleView(feeType)
                                                        }
                                                        className="text-foreground hover:bg-muted cursor-pointer"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Voir détails
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleEdit(feeType)}
                                                        className="text-secondary hover:!bg-secondary/10 cursor-pointer"
                                                    >
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(feeType)}
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
                        <DialogTitle>Détail du type {selectedFeeType?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedFeeType && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Type de frais</p>
                                    <p className="font-medium">{selectedFeeType.feeType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Pourcentage</p>
                                    <p className="font-medium text-primary">{selectedFeeType.percentage}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Provider</p>
                                    <p className="font-medium">{selectedFeeType.provider}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Statut</p>
                                    <Badge variant={selectedFeeType.isActive ? "default" : "secondary"}>
                                        {selectedFeeType.isActive ? "Actif" : "Inactif"}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="font-medium">{selectedFeeType.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Effectif du</p>
                                    <p className="font-medium">{formatDate(selectedFeeType.effectiveFrom)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Effectif au</p>
                                    <p className="font-medium">{formatDate(selectedFeeType.effectiveTo)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Créé par</p>
                                    <p className="font-medium">{selectedFeeType.createdBy}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Mis à jour par</p>
                                    <p className="font-medium">{selectedFeeType.updatedBy}</p>
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
                        <DialogTitle>Modifier le type {selectedFeeType?.id}</DialogTitle>
                        <DialogDescription>Modifiez les informations du type de frais</DialogDescription>
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
                        <DialogTitle>Supprimer le type de frais</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le type {selectedFeeType?.id} ? Cette action est irréversible.
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
