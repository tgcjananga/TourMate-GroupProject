import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import RoutePage from "./pages/RoutePage";
import HotelPage from "./pages/HotelPage";
import PlanPage from "./pages/PlanPage";
import RestaurantPage from "./pages/RestaurantPage";
import Navbar from "./components/NavBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { Box } from "@mui/material";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import CurrencyConverter from "./pages/CurrencyConverter";
import EmergencyConnector from "./pages/EmergencyConnector";
import Weather from "./pages/Weather";

const App = () => {
  return (
    <AuthProvider>
      <Router>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" ,}}
      >
        <Header />
 
          <div>
            <Routes>
              <Route element={<ProtectedRoutes />}>
                <Route path="/Home" element={<Home />} />
              </Route>
              <Route path="/" element={<Home />} />{" "}
              {/* Initially load Log in page */}
              <Route path="/Signup" element={<Signup />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/find-route" element={<RoutePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/find-hotel" element={<HotelPage />} />
            <Route path="/find-restaurant" element={<RestaurantPage />} />
            <Route path="/schedule-plan" element={<PlanPage />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Navbar" element={<Navbar />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/currency-converter" element={<CurrencyConverter />} />
            <Route path="/emergency-connector" element={<EmergencyConnector />} />
            <Route path="/weather" element={<Weather />} />
            </Routes>
          </div>

        <Footer /> {/* Footer included here */}
      </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
