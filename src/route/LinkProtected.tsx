import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import LoaderUltra from "@/components/ui/loaderUltra";

export default function LinkProtected() {
  const { userConnected, isLoading } = useAuth();
  const navigate=useNavigate()

  if (isLoading) {
    return <LoaderUltra loading={true} />;
  }

  if(!userConnected){
    return <Outlet />;
  }else{
    navigate('/')
  }
}
