// AuthContext.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAllUsers } from "@/store/slices/user.slice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logoutAsync } from "@/store/slices/auth.slice";
import { useToast } from "@/hook/use-toast";
// import { injectLogoutHandler } from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const {toast}=useToast()

  const {users } = useAppSelector((state) => state.users);
  const { user } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);

  const detail = useMemo(() => user, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      await Promise.all([
        dispatch(getAllUsers())
      ]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };

    fetchData();
  }, [dispatch]);

  const userConnected = useMemo(() => {
      if (!detail || !users ) return null;
      const oneUser = users?.find((x)=>x.id===user?.userId) || null;
      if (!oneUser) return null;
      return oneUser;
    }, [users, detail,user?.userId]);

  // console.log('userConnected',userConnected)


  const handleLogout = async () => {
      setIsLoading(true);
      try {
        await dispatch(logoutAsync()).unwrap();
        window.location.replace("/connexion");
      } catch (error) {
        toast({
          title: "Déconnexion échouée",
          description: error?.toString(),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
  };

  // injectLogoutHandler();

  return (
    <AuthContext.Provider
      value={{
        userConnected,
        handleLogout,
        isLoading,
        duration
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
