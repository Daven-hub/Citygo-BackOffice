import { Outlet } from "react-router-dom";
import LoaderUltra from "@/components/ui/loaderUltra";
import { useAuth } from "@/context/use-auth";

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
