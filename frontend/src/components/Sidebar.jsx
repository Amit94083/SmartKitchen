
import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Box, BookOpen, Truck, Store, Pencil, ShoppingBag } from 'lucide-react';

const Sidebar = ({ activeTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

    return (
      <aside className="fixed left-0 top-0 w-72 bg-[#23190f] text-white flex flex-col py-8 px-6 h-screen z-10" style={{ background: '#23190f' }}>
      <div className="flex items-center gap-3 mb-10">
        <span className="bg-orange-400 rounded-lg p-2">
          <Store className="w-7 h-7 text-white" />
        </span>
        <div>
          <div className="font-bold text-lg">CloudKitchen</div>
          <div className="text-xs text-orange-200">Inventory Pro</div>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {/* Dashboard */}
        <button
          className={`flex items-center gap-3 rounded-xl px-6 py-3 text-left text-base font-semibold transition-colors ${activeTab === 'dashboard' ? 'bg-orange-500 text-white' : 'bg-transparent hover:bg-[#2c2116] text-white'}`}
          onClick={() => navigate('/restaurant-dashboard')}
        >
          <Home className="w-5 h-5" /> Dashboard
        </button>

        {/* Orders - after Dashboard, styled as in screenshot */}
        <button
          className={`flex items-center gap-3 rounded-xl px-6 py-3 text-left text-base transition-colors mt-2 ${activeTab === 'orders' ? 'text-orange-400' : 'text-white'} bg-transparent hover:bg-[#2c2116]`}
          onClick={() => navigate('/owner/orders')}
        >
          <span className="flex items-center justify-center">
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'orders' ? 'text-orange-400' : 'text-white'}`} />
          </span>
          <span className={`${activeTab === 'orders' ? 'text-orange-400' : 'text-white'}`}>Orders</span>
        </button>

        {/* Inventory */}
        <button
          className={`flex items-center gap-3 rounded-xl px-6 py-3 text-left text-base transition-colors ${activeTab === 'inventory' ? 'text-orange-400' : 'text-white'} bg-transparent hover:bg-[#2c2116]`}
          onClick={() => navigate('/inventory')}
        >
          <Box className="w-5 h-5" /> Inventory
        </button>

        {/* Recipes */}
        <button
          className={`flex items-center gap-3 rounded-xl px-6 py-3 text-left text-base transition-colors ${activeTab === 'recipes' ? 'text-orange-400' : 'text-white'} bg-transparent hover:bg-[#2c2116]`}
          onClick={() => navigate('/recipes')}
        >
          <BookOpen className="w-5 h-5" /> Recipes
        </button>

        {/* Suppliers */}
        <button
          className={`flex items-center gap-3 rounded-xl px-6 py-3 text-left text-base transition-colors ${activeTab === 'suppliers' ? 'text-orange-400' : 'text-white'} bg-transparent hover:bg-[#2c2116]`}
          onClick={() => navigate('/suppliers')}
        >
          <Truck className="w-5 h-5" /> Suppliers
        </button>

        {/* Delivery Dashboard */}
        <button
          className={`flex items-center gap-3 rounded-xl px-6 py-3 text-left text-base transition-colors ${activeTab === 'delivery-dashboard' ? 'text-orange-400' : 'text-white'} bg-transparent hover:bg-[#2c2116]`}
          onClick={() => navigate('/delivery/dashboard')}
        >
          <Truck className="w-5 h-5" /> Delivery Dashboard
        </button>

        {/* Restaurant Details */}
        <button
          className={`flex items-center gap-3 rounded-xl px-6 py-3 text-left text-base transition-colors ${activeTab === 'restaurant-details' ? 'text-orange-400' : 'text-white'} bg-transparent hover:bg-[#2c2116]`}
          onClick={() => navigate('/restaurant-details')}
        >
          <Pencil className="w-5 h-5" /> Restaurant Details
        </button>
      </nav>
      
      {/* Logout */}
      <div className="mt-auto border-t border-gray-700 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-3 text-red-500 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
