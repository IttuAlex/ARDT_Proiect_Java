import React, {useState} from "react";
import "./Cart.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {FaTrash} from "react-icons/fa";

function Cart({onClose, cartItems, onRemoveItem}){
    
    const total = cartItems.reduce((sum, item) => sum + item.price, 0)

    return(
        <div className="cart-backdrop" onClick={onClose}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                <h2>Cosul tău</h2>
                
                <button onClick={onClose} className="close-button">
                    &times;
                </button>
                </div>
                
                <div className="cart-content">
                        {cartItems.length === 0 ? (
                            <p>Cosul este gol...</p>
                        ) : (
                            cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <span>{item.name}</span>
                                <span>{item.price} RON</span>
                                <button
                                className="remove-btn"
                                onClick={() => onRemoveItem(item.id)}
                                >
                                <FaTrash size={12} />
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