import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantService } from '../services/api';
import RestaurantForm from './RestaurantForm';

const Dashboard = () => {
  const { owner, logout } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      if (owner?.email) {
        const restaurantData = await restaurantService.getMyRestaurant(owner.email);
        setRestaurant(restaurantData);
      }
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSubmit = async (restaurantData) => {
    try {
      setSaving(true);
      let updatedRestaurant;

      if (!owner?.email) {
        throw new Error('Owner email not found');
      }

      if (restaurant) {
        updatedRestaurant = await restaurantService.updateRestaurant(restaurantData, owner.email);
        setMessage({ type: 'success', text: 'Restaurant details updated successfully!' });
      } else {
        updatedRestaurant = await restaurantService.createRestaurant(restaurantData, owner.email);
        setMessage({ type: 'success', text: 'Restaurant details added successfully!' });
      }

      setRestaurant(updatedRestaurant);
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error('Failed to save restaurant:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save restaurant details. Please try again.' 
      });
      throw error; 
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Smart Kitchen Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {owner?.ownerName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Message Banner */}
      {message && (
        <div className={`${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        } border-l-4 p-4`}>
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">{message.text}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('restaurant')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'restaurant'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Restaurant Details
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Smart Kitchen!
                </h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Owner Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Owner Information</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Owner Name:</span> {owner?.ownerName}</p>
                        <p><span className="font-medium">Email:</span> {owner?.email}</p>
                        {owner?.phone && (
                          <p><span className="font-medium">Phone:</span> {owner.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Restaurant Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Restaurant Information</h3>
                      {restaurant ? (
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><span className="font-medium">Name:</span> {restaurant.name}</p>
                          <p><span className="font-medium">Cuisine:</span> {restaurant.cuisineType || 'Not specified'}</p>
                          <p><span className="font-medium">Address:</span> {restaurant.address || 'Not specified'}</p>
                          <p><span className="font-medium">Phone:</span> {restaurant.phone || 'Not specified'}</p>
                          <p>
                            <span className="font-medium">Status:</span> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {restaurant.isOpen ? 'Open' : 'Closed'}
                            </span>
                          </p>
                          <p><span className="font-medium">Rating:</span> {restaurant.rating || 0} ⭐</p>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <p>No restaurant details found.</p>
                          <button
                            onClick={() => setActiveTab('restaurant')}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Add your restaurant details →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                {restaurant && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{restaurant.rating || 0}</p>
                        <p className="text-sm text-gray-600">Rating</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {restaurant.isOpen ? 'Open' : 'Closed'}
                        </p>
                        <p className="text-sm text-gray-600">Status</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-600">0</p>
                        <p className="text-sm text-gray-600">Orders Today</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-600">0</p>
                        <p className="text-sm text-gray-600">Total Reviews</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'restaurant' && (
            <RestaurantForm
              restaurant={restaurant || undefined}
              onSubmit={handleRestaurantSubmit}
              isLoading={saving}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;