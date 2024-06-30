<<<<<<< Updated upstream
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import {
  Avatar,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Link,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
>>>>>>> Stashed changes

export default function Logtest() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // For navigation after successful login

<<<<<<< Updated upstream
    const handleSubmit = async (event) => {  //async for handle asynchronus operation
        event.preventDefault();/*
// --------- authentication logic--------------------------------------------
// Send login request to backend
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
=======
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
>>>>>>> Stashed changes

    if (response.ok) {
      // Login successful, navigate to dashboard
      navigate('/dashboard');
    } else {
      // Login failed, handle error (e.g., show error message)
      console.error('Login failed');
    }
//--------------------------------------------------------------------------*/

<<<<<<< Updated upstream
        console.log("Logging in with:", email, password);
         navigate('/Home'); 
         //above two line should be comment when connect backend
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>EMAIL</label><br />
                <input type='email' value={email} onChange={e => setEmail(e.target.value)} required /><br />

                <label>PASSWORD</label><br />
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} required /><br />

                <button type='submit'>LOG IN</button><br />
                <label>Don't have an account</label> 
            </form>      

            <Link to="/Signup">SIGN UP</Link>
        </div>
    );
=======
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const paperstyle = {
    padding: 20,
    height: "70vh",
    width: 300,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btstyle = { margin: "8px 0" };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid>
          <Paper elevation={10} style={paperstyle}>
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <LockOutlinedIcon />
              </Avatar>
              <h2>Sign in</h2>
            </Grid>
            <TextField
              label="Username"
              style={{ margin: "8px 0" }}
              placeholder="Enter username"
              fullWidth
              required
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              style={{ margin: "8px 0" }}
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={btstyle}
              fullWidth
            >
              Sign in
            </Button>
            <Typography>
              <Link href="Test" variant="plain">
                Forgot password?
              </Link>
            </Typography>
            <Typography style={{ margin: "75px 0" }}>
              Do you haven't an account?
              <Link href="Signup" variant="plain">
                Sign Up
              </Link>
            </Typography>
          </Paper>
        </Grid>
      </form>
    </div>
  );
>>>>>>> Stashed changes
}
