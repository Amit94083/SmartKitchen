export interface Owner {
  id: number;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  cuisineType?: string;
  imageUrl?: string;
  rating: number;
  isOpen: boolean;
  ownerName: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  restaurantName: string;
  ownerName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CustomerSignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  owner?: Owner;
  customer?: Customer;
}