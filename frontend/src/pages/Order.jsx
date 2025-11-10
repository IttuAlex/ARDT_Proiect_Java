import React from "react";
import "./Order.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import cafea2 from "../images/cafea2.png";
import cafea1 from "../images/cafea1.png";
import cafea3 from "../images/cafea3.png";
import cafea4 from "../images/cafea4.jpg";

import { FaShoppingCart } from "react-icons/fa";

const products = [
  { id: 1, name: "Cafea", img: cafea2, ingredients: "bla, bla, bla" },
  { id: 2, name: "Flat White", img: cafea1, ingredients: "bla, bla, bla" },
  { id: 3, name: "Cappuccino", img: cafea3, ingredients: "Espresso, lapte, spumă densă" },
  { id: 4, name: "Iced Coffee", img: cafea4, ingredients: "Cafea cold brew, gheață, lapte" }
];

const Order = () => {
  return (
    <div className="order-page">
      <h1 className="order-header">Order</h1>
      <div className="cart-icon">
        <FaShoppingCart />
      </div>

      <section className="order-list">
        {products.map(p => (
          <article key={p.id} className="order-card">
            <h2 className="order-name">{p.name}</h2>
            <div className="order-image-wrap">
              <img src={p.img} alt={p.name} />
            </div>
            <p className="order-ingredients">{p.ingredients}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Order;