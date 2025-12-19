import CategoryBar from "./CategoryBar";
import FoodCard from "./FoodCard";

import {
  FarmFreshPizza,
  MexicanDelightPizza,
  MargheritaPizza,
  SpecialPizza,
  PannerPizza,

  SupremeGarlicBread,
  CheeseCornGarlicBread,
  CheeseJalapenoGarlicBread,
  CheesePaneerGarlicBread,

  AlooMutterSandwich,
  ChocolateSandwich,
  BreadButter,
  VegSandwich,
  PineappleSandwich,
  ToastButter,
  JungleMungleSandwich,
  TandooriPaneerSandwich,

  VegCheeseBurger,
  AlooTikkiBurger,

  FrenchFries,
  CheesyFries,
  PeriPeriFries,
  PizzaFries,

  SimpleMaggi,
  MasalaMaggi,
  CheezeMaggi,

  DahiPuri,
  SevPuri,
  Bhel,

  VanillaMilkshake,
  StrawberryMilkshake,
  ChocolateMilkshake,
} from "../assets/food";

// ================= MENU DATA =================
const foodItems = [
  // ---------- PIZZA ----------
  {
    name: "Farm Fresh Pizza",
    description:
      "Fresh tomato sauce, mozzarella cheese, capsicum, onion, sweet corn, and herbs",
    price: "139",
    category: "Pizza",
    image: FarmFreshPizza,
  },
  {
    name: "Mexican Delight",
    description:
      "Spicy Mexican sauce, mozzarella cheese, jalapeños, olives, onion, and capsicum",
    price: "159",
    category: "Pizza",
    image: MexicanDelightPizza,
  },
  {
    name: "Margherita Pizza",
    description:
      "Classic pizza with rich tomato sauce, fresh mozzarella cheese, and oregano",
    price: "109",
    category: "Pizza",
    image: MargheritaPizza,
  },
  {
    name: "Special Pizza",
    description:
      "Mozzarella cheese, paneer, onion, capsicum, olives, and chef’s special spices",
    price: "189",
    category: "Pizza",
    image: SpecialPizza,
  },
  {
    name: "Spicy Paneer Pizza",
    description:
      "Spicy paneer cubes, onion, capsicum, mozzarella cheese, and chili flakes",
    price: "169",
    category: "Pizza",
    image: PannerPizza,
  },

  // ---------- GARLIC BREAD ----------
  {
    name: "Supreme Garlic Bread",
    description:
      "Crispy bread baked with garlic butter, herbs, and mozzarella cheese",
    price: "99",
    category: "Garlic Bread",
    image: SupremeGarlicBread,
  },
  {
    name: "Cheese Corn Garlic Bread",
    description:
      "Garlic bread topped with sweet corn, mozzarella cheese, and butter",
    price: "79",
    category: "Garlic Bread",
    image: CheeseCornGarlicBread,
  },
  {
    name: "Cheese Jalapeño Garlic Bread",
    description:
      "Loaded with mozzarella cheese, jalapeños, garlic butter, and herbs",
    price: "89",
    category: "Garlic Bread",
    image: CheeseJalapenoGarlicBread,
  },
  {
    name: "Cheese Paneer Garlic Bread",
    description:
      "Stuffed with paneer, mozzarella cheese, garlic butter, and spices",
    price: "109",
    category: "Garlic Bread",
    image: CheesePaneerGarlicBread,
  },

  // ---------- SANDWICH ----------
  {
    name: "Aloo Mutter Sandwich",
    description:
      "Boiled potato, green peas, spices, butter, and soft bread slices",
    price: "49",
    category: "Sandwich",
    image: AlooMutterSandwich,
  },
  {
    name: "Chocolate Sandwich",
    description:
      "Sweet sandwich made with chocolate spread and soft bread",
    price: "49",
    category: "Sandwich",
    image: ChocolateSandwich,
  },
  {
    name: "Bread Butter",
    description:
      "Fresh bread layered with creamy butter",
    price: "29",
    category: "Sandwich",
    image: BreadButter,
  },
  {
    name: "Veg. Sandwich",
    description:
      "Cucumber, tomato, onion, beetroot, butter, and green chutney",
    price: "49",
    category: "Sandwich",
    image: VegSandwich,
  },
  {
    name: "Pineapple Sandwich",
    description:
      "Sweet pineapple slices with cream and soft bread",
    price: "59",
    category: "Sandwich",
    image: PineappleSandwich,
  },
  {
    name: "Toast Butter",
    description:
      "Toasted bread served with melted butter",
    price: "39",
    category: "Sandwich",
    image: ToastButter,
  },
  {
    name: "Jungle Mungle Sandwich",
    description:
      "Multi-layer sandwich with vegetables, cheese, butter, and special sauces",
    price: "99",
    category: "Sandwich",
    image: JungleMungleSandwich,
  },
  {
    name: "Tandoori Paneer Sandwich",
    description:
      "Grilled sandwich with tandoori paneer, onion, capsicum, and cheese",
    price: "119",
    category: "Sandwich",
    image: TandooriPaneerSandwich,
  },

  // ---------- BURGER ----------
  {
    name: "Veg. Cheese Burger",
    description:
      "Veg patty, cheese slice, lettuce, onion, tomato, and burger sauce",
    price: "89",
    category: "Burger",
    image: VegCheeseBurger,
  },
  {
    name: "Aloo Tikki Burger",
    description:
      "Crispy aloo tikki, onion, tomato, sauces, and soft burger bun",
    price: "69",
    category: "Burger",
    image: AlooTikkiBurger,
  },

  // ---------- FRIES ----------
  {
    name: "French Fries",
    description:
      "Classic deep-fried potato sticks seasoned with salt",
    price: "69",
    category: "Fries",
    image: FrenchFries,
  },
  {
    name: "Cheesy Fries",
    description:
      "Crispy fries topped with melted cheese and herbs",
    price: "99",
    category: "Fries",
    image: CheesyFries,
  },
  {
    name: "Peri Peri Fries",
    description:
      "French fries tossed in spicy peri peri masala",
    price: "79",
    category: "Fries",
    image: PeriPeriFries,
  },
  {
    name: "Pizza Fries",
    description:
      "Fries topped with pizza sauce, cheese, veggies, and herbs",
    price: "99",
    category: "Fries",
    image: PizzaFries,
  },

  // ---------- MAGGIE ----------
  {
    name: "Simple Maggi",
    description:
      "Plain maggi noodles cooked with tastemaker",
    price: "49",
    category: "Maggie",
    image: SimpleMaggi,
  },
  {
    name: "Masala Maggi",
    description:
      "Maggi cooked with onion, tomato, spices, and masala",
    price: "49",
    category: "Maggie",
    image: MasalaMaggi,
  },
  {
    name: "Cheese Maggi",
    description:
      "Cheesy maggi noodles with mozzarella cheese and butter",
    price: "79",
    category: "Maggie",
    image: CheezeMaggi,
  },

  // ---------- CHAAT ----------
  {
    name: "Dahi Puri",
    description:
      "Crispy puris filled with potato, curd, sweet and spicy chutneys",
    price: "49",
    category: "Chaat",
    image: DahiPuri,
  },
  {
    name: "Sev Puri",
    description:
      "Puri topped with potato, chutneys, onion, and sev",
    price: "49",
    category: "Chaat",
    image: SevPuri,
  },
  {
    name: "Bhel",
    description:
      "Puffed rice mixed with onion, tomato, chutneys, and sev",
    price: "49",
    category: "Chaat",
    image: Bhel,
  },

  // ---------- FRAPPE ----------
  {
    name: "Vanilla Milkshake",
    description:
      "Milk blended with vanilla ice cream and sugar",
    price: "70",
    category: "Frappe",
    image: VanillaMilkshake,
  },
  {
    name: "Strawberry Milkshake",
    description:
      "Strawberry syrup blended with milk and ice cream",
    price: "100",
    category: "Frappe",
    image: StrawberryMilkshake,
  },
  {
    name: "Chocolate Milkshake",
    description:
      "Chocolate syrup blended with milk and chocolate ice cream",
    price: "120",
    category: "Frappe",
    image: ChocolateMilkshake,
  },
];

// ================= COMPONENT =================
export default function MenuSection({
  searchQuery,
  activeCategory,
  setActiveCategory,
}) {
  const filteredItems = foodItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <CategoryBar
          active={activeCategory}
          setActive={setActiveCategory}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <FoodCard key={index} item={item} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No items found
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
