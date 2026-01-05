
import { useParams } from "react-router-dom";
import { useState } from "react";
import Hero from "./Hero";
import MenuSection from "./MenuSection";
import FloatingCartButton from "./FloatingCartButton";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";

export default function Restaurant() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { cartCount, cartTotal } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Menu Section */}
      <MenuSection
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <FloatingCartButton count={cartCount} price={cartTotal} onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="text-center text-gray-400 py-4">
        Restaurant ID: {id}
      </div>
    </div>
  );
}
