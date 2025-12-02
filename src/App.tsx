import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./route/protectedRoute";
import LinkProtected from "./route/LinkProtected";
import LoaderUltra from "./components/ui/loaderUltra";
import { useAuth } from "./context/authContext";
import LayoutSetting from "./components/header/LayoutSetting";
import Notifications from "./pages/Notifications";

// Lazy loading
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Layout = lazy(() => import("./components/header/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UsersAdministration = lazy(() => import("./pages/UsersAdministration"));
const Profile = lazy(() => import("./pages/Profile"));
const DetailUserAdmin = lazy(() => import("./pages/DetailUserAdmin"));
const Passager = lazy(() => import("./pages/Passager"));
const Drivers = lazy(() => import("./pages/Drivers"));
const DriverDetail = lazy(() => import("./pages/DriverDetail"));
const Settings = lazy(() => import("./pages/Settings"));

const App = () => {
  const {loading}=useAuth()
  return (
  <BrowserRouter>
    <Toaster />
    <Suspense fallback={<LoaderUltra loading={loading}/>}>
      <Routes>
        <Route element={<LinkProtected />}>
          <Route path="/connexion" element={<Login />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}> 
            <Route index element={<Dashboard />} />

            <Route path="passagers/">
              <Route index element={<Passager />} />
              <Route path=":passagerId" element={<DetailUserAdmin />} />
            </Route>

            <Route path="drivers/">
              <Route index element={<Drivers />} />
              <Route path=":driverId" element={<DriverDetail />} />
            </Route>

            <Route path="utilisateurs-admin/">
              <Route index element={<UsersAdministration />} />
              <Route path=":userId" element={<DetailUserAdmin />} />
            </Route>

            {/* <Route path="settings/" element={<LayoutSetting />}>
              <Route index element={<Settings />} />
            </Route> */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
  )
};

export default App;