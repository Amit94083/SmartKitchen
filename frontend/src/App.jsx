import Orders from './components/Orders';
import Ownerorders from './components/Ownerorders';
import Cart from './components/Cart';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Inventory from './components/Inventory';
import Recipes from './components/Recipes';
import Suppliers from './components/Suppliers';
import RestaurantDetails from './components/RestaurantDetails';

import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import CustomerLogin from './components/CustomerLogin';
import CustomerSignup from './components/CustomerSignup';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Restaurant from './components/Restaurant';
import Checkout from './components/Checkout';
import OrderStatus from './components/OrderStatus';
import DeliveryDashboard from './components/DeliveryDashboard';
import DeliveryPartners from './components/DeliveryPartners';
import DeliveryOrders from './components/DeliveryOrders';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/';
    if (user?.userType === 'RESTAURANT_OWNER') return '/restaurant-dashboard';
    if (user?.userType === 'CUSTOMER') return '/home';
    return '/';
  };

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Owner */}
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Signup />} />
      <Route
        path="/restaurant-dashboard"
        element={
          <ProtectedRoute requiresOwner>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute requiresOwner>
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes"
        element={
          <ProtectedRoute requiresOwner>
            <Recipes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute requiresOwner>
            <Suppliers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant-details"
        element={
          <ProtectedRoute requiresOwner>
            <RestaurantDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/orders"
        element={
          <ProtectedRoute requiresOwner>
            <Ownerorders />
          </ProtectedRoute>
        }
      />

      {/* Customer */}
      <Route path="/customer/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <CustomerLogin />} />
      <Route path="/customer/signup" element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <CustomerSignup />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute requiresCustomer>
            <Home />
          </ProtectedRoute>
        }
      />



      <Route
        path="/cart"
        element={
          <ProtectedRoute requiresCustomer>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute requiresCustomer>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/:id"
        element={
          <ProtectedRoute requiresCustomer>
            <Restaurant />
          </ProtectedRoute>
        }
      />


      <Route
        path="/checkout"
        element={
          <ProtectedRoute requiresCustomer>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order/:orderId"
        element={
          <ProtectedRoute requiresCustomer>
            <OrderStatus />
          </ProtectedRoute>
        }
      />

      {/* Delivery Boy Dashboard */}
      <Route
        path="/delivery/dashboard"
        element={<DeliveryDashboard />}
      />
      
      {/* Delivery Partners */}
      <Route
        path="/delivery/partners"
        element={<DeliveryPartners />}
      />
      
      {/* Delivery Orders */}
      <Route
        path="/delivery/orders"
        element={<DeliveryOrders />}
      />

      {/* Profile Page */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
