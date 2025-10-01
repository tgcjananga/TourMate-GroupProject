import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";
import logo from "../../assets/logob.png";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="column">
          <img src={logo} alt="Tour Mate Logo" className="logo-image" />
        </div>
        <div className="column">
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
          </div>
        </div>
      </div>
      <div className="line"></div>
      <div className="footer-bottom">
        &copy;{new Date().getFullYear()} TourMate.All rights reserved.
      </div>
    </footer>
  );
}
