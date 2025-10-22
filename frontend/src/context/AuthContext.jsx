import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, logout } from '../services/auth/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data?.user || null);
    } catch (err) {
      console.error('Auth refresh error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
