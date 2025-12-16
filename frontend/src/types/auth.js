// JavaScript version of TypeScript interfaces
// These are for documentation purposes - no runtime type checking in JavaScript

// Owner interface
export const OwnerType = {
  id: 'number',
  restaurantName: 'string',
  ownerName: 'string',
  email: 'string',
  phone: 'string (optional)',
  createdAt: 'string'
};

// Customer interface  
export const CustomerType = {
  id: 'number',
  name: 'string',
  email: 'string',
  phone: 'string (optional)',
  createdAt: 'string'
};

// Restaurant interface
export const RestaurantType = {
  id: 'number',
  name: 'string',
  description: 'string (optional)',
  address: 'string (optional)',
  phone: 'string (optional)',
  cuisineType: 'string (optional)',
  imageUrl: 'string (optional)',
  rating: 'number',
  isOpen: 'boolean',
  ownerName: 'string',
  createdAt: 'string'
};

// LoginRequest interface
export const LoginRequestType = {
  email: 'string',
  password: 'string'
};

// SignupRequest interface
export const SignupRequestType = {
  restaurantName: 'string',
  ownerName: 'string',
  email: 'string',
  password: 'string',
  phone: 'string (optional)'
};

// CustomerSignupRequest interface
export const CustomerSignupRequestType = {
  name: 'string',
  email: 'string',
  password: 'string',
  phone: 'string (optional)'
};

// AuthResponse interface
export const AuthResponseType = {
  token: 'string',
  owner: 'Owner (optional)',
  customer: 'Customer (optional)'
};

// Helper functions for creating objects with proper structure
export const createOwner = (data) => ({
  id: data.id,
  restaurantName: data.restaurantName,
  ownerName: data.ownerName,
  email: data.email,
  phone: data.phone || null,
  createdAt: data.createdAt
});

export const createCustomer = (data) => ({
  id: data.id,
  name: data.name,
  email: data.email,
  phone: data.phone || null,
  createdAt: data.createdAt
});

export const createRestaurant = (data) => ({
  id: data.id,
  name: data.name,
  description: data.description || null,
  address: data.address || null,
  phone: data.phone || null,
  cuisineType: data.cuisineType || null,
  imageUrl: data.imageUrl || null,
  rating: data.rating,
  isOpen: data.isOpen,
  ownerName: data.ownerName,
  createdAt: data.createdAt
});