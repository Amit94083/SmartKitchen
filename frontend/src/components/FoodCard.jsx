export default function FoodCard({ item }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
      
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-56 object-cover"
      />

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {item.description}
        </p>

        {/* Price + Add Button */}
        <div className="flex items-center justify-between mt-5">
          
          {/* ✅ PRICE HERE */}
          <span className="text-xl font-bold">
            ₹{item.price}
          </span>

          <button
            className="flex items-center gap-2 bg-orange-500 text-white
                       px-5 py-2 rounded-full font-medium
                       transition-all duration-300
                       hover:bg-orange-600 hover:shadow-lg"
          >
            <span className="text-lg">+</span>
            Add
          </button>

        </div>
      </div>
    </div>
  );
}
