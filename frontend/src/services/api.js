// Analytics Service
export const analyticsService = {
  getBestSellers: async (limit = 5) => {
    const response = await api.get(`/best-sellers?limit=${limit}`);
    return response.data;
  },
};

// Recipe Service
export const recipeService = {
  getAllRecipes: async () => {
    const response = await api.get('/recipes');
    return response.data;
  },
  getRecipesByMenuItem: async (menuItemId) => {
    const response = await api.get(`/recipes/menu-item/${menuItemId}`);
    return response.data;
  },
  createRecipe: async (recipeData) => {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  },
  createBatchRecipes: async (batchData) => {
    const response = await api.post('/recipes/batch', batchData);
    return response.data;
  },
  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },
  deleteRecipesByMenuItem: async (menuItemId) => {
    const response = await api.delete(`/recipes/menu-item/${menuItemId}`);
    return response.data;
  },
};

// Menu Service
export const menuService = {
  getAllMenuItems: async () => {
    const response = await api.get('/menu');
    return response.data;
  },
  createMenuItem: async (menuItemData) => {
    const response = await api.post('/menu', menuItemData);
    return response.data;
  },
  updateMenuItem: async (id, menuItemData) => {
    const response = await api.put(`/menu/${id}`, menuItemData);
    return response.data;
  },
};
// Ingredient Service
export const ingredientService = {
  getAllIngredients: async () => {
    const response = await api.get('/ingredients');
    return response.data;
  },
  createIngredient: async (ingredientData) => {
    const response = await api.post('/ingredients', ingredientData);
    return response.data;
  },
  updateIngredient: async (id, ingredientData) => {
    const response = await api.put(`/ingredients/${id}`, ingredientData);
    return response.data;
  },
};
export const orderService = {
  placeOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
  getMyOrders: async (userId) => {
    const response = await api.get(`/orders/my/${userId}`);
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
  acceptOrderAndUpdateInventory: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/update-inventory`);
    return response.data;
  },
  assignDeliveryPartner: async (orderId, partnerId) => {
    const response = await api.put(`/orders/${orderId}/assign-partner`, { partnerId });
    return response.data;
  },
};
export const cartService = {
  addToCart: async (userId, menuItemId, quantity = 1) => {
    const response = await api.post('/cart/add', {}, {
      params: { userId, menuItemId, quantity }
    });
    return response.data;
  },
  getCart: async (userId) => {
    const response = await api.get(`/cart/user/${userId}`);
    return response.data;
  },
  updateCartItem: async (userId, menuItemId, quantity) => {
    const response = await api.put('/cart/update', {}, {
      params: { userId, menuItemId, quantity }
    });
    return response.data;
  },
  removeFromCart: async (userId, menuItemId) => {
    const response = await api.delete('/cart/remove', {
      params: { userId, menuItemId }
    });
    return response.data;
  },
  clearCart: async (userId) => {
    const response = await api.delete('/cart/clear', {
      params: { userId }
    });
    return response.data;
  },
};
export const userService = {
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },
  getProfile: async (userId) => {
    const response = await api.get(`/user/profile/${userId}`);
    return response.data;
  },
  getAddresses: async (userId) => {
    const response = await api.get(`/user/${userId}/addresses`);
    return response.data;
  },
  addAddress: async (userId, addressData) => {
    const response = await api.post(`/user/${userId}/addresses`, addressData);
    return response.data;
  },
  getDeliveryPartners: async () => {
    const response = await api.get('/user/profile/by-type?userType=DELIVERY_PARTNER');
    return response.data;
  },
  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/user/profile/${userId}/status`, { isActive });
    return response.data;
  },
};
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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

  getUserById: async (userId) => {
    const response = await api.get(`/user/profile/${userId}`);
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