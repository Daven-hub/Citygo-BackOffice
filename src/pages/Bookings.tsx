import { useState } from "react";
import { Search, Filter, MoreHorizontal, Plus, Calendar, MapPin, Clock, Users, Eye, Edit2, XCircle, CheckCircle } from "lucide-react";
// import { AdminLayout } from "@/layouts/AdminLayout";
// import { AdminHeader } from "@/components/admin/AdminHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookingModal } from "@/components/modal/BookingModal";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
import { StatsCard } from "@/components/StatsCard";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  passenger: string;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

const bookings: Booking[] = [
  { 
    id: "BK001",
    passenger: "Ngassa Daniel",
    driver: "Manga Evelyne",
    from: "Douala",
    to: "Yaoundé",
    date: "2025-01-15",
    time: "08:00",
    seats: 2,
    price: 3500,
    status: "confirmed"
  },
  { 
    id: "BK002",
    passenger: "Bikoy Arnaud",
    driver: "Essomba Léonie",
    from: "Bafoussam",
    to: "Douala",
    date: "2025-01-14",
    time: "14:30",
    seats: 1,
    price: 2500,
    status: "completed"
  },
  { 
    id: "BK003",
    passenger: "Mbefa Christelle",
    driver: "Tambe Roland",
    from: "Yaoundé",
    to: "Buea",
    date: "2025-01-16",
    time: "10:00",
    seats: 3,
    price: 3000,
    status: "pending"
  },
  { 
    id: "BK004",
    passenger: "Nana Joseph",
    driver: "Akom Esther",
    from: "Garoua",
    to: "Ngaoundéré",
    date: "2025-01-13",
    time: "09:00",
    seats: 1,
    price: 1800,
    status: "cancelled"
  },
  { 
    id: "BK005",
    passenger: "Ewane Bertille",
    driver: "Ngassa Daniel",
    from: "Kribi",
    to: "Ebolowa",
    date: "2025-01-17",
    time: "16:00",
    seats: 2,
    price: 2200,
    status: "confirmed"
  },
  { 
    id: "BK006",
    passenger: "Tambe Roland",
    driver: "Manga Evelyne",
    from: "Limbe",
    to: "Buea",
    date: "2025-01-18",
    time: "11:30",
    seats: 1,
    price: 1500,
    status: "pending"
  }
];

const statusConfig = {
  pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  confirmed: { label: "Confirmée", className: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
  completed: { label: "Terminée", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  cancelled: { label: "Annulée", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

export default function Bookings() {
  const { toast } = useToast();
  const navigate=useNavigate()
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ booking: Booking; action: string } | null>(null);

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.passenger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (mode: "create" | "edit" | "view", booking?: Booking) => {
    setModalMode(mode);
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleConfirmAction = (booking: Booking, action: string) => {
    setConfirmAction({ booking, action });
    setConfirmOpen(true);
  };

  const executeAction = () => {
    if (confirmAction) {
      toast({
        title: confirmAction.action === "cancel" ? "Réservation annulée" : "Réservation confirmée",
        description: `La réservation ${confirmAction.booking.id} a été mise à jour.`,
      });
    }
    setConfirmOpen(false);
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total réservations"
            value={stats.total.toString()}
            icon={Calendar}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="En attente"
            value={stats.pending.toString()}
            icon={Clock}
            trend={{ value: 3, isPositive: false }}
          />
          <StatsCard
            title="Confirmées"
            value={stats.confirmed.toString()}
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Terminées"
            value={stats.completed.toString()}
            icon={CheckCircle}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une réservation..."
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

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking) => {
            const StatusIcon = statusConfig[booking.status].icon;
            return (
              <div
                key={booking.id}
                className="rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 animate-fade-in"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground">#{booking.id}</span>
                    <Badge variant="outline" className={cn("font-medium", statusConfig[booking.status].className)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[booking.status].label}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem onClick={() => navigate(`/reservations/${booking.id}`)}>
                        <Eye className="w-4 h-4 mr-2" />
                        détails complet
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenModal("edit", booking)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {booking.status === "pending" && (
                        <DropdownMenuItem onClick={() => handleConfirmAction(booking, "confirm")} className="text-success">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmer
                        </DropdownMenuItem>
                      )}
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <DropdownMenuItem onClick={() => handleConfirmAction(booking, "cancel")} className="text-destructive">
                          <XCircle className="w-4 h-4 mr-2" />
                          Annuler
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Route */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <div className="w-0.5 h-4 bg-primary/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[1rem] text-foreground">{booking.from}</p>
                    <p className="text-sm text-muted-foreground mt-1">{booking.to}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {booking.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {booking.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {booking.seats}
                  </div>
                </div>

                {/* Users & Price */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {booking.passenger.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">→</span>
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-accent/10 text-accent text-xs">
                        {booking.driver.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-lg font-bold text-primary">{booking.price} €</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BookingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        booking={selectedBooking}
        mode={modalMode}
      />

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={executeAction}
        title={confirmAction?.action === "cancel" ? "Annuler la réservation ?" : "Confirmer la réservation ?"}
        description={confirmAction?.action === "cancel" 
          ? "Cette action annulera la réservation. Le passager sera notifié."
          : "Cette action confirmera la réservation. Les deux parties seront notifiées."}
        variant={confirmAction?.action === "cancel" ? "danger" : "success"}
        confirmText={confirmAction?.action === "cancel" ? "Annuler" : "Confirmer"}
      />
    </>
  );
}
