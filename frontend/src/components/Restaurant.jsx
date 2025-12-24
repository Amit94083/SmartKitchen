import { useParams } from "react-router-dom";
import { useState } from "react";
import Hero from "./Hero";
import MenuSection from "./MenuSection";

export default function Restaurant() {
  const { id } = useParams();

 
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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

      <div className="text-center text-gray-400 py-4">
        Restaurant ID: {id}
      </div>
    </div>
  );
}
