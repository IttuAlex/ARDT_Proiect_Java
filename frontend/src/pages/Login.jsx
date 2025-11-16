import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Login.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {FcGoogle} from "react-icons/fc";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const[loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try{
      await login (username, password);
      navigate("/");

    }
    catch(err) {
      console.log("LOGIN ERROR >>>>",
        err?.response?.status, err?.response?.data || err.message);
        const msg = err?.response?.data?.error || "Autentificare esuata";
        setError(msg);
      }finally{
        setLoading(false)
      }
  
    }

    const handleGoogleLogin = () => {
        console.log("Se initiaza autentificarea Google...");

    };


  return(
    <div className="login-overlay">
      <Navbar/>
      <div className="login-card">
        <h1 className="login-title">Autentificare
        </h1>
        <form onSubmit = {handleSubmit} noValidate>
          <input
            type="text"
            placeholder = "Nume utilizator"
            value = {username}
            onChange = {(e) => setUsername(e.target.value)}
              className="login-input"
              required
              autoComplete="username"
          />
          <input
            type="password"
            placeholder = "Parola"
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
            className="login-input"
            required
            autoComplete = "current-password"
            />
            {error && <p className="login-error">{error}</p>}
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Se incarca..." : "Autentificare"}
            </button>

        </form>
        
        <div className="login-divider">
            <span>SAU</span>
        </div>

        <button type="button" className="google-login-button" onClick={handleGoogleLogin}>
            <FcGoogle className="google-icon"/>
            Continua cu Google

        </button>

        <p className="register-text">
          Nu ai cont?{" "}
          <span className="register-link" onClick={
            () => navigate("/register")}>
              Inregistreaza-te!
            </span>
        </p>
      </div>
      <Footer/>
    </div>
  )
}