import React from 'react';
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import RoutePage from "./pages/RoutePage";
import HotelPage from "./pages/HotelPage";
import RestaurantPage from "./pages/RestaurantPage";
import PlanPage from "./pages/PlanPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/Home" element={<Home />} />
            </Route>
            <Route path="/" element={<Login />} />{" "}
            {/* Initially load Log in page */}
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/find-route" element={<RoutePage />} />
            <Route path="/find-hotel" element={<HotelPage />} />
            <Route path="/find-restaurant" element={<RestaurantPage />} />
            <Route path="/schedule-plan" element={<PlanPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
