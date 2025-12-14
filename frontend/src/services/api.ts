import axios from 'axios';
import { LoginRequest, SignupRequest, CustomerSignupRequest, AuthResponse, Restaurant } from '../types/auth';

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
  // Owner authentication
  ownerLogin: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  ownerSignup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Customer authentication
  customerLogin: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/customer/auth/login', data);
    return response.data;
  },

  customerSignup: async (data: CustomerSignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/customer/auth/signup', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('owner');
    localStorage.removeItem('customer');
    localStorage.removeItem('userType');
  },
};

export const restaurantService = {
  getAllRestaurants: async (): Promise<Restaurant[]> => {
    const response = await api.get('/restaurants');
    return response.data;
  },

  getOpenRestaurants: async (): Promise<Restaurant[]> => {
    const response = await api.get('/restaurants/open');
    return response.data;
  },

  getRestaurantsByCuisine: async (cuisineType: string): Promise<Restaurant[]> => {
    const response = await api.get(`/restaurants/cuisine/${cuisineType}`);
    return response.data;
  },

  searchRestaurants: async (name: string): Promise<Restaurant[]> => {
    const response = await api.get(`/restaurants/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  // Owner restaurant management
  getMyRestaurant: async (ownerEmail: string): Promise<Restaurant | null> => {
    try {
      const response = await api.get(`/owner/restaurant?ownerEmail=${encodeURIComponent(ownerEmail)}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 204) {
        return null; // No restaurant found
      }
      throw error;
    }
  },

  createRestaurant: async (restaurantData: Partial<Restaurant>, ownerEmail: string): Promise<Restaurant> => {
    const response = await api.post(`/owner/restaurant?ownerEmail=${encodeURIComponent(ownerEmail)}`, restaurantData);
    return response.data;
  },

  updateRestaurant: async (restaurantData: Partial<Restaurant>, ownerEmail: string): Promise<Restaurant> => {
    const response = await api.put(`/owner/restaurant?ownerEmail=${encodeURIComponent(ownerEmail)}`, restaurantData);
    return response.data;
  },
};

export default api;