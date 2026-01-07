import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import AppHeader from "./AppHeader";

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  // TODO: Add useEffect to fetch orders if needed
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppHeader />
      {/* Orange Gradient Background (match restaurant/hero style) */}
      <div className="w-full h-20 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mt-[80px]" />
      <div className="pt-10 px-10">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        {/* Orders Table */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) && orders.map(order => (
                <tr key={order.id} className="align-top">
                  <td className="py-2 px-4 border-b">{order.id}</td>
                  <td className="py-2 px-4 border-b">{order.orderTime?.slice(0, 10)}</td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                  <td className="py-2 px-4 border-b">₹{order.totalAmount}</td>
                  <td className="py-2 px-4 border-b">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      <table className="w-full text-xs border mt-1">
                        <thead>
                          <tr>
                            <th className="px-2 py-1 border-b">Product</th>
                            <th className="px-2 py-1 border-b">Qty</th>
                            <th className="px-2 py-1 border-b">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.orderItems.map(item => (
                            <tr key={item.id}>
                              <td className="px-2 py-1 border-b">{item.productName}</td>
                              <td className="px-2 py-1 border-b">{item.quantity}</td>
                              <td className="px-2 py-1 border-b">₹{item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <span className="text-gray-400">No items</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}