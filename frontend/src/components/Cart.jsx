
import React from "react";
import AppHeader from "./AppHeader";
import { useCart } from "../context/CartContext";
import { imageMap } from "../assets/food";

export default function Cart() {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppHeader />
      {/* Orange Gradient Background (match restaurant/hero style) */}
      <div className="w-full h-20 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mt-[80px]" />
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        {loading ? (
          <h1 className="text-2xl">Loading cart...</h1>
        ) : !cart || !cart.active ? (
          <h1 className="text-2xl">No active cart. Please add items to start a new cart.</h1>
        ) : !cart.items || cart.items.length === 0 ? (
          <h1 className="text-2xl">Your cart is empty.</h1>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">My Cart</h1>
            <div className="space-y-4 mb-4">
              {[...cart.items]
                .sort((a, b) => (a.menuItem?.name || '').localeCompare(b.menuItem?.name || ''))
                .map((item) => (
                <div key={item.id} className="flex items-center bg-gray-50 rounded-2xl p-4 gap-4 relative">
                  <img
                    src={
                      imageMap[item.menuItem?.imageUrl] ||
                      item.menuItem?.imageUrl ||
                      item.menuItem?.image
                    }
                    alt={item.menuItem?.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.menuItem?.name}</div>
                    <div className="text-orange-600 font-bold text-base">₹{item.menuItem?.price?.toFixed(2)}</div>
                  </div>
                  <button className="text-gray-300 hover:text-red-500 absolute top-3 right-3" onClick={() => removeFromCart(item)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-500 flex items-center justify-center"
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item);
                        } else {
                          updateCartItem(item, item.quantity - 1);
                        }
                      }}
                    >-</button>
                    <span className="font-medium text-lg">{item.quantity}</span>
                    <button className="w-8 h-8 rounded-full bg-orange-500 text-white text-xl flex items-center justify-center" onClick={() => updateCartItem(item, item.quantity + 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right font-bold text-lg mt-4">
              Total: ₹{cart.items.reduce((sum, item) => sum + (item.menuItem?.price || 0) * item.quantity, 0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
