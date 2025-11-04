import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(prev => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-logo">MAZI Coffee</div>

      {/* Buton hamburger */}
      <button className={`burger ${open ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Meniul – folosit și pentru desktop și pentru mobil */}
      <div className={`navbar-menu ${open ? "show" : ""}`}>
        <button>Order</button>
        <button>Menu</button>
        <button>Socials</button>
        <button>About Us</button>
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
