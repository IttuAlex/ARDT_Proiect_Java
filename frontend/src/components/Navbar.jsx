import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../images/LOGO3.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setOpen(prev => !prev);
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <a href="/home" className="navbar-logo" aria-label="MAZI Coffee – Home">
        <img src={logo} alt="MAZI Coffee logo" />
      </a>

      <button className={`burger ${open ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-menu ${open ? "show" : ""}`}>
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/order")}>Order</button>
        <button onClick={() => navigate("/socials")}>Socials</button>
        <button onClick={() => navigate("/about")}>About</button>
        
        {user ? (
            <div className="user-controls">
                <button className="account-btn" onClick={() => navigate("/account")}>
                    Account
                </button>
                <button 
                    className="logout-btn" 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
                Login
            </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;