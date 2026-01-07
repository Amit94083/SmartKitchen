
import React from "react";
import { imageMap } from "../assets/food";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const DELIVERY_FEE = 40;

export default function CartDrawer({ open, onClose }) {
  const { cart, cartCount, cartTotal, addToCart, removeFromCart, updateCartItem } = useCart();
  const items = cart?.items || [];
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      {/* Drawer */}
      <aside className="relative w-full max-w-md h-full bg-[#f8fafc] shadow-xl flex flex-col p-6 overflow-y-auto">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <X className="w-7 h-7" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold">Your Order</h2>
        </div>
        <hr className="mb-4" />
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center pt-12">
            <div className="rounded-full bg-gray-100 w-24 h-24 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</div>
            <div className="text-gray-400 text-base">Add some delicious items to get started</div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 mb-6">
              {[...items]
                .sort((a, b) => (a.menuItem?.name || '').localeCompare(b.menuItem?.name || ''))
                .map((item) => (
                <div key={item.id} className="flex items-center bg-gray-50 rounded-2xl p-4 gap-4 relative">
                  <img src={imageMap[item.menuItem?.imageUrl] || item.menuItem?.imageUrl || item.menuItem?.image} alt={item.menuItem?.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.menuItem?.name}</div>
                    <div className="text-orange-600 font-bold text-base">₹{item.menuItem?.price?.toFixed(2)}</div>
                  </div>
                  <button className="text-gray-300 hover:text-red-500 absolute top-3 right-3" onClick={() => removeFromCart(item)}>
                    <Trash2 className="w-4 h-4" />
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
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>₹{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>₹{(cartTotal + DELIVERY_FEE).toFixed(2)}</span>
              </div>
              <button
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-lg transition"
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
