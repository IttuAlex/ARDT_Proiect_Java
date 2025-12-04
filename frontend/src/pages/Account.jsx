import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Account.css";

const cities = [
  "Alba Iulia", "Alexandria", "Arad", "Bacău", "Baia Mare", "Bistrița", "Blaj", "Botoșani", "Brad", "Brașov",
  "Brăila", "București", "Buzău", "Calafat", "Călărași", "Câmpia Turzii", "Câmpina", "Câmpulung", "Caracal",
  "Caransebeș", "Carei", "Cluj-Napoca", "Codlea", "Constanța", "Craiova", "Curtea de Argeș", "Dej", "Deva",
  "Dorohoi", "Drăgășani", "Drobeta-Turnu Severin", "Făgăraș", "Fălticeni", "Fetești", "Focșani", "Galați",
  "Giurgiu", "Gherla", "Hunedoara", "Huși", "Iași", "Lugoj", "Lupeni", "Mangalia", "Marghita", "Medgidia",
  "Mediaș", "Miercurea Ciuc", "Moinești", "Moreni", "Motru", "Odorheiu Secuiesc", "Oltenița", "Onești",
  "Oradea", "Orăștie", "Orșova", "Pașcani", "Petroșani", "Piatra Neamț", "Pitești", "Ploiești", "Rădăuți",
  "Râmnicu Sărat", "Râmnicu Vâlcea", "Reghin", "Reșița", "Roman", "Roșiorii de Vede", "Săcele", "Salonta",
  "Satu Mare", "Sebeș", "Sfântu Gheorghe", "Sibiu", "Sighetu Marmației", "Sighișoara", "Slatina", "Slobozia",
  "Suceava", "Târgoviște", "Târgu Jiu", "Târgu Mureș", "Târgu Neamț", "Târgu Secuiesc", "Tecuci", "Timișoara",
  "Toplița", "Tulcea", "Turda", "Turnu Măgurele", "Vaslui", "Vatra Dornei", "Vulcan", "Zalău", "Zărnești"
];

export default function Account() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate();
    const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="tab-content">
                        <h2>Personal Information</h2>
                        <div className="profile-grid">
                            <div className="input-group">
                                <label>Name</label>
                                <input type="text" defaultValue={user?.name || "User"} />
                            </div>
                            <div className="input-group">
                                <label>Gender</label>
                                <select defaultValue="Unknown">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Unknown">Prefer not to say</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>City</label>
                                <select defaultValue="București">
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Date of birth</label>
                                <input type="date" />
                            </div>
                        </div>
                        <button className="save-btn">Save Changes</button>
                    </div>
                );
            case "orders":
                return (
                    <div className="tab-content">
                        <h2>Orders</h2>
                        <p>No orders here.</p>
                    </div>
                );
            case "settings":
                return (
                    <div className="tab-content">
                        <h2>Account Settings</h2>
                        <p>Here you can change your password.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="account-page-wrapper">
            <Navbar />
            
            <div className="account-container">
                <aside className="account-sidebar">
                    <div className="profile-section">
                        <div className="profile-image-container">
                            <img 
                                src={user?.picture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                                alt="Profil" 
                                className="profile-image"
                            />
                        </div>
                        <h3 className="profile-email">{user?.email}</h3>
                    </div>

                    <div className="sidebar-menu">
                        <button 
                            className={`menu-btn ${activeTab === "profile" ? "active" : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            Profile
                        </button>
                        <button 
                            className={`menu-btn ${activeTab === "orders" ? "active" : ""}`}
                            onClick={() => setActiveTab("orders")}
                        >
                            Orders
                        </button>
                        <button 
                            className={`menu-btn ${activeTab === "settings" ? "active" : ""}`}
                            onClick={() => setActiveTab("settings")}
                        >
                            Settings
                        </button>
                    </div>
                </aside>

                <main className="account-main-content">
                    {renderContent()}
                </main>
            </div>

            <Footer />
        </div>
    );
}