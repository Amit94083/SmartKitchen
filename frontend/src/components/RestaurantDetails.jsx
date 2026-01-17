import React, { useState, useEffect } from "react";
import { restaurantService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { MapPin, Phone, Image, Star, Calendar, Clock, Edit2, Save, X } from 'lucide-react';


const RestaurantDetails = () => {
  const { user } = useAuth();
  // Sidebar handles navigation
  const [restaurant, setRestaurant] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    imageUrl: '',
    cuisine: '',
    isOpen: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user?.email) {
          const data = await restaurantService.getMyRestaurant(user.email);
          if (data) {
            setRestaurant(data);
            setForm({
              name: data.name || '',
              description: data.description || '',
              address: data.address || '',
              phone: data.phone || '',
              imageUrl: data.imageUrl || '',
              cuisine: data.cuisine || '',
              isOpen: data.isOpen !== undefined ? data.isOpen : true,
            });
          } else {
            setRestaurant(null);
            setForm({ name: '', description: '', address: '', phone: '', imageUrl: '', cuisine: '', isOpen: true });
          }
        }
      } catch (err) {
        setError('Failed to load restaurant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      if (restaurant) {
        // Update existing
        const updated = await restaurantService.updateRestaurant(form, user.email);
        setRestaurant(updated);
      } else {
        // Create new
        const created = await restaurantService.createRestaurant(form, user.email);
        setRestaurant(created);
      }
      setEdit(false);
    } catch (err) {
      setError('Failed to save restaurant details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="restaurant-details" />
      <main className="flex-1 px-10 py-8">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Restaurant Details</h1>
            <p className="text-gray-500">Manage your restaurant profile and info</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {edit ? (
              <div>
                {/* Edit Mode */}
                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <input 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input 
                        name="phone" 
                        value={form.phone} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea 
                      name="description" 
                      value={form.description} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input 
                      name="address" 
                      value={form.address} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                    <input 
                      name="imageUrl" 
                      value={form.imageUrl} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="isOpen" 
                      checked={form.isOpen} 
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="text-sm font-semibold text-gray-700">Is Active</label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button" 
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-colors"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button 
                      type="button" 
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold border border-gray-300 transition-colors"
                      onClick={() => setEdit(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                {/* View Mode */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Name:</div>
                      <div className="text-base text-gray-900">{restaurant?.name || '-'}</div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Image URL:</div>
                      <div className="text-sm text-gray-700">{restaurant?.imageUrl || '-'}</div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-sm font-semibold text-gray-600 mb-1">Description:</div>
                      <div className="text-base text-gray-900">{restaurant?.description || '-'}</div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Address:</div>
                      <div className="text-base text-gray-900">{restaurant?.address || '-'}</div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Phone:</div>
                      <div className="text-base text-gray-900">{restaurant?.phone || '-'}</div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Open:</div>
                      <div className="text-base text-gray-900">{restaurant?.isOpen ? 'Yes' : 'No'}</div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Rating:</div>
                      <div className="text-base text-gray-900">{restaurant?.rating || 0}</div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-sm font-semibold text-gray-600 mb-1">Created At:</div>
                      <div className="text-base text-gray-900">{restaurant?.createdAt ? new Date(restaurant.createdAt).toLocaleString() : '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-colors"
                    onClick={() => setEdit(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetails;
