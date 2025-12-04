import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./route/protectedRoute";
import LinkProtected from "./route/LinkProtected";
import LoaderUltra from "./components/ui/loaderUltra";
import { useAuth } from "./context/authContext";
import LayoutSetting from "./components/header/LayoutSetting";
import Notifications from "./pages/Notifications";
import Transactions from "./pages/Transactions";
import Rides from "./pages/Rides";
import Bookings from "./pages/Bookings";
import Destinations from "./pages/Destinations";
import Rapports from "./pages/Rapports";
import UserDetail from "./pages/UserDetail";

// Lazy loading
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Layout = lazy(() => import("./components/header/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UsersAdministration = lazy(() => import("./pages/UsersAdministration"));
const Profile = lazy(() => import("./pages/Profile"));
const DetailUserAdmin = lazy(() => import("./pages/DetailUserAdmin"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));

const App = () => {
  const {loading}=useAuth()
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<LoaderUltra loading={loading}/>}>
          <Routes>
            <Route element={<LinkProtected />}>
              <Route path="/connexion" element={<Login />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}> 
                <Route index element={<Dashboard />} />

                <Route path="utilisateurs-admin/">
                  <Route index element={<UsersAdministration />} />
                  <Route path=":userId" element={<DetailUserAdmin />} />
                </Route>
                {/* <Route path="rapports" element={<Rapports />} /> */}
                {/* <Route path="destinations" element={<Destinations />} /> */}
                <Route path="reservations" element={<Bookings />} />
                <Route path="settings" element={<Settings />} />
                <Route path="utilisateurs" element={<Users />} />
                <Route path="/utilisateurs/:userId" element={<UserDetail />} />
                <Route path="trajets" element={<Rides />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
  </>
  )
};

export default App;