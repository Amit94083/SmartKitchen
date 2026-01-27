import React, { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import { BookOpen, Clock, Users, X, Plus, Trash2 } from 'lucide-react';
import { recipeService, menuService, ingredientService } from '../services/api';

const Recipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState([
    { ingredientId: '', quantityRequired: '' }
  ]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableIngredients, setEditableIngredients] = useState([]);

  useEffect(() => {
    loadMenuItems();
    loadIngredients();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      loadRecipes();
    }
  }, [menuItems]);

  const loadRecipes = async () => {
    try {
      console.log('Loading recipes...');
      const data = await recipeService.getAllRecipes();
      console.log('Raw recipes data from backend:', data);
      console.log('Number of recipes:', data ? data.length : 0);
      
      if (!data || data.length === 0) {
        console.log('No recipes returned from backend');
        // If no recipes exist, show menu items as recipe placeholders
        if (menuItems.length > 0) {
          const menuItemRecipes = menuItems.map(item => ({
            id: item.itemId,
            name: item.name,
            category: item.category,
            price: item.price,
            description: item.description,
            ingredients: [],
            hasRecipe: false
          }));
          setRecipes(menuItemRecipes);
        }
        return;
      }
      
      // Group recipes by menu item
      const groupedRecipes = {};
      data.forEach(recipe => {
        console.log('Processing recipe:', recipe);
        const menuItemId = recipe.menuItemId;
        if (!groupedRecipes[menuItemId]) {
          groupedRecipes[menuItemId] = {
            id: menuItemId,
            name: recipe.menuItemName,
            category: recipe.menuItemCategory,
            description: recipe.menuItemDescription,
            ingredients: [],
            hasRecipe: true
          };
        }
        groupedRecipes[menuItemId].ingredients.push({
          name: recipe.ingredientName,
          amount: `${recipe.quantityRequired} ${recipe.ingredientUnit}`
        });
      });
      
      console.log('Grouped recipes:', groupedRecipes);
      const recipesArray = Object.values(groupedRecipes);
      console.log('Setting recipes array:', recipesArray);
      setRecipes(recipesArray);
      
    } catch (error) {
      console.error('Error loading recipes:', error);
      console.error('Error details:', error.response || error.message);
      // If error, show menu items as fallback
      if (menuItems.length > 0) {
        const menuItemRecipes = menuItems.map(item => ({
          id: item.itemId,
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description,
          ingredients: [],
          hasRecipe: false
        }));
        setRecipes(menuItemRecipes);
      }
    }
  };

  const loadMenuItems = async () => {
    try {
      console.log('Loading menu items...');
      const data = await menuService.getAllMenuItems();
      console.log('Menu items loaded:', data);
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu items:', error);
      alert('Failed to load menu items. Please check if the backend is running.');
    }
  };

  const loadIngredients = async () => {
    try {
      console.log('Loading ingredients...');
      const data = await ingredientService.getAllIngredients();
      console.log('Ingredients loaded:', data);
      setIngredients(data);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      alert('Failed to load ingredients. Please check if the backend is running.');
    }
  };

  const handleAddIngredientRow = () => {
    setRecipeIngredients([...recipeIngredients, { ingredientId: '', quantityRequired: '' }]);
  };

  const handleRemoveIngredientRow = (index) => {
    if (recipeIngredients.length > 1) {
      const newIngredients = recipeIngredients.filter((_, i) => i !== index);
      setRecipeIngredients(newIngredients);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipeIngredients];
    newIngredients[index][field] = value;
    setRecipeIngredients(newIngredients);
  };

  const handleSubmitRecipe = async () => {
    if (!selectedMenuItem) {
      alert('Please select a menu item');
      return;
    }

    const validIngredients = recipeIngredients.filter(
      ing => ing.ingredientId && ing.quantityRequired
    );

    if (validIngredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    try {
      await recipeService.createBatchRecipes({
        menuItemId: selectedMenuItem,
        ingredients: validIngredients
      });
      
      setShowAddModal(false);
      setSelectedMenuItem('');
      setRecipeIngredients([{ ingredientId: '', quantityRequired: '' }]);
      loadRecipes(); // Reload recipes after creating new one
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Error creating recipe. Please try again.');
    }
  };

  const handleEnterEditMode = () => {
    // Convert current ingredients to editable format
    const editable = selectedRecipe.ingredients.map(ing => {
      const match = ing.amount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
      const quantity = match ? match[1] : ing.amount;
      const unit = match ? match[2] : '';
      
      // Find the ingredient in the ingredients list
      const ingredient = ingredients.find(i => i.name === ing.name);
      
      return {
        ingredientId: ingredient ? ingredient.ingredientId : '',
        ingredientName: ing.name,
        quantityRequired: quantity,
        unit: unit,
        isExisting: true
      };
    });
    setEditableIngredients(editable);
    setIsEditMode(true);
  };

  const handleAddEditIngredient = () => {
    setEditableIngredients([...editableIngredients, { ingredientId: '', quantityRequired: '', isExisting: false }]);
  };

  const handleRemoveEditIngredient = (index) => {
    const newIngredients = editableIngredients.filter((_, i) => i !== index);
    setEditableIngredients(newIngredients);
  };

  const handleEditIngredientChange = (index, field, value) => {
    const newIngredients = [...editableIngredients];
    newIngredients[index][field] = value;
    
    // Update name and unit when ingredient is selected
    if (field === 'ingredientId') {
      const ing = ingredients.find(i => i.ingredientId == value);
      if (ing) {
        newIngredients[index].ingredientName = ing.name;
        newIngredients[index].unit = ing.unit;
      }
    }
    
    setEditableIngredients(newIngredients);
  };

  const handleSaveUpdatedRecipe = async () => {
    const validIngredients = editableIngredients.filter(
      ing => ing.ingredientId && ing.quantityRequired
    );

    if (validIngredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    try {
      // Delete all existing recipes for this menu item first
      await recipeService.deleteRecipesByMenuItem(selectedRecipe.id);
      
      // Then create new ones
      await recipeService.createBatchRecipes({
        menuItemId: selectedRecipe.id,
        ingredients: validIngredients.map(ing => ({
          ingredientId: ing.ingredientId,
          quantityRequired: ing.quantityRequired
        }))
      });
      
      setIsEditMode(false);
      setSelectedRecipe(null);
      loadRecipes();
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Error updating recipe. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditableIngredients([]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="recipes" />
      <main className="flex-1 px-10 py-8 ml-72 overflow-y-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Recipes</h1>
            <p className="text-gray-500">Your kitchen recipe collection.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <BookOpen size={20} />
            Add Recipe
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No recipes found</p>
              <p className="text-gray-400">Click "Add Recipe" to create your first recipe</p>
            </div>
          ) : (
            [...recipes]
              .sort((a, b) => {
                if (a.category < b.category) return -1;
                if (a.category > b.category) return 1;
                return a.name.localeCompare(b.name);
              })
              .map((recipe) => (
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

                  {recipe.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                  )}

                  <div className="mb-4 text-gray-600 text-sm">
                    {recipe.hasRecipe ? (
                      <p className="font-semibold text-green-600">{recipe.ingredients.length} ingredients defined</p>
                    ) : (
                      <p className="font-semibold text-amber-600">No ingredients defined yet</p>
                    )}
                  </div>

                  <button 
                    onClick={() => recipe.hasRecipe ? setSelectedRecipe(recipe) : setShowAddModal(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    {recipe.hasRecipe ? 'View Ingredients' : 'Add Recipe'}
                  </button>
                </div>
              ))
          )}
        </div>

        {/* Ingredients Modal */}
        {selectedRecipe && selectedRecipe.hasRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden animate-fadeIn">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <BookOpen size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{selectedRecipe.name}</h2>
                      <p className="text-orange-100 text-sm mt-1">
                        {isEditMode ? 'Edit recipe ingredients' : 'View recipe ingredients'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedRecipe(null);
                      setIsEditMode(false);
                      setEditableIngredients([]);
                    }}
                    className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 overflow-y-auto max-h-[calc(95vh-220px)]">
                {!isEditMode ? (
                  /* View Mode */
                  <div className="space-y-3">
                    {selectedRecipe.ingredients.map((ingredient, index) => {
                      // Extract quantity and unit from amount (e.g., "250 g" -> quantity: "250", unit: "g")
                      const match = ingredient.amount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
                      const quantity = match ? match[1] : ingredient.amount;
                      const unit = match ? match[2] : '';
                      
                      return (
                        <div 
                          key={index} 
                          className="bg-gradient-to-r from-orange-50 via-white to-orange-50 border-2 border-orange-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-orange-400 transform hover:-translate-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{ingredient.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <BookOpen size={14} />
                                  <span>Ingredient</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right px-4">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Quantity</p>
                                <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">{quantity}</p>
                              </div>
                              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl px-6 py-3 min-w-[100px] text-center shadow-md">
                                <p className="text-xs uppercase font-semibold opacity-90">Unit</p>
                                <p className="text-lg font-bold mt-1">{unit}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-200 shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-blue-500 p-2 rounded-lg">
                            <BookOpen size={20} className="text-white" />
                          </div>
                          <label className="block text-gray-900 font-bold text-xl">
                            Edit Ingredients
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 ml-11">Add, remove, or modify ingredients for this recipe</p>
                      </div>
                      <button
                        onClick={handleAddEditIngredient}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Plus size={20} />
                        Add Ingredient
                      </button>
                    </div>

                    <div className="space-y-4">
                      {editableIngredients.map((ingredient, index) => (
                        <div key={index} className="bg-white border-2 border-gray-300 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
                          <div className="flex gap-4 items-start">
                            {/* Number Badge */}
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
                              {index + 1}
                            </div>
                            
                            {/* Ingredient Selection */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen size={16} className="text-gray-500" />
                                <label className="text-xs text-gray-600 font-bold uppercase">Ingredient Name</label>
                              </div>
                              <select
                                value={ingredient.ingredientId}
                                onChange={(e) => handleEditIngredientChange(index, 'ingredientId', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-400"
                              >
                                <option value="">-- Select ingredient --</option>
                                {ingredients.map((ing) => (
                                  <option key={ing.ingredientId} value={ing.ingredientId}>
                                    {ing.name} ({ing.unit})
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Quantity Input */}
                            <div className="w-48">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="text-gray-500">📊</div>
                                <label className="text-xs text-gray-600 font-bold uppercase">Quantity</label>
                              </div>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={ingredient.quantityRequired}
                                onChange={(e) => handleEditIngredientChange(index, 'quantityRequired', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center font-bold text-lg hover:border-gray-400"
                              />
                            </div>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => handleRemoveEditIngredient(index)}
                              className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 mt-7"
                              title="Remove ingredient"
                            >
                              <Trash2 size={22} />
                            </button>
                          </div>
                          {ingredient.unit && (
                            <div className="mt-3 ml-16 flex items-center gap-2">
                              <span className="text-sm text-gray-500">Unit:</span>
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">{ingredient.unit}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {editableIngredients.length === 0 && (
                      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                        <BookOpen size={56} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 font-bold text-lg">No ingredients added yet</p>
                        <p className="text-gray-500 text-sm mt-2">Click "Add Ingredient" button to start adding ingredients</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex justify-between items-center gap-3 border-t-2 border-gray-200">
                <div className="text-sm text-gray-600">
                  {!isEditMode ? (
                    <span className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span><strong>{selectedRecipe.ingredients.length}</strong> ingredients in this recipe</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span><strong>{editableIngredients.length}</strong> ingredients</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {!isEditMode ? (
                    <button
                      onClick={handleEnterEditMode}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Update Ingredients
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveUpdatedRecipe}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Recipe Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden animate-fadeIn">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <BookOpen size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Add New Recipe</h2>
                      <p className="text-orange-100 text-sm mt-1">Create a recipe for your menu item</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedMenuItem('');
                      setRecipeIngredients([{ ingredientId: '', quantityRequired: '' }]);
                    }}
                    className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 overflow-y-auto max-h-[calc(95vh-220px)]">
                {/* Menu Item Selection */}
                <div className="mb-8 bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border-2 border-orange-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-orange-500 p-2 rounded-lg">
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <label className="block text-gray-900 font-bold text-lg">
                      Select Menu Item *
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Choose the dish you want to create a recipe for</p>
                  <select
                    value={selectedMenuItem}
                    onChange={(e) => setSelectedMenuItem(e.target.value)}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white shadow-sm hover:border-orange-300"
                  >
                    <option value="">-- Select a menu item --</option>
                    {menuItems.map((item) => (
                      <option key={item.itemId} value={item.itemId}>
                        {item.name} ({item.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ingredients Section */}
                <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border-2 border-green-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <Plus size={20} className="text-white" />
                        </div>
                        <label className="block text-gray-900 font-bold text-lg">
                          Ingredients *
                        </label>
                        {ingredients.length > 0 && (
                          <span className="text-sm text-gray-500">({ingredients.length} available)</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Add all ingredients needed for this recipe</p>
                    </div>
                    <button
                      onClick={handleAddIngredientRow}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Plus size={20} />
                      Add More
                    </button>
                  </div>

                  {ingredients.length === 0 && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl mb-4 flex items-center gap-3">
                      <BookOpen size={24} className="flex-shrink-0" />
                      <div>
                        <p className="font-semibold">No ingredients found</p>
                        <p className="text-sm">Please add ingredients in the Inventory section first.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 mt-4">
                    {recipeIngredients.map((ingredient, index) => (
                      <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all duration-200">
                        <div className="flex gap-4 items-start">
                          {/* Number Badge */}
                          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
                            {index + 1}
                          </div>
                          
                          {/* Ingredient Selection */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen size={16} className="text-gray-500" />
                              <label className="text-xs text-gray-600 font-bold uppercase">Ingredient Name</label>
                            </div>
                            <select
                              value={ingredient.ingredientId}
                              onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-400"
                            >
                              <option value="">-- Select ingredient --</option>
                              {ingredients.map((ing) => (
                                <option key={ing.ingredientId} value={ing.ingredientId}>
                                  {ing.name} ({ing.unit})
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Quantity Input */}
                          <div className="w-48">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-gray-500">📊</div>
                              <label className="text-xs text-gray-600 font-bold uppercase">Quantity Required</label>
                            </div>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Enter amount"
                              value={ingredient.quantityRequired}
                              onChange={(e) => handleIngredientChange(index, 'quantityRequired', e.target.value)}
                              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-center font-semibold hover:border-gray-400"
                            />
                          </div>
                          
                          {/* Delete Button */}
                          {recipeIngredients.length > 1 && (
                            <button
                              onClick={() => handleRemoveIngredientRow(index)}
                              className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 mt-7"
                              title="Remove ingredient"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex justify-between items-center gap-3 border-t-2 border-gray-200">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <BookOpen size={18} />
                  <span><strong>{recipeIngredients.filter(i => i.ingredientId && i.quantityRequired).length}</strong> of <strong>{recipeIngredients.length}</strong> ingredients ready</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedMenuItem('');
                      setRecipeIngredients([{ ingredientId: '', quantityRequired: '' }]);
                    }}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRecipe}
                    className="px-10 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <BookOpen size={20} />
                    Create Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Recipes;
