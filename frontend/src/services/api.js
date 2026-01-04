import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Unified user authentication
  login: async (data) => {
    const response = await api.post('/user/auth/login', data);
    return response.data;
  },

  signup: async (data) => {
    const response = await api.post('/user/auth/signup', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },
};

export const restaurantService = {
  getAllRestaurants: async () => {
    const response = await api.get('/restaurants');
    return response.data;
  },

  getOpenRestaurants: async () => {
    const response = await api.get('/restaurants/open');
    return response.data;
  },

  getRestaurantsByCuisine: async (cuisineType) => {
    const response = await api.get(`/restaurants/cuisine/${cuisineType}`);
    return response.data;
  },

  searchRestaurants: async (name) => {
    const response = await api.get(`/restaurants/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  // Restaurant owner management
  getMyRestaurant: async (ownerEmail) => {
    try {
      const response = await api.get(`/restaurant-owner/restaurant?ownerEmail=${encodeURIComponent(ownerEmail)}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 204) {
        return null; // No restaurant found
      }
      throw error;
    }
  },

  createRestaurant: async (restaurantData, ownerEmail) => {
    const response = await api.post(`/restaurant-owner/restaurant?ownerEmail=${encodeURIComponent(ownerEmail)}`, restaurantData);
    return response.data;
  },

  updateRestaurant: async (restaurantData, ownerEmail) => {
    const response = await api.put(`/restaurant-owner/restaurant?ownerEmail=${encodeURIComponent(ownerEmail)}`, restaurantData);
    return response.data;
  },
};

export default api;