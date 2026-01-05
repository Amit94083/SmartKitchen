import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({}); // { [itemId]: { ...item, quantity } }

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev[item.itemId] || { ...item, quantity: 0 };
      return {
        ...prev,
        [item.itemId]: { ...item, quantity: existing.quantity + 1 },
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearCart = () => setCart({});

  const cartCount = Object.values(cart).reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = Object.values(cart).reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
