import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from "./components/header/Layout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "./components/ui/toaster";

// const queryClient = new QueryClient();

const App = () => (
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/admin/" element={<Layout />} >
            <Route path="tableau-de-bord" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
);

export default App;
