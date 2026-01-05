import { imageMap } from "../assets/food";
import { useCart } from "../context/CartContext";

export default function FoodCard({ item }) {
  const { addToCart } = useCart();
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
      {/* IMAGE CONTAINER WITH ASPECT RATIO */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={imageMap[item.imageUrl] || item.imageUrl || item.image}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      {/* CONTENT */}
      <div className="p-5">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-5">
          <span className="text-xl font-bold">₹{item.price}</span>
          <button
            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-full font-medium transition-all duration-300 hover:bg-orange-600 hover:shadow-lg"
            onClick={() => addToCart(item)}
          >
            <span className="text-lg">+</span>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
