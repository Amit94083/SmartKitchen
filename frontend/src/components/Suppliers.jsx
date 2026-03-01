import React, { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import { User, Phone, X, Plus, Edit } from 'lucide-react';
import { userService, supplierCategoryService, ingredientService } from '../services/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allAssignedCategories, setAllAssignedCategories] = useState([]); // Track all assignments
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');  const [updatedPhone, setUpdatedPhone] = useState('');  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    addressApartment: '',
    addressFull: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Available item categories - fetched from ingredients
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch suppliers from backend
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch ingredient types as categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await userService.getSuppliers();
      setSuppliers(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('Failed to load suppliers. Please try again.');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const types = await ingredientService.getIngredientTypes();
      setAvailableCategories(types);
    } catch (error) {
      console.error('Error fetching ingredient types:', error);
      // Fallback to empty array if fetch fails
      setAvailableCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      // Set constant address label for suppliers
      const supplierData = {
        ...formData,
        addressLabel: 'Supplier Address'
      };
      await userService.createSupplier(supplierData);
      // Refresh suppliers list
      await fetchSuppliers();
      // Close modal and reset form
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        addressApartment: '',
        addressFull: ''
      });
    } catch (error) {
      console.error('Error adding supplier:', error);
      setFormError(error.response?.data?.message || 'Failed to add supplier. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setFormError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      addressApartment: '',
      addressFull: ''
    });
  };

  const handleUpdateClick = async (supplier) => {
    setSelectedSupplier(supplier);
    setUpdatedPhone(supplier.phone || '');
    setShowUpdateModal(true);
    setUpdateError('');
    
    try {
      // Fetch all assigned categories to check which ones are taken
      const allAssignments = await supplierCategoryService.getAllSupplierCategories();
      setAllAssignedCategories(allAssignments);
      
      // Fetch current categories for this supplier
      const categories = await supplierCategoryService.getSupplierCategories(supplier.id);
      setSelectedCategories(categories.map(cat => cat.categoryName));
    } catch (error) {
      console.error('Error fetching supplier categories:', error);
      setSelectedCategories([]);
      setAllAssignedCategories([]);
    }
  };

  const handleCategoryToggle = (categoryName) => {
    // Check if category is assigned to another supplier
    const assignment = allAssignedCategories.find(a => a.categoryName === categoryName);
    if (assignment && assignment.userId !== selectedSupplier.id) {
      // Category is assigned to another supplier, cannot toggle
      return;
    }
    
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(cat => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const handleUpdateCategories = async () => {
    if (!selectedSupplier) return;
    
    setUpdateLoading(true);
    setUpdateError('');

    try {
      // Update phone number if changed
      if (updatedPhone !== selectedSupplier.phone) {
        await userService.updateUserPhone(selectedSupplier.id, updatedPhone);
      }
      
      // Update categories
      await supplierCategoryService.updateSupplierCategories(selectedSupplier.id, selectedCategories);
      
      setShowUpdateModal(false);
      setSelectedSupplier(null);
      setSelectedCategories([]);
      setUpdatedPhone('');
      // Refresh suppliers list to show updated data
      await fetchSuppliers();
    } catch (error) {
      console.error('Error updating supplier:', error);
      setUpdateError(error.response?.data?.message || 'Failed to update supplier. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedSupplier(null);
    setSelectedCategories([]);
    setAllAssignedCategories([]);
    setUpdatedPhone('');
    setUpdateError('');
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="suppliers" />
      <main className="flex-1 px-10 py-8 ml-72 overflow-y-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Suppliers</h1>
            <p className="text-gray-500">Your trusted supplier contacts.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add New Supplier
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading suppliers...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-3xl">
            <p className="text-red-600 mb-2">{error}</p>
            <button 
              onClick={fetchSuppliers}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-12 max-w-3xl">
            <p className="text-gray-500 text-lg mb-2">No suppliers found</p>
            <p className="text-gray-400">Click "Add New Supplier" to get started</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {suppliers.map((supplier) => (
              <div 
                key={supplier.id} 
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.email}</p>
                      {supplier.addressFull && (
                        <p className="text-xs text-gray-400 mt-1">{supplier.addressFull}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <span className="text-base font-medium">{supplier.phone || 'N/A'}</span>
                    </div>
                    <button
                      onClick={() => handleUpdateClick(supplier)}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Add New Supplier</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <form onSubmit={handleAddSupplier} className="p-6">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter supplier name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="supplier@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="1234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Address Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment/Unit
                      </label>
                      <input
                        type="text"
                        name="addressApartment"
                        value={formData.addressApartment}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Apt, Suite, Unit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address
                      </label>
                      <textarea
                        name="addressFull"
                        value={formData.addressFull}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Street address, City, State, ZIP"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formLoading}
                >
                  {formLoading ? 'Adding...' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Supplier Categories Modal */}
      {showUpdateModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Update Supplier Categories</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedSupplier.name}</p>
              </div>
              <button
                onClick={closeUpdateModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {updateError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {updateError}
                </div>
              )}

              {/* Phone Number Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={updatedPhone}
                  onChange={(e) => setUpdatedPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Country code (91) will be added automatically for suppliers
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Select Categories</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Choose the item categories that this supplier provides
                </p>
                <p className="text-xs text-gray-400">
                  Note: Each category can only be assigned to one supplier at a time
                </p>
              </div>

              {/* Category Selection Grid */}
              {categoriesLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading categories...
                </div>
              ) : availableCategories.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No ingredient types available. Add ingredients first.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableCategories.map((category) => {
                  const assignment = allAssignedCategories.find(a => a.categoryName === category);
                  const isAssignedToOther = assignment && assignment.userId !== selectedSupplier.id;
                  const isAssignedToThis = selectedCategories.includes(category);
                  const assignedSupplier = isAssignedToOther 
                    ? suppliers.find(s => s.id === assignment.userId)
                    : null;
                  
                  return (
                    <label
                      key={category}
                      className={`flex flex-col gap-2 p-4 border-2 rounded-lg transition-all ${
                        isAssignedToThis
                          ? 'border-orange-500 bg-orange-50 cursor-pointer'
                          : isAssignedToOther
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          : 'border-gray-200 hover:border-gray-300 bg-white cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isAssignedToThis}
                          onChange={() => handleCategoryToggle(category)}
                          disabled={isAssignedToOther}
                          className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className={`font-medium ${
                          isAssignedToThis
                            ? 'text-orange-700'
                            : isAssignedToOther
                            ? 'text-gray-400'
                            : 'text-gray-700'
                        }`}>
                          {category}
                        </span>
                      </div>
                      {isAssignedToOther && assignedSupplier && (
                        <span className="text-xs text-gray-500 ml-8">
                          Assigned to: {assignedSupplier.name}
                        </span>
                      )}
                    </label>
                  );
                })}
                </div>
              )}

              {/* Selected Categories Summary */}
              {selectedCategories.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Selected Categories ({selectedCategories.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateCategories}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Updating...' : 'Update Categories'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
