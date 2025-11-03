import React from "react";
import "./Home.css"; // dacă ai un fișier CSS separat

export default function Home() {
  return (
    <div className="home">
      <header>
        <h1>Home Page</h1>
      </header>

      <main>
        <section id="order">
          <h2>| Order |</h2>
        </section>

        <section id="menu">
          <h2>Menu |</h2>
        </section>

        <section id="socials">
          <h2>Socials |</h2>
        </section>

        <section id="about">
          <h2>About Us |</h2>
        </section>

        <section id="content">
          <h2>aici o sa vina content curand</h2>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 MAZI Coffee</p>
      </footer>
    </div>
  );
}
