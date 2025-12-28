import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Importăm ScrollTrigger dacă vrei să apară la scroll
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeart } from "react-icons/fa";

// Import imagini existente (înlocuiește-le pe cele de jos cu produsele tale)
import mazicafea1 from "../images/mazicafea1.jpg";
import mazicafea2 from "../images/mazicafea2.jpg";
import mazicafea3 from "../images/mazicafea3.jpg";

// Activăm pluginul ScrollTrigger pentru GSAP
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  // Referință pentru secțiunile noi care vor fi animate
  const featuredSectionsRef = useRef([]);

  const handleHeartClick = () => {
    navigate("/about");
  };

  // Funcție helper pentru a adăuga refs la lista de elemente de animat
  const addToRefs = (el) => {
    if (el && !featuredSectionsRef.current.includes(el)) {
      featuredSectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Folosim gsap.context pentru curățare automată (best practice în React)
    let ctx = gsap.context(() => {
      
      // Animăm fiecare secțiune nouă când apare în ecran
      featuredSectionsRef.current.forEach((section) => {
        gsap.fromTo(
          section,
          { 
            y: 100, // Pleacă de mai jos
            opacity: 0 // Invizibil
          },
          {
            y: 0, // Ajunge la poziția normală
            opacity: 1, // Devine vizibil
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section, // Animația pornește când acest element ajunge în vizor
              start: "top 85%", // Punctul de start (când partea de sus a elementului e la 85% din înălțimea ferestrei)
              toggleActions: "play none none reverse" // Se joacă la scroll în jos, se inversează la scroll în sus
            }
          }
        );
      });

    }); // end context

    return () => ctx.revert(); // Curățăm animațiile la demontare
  }, []);

  return (
    <div className="home">
      <Navbar />

      {/* --- CONȚINUTUL EXISTENT (Galerie & Titlu) --- */}
      <div className="hero-content">
        <div className="gallery">
          <a href="https://www.instagram.com/mazi.coffeeshop/" target="_blank" rel="noopener noreferrer">
            <img src={mazicafea1} alt="IMAGE1" />
          </a>
          <a href="https://www.instagram.com/mazi.coffeeshop/" target="_blank" rel="noopener noreferrer">
            <img src={mazicafea2} alt="IMAGE2" />
          </a>
          <a href="https://www.instagram.com/mazi.coffeeshop/" target="_blank" rel="noopener noreferrer">
            <img src={mazicafea3} alt="IMAGE3" />
          </a>
        </div>

        <button type="button" className="heart-btn" onClick={handleHeartClick}>
          <FaHeart />
        </button>

        <header>
          <h1>Welcome home!</h1>
        </header>

        <div className="paragraf">
          <p>Realitatea începe după o cafea.</p>
        </div>
        <div className="paragraf2">
          <p>Haide sa facem cunostinta!</p>
        </div>
      </div>
      {/* --- SFÂRȘIT CONȚINUT EXISTENT --- */}


      {/* === SECȚIUNI NOI (PRODUSE) === */}
      <div className="featured-container">
        
        {/* CHENAR 1: Produsul Lunii (Text Stânga, Poză Dreapta) */}
        <div className="featured-section" ref={addToRefs}>
          <div className="featured-text-box">
            <h2>Produsul Lunii</h2>
            <h3>Costa Rica Tarrazu</h3>
            <p>
              O cafea de origine unică, cu note vibrante de ciocolată neagră, 
              fructe roșii și o aciditate citrică echilibrată. Prăjită mediu 
              pentru a evidenția dulceața naturală. Perfectă pentru espresso sau filtru.
            </p>
            <button className="featured-btn" onClick={() => navigate('/order')}>Comandă Acum</button>
          </div>
          <div className="featured-image-box right-img">
            {/* Înlocuiește 'mazicafea1' cu poza produsului tău */}
            <img src={mazicafea1} alt="Produsul Lunii" />
          </div>
        </div>

        {/* CHENAR 2: Cel Mai Vândut (Poză Stânga, Text Dreapta - folosește clasa 'reverse') */}
        <div className="featured-section reverse" ref={addToRefs}>
           <div className="featured-image-box left-img">
            {/* Înlocuiește 'mazicafea2' cu poza bestseller-ului tău */}
            <img src={mazicafea2} alt="Cel Mai Vândut" />
          </div>
          <div className="featured-text-box">
            <h2>Best Seller</h2>
            <h3>Mazi Signature Blend</h3>
            <p>
              Amestecul nostru semnătură, preferatul clienților. O combinație 
              cremoasă de Arabica din Brazilia și Etiopia, oferind note intense 
              de caramel, alune de pădure și un postgust persistent de vanilie.
            </p>
             <button className="featured-btn" onClick={() => navigate('/order')}>Vezi Detalii</button>
          </div>
        </div>

      </div>
      {/* === SFÂRȘIT SECȚIUNI NOI === */}

      <Footer />
    </div>
  );
}