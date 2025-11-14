import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";


function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);


  const handleLogin = async () => {
    setIsLoading(true);
    try {

    } catch (error) {
   
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex px-[34%] bg-gray-200 items-center min-h-screen">
        <div className="w-full flex flex-col gap-4 items-center">
          <img className="w-[100px]" src={'/images/shortLogo.png'} alt="logo_citygo" />
          <div className="bg-white rounded-[6px] text-sm border-l-4 border-primary text-gray-400 px-5 py-3 w-full">
              <span>Merci de renseigner votre nom d'utilisateur ou votre adresse e-mail. Vous recevrez un e-mail contenant les instructions vous permettant de rénitialiser votre mot de passe.</span>
          </div>
          <div className="flex flex-col gap-3.5 w-full">
            <div className="w-full bg-white border-gray-200 px-8 py-8 flex flex-col gap-6 rounded-[6px] border-2">
              <form
                className="flex w-full text-[.9rem] flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <Label className="text-[0.85rem] text-black/60">Nom d'utilisateur ou adresse e-mail</Label>
                  <input
                    type="text"
                    className="flex border-2 border-gray-200 focus:ring-2 focus:ring-primary w-full px-2 py-2.5 rounded-[5px] outline-0"
                    placeholder="*****@exemple.com"
                  />
                </div>
              
                <div className="flex flex-col justify-end items-end gap-3.5 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-secondary w-full text-[0.9rem] font-medium transition-all duration-500 hover:opacity-85 cursor-pointer py-3.5 px-5 flex items-center justify-center rounded-[5px] text-white disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5 text-white" />
                    ) : (
                      "Rénitialiser mon mot de passe"
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="flex items-center gap-1">
               - <NavLink className="font-normal text-gray-500 text-sm hover:text-secondary hover:underline" to={'/'}>Se connecter</NavLink>
            </div>
          </div>
        </div>
    </div>
  );
}

export default ForgotPassword;
