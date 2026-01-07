import React, { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null); // backend cart object
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend when user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      cartService.getCart(user.id)
        .then(data => setCart(data))
        .finally(() => setLoading(false));
    } else {
      setCart(null);
    }
  }, [user]);


  const addToCart = async (item, quantity = 1) => {
    if (!user) return;
    setLoading(true);
    const menuItemId = item.menuItem?.itemId || item.itemId;
    if (!menuItemId) {
      console.error('addToCart called with invalid item:', item);
      setLoading(false);
      return;
    }
    console.log('addToCart: userId', user.id, 'menuItemId', menuItemId, 'quantity', quantity);
    const addResp = await cartService.addToCart(user.id, menuItemId, quantity);
    console.log('addToCart response:', addResp);
    const updated = await cartService.getCart(user.id);
    console.log('getCart after add response:', updated);
    setCart(updated);
    setLoading(false);
  };


  const updateCartItem = async (item, quantity) => {
    if (!user) return;
    setLoading(true);
    const menuItemId = item.menuItem?.itemId || item.itemId;
    if (!menuItemId) {
      console.error('updateCartItem called with invalid item:', item);
      setLoading(false);
      return;
    }
    console.log('updateCartItem: userId', user.id, 'menuItemId', menuItemId, 'quantity', quantity);
    const updateResp = await cartService.updateCartItem(user.id, menuItemId, quantity);
    console.log('updateCartItem response:', updateResp);
    const updated = await cartService.getCart(user.id);
    console.log('getCart after update response:', updated);
    setCart(updated);
    setLoading(false);
  };


  const removeFromCart = async (item) => {
    if (!user) return;
    setLoading(true);
    const menuItemId = item.menuItem?.itemId || item.itemId;
    if (!menuItemId) {
      console.error('removeFromCart called with invalid item:', item);
      setLoading(false);
      return;
    }
    console.log('removeFromCart: userId', user.id, 'menuItemId', menuItemId);
    const removeResp = await cartService.removeFromCart(user.id, menuItemId);
    console.log('removeFromCart response:', removeResp);
    const updated = await cartService.getCart(user.id);
    console.log('getCart after remove response:', updated);
    setCart(updated);
    setLoading(false);
  };

  const clearCart = () => setCart(null);

  // Calculate cart count and total from backend cart
  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((sum, i) => sum + (i.menuItem?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart, clearCart, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
