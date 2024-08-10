import React from 'react';
import './Footer.css'; 
import logo from './images/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a href="/" className="footer-logo-link">
          <img src={logo} alt="Logo" className="footer-logo" />
        </a>
        <div className="footer-links">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/in/carla-rodriguesm/" target="_blank" rel="noopener noreferrer" className="footer-link">
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
            <i className="fa-brands fa-youtube"></i>
          </a>
        </div>
        <div className="footer-text">
          © 2024 Skincare Review
        </div>
      </div>
    </footer>
  );
};

export default Footer;
