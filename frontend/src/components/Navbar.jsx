import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../images/LOGO3.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => setOpen(prev => !prev);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener("auth-change", checkUser);

    return () => {
      window.removeEventListener("auth-change", checkUser);
    };
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    window.dispatchEvent(new Event("auth-change"));
    
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
                <button 
                    className="account-btn" 
                    onClick={() => navigate("/account")}
                >
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