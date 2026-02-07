import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedTimestamp = localStorage.getItem('authTimestamp');
    
    if (storedToken && storedUser && storedTimestamp) {
      const now = new Date().getTime();
      const authTime = parseInt(storedTimestamp);
      const sixHoursInMs = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
      
      // Check if the stored data is still valid (within 6 hours)
      if (now - authTime < sixHoursInMs) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Data has expired, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('authTimestamp');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    const timestamp = new Date().getTime();
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('authTimestamp', timestamp.toString());
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authTimestamp');
  };

  const clearStorageAndReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/user/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        const timestamp = new Date().getTime();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('authTimestamp', timestamp.toString());
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    clearStorageAndReload,
    refreshUser,
    isAuthenticated: !!token && !!user,
    isCustomer: user?.userType === 'CUSTOMER',
    isRestaurantOwner: user?.userType === 'RESTAURANT_OWNER',
    isDeliveryPartner: user?.userType === 'DELIVERY_PARTNER',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="text-center py-20">Loading...</div> : children}
    </AuthContext.Provider>
  );
};