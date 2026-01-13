import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  ExternalLink,
  AlertTriangle,
  Clock,
  XCircle,
  PlayCircle,
  Ticket,
  UserCircle,
  Beaker,
  Paperclip,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  GetActiveTickets,
  GetUnassignedTickets,
  GetMyAssignedTickets,
  GetEscalatedTickets,
  GetSlaBreachedTickets,
  GetTicketStats,
  StartTicketProgress,
  CloseTicket,
} from "@/store/slices/supportTicket.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/fr";
import { useToast } from "@/hook/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  SupportTicket,
  ticketStatusConfig,
  ticketPriorityConfig,
  ticketCategoryConfig,
} from "@/types/supportTicket";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/Pagination";
import { TicketCreateModal } from "@/components/modal/TicketCreateModal";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("fr");

type TabType = "all" | "mine" | "unassigned" | "escalated" | "sla-breached";

export default function SupportTickets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [page, setPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const pageSize = 20;

  const dispatch = useAppDispatch();
  const { tickets, stats, totalElements, totalPages } = useAppSelector(
    (state) => state.supportTicket
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch tickets based on active tab
  const fetchTickets = async (tab: TabType, pageNum: number = 0) => {
    const params = { page: pageNum, size: pageSize };
    switch (tab) {
      case "mine":
        await dispatch(GetMyAssignedTickets(params));
        break;
      case "unassigned":
        await dispatch(GetUnassignedTickets(params));
        break;
      case "escalated":
        await dispatch(GetEscalatedTickets(params));
        break;
      case "sla-breached":
        await dispatch(GetSlaBreachedTickets(params));
        break;
      default:
        await dispatch(GetActiveTickets(params));
    }
  };

  // Initial load
  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      await Promise.all([fetchTickets("all"), dispatch(GetTicketStats())]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Handle tab change
  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
    setIsLoading(true);
    const start = performance.now();
    await fetchTickets(tab, 0);
    const end = performance.now();
    setDuration(end - start);
    setTimeout(() => setIsLoading(false), Math.max(200, end - start));
  };

  // Handle page change
  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await fetchTickets(activeTab, newPage - 1);
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.reporter?.displayName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === "all" || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Action handlers
  const handleViewDetail = (ticketId: string) =>
    navigate(`/support/${ticketId}`);

  const handleStartProgress = async (ticket: SupportTicket) => {
    setLoading(true);
    try {
      await dispatch(StartTicketProgress(ticket.id)).unwrap();
      toast({
        title: "Ticket pris en charge",
        description: `Le ticket ${ticket.ticketNumber} vous a été assigné.`,
      });
      await fetchTickets(activeTab, page - 1);
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

  const handleCloseTicket = async (ticket: SupportTicket) => {
    setLoading(true);
    try {
      await dispatch(CloseTicket(ticket.id)).unwrap();
      toast({
        title: "Ticket fermé",
        description: `Le ticket ${ticket.ticketNumber} a été fermé.`,
      });
      await fetchTickets(activeTab, page - 1);
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

  // Stats cards data
  const statCards = [
    {
      key: "active",
      label: "Actifs",
      value: stats?.activeCount || 0,
      icon: Ticket,
      colorClass: "text-primary",
      bgColorClass: "bg-primary/10",
    },
    {
      key: "unassigned",
      label: "Non assignés",
      value: stats?.unassignedCount || 0,
      icon: UserCircle,
      colorClass: "text-warning",
      bgColorClass: "bg-warning/10",
    },
    {
      key: "escalated",
      label: "Escaladés",
      value: stats?.escalatedCount || 0,
      icon: AlertTriangle,
      colorClass: "text-destructive",
      bgColorClass: "bg-destructive/10",
    },
    {
      key: "sla-breached",
      label: "SLA dépassé",
      value: stats?.slaBreachedCount || 0,
      icon: Clock,
      colorClass: "text-destructive",
      bgColorClass: "bg-destructive/10",
    },
  ];

  if (isLoading)
    return <LoaderUltra loading={isLoading} duration={duration} />;

  return (
    <div className="space-y-4">
      {/* Page Header with Dev Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Support Tickets</h1>
        {import.meta.env.DEV && (
          <Button
            onClick={() => setCreateModalOpen(true)}
            variant="outline"
            className="border-warning text-warning hover:bg-warning/10"
          >
            <Beaker className="w-4 h-4 mr-2" />
            Créer un ticket test
            <Badge variant="outline" className="ml-2 bg-warning/10 text-warning border-warning/20 text-[10px]">
              DEV
            </Badge>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.key} className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={cn("text-2xl font-bold", stat.colorClass)}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    stat.bgColorClass
                  )}
                >
                  <stat.icon className={cn("h-5 w-5", stat.colorClass)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => handleTabChange(v as TabType)}
      >
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="mine">Mes tickets</TabsTrigger>
          <TabsTrigger value="unassigned">Non assignés</TabsTrigger>
          <TabsTrigger value="escalated">Escaladés</TabsTrigger>
          <TabsTrigger value="sla-breached">SLA dépassé</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 border-border text-foreground">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="border-border">
              <SelectItem value="all" className="text-foreground">
                Tous les statuts
              </SelectItem>
              {Object.entries(ticketStatusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key} className="text-foreground">
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-40 border-border text-foreground">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent className="border-border">
              <SelectItem value="all" className="text-foreground">
                Toutes les priorités
              </SelectItem>
              {Object.entries(ticketPriorityConfig).map(([key, config]) => (
                <SelectItem key={key} value={key} className="text-foreground">
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-44 border-border text-foreground">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent className="border-border">
              <SelectItem value="all" className="text-foreground">
                Toutes les catégories
              </SelectItem>
              {Object.entries(ticketCategoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key} className="text-foreground">
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                  Ticket
                </th>
                <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                  Reporter
                </th>
                <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                  Catégorie
                </th>
                <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                  Priorité
                </th>
                <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                  Statut
                </th>
                <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                  Assigné à
                </th>
                <th className="text-left py-3.5 px-5 text-sm font-medium text-muted-foreground">
                  Créé le
                </th>
                <th className="text-right py-3.5 px-5 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    Aucun ticket trouvé
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const statusConf = ticketStatusConfig[ticket.status];
                  const priorityConf = ticketPriorityConfig[ticket.priority];
                  const categoryConf = ticketCategoryConfig[ticket.category];
                  const CategoryIcon = categoryConf?.icon || Ticket;

                  return (
                    <tr
                      key={ticket.id}
                      className="border-b text-[.85rem] border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => handleViewDetail(ticket.id)}
                    >
                      <td className="py-3 px-5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-xs text-muted-foreground">
                              {ticket.ticketNumber}
                            </p>
                            {ticket.attachments && ticket.attachments.length > 0 && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Paperclip className="w-3 h-3" />
                                {ticket.attachments.length}
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-foreground break-words">
                            {ticket.subject}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={ticket.reporter?.avatarUrl}
                              className="w-full h-full object-cover"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {ticket.reporter?.displayName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-foreground">
                            {ticket.reporter?.displayName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {categoryConf?.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-medium text-[.7rem]",
                            priorityConf?.className
                          )}
                        >
                          {priorityConf?.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-medium text-[.7rem]",
                            statusConf?.className
                          )}
                        >
                          {statusConf?.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-5">
                        {ticket.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-secondary/10 text-secondary text-[10px] font-medium">
                                {ticket.assignedTo.displayName
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {ticket.assignedTo.displayName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            Non assigné
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {dayjs.utc(ticket.createdAt).local().fromNow()}
                        </div>
                      </td>
                      <td
                        className="py-3 px-6 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                              onClick={() => handleViewDetail(ticket.id)}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {ticket.status === "OPEN" && (
                              <DropdownMenuItem
                                disabled={loading}
                                onClick={() => handleStartProgress(ticket)}
                                className="text-primary"
                              >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Prendre en charge
                              </DropdownMenuItem>
                            )}
                            {(ticket.status === "RESOLVED" ||
                              ticket.status === "AWAITING_CUSTOMER") && (
                              <DropdownMenuItem
                                disabled={loading}
                                onClick={() => handleCloseTicket(ticket)}
                                className="text-muted-foreground"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Fermer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={totalElements}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Dev Create Modal */}
      <TicketCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => fetchTickets(activeTab, page - 1)}
      />
    </div>
  );
}
