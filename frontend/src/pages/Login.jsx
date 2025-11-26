import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenResponse.access_token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Eroare la autentificare");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));

      toast.success(`Autentificare reușită! Bine ai venit, ${data.user.email}`);
      navigate("/");
    } catch (err) {
      setError("Nu s-a putut efectua autentificarea cu Google.");
      toast.error("Nu s-a putut efectua autentificarea cu Google.");
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Eroare Google Login"),
  });

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setShowRecovery(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setShowRecovery(true); 
        throw new Error(errorData.error || "Autentificare eșuată");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Autentificare reușită!");
      navigate("/");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecoverPassword() {
    if (!email) {
      toast.error("Introdu adresa de email mai sus!");
      return;
    }
    
    setLoading(true);
    try {
      await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      toast.info("📩 Ți-am trimis un email cu linkul de resetare.");
      setShowRecovery(false);
      setError("");
    } catch (err) {
      toast.error("Eroare la trimiterea emailului.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Parolele nu coincid");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });

      if (!response.ok) throw new Error("Link invalid sau expirat");

      toast.success("Parolă schimbată! Te rugăm să te loghezi.");
      navigate("/login"); 
      window.location.reload(); 
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (resetToken) {
    return (
      <div className="login-overlay">
        <Navbar />
        <div className="login-card">
          <h1 className="login-title">Parolă Nouă</h1>
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Noua parolă"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Confirmă parola"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input"
              required
            />
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Se salvează..." : "Salvează Parola"}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="login-overlay">
      <Navbar />
      <div className="login-card">
        <h1 className="login-title">Autentificare</h1>
        <form onSubmit={handleLogin} noValidate>
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
          
          {error && (
            <div style={{marginBottom: "1rem"}}>
                <p className="login-error">{error}</p>
                
                {showRecovery && (
                    <div 
                        onClick={handleRecoverPassword}
                        style={{
                            color: "#007bff", 
                            cursor: "pointer", 
                            fontSize: "0.9rem", 
                            textDecoration: "underline",
                            marginTop: "5px"
                        }}
                    >
                        Ai uitat parola? Trimite email de recuperare
                    </div>
                )}
            </div>
          )}

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
          onClick={() => loginGoogle()}
          disabled={loading}
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