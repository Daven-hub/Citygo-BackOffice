import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetUserById, GetUsetActivityLogById } from "@/store/slices/user.slice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import LoaderUltra from "@/components/ui/loaderUltra";
import UserHeader from "@/components/tabs/users/UserHeader";
import {
  UnderlineTabs,
  UnderlineTabsContent,
} from "@/components/ui/underline-tabs";
import Overview from "@/components/tabs/users/Overview";
import ActivityTab from "@/components/tabs/users/ActivityTab";
import { PersonnalInfo } from "@/components/tabs/users/PersonnalInfo";

// const userTransactions = [
//   {
//     id: "T001",
//     type: "payment",
//     amount: 25.0,
//     date: "02/12/2024",
//     status: "completed",
//   },
//   {
//     id: "T002",
//     type: "refund",
//     amount: -18.5,
//     date: "01/12/2024",
//     status: "completed",
//   },
//   {
//     id: "T003",
//     type: "payout",
//     amount: 120.0,
//     date: "28/11/2024",
//     status: "pending",
//   },
//   {
//     id: "T004",
//     type: "commission",
//     amount: -5.0,
//     date: "25/11/2024",
//     status: "completed",
//   },
// ];

// const userBookings = [
//   {
//     id: "B001",
//     from: "Paris",
//     to: "Lyon",
//     date: "05/12/2024",
//     status: "confirmed",
//     seats: 2,
//   },
//   {
//     id: "B002",
//     from: "Marseille",
//     to: "Nice",
//     date: "10/12/2024",
//     status: "pending",
//     seats: 1,
//   },
//   {
//     id: "B003",
//     from: "Bordeaux",
//     to: "Toulouse",
//     date: "28/11/2024",
//     status: "cancelled",
//     seats: 3,
//   },
// ];

// const bookingStatusConfig = {
//   confirmed: {
//     label: "Confirmée",
//     className: "bg-primary/10 text-primary border-primary/20",
//   },
//   pending: {
//     label: "En attente",
//     className: "bg-warning/10 text-warning border-warning/20",
//   },
//   cancelled: {
//     label: "Annulée",
//     className: "bg-destructive/10 text-destructive border-destructive/20",
//   },
//   completed: {
//     label: "Terminée",
//     className: "bg-success/10 text-success border-success/20",
//   },
// };

// const documentTypeLabels = {
//   license: "Permis de conduire",
//   insurance: "Assurance",
//   vehicle_registration: "Carte grise",
//   identity: "Pièce d'identité",
// };

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const { usersId, userLogId } = useAppSelector((state) => state.users);

  const user = usersId;

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      await Promise.all([
        dispatch(GetUserById(userId)),
        dispatch(GetUsetActivityLogById(userId)),
      ]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();
  }, [dispatch, userId]);

  if (isLoading) {
    return <LoaderUltra loading={isLoading} duration={duration} />;
  }

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Utilisateur non trouvé</p>
        <Button onClick={() => navigate("/utilisateurs")} className="mt-4">
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate("/utilisateurs")}
        className="flex text-sm items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>
      <UnderlineTabs defaultValue="apercu">
        <UserHeader user={user} />
        <UnderlineTabsContent value="apercu">
          <Overview user={user} userLog={userLogId}/>
        </UnderlineTabsContent>

        <UnderlineTabsContent value="info">
         <PersonnalInfo user={user} />
        </UnderlineTabsContent>

        <UnderlineTabsContent value="activites">
          <ActivityTab userActivities={userLogId} />
        </UnderlineTabsContent>
        <UnderlineTabsContent value="reservations">
          Reservations
        </UnderlineTabsContent>
        <UnderlineTabsContent value="trajets">
          Trajets
        </UnderlineTabsContent>
      </UnderlineTabs>
    </div>
  );
}
