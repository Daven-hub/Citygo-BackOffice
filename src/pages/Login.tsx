import { useToast } from "@/hook/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { login } from "@/store/slices/auth.slice";
import { Loader2 } from "lucide-react";
import  { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";


function Login() {
  const dispatch=useAppDispatch()
  const [loading, setLoading] = useState(false);
  const {toast}=useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: errorLog },
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      password: "",
      rememberMe:false,
    },
  });


  const handleLogin = async (data) => {
    setLoading(true);
    try {
      await dispatch(login(data)).unwrap();
      window.location.replace('/')
      toast({
        title: "Connexion reussie",
        // description: "Bienvenue "+userConnected?.displayName,
      });
    } catch (error) {
      toast({
        title: "Connexion echouée",
        description: error?.toString(),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex px-[34.5%] bg-gray-200 items-center min-h-screen">
        <div className="w-full flex flex-col gap-2.5 items-center">
          {/* <img className="w-[95px]" src={'/images/shortLogo.png'} alt="logo_citygo" /> */}
          <div className="bg-white w-full items-center shadow-sm shadow-gray-300 border-gray-300/85 flex flex-col gap-7 px-9 py-8 rounded-[10px] border">
            <img className="w-[190px]" src={'/images/FullLogo.png'} alt="logo_citygo" />
            <form onSubmit={handleSubmit(handleLogin)}
              className="flex w-full text-[.85rem] flex-col gap-3"
            >
              <div className="flex flex-col gap-0">
                <input
                {...register('phoneNumber')}
                  autoComplete="off"
                  type="text"
                  className="flex border-2 border-gray-200 focus:ring-2 focus:ring-primary/60 w-full px-3 py-3 rounded-[5px] outline-0"
                  placeholder="Téléphone (+237) *"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <input
                {...register('password')}
                autoComplete="off"
                  type="password"
                  className="flex border-2 border-gray-200 focus:ring-2 focus:ring-primary/60 w-full px-3 py-3 rounded-[5px] outline-0"
                  placeholder="Password *"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-[.8rem] text-gray-700">
                  <input
                    {...register("rememberMe")}
                    type="checkbox"
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
