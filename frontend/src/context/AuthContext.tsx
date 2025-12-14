import React, { createContext, useContext, useState, useEffect } from 'react';
import { Owner, Customer } from '../types/auth';

interface AuthContextType {
  owner: Owner | null;
  customer: Customer | null;
  token: string | null;
  userType: 'owner' | 'customer' | null;
  loginOwner: (token: string, owner: Owner) => void;
  loginCustomer: (token: string, customer: Customer) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [userType, setUserType] = useState<'owner' | 'customer' | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedOwner = localStorage.getItem('owner');
    const storedCustomer = localStorage.getItem('customer');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedToken && storedUserType) {
      setToken(storedToken);
      setUserType(storedUserType as 'owner' | 'customer');
      
      if (storedUserType === 'owner' && storedOwner) {
        setOwner(JSON.parse(storedOwner));
      } else if (storedUserType === 'customer' && storedCustomer) {
        setCustomer(JSON.parse(storedCustomer));
      }
    }
  }, []);

  const loginOwner = (newToken: string, newOwner: Owner) => {
    setToken(newToken);
    setOwner(newOwner);
    setCustomer(null);
    setUserType('owner');
    localStorage.setItem('token', newToken);
    localStorage.setItem('owner', JSON.stringify(newOwner));
    localStorage.setItem('userType', 'owner');
    localStorage.removeItem('customer');
  };

  const loginCustomer = (newToken: string, newCustomer: Customer) => {
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

  const value: AuthContextType = {
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