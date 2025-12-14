import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import CustomerLogin from './components/CustomerLogin';
import CustomerSignup from './components/CustomerSignup';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/';
    return userType === 'owner' ? '/dashboard' : '/home';
  };

  return (
    <Routes>
      {/* Landing page */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <LandingPage />} 
      />

      {/* Restaurant Owner Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Signup />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiresOwner>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Customer Routes */}
      <Route 
        path="/customer/login" 
        element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <CustomerLogin />} 
      />
      <Route 
        path="/customer/signup" 
        element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <CustomerSignup />} 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute requiresCustomer>
            <Home />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
