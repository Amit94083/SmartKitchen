import { Search } from "lucide-react";
import { Home, Box, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  return (
    <section className="relative w-full h-[75vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Header Bar */}
      <header className="w-full flex items-center justify-between px-10 py-3 bg-white shadow-md fixed top-0 left-0 z-30 h-[80px]">
        <div className="flex items-center gap-3">
          <div className="bg-orange-400 text-white font-bold rounded-full w-11 h-11 flex items-center justify-center text-lg">CK</div>
          <span className="text-xl font-bold text-gray-800 ml-2">CloudKitchen</span>
        </div>
        <nav className="flex items-center gap-7">
          <button className="flex items-center gap-2 text-orange-600 font-semibold text-base bg-orange-100 rounded-xl px-4 py-1.5 hover:bg-orange-200 transition">
            <Home className="w-5 h-5" /> Menu
          </button>
          <button className="flex items-center gap-2 text-gray-700 font-semibold text-base hover:bg-gray-100 rounded-xl px-4 py-1.5 transition">
            <Box className="w-5 h-5" /> Orders
          </button>
          <button
            className="flex items-center gap-2 text-gray-700 font-semibold text-base hover:bg-gray-100 rounded-xl px-4 py-1.5 transition"
            onClick={() => navigate('/profile')}
          >
            <User className="w-5 h-5" /> Profile
          </button>
        </nav>
      </header>

      {/* Orange Gradient Background */}
      <div className="absolute inset-0 top-[80px] bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 z-10" style={{height: 'calc(75vh - 0px)'}} />

      <div className="relative z-20 max-w-4xl text-center px-6 mt-32">
        <div
          className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1 rounded-full text-sm mb-6
                     cursor-pointer transition-all duration-300
                     hover:bg-black hover:shadow-lg hover:shadow-black/40"
        >
          <span role="img" aria-label="kitchen">🍽️</span> Fresh from our kitchen
        </div>

        <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl">
          Delicious Food, <br /> Delivered Fast
        </h1>

        <p className="text-white/90 mt-5 text-lg max-w-2xl mx-auto">
          Order from our curated menu of chef-crafted dishes delivered right to your door
        </p>

        <div className="mt-8 flex items-center bg-white rounded-full px-6 py-4 max-w-2xl mx-auto">
          <Search className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>
      </div>
    </section>
  );
}
