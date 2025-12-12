import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Ban,
  ExternalLink,
  Eye,
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
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getAllUsers, suspendUserById, unSuspendUserById, UserType } from "@/store/slices/user.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import dayjs from "dayjs";
import { useToast } from "@/hook/use-toast";

const roleConfig = {
  ROLE_DRIVER: {
    label: "Conducteur",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  ROLE_USER: {
    label: "Passager",
    className: "bg-secondary text-secondary-foreground border-border",
  },
  both: {
    label: "Users + Driver",
    className: "bg-green-100 text-green-700 border-grenn-200",
  },
  ROLE_ADMIN: {
    label: "Admin",
    className: "bg-green-100 text-primary-700 border-green-200",
  },
};

const statusConfig = {
  ACTIVE: {
    label: "Actif",
    className: "bg-success/10 text-success border-success/20",
  },
  PENDING_VERIFICATION: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  INACTIVE: {
    label: "Inactif",
    className: "bg-muted text-muted-foreground border-border",
  },
  SUSPENDED: {
    label: "Suspendu",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const {toast} =useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const isAllSelected =
    filteredUsers.length > 0 && selectedIds.length === filteredUsers.length;

  const handleViewUser = (user: UserType) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleViewFullDetail = (userId: string) => {
    navigate(`/utilisateurs/${userId}`);
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSuspendUnsuspend= async(action,userId)=>{
    setLoading(true);
        try {
          if(action==='ACTIVE'){
            await dispatch(unSuspendUserById(userId)).unwrap();
          }else if(action==='SUSPENDED'){
            await dispatch(suspendUserById(userId)).unwrap();
          }
          toast({
            title: action==='ACTIVE'?"Réactivation du compte réussie":"Désactivation du compte réussie",
            // description: "Bienvenue "+userConnected?.displayName,
          });
        } catch (error) {
          toast({
            title: "Erreur",
            description: error?.toString(),
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
  }

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      await Promise.all([dispatch(getAllUsers())]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <LoaderUltra loading={isLoading} duration={duration} />;
  }
  return (
    <>
      <div className="space-y-4">
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

        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-4 px-6">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                    Utilisateur
                  </th>
                  <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                    Contact
                  </th>
                  <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                    Rôle
                  </th>
                  <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                    Trajets
                  </th>
                  <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                    Note
                  </th>
                  <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                    Statut
                  </th>
                  <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                    Inscrit le
                  </th>
                  <th className="text-right py-3.5 px-5 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers?.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b text-[.85rem] border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    {/* Checkbox ligne */}
                    <td className="py-3 px-5">
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </td>

                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user?.displayName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {user?.displayName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-5">
                      <div className="space-y-0.5">
                        <div className="flex items-center whitespace-nowrap gap-2 text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          {user.phone}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 flex px-5">
                      {(() => {
                        const roles =
                          user?.roles?.filter((r) => r !== "ROLE_ADMIN") || [];
                        const hasBoth =
                          roles.includes("ROLE_USER") &&
                          roles.includes("ROLE_DRIVER");
                        const finalRoles = hasBoth ? ["both"] : roles;
                        return finalRoles.map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className={cn(
                              "font-medium text-[.7rem]",
                              roleConfig[item]?.className
                            )}
                          >
                            {roleConfig[item]?.label}
                          </Badge>
                        ));
                      })()}
                    </td>

                    <td className="py-4 px-5 text-sm text-foreground font-medium">
                      10
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1">
                        <span className="text-warning">★</span>
                        <span className="text-foreground font-medium">4.8</span>
                      </div>
                    </td>

                    <td className="py-3 px-5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium text-[.7rem]",
                          statusConfig[user.status]?.className
                        )}
                      >
                        {statusConfig[user.status]?.label}
                      </Badge>
                    </td>

                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {dayjs(user?.createdAt).format("YYYY-MM-DD")}
                      </div>
                    </td>

                    <td className="py-3 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-card border-border"
                        >
                          {/* <DropdownMenuItem
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Aperçu rapide
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            onClick={() => handleViewFullDetail(user.id)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Détails complets
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            modifier Local flags
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>handleSuspendUnsuspend('ACTIVE',user?.id)} className="text-destructive">
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

      {/* {selectedUser && (
        <UserModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          user={selectedUser}
          mode="edit"
        />
      )} */}
    </>
  );
}
