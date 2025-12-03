import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Account.css";

export default function Account() {
    return (
        <div className="account-page-wrapper">
            <Navbar />
            
            <main className="account-main-content">
                <div className="account-header-section">
                    <h1>My Account</h1>
                </div>
            </main>

            <Footer />
        </div>
    )
}