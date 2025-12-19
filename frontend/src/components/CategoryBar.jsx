import {
  Utensils,
  Pizza,
  Beef,
  Soup,
  Coffee,
  IceCream,
} from "lucide-react";

const categories = [
  { name: "All", icon: <Utensils size={16} /> },
  { name: "Pizza", icon: <Pizza size={16} /> },
  { name: "Sandwich", icon: <Utensils size={16} /> },
  { name: "Burger", icon: <Beef size={16} /> },
  { name: "Fries", icon: <Utensils size={16} /> },
  { name: "Maggie", icon: <Soup size={16} /> },
  { name: "Chaat", icon: <Utensils size={16} /> },
  { name: "Garlic Bread", icon: <Utensils size={16} /> },
  { name: "Frappe", icon: <IceCream size={16} /> },
];

export default function CategoryBar({ active, setActive }) {
  return (
    <div className="w-full flex justify-center -mt-8">
      <div className="max-w-6xl w-full px-4">
        <div className="flex flex-wrap justify-center items-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActive(cat.name)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border
                text-sm font-medium transition-all duration-200
                ${
                  active === cat.name
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

