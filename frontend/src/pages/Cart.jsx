import React from "react";
import "./Cart.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cart({onClose}){
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
                <p>Aici vor apărea produsele din coș...</p>
                
                <div className="cart-item">
                    <span>Produs 1</span>
                    <span>10 RON</span>
                </div>
                <div className="cart-item">
                    <span>Produs 2</span>
                    <span>25 RON</span>
                </div>
                </div>
                
                <div className="cart-footer">
                <strong>Total: 35 RON</strong>
                <button className="checkout-button">Finalizează Comanda</button>
                </div>


            </div>

        </div>
        


    );

}

export default Cart;