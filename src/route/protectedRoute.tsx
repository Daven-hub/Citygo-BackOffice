import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import LoaderUltra from "@/components/ui/loaderUltra";

export default function ProtectedRoute() {
  const { userConnected, isLoading } = useAuth();

  if (isLoading) {
    return <LoaderUltra loading={true} />;
  }

  if(!userConnected){
    return <Navigate to="/connexion" replace />;
  }

  return <Outlet />;
}
