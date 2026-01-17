import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f7f4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-orange-500">🍽️</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#23190f]">Smart Kitchen</h2>
            <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <select
                id="user-type"
                name="user-type"
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-gray-50"
                value={userType}
                onChange={e => setUserType(e.target.value)}
              >
                <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                <option value="CUSTOMER">User</option>
              </select>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-gray-50"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-gray-50"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-orange-600 hover:text-orange-500"
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