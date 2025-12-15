import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import LoaderUltra from "@/components/ui/loaderUltra";

export default function LinkProtected() {
  const { userConnected, isLoading } = useAuth();

  if (isLoading) {
    return <LoaderUltra loading={true} />;
  }

  if(!userConnected){
    return <Outlet />;
  }else{
    window.location.replace('/')
  }
}
