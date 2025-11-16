import React, {useState} from "react";
import "./Cart.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {FaTrash} from "react-icons/fa";

function Cart({onClose, cartItems, onRemoveItem, onOrderSuccess}){
    
    const total = cartItems.reduce((sum, item) => sum + item.price, 0)

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheckout = async () => {
        setError(null);
        setIsLoading(true);
        
        const token = localStorage.getItem("token");

        if(!token){
            setError("Nu sunteti logat. Va rugam sa va logati.");
            setIsLoading(false);
            return;
        }

        const orderData = {
            items: cartItems,
            total_price: total,
        };

        try {

            const response = await fetch("http://localhost:8000/api/orders", {
                method: "POST",
                headers: {
                     "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),

            });

            if(!response.ok){
                const errorData = await response.json();

                throw new Error(errorData.error || "A aparut o eroare");
            }

            const result = await response.json();
            console.log("Comanda trimisă:", result);

             if (onOrderSuccess) {
                onOrderSuccess();
            }
            onClose();

        } catch (err) {
            console.error("Eroare la checkout:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }


    };

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
                                disabled={isLoading}
                                >
                                <FaTrash size={12} />
                                </button>
                            </div>
                            ))
                        )}
                </div>
                
                <div className="cart-footer">
                    <strong>Total: {total} RON</strong>
                    

                    <button className="checkout-button" onClick={handleCheckout} disabled={isLoading || cartItems.length === 0}>{isLoading ? "Se proceseaza..." : "Finalizeaza Comanda"}</button>
                    
                </div>


            </div>

        </div>
        


    );

}

export default Cart;