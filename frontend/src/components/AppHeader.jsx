
import React from "react";
import { Box, User, ShoppingCart } from "lucide-react";
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
          className="bg-orange-400 text-white rounded-full w-11 h-11 flex items-center justify-center text-lg hover:bg-orange-500 transition"
          onClick={() => navigate('/home')}
          aria-label="Home"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"></path></svg>
        </button>
      </div>
      <nav className="flex items-center gap-7">
        <button
          className={`flex items-center gap-2 font-semibold text-base rounded-xl px-4 py-1.5 transition ${isActive('/restaurant/1') ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => navigate('/restaurant/1')}
        >
          <span className="w-5 h-5">🍽️</span> Menu
        </button>
        <button
          className={`flex items-center gap-2 font-semibold text-base rounded-xl px-4 py-1.5 transition ${isActive('/orders') ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => navigate('/orders')}
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
