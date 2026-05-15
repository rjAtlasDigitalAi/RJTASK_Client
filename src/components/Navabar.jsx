
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navabar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="nav-wrapper">
      <nav className="nav-container">
        
        {/* Brand */}
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          Task Manager
        </Link>

        {/* Toggle */}
        <button
          className={`nav-toggle ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links */}
        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Staff
          </Link>
          <Link to="/asstmanager-login" onClick={() => setIsOpen(false)}>
            Assistant Manager
          </Link>
          <Link to="/manager-login" onClick={() => setIsOpen(false)}>
            Manager
          </Link>
          <Link to="/admin-login" onClick={() => setIsOpen(false)}>
            Admin
          </Link>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
