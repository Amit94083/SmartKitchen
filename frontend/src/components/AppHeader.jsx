
import React from "react";
import { Box, User, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const isActive = (path) => {
    if (path === '/restaurant/1') {
      return location.pathname.startsWith('/restaurant/1');
    }
    if (path === '/home') {
      return location.pathname === '/home';
    }
    return location.pathname === path;
  };
  return (
    <header className="w-full flex items-center justify-between px-10 py-3 bg-white shadow-md fixed top-0 left-0 z-30 h-[80px]">
      <div className="flex items-center gap-3">
        <button
          className="bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl w-11 h-11 flex items-center justify-center text-lg font-extrabold shadow-sm hover:brightness-105 transition"
          onClick={() => navigate('/home')}
          aria-label="Home"
        >
          CK
        </button>
        <span className="text-xl font-semibold text-gray-900">CloudKitchen</span>
      </div>
      <nav className="flex items-center gap-7">
        <button
          className={`flex items-center gap-2 font-semibold text-base rounded-xl px-4 py-1.5 transition ${isActive('/restaurant/1') ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => navigate('/restaurant/1')}
        >
          <Home className="w-5 h-5" /> Menu
        </button>
        <button
          className={`flex items-center gap-2 font-semibold text-base rounded-xl px-4 py-1.5 transition ${isActive('/customer/orders') ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => navigate('/customer/orders')}
        >
          <Box className="w-5 h-5" /> Orders
        </button>

        <button
          className={`flex items-center gap-2 font-semibold text-base rounded-xl px-4 py-1.5 transition ${isActive('/profile') ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => navigate('/profile')}
        >
          <User className="w-5 h-5" /> Profile
        </button>
      </nav>
    </header>
  );
}
