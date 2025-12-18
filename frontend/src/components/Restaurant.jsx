import { useParams } from "react-router-dom";
import Hero from "./Hero";
import MenuSection from "./MenuSection";

export default function Restaurant() {
  const { id } = useParams();

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Menu Section */}
      <MenuSection />

      {/* Debug (optional, remove later) */}
      <div className="text-center text-gray-400 py-4">
        Restaurant ID: {id}
      </div>
    </div>
  );
}
