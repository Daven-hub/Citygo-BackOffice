import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Ban,
  ExternalLink,
  Car,
  CheckCircle,
  FileText,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { UserDetailModal } from "@/components/modal/UserDetailModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  getAllUsers,
  unSuspendUserById,
  UserType,
} from "@/store/slices/user.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import dayjs from "dayjs";
import { useToast } from "@/hook/use-toast";
import { UserSuspendModal } from "@/components/modal/UserSuspendModal";
import { useAuth } from "@/context/authContext";
import { BulkActionModal } from "@/components/modal/BulkActionModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const roleConfig = {
  ROLE_DRIVER: {
    label: "Conducteur",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  ROLE_USER: {
    label: "Passager",
    className: "bg-secondary/10 text-secondary border-border",
  },
  both: {
    label: "Les deux",
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
    label: "En attente",
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
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [bulkActionModalOpen, setBulkActionModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userConnected } = useAuth();

  const filteredUsers = users.filter(
    (user) =>{
      const matchesSearch=
      user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.phone?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter);
      return matchesSearch && matchesStatus && matchesRole;
    }
  );

  const handleViewFullDetail = (userId: string) =>
    navigate(`/utilisateurs/${userId}`);
  // const handleEditUser = (user: UserType) => setSelectedUser(user);
  const handleSuspendUser = (user: UserType) => {
    setSelectedUser(user);
    setSuspendModalOpen(true);
  };

  const handleReactive = async (userId: string) => {
    setLoading(true);
    try {
      const datas = users?.find((x) => x.id === userId);
      await dispatch(unSuspendUserById(userId)).unwrap();
      toast({
        title: "Utilisateur réactivé",
        description: `${datas?.displayName} a été réactivé.`,
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
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) setSelectedUserIds((prev) => [...prev, userId]);
    else setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedUserIds(filteredUsers.map((user) => user.id));
    else setSelectedUserIds([]);
  };

  const handleBulkAction = () => setBulkActionModalOpen(true);

  const handleBulkActionSubmit = (data: {
    userIds: string[];
    operation: string;
    reason: string;
  }) => {
      setSelectedUserIds([])
  };

  const allSelected =
    filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length;
  const someSelected =
    selectedUserIds.length > 0 && selectedUserIds.length < filteredUsers.length;


  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      await dispatch(getAllUsers());
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();
  }, [dispatch]);

  const actifUser=users.filter((x)=>x.status==='ACTIVE')?.length
  const pendingUser=users.filter((x)=>x.status==='PENDING_VERIFICATION')?.length
  const suspendUser=users.filter((x)=>x.status==='SUSPENDED')?.length

  const statCard=[
  {
    key: "total",
    label: "Total",
    value: users?.length,
    icon: User,
    colorClass: "text-primary",
    bgColorClass: "bg-primary/10",
  },
  {
    key: "approved",
    label: "Approuvés",
    value: actifUser,
    icon: CheckCircle,
    colorClass: "text-success",
    bgColorClass: "bg-success/10",
  },
  {
    key: "pending",
    label: "En attente",
    value: pendingUser,
    icon: FileText,
    colorClass: "text-warning",
    bgColorClass: "bg-warning/10",
  },
  {
    key: "suspended",
    label: "Suspendus",
    value: suspendUser,
    icon: Ban,
    colorClass: "text-destructive",
    bgColorClass: "bg-destructive/10",
  },
];

  if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;

  return (
    <>
      <div className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statCard?.map((x,index)=>
          <Card key={index} className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{x.label}</p>
                  <p className={cn("text-2xl font-bold", x.colorClass)}>
                    {x.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    x.bgColorClass
                  )}
                >
                  <x.icon className={cn("h-5 w-5", x.colorClass)} />
                </div>
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-44 border-border text-foreground">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    <SelectItem value="all" className="text-foreground">Tous les statuts</SelectItem>
                    <SelectItem value="ACTIVE" className="text-success">Active</SelectItem>
                    <SelectItem value="PENDING_VERIFICATION" className="text-warning">En attente</SelectItem>
                    <SelectItem value="SUSPENDED" className="text-destructive">Suspendu</SelectItem>
                    <SelectItem value="INACTIVE" className="text-primary">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-44 border-border text-foreground">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    <SelectItem value="all" className="text-foreground">Tous les roles</SelectItem>
                    <SelectItem value="ROLE_DRIVER" className="text-foreground">Chauffeur</SelectItem>
                  </SelectContent>
                </Select>
          </div>

          {selectedUserIds.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBulkAction}
              className="border-primary text-primary bg-white hover:bg-primary/10"
            >
              Actions groupées ({selectedUserIds.length})
            </Button>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-4 px-6">
                    <Checkbox
                      type="button"
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      onClick={(e) => e.stopPropagation()}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      {...(someSelected
                        ? { "data-state": "indeterminate" }
                        : {})}
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
                {filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <tr
                      key={user.id}
                      className="border-b text-[.85rem] border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-5">
                        <Checkbox
                          type="button"
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectUser(user.id, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </td>
                      <td className="py-3 px-5 flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user?.avatarUrl} className="w-full h-full object-cover" />
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
                      </td>
                      <td className="py-3 px-5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" /> {user.email?user.email:'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" /> {user.phone?user.phone:'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 flex px-5">
                        {(() => {
                          const roles =
                            user?.roles?.filter((r) => r !== "ROLE_ADMIN") ||
                            [];
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
                          <span className="text-foreground font-medium">
                            4.8
                          </span>
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
                      <td className="py-3 px-5 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />{" "}
                        {dayjs(user?.createdAt).format("YYYY-MM-DD")}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="transparent"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border-border"
                          >
                            <DropdownMenuItem
                              onClick={() => handleViewFullDetail(user.id)}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" /> Détails
                              complets
                            </DropdownMenuItem>
                            {user.status === "SUSPENDED" && (
                              <DropdownMenuItem
                                disabled={loading}
                                onClick={() => handleReactive(user.id)}
                                className="text-success"
                              >
                                <Ban className="w-4 h-4 mr-2" /> Reactiver
                              </DropdownMenuItem>
                            )}
                            {user.status === "ACTIVE" && (
                              <DropdownMenuItem
                                disabled={user.id === userConnected?.id}
                                onClick={() => handleSuspendUser(user)}
                                className="text-destructive"
                              >
                                <Ban className="w-4 h-4 mr-2" /> Suspendre
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
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
      <UserSuspendModal
        user={selectedUser}
        open={suspendModalOpen}
        onOpenChange={setSuspendModalOpen}
      />
      <BulkActionModal
        users={users}
        userIds={selectedUserIds}
        open={bulkActionModalOpen}
        onOpenChange={setBulkActionModalOpen}
        onSubmit={handleBulkActionSubmit}
      />
    </>
  );
}
