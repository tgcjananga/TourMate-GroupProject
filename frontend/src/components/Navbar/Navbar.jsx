import React, { useEffect } from "react";
import "./Navbar.css";
import logob from "../../assets/logob.png";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  // Function to handle the "Explore" scroll action
  const handleExploreScroll = () => {
    navigate("/"); 
    setTimeout(() => {
      const placeSection = document.querySelector(".places-container");
      if (placeSection) {
        placeSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); 
  };

  const handleHomeScroll = () => {
    navigate("/"); 
    setTimeout(() => {
      const placeSection = document.querySelector(".home");
      if (placeSection) {
        placeSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); 
  };

  //   useEffect(() => {
  //     const handleScroll = () => {
  //       const header = document.querySelector(".header");
  //       const logo = document.querySelector(".logo");
  //       const navLinks = document.querySelectorAll(".nav a");

  //       if (window.scrollY > 50) {
  //         // Adjust the scroll value as needed
  //         header.classList.add("scrolled");
  //         logo.classList.add("scrolled");
  //         navLinks.forEach((link) => link.classList.add("scrolled"));
  //       } else {
  //         header.classList.remove("scrolled");
  //         logo.classList.remove("scrolled");
  //         navLinks.forEach((link) => link.classList.remove("scrolled"));
  //       }
  //     };

  //     window.addEventListener("scroll", handleScroll);

  //     return () => {
  //       window.removeEventListener("scroll", handleScroll);
  //     };
  //   }, []);
  
  return (
    <header className="nav-header">
      <a href="/" className="nav-logo">
        <img src={logob} alt="Tour Mate Logo" className="logo-image" />
      </a>

      <nav
        className="nav-links"
        style={{ display: "flex", gap: "80px", alignItems: "center" }}
      >
        <Link to="/" onClick={handleHomeScroll}>Home</Link>
        <Link to="/contact-us">ContactUS</Link>
        <Link to="/" onClick={handleExploreScroll}>Explore</Link>
      </nav>
      <Link to="/signup" className="link-button">
        <button className="signin-btn">SIGN IN</button>
      </Link>
    </header>
  );
};

export default Navbar;
