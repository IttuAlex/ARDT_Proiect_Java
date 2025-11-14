import React, { useState } from "react";
import { Link } from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Order.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "./Cart";
import "./Cart.css";

import cafea2 from "../images/cafea2.png";
import cafea1 from "../images/cafea1.png";
import cafea3 from "../images/cafea3.png";
import cafea4 from "../images/cafea4.jpg";

import { FaShoppingCart } from "react-icons/fa";

const products = [
  { id: 1, name: "Espresso single", img: cafea2, ingredients: "cafea, apa 20ml", price: 10 },
  { id: 2, name: "Espresso dublu", img: cafea1, ingredients: "cafea, apa, 40ml", price: 12 },
  { id: 3, name: "Long Black", img: cafea3, ingredients: "espresso dublu, apa, 80ml", price: 12 },
  { id: 4, name: "V60", img: cafea4, ingredients: "cafea, apa, 200ml", price: 20 },
  { id: 5, name: "Cortado", img: cafea4, ingredients: "espresso single, crema de lapte, 120ml", price: 12 },
  { id: 6, name: "Cappuccino", img: cafea4, ingredients: "espresso single, crema de lapte, 200ml", price: 14 },
  { id: 7, name: "Flat White", img: cafea4, ingredients: "espresso dublu, crema de lapte, 180ml", price: 15 },
  { id: 8, name: "Latte", img: cafea4, ingredients: "espresso single, crema de lapte, 300ml", price: 16 },
  { id: 9, name: "Babyccino", img: cafea4, ingredients: "crema de lapte, 120ml", price: 6 },
  { id: 10, name: "Hot Cioco", img: cafea4, ingredients: "ciocolata calde pudra, crema de lapte, 200ml", price: 15 },
  { id: 11, name: "Ceai", img: cafea4, ingredients: "ceai, apa", price: 14 },
  { id: 12, name: "Espresso Tonic", img: cafea4, ingredients: "espresso dublu, apa tonica, gheata, 180ml", price: 17 },
  { id: 13, name: "Cold Brew Tonic", img: cafea4, ingredients: "cold brew, apa tonica, gheata, 180ml", price: 17 },
  { id: 14, name: "Cold Brew Latte", img: cafea4, ingredients: "cold brew, apa, gheata, 250ml", price: 16 },
  { id: 15, name: "Cold Brew", img: cafea4, ingredients: "cafea, apa, gheata, 180ml", price: 14 },
  { id: 16, name: "Ice Cappuccino", img: cafea4, ingredients: "espresso single, crema de lapte, gheata, 180ml", price: 14 },
  { id: 17, name: "Ice Latte", img: cafea4, ingredients: "espresso single, crema de lapte, gheata, 250ml", price: 16 },
  { id: 18, name: "Matcha Latte", img: cafea4, ingredients: "ceai matcha pudra, apa, crema de lapte, 300ml", price: 20 },
  { id: 19, name: "Ice Matcha Latte", img: cafea4, ingredients: "ceai matcha pudra, apa, crema de lapte, gheata, 250ml", price: 20 },
  { id: 20, name: "Matcha Tonic", img: cafea4, ingredients: "ceai matcha pudra, apa, apa tonica, 180ml", price: 22 },
  { id: 21, name: "Socata", img: cafea4, ingredients: "sirop de soc, zeama de lamaie, apa carbogazoasa, gheata, 250ml", price: 14 },
  { id: 22, name: "Limonada cu zmeura", img: cafea4, ingredients: "sirop de zmeura, zeama de lamaie, apa carbogazoasa, 250ml", price: 14 }
];

const Order = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [cartItems, setCartItems] = useState([]);

    const handleOpenCart = () => {
      setIsCartOpen(true);
    };

    const handleCloseCart = () => {
      setIsCartOpen(false);
    };

    const handleAddToCart = (product) => {
        const newItem = {
          name: product.name,
          price: product.price,
          id: Date.now()

        };
       setCartItems(prevItems => [...prevItems, newItem]);

       toast.success(`${product.name} adaugat in cos!`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,


       });

    };

    const handleRemoveFromCart = (itemId) => {
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }

  return (
    <>
    <div className={isCartOpen ? "order-page blurred" : "order-page"}>
      <h1 className="order-header">Order</h1>

     <div className="cart-icon" onClick={handleOpenCart}>  
        <FaShoppingCart/> 
     </div>

      <section className="order-list">
        {products.map(p => (
          <article key={p.id} className="order-card">
            <h2 className="order-name">{p.name}</h2>
            <div className="order-image-wrap">
              <img src={p.img} alt={p.name} />
            </div>
            <p className="order-ingredients">{p.ingredients}</p>
            <button className="order-add-button" onClick={() => handleAddToCart(p)}> Adauga</button>
          </article>
        ))}
      </section>
    </div>

        <ToastContainer
        position="bottom-right"
        autoClose={300}
        pauseOnFocusLoss={false}


        />

      <Footer />

      {isCartOpen && <Cart onClose={handleCloseCart} cartItems={cartItems} onRemoveItem={handleRemoveFromCart}/>}

    </>
  );
};

export default Order;