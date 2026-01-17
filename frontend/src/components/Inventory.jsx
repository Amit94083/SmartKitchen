import React, { useEffect, useState } from "react";
import Sidebar from './Sidebar';
import { ingredientService } from '../services/api';
import { Search, Filter, Plus, X } from 'lucide-react';

const Inventory = () => {
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
    thresholdQuantity: '',
    isActive: true
  });

  // Get unique ingredient types for filter buttons
  const ingredientTypes = Array.from(new Set(ingredients.map(i => i.ingredientType))).filter(Boolean);

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

  // Stock status logic
  const getStockStatus = (ingredient) => {
    if (ingredient.currentQuantity <= ingredient.thresholdQuantity) return { label: 'Low Stock', color: 'bg-red-100 text-red-700', bar: 'bg-red-500' };
    if (ingredient.currentQuantity <= ingredient.thresholdQuantity * 2) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-500' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700', bar: 'bg-green-500' };
  };

  // Summary stats
  const totalItems = ingredients.length;
  const inStock = ingredients.filter(i => i.currentQuantity > i.thresholdQuantity * 2).length;
  const mediumStock = ingredients.filter(i => i.currentQuantity > i.thresholdQuantity && i.currentQuantity <= i.thresholdQuantity * 2).length;
  const lowStock = ingredients.filter(i => i.currentQuantity <= i.thresholdQuantity).length;

  const handleOpenModal = (tab = 'add', ingredient = null) => {
    setModalTab(tab);
    setSelectedIngredient(ingredient);
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        ingredientType: ingredient.ingredientType,
        unit: ingredient.unit,
        currentQuantity: ingredient.currentQuantity,
        thresholdQuantity: ingredient.thresholdQuantity,
        isActive: ingredient.isActive
      });
    } else {
      setFormData({
        name: '',
        ingredientType: '',
        unit: '',
        currentQuantity: '',
        thresholdQuantity: '',
        isActive: true
      });
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
      thresholdQuantity: '',
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalTab === 'add') {
        await ingredientService.createIngredient(formData);
      } else {
        // Only update the field if the user entered a value
        const updatedData = {
          ...formData,
          currentQuantity:
            formData.currentQuantity !== '' && !isNaN(formData.currentQuantity)
              ? Number(selectedIngredient.currentQuantity) + Number(formData.currentQuantity)
              : selectedIngredient.currentQuantity,
          thresholdQuantity:
            formData.thresholdQuantity !== '' && !isNaN(formData.thresholdQuantity) && Number(formData.thresholdQuantity) > 0
              ? Number(formData.thresholdQuantity)
              : selectedIngredient.thresholdQuantity,
        };
        // If the user left the field blank, don't send it in the update
        if (formData.currentQuantity === '' || isNaN(formData.currentQuantity)) {
          delete updatedData.currentQuantity;
        }
        if (formData.thresholdQuantity === '' || isNaN(formData.thresholdQuantity)) {
          delete updatedData.thresholdQuantity;
        }
        await ingredientService.updateIngredient(selectedIngredient.ingredientId, updatedData);
      }
      // Refresh ingredients
      const data = await ingredientService.getAllIngredients();
      setIngredients(data);
      setFormData(formData => ({
        ...formData,
        currentQuantity: '',
        thresholdQuantity: ''
      }));
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save ingredient', err);
      alert('Failed to save ingredient');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f9f7f4]">
      <Sidebar activeTab="inventory" />
      <main className="flex-1 px-10 py-8">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-xl font-bold mb-1">{totalItems}</div>
            <div className="text-xs text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-xl font-bold mb-1" style={{ color: '#16a34a' }}>{inStock}</div>
            <div className="text-xs text-gray-600">In Stock</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-xl font-bold mb-1" style={{ color: '#f97316' }}>{mediumStock}</div>
            <div className="text-xs text-gray-600">Medium Stock</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ingredients
              .filter(ingredient =>
                (filter === 'All' || ingredient.ingredientType === filter) &&
                (search.trim() === '' || ingredient.name.toLowerCase().includes(search.trim().toLowerCase()))
              )
              .map(ingredient => {
                const status = getStockStatus(ingredient);
                const percent = Math.min(100, Math.round((ingredient.currentQuantity / (ingredient.thresholdQuantity * 2)) * 100));
                return (
                  <div key={ingredient.ingredientId} className="bg-white rounded-xl p-6 shadow">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-gray-500 font-bold">{ingredient.ingredientType?.toUpperCase()}</div>
                      <span className={`${status.color} text-xs px-2 py-1 rounded-full`}>{status.label}</span>
                    </div>
                    <div className="font-bold text-lg mb-1">{ingredient.name}</div>
                    <div className="text-2xl font-bold mb-1">{ingredient.currentQuantity} <span className="text-sm font-normal">{ingredient.unit}</span></div>
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
        )}

        {/* Modal for Add/Update Ingredients */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#23190f]">
                    {modalTab === 'add' ? 'Add New Ingredient' : 'Update Ingredient'}
                  </h2>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-4 mt-4">
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold ${modalTab === 'add' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setModalTab('add')}
                  >
                    Add New
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold ${modalTab === 'update' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setModalTab('update')}
                  >
                    Update Existing
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {modalTab === 'update' && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Ingredient</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

                <div className="grid grid-cols-2 gap-4">
                  {modalTab === 'add' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredient Type</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={formData.ingredientType}
                          onChange={(e) => setFormData({...formData, ingredientType: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={formData.unit}
                          onChange={(e) => setFormData({...formData, unit: e.target.value})}
                          required
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{modalTab === 'update' ? 'Update Current Quantity' : 'Current Quantity'}</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={formData.currentQuantity}
                      onChange={(e) => setFormData({...formData, currentQuantity: e.target.value})}
                      required
                      placeholder={modalTab === 'update' && selectedIngredient ? `${selectedIngredient.currentQuantity}` : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{modalTab === 'update' ? 'Update Threshold Quantity' : 'Threshold Quantity'}</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={formData.thresholdQuantity}
                      onChange={(e) => setFormData({...formData, thresholdQuantity: e.target.value})}
                      required
                      placeholder={modalTab === 'update' && selectedIngredient ? `${selectedIngredient.thresholdQuantity}` : ''}
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      />
                      <span className="text-sm font-semibold text-gray-700">Is Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
                  >
                    {modalTab === 'add' ? 'Add Ingredient' : 'Update Ingredient'}
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
