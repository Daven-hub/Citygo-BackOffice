import { useToast } from "@/hook/use-toast";
import { useAppDispatch } from "@/store/hook";
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
      const response= await dispatch(login(data)).unwrap();
      console.log('response',response)
      toast({
        title: "Connexion reussie",
        description: "Bienvenue "+response?.data?.user?.profile?.displayName,
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg shadow-gray-200/50 border border-gray-200 rounded-xl px-6 py-8 sm:px-10 sm:py-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              className="w-40 sm:w-48 h-auto"
              src={'/images/FullLogo.png'}
              alt="CityGo"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {/* Phone Input */}
            <div>
              <input
                {...register('phoneNumber')}
                autoComplete="off"
                type="text"
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                placeholder="Téléphone (+237) *"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                {...register('password')}
                autoComplete="off"
                type="password"
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                placeholder="Mot de passe *"
              />
            </div>

            {/* Remember & Forgot - Stacks on mobile */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  {...register("rememberMe")}
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <span>Se souvenir de moi</span>
              </label>

              <NavLink
                to="/mot-de-passe-oublie"
                className="text-sm text-gray-500 font-medium hover:text-primary transition-colors"
              >
                Mot de passe oublié ?
              </NavLink>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Se connecter"
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-400">
            CityGo Backoffice
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
