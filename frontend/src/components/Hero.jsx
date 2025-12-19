import { Search } from "lucide-react";

export default function Hero({ searchQuery, setSearchQuery }) {
  return (
    <section className="relative w-full h-[75vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500" />

      <div className="relative z-10 max-w-4xl text-center px-6">
        <div
          className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1 rounded-full text-sm mb-6
                     cursor-pointer transition-all duration-300
                     hover:bg-black hover:shadow-lg hover:shadow-black/40"
        >
          ✨ Fresh from our kitchen
        </div>

        <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl">
          Delicious Food,
          <br />
          Freshly Prepared
        </h1>

        <p className="text-white/90 mt-5 text-lg max-w-2xl mx-auto">
         Freshly prepared dishes made with handpicked ingredients and authentic flavors
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
