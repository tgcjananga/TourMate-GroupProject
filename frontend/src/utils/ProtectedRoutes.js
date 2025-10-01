import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProtectedRoutes = () => {
  const [auth, setAuth] = useState(null); // auth is null initially (unknown state)

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Simulate token verification or async call (e.g., fetch user details)
    if (token) {
      // Mock async validation call
      setTimeout(() => {
        setAuth(true); // Set to true if token is valid
      }, 100); // Simulated delay, replace with your API validation logic
    } else {
      setAuth(false); // No token, set to false immediately
    }
  }, []);

  if (auth === null) {
    return (
      <div>
        <CircularProgress />
      </div>
    ); // While checking authentication
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
