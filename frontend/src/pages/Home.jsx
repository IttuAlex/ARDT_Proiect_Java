import React from "react";
import "./Home.css"; // dacă ai un fișier CSS separat
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="home">
      <Navbar />

      <header>
        <h1>Home Page</h1>
      </header>
      
      <footer>
        <p>&copy; 2025 MAZI Coffee</p>
      </footer>
    </div>
  );
}
