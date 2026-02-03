import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Order.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "./Cart";
import "./Cart.css";

import espresso from "../images/espresso.jpeg";
import espdublu from "../images/espressodublu.png";
import longblack from "../images/longblack.jpeg";
import v60 from "../images/v60.jpeg";
import cortado from "../images/cordato.jpg"; 
import cappuccino from "../images/cappuciono.jpeg"; 
import flatwhite from "../images/flatwhite.jpg";
import latte from "../images/latte.jpg";
import baby from "../images/babycino.jpg";
import imgHotCioco from "../images/hotcioco.jpg";
import imgCeai from "../images/ceai.jpg";
import imgEspressoTonic from "../images/espressotonic.jpeg";
import imgColdBrewTonic from "../images/coldbrewtonic.jpg";
import imgColdBrewLatte from "../images/coldbrewtonic.jpg";
import imgColdBrew from "../images/coldbrew.jpg";
import imgIceCappuccino from "../images/icecappucino.jpeg"; 
import imgMatcha from "../images/matcha.jpeg";
import imgLimonada from "../images/limonada.jpeg";
import imgPlaceholder from "../images/poza1.jpeg";
import imgSocata from "../images/socata.jpg"

import { FaShoppingCart } from "react-icons/fa";

const products = [
  { id: 1, name: "Espresso single", img: espresso, ingredients: "cafea, apa 20ml", price: 10 },
  { id: 2, name: "Espresso dublu", img: espdublu, ingredients: "cafea, apa, 40ml", price: 12 },
  { id: 3, name: "Long Black", img: longblack, ingredients: "espresso dublu, apa, 80ml", price: 12 },
  { id: 4, name: "V60", img: v60, ingredients: "cafea, apa, 200ml", price: 20 },
  { id: 5, name: "Cortado", img: cortado, ingredients: "espresso single, crema de lapte, 120ml", price: 12 },
  { id: 6, name: "Cappuccino", img: cappuccino, ingredients: "espresso single, crema de lapte, 200ml", price: 14 },
  { id: 7, name: "Flat White", img: flatwhite, ingredients: "espresso dublu, crema de lapte, 180ml", price: 15 },
  { id: 8, name: "Latte", img: latte, ingredients: "espresso single, crema de lapte, 300ml", price: 16 },
  { id: 9, name: "Babyccino", img: baby, ingredients: "crema de lapte, 120ml", price: 6 },
  { id: 10, name: "Hot Cioco", img: imgHotCioco, ingredients: "ciocolata calde pudra, crema de lapte, 200ml", price: 15 },
  { id: 11, name: "Ceai", img: imgCeai, ingredients: "ceai, apa", price: 14 },
  { id: 12, name: "Espresso Tonic", img: imgEspressoTonic, ingredients: "espresso dublu, apa tonica, gheata, 180ml", price: 17 },
  { id: 13, name: "Cold Brew Tonic", img: imgColdBrewTonic, ingredients: "cold brew, apa tonica, gheata, 180ml", price: 17 },
  { id: 14, name: "Cold Brew Latte", img: imgColdBrewLatte, ingredients: "cold brew, apa, gheata, 250ml", price: 16 },
  { id: 15, name: "Cold Brew", img: imgColdBrew, ingredients: "cafea, apa, gheata, 180ml", price: 14 },
  { id: 16, name: "Ice Cappuccino", img: imgIceCappuccino, ingredients: "espresso single, crema de lapte, gheata, 180ml", price: 14 },
  { id: 17, name: "Ice Latte", img: latte, ingredients: "espresso single, crema de lapte, gheata, 250ml", price: 16 },
  { id: 18, name: "Matcha Latte", img: imgMatcha, ingredients: "ceai matcha pudra, apa, crema de lapte, 300ml", price: 20 },
  { id: 19, name: "Ice Matcha Latte", img: imgMatcha, ingredients: "ceai matcha pudra, apa, crema de lapte, gheata, 250ml", price: 20 },
  { id: 20, name: "Matcha Tonic", img: imgMatcha, ingredients: "ceai matcha pudra, apa, apa tonica, 180ml", price: 22 },
  { id: 21, name: "Socata", img: imgSocata, ingredients: "sirop de soc, zeama de lamaie, apa carbogazoasa, gheata, 250ml", price: 14 },
  { id: 22, name: "Limonada cu zmeura", img: imgLimonada, ingredients: "sirop de zmeura, zeama de lamaie, apa carbogazoasa, 250ml", price: 14 }
];
const Order = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        checkUser();
        window.addEventListener("auth-change", checkUser);
        return () => window.removeEventListener("auth-change", checkUser);
    }, []);

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
        const itemToRemove = cartItems.find(item => item.id === itemId);
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

        if(itemToRemove)
          toast.error(`${itemToRemove.name} sters din cos!`,{
            position:"bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
    };

    const handleOrderSuccess = () => {
      setCartItems([]);
      toast.success("Comanda a fost plasata cu succes!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    };

  return (
    <>
    <div className={isCartOpen ? "order-page blurred" : "order-page"}>
      <h1 className="order-header">Order</h1>

     <div className={`cart-icon ${user ? "logged-in" : ""}`} onClick={handleOpenCart}>  
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

    {isCartOpen && <Cart onClose={handleCloseCart} cartItems={cartItems} onRemoveItem={handleRemoveFromCart} onOrderSuccess={handleOrderSuccess}/>}

    </>
  );
};

export default Order;