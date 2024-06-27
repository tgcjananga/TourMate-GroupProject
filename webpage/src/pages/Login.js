import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from "../utils/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Logtest() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // For navigation after successful login

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Sending login request to backend...");
      const response = await fetch("http://localhost:1200/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const jwtToken = await response.text(); // Read the JWT token from the response body
        console.log("Login successful, received JWT token:", jwtToken);
        // Store the token securely, e.g., in localStorage or session storage
        login(jwtToken); // Update the auth context with the JWT token
        console.log("Navigating to Home...");
        navigate("/Home");
      } else {
        // Login failed, handle error (e.g., show error message)
        console.error("Login failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="input-group-append">
              <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Log In
        </button>
      </form>
      <div className="text-center mt-3">
        <label>Don't have an account?</label>
        <br />
        <Link to="/Signup" className="btn btn-secondary mt-2">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
