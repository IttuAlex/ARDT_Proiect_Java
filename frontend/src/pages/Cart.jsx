import React, {useState} from "react";
import "./Cart.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {FaTrash} from "react-icons/fa";

function Cart({onClose}){
    
    const [cartItems, setCartItems] = useState([
        {id: 1, name: "Produs 1", price: 10},
        {id: 2, name: "Produs 2", price: 25},

    ]);

    const addItem = () => {
        const name = prompt("Nume produs:");
        const price = parseFloat(prompt("Pret produs:"));

        if(name && !isNaN(price)){ 
            setCartItems([
                ...cartItems,
                {id: Date.now(), name, price},
            ]);

        }

    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const total =  cartItems.reduce((sum, item) => sum + item.price, 0);

    return(
        <div className="cart-backdrop" onClick={onClose}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                <h2>Coșul tău</h2>
                
                <button onClick={onClose} className="close-button">
                    &times;
                </button>
                </div>
                
                <div className="cart-content">
                        {cartItems.length === 0 ? (
                            <p>Coșul este gol...</p>
                        ) : (
                            cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <span>{item.name}</span>
                                <span>{item.price} RON</span>
                                <button
                                className="remove-btn"
                                onClick={() => removeItem(item.id)}
                                >
                                <FaTrash size={16} />
                                </button>
                            </div>
                            ))
                        )}
                </div>
                
                <div className="cart-footer">
                    <strong>Total: {total} RON</strong>
                    <button className="checkout-button">Finalizeaza Comanda</button>
                    
                </div>


            </div>

        </div>
        


    );

}

export default Cart;