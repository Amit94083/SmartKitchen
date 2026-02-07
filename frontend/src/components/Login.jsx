import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ChefHat } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('RESTAURANT_OWNER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ 
        email, 
        password, 
        userType
      });
      login(response.token, response.user);
      
      // Redirect based on user type
      if (response.user.userType === 'DELIVERY_PARTNER') {
        navigate(`/delivery-partner/home/${response.user.id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl px-10 py-12 border border-gray-100">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 shadow-lg transform hover:scale-105 transition-transform">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Smart Kitchen</h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">Sign in to your account</p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* User Type Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" />
                  Account Type
                </label>
                <select
                  id="user-type"
                  name="user-type"
                  className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 font-medium transition-all hover:border-orange-300 shadow-sm"
                  value={userType}
                  onChange={e => setUserType(e.target.value)}
                >
                  <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="DELIVERY_PARTNER">Delivery Partner</option>
                </select>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-600" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    className="block w-full rounded-xl border-2 border-gray-200 pl-11 pr-4 py-3.5 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 transition-all hover:border-orange-300 shadow-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-xl border-2 border-gray-200 pl-11 pr-4 py-3.5 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 transition-all hover:border-orange-300 shadow-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-center font-medium shadow-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5" />
                  Sign in
                </>
              )}
            </button>

            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-orange-600 hover:text-orange-500 hover:underline transition-all"
                >
                  Sign up here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;