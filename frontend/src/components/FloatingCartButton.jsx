import React from "react";
import { ShoppingBag } from "lucide-react";

export default function FloatingCartButton({ count, price, onClick }) {
  if (count === 0) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-50 bg-[#1a2236] flex items-center gap-2 px-4 py-2 rounded-full shadow-xl cursor-pointer select-none"
      style={{ minWidth: 120 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Open cart"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <span className="text-yellow-400 flex items-center gap-1">
        <ShoppingBag className="w-5 h-5" />
      </span>
      <span className="text-yellow-400 text-base font-bold">{count}</span>
      <span className="text-yellow-400 text-xl font-bold">·</span>
      <span className="text-yellow-400 text-base font-bold">₹{price.toFixed(2)}</span>
    </div>
  );
}
