import { useEffect, useState, useCallback } from 'react';
import { login, logout, register, getCurrentUser } from '../services/auth/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const result = await getCurrentUser();
    setUser(result?.user || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = async (email, password) => {
    const user = await login(email, password);
    setUser(user);
  };

  const signUp = async (email, password) => await register(email, password);

  const signOut = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, signIn, signUp, signOut, refreshUser: fetchUser };
};
export default useAuth;
