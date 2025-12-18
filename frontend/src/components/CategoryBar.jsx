import {
  Utensils,
  Pizza,
  Beef,
  Soup,
  Milk,
  Coffee,
  IceCream,
} from "lucide-react";

export const categories = [
  { name: "All", icon: <Utensils size={16} /> },
  { name: "Pizza", icon: <Pizza size={16} /> },
  { name: "Sandwich", icon: <Utensils size={16} /> }, // fallback
  { name: "Burger", icon: <Beef size={16} /> },
  { name: "Fries", icon: <Utensils size={16} /> }, // fallback
  { name: "Maggie", icon: <Soup size={16} /> },
  { name: "Chaat", icon: <Utensils size={16} /> },
  { name: "Milkshake", icon: <Milk size={16} /> },
  { name: "Cold Coffee", icon: <Coffee size={16} /> },
  { name: "Frappe", icon: <IceCream size={16} /> },
];

export default function CategoryBar() {
  return (
    <div className="flex gap-3 flex-wrap">
      {categories.map((cat, index) => (
        <button
          key={index}
          className={`flex items-center gap-2 px-5 py-2 rounded-full border
            text-sm font-medium transition-all
            ${
              cat.name === "All"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          {cat.icon}
          {cat.name}
        </button>
      ))}
    </div>
  );
}
