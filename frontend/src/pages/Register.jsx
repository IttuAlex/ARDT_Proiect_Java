import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // --- REUTILIZĂM ACELAȘI CSS ---
import Navbar from "../components/Navbar";
// import Footer from "../components/Footer"; // Dacă ai
import { FcGoogle } from "react-icons/fc";
import Footer from "../components/Footer";

export default function Register() {
  // --- STATE-URI NOI PENTRU CÂMPURI SUPLIMENTARE ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Câmp nou
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Câmp nou
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); // Resetează eroarea

    // --- VALIDARE CLIENT-SIDE PENTRU PAROLE ---
    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      return; // Oprește trimiterea formularului
    }

    setLoading(true);
    try {
      // --- Aici vei apela funcția ta de 'register' ---
      // await register(username, email, password);
      console.log("Se trimit datele de înregistrare:", { username, email, password });
      
      // Navighează spre pagina principală (sau spre login) după succes
      navigate("/");

    } catch (err) {
      console.log(
        "REGISTER ERROR >>>>",
        err?.response?.status,
        err?.response?.data || err.message
      );
      const msg = err?.response?.data?.error || "Înregistrarea a eșuat";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // Funcția pentru Google rămâne identică
  const handleGoogleLogin = () => {
    console.log("Se inițiază înregistrarea Google...");
    alert("Logica Google Auth nu este implementată încă.");
  };

  return (
    // Reutilizăm aceleași clase CSS ca la Login
    <div className="login-overlay"> 
      <Navbar />
      <div className="login-card">
        {/* --- TITLU SCHIMBAT --- */}
        <h1 className="login-title">Înregistrare</h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* --- CÂMPUL USERNAME (existent) --- */}
          <input
            type="text"
            placeholder="Nume utilizator"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
            autoComplete="username"
          />

          {/* --- CÂMP NOU: EMAIL --- */}
          <input
            type="email"
            placeholder="Adresă de email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
            autoComplete="email"
          />

          {/* --- CÂMPUL PAROLĂ (existent) --- */}
          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
            autoComplete="new-password" // 'new-password' ajută managerii de parole
          />

          {/* --- CÂMP NOU: CONFIRMARE PAROLĂ --- */}
          <input
            type="password"
            placeholder="Confirmă parola"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-input"
            required
            autoComplete="new-password"
          />

          {/* Afișează eroarea (dacă există, ex. parolele nu se potrivesc) */}
          {error && <p className="login-error">{error}</p>}

          {/* --- TEXT BUTON SCHIMBAT --- */}
          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Se încarcă..." : "Înregistrează-te"}
          </button>
        </form>

        {/* --- Separatorul și butonul Google rămân identice --- */}
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

        {/* --- LINK NAVIGARE SCHIMBAT --- */}
        <p className="register-text">
          Ai deja cont?{" "}
          <span className="register-link" onClick={() => navigate("/login")}>
            Autentifică-te!
          </span>
        </p>
      </div>
      <Footer/>
    </div>
  );
}