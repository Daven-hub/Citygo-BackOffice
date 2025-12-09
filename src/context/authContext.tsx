// AuthContext.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAllUsers } from "@/store/slices/user.slice";
import { logout } from "@/store/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hook";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();

  const { users } = useAppSelector((state) => state.users);
  const { user } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);

  console.log('user',user)
  console.log('users',users)
  // detail = utilisateur connecté via auth.slice
  const detail = useMemo(() => user, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();

      await Promise.all([
        dispatch(getAllUsers()),
      ]);

      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);

      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };

    fetchData();
  }, [dispatch]);

  const userConnected = useMemo(() => {
    if (!detail || !users) return null;
    const oneUser =
      users?.find((x) => x?.id === detail?.id)

    if (!oneUser) return null;

    const { password, ...rest } = oneUser;
    return rest;
  }, [users, detail]);

  const refreshUser = async () => {
    await Promise.all([dispatch(getAllUsers())]);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    window.location.replace("/");
  };


  return (
    <AuthContext.Provider
      value={{
        userConnected,
        handleLogout,
        isLoading,
        duration,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
