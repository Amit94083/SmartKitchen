import React, { useState } from "react";
import Sidebar from './Sidebar';
import { BookOpen, Clock, Users } from 'lucide-react';

const Recipes = () => {
  const [recipes] = useState([
    {
      id: 1,
      name: "Paneer Butter Masala",
      category: "Main Course",
      time: "25 mins",
      servings: 4,
      ingredients: [
        { name: "Paneer", amount: "250g" },
        { name: "Butter", amount: "50g" },
        { name: "Tomatoes", amount: "200g" },
        { name: "Cream", amount: "100ml" }
      ],
      moreIngredients: 3
    },
    {
      id: 2,
      name: "Dal Makhani",
      category: "Main Course",
      time: "45 mins",
      servings: 6,
      ingredients: [
        { name: "Black Lentils", amount: "300g" },
        { name: "Butter", amount: "80g" },
        { name: "Cream", amount: "150ml" },
        { name: "Tomatoes", amount: "150g" }
      ],
      moreIngredients: 3
    },
    {
      id: 3,
      name: "Veg Biryani",
      category: "Rice",
      time: "40 mins",
      servings: 5,
      ingredients: [
        { name: "Basmati Rice", amount: "500g" },
        { name: "Mixed Vegetables", amount: "300g" },
        { name: "Yogurt", amount: "100ml" },
        { name: "Onions", amount: "150g" }
      ],
      moreIngredients: 3
    },
    {
      id: 4,
      name: "Palak Paneer",
      category: "Main Course",
      time: "30 mins",
      servings: 4,
      ingredients: [
        { name: "Spinach", amount: "400g" },
        { name: "Paneer", amount: "200g" },
        { name: "Onions", amount: "80g" },
        { name: "Cream", amount: "50ml" }
      ],
      moreIngredients: 3
    },
    {
      id: 5,
      name: "Jeera Rice",
      category: "Rice",
      time: "20 mins",
      servings: 4,
      ingredients: [
        { name: "Basmati Rice", amount: "400g" },
        { name: "Cumin Seeds", amount: "10g" },
        { name: "Ghee", amount: "40g" },
        { name: "Bay Leaf", amount: "2g" }
      ],
      moreIngredients: 1
    },
    {
      id: 6,
      name: "Mango Lassi",
      category: "Beverage",
      time: "5 mins",
      servings: 2,
      ingredients: [
        { name: "Yogurt", amount: "300ml" },
        { name: "Mango Pulp", amount: "150g" },
        { name: "Sugar", amount: "40g" },
        { name: "Cardamom Powder", amount: "2g" }
      ],
      moreIngredients: 1
    }
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="recipes" />
      <main className="flex-1 px-10 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recipes</h1>
          <p className="text-gray-500">Your kitchen recipe collection.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                    {recipe.category}
                  </span>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg transition-colors">
                  <BookOpen size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{recipe.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Ingredients:</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">
                      {ingredient.name}: {ingredient.amount}
                    </span>
                  ))}
                  {recipe.moreIngredients > 0 && (
                    <button className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                      +{recipe.moreIngredients} more
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Recipes;
