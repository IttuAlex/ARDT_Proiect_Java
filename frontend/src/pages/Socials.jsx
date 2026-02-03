import React, { useEffect, useRef } from "react";
import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { gsap } from "gsap";
import "./Socials.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

/* === AICI IMPORȚI POZELE TALE NOI === */
/* Asigură-te că numele fișierelor corespund exact (png/jpg) */
import cafea1 from "../images/espresso.jpeg"; 
import cafea2 from "../images/matcha.jpeg";

export default function Socials() {
  const titleRef = useRef(null);
  const cardRef = useRef(null);
  const galleryRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
      gsap.fromTo(cardRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" });
      gsap.fromTo(galleryRef.current.children, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, stagger: 0.2, delay: 0.6, ease: "back.out(1.7)" });
      gsap.fromTo(locationRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="socials-page">
      <Navbar />  

      <h1 ref={titleRef} className="page-title">Follow MAZI Coffee ☕</h1>

      <div className="social-intro-card" ref={cardRef}>
        <p className="description">
          La <strong>MAZI Coffee</strong>, social media înseamnă energie, atmosferă și povești reale.  
          Aici împărtășim vibe-ul evenimentelor, gustul cafelei și zâmbetele oamenilor care ne calcă pragul. 
        </p>
        
        <div className="social-links">
          <a href="https://www.instagram.com/mazi.coffeeshop/" target="_blank" rel="noreferrer" className="social-item instagram">
            <FaInstagram className="social-icon" />
            <span>Instagram</span>
          </a>
          <a href="https://www.tiktok.com/@mazicoffee" target="_blank" rel="noreferrer" className="social-item tiktok">
            <FaTiktok className="social-icon" />
            <span>TikTok</span>
          </a>
          <a href="https://www.facebook.com/people/MAZI-coffee-shop/61573031510808/" target="_blank" rel="noreferrer" className="social-item facebook">
            <FaFacebook className="social-icon" />
            <span>Facebook</span>
          </a>
        </div>
      </div>

      {/* === AICI AM MODIFICAT GALERIA === */}
      <div className="gallery" ref={galleryRef}>
        <div className="photo-frame">
          {/* Folosim variabila importată cafea1 */}
          <img src={cafea1} alt="Coffee moment" />
        </div>
        <div className="photo-frame">
          {/* Folosim variabila importată cafea2 */}
          <img src={cafea2} alt="Barista art" />
        </div>
      </div>

      <div className="location-section" ref={locationRef}>
        <div className="location-card">
          <div className="location-icon">📍</div>
          <h2>MAZI Specialty Coffee Shop</h2>
          <div className="location-details">
            <p><strong>Adresă:</strong> Str. Petricica Nr. 18, Comănești</p>
            <p><strong>Telefon:</strong> 0732 128 199</p>
            <div className="program">
              <p><span>Luni – Vineri:</span> 07:00 – 18:00</p>
              <p><span>Sâmbătă:</span> 08:00 – 18:00</p>
              <p><span>Duminică:</span> Închis</p>
            </div>
          </div>
        </div>

        <div className="map-container">
          <iframe
            title="MAZI Specialty Coffee Shop"
            src="https://maps.google.com/maps?q=Comanesti%20Str%20Petricica%20Nr%2018&t=&z=15&ie=UTF8&iwloc=&output=embed" // Asigură-te că linkul hărții e valid, cel din exemplu era doar un placeholder generic
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: "20px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <Footer />
    </div>
  );
}