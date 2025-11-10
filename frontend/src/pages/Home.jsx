import React from "react";
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div className="home">
      <Navbar />

      <header>
        <h1>Home</h1>
      </header>
      
      <Footer />
    </div>
  );
}
