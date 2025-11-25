import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from "./components/header/Layout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./route/protectedRoute";
import LinkProtected from "./route/LinkProtected";
import Utilisateurs from "./pages/Utilisateurs";

// const queryClient = new QueryClient();

const App = () => (
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route element={<LinkProtected />}>
            <Route path="/connexion" element={<Login />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />} >
              <Route index element={<Dashboard />} />
              <Route path="utilisateurs" element={<Utilisateurs />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
);

export default App;
