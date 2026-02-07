

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../services/api";
import AppHeader from "./AppHeader";
import { imageMap } from "../assets/food/index";
import useOrderSSE from "../hooks/useOrderSSE";

function StatusBadge({ status }) {
  // Map 'pending' from database to 'Placed' for display
  const displayStatus = status === "pending" ? "Placed" : status;
  
  let color = "bg-gray-400";
  if (displayStatus === "Placed") color = "bg-orange-400";
  if (displayStatus === "Delivered") color = "bg-green-500";
  if (displayStatus === "Cancelled") color = "bg-red-500";
  if (displayStatus === "Ready") color = "bg-blue-500";
  if (displayStatus === "Confirmed") color = "bg-blue-400";
  if (displayStatus === "Preparing") color = "bg-yellow-500";
  if (displayStatus === "OnTheWay") color = "bg-purple-500";
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${color}`}>{displayStatus}</span>
  );
}


function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return `${date} • ${time}`;
}


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("active");
  const navigate = useNavigate();

  // Enable real-time order updates via SSE
  useOrderSSE(setOrders);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
          console.log('No user found in localStorage');
          setOrders([]);
          return;
        }
        const data = await orderService.getMyOrders(user.id);
        // Sort orders by orderTime descending (latest first)
        const sorted = [...data].sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
        setOrders(sorted);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      }
    }
    fetchOrders();
  }, []);

  // Split orders into active and past
  const activeOrders = orders.filter(o => o.status && o.status !== "Delivered" && o.status !== "Cancelled");
  const pastOrders = orders.filter(o => o.status && (o.status === "Delivered" || o.status === "Cancelled"));

  const shownOrders = tab === "active" ? activeOrders : pastOrders;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppHeader />
      <div className="w-full h-20 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mt-[80px]" />
      <div className="pt-10 px-4 md:px-10 max-w-3xl mx-auto">
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            className={`px-6 py-2 font-semibold text-lg border-b-2 transition-all ${tab === "active" ? "border-orange-500 text-orange-600 bg-white" : "border-transparent text-gray-500 bg-transparent"}`}
            onClick={() => setTab("active")}
          >
            Active ({activeOrders.length})
          </button>
          <button
            className={`px-6 py-2 font-semibold text-lg border-b-2 transition-all ${tab === "past" ? "border-orange-500 text-orange-600 bg-white" : "border-transparent text-gray-500 bg-transparent"}`}
            onClick={() => setTab("past")}
          >
            Past ({pastOrders.length})
          </button>
        </div>
        {shownOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-16 text-lg">No orders in this tab.</div>
        ) : (
          <div className="space-y-6">
            {shownOrders.map(order => {
              // Get first item image if available
              let firstItemImg = null;
              if (order.orderItems && order.orderItems.length > 0) {
                const item = order.orderItems[0];
                const baseName = item.productName ? item.productName.replace(/\s/g,"") : "";
                const lowerBase = baseName.toLowerCase();
                const candidates = [
                  item.image,
                  item.productImage,
                  baseName + ".jpg",
                  baseName + ".jpeg",
                  baseName + "Pizza.jpg",
                  baseName + "Pizza.jpeg",
                  lowerBase + ".jpg",
                  lowerBase + ".jpeg",
                  lowerBase + "pizza.jpg",
                  lowerBase + "pizza.jpeg",
                  "MexicanDelightPizza.jpg", // explicit fallback for this case
                  "MexicanDelight.jpg"
                ].filter(Boolean);
                for (const key of candidates) {
                  // Try direct match
                  if (imageMap[key]) {
                    firstItemImg = imageMap[key];
                    break;
                  }
                  // Try case-insensitive match
                  const foundKey = Object.keys(imageMap).find(k => k.toLowerCase() === key.toLowerCase());
                  if (foundKey) {
                    firstItemImg = imageMap[foundKey];
                    break;
                  }
                }
              }
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col gap-0 px-5 py-6 mb-4">
                  <div className="flex items-start gap-4 relative">
                    {firstItemImg ? (
                      <img src={firstItemImg} alt="food" className="w-16 h-16 rounded-lg object-cover border" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border" />
                    )}
                    <div className="flex-1">
                      <div className="text-gray-500 text-base font-medium mb-1">
                        {order.status === 'Delivered' && order.deliveredAt ? (
                          <span>
                            <span className="text-green-600 font-medium">Delivered:</span> {formatDate(order.deliveredAt)}
                          </span>
                        ) : (
                          formatDate(order.orderTime)
                        )}
                      </div>
                      <div className="font-semibold text-lg mb-1">{order.orderItems?.length || 0} item{order.orderItems?.length === 1 ? "" : "s"} • ₹{order.totalAmount}</div>
                    </div>
                    <div className="absolute right-0 top-0">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  <button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-base transition-all flex items-center justify-center mt-6"
                    style={{background:'#fa7a13'}}
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    <span className="text-yellow-200 font-bold">Track Order</span>
                    <span className="ml-2 text-yellow-200 font-bold">&gt;</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}