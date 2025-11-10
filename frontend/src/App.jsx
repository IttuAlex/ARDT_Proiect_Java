import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Socials from "./pages/Socials.jsx";
import Order from "./pages/Order.jsx";
import Navbar from "./components/Navbar.jsx";
import Cart from "./pages/Cart.jsx"
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/socials" element={<Socials />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
    </BrowserRouter>
  );
}
