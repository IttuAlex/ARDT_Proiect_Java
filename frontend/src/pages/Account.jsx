import React from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Account() {
    const navigate = useNavigate();
    return (
        <div className="account">
            <Navbar />
            <Footer />
            <header>
                <h1>My Account</h1>
            </header>
        </div>
    )
}
