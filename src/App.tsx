import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./route/protectedRoute";
import LinkProtected from "./route/LinkProtected";
import LoaderUltra from "./components/ui/loaderUltra";
import Notifications from "./pages/Notifications";
// import Transactions from "./pages/Transactions";
// import Rides from "./pages/Rides";
// import Bookings from "./pages/Bookings";
// import Destinations from "./pages/Destinations";
import Rapports from "./pages/Rapports";
import UserDetail from "./pages/UserDetail";
import BookingsDetail from "./pages/BookingsDetail";
import RidesDetail from "./pages/RidesDetail";
import KYCRequestDetail from "./pages/KYCRequestDetail";
import DriverApplicationDetail from "./pages/DriverApplicationDetail";
import KYC from "./pages/KYC/index";
import Vehicles from "./pages/Vehicles";
import SupportTickets from "./pages/SupportTickets";
import SupportTicketDetail from "./pages/SupportTicketDetail";
import VehicleDetail from "./pages/VehicleDetail";
import VehicleType from "./pages/catalogue/VehicleType";
import Languages from "./pages/catalogue/Languages";
import Currencies from "./pages/catalogue/Currencies";
import LuggageType from "./pages/catalogue/LuggageType";
import { useAuth } from "./context/use-auth";
import DetailDocument from "./pages/DetailDocument";
import PlatformFees from "./pages/PlatformFees";
import PlatformFeeByType from "./pages/PlatformFeesByType";

// Lazy loading
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Layout = lazy(() => import("./components/header/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));

const App = () => {
  const {loading}=useAuth()
  return (
    <>
      <Toaster />
      <BrowserRouter
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
      >
        <Suspense fallback={<LoaderUltra loading={loading}/>}>
          <Routes>
            <Route element={<LinkProtected />}>
              <Route path="/connexion" element={<Login />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}> 
                <Route index element={<Dashboard />} />
                <Route path="vehicules" element={<Vehicles />} />
                <Route path="frais-de-platforme" element={<PlatformFees />} />
                <Route path="types-de-frais" element={<PlatformFeeByType />} />
                <Route path="type-de-vehicule" element={<VehicleType />} />
                <Route path="langues" element={<Languages />} />
                <Route path="monnaies" element={<Currencies />} />
                <Route path="type-de-bagage" element={<LuggageType />} />
                <Route path="vehicules/:vehicleId" element={<VehicleDetail />} />
                {/* <Route path="reservations" element={<Bookings />} /> */}
                <Route path="reservations/:bookingId" element={<BookingsDetail />} />
                <Route path="kyc" element={<KYC />} />
                <Route path="kyc/demande/:requestId" element={<KYCRequestDetail />} />
                <Route path="kyc/applications/:applicationId" element={<DriverApplicationDetail />} />
                <Route path="settings" element={<Settings />} />
                <Route path="utilisateurs" element={<Users />} />
                <Route path="/utilisateurs/:userId" element={<UserDetail />} />
                <Route path="/documents/:docId" element={<DetailDocument />} />
                {/* <Route path="trajets" element={<Rides />} /> */}
                <Route path="trajets/:rideId" element={<RidesDetail />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="support" element={<SupportTickets />} />
                <Route path="support/:ticketId" element={<SupportTicketDetail />} />
                {/* <Route path="transactions" element={<Transactions />} /> */}
                {/* <Route path="destinations" element={<Destinations />} /> */}
                {/* <Route path="profile" element={<Profile />} /> */}
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
