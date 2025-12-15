import { UserSuspendModal } from "@/components/modal/UserSuspendModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hook/use-toast";
import { useAppDispatch } from "@/store/hook";
import { getUserById, unSuspendUserById, UserType } from "@/store/slices/user.slice";
import { Ban, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function UserAdminActions({ user }) {
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const dispatch=useAppDispatch()
  const {toast}=useToast()
  const handleSuspendUser = (user: UserType) => {
    setSelectedUser(user);
    setSuspendModalOpen(true);
  };

  const handleReactive = async (userId: string) => {
      setLoading(true);
      try {
        const datas =user;
        await dispatch(unSuspendUserById(userId)).unwrap();
        toast({
          title: "Utilisateur réactivé",
          description: `${datas?.displayName} a été réactivé.`,
        });
        await dispatch(getUserById(userId)).unwrap();
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
  return (
    <>
      <div className="flex gap-2">
        {user.status === "ACTIVE" && (
          <Button type="button" onClick={()=>handleSuspendUser(user)} className="text-destructive" variant="outline">
            <Ban className="w-4 h-4 mr-1" />
            Suspendre
          </Button>
        )}

        {user.status === "SUSPENDED" && (
          <Button type="button" onClick={()=>handleReactive(user.id)} variant="outline" className="text-success">
            <ShieldCheck className="w-4 h-4 mr-1" />
            {loading?<Loader2 size={15}/>: 'Réactiver'}
          </Button>
        )}
      </div>
      <UserSuspendModal
        user={selectedUser}
        open={suspendModalOpen}
        onOpenChange={setSuspendModalOpen}
      />
    </>
  );
}
