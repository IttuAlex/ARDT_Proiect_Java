import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Login.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Înregistrare eșuată");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("auth-change"));

      toast.success("Cont creat cu succes!");
      navigate("/");
      
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    alert("Te rugăm să folosești pagina de Login pentru autentificarea cu Google.");
    navigate("/login");
  };

  return (
    <div className="login-overlay">
      <Navbar />
      <div className="login-card">
        <h1 className="login-title">Înregistrare</h1>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            placeholder="Nume utilizator"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
            autoComplete="username"
          />

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
            autoComplete="new-password"
          />

          <input
            type="password"
            placeholder="Confirmă parola"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-input"
            required
            autoComplete="new-password"
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Se încarcă..." : "Înregistrează-te"}
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
          Ai deja cont?{" "}
          <span className="register-link" onClick={() => navigate("/login")}>
            Autentifică-te!
          </span>
        </p>
      </div>
      <Footer />
    </div>
  );
}