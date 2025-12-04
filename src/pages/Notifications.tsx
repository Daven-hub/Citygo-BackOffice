import { useState } from "react";
import { Search, Filter, Bell, BellOff, CheckCheck, Trash2, Mail, AlertCircle, Info, CheckCircle, Calendar, User, Car, CreditCard, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  category: "user" | "ride" | "payment" | "system";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const notifications: Notification[] = [
  { id: "N001", type: "success", category: "user", title: "Nouvel utilisateur inscrit", message: "Lionel Fotso vient de s'inscrire sur la plateforme.", date: "Il y a 5 min", read: true },
  { id: "N002", type: "info", category: "ride", title: "Nouveau trajet publié", message: "Lionel Fotso a publié un trajet Douala - Limbé pour demain.", date: "Il y a 15 min", read: false },
  { id: "N003", type: "warning", category: "payment", title: "Paiement en attente", message: "Le paiement de Maxime Tsafack est en attente de validation.", date: "Il y a 30 min", read: false },
  { id: "N004", type: "error", category: "system", title: "Échec de paiement", message: "Le paiement de Maxime Tsafack a échoué. Veuillez vérifier.", date: "Il y a 1h", read: true },
  { id: "N005", type: "success", category: "ride", title: "Trajet terminé", message: "Le trajet Douala - Yaoundé a été complété avec succès.", date: "Il y a 2h", read: true }
];

const typeConfig = {
  info: { icon: Info, className: "text-primary", bgClassName: "bg-primary/10" },
  warning: { icon: AlertCircle, className: "text-warning", bgClassName: "bg-warning/10" },
  success: { icon: CheckCircle, className: "text-success", bgClassName: "bg-success/10" },
  error: { icon: AlertCircle, className: "text-destructive", bgClassName: "bg-destructive/10" },
};

const categoryConfig = {
  user: { icon: User, label: "Utilisateur" },
  ride: { icon: Car, label: "Trajet" },
  payment: { icon: CreditCard, label: "Paiement" },
  system: { icon: Bell, label: "Système" },
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const filteredNotifications = notificationsList.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "unread") return matchesSearch && !notification.read;
    return matchesSearch && notification.category === selectedTab;
  });

  const markAsRead = (id: string) => {
    setNotificationsList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    toast({
      title: "Notifications marquées comme lues",
      description: "Toutes les notifications ont été marquées comme lues.",
    });
  };

  const deleteNotification = (id: string) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée.",
    });
  };

  const clearAll = () => {
    setNotificationsList([]);
    setConfirmOpen(false);
    toast({
      title: "Notifications effacées",
      description: "Toutes les notifications ont été supprimées.",
    });
  };

  const sumarryCard=[
    {
      icon:Bell,
      color:'bg-primary/10',
      textColor:'text-primary',
      libele:'Total',
      valeur:notificationsList.length
    },
    {
      icon:Mail,
      color:'bg-warning/10',
      textColor:'text-warning',
      libele:'Non lues',
      valeur:unreadCount
    },
    {
      icon:CheckCheck,
      color:'bg-success/10',
      textColor:'text-success',
      libele:'Lues',
      valeur:notificationsList.filter(n => n.read).length
    },
    {
      icon:AlertCircle,
      color:'bg-destructive/10',
      textColor:'text-destructive',
      libele:'Alertes',
      valeur:notificationsList.filter(n => n.type === "error" || n.type === "warning").length
    }
  ]

  return (
    <>
      <div className="space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sumarryCard?.map((x,index)=>
            <div key={index} className="rounded-xl border border-border bg-white px-5 py-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${x.color} flex items-center justify-center`}>
                <x.icon className={`w-6 h-6 ${x.textColor}`} />
              </div>
              <div>
                <p className="text-2xl text-black/60 font-bold text-foreground">{x.valeur}</p>
                <p className="text-sm text-muted-foreground">{x.libele}</p>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une notification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button variant="outline" size="icon" className="border-border">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} className="border-border !bg-white/70" disabled={unreadCount === 0}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Tout marquer lu
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setConfirmOpen(true)} 
              className="border-border !bg-white/70 text-destructive hover:text-destructive"
              disabled={notificationsList.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Tout effacer
            </Button>
          </div>
        </div>

        {/* Tabs & Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="bg-muted/90 p-1">
            <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background">
              Toutes
              <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                {notificationsList.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-sm data-[state=active]:bg-background">
              Non lues
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-400 text-white/80">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="user" className="text-sm data-[state=active]:bg-background">Utilisateurs</TabsTrigger>
            <TabsTrigger value="ride" className="text-sm data-[state=active]:bg-background">Trajets</TabsTrigger>
            <TabsTrigger value="payment" className="text-sm data-[state=active]:bg-background">Paiements</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <BellOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">Aucune notification</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedTab === "unread" ? "Vous avez lu toutes vos notifications." : "Aucune notification dans cette catégorie."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const TypeIcon = typeConfig[notification.type].icon;
                const CategoryIcon = categoryConfig[notification.category].icon;
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "rounded-xl border bg-card px-5 py-3.5 transition-all duration-200 hover:shadow-md",
                      notification.read ? "border-border" : "border-primary/30 bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", typeConfig[notification.type].bgClassName)}>
                        <TypeIcon className={cn("w-5 h-5", typeConfig[notification.type].className)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={cn("font-medium text-sm", notification.read ? "text-foreground" : "text-foreground")}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border-border">
                              {!notification.read && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <CheckCheck className="w-4 h-4 mr-2" />
                                  Marquer comme lu
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => deleteNotification(notification.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CategoryIcon className="w-3.5 h-3.5" />
                            {categoryConfig[notification.category].label}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            {notification.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={clearAll}
        title="Effacer toutes les notifications ?"
        description="Cette action supprimera définitivement toutes vos notifications. Cette action est irréversible."
        variant="danger"
        confirmText="Effacer tout"
      />
    </>
  );
}
