import React, { useEffect, useState } from "react";
import Sidebar from './Sidebar';
import { ingredientService } from '../services/api';
import { Search, Filter, Plus, X, Package, AlertCircle, TrendingUp, Droplet } from 'lucide-react';

const Inventory = () => {
    const [formError, setFormError] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState('add'); // 'add' or 'update'
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    ingredientType: '',
    unit: '',
    currentQuantity: '',
    maxQuantity: '',
    thresholdQuantity: '',
    isActive: true
  });

  // Helper function to format numbers to max 2 decimal places
  const formatQuantity = (value) => {
    if (value === null || value === undefined || value === '') return '0';
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    // Round to 2 decimal places and remove trailing zeros
    return Number(num.toFixed(2)).toString();
  };

  // Get unique ingredient types for filter buttons, sorted alphabetically, 'Other' last
  let ingredientTypes = Array.from(new Set(ingredients.map(i => i.ingredientType))).filter(Boolean);
  ingredientTypes = ingredientTypes.sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  useEffect(() => {
    ingredientService.getAllIngredients()
      .then(data => {
        setIngredients(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load ingredients');
        setLoading(false);
      });
  }, []);

  // Stock status logic based on threshold
  const getStockStatus = (ingredient) => {
    const isLowStock = ingredient.currentQuantity < ingredient.thresholdQuantity;
    if (isLowStock) {
      return { label: 'Low Stock', color: 'bg-red-100 text-red-700', bar: 'bg-red-500' };
    }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700', bar: 'bg-green-500' };
  };

  // Summary stats using threshold-based logic
  const totalItems = ingredients.length;
  const lowStock = ingredients.filter(i => i.currentQuantity < i.thresholdQuantity).length;
  const inStock = ingredients.filter(i => i.currentQuantity >= i.thresholdQuantity).length;

  const handleOpenModal = (tab = 'add', ingredient = null) => {
    setModalTab(tab);
    setSelectedIngredient(ingredient);
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        ingredientType: ingredient.ingredientType,
        unit: ingredient.unit,
        currentQuantity: ingredient.currentQuantity,
        maxQuantity: ingredient.maxQuantity || '',
        thresholdQuantity: ingredient.thresholdQuantity,
        isActive: ingredient.isActive
      });
      setFormError('');
    } else {
      setFormData({
        name: '',
        ingredientType: '',
        unit: '',
        currentQuantity: '',
        maxQuantity: '',
        thresholdQuantity: '',
        isActive: true
      });
      setFormError('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIngredient(null);
    setFormData({
      name: '',
      ingredientType: '',
      unit: '',
      currentQuantity: '',
      maxQuantity: '',
      thresholdQuantity: '',
      isActive: true
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Normalize ingredientType
      const normalizedType = formData.ingredientType
        ? formData.ingredientType.charAt(0).toUpperCase() + formData.ingredientType.slice(1).toLowerCase()
        : '';

      // Normalize ingredient name: each word capitalized, rest lowercase
      const normalizedName = formData.name
        .split(' ')
        .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
        .join(' ');

      if (modalTab === 'add') {
        const maxQ = formData.maxQuantity !== '' && !isNaN(formData.maxQuantity)
          ? Number(formData.maxQuantity)
          : 0;
        const currentQ = formData.currentQuantity !== '' && !isNaN(formData.currentQuantity)
          ? Number(formData.currentQuantity)
          : 0;
        if (currentQ > maxQ) {
          setFormError('Current quantity cannot exceed max quantity.');
          return;
        } else {
          setFormError('');
        }
        await ingredientService.createIngredient({ ...formData, name: normalizedName, ingredientType: normalizedType });
      } else {
        // Only update the field if the user entered a value
        const maxQ = formData.maxQuantity !== '' && !isNaN(formData.maxQuantity)
          ? Number(formData.maxQuantity)
          : selectedIngredient.maxQuantity;
        const addQ = formData.currentQuantity !== '' && !isNaN(formData.currentQuantity)
          ? Number(formData.currentQuantity)
          : 0;
        const newCurrent = formData.currentQuantity !== '' && !isNaN(formData.currentQuantity)
          ? Number(selectedIngredient.currentQuantity) + Number(formData.currentQuantity)
          : selectedIngredient.currentQuantity;
        if (addQ > maxQ) {
          setFormError('Add to Current Quantity cannot be more than Update Max Quantity.');
          return;
        } else if (newCurrent > maxQ) {
          setFormError('Resulting current quantity cannot exceed max quantity.');
          return;
        } else {
          setFormError('');
        }
        const updatedData = {
          ...formData,
          ingredientType: normalizedType,
          currentQuantity: newCurrent,
          thresholdQuantity:
            formData.thresholdQuantity !== '' && !isNaN(formData.thresholdQuantity) && Number(formData.thresholdQuantity) > 0
              ? Number(formData.thresholdQuantity)
              : selectedIngredient.thresholdQuantity,
          maxQuantity: maxQ,
        };
        // If the user left the field blank, don't send it in the update
        if (formData.currentQuantity === '' || isNaN(formData.currentQuantity)) {
          delete updatedData.currentQuantity;
        }
        if (formData.thresholdQuantity === '' || isNaN(formData.thresholdQuantity)) {
          delete updatedData.thresholdQuantity;
        }
        if (formData.maxQuantity === '' || isNaN(formData.maxQuantity)) {
          delete updatedData.maxQuantity;
        }
        await ingredientService.updateIngredient(selectedIngredient.ingredientId, updatedData);
      }
      // Refresh ingredients
      const data = await ingredientService.getAllIngredients();
      setIngredients(data);
      setFormData(formData => ({
        ...formData,
        currentQuantity: '',
        maxQuantity: '',
        thresholdQuantity: ''
      }));
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save ingredient', err);
      setFormError('Failed to save ingredient');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f9f7f4]">
      <Sidebar activeTab="inventory" />
      <main className="flex-1 px-10 py-8 ml-72 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#23190f] mb-1">Inventory</h1>
            <p className="text-gray-500">Manage your kitchen stock and supplies.</p>
          </div>
          <button
            onClick={() => handleOpenModal('add')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Ingredients
          </button>
        </div>
        {/* Search and filter bar styled as in the image */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center flex-1 bg-white rounded-2xl border border-gray-200 px-4 py-2 focus-within:ring-2 focus-within:ring-orange-200">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              className="flex-1 bg-transparent outline-none text-gray-600 placeholder-gray-400 text-base"
              placeholder="Search items..."
              style={{ minWidth: 0 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-white rounded-2xl p-2 flex items-center justify-center border border-gray-200">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
          <button
            className={`px-6 py-2 rounded-2xl font-semibold shadow transition-all ${filter === 'All' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
            onClick={() => setFilter('All')}
            style={{marginTop: 8, marginBottom: 8}}
          >All</button>
          {ingredientTypes.map(type => (
            <button
              key={type}
              className={`px-6 py-2 rounded-2xl shadow ${filter === type ? 'bg-orange-500 text-white font-semibold' : 'bg-white text-gray-600'}`}
              onClick={() => setFilter(type)}
              style={{marginTop: 8, marginBottom: 8}}
            >{type}</button>
          ))}
        </div>
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-xl font-bold mb-1">{totalItems}</div>
            <div className="text-xs text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-xl font-bold mb-1" style={{ color: '#16a34a' }}>{inStock}</div>
            <div className="text-xs text-gray-600">In Stock</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-xl font-bold mb-1" style={{ color: '#dc2626' }}>{lowStock}</div>
            <div className="text-xs text-gray-600">Low Stock</div>
          </div>
        </div>
        {/* Inventory Cards */}
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          (() => {
            // Sort by category (ingredientType) alphabetically, then by name
            const filtered = ingredients.filter(ingredient =>
              (filter === 'All' || ingredient.ingredientType === filter) &&
              (search.trim() === '' || ingredient.name.toLowerCase().includes(search.trim().toLowerCase()))
            );
            const sorted = filtered.slice().sort((a, b) => {
              const typeA = (a.ingredientType || 'Other').toLowerCase();
              const typeB = (b.ingredientType || 'Other').toLowerCase();
              if (typeA < typeB) return -1;
              if (typeA > typeB) return 1;
              return a.name.localeCompare(b.name);
            });
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map(ingredient => {
                  const status = getStockStatus(ingredient);
                  const percent = ingredient.maxQuantity && !isNaN(ingredient.maxQuantity)
                    ? Math.min(100, Math.round((ingredient.currentQuantity / ingredient.maxQuantity) * 100))
                    : 0;
                  return (
                    <div key={ingredient.ingredientId} className="bg-white rounded-xl p-6 shadow">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs text-gray-500 font-bold">{ingredient.ingredientType?.toUpperCase()}</div>
                        <span className={`${status.color} text-xs px-2 py-1 rounded-full`}>{status.label}</span>
                      </div>
                      <div className="font-bold text-lg mb-1">{ingredient.name}</div>
                      <div className="text-2xl font-bold mb-1">{formatQuantity(ingredient.currentQuantity)} <span className="text-sm font-normal">{ingredient.unit}</span></div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-gray-500">Stock Level</div>
                        <div className="text-xs text-gray-500 font-semibold">{percent}%</div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className={`h-2 ${status.bar} rounded-full`} style={{width: `${percent}%`}}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}

        {/* Modal for Add/Update Ingredients */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-4 transform transition-all animate-in">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {modalTab === 'add' ? 'Add New Ingredient' : 'Update Ingredient'}
                    </h2>
                  </div>
                  <button 
                    onClick={handleCloseModal} 
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-3 mt-5">
                  <button
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                      modalTab === 'add' 
                        ? 'bg-white text-orange-600 shadow-lg' 
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    }`}
                    onClick={() => setModalTab('add')}
                  >
                    Add New
                  </button>
                  <button
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                      modalTab === 'update' 
                        ? 'bg-white text-orange-600 shadow-lg' 
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    }`}
                    onClick={() => setModalTab('update')}
                  >
                    Update Existing
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {modalTab === 'update' && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                    <label className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      Select Ingredient to Update
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-medium text-gray-700 shadow-sm"
                      value={selectedIngredient ? selectedIngredient.ingredientId : ''}
                      onChange={(e) => {
                        const ingredient = ingredients.find(i => i.ingredientId === parseInt(e.target.value));
                        if (ingredient) {
                          setSelectedIngredient(ingredient);
                          setFormData({
                            name: ingredient.name,
                            ingredientType: ingredient.ingredientType,
                            unit: ingredient.unit,
                            currentQuantity: '',
                            thresholdQuantity: '',
                            isActive: ingredient.isActive
                          });
                        } else {
                          setSelectedIngredient(null);
                          setFormData({
                            name: '',
                            ingredientType: '',
                            unit: '',
                            currentQuantity: '',
                            thresholdQuantity: '',
                            isActive: true
                          });
                        }
                      }}
                    >
                      <option value="">-- Select an ingredient --</option>
                      {ingredients.map(ing => (
                        <option key={ing.ingredientId} value={ing.ingredientId}>{ing.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Show error for update tab */}
                  {modalTab === 'update' && formError && (
                    <div className="md:col-span-2 text-red-600 font-semibold mb-2">{formError}</div>
                  )}
                  {/* Show error for add tab */}
                  {modalTab === 'add' && formError && (
                    <div className="md:col-span-2 text-red-600 font-semibold mb-2">{formError}</div>
                  )}
                  {modalTab === 'add' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <Package className="w-4 h-4 text-orange-600" />
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-orange-300"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g., Tomatoes"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <Filter className="w-4 h-4 text-orange-600" />
                          Ingredient Type
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-orange-300"
                          value={formData.ingredientType}
                          onChange={(e) => setFormData({...formData, ingredientType: e.target.value})}
                          placeholder="e.g., Vegetable"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-orange-600" />
                          Unit
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-orange-300"
                          value={formData.unit}
                          onChange={(e) => setFormData({...formData, unit: e.target.value})}
                          placeholder="e.g., kg, liters"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-600" />
                          Max Quantity
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-orange-300"
                          value={formData.maxQuantity}
                          onChange={(e) => setFormData({...formData, maxQuantity: e.target.value})}
                          placeholder="e.g., 10000"
                          required
                        />
                      </div>
                    </>
                  )}
                  {modalTab === 'update' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        Update Max Quantity
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-orange-300"
                          value={formData.maxQuantity}
                          onChange={(e) => setFormData({...formData, maxQuantity: e.target.value})}
                          placeholder={selectedIngredient ? `Current: ${formatQuantity(selectedIngredient.maxQuantity)}` : 'Enter max quantity'}
                        />
                        {selectedIngredient && (
                          <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Current max: {formatQuantity(selectedIngredient.maxQuantity)} {selectedIngredient.unit}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      {modalTab === 'update' ? 'Add to Current Quantity' : 'Current Quantity'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-orange-300"
                        value={formData.currentQuantity}
                        onChange={(e) => setFormData({...formData, currentQuantity: e.target.value})}
                        required
                        placeholder={modalTab === 'update' && selectedIngredient ? `Current: ${formatQuantity(selectedIngredient.currentQuantity)}` : 'Enter quantity'}
                      />
                      {modalTab === 'update' && selectedIngredient && (
                        <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Current stock: {formatQuantity(selectedIngredient.currentQuantity)} {selectedIngredient.unit}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      {modalTab === 'update' ? 'Update Threshold Quantity' : 'Threshold Quantity'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-orange-300"
                        value={formData.thresholdQuantity}
                        onChange={(e) => setFormData({...formData, thresholdQuantity: e.target.value})}
                        required
                        placeholder={modalTab === 'update' && selectedIngredient ? `Current: ${formatQuantity(selectedIngredient.thresholdQuantity)}` : 'Min stock level'}
                      />
                      {modalTab === 'update' && selectedIngredient && (
                        <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Current threshold: {formatQuantity(selectedIngredient.thresholdQuantity)} {selectedIngredient.unit}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="w-6 h-6 text-orange-500 focus:ring-orange-500 border-2 border-gray-300 rounded-lg cursor-pointer"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">Is Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all shadow-sm hover:shadow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    {modalTab === 'add' ? '✓ Add Ingredient' : '✓ Update Ingredient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Inventory;
