import React from "react";
import Sidebar from './Sidebar';
import { ShoppingBag, CreditCard, TrendingUp, User } from 'lucide-react';

const Dashboard = () => {

  return (
    <div className="flex min-h-screen bg-[#f9f7f4]">
      <Sidebar activeTab="dashboard" />
      <main className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#23190f]">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2 bg-white rounded-xl shadow px-2 py-1">
            <button className="bg-orange-500 text-white px-4 py-1 rounded-lg font-semibold">Today</button>
            <button className="px-4 py-1 rounded-lg text-gray-600">This Week</button>
            <button className="px-4 py-1 rounded-lg text-gray-600">This Month</button>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-red-600 font-bold">⚠ Low Stock Alert</span>
            <span className="bg-white rounded-full px-3 py-1 text-sm text-gray-700">Ginger: 380g</span>
            <span className="bg-white rounded-full px-3 py-1 text-sm text-gray-700">Cumin Seeds: 180g</span>
          </div>
          <span className="text-xs text-red-400">2 items</span>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-6 mb-8">
          <div className="bg-orange-500 text-white rounded-xl flex-1 p-6 shadow relative overflow-hidden">
            <div className="text-lg font-semibold mb-2">Orders Today</div>
            <div className="text-3xl font-bold mb-1">47</div>
            <div className="text-sm">+12% from yesterday</div>
            <span className="absolute top-6 right-6 bg-orange-100 rounded-xl p-2">
              <ShoppingBag className="w-7 h-7 text-orange-600" />
            </span>
          </div>
          <div className="bg-green-500 text-white rounded-xl flex-1 p-6 shadow relative overflow-hidden">
            <div className="text-lg font-semibold mb-2">Revenue Today</div>
            <div className="text-3xl font-bold mb-1">₹24,580</div>
            <div className="text-sm">+8% from yesterday</div>
            <span className="absolute top-6 right-6 bg-green-100 rounded-xl p-2">
              <CreditCard className="w-7 h-7 text-green-600" />
            </span>
          </div>
          <div className="bg-white rounded-xl flex-1 p-6 shadow relative overflow-hidden">
            <div className="text-lg font-semibold mb-2">Avg Order Value</div>
            <div className="text-3xl font-bold mb-1">₹523</div>
            <div className="text-sm text-gray-600">+5% this week</div>
            <span className="absolute top-6 right-6 bg-orange-100 rounded-xl p-2">
              <TrendingUp className="w-7 h-7 text-orange-600" />
            </span>
          </div>
          <div className="bg-white rounded-xl flex-1 p-6 shadow relative overflow-hidden">
            <div className="text-lg font-semibold mb-2">Active Customers</div>
            <div className="text-3xl font-bold mb-1 text-[#23190f]">128</div>
            <div className="text-sm text-gray-600">32 new this week</div>
            <span className="absolute top-6 right-6 bg-orange-100 rounded-xl p-2">
              <User className="w-7 h-7 text-orange-600" />
            </span>
          </div>
        </div>

        {/* Orders & Best Sellers */}
        <div className="flex gap-8">
          {/* Orders */}
          <div className="flex-1">
            <div className="font-bold text-xl mb-4">Orders</div>
            <div className="flex gap-2 mb-4">
              <button className="bg-orange-500 text-white px-4 py-1 rounded-lg font-semibold">All</button>
              <button className="bg-white px-4 py-1 rounded-lg text-gray-600">Pending</button>
              <button className="bg-white px-4 py-1 rounded-lg text-gray-600">Done</button>
              <button className="bg-white px-4 py-1 rounded-lg text-gray-600">Cancel</button>
            </div>
            <input className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200" placeholder="Search by customer name or order ID..." />
            <div className="bg-white rounded-xl p-4 mb-3 flex justify-between items-center shadow">
              <div>
                <div className="font-semibold">Rahul Sharma <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full ml-2">Pending</span></div>
                <div className="text-sm text-gray-500">Order #1247 • 3 items</div>
              </div>
              <div className="font-bold text-lg">₹650</div>
            </div>
            {/* Add more orders as needed */}
          </div>
          {/* Best Sellers */}
          <div className="w-96">
            <button className="bg-orange-500 text-white w-full py-3 rounded-lg font-semibold mb-6">+ Add Item</button>
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="font-bold text-lg mb-4">Weekly Best Sellers</div>
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <div>1. Paneer Butter Masala</div>
                  <div className="font-bold text-orange-600">156 sold <span className="text-green-500 text-xs ml-1">↑12%</span></div>
                </div>
                <div className="text-xs text-gray-500">₹46,800</div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <div>2. Veg Biryani</div>
                  <div className="font-bold text-orange-600">142 sold <span className="text-green-500 text-xs ml-1">↑8%</span></div>
                </div>
                <div className="text-xs text-gray-500">₹42,600</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;