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
  const [owner, setOwner] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedOwner = localStorage.getItem('owner');
    const storedCustomer = localStorage.getItem('customer');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedToken && storedUserType) {
      setToken(storedToken);
      setUserType(storedUserType);
      
      if (storedUserType === 'owner' && storedOwner) {
        setOwner(JSON.parse(storedOwner));
      } else if (storedUserType === 'customer' && storedCustomer) {
        setCustomer(JSON.parse(storedCustomer));
      }
    }
  }, []);

  const loginOwner = (newToken, newOwner) => {
    setToken(newToken);
    setOwner(newOwner);
    setCustomer(null);
    setUserType('owner');
    localStorage.setItem('token', newToken);
    localStorage.setItem('owner', JSON.stringify(newOwner));
    localStorage.setItem('userType', 'owner');
    localStorage.removeItem('customer');
  };

  const loginCustomer = (newToken, newCustomer) => {
    setToken(newToken);
    setCustomer(newCustomer);
    setOwner(null);
    setUserType('customer');
    localStorage.setItem('token', newToken);
    localStorage.setItem('customer', JSON.stringify(newCustomer));
    localStorage.setItem('userType', 'customer');
    localStorage.removeItem('owner');
  };

  const logout = () => {
    setToken(null);
    setOwner(null);
    setCustomer(null);
    setUserType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('owner');
    localStorage.removeItem('customer');
    localStorage.removeItem('userType');
  };

  const value = {
    owner,
    customer,
    token,
    userType,
    loginOwner,
    loginCustomer,
    logout,
    isAuthenticated: !!token && (!!owner || !!customer),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};