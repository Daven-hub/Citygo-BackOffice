import { useState } from "react";
import {
  Search, Filter, MoreHorizontal, UserPlus, Mail, Phone, Calendar,
  Edit2, Ban, ExternalLink, Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"; // 👉 IMPORTANT
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { UserDetailModal } from "@/components/modal/UserDetailModal";
import { UserModal } from "@/components/modal/UserModal";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "driver" | "passenger" | "both";
  status: "active" | "inactive" | "suspended";
  rides: number;
  rating: number;
  joinedAt: string;
}

const users: User[] = [
  { id: "1", name: "Lionel Fotso", email: "lionel.fotso@email.com", phone: "+237 658852214", role: "both", status: "active", rides: 45, rating: 4.8, joinedAt: "15/03/2024" },
  { id: "2", name: "Maxime Tsafack", email: "maxime@email.com", phone: "+237 658852214", role: "driver", status: "active", rides: 128, rating: 4.9, joinedAt: "08/01/2024" },
  { id: "3", name: "Sarah Mbarga", email: "sarah@email.com", phone: "+237 658852214", role: "passenger", status: "active", rides: 23, rating: 4.6, joinedAt: "22/05/2024" },
  { id: "4", name: "Tony Ngo", email: "tony@mail.com", phone: "+237 658852214", role: "both", status: "inactive", rides: 67, rating: 4.7, joinedAt: "12/02/2024" },
  { id: "5", name: "Tony Ngo", email: "tony@mail.com", phone: "+237 658852214", role: "both", status: "inactive", rides: 67, rating: 4.7, joinedAt: "12/02/2024" },
  { id: "6", name: "Tony Ngo", email: "tony@mail.com", phone: "+237 658852214", role: "both", status: "inactive", rides: 67, rating: 4.7, joinedAt: "12/02/2024" },
  { id: "7", name: "Tony Ngo", email: "tony@mail.com", phone: "+237 658852214", role: "both", status: "inactive", rides: 67, rating: 4.7, joinedAt: "12/02/2024" },
];

const roleConfig = {
  driver: { label: "Conducteur", className: "bg-primary/10 text-primary border-primary/20" },
  passenger: { label: "Passager", className: "bg-secondary text-secondary-foreground border-border" },
  both: { label: "Les deux", className: "bg-accent/10 text-accent border-accent/20" },
};

const statusConfig = {
  active: { label: "Actif", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactif", className: "bg-muted text-muted-foreground border-border" },
  suspended: { label: "Suspendu", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // 👉 tableau des IDs cochés

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 👉 GESTION DES CHECKBOXES
  const toggleUserSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((u) => u.id));
    }
  };

  const isAllSelected = filteredUsers.length > 0 && selectedIds.length === filteredUsers.length;

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleViewFullDetail = (userId: string) => {
    navigate(`/utilisateurs/${userId}`);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button variant="outline" size="icon" className="border-border">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-4 px-6">
                    <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Utilisateur</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Rôle</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Trajets</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Note</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Inscrit le</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b text-sm border-border/50 hover:bg-muted/20 transition-colors">

                    {/* Checkbox ligne */}
                    <td className="py-3 px-6">
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </td>

                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-6">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          {user.phone}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-6">
                      <Badge variant="outline" className={cn("font-medium text-[.7rem]", roleConfig[user.role].className)}>
                        {roleConfig[user.role].label}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-sm text-foreground font-medium">{user.rides}</td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <span className="text-warning">★</span>
                        <span className="text-foreground font-medium">{user.rating}</span>
                      </div>
                    </td>

                    <td className="py-3 px-6">
                      <Badge variant="outline" className={cn("font-medium text-[.7rem]", statusConfig[user.status].className)}>
                        {statusConfig[user.status].label}
                      </Badge>
                    </td>

                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {user.joinedAt}
                      </div>
                    </td>

                    <td className="py-3 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Aperçu rapide
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewFullDetail(user.id)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Détails complets
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="w-4 h-4 mr-2" />
                            Suspendre
                          </DropdownMenuItem>
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

      {selectedUser && (
        <UserDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          user={selectedUser}
        />
      )}

      {selectedUser && (
        <UserModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          user={selectedUser}
          mode="edit"
        />
      )}
    </>
  );
}
