import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Account.css";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, Legend 
} from 'recharts';

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
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        if (activeTab === "admin") {
            fetchStats();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // Luăm token-ul salvat la login
            const response = await fetch("http://localhost:8000/api/admin/stats", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            } else {
                toast.error(data.error || "Eroare la încărcarea statisticilor");
            }
        } catch (error) {
            toast.error("Nu s-a putut conecta la server");
        } finally {
            setLoading(false);
        }
    };
    const isAdmin = user?.email === "test@gmail.com" || user?.role === "admin";

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
case "admin":
                return (
                    <div className="tab-content admin-dashboard">
                        <h2>Admin Dashboard</h2>
                        
                        {loading && <p>Se încarcă datele...</p>}

                        {stats && (
                            <>
                                {/* Carduri Statistice Rapide */}
                                <div className="admin-stats-grid">
                                    <div className="stat-card">
                                        <h4>Total Revenue</h4>
                                        <p className="stat-value">{stats.summary.totalRevenue} RON</p>
                                    </div>
                                    <div className="stat-card">
                                        <h4>Total Orders</h4>
                                        <p className="stat-value">{stats.summary.totalOrders}</p>
                                    </div>
                                    <div className="stat-card">
                                        <h4>New Users (30d)</h4>
                                        <p className="stat-value">{stats.summary.newUsers}</p>
                                    </div>
                                </div>

                                <div className="charts-container">
                                    {/* Grafic Evoluție Vânzări */}
                                    <div className="chart-item">
                                        <h3>Sales Trend (Last 7 Days)</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={stats.salesTrend}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="revenue" stroke="#d9534f" strokeWidth={3} name="Revenue (RON)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Grafic Top Produse */}
                                    <div className="chart-item">
                                        <h3>Top 5 Best Selling Products</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={stats.topProducts}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#4285f4" name="Orders" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
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
                        <button 
                                className={`menu-btn admin-btn ${activeTab === "admin" ? "active" : ""}`}
                                onClick={() => setActiveTab("admin")}
                                style={{ color: "#d9534f", fontWeight: "bold", borderTop: "1px solid #eee", marginTop: "10px" }}
                            >
                                Admin Panel
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