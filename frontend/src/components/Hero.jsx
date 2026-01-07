import { Search } from "lucide-react";
import AppHeader from "./AppHeader";

export default function Hero({ searchQuery, setSearchQuery }) {
  return (
    <section className="relative w-full h-[75vh] flex flex-col items-center justify-center overflow-hidden">
      <AppHeader />

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
