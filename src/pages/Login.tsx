import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);
  // const [isLoading, setLoading] = useState(false);


  const handleLogin = async () => {
    setIsLoading(true);
    try {

    } catch (error) {
   
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex px-[34.5%] bg-gray-300 items-center min-h-screen">
        <div className="w-full flex flex-col gap-4 items-center">
          <div className="bg-white w-full items-center shadow-sm flex flex-col gap-8 px-9 py-8 rounded-[10px] border-2">
            <img className="w-[200px]" src={'/images/FullLogo.png'} alt="logo_citygo" />
            <form
              className="flex w-full text-[.85rem] flex-col gap-4"
            >
              <div className="flex flex-col gap-0.5">
                <input
                  type="text"
                  className="flex border-2 border-gray-200 focus:ring-2 focus:ring-primary w-full px-3 py-3.5 rounded-[5px] outline-0"
                  placeholder="Nom d'utilisateur ou Email *"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <input
                  type="password"
                  className="flex border-2 border-gray-200 focus:ring-2 focus:ring-primary w-full px-3 py-3.5 rounded-[5px] outline-0"
                  placeholder="Password *"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-[.8rem] text-gray-700">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="w-3 h-3 accent-blue-600 rounded cursor-pointer"
                  />
                  <span>Se souvenir de moi</span>
                </label>

                <NavLink
                  to="/mot-de-passe-oublie"
                  className="text-[.8rem] text-black/60 font-medium hover:text-secondary hover:underline"
                >
                  Mot de passe oublié ?
                </NavLink>
              </div>
              <div className="flex flex-col justify-center items-center gap-3.5 my-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary font-semibold w-full transition-all duration-500 hover:opacity-85 cursor-pointer py-3 px-5 flex items-center justify-center rounded-[5px] text-white disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}

export default Login;
