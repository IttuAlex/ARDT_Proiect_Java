import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeart } from "react-icons/fa";
import mazicafea1 from "../images/mazicafea1.jpg";
import mazicafea2 from "../images/mazicafea2.jpg";
import mazicafea3 from "../images/mazicafea3.jpg";

export default function Home() {
  const navigate = useNavigate();

  const handleHeartClick = () => {
    navigate("/about");
  };

  return (
    <div className="home">
      <Navbar />

      <div className="gallery">
        <a
          href="https://www.instagram.com/mazi.coffeeshop/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={mazicafea1} alt="IMAGE1" />
        </a>
        <a
          href="https://www.instagram.com/mazi.coffeeshop/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={mazicafea2} alt="IMAGE2" />
        </a>
        <a
          href="https://www.instagram.com/mazi.coffeeshop/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={mazicafea3} alt="IMAGE3" />
        </a>
      </div>

      <button
        type="button"
        className="heart-btn"
        onClick={handleHeartClick}
      >
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

      <Footer />
    </div>
  );
}
