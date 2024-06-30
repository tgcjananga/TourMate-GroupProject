import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from "../utils/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Logtest() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:1200/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const jwtToken = await response.text();
        login(jwtToken);
        navigate("/Home");
      } else {
        console.error("Login failed with status:", response.status);
        // Handle error: Show error message to the user
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle error: Show error message to the user
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className="text-center mt-3">
          <Link to="/ForgotPassword" className="btn btn-link">
            Forgot Password?
          </Link>
        </div>
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
