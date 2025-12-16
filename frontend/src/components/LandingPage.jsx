import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Smart Kitchen
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover amazing restaurants or manage your restaurant with ease
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Customer Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🍽️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">I'm a Customer</h3>
                  <p className="text-gray-500">Explore and discover restaurants</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-gray-600 text-sm">
                  Browse restaurants, check menus, read reviews, and find your next favorite dining spot.
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <Link
                  to="/customer/login"
                  className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 inline-block text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/customer/signup"
                  className="w-full bg-white border border-blue-300 rounded-md py-2 px-4 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 inline-block text-center"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          {/* Restaurant Owner Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">👨‍🍳</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">I'm a Restaurant Owner</h3>
                  <p className="text-gray-500">Manage your restaurant</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-gray-600 text-sm">
                  Manage your restaurant profile, update menus, track orders, and grow your business.
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <Link
                  to="/login"
                  className="w-full bg-green-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 inline-block text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="w-full bg-white border border-green-300 rounded-md py-2 px-4 text-sm font-medium text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 inline-block text-center"
                >
                  Register Restaurant
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Smart Kitchen?</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Discovery</h3>
              <p className="text-gray-600 text-sm">Find restaurants by cuisine, location, or rating with our smart search.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">Read genuine reviews and ratings from verified customers.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">User Friendly</h3>
              <p className="text-gray-600 text-sm">Intuitive interface designed for both customers and restaurant owners.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;