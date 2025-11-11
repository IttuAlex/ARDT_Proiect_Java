import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../images/LOGO3.png";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setOpen(prev => !prev);

  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo" aria-label="MAZI Coffee – Home">
        <img src={logo} alt="MAZI Coffee logo" />
      </a>

      {/* Buton hamburger */}
      <button className={`burger ${open ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Meniul – folosit și pentru desktop și pentru mobil */}
      <div className={`navbar-menu ${open ? "show" : ""}`}>
        <button onClick={() => navigate("/order")}>Order</button>
        <button>Menu</button>
        <button onClick={() => navigate("/socials")}>Socials</button>
        <button>About Us</button>
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
