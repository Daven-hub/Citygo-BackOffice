import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";

// const queryClient = new QueryClient();

const App = () => (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
);

export default App;
