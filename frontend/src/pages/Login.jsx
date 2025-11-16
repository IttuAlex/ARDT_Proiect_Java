import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FcGoogle } from "react-icons/fc";

export default function Login() {

  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Autentificare eșuată");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");

    } catch (err) {
      console.log("LOGIN ERROR >>>>", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    console.log("Se inițiază autentificarea Google...");
  };

  return (
    <div className="login-overlay">
      <Navbar />
      <div className="login-card">
        <h1 className="login-title">Autentificare</h1>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email" 
            placeholder="Adresă de email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
            autoComplete="current-password"
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Se încarcă..." : "Autentificare"}
          </button>
        </form>

        <div className="login-divider">
          <span>SAU</span>
        </div>

        <button
          type="button"
          className="google-login-button"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="google-icon" />
          Continuă cu Google
        </button>

        <p className="register-text">
          Nu ai cont?{" "}
          <span className="register-link" onClick={() => navigate("/register")}>
            Înregistrează-te!
          </span>
        </p>
      </div>
      <Footer />
    </div>
  );
}