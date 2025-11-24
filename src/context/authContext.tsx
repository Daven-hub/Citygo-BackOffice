// AuthContext.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/store/slices/user.slice";
import { logout } from "@/store/slices/auth.slice";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);

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
      users.find((x) => x?.id === detail?.id)
      null;

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
