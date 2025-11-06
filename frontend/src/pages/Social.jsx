import React from "react";
import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import "./Social.css";
import Navbar from "../components/Navbar";

export default function Socials() {
  return (
    <div className="socials-page">
      {/* 🔹 Navbar sus, vizibil pe toate paginile */}
      <Navbar />  

      <h1>Follow MAZI Coffee ☕</h1>

      <p className="description">
        La <strong>MAZI Coffee</strong>, social media înseamnă energie, atmosferă și povești reale.  
        Aici împărtășim vibe-ul evenimentelor, gustul cafelei și zâmbetele oamenilor care ne calcă pragul. 
        Fiecare postare surprinde o parte din experiența noastră și din comunitatea care face ca MAZI să fie mai mult decât o cafenea.
      </p>

      <div className="gallery">
        <img src="/images/post1.jpg" alt="Coffee moment" />
        <img src="/images/post3.jpg" alt="Barista art" />
      </div>

      <div className="social-links">
        <div className="social-item">
          <a
            href="https://www.instagram.com/mazi.coffeeshop/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <FaInstagram className="social-icon instagram" />
        </div>

        <div className="social-item">
          <a
            href="https://www.tiktok.com/@mazicoffee"
            target="_blank"
            rel="noreferrer"
          >
            TikTok
          </a>
          <FaTiktok className="social-icon tiktok" />
        </div>

        <div className="social-item">
          <a
            href="https://www.facebook.com/people/MAZI-coffee-shop/61573031510808/?rdid=qpOtNraaPPdEFLE8&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17gFHkxQZV%2F"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          <FaFacebook className="social-icon facebook" />
        </div>
      </div>

       {/* === CARD LOCAȚIE + HARTĂ === */}
<div className="location-section">
  <div className="location-card">
    <div className="location-icon">📍</div>
    <h2>MAZI Specialty Coffee Shop</h2>
    <p>Str. Petricica Nr. 18, Comănești, România</p>
    <p>📞 0732 128 199</p>
    <p>L–V: 07:00 – 18:00</p>
    <p>S: 08:00 – 18:00</p>
    <p>D: Inchis</p>
  </div>

  <div className="map-container">
    <iframe
      title="MAZI Specialty Coffee Shop"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2750.1339764575137!2d26.445368799999997!3d46.426224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b53da27073127f%3A0x557a860903298f96!2sMAZI%20Specialty%20Coffee%20Shop!5e0!3m2!1sro!2sro!4v1762460899941!5m2!1sro!2sro"
      width="100%"
      height="400"
      style={{ border: 0, borderRadius: "15px" }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>



      <footer>
        <p>&copy; 2025 MAZI Coffee</p>
      </footer>
    </div>
  );
}
