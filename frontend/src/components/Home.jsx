import React, { useState, useEffect } from 'react';
import { restaurantService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { customer, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reusable App Header */}
      <AppHeader />
      {/* Orange Gradient Background (match restaurant/hero style) */}
      <div className="w-full h-20 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mt-[80px]" />

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available Restaurants
        </h2>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6 flex flex-col h-full">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {restaurant.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        restaurant.isOpen
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Description */}
                  {restaurant.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {restaurant.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-1 text-sm text-gray-500 flex-1">
                    {restaurant.cuisineType && (
                      <p>
                        <span className="font-medium">Cuisine:</span>{' '}
                        {restaurant.cuisineType}
                      </p>
                    )}
                    {restaurant.address && (
                      <p>
                        <span className="font-medium">Address:</span>{' '}
                        {restaurant.address}
                      </p>
                    )}
                    {restaurant.phone && (
                      <p>
                        <span className="font-medium">Phone:</span>{' '}
                        {restaurant.phone}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-gray-600">
                          {restaurant.rating || 0}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        By {restaurant.ownerName}
                      </span>
                    </div>
                  </div>

                  {/* View Menu Button */}
                  <button
                    onClick={() =>
                      navigate(`/restaurant/${restaurant.id}`)
                    }
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600
                               text-white font-medium py-2 rounded-md
                               transition-colors"
                  >
                    View Menu
                  </button>

                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No restaurants available
              </p>
              <p className="text-gray-400">
                Check back later for more options
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
