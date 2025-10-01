/*Navbar for after login pages*/
import React from "react";
import "./Navbar.css";
import logob from "../../assets/logob.png";
import profilelogo from "../../assets/profile-logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const Navbar2 = () => {
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const header = document.querySelector(".header");
  //     const logo = document.querySelector(".logo");
  //     const navLinks = document.querySelectorAll(".nav a");

  //     if (window.scrollY > 50) {
  //       // Adjust the scroll value as needed
  //       header.classList.add("scrolled");
  //       logo.classList.add("scrolled");
  //       navLinks.forEach((link) => link.classList.add("scrolled"));
  //     } else {
  //       header.classList.remove("scrolled");
  //       logo.classList.remove("scrolled");
  //       navLinks.forEach((link) => link.classList.remove("scrolled"));
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Optionally redirect to homepage or another appropriate page after logout
  };

  const planCreated = localStorage.getItem("planCreated");

  return (
    <header className="nav-header">
      <a href="/Dashboard" className="nav-logo">
        <img src={logob} alt="Tour Mate Logo" className="logo-image" />
      </a>

      <nav
        className="nav-links"
        style={{ display: "flex", gap: "30px", alignItems: "center" }}
      >
        <Link to="/dashboard">Home</Link>
        <Link to="/find-route">Route</Link>
        <Link to="/find-hotel">Hotels</Link>

        <Link to="/find-places">Places</Link>
        <Link to={planCreated ? "/schedule-plan" : "/create-plan"}>
          Schedule
        </Link>
      </nav>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <a href="/profile" className="nav-profile">
          <img src={profilelogo} alt="Profile" className="profile-logo" />
        </a>

        <Link to="/" className="link-button">
          <button onClick={handleLogout} className="logout-btn">
            LOG OUT
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar2;
