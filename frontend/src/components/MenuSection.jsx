
import React, { useEffect, useState } from "react";
import CategoryBar from "./CategoryBar";
import FoodCard from "./FoodCard";

export default function MenuSection({ searchQuery, activeCategory, setActiveCategory }) {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/menu")
      .then(res => res.json())
      .then(data => {
        setFoodItems(data);
        setLoading(false);
      });
  }, []);

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div>Loading menu...</div>;

  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <CategoryBar active={activeCategory} setActive={setActiveCategory} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <FoodCard key={item.itemId || index} item={item} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No items found</p>
          )}
        </div>
      </div>
    </section>
  );
}
// Duplicate component definition and leftover code removed. Only one MenuSection export remains.
