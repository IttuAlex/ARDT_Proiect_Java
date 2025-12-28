import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./About.css";

// Importă imaginile tale aici
import img1 from "../images/cafea1.png";
import img2 from "../images/cafea2.png";
import img3 from "../images/cafea3.png";
import img4 from "../images/cafea4.jpg";
import img5 from "../images/cafea1.png";
import img6 from "../images/cafea2.png";

// Lista imaginilor pentru trail
const images = [img1, img2, img3, img4, img5, img6];

export default function About() {
  const titleRef = useRef(null);
  const sectionsRef = useRef([]);
  
  // Referințe pentru efectul de Trail
  const containerRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 }); // Ultima poziție unde am pus o poză
  const imageIndex = useRef(0); // Care poză urmează (0, 1, 2...)
  const zIndexRef = useRef(1); // Ca să punem pozele noi peste cele vechi

  // Funcție helper pentru animațiile de intrare (la fel ca înainte)
  sectionsRef.current = [];
  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Animații text (Standard)
      gsap.fromTo(titleRef.current, 
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(sectionsRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.2 }
      );
    });

    return () => ctx.revert();
  }, []);

  // === LOGICA PENTRU IMAGE TRAIL ===
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    // 1. Calculăm poziția mouse-ului RELATIV la cutia .photo-box
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 2. Calculăm distanța față de ultima poză pusă
    const distance = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);

    // 3. Dacă am mișcat mouse-ul mai mult de 100px (pragul de declanșare)
    if (distance > 100) {
      // Salvăm noua poziție
      lastPos.current = { x, y };
      spawnImage(x, y);
    }
  };

  const spawnImage = (x, y) => {
    // Creăm un element img nou dinamic
    const imgEl = document.createElement("img");
    imgEl.src = images[imageIndex.current];
    imgEl.className = "trail-img";
    
    // Îl stilizăm direct
    imgEl.style.left = `${x}px`;
    imgEl.style.top = `${y}px`;
    imgEl.style.zIndex = zIndexRef.current++; // Creștem z-index să fie deasupra
    
    // Îl adăugăm în container
    containerRef.current.appendChild(imgEl);

    // Trecem la următoarea poză din listă
    imageIndex.current = (imageIndex.current + 1) % images.length;

    // Animație GSAP pentru apariție și dispariție
    gsap.fromTo(imgEl, 
      { scale: 0, rotation: gsap.utils.random(-15, 15), opacity: 0.5 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.5, 
        ease: "back.out(1.7)",
        onComplete: () => {
          // După 1 secundă, dispare și se șterge din DOM ca să nu încărcăm pagina
          gsap.to(imgEl, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            delay: 0.5,
            onComplete: () => imgEl.remove()
          });
        }
      }
    );
  };

  return (
    <div className="about-page">
      <h1 className="about-title" ref={titleRef}>About Us</h1>

      {/* Secțiuni text (Neschimbat) */}
      <div className="about-section" ref={addToRefs}>
        <h2 className="about-subtitle">Povestea Noastră</h2>
        <p className="about-text">
          Cafeneaua noastră a început ca un loc mic, creat din pasiunea pentru 
          cafeaua de specialitate și pentru momentele simple împărtășite între oameni.
        </p>
      </div>

      <div className="about-section" ref={addToRefs}>
        <h2 className="about-subtitle">Misiunea Noastră</h2>
        <p className="about-text">
          Ne propunem să oferim o experiență autentică, creată în jurul unei cafele 
          de înaltă calitate, într-un loc în care oamenii se pot relaxa.
        </p>
      </div>

      <div className="about-section" ref={addToRefs}>
        <h2 className="about-subtitle">Valorile Noastre</h2>
        <p className="about-text">
          Calitate, comunitate, atenție la detalii, atmosferă primitoare și respect 
          pentru oameni — acestea sunt principiile care ne definesc.
        </p>
      </div>

      {/* === CHENARUL CU POZE (IMAGE TRAIL) === */}
      {/* Adăugăm event listener-ul onMouseMove aici */}
      <div 
        className="photo-box" 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
      >
        {/* Un mesaj subtil ca utilizatorul să știe să miște mouse-ul */}
        <div className="photo-placeholder-text">
          Move your mouse here ✨
        </div>
      </div>

    </div>
  );
}