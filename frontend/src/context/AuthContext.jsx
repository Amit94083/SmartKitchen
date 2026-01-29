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
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const clearStorageAndReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  const value = {
    user,
    token,
    login,
    logout,
    clearStorageAndReload,
    isAuthenticated: !!token && !!user,
    isCustomer: user?.userType === 'CUSTOMER',
    isRestaurantOwner: user?.userType === 'RESTAURANT_OWNER',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="text-center py-20">Loading...</div> : children}
    </AuthContext.Provider>
  );
};