import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoutes from './utils/ProtectedRoutes';
import { Box, Container } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoutePage from './pages/RoutePage';
import HotelPage from './pages/HotelPage';
import PlanPage from './pages/PlanPage';
import RestaurantPage from './pages/RestaurantPage';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CurrencyConverter from './pages/CurrencyConverter'; // Import CurrencyConverter component
import EmergencyConnector from './pages/EmergencyConnector';
import Weather from './pages/Weather';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container component="main" sx={{ flex: 1 }}>
            <div>
              <Routes>
                <Route element={<ProtectedRoutes />}>
                  <Route path="/Home" element={<Home />} />
                  <Route path="/Profile" element={<Profile />} />
                  <Route path="/ForgotPassword" element={<ForgotPassword />} />
                </Route>
                <Route path="/" element={<Home />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/find-route" element={<RoutePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/find-hotel" element={<HotelPage />} />
                <Route path="/find-restaurant" element={<RestaurantPage />} />
                <Route path="/schedule-plan" element={<PlanPage />} />
                <Route path="/currency-converter" element={<CurrencyConverter />} />
                <Route path="/emergency-connector" element={<EmergencyConnector />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/Navbar" element={<Navbar />} />
              </Routes>
            </div>
          </Container>
          <Footer />
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
