
import React, { useEffect, useState } from "react";
import { orderService } from "../services/api";
import AppHeader from "./AppHeader";

function StatusBadge({ status }) {
  let color = "bg-gray-400";
  if (status === "Order Placed") color = "bg-orange-400";
  if (status === "Delivered") color = "bg-green-500";
  if (status === "Cancelled") color = "bg-red-500";
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${color}`}>{status}</span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        setOrders([]);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppHeader />
      <div className="w-full h-20 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mt-[80px]" />
      <div className="pt-10 px-4 md:px-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-16 text-lg">No orders yet. Place your first order!</div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-semibold text-lg">Order #{order.id}</div>
                    <div className="text-gray-500 text-sm">{formatDate(order.orderTime)}</div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 md:mt-0">
                    <StatusBadge status={order.status} />
                    <div className="font-bold text-orange-600 text-lg">₹{order.totalAmount}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Delivery Address:</span> {order.addressFull || "-"}
                  {order.addressApartment && <span>, {order.addressApartment}</span>}
                  {order.addressInstructions && <span> ({order.addressInstructions})</span>}
                </div>
                <button
                  className="mt-4 text-orange-600 hover:underline text-sm font-medium"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  {expanded === order.id ? "Hide Items" : `Show ${order.orderItems?.length || 0} Items`}
                </button>
                {expanded === order.id && (
                  <div className="mt-4">
                    <table className="w-full text-sm border rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">Product</th>
                          <th className="px-3 py-2 text-left">Qty</th>
                          <th className="px-3 py-2 text-left">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems?.map(item => (
                          <tr key={item.id}>
                            <td className="px-3 py-2 border-b">{item.productName}</td>
                            <td className="px-3 py-2 border-b">{item.quantity}</td>
                            <td className="px-3 py-2 border-b">₹{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}