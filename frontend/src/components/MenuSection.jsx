import CategoryBar from "./CategoryBar";
import FoodCard from "./FoodCard";

const foodItems = [
  {
    name: "Farm Fresh Pizza",
    description: "Jain & Swaminarayan Option available",
    price: "139",
    category: "Pizza",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMwkpnflwNeECtMZRd25vLNCNxV2hap5MksA&s",
  },
  {
    name: "Mexican Delight",
    description: "Jain & Swaminarayan Option available",
    price: "159",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
  },
  {
    name: "Hawaiian Pizza",
    description: "Jain & Swaminarayan Option available",
    price: "119",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be45",
  },
  {
    name: "Italian Pizza",
    description: "Jain & Swaminarayan Option available",
    price: "149",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1548365328-8bdb7c6f6e42",
  },
  {
    name: "Spicy Paneer Pizza",
    description: "Jain & Swaminarayan Option available",
    price: "169",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1600628422019-9ed9aef40c2c",
  },
  {
    name: "Margherita Pizza",
    description: "Jain & Swaminarayan Option available",
    price: "109",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1601924638867-3ec8b38b7b4b",
  },
  {
    name: "Special Pizza",
    description: "Jain & Swaminarayan Option available",
    price: "189",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
  },
 
  {
    name: "Supreme Garlic Bread",
    description: "Classic garlic bread with rich butter flavor",
    price: "99",
    category: "Garlic Bread",
    image: "https://images.unsplash.com/photo-1604908177522-432e2e4e5c9a",
  },
  {
    name: "Kabir's Sp. Garlic Bread",
    description: "Special house garlic bread",
    price: "119",
    category: "Garlic Bread",
    image: "https://images.unsplash.com/photo-1618219874323-4a9d0b7f82f6",
  },
  {
    name: "Cheese Corn Garlic Bread",
    description: "Garlic bread topped with cheese and corn",
    price: "79",
    category: "Garlic Bread",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
  },
  {
    name: "Cheese Jalapeño Garlic Bread",
    description: "Spicy jalapeño garlic bread with cheese",
    price: "89",
    category: "Garlic Bread",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d26d",
  },
  {
    name: "Cheese Paneer Garlic Bread",
    description: "Paneer-loaded cheesy garlic bread",
    price: "109",
    category: "Garlic Bread",
    image: "https://images.unsplash.com/photo-1605475128023-4f5b1fbc9a94",
  },
  {
    name: "Cheese Chilli Garlic Bread",
    description: "Spicy chilli garlic bread with cheese",
    price: "79",
    category: "Garlic Bread",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec",
  },

];


export default function MenuSection() {
  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Category Bar */}
        <div className="mb-10">
          <CategoryBar />
        </div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {foodItems.map((item, index) => (
            <FoodCard key={index} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}
