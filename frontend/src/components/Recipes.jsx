import React from "react";
import Sidebar from './Sidebar';

const Recipes = () => {
  // Sidebar handles navigation

  return (
    <div className="flex min-h-screen bg-[#f9f7f4]">
      <Sidebar activeTab="recipes" />
      <main className="flex-1 px-10 py-8">
        <h1 className="text-4xl font-bold text-[#23190f] mb-1">Recipes</h1>
        <p className="text-gray-500 mb-6">Your recipes will appear here.</p>
      </main>
    </div>
  );
};

export default Recipes;
