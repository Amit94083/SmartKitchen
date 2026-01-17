
import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Box, BookOpen, Truck, Store, Pencil } from 'lucide-react';

const Sidebar = ({ activeTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-[#23190f] text-white flex flex-col py-8 px-6 min-h-screen">
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
        <button className={`${activeTab === 'dashboard' ? 'bg-orange-500 font-semibold' : 'hover:bg-[#2c2116]'} rounded-lg px-4 py-3 text-left flex items-center gap-3`} onClick={() => navigate('/restaurant-dashboard')}><Home className="w-5 h-5" /> Dashboard</button>
        <button className={`${activeTab === 'inventory' ? 'bg-orange-500 font-semibold' : 'hover:bg-[#2c2116]'} rounded-lg px-4 py-3 text-left flex items-center gap-3`} onClick={() => navigate('/inventory')}><Box className="w-5 h-5" /> Inventory</button>
        <button className={`${activeTab === 'recipes' ? 'bg-orange-500 font-semibold' : 'hover:bg-[#2c2116]'} rounded-lg px-4 py-3 text-left flex items-center gap-3`} onClick={() => navigate('/recipes')}><BookOpen className="w-5 h-5" /> Recipes</button>
        <button className={`${activeTab === 'suppliers' ? 'bg-orange-500 font-semibold' : 'hover:bg-[#2c2116]'} rounded-lg px-4 py-3 text-left flex items-center gap-3`} onClick={() => navigate('/suppliers')}><Truck className="w-5 h-5" /> Suppliers</button>
        <button className={`${activeTab === 'restaurant-details' ? 'bg-orange-500 font-semibold' : 'hover:bg-[#2c2116]'} rounded-lg px-4 py-3 text-left flex items-center gap-3`} onClick={() => navigate('/restaurant-details')}><Pencil className="w-5 h-5" /> Restaurant Details</button>
      </nav>
      <button
        className="mt-8 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div className="mt-auto text-xs text-gray-400 pt-10">© 2024 CloudKitchen</div>
    </aside>
  );
};

export default Sidebar;
